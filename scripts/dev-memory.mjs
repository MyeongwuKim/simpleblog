// scripts/dev-memory.mjs
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { spawn } from 'child_process';
import net from 'node:net';

let replset;
let serverProc;
let shuttingDown = false;
let boundPort = null;

async function start() {
   // ── 포트: 기본 4000 (자동증가 금지), --port 1234 로 직접 지정 가능
   const args = process.argv.slice(2);
   const idx = args.indexOf('--port');
   const port = idx !== -1 ? parseInt(args[idx + 1], 10) : 3000;
   boundPort = port;

   // 실행 전에 해당 포트 비우기 (강제 종료)
   await ensurePortFree(port);

   // ── 메모리 Mongo
   replset = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: 'wiredTiger' },
   });
   await replset.waitUntilRunning();

   const uri = replset.getUri('testdb');
   process.env.DATABASE_URL = uri;
   process.env.NEXT_TELEMETRY_DISABLED = '1';
   console.log('[mem] Mongo started:', uri);

   // ── Prisma push
   await run('npx', ['prisma', 'db', 'push', '--skip-generate'], {
      env: process.env,
   });
   await run('npx', ['tsx', 'prisma/seed.demo.ts'], { env: process.env });
   // ── Next dev (고정 포트로만; 실패 시 에러)
   await ensurePortFree(port); // push 중 새로 점유됐을 수도 있으니 한번 더
   const isWin = process.platform === 'win32';
   serverProc = spawn(
      isWin ? 'npx.cmd' : 'npx',
      ['next', 'dev', '-p', String(port)],
      {
         stdio: 'inherit',
         env: process.env,
         shell: isWin, // ✅ 윈도우에서는 shell:true
         detached: !isWin,
         cwd: process.cwd(),
      }
   );

   console.log(
      `[mem] Next.js dev on http://localhost:${port} (pid ${serverProc.pid})`
   );

   serverProc.on('close', async (code, sig) => {
      if (!shuttingDown) {
         console.log(`[mem] dev server closed (${code ?? ''} ${sig ?? ''})`);
         await cleanupOnce(0);
      }
   });

   const onSig = (name) => cleanupOnce(0, `[mem] ${name}`);
   process.once('SIGINT', () => onSig('SIGINT'));
   process.once('SIGTERM', () => onSig('SIGTERM'));
   process.once('SIGHUP', () => onSig('SIGHUP'));

   process.once('uncaughtException', async (e) => {
      console.error('[mem] uncaughtException:', e);
      await cleanupOnce(1);
   });
   process.once('unhandledRejection', async (e) => {
      console.error('[mem] unhandledRejection:', e);
      await cleanupOnce(1);
   });
}

async function cleanupOnce(exitCode = 0, reasonLog) {
   if (shuttingDown) return;
   shuttingDown = true;
   if (reasonLog) console.log(reasonLog);

   // dev server 종료
   await killProcessTree(serverProc);

   // 포트가 남아있으면 강제 종료
   if (boundPort) await ensurePortFree(boundPort);

   // Mongo 정리
   try {
      if (replset) {
         await replset.stop();
         console.log('[mem] Mongo stopped (memory cleared).');
      }
   } catch (e) {
      console.error('[mem] replset stop error:', e);
   }

   setTimeout(() => process.exit(exitCode), 120);
}

function run(cmd, args, opts) {
   return new Promise((resolve, reject) => {
      const ps = spawn(cmd, args, {
         stdio: 'inherit',
         env: opts?.env || process.env,
         shell: process.platform === 'win32', // ✅ 여기서만 shell:true
      });
      ps.on('exit', (code) =>
         code === 0
            ? resolve()
            : reject(new Error(`${cmd} ${args.join(' ')} failed (${code})`))
      );
   });
}
async function ensurePortFree(port) {
   // IPv4/IPv6 둘 다 점유 체크
   if (!(await isPortInUse(port))) return;
   console.log(`[mem] port ${port} in use → killing...`);
   await killByPort(port);
   await delay(200);
   if (await isPortInUse(port)) {
      throw new Error(`[mem] port ${port} still in use after kill. Abort.`);
   }
}

function delay(ms) {
   return new Promise((res) => setTimeout(res, ms));
}

function isPortInUse(port) {
   function tryBind(host) {
      return new Promise((resolve) => {
         const srv = net.createServer();
         srv.once('error', () => resolve(true)); // 사용 중
         srv.once('listening', () => srv.close(() => resolve(false))); // 비어있음
         srv.listen(port, host);
      });
   }
   return Promise.all([tryBind('127.0.0.1'), tryBind('::')]).then((arr) =>
      arr.some((inUse) => inUse)
   );
}

async function killByPort(port) {
   if (process.platform === 'win32') {
      // 윈도우: netstat로 PID 찾고 taskkill
      return new Promise((resolve) => {
         const ps = spawn('netstat', ['-ano'], {
            stdio: ['ignore', 'pipe', 'ignore'],
         });
         let output = '';
         ps.stdout.on('data', (chunk) => (output += chunk.toString()));
         ps.on('close', async () => {
            const lines = output.split('\n');
            const pids = lines
               .filter((line) => line.includes(`:${port}`))
               .map((line) => line.trim().split(/\s+/).pop())
               .filter(Boolean);
            if (pids.length) {
               await Promise.all(
                  pids.map((pid) => run('taskkill', ['/PID', pid, '/T', '/F']))
               );
            }
            resolve();
         });
      });
   } else {
      // mac/Linux: 기존 lsof + kill
      const pids = await getPidsByPort(port);
      if (pids.length === 0) return;
      await Promise.all(pids.map((pid) => run('kill', ['-9', String(pid)])));
   }
}
function getPidsByPort(port) {
   return new Promise((resolve) => {
      const ps = spawn('lsof', ['-t', `-i:${port}`], {
         stdio: ['ignore', 'pipe', 'ignore'],
      });
      let data = '';
      ps.stdout.on('data', (chunk) => {
         data += chunk.toString();
      });
      ps.on('close', () => {
         const pids = data
            .split(/\s+/)
            .map((s) => s.trim())
            .filter(Boolean)
            .map(Number);
         resolve(pids);
      });
   });
}

// 유닉스: 프로세스 그룹 kill → 실패 시 단일 PID
async function killProcessTree(child) {
   const isWin = process.platform === 'win32';
   try {
      if (child && child.pid) {
         if (!isWin) {
            try {
               process.kill(-child.pid, 'SIGTERM');
            } catch {
               try {
                  process.kill(child.pid, 'SIGTERM');
               } catch {}
            }
         } else {
            await run('taskkill', ['/PID', String(child.pid), '/T', '/F']);
         }
      }
   } catch {}
   await delay(300);
}

start().catch(async (e) => {
   console.error('[mem] failed:', e);
   await cleanupOnce(1);
});

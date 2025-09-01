import { TextEncoder, TextDecoder } from "util";
import { TransformStream, ReadableStream } from "stream/web";
import { BroadcastChannel } from "worker_threads";

// 전역에 강제 주입
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder as any;
(global as any).TransformStream = TransformStream;
(global as any).ReadableStream = ReadableStream;
(global as any).BroadcastChannel = BroadcastChannel;

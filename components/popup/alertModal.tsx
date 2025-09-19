import { AnimatePresence, motion } from "framer-motion";
import DefButton from "../ui/buttons/defButton";

interface AlertModalProps {
  msg: string;
  title?: string;
  btnMsg: string[];
  onClose: (value: number) => void;
  show?: boolean; // 외부에서 제어 (modalItems 배열 쓰면 없어도 됨)
}

export default function AlertModal({
  msg,
  btnMsg,
  title,
  onClose,
  show = true,
}: AlertModalProps) {
  return (
    <AnimatePresence>
      {show && (
        // 🟢 배경 (fade in/out)
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99] flex items-center justify-center 
                     dark:bg-[rgba(0,0,0,0.85)] bg-[rgba(249,249,249,0.85)]"
        >
          {/* 🟢 모달 컨텐츠 (위에서 떨어지는 모션) */}
          <motion.div
            key="content"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="dark:bg-background1 bg-background1 rounded-md shadow-lg w-[28rem] max-w-full"
          >
            {/* 헤더 */}
            <div className="flex justify-end px-4 pt-3">
              {/* 닫기 버튼 넣고 싶으면 여기 */}
            </div>

            {/* 바디 */}
            <div className="px-6 pb-6">
              <div className="mb-10 flex flex-col gap-4 mt-4">
                {title && (
                  <h3 className="text-xl font-bold text-text1">{title}</h3>
                )}
                <div className="text-text2 text-base">{msg}</div>
              </div>

              {/* 버튼 */}
              <div className="flex justify-end gap-4">
                <DefButton
                  className={`h-11 hover:bg-bg-page3 text-cyan-500 ${
                    btnMsg[0].length <= 0 && "invisible"
                  }`}
                  btnColor="black"
                  innerItem={btnMsg[0]}
                  onClickEvt={() => onClose(0)}
                />
                <DefButton
                  className={`text-button1 h-11 ${
                    btnMsg[1].length <= 0 && "invisible"
                  }`}
                  btnColor="cyan"
                  innerItem={btnMsg[1]}
                  onClickEvt={() => onClose(1)}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

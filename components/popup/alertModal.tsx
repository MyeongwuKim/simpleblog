import { ReactNode } from "react";

interface AlertModalProps {
  msg: string;
  title?: string;
  btnMsg: string[];
  onClose: (value: unknown) => void;
}

import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import DefButton from "../ui/buttons/defButton";

export function AlertModal({ msg, btnMsg, title, onClose }: AlertModalProps) {
  return (
    <>
      <Modal
        id="alert-modal"
        applyTheme={{
          header: { close: "replace" },
          content: {
            inner: "merge",
          },
          root: {
            show: {
              on: "merge",
            },
          },
        }}
        theme={{
          root: {
            show: {
              on: "dark:bg-[rgba(0,0,0,0.85)] bg-[rgba(249,249,249,0.85)]",
            },
          },
          content: {
            inner: "dark:bg-background1 bg-background1 rounded-md",
          },
          header: {
            close: { base: "hidden" },
          },
        }}
        popup
        show={true}
        size="md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="">
            <div className="mb-10 flex flex-col gap-4 mt-4">
              {title && (
                <h3 className="text-xl  font-bold text-text1 ">포스트 삭제</h3>
              )}
              <div className="text-text2 text-base">{msg}</div>
            </div>

            <div className="flex justify-end gap-4">
              <div className={`h-11 ${btnMsg[0].length <= 0 && "invisible"}`}>
                <DefButton
                  style={{
                    color: "black",
                    textColor: "text-cyan-500",
                    noBg: true,
                  }}
                  content={btnMsg[0]}
                  onClickEvt={() => onClose(0)}
                />
              </div>
              <div className={`h-11 ${btnMsg[1].length <= 0 && "invisible"}`}>
                <DefButton
                  style={{ color: "cyan", noBg: false }}
                  content={btnMsg[1]}
                  onClickEvt={() => onClose(1)}
                />
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
export default AlertModal;

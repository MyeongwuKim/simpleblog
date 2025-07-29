'use client'
import ReactMD from "@/components/write/reactMD";
import DefButton from "../buttons/defButton";
import { useState } from "react";
import { TextAreaField } from "../input/textAreaField";

export default function IntroForm(){
    const [isModify,setIsModify] = useState<boolean>(false);
    return <div className="w-full h-full">
       <div className="w-full  h-[45px] relative mb-4">
       <div className="w-[120px] h-full  absolute right-0">
                  <DefButton
                    type="submit"
                    style={{ color: "cyan", noBg: false, textSize: "text-base" }}
                    content={isModify ? '수정 완료' : '소개 작성'}
                    onClickEvt={() => setIsModify(!isModify)}
                  />
                </div>
       </div>
       {isModify ?    <div className="h-[300px]">
        <TextAreaField placeholder="" />
      </div> :         <ReactMD doc="# sdfajksdfjasd <br>
        # dfjaksdfj s <br>
        # dfjaksdf jasdkfjasdkfasdjfkasdfjkasdfj
        # dfjaksdf jasdkfjasdkfasdjfkasdfjkasdfj<br>
         # dfjaksdf jasdkfjasdkfasdjfkasdfjkasdfj<br>
          # dfjaksdf jasdkfjasdkfasdjfkasdfjkasdfj<br>
           # dfjaksdf jasdkfjasdkfasdjfkasdfjkasdfj<br>
            # dfjaksdf jasdkfjasdkfasdjfkasdfjkasdfj<br>
             # dfjaksdf jasdkfjasdkfasdjfkasdfjkasdfj<br>
              # dfjaksdf jasdkfjasdkfasdjfkasdfjkasdfj<br>
               # dfjaksdf jasdkfjasdkfasdjfkasdfjkasdfj<br>"/>
               }


            
    </div>
}
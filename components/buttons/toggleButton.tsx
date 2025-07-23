'use client'
interface ToggleButtonType {
    checkIcon:ReactNode;
    unCheckIcon:ReactNode;
    isCheck:boolean;
    clickCallback:(state:boolean)=>void;
}
import { ReactNode, useEffect, useState } from "react";


export default function ToggleButton({checkIcon,unCheckIcon,isCheck,clickCallback}:ToggleButtonType){
    const [checked, setChecked ] = useState<boolean>(isCheck)

    return <button 
    onClick={()=>{
        setChecked((prev)=>{
            if(clickCallback)  clickCallback(!prev)
            return !prev
        })
    }}
    className="w-full h-full hover:bg-background3
    border-none rounded-lg cursor-pointer flex items-center justify-center  text-text1">
       {checked ? checkIcon : unCheckIcon }
    </button>
}
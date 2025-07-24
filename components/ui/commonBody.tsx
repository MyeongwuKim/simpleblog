'use client'
import { usePathname } from "next/navigation";
import Head from "./Head";

type CommonBodyType ={
    children:React.ReactNode
}
export default function CommonBody({children}:CommonBodyType){
    const pathname = usePathname(); // 현재 경로명 (예: /blog/post-1)
    console.log(pathname)
    return (
    <div className="w-full h-full overflow-auto absolute left-0 top-0 dark:bg-black bg-gray-100 p-8">
    {pathname.includes("/write")? <div className="w-full h-full" >{children}</div> : (<>
        <div className="w-full h-[60px] top-0 left-0 px-8 absolute">
          <Head />
        </div>
        <div className="w-full relative mt-[60px] h-auto">{children}</div></>)}    
      </div>
    )
}
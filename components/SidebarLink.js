import React from 'react'
import { useRecoilState } from 'recoil';
import { activeState } from '../Atom/activeAtom';

function SidebarLink({Icon,text}) {
  const[active,setActive]=useRecoilState(activeState);
  return (
    <div className={`h-12 text-[#d9d9d9] flex items-center justify-center xl:justify-start text-xl space-y-0 space-x-3 hoverAnimation ${active == text && ' font-bold bg-gray-100 bg-opacity-10'} `}>
         <Icon className='h-7 '/>
         <span className='hidden xl:inline'>{text}</span>
    </div>
  )
}

export default SidebarLink
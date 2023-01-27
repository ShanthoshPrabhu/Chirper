import React from 'react'

function SidebarLink({Icon,text,active}) {
  return (
    <div className={`h-12 text-[#d9d9d9] flex items-center justify-center xl:justify-start text-xl space-y-0 space-x-3 hoverAnimation ${active && ' font-bold'} `}>
         <Icon className='h-7'/>
         <span className='hidden xl:inline'>{text}</span>
    </div>
  )
}

export default SidebarLink
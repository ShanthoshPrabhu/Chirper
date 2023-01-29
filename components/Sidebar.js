import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { HomeIcon } from "@heroicons/react/solid";
import {
    HashtagIcon,
    BellIcon,
    InboxIcon,
    BookmarkIcon,
    ClipboardListIcon,
    UserIcon,
    DotsCircleHorizontalIcon,
    DotsHorizontalIcon,
  } from "@heroicons/react/outline";
import SidebarLink from './SidebarLink';
import { signOut, useSession } from 'next-auth/react';
import { useRecoilState } from 'recoil';
import { activeState } from '../Atom/activeAtom';



function Sidebar() {
  const { data: session } = useSession();
  const[user,setUser]=useState([]);
  const[active,setActive]=useRecoilState(activeState);
  useEffect(() => {
   const uservalue= window.localStorage.getItem('user')
   const val = JSON.parse(uservalue);
    setUser(val);
  }, [])
  
  // console.log('ses',session)
  return (
    <div className="hidden sm:flex flex-col items-center xl:w-[320px] p-2 fixed h-full">
      {/* <div className="flex items-center justify-center w-12 h-12 hoverAnimation p-0 xl:ml-24">
        <Image src="https://rb.gy/ogau5a" width={30} height={30} alt=''/>
      </div> */}
      <div className=' space-y-2.5 mt-4 mb-2.5 '>
        <div onClick={()=>setActive('Home')}>
          <SidebarLink text="Home" Icon={HomeIcon} active />
        </div>
        {/* <SidebarLink text="Explore" Icon={HashtagIcon} /> */}
        <div onClick={()=>setActive('Bookmarks')}>
          <SidebarLink text="Bookmarks" Icon={BookmarkIcon}  />
        </div>
        {/* <div onClick={()=>setActive('Lists')}>
          <SidebarLink text="Lists" Icon={ClipboardListIcon} />
        </div> */}
        <div onClick={()=>setActive('Profile')}>
          <SidebarLink text="Profile" Icon={UserIcon} />
        </div>
      </div>
      <button className="hidden xl:inline bg-[#1d9bf0] text-white rounded-full w-48 h-[52px] text-lg font-bold shadow-md hover:bg-[#0e527f] mt-4 ">
        Tweet
      </button>
      <div
        className="text-[#d9d9d9] flex items-center justify-center mt-auto hoverAnimation  xl:ml-auto xl:-mr-5 w-[100%]"
        onClick={signOut}
      >
        <img
          src={user?.image}
          alt=""
          className="h-10 w-10 rounded-full xl:mr-2.5"
        />
        <div className="hidden xl:inline leading-5">
          <h4 className="font-bold">{user?.name}</h4>
          <p className="text-[#6e767d]">@{user?.tag}</p>
        </div>
        <DotsHorizontalIcon className="h-5 hidden xl:inline ml-10" />
      </div>
    </div>
  )
}

export default Sidebar
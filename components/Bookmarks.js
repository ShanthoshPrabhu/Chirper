import React from 'react'
import { useRecoilState } from 'recoil';
import { userState } from '../Atom/userAtom';

function Bookmarks() {
    const[user,setUser]=useRecoilState(userState);
  return (
    <div className=' text-white flex-grow border-l border-r border-gray-700 max-w-[750px] sm:ml-[73px] xl:ml-[370px]'>Bookmarks</div>
  )
}

export default Bookmarks
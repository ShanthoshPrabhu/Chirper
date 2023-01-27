import React, { useState } from 'react'
import { useRecoilState } from 'recoil';
import { userState } from '../Atom/modalAtom';

function Profile() {
  const[user,setUser]=useRecoilState(userState);
  console.log('userrr',user)
  return (
    <div className=' text-white flex-grow border-l border-r border-gray-700 max-w-[750px] sm:ml-[73px] xl:ml-[370px]'>
       <div className='flex mb-2 ml-3'>
          <div className='mt-1'>x</div>
          <div className='flex flex-col ml-5'>
              <div className=' text-white font-bold'>{user?.name}</div>
              <div className=' text-sm'>0 tweets</div>
          </div>
       </div>
       <div className='bg-white'>
       <img
          src='https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg'
          alt=""
          className="w-full max-h-60 object-cover"
        />
       </div>
       <div className='absolute top-[220px] ml-6'>
       <img src='https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg' alt='' className='w-[160px] h-[160px] rounded-full border-4'/>
       </div>
       <div className='ml-10'>
          <div className='flex justify-end'>
            <button className=' pb-2 pt-2 px-3 font-semibold rounded-full border-[1px] mr-5 mt-6'>Edit profile</button>
          </div>
          <div className='mt-8 font-bold text-lg'>{user?.name}</div>
          <div className='mt-0.5'>@{user?.tag}</div>
          <div className='mt-1'>Date joined</div>
          <div className='mt-4'>heyy there Im yourbio</div>
          <div className='flex mt-4'>
            <div className=' '>23 Followers</div>
            <div className=' ml-3'>123 Folllowing</div>
          </div>
       </div>
    </div>
  )
}

export default Profile
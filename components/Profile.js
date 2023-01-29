import { addDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react'
import Moment from 'react-moment';
import { db, storage } from '../firebase';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XIcon } from '@heroicons/react/outline';
import { async } from '@firebase/util';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { userState } from '../Atom/userAtom';
import { useRecoilState } from 'recoil';

function Profile() {
  const[user,setUser]=useRecoilState(userState);
  const { data: session } = useSession();
  let [isOpen, setIsOpen] = useState(false);
  const[cover,setCover]=useState(null);
  const[profile,setProfile]=useState(null);
  const[name,setName]=useState('');
  const[bio,setBio]=useState('');
  const[location,setLocation]=useState('');
  const nameRef = useRef();
  const bioRef = useRef();
  const locationRef = useRef();
  const profileRef = useRef();
  const coverRef=useRef();
  const moment = require('moment')
 
  const momentTimestamp = moment.unix(user?.timestamp?.seconds);
  const monthAndYear = momentTimestamp.format("MMMM YYYY");
  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setName(user?.name);
    setBio(user?.bio);
    setLocation(user?.location);
    setCover(user?.coverimage);
    setProfile(user?.image);
    setIsOpen(true);
  }

  function updateProfilePic (e) {
    const reader = new FileReader();
   console.log(e)
   if (e.target.files[0]) {
    reader.readAsDataURL(e.target.files[0]);
  }
  console.log('red',reader)
  reader.onload = (readerEvent) => {
    setProfile(readerEvent.target.result)
  }
  // console.log(selectedFile)
}

function updateCover (e) {
  const reader = new FileReader();
 console.log(e)
 if (e.target.files[0]) {
  reader.readAsDataURL(e.target.files[0]);
}
console.log('red',reader)
reader.onload = (readerEvent) => {
  setCover(readerEvent.target.result)
  console.log('cover',cover)
}
// console.log(selectedFile)
} 

    async function updateProfile(){
      const newArray ={};

      if(name && name != user?.name){
        Object.assign(newArray,{name:name})
      }
      if(bio && bio != user?.bio){
        Object.assign(newArray,{bio:bio})
      }
      if(location && name != user?.location){
        Object.assign(newArray,{location:location})
      }
      console.log('n',newArray)
      if(newArray){
        await updateDoc(doc(db, "users", user?.userId), newArray);
      }
      setIsOpen(false)
      // const profImageRef = ref(storage, `users/${user?.userId}/image`);
      //  if (profile) {
      //   await uploadString(profImageRef,profile, "data_url").then(async () => {
      //     const downloadURL = await getDownloadURL(profImageRef);
      //     await updateDoc(doc(db, "users", user?.userId), {
      //       image: downloadURL,
      //     });
      //   });
      // }

      // const coverImageRef = ref(storage, `users/${user?.userId}/image`);
      // if (cover) {
      //     await uploadString(coverImageRef, cover, "data_url").then(async () => {
      //       const downloadURL = await getDownloadURL(coverImageRef);
      //       await updateDoc(doc(db, "users",user?.userId ), {
      //         coverimage: downloadURL,
      //       });
      //     });
      //   }
        
    }
    
  //<Moment fromNow>{user?.timestamp?.toDate()}</Moment>
  return (
    <div className=' text-white flex-grow border-l border-r border-gray-700 max-w-[750px] sm:ml-[73px] xl:ml-[370px]'>
       {/* <div className='flex mb-2 ml-3'>
          <div className='mt-1 text-2xl'>x</div>
          <div className='flex flex-col ml-5'>
              <div className=' text-white font-bold'>{user?.name}</div>
          </div>
       </div> */}
       <div className=' border-b border-gray-50 border-opacity-40'>
       <img
          src={user?.coverimage ? user?.coverimage:'https://w0.peakpx.com/wallpaper/410/412/HD-wallpaper-plain-black-black.jpg'}
          alt=""
          className="w-full max-h-60 object-cover"
        />
       </div>
       <div className='absolute top-[160px] ml-6'>
       <img src={user?.image ? user?.image :'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='} alt='' className='w-[160px] h-[160px] object-cover rounded-full border-2'/>
       </div>
       <div className='ml-10'>
          <div className='flex justify-end'>
            <button className=' pb-2 pt-2 px-3 font-semibold rounded-full border-[1px] mr-5 mt-6' onClick={openModal}>Edit profile</button>
          </div>
         <div className=' flex flex-col mt-5'>
          <div className='mt-4 font-bold text-lg'>{user?.name}</div>
            <div className='mt-0.5'>@{user?.tag}</div>
            <div className='mt-1'>
              Joined {monthAndYear}
            </div>
            <div className='mt-4'>{user?.bio}</div>
            <div className='flex mt-4'>
              <div className=' '>23 Followers</div>
              <div className=' ml-3'>123 Folllowing</div>
            </div>
         </div>
       </div>
       <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div  className="inline-block align-bottom bg-black pb-24 rounded-2xl text-left overflow-y-auto shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                    <div className=' flex justify-between text-lg p-3'>
                        <div className=' flex'>
                          <div
                            className="hoverAnimation w-9 h-9  ml-2 items-center justify-center xl:px-0"
                            onClick={closeModal}
                          >
                            <XIcon className="h-[22px] text-white" />
                          </div>
                          <div className=' ml-3 text-white font-semibold'>
                            Edit profile
                          </div>
                        </div>
                        <button className=' px-4 pt-0 rounded-full h-8 text-sm font-semibold bg-white text-black' onClick={updateProfile}>Save</button>
                    </div>
                    <div className=' relative'>
                    <img
                      src={cover?cover:'https://w0.peakpx.com/wallpaper/410/412/HD-wallpaper-plain-black-black.jpg'}
                      alt=""
                      className="w-full max-h-60 object-cover"
                    onClick={()=>coverRef.current.click()}/>
                    <input type='file' hidden ref={coverRef} onChange={e=>updateCover(e)} />
                     <img src={profile?profile:'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='} onClick={()=>profileRef.current.click()} alt='' className='w-[150px] h-[150px] object-cover rounded-full absolute -bottom-16 border-2'/>
                     <input type='file' hidden ref={profileRef} onChange={e=>updateProfilePic(e)} />
                    </div>
                    <div className=' flex flex-col items-center mt-20'>
                      <div className=' p-2 flex w-[92%] my-5 flex-col rounded-lg border-[1px] cursor-pointer border-opacity-30 border-gray-50' onClick={()=>nameRef.current.focus()}>
                        <span className='opacity-30  text-sm text-gray-100'>Name</span>
                        <input type='text' value={name} className='text-base px-2 bg-black text-white outline-none ' onChange={e=>setName(e.target.value)}  ref={nameRef}/>
                      </div>
                      <div className=' p-2 flex w-[92%] my-5 flex-col cursor-pointer rounded-lg border-[1px] border-opacity-30 border-gray-50'onClick={()=>bioRef.current.focus()}>
                        <span className=' text-sm opacity-30 text-gray-100'>Bio</span>
                      <textarea  className=' min-h-[80px] text-base px-2 bg-black  text-white outline-none scrollbar-hide' value={bio} onChange={e=>setBio(e.target.value)} ref={bioRef}/>
                      </div>
                      <div className='  p-2 flex w-[92%] my-5 flex-col cursor-pointer rounded-lg border-[1px] border-opacity-30 border-gray-50' onClick={()=>locationRef.current.focus()}>
                        <span className=' text-sm opacity-30 text-gray-100 mb-3'>Location</span>
                        <input  type='text' className='text-base px-2 bg-black  text-white outline-none ' value={location} onChange={e=>setLocation(e.target.value)} ref={locationRef}/>
                      </div>
                    </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default Profile



import { collection, getDocs } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react'
import Moment from 'react-moment';
import { db } from '../firebase';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XIcon } from '@heroicons/react/outline';

function Profile() {
  const[user,setUser]=useState([]);
  const { data: session } = useSession();
  let [isOpen, setIsOpen] = useState(true);
  const nameRef = useRef();
  const bioRef = useRef();
  const locationRef = useRef();

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  
  useEffect(() => {
    getUsers();
  }, [])
  

  async function getUsers(){
    const userRef = collection(db, "users",);
    
    getDocs(userRef).then((snapshot)=>{
      // console.log('snapshot.docs',snapshot.docs)
      let value=[]
      snapshot.docs.forEach((doc)=>{
        value.push({...doc.data(),id:doc.id})
      })
      // console.log('value',value)
      const usercheck = value?.filter(filteredusers =>filteredusers.email.includes(`${session?.user?.email}`))
      // console.log('check',usercheck)
     if(usercheck[0]){
      // console.log('success')
      console.log('usercheck[0]',usercheck[0])
      if(window.localStorage.getItem('user')){
        window.localStorage.removeItem('user');
      } else {
        window.localStorage.setItem('user',JSON.stringify(usercheck[0]))
      }
      return setUser(usercheck[0]);
     }  
    })
    
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
       <div className='bg-white'>
       <img
          src='https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg'
          alt=""
          className="w-full max-h-60 object-cover"
        />
       </div>
       <div className='absolute top-[160px] ml-6'>
       <img src='https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg' alt='' className='w-[160px] h-[160px] object-cover rounded-full border-2'/>
       </div>
       <div className='ml-10'>
          <div className='flex justify-end'>
            <button className=' pb-2 pt-2 px-3 font-semibold rounded-full border-[1px] mr-5 mt-6' onClick={openModal}>Edit profile</button>
          </div>
         <div className=' flex flex-col mt-5'>
          <div className='mt-4 font-bold text-lg'>{user?.name}</div>
            <div className='mt-0.5'>@{user?.tag}</div>
            <div className='mt-1'>
              <Moment fromNow>{user?.timestamp?.toDate()}</Moment>
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
                          >
                            <XIcon className="h-[22px] text-white" />
                          </div>
                          <div className=' ml-3 text-white font-semibold'>
                            Edit profile
                          </div>
                        </div>
                        <div className=' p-2 font-semibold w-[60px] flex justify-center items-center h-[30px] bg-white text-black rounded-full'>Save</div>
                    </div>
                    <div className=' relative'>
                    <img
                      src='https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg'
                      alt=""
                      className="w-full max-h-60 object-cover"
                    />
                     <img src='https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg' alt='' className='w-[150px] h-[150px] object-cover rounded-full absolute bottom-10 border-2'/>
                    </div>
                    <div className=' flex flex-col items-center'>
                      <div className=' p-2 flex w-[95%] my-5 flex-col rounded-lg border-[1px] border-opacity-30 border-gray-50' onClick={()=>nameRef.current.focus()}>
                        <span className='opacity-30  text-sm text-gray-100'>Name</span>
                        <input type='text' className='text-base px-2 bg-black  text-white outline-none '/>
                      </div>
                      <div className=' p-2 flex w-[95%] my-5 flex-col rounded-lg border-[1px] border-opacity-30 border-gray-50'onClick={()=>bioRef.current.focus()}>
                        <span className=' text-sm opacity-30 text-gray-100'>Bio</span>
                      <textarea className=' min-h-[80px] text-base px-2 bg-black  text-white outline-none scrollbar-hide'/>
                      </div>
                      <div className='  p-2 flex w-[95%] my-5 flex-col rounded-lg border-[1px] border-opacity-30 border-gray-50' onClick={()=>locationRef.current.focus()}>
                        <span className=' text-sm opacity-30 text-gray-100 mb-3'>Location</span>
                        <input type='text' className='text-base px-2 bg-black  text-white outline-none '/>
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





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
import { userState } from '../Atom/userAtom';
import { useRouter } from 'next/router';
import { Dialog, Transition } from '@headlessui/react'
import { Popover} from '@headlessui/react'
import { Fragment } from 'react'
import Input from './Input';
import { createState } from '../Atom/createAtom';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function Sidebar() {
  const { data: session } = useSession();
  const[user,setUser]=useRecoilState(userState);
  const[active,setActive]=useRecoilState(activeState);
  const router = useRouter();
  const [create,setCreate]=useRecoilState(createState);

  let [isLogOpen, setIsLogOpen] = useState(false)


  if(user.length === 0){
    getUsers()
    return
  }

  function closeModal() {
    setCreate(false)
  }

  function openModal() {
   setCreate(true)
  }


  function closeLogModal() {
    setIsLogOpen(false)
  }

  function openLogModal() {
    setIsLogOpen(true)
  }
  async function getUsers(){
    const userRef = collection(db, "users");
    
    getDocs(userRef).then((snapshot)=>{
      // console.log('snapshot.docs',snapshot.docs)
      let value=[]
      snapshot.docs.forEach((doc)=>{
        value.push({...doc.data(),userId:doc.id})
      })
      // console.log('value',value)
      const usercheck = value?.filter(filteredusers =>filteredusers?.email == session?.user?.email)
      console.log('check',usercheck)
      if(usercheck.length === 0){
        addUser()
        return
      }
     if(usercheck && usercheck[0]){
      // console.log('success')
      // console.log('usercheck[0]',usercheck[0])
    //  console.log()
      return setUser(usercheck[0]);
     } 
    })
    
   }


   async function addUser(){
    if(!session){ 
      return
    } else {
       await addDoc(collection(db, "users"), {  
        image:session?.user?.image,
        name:session?.user.name,
        tag:session?.user.tag,
        id:session?.user.uid,
        email:session?.user?.email,
        timestamp: serverTimestamp(),
        location:'',
        bio:'',
        following:[],
        followers:[],
        bookmarks:[],
        coverimage:''
    });
    getUsers();
    return
    }
  }

  // console.log('user',user)
  console.log('user?.name',user?.name)
  // console.log('ses',session)
  return (
    <div className=" flex sm:flex flex-col items-center xl:w-[320px]  fixed h-full">
      {/* <div className="flex items-center justify-center text-[#ff9933] w-12 h-12 hoverAnimation p-0 xl:ml-24">
        <Image src="https://rb.gy/ogau5a" width={30} height={30} alt=''/>
        Chirper
      </div> */}
      <div className=' space-y-2.5 mt-4 mb-2.5 '>
        <div onClick={()=>{
          router.push('/')
          setActive('Home')}}>
          <SidebarLink text="Home" Icon={HomeIcon} active />
        </div>
        {/* <SidebarLink text="Explore" Icon={HashtagIcon} /> */}
        <div onClick={()=>{
          router.push('/');
          setActive('Bookmarks')}}>
          <SidebarLink text="Bookmarks" Icon={BookmarkIcon}  />
        </div>
        {/* <div onClick={()=>setActive('Lists')}>
          <SidebarLink text="Lists" Icon={ClipboardListIcon} />
        </div> */}
        <div onClick={()=>{
          router.push('/')
          setActive('Profile')
          }}>
          <SidebarLink text="Profile" Icon={UserIcon} />
        </div>
      </div>
      <button className="hidden lg:inline bg-[#ff9933] text-white rounded-full w-48 h-[52px] text-lg font-bold shadow-md hover:bg-[#cd8c4b] mt-4 " onClick={openModal}>
        Create
      </button>
      <Transition appear show={create} as={Fragment}>
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-y-auto scrollbar-hide h-[500px] rounded-2xl bg-black p-6 text-left align-middle shadow-xl transition-all ">
                  {/* <div className=' text-white flex-grow border-l border-r border-gray-700 xl:w-[750px] max-w-[750px] '>
                   
                  </div> */}
                  <Input/>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div
        className="text-[#d9d9d9] flex items-center justify-center mt-auto hoverAnimation  xl:ml-auto xl:-mr-5 w-[100%]"
        onClick={openLogModal}
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
      <Transition appear show={isLogOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeLogModal}>
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-[#5b7083] bg-opacity-25 transition-opacity" />
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
                        <div className='  w-[300px] space-y-4 bg-black rounded-lg border-gray-100 h-[120px] p-3 py-4 '>
                          <div className=' text-white font-medium text-lg mt-[10px] text-opacity-90 '>
                             Logout from your account?
                          </div>
                          <div className='flex justify-around mt-5'>
                          <div><button className=' px-2 py-1 bg-gray-200 bg-opacity-20 rounded-lg text-opacity-70 text-white font-semibold' onClick={(e)=>{
                                e.stopPropagation();
                                closeLogModal()
                              }}>Cancel</button></div>
                              <div><button className='px-2 py-1 rounded-lg text-opacity-80 text-black bg-[#cd8c4b] font-medium' onClick={(e) => {
                              e.stopPropagation();
                              signOut()
                              closeLogModal()
                              router.push("/");
                              }}>Confirm</button></div>
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

export default Sidebar







// className={`
//                 ${open ? '' : 'text-opacity-90'}
//                 group inline-flex items-center rounded-md bg-orange-700 px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
           

// export function Example() {
//   return (
//     <div className="fixed top-16 w-full max-w-sm px-4">
//       <Popover className="relative">
//         {({ open }) => (
//           <>
//             <Popover.Button
//                >
//              <div
//                 className="text-[#d9d9d9] flex items-center justify-center mt-auto hoverAnimation  xl:ml-auto xl:-mr-5 w-[100%]"
//               >
//                 <img
//                   src={user?.image}
//                   alt=""
//                   className="h-10 w-10 rounded-full xl:mr-2.5"
//                 />
//                 <div className="hidden xl:inline leading-5">
//                   <h4 className="font-bold">{user?.name}</h4>
//                   <p className="text-[#6e767d]">@{user?.tag}</p>
//                 </div>
//                 <DotsHorizontalIcon className="h-5 hidden xl:inline ml-10" />
//               </div>
//             </Popover.Button>
//             <Transition
//               as={Fragment}
//               enter="transition ease-out duration-200"
//               enterFrom="opacity-0 translate-y-1"
//               enterTo="opacity-100 translate-y-0"
//               leave="transition ease-in duration-150"
//               leaveFrom="opacity-100 translate-y-0"
//               leaveTo="opacity-0 translate-y-1"
//             >
//               <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
//                 <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
//                   <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
//                     <div className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
//                       <div className="ml-4">
//                         <p className="text-sm font-medium text-gray-900">
//                           Logout
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Popover.Panel>
//             </Transition>
//           </>
//         )}
//       </Popover>
//     </div>
//   )
// }

// <Transition
//               as={Fragment}
//               enter="transition ease-out duration-200"
//               enterFrom="opacity-0 translate-y-1"
//               enterTo="opacity-100 translate-y-0"
//               leave="transition ease-in duration-150"
//               leaveFrom="opacity-100 translate-y-0"
//               leaveTo="opacity-0 translate-y-1"
//             >
//               <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
//                 <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
//                   <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
//                     <div className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
//                       <div className="ml-4">
//                         <p className="text-sm font-medium text-gray-900">
//                           Logout
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Popover.Panel>
//             </Transition>
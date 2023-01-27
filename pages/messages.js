import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import {addDoc,collection,doc,getDoc,getDocs,query,serverTimestamp,updateDoc, where} from "@firebase/firestore";
import { db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRecoilState } from 'recoil';
import { userState } from '../Atom/modalAtom';
import { useSession } from 'next-auth/react';

function messages() {
    const[currentChatter,setCurrentChatter]=useState({});
    const[isChatting,setIsChatting]=useState(false);
    const[user,setUser]=useRecoilState(userState);
    const { data: session } = useSession();
    const [search,setsearch] = useState('');
    
    async function searchUser(){
        const x = query(collection(db,'users',where('tag','==',search)));

        try {
            const xSnapshot = await getDoc(x);
            xSnapshot.forEach((doc) => {
                setCurrentChatter(doc.data())
            });
        } catch ( err){
            console.log(err)
        }
    }
    function handleKey (e) {
        e.code === 'Enter' ? searchUser() : null
    }
    if(isChatting && currentChatter?.email){
       async function addChat(){
        await addDoc(collection(db,'chats'),{
            users:[session?.user?.email,currentChatter?.email]
        })
       }
       addChat();
    }

    // const chatexists=(oppuserEmail)=>{
    //     !!chatSnapshot?.docs.find(
    //         (chat) => chat.data().users.find(user => user === oppuserEmail)?.length > 0
    //         )
    // }

       console.log('current',currentChatter)
   const oppUsers = [{
        'name':'Zoro',
        'email':'zoro@gmail.com',
        'tag':'greatestswordsman',
        'profile':'https://tse2.mm.bing.net/th?id=OIP.Z_PIeIRDajXPmZHROt-T_QHaEK&pid=Api&P=0',
        'uid':'234567890'
    },
    {
        'name':'Luffy',
        'email':'luffy@gmail.com',
        'tag':'pirateking',
        'profile':'https://tse2.mm.bing.net/th?id=OIP.Z_PIeIRDajXPmZHROt-T_QHaEK&pid=Api&P=0',
        'uid':'234567890'
    }
]
    const xyz = oppUsers?.map((oppUser)=>{
        return (
            <div className='flex p-3 py-3 text-white hover:bg-[#202327] w-full cursor-pointer ' 
            onClick={()=>{
                setIsChatting(true);
                setCurrentChatter(oppUser);
            }}>
                <div className='mt-2'>
                <img src={oppUser?.profile} alt='' className='h-12 w-12 rounded-full cursor-pointer'/>
                </div>
                <div className='flex flex-col ml-5'>
                    <span>{oppUser?.name}</span>
                    <span>@{oppUser?.tag}</span>
                </div>
            </div>
        )
    })
  return (
    <div className='bg-black min-h-screen flex max-w-1515px mx-auto'>
      <Sidebar/>
      <div className=' text-white flex-grow border-l border-r border-gray-700 max-w-[450px] sm:ml-[73px] xl:ml-[370px]'>
        <div className='flex justify-between m-3'>
            <span className='flex ml-4 font-bold text-lg'>Messages</span>
            <div className=' flex justify-end mr-3'>Se</div>
        </div>
        <div className=' flex justify-center'>
        <input type='text' onKeyDown={handleKey} onChange={e => setsearch(e.target.value)} className=' px-5 p-2 rounded-full m-2 bg-black text-white w-[380px] outline-none border-2 border-gray-600'/>
        </div>
        <div className='mt-6 w-full overflow-y-auto'>
            {xyz}
        </div>
       </div>
    <div className='text-white'>
       hey
    </div>
    </div>
  )
}

export default messages
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Sidebar from '../components/Sidebar'
import Feed from '../components/Feed'
import { getCsrfToken, getProviders, getSession, useSession } from 'next-auth/react'
import Modal from '../components/Modal'
import { useRecoilState } from "recoil";
import { modalState, postIdState  } from "../Atom/modalAtom";
import Widjets from '../components/Widjets'
import { db, storage } from '../firebase';
import {addDoc,collection,doc,getDoc,getDocs,serverTimestamp,updateDoc} from "@firebase/firestore";
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import Profile from '../components/Profile'
import { activeState } from '../Atom/activeAtom'
import Bookmarks from '../components/Bookmarks'
import { userState } from '../Atom/userAtom'
import { useRouter } from 'next/router'
// import { error } from 'console'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session ,status} = useSession({
    required: true,
    onUnauthenticated(){
      router.push('/login')
    }
  });
  
  const router = useRouter();
  const [isOpen,setIsOpen] = useRecoilState(modalState);
  const[user,setUser]=useRecoilState(userState);
  // console.log('provider',providers)
  console.log('session',session)
  const[active,setActive]=useRecoilState(activeState);
  // console.log('active',active)
  console.log(',user.length',user.length)
  // console.log('ses',session)
  // console.log('session?.user?.email',session?.user?.email)
  
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
  async function getUsers(){
    const userRef = collection(db, "users");
    
    getDocs(userRef).then((snapshot)=>{
      // console.log('snapshot.docs',snapshot.docs)
      let value=[]
      snapshot.docs.forEach((doc)=>{
        value.push({...doc.data(),userId:doc.id})
      })
      console.log('value',value)
      const usercheck = value?.filter(filteredusers =>filteredusers?.email == session?.user?.email)
      console.log('check',usercheck)
     if(usercheck && usercheck[0]){
      console.log('success')
      console.log('usercheck[0]',usercheck[0])
    //  console.log()
      return setUser(usercheck[0]);
     } else{
      return addUser();
     }
    })
    
   }
  
  useEffect(()=>{
   if(user.length === 0) {
    console.log('xdcfvgbhnjmk')
     getUsers()
   }
   return 
  })
  // console.log('user',user)
  
    // console.log('user',user)
    // console.log('users',users)
    // console.log('p',providers)
 
  return (
    <>
      <Head>
        <title>Chirper</title>
      </Head>
      <main className='bg-black min-h-screen flex max-w-1515px mx-auto'>
      <Sidebar userdata={user}/>
      {/* <Profile/> */}
      
        {active == 'Home' ? (
          <div>
            <button className=' text-white bg-pink-200 cursor-pointer ml-10' onClick={getUsers}>Button</button>
            <div></div>
            <Feed/>
          </div>
          ):null}
        {active == 'Profile' ? (
            <Profile/>
          ):null}
        {active == 'Bookmarks' ? (
            <Bookmarks/>
           ):null}
      {/* <div>
        <button className='px-2 bg-orange-400' onClick={getUsers}>Heyyy</button>
      </div> */}
        
        {isOpen ? <Modal /> : ''}
        <Widjets/>
      </main>
    </>
  )
}




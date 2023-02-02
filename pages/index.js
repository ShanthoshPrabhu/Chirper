import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Sidebar from '../components/Sidebar'
import Feed from '../components/Feed'
import { getProviders, getSession, useSession } from 'next-auth/react'
import Login from '../components/Login'
import Modal from '../components/Modal'
import { useRecoilState } from "recoil";
import { modalState, postIdState  } from "../Atom/modalAtom";
import Widjets from '../components/Widjets'
import { db, storage } from '../firebase';
import {addDoc,collection,doc,getDoc,getDocs,serverTimestamp,updateDoc} from "@firebase/firestore";
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import User from '../components/User'
import Profile from '../components/Profile'
import { activeState } from '../Atom/activeAtom'
import Bookmarks from '../components/Bookmarks'
import { userState } from '../Atom/userAtom'
// import { error } from 'console'

const inter = Inter({ subsets: ['latin'] })

export default function Home({ providers }) {
  const { data: session } = useSession();
  const [isOpen,setIsOpen] = useRecoilState(modalState);
  const[user,setUser]=useRecoilState(userState);
  // console.log('provider',providers)
  // console.log('session',session)
  const[active,setActive]=useRecoilState(activeState);
  // console.log('active',active)
  // console.log('user',user)
  // console.log('ses',session)
  // console.log('session?.user?.email',session?.user?.email)
  async function addUser(){
  
    if(!session){ 
      return
    } else {
      const addData = await addDoc(collection(db, "users"), {  
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
   return
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
     if(usercheck && usercheck[0]){
      // console.log('success')
      // console.log('usercheck[0]',usercheck[0])
    //  console.log()
      return setUser(usercheck[0]);
     } else{
      return addUser();
     }
    })
    
   }
  
  useEffect(()=>{
    getUsers();
  },[])
  // console.log('user',user)
  
    // console.log('user',user)
    // console.log('users',users)
  if (!session) return <Login providers={providers} />;
  return (
    <>
      <Head>
        <title>Chirper</title>
      </Head>
      <main className='bg-black min-h-screen flex max-w-1515px mx-auto'>
      <Sidebar userdata={user}/>
      {/* <Profile/> */}
        {active == 'Home' ? (
           <Feed/>
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

export async function getServerSideProps(context) {
  // const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV").then(
  //   (res) => res.json()
  // );
  // const followResults = await fetch("https://jsonkeeper.com/b/WWMJ").then(
  //   (res) => res.json()
  // );
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {providers,session}
  };
}


import { CalendarIcon, ChartBarIcon, EmojiHappyIcon, PhotographIcon, XIcon } from '@heroicons/react/outline';
import React, { useEffect, useRef, useState } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { db, storage } from '../firebase';
import {addDoc,collection,doc,serverTimestamp,updateDoc} from "@firebase/firestore";
  import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { useSession } from 'next-auth/react';
import { useRecoilState } from 'recoil';
import { pollState } from '../Atom/pollAtom';
import { userState } from '../Atom/userAtom';
import LoadingScreen from './LoadingScreen';
import { createState } from '../Atom/createAtom';
// import "emoji-mart/css/emoji-mart.css";

function Input() {

   const { data: session } = useSession();
   const [create,setCreate]=useRecoilState(createState);
    const[input,setInput]=useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const filepickerRef = useRef(null);
    const [showEmojis , setShowEmojis]=useState(false);
    const [loading,setLoading]=useState(false);
    const inputRef = useRef();
    const [pollactive,setpollactive]= useRecoilState(pollState);
    const [noOfChoices, setNoOfChoices] = useState(2);
    const[pollQn,setPollQn]=useState('');
    const [choiceOne, setChoiceOne] = useState('');
    const [choiceTwo, setChoiceTwo] = useState('');
    const [choiceThree, setChoiceThree] = useState('');
    const [choiceFour, setChoiceFour] = useState('');
    const[user,setUser]=useRecoilState(userState);
  
  
  //  const x = {"tag":"shan","image":"https://lh3.googleusercontent.com/a/AEdFTp6z7xMLRfkWDhAkIeX3FqsfNqUq4g9MpVe3DGUl=s96-c","email":"aspmusiri@gmail.com","id":"8zbsbs0uDU6mrQh8NbC5","name":"Shan","timestamp":{"seconds":1673717916,"nanoseconds":802000000}}
    function addExtraChoice() {
      setNoOfChoices(prev => prev + 1)
      return
    }
    // console.log('noOfChoices', noOfChoices)
    function removePoll() {
        setChoiceFour('');
        setChoiceOne('');
        setChoiceThree('');
        setChoiceTwo('');
        setpollactive(false);
        setNoOfChoices(2);
    }

    if(loading){
      return (
        <div className=''>
            <LoadingScreen/>
        </div>
      )
    }
    
    
    function addImage (e) {
        const reader = new FileReader();
       console.log(e)
       if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      }
      console.log('red',reader)
      reader.onload = (readerEvent) => {
        setSelectedFile(readerEvent.target.result)
      }
      console.log(selectedFile)
    }
    async function uploadPoll(){
      if (loading) return;
      setLoading(true);
      const poll = { 
        id: user?.userId,
        username:user?.name,
        useremail:user?.email,
        userImg:user?.image,
        tag: user?.tag,
        timestamp: serverTimestamp(),
        isPoll:true,
        text:input,
        choiceOne:choiceOne,
        choiceOneVote:[],
        choiceTwo:choiceTwo,
        choiceTwoVote:[],
        totalVotes:[]
      }
      if(pollactive){
          
          if( choiceThree){
              Object.assign(poll,{choiceThree:choiceThree})
              Object.assign(poll,{choiceThreeVote:[]})
          }
          if(choiceFour){
            Object.assign(poll,{choiceFour:choiceFour})
            Object.assign(poll,{choiceFourVote:[]})
          }
          // console.log('poll',poll)

          const pollRef = await addDoc(collection(db, "posts"), poll)
        }

      setLoading(false);
      setCreate(false);
      setInput("");
      setSelectedFile(null);
      setShowEmojis(false);
      setChoiceFour('');
      setChoiceOne('');
      setChoiceThree('');
      setChoiceTwo('');
      setpollactive(false);
      setNoOfChoices(2);
  }

   async function uploadPost () {
    if (loading) return;
    setLoading(true);
  //  console.log('post')
    
    const docRef = await addDoc(collection(db, "posts"), {
      id: user?.userId,
      username: user?.name,
      useremail:user?.email,
      userImg:user?.image,
      tag: user.tag,
      text: input,
      isPoll:false,
      timestamp: serverTimestamp(),
    });


    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    if (selectedFile) {
        await uploadString(imageRef, selectedFile, "data_url").then(async () => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, "posts", docRef.id), {
            image: downloadURL,
          });
        });
      }
  
      setLoading(false);
      setCreate(false);
      setInput("");
      setSelectedFile(null);
      setShowEmojis(false);
    }


    function addEmoji (e){
       inputRef.current.focus()
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        inputRef.current.focus()
        setInput(input + emoji);
        // inputRef.current.focus()
      };
    
  return (
    <div  className={`border-b border-t border-gray-700 p-5 flex space-x-3 overflow-y-scroll scrollbar-hide ${loading && "opacity-60"}`}>
        <img src={user?.image} alt='' className='h-10 w-10 rounded-full cursor-pointer'/>
        <div className={` w-full ${!pollactive && 'divide-y divide-gray-100 divide-opacity-25'} ${pollactive && 'm-6 ml-8 mt-10'}`}>
          <textarea value={input} ref={inputRef} onChange={e=>setInput(e.target.value)} name='' id='' 
                className={`bg-transparent scrollbar-hide outline-none flex-grow mb-8 text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide  ml-3 mt-3 w-[90%] min-h-[50px]  ${pollactive && 'w-[85%] ml-6'}`}
                  placeholder="what's up"/>
          {pollactive ? (
            <div className=' flex flex-col m-2 xl:text-lg relative'>
            <div className='  '>
                <div className=' mx-3 my-3  bg-black'>
                    <input type='text' maxLength={25} onChange={e => setChoiceOne(e.target.value)} className='w-[85%] text-white outline-1 border-[1px] border-gray-100  border-opacity-20 rounded-md py-3 px-4 bg-black' placeholder='choice 1' />
                </div>
                <div className=' mx-3 my-3'>
                    <input type='text' maxLength={25} onChange={e => setChoiceTwo(e.target.value)} className='outline-1 border-[1px] border-gray-100  border-opacity-20 rounded-md py-3 px-4 w-[85%] text-white bg-black' placeholder='choice 2' />
                </div>
                {noOfChoices < 4 ? (
                    <div className='   cursor-pointer px-[10px] pb-1 hover:bg-gray-100 hover:bg-opacity-20 rounded-full text-white items-center justify-center absolute right-4 bottom-[90px]' onClick={addExtraChoice} >
                        <span className=' text-4xl'>+</span>
                    </div>
                ) : null}
                {noOfChoices === 3 ? (
                    <div className=' mx-3 my-3' >
                        <input type='text' maxLength={25} onChange={e => setChoiceThree(e.target.value)} className='outline-1 border-[1px] border-gray-100  border-opacity-20 rounded-md py-3 px-4 w-[85%] bg-black  text-white p-2' placeholder='choice 3 (optional)' />
                    </div>
                ) : null}
                {noOfChoices === 4 ? (
                    <div className=' '>
                        <div className=' mx-3 my-3'>
                            <input type='text' maxLength={25} value={choiceThree} onChange={e => setChoiceThree(e.target.value)} className='outline-1 border-[1px] border-gray-100  border-opacity-20 rounded-md py-3 px-4 w-[85%] bg-black  text-white p-2' placeholder='choice 3 (optional)' />
                        </div>
                        <div className=' mx-3 my-3'>
                            <input type='text' maxLength={25} onChange={e => setChoiceFour(e.target.value)} className='bg-black outline-1 border-[1px] border-gray-100  border-opacity-20 rounded-md py-3 px-4 w-[85%]  text-white p-2' placeholder='choice 4 (optional)' />
                        </div>
                    </div>
                ) : null}

            </div>
            <div className=' flex items-center justify-center m-5 py-2 text-base  text-red-600  hover:bg-opacity-10 hover:bg-red-100 cursor-pointer' onClick={removePoll}>
                Remove poll
            </div>
            
        </div>
          ): (
            <div>
                <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
                {selectedFile ? (
                  <div className="relative">
                    <div
                      className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                      onClick={() => setSelectedFile(null)}
                    >
                      
                      <XIcon className="text-white h-5" />
                    </div>
                    <img
                      src={selectedFile}
                      alt=""
                      className="rounded-2xl max-h-80 object-contain"
                    />
                  </div>
                ): null}
                  </div>
               
            </div>
          )}
          {loading?null:(
                  <div className=' flex items-center justify-between pt-[24px] '>
                  <div className=' flex items-center '>
                      <div className={`icon ${pollactive && 'hover:bg-black'}`} onClick={() =>filepickerRef.current.click()}>
                          <PhotographIcon className={`h-[22px]  text-[#ff9933] ${pollactive && 'opacity-40 '}`}/>
                          <input type='file' disabled={pollactive} hidden onChange={e => addImage(e)} ref={filepickerRef}/>
                      </div>
                      <div className={`icon  ${pollactive && ' hidden'}`}  onClick={()=> setpollactive(!pollactive)}>
                        <ChartBarIcon className="text-[#ff9933] h-[22px]" />
                      </div>
      
                    <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
                      <EmojiHappyIcon className="text-[#ff9933] h-[22px]" />
                    </div>
      
                    {/* <div className="icon">
                      <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
                    </div> */}
                    {showEmojis && (
                      <div className=' absolute mt-[465px] ml-[-40px] '>
                          <Picker
                          onEmojiSelect={addEmoji}
                          theme="dark"
                    />
                      </div>
                    )}
                  </div>
                  
                  <button
                    className="bg-[#ff9933] text-white rounded-full px-4 py-1 pb-1.5 font-semibold shadow-md hover:bg-[#cd8c4b] disabled:hover:bg-[#cd8c4b] disabled:opacity-50 disabled:cursor-default"
                    disabled={pollactive?!choiceOne || !choiceTwo || !input :!input} onClick={pollactive?uploadPoll:uploadPost}
                  >
                    Post
                  </button>
                  </div>
                )}
        </div>
       
    </div>
  )
}

export default Input
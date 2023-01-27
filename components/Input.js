import { CalendarIcon, ChartBarIcon, EmojiHappyIcon, PhotographIcon, XIcon } from '@heroicons/react/outline';
import React, { useRef, useState } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { db, storage } from '../firebase';
import {addDoc,collection,doc,serverTimestamp,updateDoc} from "@firebase/firestore";
  import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { useSession } from 'next-auth/react';
import { userState } from '../Atom/modalAtom';
import { useRecoilState } from 'recoil';
// import "emoji-mart/css/emoji-mart.css";

function Input() {

  const { data: session } = useSession();
  const[user,setUser]=useRecoilState(userState)
    const[input,setInput]=useState('')
    const [selectedFile, setSelectedFile] = useState(null);
    const filepickerRef = useRef(null);
    const [showEmojis , setShowEmojis]=useState(false)
    const [loading,setLoading]=useState(false);
    const inputRef = useRef();
    
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
   async function uploadPost () {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag,
      text: input,
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
      setInput("");
      setSelectedFile(null);
      setShowEmojis(false);
    }


    function addEmoji (e){
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        inputRef.current.focus()
        setInput(input + emoji);
        // inputRef.current.focus()
      };
    
  return (
    <div  className={`border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll scrollbar-hide ${loading && "opacity-60"}`}>
        <img src={session.user.image} alt='' className='h-8 w-8 rounded-full cursor-pointer'/>
        <div className=' w-full divide-y divide-gray-700'>
            <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
             <textarea value={input} ref={inputRef} onChange={e=>setInput(e.target.value)} name='' id='' rows='2'
              className='bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px]'
               placeholder="what's up"/>
            
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
         {loading?null:(
             <div className=' flex items-center justify-between pt-2.5 '>
             <div className=' flex items-center '>
                 <div className='icon'  onClick={() =>filepickerRef.current.click()}>
                     <PhotographIcon className='h-[22px] text-[#1d9bf8]'/>
                     <input type='file' hidden onChange={e => addImage(e)} ref={filepickerRef}/>
                 </div>
                 <div className="icon rotate-90">
                 <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
               </div>
 
               <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
                 <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
               </div>
 
               <div className="icon">
                 <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
               </div>
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
               className="bg-[#1d9bf0] text-white rounded-full px-4 py-1 pb-1.5 font-semibold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
               disabled={!input && !selectedFile} onClick={uploadPost}
             >
               Tweet
             </button>
         </div>
         )}
        </div>
       
    </div>
  )
}

export default Input
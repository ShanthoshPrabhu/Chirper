import React from 'react'
import {
  arrayRemove,
  arrayUnion,
collection,
deleteDoc,
doc,
getDoc,
getDocs,
onSnapshot,
orderBy,
query,
setDoc,
updateDoc,
where,
} from "@firebase/firestore";
import {
ChartBarIcon,
ChatIcon,
DotsHorizontalIcon,
HeartIcon,
ShareIcon,
SwitchHorizontalIcon,
TrashIcon,

} from "@heroicons/react/outline";
import {HeartIcon as HeartIconFilled,ChatIcon as ChatIconFilled,BookmarkIcon} from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../Atom/modalAtom";
import { db } from '../firebase';
import { userState } from '../Atom/userAtom';
import { async } from '@firebase/util';

function Post({id,post,postPage}) {
    const [comments, setComments] = useState([]);
    const[user,setUser]=useRecoilState(userState);
    const { data: session } = useSession();
    const [likes, setLikes] = useState([]);
    const [liked, setLiked] = useState(false);
    const router = useRouter();
    const [isOpen, setIsOpen] = useRecoilState(modalState);
    const [postId, setPostId] = useRecoilState(postIdState);
    const [bookmark,setBookmark]=useState(false);
    
    // console.log('post',post)
    // console.log('id',id)
    // console.log('users',user)
   
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
        // console.log('check',usercheck)
       if(usercheck && usercheck[0]){
        // console.log('success')
        // console.log('usercheck[0]',usercheck[0])
      //  console.log()
        return setUser(usercheck[0]);
       } 
      })
      
     }
 useEffect(()=>{
  const value = user?.bookmarks?.filter(mark => mark == id)
  // console.log('value',value);
  if(value == id){
     setBookmark(true)
     return
  }else{
    setBookmark(false)
    return
  }
 },[user])
 useEffect(()=>{
  getUsers();
},[])

// console.log('bm',bookmark)


// const toggleBookmark = async (e) => {
//   e.preventDefault();
  
//   await addDoc(collection(db, "users",user?.userId, "bookmarks"), {
    
//   });
  
//   // const messageRef = db.collection('rooms').doc('roomA')
//   // .collection('messages').doc('message1');index.js
//   // setIsOpen(false);
//   // setComment("");

//   router.push(`/${postId}`);
// };
     async function addToBookMark(){
      console.log('b',bookmark)
      setBookmark(true)
      await updateDoc(doc(db, "users", user?.userId),{
        bookmarks:arrayUnion(id)
      });
      getUsers();
      setBookmark(true)
      return
     }

     async function removeFromBookMark(){
      // console.log('hey')
      setBookmark(false)
      await updateDoc(doc(db, "users", user?.userId),{
        bookmarks:arrayRemove(id)
      });
      getUsers();
      setBookmark(false)
      return
     }

    useEffect(
        () =>
          onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
            setLikes(snapshot.docs)
          ),
        [db, id]
      );
      useEffect(
        () =>
          setLiked(
            likes.findIndex((like) => like.id === user?.userId) !== -1
          ),
        [likes]
      );
      useEffect(
        () =>
          onSnapshot(
            query(
              collection(db, "posts", id, "comments"),
              orderBy("timestamp", "desc")
            ),
            (snapshot) => setComments(snapshot.docs)
          ),
        [db, id]
      );
  // console.log('setlikes',likes)
    const likePost = async () => {
        if (liked) {
          await deleteDoc(doc(db, "posts", id, "likes", user?.userId));
        } else {
          await setDoc(doc(db, "posts", id, "likes", user?.userId), {
            username: user?.name,
          });
        }
      };
  // console.log('post?.timestamp',post?.timestamp)
  // console.log('post',post)
  return (
    <div className='p-3 flex cursor-pointer border-b border-gray-700' onClick={() => router.push(`/${id}`)}>
        {!postPage && (
            <img src={post?.userImg} alt='' className='h-11 w-11 rounded-full mr-4'/>
        )}
       {post?.isPoll === false ? (
         <div className='flex flex-col space-y-2 w-full'>
         <div className={`flex ${!postPage && 'justify-between'}`}>
           {postPage && (
             <img src={post?.userImg} alt='profile' className='h-11 w-11 rounded-full mr-4'/>
           )}
           <div className="text-[#6e767d]">
               <div className="inline-block group">
                 <h4 className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${!postPage && 'inline-block'}`}>
                 {post?.username}
                 </h4>
                 <span className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}>
                   @{post?.tag}
                 </span>
               </div>
               <span className="hover:underline text-sm sm:text-[15px] ml-[12px]">
                  <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
               </span>
               {!postPage && (
                 <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                    {post?.text}
                 </p>
                 )}
           </div>
           <div className="icon group flex-shrink-0 ml-auto">
            <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#ff9933]" />
           </div>
         </div>
         {postPage && (
           <p className="text-[#d9d9d9] mt-0.5 text-xl">{post?.text}</p>
         )}
         <img src={post?.image} alt="" className="rounded-2xl max-h-[700px] object-cover mr-2"/>
         <div className={`text-[#6e767d] flex justify-between w-10/12 ${postPage && 'mx-auto'}`}>
         <div
         className="flex items-center space-x-1 group"
         onClick={(e) => {
           e.stopPropagation();
           setPostId(id);
           setIsOpen(true);
         }}
       >
         <div className="icon group-hover:bg-[#ff9933] group-hover:bg-opacity-10">
           <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
         </div>
         {comments.length > 0 && (
           <span className="group-hover:text-[#ff9933] text-sm">
             {comments.length}
           </span>
         )}
        </div>

       {user?.userId === post?.id ? (
         <div
           className="flex items-center space-x-1 group"
           onClick={(e) => {
             e.stopPropagation();
             deleteDoc(doc(db, "posts", id));
             router.push("/");
           }}
         >
           <div className="icon group-hover:bg-red-600/10">
             <TrashIcon className="h-5 group-hover:text-red-600" />
           </div>
         </div>
       ) : (
         <div className="flex items-center space-x-1 group">
           <div className="icon group-hover:bg-green-500/10">
             <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
           </div>
         </div>
       )}

       <div
         className="flex items-center space-x-1 group"
         onClick={(e) => {
           e.stopPropagation();
           likePost();
         }}
       >
         <div className="icon group-hover:bg-pink-600/10">
           {liked ? (
             <HeartIconFilled className="h-5 text-pink-600" />
           ) : (
             <HeartIcon className="h-5 group-hover:text-pink-600" />
           )}
         </div>
         {likes.length > 0 && (
           <span
             className={`group-hover:text-pink-600 text-sm ${
               liked && "text-pink-600"
             }`}
           >
             {likes.length}
           </span>
         )}
       </div>

       <div className="icon group">
         <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
       </div>
       {user?.userId === post?.id ? (
             <div className="icon group">
             <BookmarkIcon className={`h-5 group-hover:text-[#ff9933] hover:opacity-50 ${bookmark ? ' text-[#ff9933]' : null}`}
             onClick={(e) => {
              e.stopPropagation();
              bookmark?removeFromBookMark():addToBookMark(e)
              }}/>
           </div>
             
          ) : (
            <div className="icon group">
                <ChartBarIcon className="h-5 group-hover:text-[#ff9933]"/> 
             </div>
          )}
         </div>
     </div>
       ) : (
        <div className='flex flex-col space-y-2 w-full'>
            <div className={`flex ${!postPage && 'justify-between'}`}>
              {postPage && (
              <img src={post?.userImg} alt='profile' className='h-11 w-11 rounded-full mr-4'/>
              )}
              <div className="text-[#6e767d]">
               <div className="inline-block group">
                 <h4 className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${!postPage && 'inline-block'}`}>
                 {post?.username}
                 </h4>
                 <span className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}>
                   @{post?.tag}
                 </span>
               </div>
               <span className="hover:underline text-sm sm:text-[15px] ml-[12px]">
                  <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
               </span>
               {!postPage && (
                 <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                    {post?.poll?.text}
                 </p>
                 )}
             </div>
            <div className="icon group flex-shrink-0 ml-auto">
              <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#ff9933]" />
            </div>
            </div>
            {postPage && (
              <p className="text-[#d9d9d9] mt-0.5 text-xl">{post?.poll?.text}</p>
            )}
            {postPage ? (
              <div className=' flex flex-col m-5 text-xl '>
                <div className=' p-3 m-3 bg-black text-[#d9d9d9] border border-gray-50 border-opacity-30'>{post?.poll?.choiceOne}</div>
                <div className=' p-3 m-3 bg-black text-[#d9d9d9] border border-gray-50 border-opacity-30'>{post?.poll?.choiceTwo}</div>
                {post?.poll?.choiceThree ? (
                  <div className=' p-3 m-3 bg-black text-[#d9d9d9] border border-gray-50 border-opacity-30'>{post?.poll?.choiceThree}</div>
                ): null}
                {post?.poll?.choiceFour ? (
                  <div className=' p-3 m-3 bg-black text-[#d9d9d9] border border-gray-50 border-opacity-30'>{post?.poll?.choiceFour}</div>
                ): null}
              </div>
            ) : ( 
              <div className=' flex flex-col m-5 text-base'>
                 <div className=' p-3 m-3 bg-black text-[#d9d9d9] border border-gray-50 border-opacity-30 w-[85%] rounded-md' >{post?.poll?.choiceOne}</div>
                <div className=' p-3 m-3 bg-black text-[#d9d9d9] border border-gray-50 border-opacity-30 w-[85%] rounded-md'>{post?.poll?.choiceTwo}</div>
                {post?.poll?.choiceThree ? (
                  <div className=' p-3 m-3 bg-black text-[#d9d9d9] border border-gray-50 border-opacity-30 w-[85%] rounded-md'>{post?.poll?.choiceThree}</div>
                ): null}
                {post?.poll?.choiceFour ? (
                  <div className=' p-3 m-3 bg-black text-[#d9d9d9] border border-gray-50 border-opacity-30 w-[85%] rounded-md'>{post?.poll?.choiceFour}</div>
                ): null}
              </div>
            )}
            <div className={`text-[#6e767d] flex justify-between w-10/12 ${postPage && 'mx-auto'}`}>
            <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              setPostId(id);
              setIsOpen(true);
            }}
          >
            <div className="icon group-hover:bg-[#ff9933] group-hover:bg-opacity-10">
              <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            {comments.length > 0 && (
              <span className="group-hover:text-[#ff9933] text-sm">
                {comments.length}
              </span>
            )}
            </div>

          {user?.userId === post?.id ? (
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                deleteDoc(doc(db, "posts", id));
                router.push("/");
              }}
            >
              <div className="icon group-hover:bg-red-600/10">
                <TrashIcon className="h-5 group-hover:text-red-600" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-1 group">
              <div className="icon group-hover:bg-green-500/10">
                <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
              </div>
            </div>
          )}

          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              likePost();
            }}
          >
            <div className="icon group-hover:bg-pink-600/10">
              {liked ? (
                <HeartIconFilled className="h-5 text-pink-600" />
              ) : (
                <HeartIcon className="h-5 group-hover:text-pink-600" />
              )}
            </div>
            {likes.length > 0 && (
              <span
                className={`group-hover:text-pink-600 text-sm ${
                  liked && "text-pink-600"
                }`}
              >
                {likes.length}
              </span>
            )}
          </div>

          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-[#ff9933]" />
          </div>
          {user?.userId === post?.id ? (
             <div className="icon group">
             <BookmarkIcon className={`h-5 group-hover:text-[#ff9933] hover:opacity-50 ${bookmark ? ' text-[#ff9933]' : null}`}
             onClick={(e) => {
              e.stopPropagation();
              bookmark?removeFromBookMark():addToBookMark(e)
              }}/>
           </div>
             
          ) : (
            <div className="icon group">
                <ChartBarIcon className="h-5 group-hover:text-[#ff9933]"/> 
             </div>
          )}
          
         </div>
        </div>
       )}
    </div>
  )
}

export default Post
import { SparklesIcon } from '@heroicons/react/outline'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import Input from './Input'
import Post from './Post';

function Feed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          // console.log('postsnap',snapshot)
          setPosts(snapshot.docs);
        }
      ),
    [db]
  );
//  console.log('posts',posts)
  return (
    <div className=' text-white flex-grow border-l border-r border-gray-700 max-w-[750px] sm:ml-[73px] xl:ml-[370px]'>
       {/* <div className="text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 top-0 z-50 bg-black border-b border-gray-700 sticky">
        <h2 className="text-lg sm:text-xl font-bold">Home</h2>
        <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 ml-auto">
          <SparklesIcon className="h-5 text-white" />
        </div>
      </div> */}
      <div className=' h-12'></div>
      <Input/>
      <div className="pb-72">
        {posts.map((post) => (
          <Post key={post.id} id={post.id} post={post.data()} />
        ))}
      </div>
    </div>
  )
}

export default Feed
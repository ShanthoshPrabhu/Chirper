import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { userState } from '../Atom/userAtom';
import { db } from '../firebase';
import LoadingScreen from './LoadingScreen';
import Post from './Post';

function Bookmarks() {
    const[user,setUser]=useRecoilState(userState);
    const [data, setData] = useState([]);
    // const fetchData = () => {
    //   if (!user || !user.bookmarks) return;
    //   let newData = [];
    //   user?.bookmarks?.forEach((value) => {
    //     if (!value) return;
    //     onSnapshot(doc(db, "posts", value), (snapshot) => {
    //       newData.push({...snapshot.data(), postId: snapshot.id});
    //     });
    //   });
    //   setData(newData);
    // };
    const fetchData = async () => {
      if (!user || !user.bookmarks) return;
      let promises = [];
      user.bookmarks.forEach((value) => {
        if (!value) return;
        promises.push(
          new Promise((resolve) => {
            onSnapshot(doc(db, "posts", value), (snapshot) => {
              resolve({...snapshot.data(), postId: snapshot.id});
            });
          })
        );
      });
      setData(await Promise.all(promises));
    };
    
    useEffect(() => {
      fetchData();
    }, []);
    
  console.log('data',data)
  //  console.log('bokkmm',bookmark)
return (
    <div className=' text-white flex-grow border-l border-r z-10 border-gray-700 max-w-[750px] sm:ml-[73px] xl:ml-[370px] '>
      {/* <button className=' text-white' onClick={fetchData}>Button</button> */}
      <div className='text-white text-lg font-semibold py-2 px-4'>Saved</div>
      {data?(
        <div className="pb-72 border-t border-gray-50 border-opacity-30">
        {[...data]?.reverse().map((value) => (
          // console.log(value)
          <Post key={value?.postId} id={value?.postId} post={value} />
          
        ))}
       {/* <Post key={bookmark?.id} id={bookmark?.id} post={bookmark} /> */}
      </div>
      ):null}
    </div>
  )
}

export default Bookmarks
import React from 'react'
import { useRecoilState } from 'recoil';
import { userState } from '../Atom/modalAtom';


function User() {
  const[user,setUser]=useRecoilState(userState);
  // console.log('userrr',user)
  return (
    <div>User</div>
  )
}

export default User
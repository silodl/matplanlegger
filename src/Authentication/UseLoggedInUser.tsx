import {onAuthStateChanged, User } from "firebase/auth";
import {useEffect, useState} from 'react';
import { auth } from "../Firebase";

export const useLoggedInUser = () => {
  
  const [currUser, setCurrUser] = useState<User>();

  useEffect(() => {
    const unlisten = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrUser(user);
      }
      else {
        console.log("finner ikke bruker")
      }
    });
    return () => {
      unlisten();
    }
  },[])
  
  return currUser;
}
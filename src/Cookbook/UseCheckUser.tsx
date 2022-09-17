import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../Firebase";

export const useCheckUser = (user: string) => {

    const [isUser, setIsUser] = useState(false);
    
    useEffect(() => {
        setIsUser(false);
       if(user) {
            const q = query(collection(db, "users"), where("email", "==", user));
            getDocs(q)
            .then((docs) => {
                if(docs.size === 1){
                    setIsUser(true);  
                }
            })
        } 
    },[user])
    
    return isUser
}
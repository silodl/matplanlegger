import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useState, useEffect } from "react";

export interface Cookbook {
    name: string,
    image: string,
    id: string,
}

export const useCookbooks = () => {

    const [cookbooks, setCookboks] = useState<Cookbook[]>([]);
    
    const user = useLoggedInUser();
    const fetchCookbooks = async() => {
        if(user) {
            const q = query(collection(db, "users", user.uid, "cookbooks"));
            const querySnapshot = await getDocs(q);
            setCookboks([]);
            querySnapshot.forEach((doc) => {
                if(doc.exists()) {
                    const name: string = doc.get("name");
                    const image: string = doc.get("image");
                    const id: string = doc.id;
                    setCookboks(old => [...old, {name, image, id}])

                }
        });
        }
    }
    
    useEffect(() => {
        fetchCookbooks(); 
    },[user]);
    
    return cookbooks;
}
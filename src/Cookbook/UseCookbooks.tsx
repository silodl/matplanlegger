import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../Firebase";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useState, useEffect } from "react";

export interface Cookbook {
    name: string,
    id: string,
}

export const useCookbooks = () => {

    const [cookbooks, setCookboks] = useState<Cookbook[]>([]);
    
    const user = useLoggedInUser();
    const fetchCookbooks = async() => {
        if(user && user.email) {
            const q = query(collection(db, "cookbooks"), where("owners", "array-contains", user.email));
            onSnapshot(q, (querySnapshot) => {
                setCookboks([]);
                querySnapshot.forEach((doc) => {
                    if(doc.exists()) {
                        const name: string = doc.get("name");
                        const image: string = doc.get("image");
                        const id: string = doc.id;
                        setCookboks(old => [...old, {name, image, id}])
                    }
                });
            })
        }
    }
    
    useEffect(() => {
        fetchCookbooks(); 
    },[user]);
    
    return cookbooks;
}
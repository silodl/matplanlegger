import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../Firebase";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useState, useEffect } from "react";

export interface CookbookProps {
    name: string,
    id: string,
    recipes: string[],
    owners: string[],
}

export const useCookbooks = () => {

    const [cookbooks, setCookboks] = useState<CookbookProps[]>([]);
    
    const user = useLoggedInUser();
    useEffect(() => {
        if(user && user.email) {
            const q = query(collection(db, "cookbooks"), where("owners", "array-contains", user.email));
            onSnapshot(q, (querySnapshot) => {
                setCookboks([]);
                querySnapshot.forEach((doc) => {
                    if(doc.exists()) {
                        const name: string = doc.get("name");
                        const id: string = doc.id;
                        const recipes: string[] = doc.get("recipes");
                        const owners: string[] = doc.get("owners");
                        setCookboks(old => [...old, {name, id, recipes, owners}])
                    }
                });
            })
        }
    },[user]);
    
    return cookbooks;
}
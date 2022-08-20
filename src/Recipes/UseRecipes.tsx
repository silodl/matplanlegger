import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useEffect, useState } from "react";
import { Recipe } from "./AddRecipe";

export const useRecipes = () => {

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const user = useLoggedInUser();

    const fetchRecipes = async() => {

        if (user) {
            const q = query(collection(db, "users", user.uid, "recipes"));
                const querySnapshot = await getDocs(q);
                setRecipes([]);
                querySnapshot.forEach((doc) => {
                    if(doc.exists()) {
                        const url = doc.get("url");
                        const file = doc.get("file");
                        const name = doc.get("name");
                        const category = doc.get("category");
                        const image = doc.get("image");
                        const time = doc.get("time");
                        const tags = doc.get("tags");
                        const userID = user.uid
                        const id = doc.id;
                        const recipe = {url, file, name, category, image, time, tags, userID, id};
                        setRecipes(old => [...old, recipe])
                    }
                
                });
        }
    } 

    useEffect(() => {
        fetchRecipes(); 
    },[user]);
    
    return recipes;
}
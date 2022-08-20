import { collection, query, getDoc, doc, getDocs, where } from "firebase/firestore";
import { db } from "../Firebase";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useState, useEffect } from "react";
import { Recipe } from "../Recipes/AddRecipe";
import { Cookbook } from "./UseCookbooks";

export const useCookbook = (props: {id: string | undefined}) => {

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [cookbook, setCookbook] = useState<Cookbook>();
    
    const user = useLoggedInUser();

    const fetchCookbook = async() => {

        if(user && props.id) {
            const docRef = doc(db, "users", user.uid, "cookbooks", props.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const name = docSnap.get("name");
                const image = docSnap.get("image");
                const id = docSnap.get("id");
                const book = {name, image, id}
                setCookbook(book);
            }

            const q = query(collection(db, "users", user.uid, "recipes"), where("cookbook", "==", props.id));
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
                    const id = docSnap.id;
                    const recipe = {url, file, name, category, image, time, tags, userID, id};
                    setRecipes(old => [...old, recipe])
                }
            
            });
        }
    }
    
    useEffect(() => {
        fetchCookbook(); 
    },[user, props.id]);
    
    return {cookbook, recipes};
}
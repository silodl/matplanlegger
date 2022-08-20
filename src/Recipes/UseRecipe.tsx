import { getDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useState, useEffect } from "react";
import { Recipe } from "../Recipes/AddRecipe";

export const useRecipe = (props: {id: string | undefined}) => {

    const [recipe, setRecipe] = useState<Recipe>();
    
    const user = useLoggedInUser();

    useEffect(() => {
        const fetchRecipe = async() => {

            if(user && props.id) {
                const docRef = doc(db, "users", user.uid, "recipes", props.id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const url = docSnap.get("url");
                    const file = docSnap.get("file");
                    const name = docSnap.get("name");
                    const category = docSnap.get("category");
                    const image = docSnap.get("image");
                    const time = docSnap.get("time");
                    const tags = docSnap.get("tags");
                    const userID = user.uid
                    const id = docSnap.id;
                    const recipeContent = {url, file, name, category, image, time, tags, userID, id};
                    setRecipe(recipeContent);
                }
            }
        }
        fetchRecipe(); 
    },[user, props.id]);
    
    return recipe;
}
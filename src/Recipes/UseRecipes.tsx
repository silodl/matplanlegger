import { collection, query, where, onSnapshot} from "firebase/firestore";
import { db } from "../Firebase";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useState, useEffect } from "react";
import { Recipe } from "../Recipes/AddRecipe";

export const useRecipes = (ids: string[] | undefined) => {

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const user = useLoggedInUser();

    useEffect(() => {
        const fetchRecipe = async() => {

            if(user && ids && ids.length > 0) {
                const q = query(collection(db, "recipes"), where('__name__', "in", ids));
                onSnapshot(q, (querySnapshot) => {
                    setRecipes([]);
                    querySnapshot.forEach((doc) => {
                        if (doc.exists()) {
                            const url = doc.get("url");
                            const file = doc.get("file");
                            const name = doc.get("name");
                            const category = doc.get("category");
                            const image = doc.get("image");
                            const time = doc.get("time");
                            const tags = doc.get("tags");
                            const owner = user.uid
                            const id = doc.id;
                            const recipeContent = {url, file, name, category, image, time, tags, owner, id};
                            setRecipes(old => [...old, recipeContent]);
                        }
                    })
                })
            }
        }
        fetchRecipe(); 
    },[user, ids]);
    
    return recipes;
}
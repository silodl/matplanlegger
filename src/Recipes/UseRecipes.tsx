import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useEffect, useState } from "react";
import { Recipe } from "./AddRecipe";

export const useRecipes = () => {

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const user = useLoggedInUser();

    const fetchRecipes = async() => {

        if (user) {
            setRecipes([]);
            const q = query(collection(db, "recipes"), where("owner", "==", user.uid));
            onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if(doc.exists()) {
                        const url = doc.get("url");
                        const file = doc.get("file");
                        const name = doc.get("name");
                        const category = doc.get("category");
                        const image = doc.get("image");
                        const time = doc.get("time");
                        const tags = doc.get("tags");
                        const owner = user.uid
                        const id = doc.id;
                        const recipe = {url, file, name, category, image, time, tags, owner, id};
                        setRecipes(old => [...old, recipe])
                    }
                })
            })

            // get the recipes from cookbooks shared with the user
            const q2 = query(collection(db, "cookbooks"), where("owners", "array-contains", user.email));

            onSnapshot(q2, (querySnapshot2) => {
                querySnapshot2.forEach((cookbook) => {
                    console.log(cookbook)
                    if(cookbook.exists()) {
                        const recipeIDs: string[] = cookbook.get("recipes");
                        recipeIDs.forEach(async(recipeID) => {
                            const docRef = doc(db, "recipes", recipeID);
                            const docSnap2 = await getDoc(docRef);
                            if(docSnap2.exists()) {
                                const url = docSnap2.get("url");
                                const file = docSnap2.get("file");
                                const name = docSnap2.get("name");
                                const category = docSnap2.get("category");
                                const image = docSnap2.get("image");
                                const time = docSnap2.get("time");
                                const tags = docSnap2.get("tags");
                                const owner = user.uid
                                const id = docSnap2.id;
                                const recipe = {url, file, name, category, image, time, tags, owner, id};
                                setRecipes(old => [...old, recipe])
                            }
                        })
                    }
                })
            })   
        }
    } 

    useEffect(() => {
        fetchRecipes(); 
    },[user]);
    
    return recipes;
}
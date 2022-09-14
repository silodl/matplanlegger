import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useEffect, useState } from "react";
import { Recipe } from "./AddRecipe";

export const useRecipes = (addedRecipes?: string[], time?: string, categories?: string[], tags?: string[], searchWords?: string[]) => {

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const user = useLoggedInUser();

    let recipeIDs: string[] = [];
 
    useEffect(() => {
        if (user) {
            new Promise<void>((resolve, reject) => {
                const q = query(collection(db, "recipes"), where("owner", "==", user.uid));
                onSnapshot(q, (querySnapshot) => {
                    setRecipes([]);
                    recipeIDs = [];
                    querySnapshot.forEach((doc) => {
                        if(doc.exists() && !addedRecipes?.includes(doc.id) 
                            && (!categories || (categories && categories.includes(doc.get("category"))))
                            && (!tags || (tags && tags.every(tag => doc.get("tags").includes(tag))))
                            && (!searchWords || (searchWords && searchWords.every(word => (doc.get("name") as string).toLowerCase().includes(word))))
                            ) {
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
                            setRecipes(old => [...old, recipe]);
                            recipeIDs.push(id)
                        }
                    })
                    if(recipeIDs.length === querySnapshot.size) {
                        resolve()
                    }
                }) 
            })
            .then(() => {
                const q2 = query(collection(db, "cookbooks"), where("owners", "array-contains", user.email));
                onSnapshot(q2, (querySnapshot2) => {
                    querySnapshot2.forEach((cookbook) => {
                        if(cookbook.exists()) {
                            const cookbookRecipeIDs: string[] = cookbook.get("recipes");
                            cookbookRecipeIDs.forEach((recipeID) => {
                                if(!recipeIDs.includes(recipeID)) {
                                    getDoc(doc(db, "recipes", recipeID))
                                    .then((docSnap2) => {
                                        if(!addedRecipes?.includes(docSnap2.id)
                                            && (!categories || (categories && categories.includes(docSnap2.get("category"))))
                                            && (!tags || (tags && tags.every(tag => docSnap2.get("tags").includes(tag))))
                                            && (!searchWords || (searchWords && searchWords.every(word => (docSnap2.get("name") as string).toLowerCase().includes(word))))
                                        ) {
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
                        } 
                    }) 
                })   
            })
            
        }
 
    },[user, time, addedRecipes, categories, tags, searchWords]);

    return recipes
}
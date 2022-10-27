import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useEffect, useState } from "react";
import { Recipe } from "./AddRecipe";

export const useAllRecipes = (addedRecipes?: string[], time?: string[], categories?: string[], searchWords?: string[]) => {

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
                            && (!time || (time && time.includes(doc.get("time"))))
                            && (!searchWords || (searchWords && searchWords.every(word => (doc.get("name") as string).toLowerCase().includes(word)))
                            || (searchWords.every(word => (doc.get("tags").toString().replaceAll(",", " ").includes(word)))))
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
                                    .then((docSnap) => {
                                        if(!addedRecipes?.includes(docSnap.id)
                                            && (!categories || (categories && categories.includes(docSnap.get("category"))))
                                            && (!time || (time && time.includes(docSnap.get("time"))))
                                            && (!searchWords || (searchWords && searchWords.every(word => (docSnap.get("name") as string).toLowerCase().includes(word)))
                                            || (searchWords.every(word => (docSnap.get("tags").toString().replaceAll(",", " ").includes(word)))))

                                        ) {
                                            const url = docSnap.get("url");
                                            const file = docSnap.get("file");
                                            const name = docSnap.get("name");
                                            const category = docSnap.get("category");
                                            const image = docSnap.get("image");
                                            const time = docSnap.get("time");
                                            const tags = docSnap.get("tags");
                                            const owner = user.uid
                                            const id = docSnap.id;
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
 
    },[user, time, addedRecipes, categories, searchWords]);

    return recipes
}
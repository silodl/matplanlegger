import { getDoc, doc, onSnapshot} from "firebase/firestore";
import { db } from "../Firebase";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useState, useEffect } from "react";
import { Recipe } from "../Recipes/AddRecipe";
import { CookbookProps } from "./UseCookbooks";

export const useCookbook = (id: string | undefined, time?: string[], categories?: string[], searchWords?: string[]) => {

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [cookbook, setCookbook] = useState<CookbookProps>();
    const user = useLoggedInUser();

    useEffect(() => {
        if(user && id) {
            onSnapshot(doc(db, "cookbooks", id), (cookbook) => {
                if (cookbook.exists()) {
                    const name: string = cookbook.get("name");
                    const id = cookbook.id;
                    const owners: string[] = cookbook.get("owners");
                    const recipeIDs: string[] = cookbook.get("recipes");
                    const book: CookbookProps = {name, id, recipes: recipeIDs, owners}
                    setCookbook(book);
                    setRecipes([]);
                    recipeIDs.forEach((recipeID) => {
                        getDoc(doc(db, "recipes", recipeID))
                        .then((docSnap) => {
                            if(docSnap.exists() 
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
                    })
                }
            })
        }  
    },[user, id, time, categories, searchWords]);
    
    return {cookbook, recipes};
}
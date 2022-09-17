import { getDoc, doc, onSnapshot} from "firebase/firestore";
import { db } from "../Firebase";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useState, useEffect } from "react";
import { Recipe } from "../Recipes/AddRecipe";
import { CookbookProps } from "./UseCookbooks";

export const useCookbook = (id: string | undefined, time?: string[], categories?: string[], tags?: string[], searchWords?: string[]) => {

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
                        .then((docSnap2) => {
                            if(docSnap2.exists() 
                                && (!categories || (categories && categories.includes(docSnap2.get("category"))))
                                && (!tags || (tags && tags.every(tag => docSnap2.get("tags").includes(tag))))
                                && (!time || (time && time.includes(docSnap2.get("time"))))
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
                    })
                }
            })
        }  
    },[user, id, time, categories, tags, searchWords]);
    
    return {cookbook, recipes};
}
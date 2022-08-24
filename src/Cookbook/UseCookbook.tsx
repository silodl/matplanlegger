import { getDoc, doc, onSnapshot} from "firebase/firestore";
import { db } from "../Firebase";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useState, useEffect } from "react";
import { Recipe } from "../Recipes/AddRecipe";
import { CookbookProps } from "./UseCookbooks";

export const useCookbook = (props: {id: string | undefined}) => {

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [cookbook, setCookbook] = useState<CookbookProps>();
    const user = useLoggedInUser();

    const fetchCookbook = async() => {

        if(user && props.id) {
            onSnapshot(doc(db, "cookbooks", props.id), (docSnap) => {
            if (docSnap.exists()) {
                const name: string = docSnap.get("name");
                const id = docSnap.id;
                const owners: string[] = docSnap.get("owners");
                const recipeIDs: string[] = docSnap.get("recipes");
                const book: CookbookProps = {name, id, recipes: recipeIDs, owners}
                setCookbook(book);
                setRecipes([]);
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
        }
    }
    
    useEffect(() => {
        fetchCookbook(); 
    },[user, props.id]);
    
    return {cookbook, recipes};
}
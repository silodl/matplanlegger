import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useState, useEffect} from "react";
import { Recipe } from "../Recipes/AddRecipe";

export const usePlannedWeek = (props: {week: string}) => {

    const [recipes, setRecipes] = useState<Recipe[][]>([]);
    const user = useLoggedInUser();

    const GetRecipe = async(id: string, day: string) => {
        const index = parseInt(day);
        if (user && id) {
            const docRef = doc(db, "recipes", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const url = docSnap.get("url");
                const file = docSnap.get("file");
                const name = docSnap.get("name");
                const category = docSnap.get("category");
                const image = docSnap.get("image");
                const time = docSnap.get("time");
                const tags = docSnap.get("tags");
                const owner = user.uid
                const recipeContent = {url, file, name, category, image, time, tags, owner, id};

                let newRecipes = recipes;
                if(newRecipes[index].length > 0 && newRecipes[index][0].id !== recipeContent.id) {
                    newRecipes[index].push(recipeContent)
                } 
                else {
                    newRecipes[index] = [recipeContent];
                }
                setRecipes(newRecipes)
            }
        } 
    } 

    useEffect(() => {
        const fetchDay = async() => {
            setRecipes([[], [], [], [], [], [], []]);
            if(user && props.week) {
                onSnapshot(doc(db, "users", user.uid, "weeks", props.week), (docSnap) => {
                    if (docSnap.exists()) {
                        const docRecipes: Map<string, string> = docSnap.get("recipes");
                        Object.entries(docRecipes).forEach(([day, plannedRecipes]: [string, string[]]) => {
                            plannedRecipes.forEach((recipe) => {
                                GetRecipe(recipe, day);
                            })
                        })
                    }
                })
            }
        }
        fetchDay() 
    },[user, props.week])

    return recipes;
}
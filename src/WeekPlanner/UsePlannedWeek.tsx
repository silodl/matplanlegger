import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useState, useEffect} from "react";
import { Recipe } from "../Recipes/AddRecipe";

export const usePlannedWeek = (props: {week: string}) => {

    const [recipes, setRecipes] = useState<{[Key: string]: Recipe[]}>({});
    const user = useLoggedInUser();

    useEffect(() => {
        if(user && props.week) {
            onSnapshot(doc(db, "users", user.uid, "weeks", props.week), (docSnap) => {
                if (docSnap.exists()) {
                    const docRecipes: {[Key: string]: string[]} = docSnap.get("recipes");
                    let plannedWeek: {[Key: string]: Recipe[]} = {"0": [], "1": [], "2": [], "3": [], "4": [], "5": [], "6": []};
                    if(Object.entries(docRecipes).length === 0) {
                        setRecipes(plannedWeek);
                    }
                    else {
                        Object.entries(docRecipes).forEach(([day, plannedRecipes]) => {
                            plannedRecipes.forEach(async(recipeID) => {
                                const docRef = doc(db, "recipes", recipeID);
                                await getDoc(docRef)
                                .then((docSnaps) => {
                                    const url = docSnaps.get("url");
                                    const file = docSnaps.get("file");
                                    const name = docSnaps.get("name");
                                    const category = docSnaps.get("category");
                                    const image = docSnaps.get("image");
                                    const time = docSnaps.get("time");
                                    const tags = docSnaps.get("tags");
                                    const owner = user.uid
                                    const recipe = {url, file, name, category, image, time, tags, owner, id: recipeID};
    
                                    if(plannedWeek[day].length > 0) {
                                        plannedWeek[day].push(recipe)
                                    } 
                                    else {
                                        plannedWeek[day] = [recipe];
                                    }
                                    setRecipes(plannedWeek);
                                })
                            })
                        })
                    }    
                }
                else {
                    let plannedWeek: {[Key: string]: Recipe[]} = {"0": [], "1": [], "2": [], "3": [], "4": [], "5": [], "6": []};
                    setRecipes(plannedWeek);
                }
            })
        }
    },[user, props.week])

    return recipes;
}
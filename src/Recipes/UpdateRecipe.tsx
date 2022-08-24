import { updateDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";

import { Recipe } from "./AddRecipe";

export const UpdateRecipe = async(recipe: Recipe) => {

    await updateDoc(doc(db, "recipes", recipe.id), {
        name: recipe.name,
        tags: recipe.tags,
        time: recipe.time,
    }) 
}
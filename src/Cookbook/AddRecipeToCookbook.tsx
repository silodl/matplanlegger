import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";

export const AddRecipeToCookbook = async(props: {recipeID: string, userID: string, bookID: string}) => {
    if(props.userID){
        const docRef = doc(db, "cookbooks", props.bookID);
        const docSnap = await getDoc(docRef);
        let docRecipes: string[];

        if (docSnap.exists()) {
            docRecipes = docSnap.get("recipes");
            if(docRecipes.length > 0) {
                docRecipes.push(props.recipeID);
            }
            else {
                docRecipes= [props.recipeID];
            }
            await updateDoc(doc(db, "cookbooks", props.bookID), {
                recipes: docRecipes,
            }) 
        }
    }
}

export const AddRecipesToCookbook = async(props: {recipeIDs: string[], userID: string, bookID: string}) => {
    if(props.userID){
        const docRef = doc(db, "cookbooks", props.bookID);
        const docSnap = await getDoc(docRef);
        let docRecipes: string[];

        if (docSnap.exists()) {
            docRecipes = docSnap.get("recipes");
            if(docRecipes.length > 0) {
                docRecipes = docRecipes.concat(props.recipeIDs);
            }
            else {
                docRecipes= props.recipeIDs;
            }
            await updateDoc(doc(db, "cookbooks", props.bookID), {
                recipes: docRecipes,
            }) 
        }
    }
}
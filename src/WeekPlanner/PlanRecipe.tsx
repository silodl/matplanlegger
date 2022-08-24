import { updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../Firebase";

export const PlanRecipe = async(props: {recipeID: string, day: number, week: number, userID: string}) => {
    if(props.userID){
        const docRef = doc(db, "users", props.userID, "weeks", props.week.toString());
        const docSnap = await getDoc(docRef);
        let docRecipes: {[key: string]: string[]};
        if (docSnap.exists()) {
            docRecipes = docSnap.get("recipes");
            if(docRecipes[props.day] && docRecipes[props.day].length > 0) {
                docRecipes[props.day].push(props.recipeID);
            }
            else {
                docRecipes[props.day] = [props.recipeID];
            }
            await updateDoc(doc(db, "users", props.userID, "weeks", props.week.toString()), {
                recipes: docRecipes,
            }) 
        }
        else {
            docRecipes = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[]}
            docRecipes[props.day] = [props.recipeID];
            await setDoc(doc(db, "users", props.userID, "weeks", props.week.toString()), {
                recipes: docRecipes,
            }) 
        }
    }
}
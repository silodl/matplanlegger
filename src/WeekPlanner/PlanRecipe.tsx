import { updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../Firebase";

export const PlanRecipe = async(props: {recipeIDs: string[], day?: number, week: number, userID: string}) => {
    if(props.userID){
        const docRef = doc(db, "users", props.userID, "weeks", props.week.toString());
        const docSnap = await getDoc(docRef);
        let docRecipes: {[key: string]: string[]};
        docRecipes = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[]}
        if (docSnap.exists()) {
            if(props.day && props.recipeIDs.length === 1) {
                docRecipes = docSnap.get("recipes");
                if(docRecipes[props.day] && docRecipes[props.day].length > 0) {
                    docRecipes[props.day].push(props.recipeIDs[0]);
                }
                else {
                    docRecipes[props.day] = [props.recipeIDs[0]];
                }
            }
            else if(props.recipeIDs.length === 7) {
                props.recipeIDs.forEach((recipeID) => {
                    const index = props.recipeIDs.indexOf(recipeID);
                    docRecipes[index.toString()] = [recipeID];
                })
            }
            await updateDoc(doc(db, "users", props.userID, "weeks", props.week.toString()), {
                recipes: docRecipes,
            })
        }
        else {
            docRecipes = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[]}
            if(props.day) {
                docRecipes[props.day] = [props.recipeIDs[0]];
                await setDoc(doc(db, "users", props.userID, "weeks", props.week.toString()), {
                    recipes: docRecipes,
                }) 
            }
        }
    }
}
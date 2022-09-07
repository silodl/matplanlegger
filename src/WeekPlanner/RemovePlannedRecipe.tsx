import {db} from '../Firebase';
import {doc, collection, query, where, getDocs, updateDoc, onSnapshot} from 'firebase/firestore';
import { User } from 'firebase/auth';

export const RemovePlannedRecipe = async(props: {recipeID: string, user: User, weekID?: string, daynr?: string}) => {

    if(props.weekID && props.daynr) {
        onSnapshot(doc(db, "users", props.user.uid, "weeks", props.weekID), async (docSnap) => {
            if (docSnap.exists()) {
                const recipes: {[id: string]: string[]} = docSnap.get("recipes");
                const weekRecipeIDs: string[] = docSnap.get("recipeIDs");
                const id = docSnap.id;
                
                Object.entries(recipes).forEach(async([daynr, recipeIDs]) => {
                    if(recipeIDs.includes(props.recipeID) && daynr === props.daynr) {
                        const index = recipeIDs.indexOf(props.recipeID);
                        recipeIDs.splice(index, 1);
                        recipes[daynr] = recipeIDs;
                        const i = weekRecipeIDs.indexOf(props.recipeID);
                        weekRecipeIDs.splice(i, 1);
                        await updateDoc(doc(db, "users", props.user.uid, "weeks", id), {
                            recipes: recipes,
                            recipeIDs: weekRecipeIDs,
                        })
                    }
                })
            }
        })
    }
    else {
        const q = query(collection(db, "users", props.user.uid, "weeks"), where("recipeIDs", "array-contains", props.recipeID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async(docSnap) => {
            if(docSnap.exists()) {
                const recipes: {[id: string]: string[]} = docSnap.get("recipes");
                const weekRecipeIDs: string[] = docSnap.get("recipeIDs");
                const id = docSnap.id;
                Object.entries(recipes).forEach(async([daynr, recipeIDs]) => {
                    if (recipeIDs.includes(props.recipeID)) {
                        const index = recipeIDs.indexOf(props.recipeID);
                        recipeIDs.splice(index, 1);
                        recipes[daynr] = recipeIDs;
                        const i = weekRecipeIDs.indexOf(props.recipeID);
                        weekRecipeIDs.splice(i, 1);
                        await updateDoc(doc(db, "users", props.user.uid, "weeks", id), {
                            recipes: recipes,
                            recipeIDs: weekRecipeIDs,
                        }) 
                    } 
                }) 
            }
        });   
        }
}
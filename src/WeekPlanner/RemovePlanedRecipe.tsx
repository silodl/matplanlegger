import {db} from '../Firebase';
import {doc, collection, query, where, getDocs, updateDoc, onSnapshot} from 'firebase/firestore';
import { User } from 'firebase/auth';

export const RemovePlanedRecipe = async(props: {recipeID: string, user: User, weekID?: string, daynr?: string}) => {

    if(props.weekID && props.daynr) {
        onSnapshot(doc(db, "users", props.user.uid, "weeks", props.weekID), async (docSnap) => {
            if (docSnap.exists()) {
                const recipes: {[id: string]: string[]} = docSnap.get("recipes");
                const id = docSnap.id;
                
                Object.entries(recipes).forEach(async([daynr, recipeIDs]) => {
                    if(recipeIDs.includes(props.recipeID) && daynr === props.daynr) {
                        const index = recipeIDs.indexOf(props.recipeID);
                        recipeIDs.splice(index, 1);
                        recipes[daynr] = recipeIDs;
                        await updateDoc(doc(db, "users", props.user.uid, "weeks", id), {
                            recipes: recipes,
                        })
                    }
                })
            }
        })
    }
    else {
        const q = query(collection(db, "users", props.user.uid, "weeks"), where("recipes", "array-contains", props.recipeID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async(docSnap) => {
            if(docSnap.exists()) {
                const recipes: string[] = docSnap.get("recipes");
                const id = docSnap.id;
                if (recipes.includes(props.recipeID)) {
                    const index = recipes.indexOf(props.recipeID);
                    recipes.splice(index, 1);
                    await updateDoc(doc(db, "users", props.user.uid, "weeks", id), {
                        recipes: recipes,
                    }) 
                } 
            }
        });   
        }
}
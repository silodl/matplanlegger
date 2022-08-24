import {db} from '../Firebase';
import {doc, collection, query, where, getDocs, updateDoc, onSnapshot} from 'firebase/firestore';
import { User } from 'firebase/auth';


export const RemoveRecipeFromBook = async(props: {recipeID: string, user: User, bookID?: string}) => {

    if(props.bookID) {
        onSnapshot(doc(db, "cookbooks", props.bookID), async (docSnap) => {
            if (docSnap.exists()) {
                const recipes: string[] = docSnap.get("recipes");
                const id = docSnap.id;
                if (recipes.includes(props.recipeID)) {
                    const index = recipes.indexOf(props.recipeID);
                    recipes.splice(index, 1);
                    await updateDoc(doc(db, "cookbooks", id), {
                        recipes: recipes,
                    }) 
                }
            }
        })
    }
    else {
        const q = query(collection(db, "cookbooks"), where("owners", "array-contains", props.user.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async(docSnap) => {
            if(docSnap.exists()) {
                const recipes: string[] = docSnap.get("recipes");
                const id = docSnap.id;
                if (recipes.includes(props.recipeID)) {
                    const index = recipes.indexOf(props.recipeID);
                    recipes.splice(index, 1);
                    await updateDoc(doc(db, "cookbooks", id), {
                        recipes: recipes,
                    }) 
                }
            }
        });
    }
}
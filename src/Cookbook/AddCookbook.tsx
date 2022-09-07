import { addDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';

export type CookbookComponent = {
    name: string,
    owners: string[],
}

export const AddCookbook = async (cookbook: CookbookComponent) => {

    if (cookbook.owners) {
        await addDoc(collection(db, "cookbooks"), {
            name: cookbook.name,
            owners: cookbook.owners,
            recipes: [],
        }) 
    }
 
}
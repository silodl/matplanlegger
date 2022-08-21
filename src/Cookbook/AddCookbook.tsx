import { addDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';
import { User } from '@firebase/auth';

export type CookbookComponent = {
    name: string,
    user: User| undefined,
}

export const AddCookbook = async (cookbook: CookbookComponent) => {

    if (cookbook.user) {
       const newDoc = await addDoc(collection(db, "users", cookbook.user.uid, "cookbooks"), {
            name: cookbook.name,
        }) 

        if (newDoc) {
            window.location.href = "/kokebok";
        }
    }
 
}
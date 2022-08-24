import { updateDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";
import { CookbookProps } from "./UseCookbooks";


export const UpdateCookbook = async(cookbook: CookbookProps) => {

    await updateDoc(doc(db, "cookbooks", cookbook.id), {
        name: cookbook.name,
        owners: cookbook.owners,
    }) 
}
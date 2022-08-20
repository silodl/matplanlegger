import {db} from '../Firebase';
import {addDoc, collection, DocumentData, DocumentReference} from 'firebase/firestore';

export interface Recipe {
    url?: string,
    file?: FileList| null,
    name: string,
    category: string,
    image: string,
    time: string,
    tags: string[],
    userID: string,
    id: string,
}

export const AddRecipe = async (props: Recipe) => {
    if(props.userID){
        let newDoc: DocumentReference<DocumentData>;
        if(props.file) {
            newDoc = await addDoc(collection(db, "users", props.userID, "recipes"), {
                file: props.file,
                name: props.name,
                category: props.category,
                image: props.image,
                time: props.time,
                tags: props.tags,
            });
        }
        else {
            newDoc = await addDoc(collection(db, "users", props.userID, "recipes"), {
                url: props.url,
                name: props.name,
                category: props.category,
                image: props.image,
                time: props.time,
                tags: props.tags,
            });
        }
        
        if (newDoc) {
            window.location.href = "/oppskrifter";
        }
    }      
}
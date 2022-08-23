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
    owner: string,
    id: string,
}

export const AddRecipe = async (props: Recipe) => {
    if(props.owner){
        let newDoc: DocumentReference<DocumentData>;
        if(props.file) {
            newDoc = await addDoc(collection(db, "recipes"), {
                file: props.file,
                name: props.name,
                category: props.category,
                image: props.image,
                time: props.time,
                tags: props.tags,
                owner: props.owner,
            });
        }
        else {
            newDoc = await addDoc(collection(db, "recipes"), {
                url: props.url,
                name: props.name,
                category: props.category,
                image: props.image,
                time: props.time,
                tags: props.tags,
                owner: props.owner,
            });
        }
        
        if (newDoc) {
            window.location.href = "/oppskrifter";
        }
    }      
}
import {db} from '../Firebase';
import {addDoc, collection} from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

export interface NewRecipeInterface {
    url?: string,
    file?: File,
    name: string,
    category: string,
    image?: string | File,
    time: string,
    tags: string[],
    owner: string,
    id: string, 
}

export interface Recipe {
    url?: string,
    file?: string,
    name: string,
    category: string,
    image?: string,
    time: string,
    tags: string[],
    owner: string,
    id: string,
}

export const AddRecipe = async (props: NewRecipeInterface) => {
    if(props.owner){
        if(props.file) {
            const storage = getStorage();
            const fileRef = ref(storage, `files/${props.file}`);
            /*let image = props.image;
            if(props.image) {
                const imageRef = ref(storage, `images/${props.image}`);
                image = imageRef.fullPath;
            }*/
            uploadBytesResumable(fileRef, props.file);
            await getDownloadURL(fileRef)
            .then(async(file) => {
                await addDoc(collection(db, "recipes"), {
                file: file,
                name: props.name,
                category: props.category,
                image: props.image,
                time: props.time,
                tags: props.tags,
                owner: props.owner,
                })
                .then( () => {
                    window.location.href = "/oppskrifter";
                })
            })
            
        }
        else if(props.url) {
            await addDoc(collection(db, "recipes"), {
                url: props.url,
                name: props.name,
                category: props.category,
                image: props.image,
                time: props.time,
                tags: props.tags,
                owner: props.owner,
            })
            .then( () => {
                window.location.href = "/oppskrifter";
            })
        }
        
    }      
}
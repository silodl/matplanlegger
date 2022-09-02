import {db} from '../Firebase';
import {addDoc, collection} from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { CookbookProps } from '../Cookbook/UseCookbooks';
import { AddRecipeToCookbook } from '../Cookbook/AddRecipeToCookbook';

export interface NewRecipeInterface {
    url?: string,
    file?: File,
    name: string,
    category: string,
    image?: string | File,
    time: string,
    tags: string[],
    owner: string,
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

const AddToCookbook = (recipeID: string, userID: string, books: CookbookProps[]) => {
    books.forEach((cookbook) => {
        AddRecipeToCookbook({recipeID, userID, bookID: cookbook.id});
    })
    window.location.href = "/oppskrifter";
}

export const AddRecipe = async (props: NewRecipeInterface, addToCookbook: CookbookProps[]) => {
    if(props.owner){
        if(props.file) {
            const storage = getStorage();
            const fileRef = ref(storage, `files/${props.file}`);
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
                .then((document) => {
                    AddToCookbook(document.id, props.owner, addToCookbook);
                    //window.location.href = "/oppskrifter";
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
            .then((document) => {
                AddToCookbook(document.id, props.owner, addToCookbook);
                //window.location.href = "/oppskrifter";
            })
        }


    }   
}
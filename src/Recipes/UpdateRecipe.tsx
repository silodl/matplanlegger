import { updateDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Recipe } from "./AddRecipe";

export const UpdateRecipe = async(props: {recipe: Recipe, imageFile?: File}) => {

    if(props.imageFile) {
        const storage = getStorage();
        const fileRef = ref(storage, `images/${props.imageFile}`);
        uploadBytesResumable(fileRef, props.imageFile);
        await getDownloadURL(fileRef)
        .then(async(imageUrl) => {
            await updateDoc(doc(db, "recipes", props.recipe.id), {
                name: props.recipe.name,
                tags: props.recipe.tags,
                time: props.recipe.time,
                image: imageUrl,
            }) 
        })
        
    }
    else {
        await updateDoc(doc(db, "recipes", props.recipe.id), {
            name: props.recipe.name,
            tags: props.recipe.tags,
            time: props.recipe.time,
        }) 
    }
}
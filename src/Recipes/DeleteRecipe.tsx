import {db} from '../Firebase';
import {doc, deleteDoc} from 'firebase/firestore';
import { Recipe } from './AddRecipe';
import { RemoveRecipeFromBook } from '../Cookbook/RemoveRecipeFromBook';
import { RemovePlannedRecipe } from '../WeekPlanner/RemovePlannedRecipe';
import { User } from 'firebase/auth';

export const DeleteRecipe = (props: {recipe: Recipe, user: User}) => {

    if(props.user && props.recipe){
        if (props.recipe.owner === props.user.uid) {
            
            return new Promise<void>(async(resolve, reject) => {

                const step1 = await RemovePlannedRecipe({recipeID: props.recipe.id, user: props.user})
                const step2 = await RemoveRecipeFromBook({recipeID: props.recipe.id, user: props.user})
                const step3 = await deleteDoc(doc(db, "recipes", props.recipe.id))

                Promise.allSettled([step1, step2, step3])
                .then((values) => {
                    let finished = 0
                    values.forEach((value) => {
                        if(value.status === "fulfilled") {
                            finished += 1;
                        }
                    })
                    if(finished === 3) {
                        resolve()
                    }
                    else {
                        reject()
                    }
                })
            })
        }
    }
}
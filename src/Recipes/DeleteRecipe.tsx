import {db} from '../Firebase';
import {doc, deleteDoc} from 'firebase/firestore';
import { Recipe } from './AddRecipe';
import { RemoveRecipeFromBook } from '../Cookbook/RemoveRecipeFromBook';
import { RemovePlanedRecipe } from '../WeekPlanner/RemovePlanedRecipe';
import { User } from 'firebase/auth';

export const DeleteRecipe = async (props: {recipe: Recipe, user: User}) => {

    if(props.user && props.recipe){
        if (props.recipe.owner === props.user.uid) {
            await deleteDoc(doc(db, "recipes", props.recipe.id));
             
            // remove from cookbook
           RemoveRecipeFromBook({recipeID: props.recipe.id, user: props.user});

            // remove from planned weeks
            RemovePlanedRecipe({recipeID: props.recipe.id, user: props.user});
        }
    }      
}
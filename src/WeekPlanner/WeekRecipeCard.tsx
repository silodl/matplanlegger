import { Recipe } from '../Recipes/AddRecipe';
import './WeekRecipeCard.css';
import clock from '../Images/Icons/Clock.svg';
import { Tag } from "../Components/Tag";


export const WeekRecipeCard = (props: {recipe: Recipe}) => {

    return(
        <div className="sideCard">  
            <img className='recipeImage' src={props.recipe.image} alt="food"/>
            <div className="recipeInfo">
                <div className='recipeTitle'> {props.recipe.name} </div>
                <div className="cookTime"><img src={clock} alt="clock"/>{props.recipe.time}</div>
                {props.recipe.tags.length > 0 && (<Tag tags={props.recipe.tags} />)}
            </div>
            
        </div>
    )
}
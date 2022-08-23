import { Recipe } from '../Recipes/AddRecipe';
import clock from '../Images/Icons/Clock.svg';
import { Tag } from '../Components/Tag';
import './RecipeCard.css';

export const Card = (props: {recipe: Recipe}) => {

    const LoadRecipe = (id: string) => {
        window.location.href = `/oppskrifter/${id}`;
    }

    return(
        <div className="card" onClick={() => LoadRecipe(props.recipe.id)}>  
            <img className='recipeImage' src={props.recipe.image} alt="food"/>
            <div className="recipeInfo">
                <div className="recipeTitle">{props.recipe.name}</div>
                <div className="cookTime"><img src={clock} alt="clock"/>{props.recipe.time}</div>
                {props.recipe.tags.length > 0 && (<Tag tags={props.recipe.tags} />)}
                </div>
        </div>
    )
}
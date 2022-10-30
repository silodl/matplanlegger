import { Recipe } from '../Recipes/AddRecipe';
import './WeekRecipeCard.css';
import clock from '../Images/Icons/Clock.png';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import React, { useState } from 'react';
import { RemovePlannedRecipe } from './RemovePlannedRecipe';
import { EditRecipe } from '../Recipes/EditRecipe';
import recipeCover from '../Images/Icons/EmptyRecipe.svg';
import remove from '../Images/Icons/Remove.png';
import edit from '../Images/Icons/Edit.png';

export const WeekRecipeCard = (props: {recipe: Recipe, week: string, daynr: string}) => {

    const [doEditRecipe, setDoEditRecipe] = useState(false);
    const user = useLoggedInUser();

    const loadRecipe = () => {
        if(props.recipe.url) {
            window.open(props.recipe.url, "_blank");
        }
        else {
            window.location.pathname = `/oppskrifter/${props.recipe.id}`;
        }
    }

    const removeRecipe = () => {
        if(user) {
            RemovePlannedRecipe({recipeID: props.recipe.id, user, weekID: props.week, daynr: props.daynr})
        }
    }

    return( 
        <>
            {doEditRecipe && (
                <EditRecipe recipe={props.recipe} avbryt={() => setDoEditRecipe(false)}/>
            )}
            <>
                <div className="sideCard">  

                    {props.recipe.image !== "" 
                    ? <img className='recipeImage' loading='lazy' src={typeof(props.recipe.image) === "string" ? props.recipe.image : ""} alt="food" onClick={() => loadRecipe()}/>
                    : <img className='recipeImage' loading='lazy' 
                        style={{width: "20%", padding: "0 10%", objectFit: "contain", backgroundColor: "var(--color-primary)"}} src={recipeCover} alt="recipe cover"
                        onClick={() => loadRecipe()}/>
                    }

                    <div className="recipeInfo">
                        <div className='recipeTitle'> {props.recipe.name} <p/> </div>
                        <div className="cookTime"><img loading='lazy' src={clock} alt="clock" width="20px"/>{props.recipe.time}</div>
                        <div className="centerElements">
                            <div className="button" style={{backgroundColor: "#FF9F0A", padding: "0 25px", border: "none"}} onClick={() => loadRecipe()}> Vis </div>
                            <div className="centerElements">
                                <img src={edit} alt="edit" width="20px" onClick={() => setDoEditRecipe(true)}/>
                                <img src={remove} alt="remove" width="22px" onClick={() => removeRecipe()}/>
                            </div>
                        </div>
                   </div>
                </div>
            </>
        </>
    )
}
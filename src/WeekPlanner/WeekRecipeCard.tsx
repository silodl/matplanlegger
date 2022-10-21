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
import more from '../Images/Icons/More.png';


export const WeekRecipeCard = (props: {recipe: Recipe, week: string, daynr: string}) => {

    const [doEditRecipe, setDoEditRecipe] = useState(false);
    const [viewOptions, setViewOptions] = useState(false);
    const user = useLoggedInUser();

    const loadRecipe = () => {
        if(!viewOptions) {
            if(props.recipe.url) {
                window.open(props.recipe.url, "_blank");
            }
            else {
                window.location.pathname = `/oppskrifter/${props.recipe.id}`;
            }
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
                    ? <img className='recipeImage' loading='lazy' src={typeof(props.recipe.image) === "string" ? props.recipe.image : ""} alt="food" style={{opacity: (viewOptions ? "0.5" : "0.8")}}/>
                    : <img className='recipeImage' loading='lazy' style={{width: "20%", padding: "0 10%", objectFit: "contain", backgroundColor: "var(--color-primary)"}} src={recipeCover} alt="recipe cover"/>
                    }

                    <div style={{position: "relative", left: "170px", top: "2px"}}>
                        <div className="moreOptions" tabIndex={0} onBlur={() => setViewOptions(false)}
                        onClick={() => setViewOptions(true)}>
                        <img src={more} alt="more" width="20px"/>
                        {viewOptions && (
                            <>
                            <img src={edit} alt="edit" width="20px" onClick={() => setDoEditRecipe(true)}/>
                            <img src={remove} alt="remove" width="22px" onClick={() => removeRecipe()}/>
                            </>
                        )}
                    </div></div>

                    <div className="recipeInfo" style={{opacity: (viewOptions ? "0.5" : "1")}}>
                        <div className='recipeTitle'> {props.recipe.name} <p/> </div>
                        <div className="cookTime"><img loading='lazy' src={clock} alt="clock" width="20px"/>{props.recipe.time}</div>
                        <div className="button" style={{backgroundColor: "#bed0ef", padding: "0 30px", border: "none", margin: "auto"}} onClick={() => loadRecipe()}> Vis </div>
                    </div>
                </div>
            </>
        </>
    )
}
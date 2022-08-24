import { Recipe } from '../Recipes/AddRecipe';
import './WeekRecipeCard.css';
import clock from '../Images/Icons/Clock.svg';
import { Tag } from "../Recipes/Tag";
import more from '../Images/Icons/More.svg';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import React, { useState } from 'react';
import { RemovePlanedRecipe } from './RemovePlanedRecipe';
import { EditRecipe } from '../Recipes/EditRecipe';


export const WeekRecipeCard = (props: {recipe: Recipe, week: string, daynr: string}) => {

    const [doEditRecipe, setDoEditRecipe] = useState(false);
    const [viewMoreOptions, setViewMoreOptions] = useState(false);
    const options = (window.location.pathname) === "/oppskrifter" ? ["endre", "slett"] : ["endre", "fjern"];
    const user = useLoggedInUser();

    const LoadRecipe = (id: string) => {
        window.location.href = `/oppskrifter/${id}`;
    }

    const HandleClick = (action: string) => {

        if (action === "edit") {
            setDoEditRecipe(true); 
        }
        else if (action === "delete" && user) {
            RemovePlanedRecipe({recipeID: props.recipe.id, user, weekID: props.week, daynr: props.daynr})
        }
        else if (action === "view") {
            LoadRecipe(props.recipe.id)
        }        
    }

    return(
        <>
            {doEditRecipe && (
                <EditRecipe recipe={props.recipe} avbryt={() => setDoEditRecipe(false)}/>
            )}
            <div>
                <div className="moreButton" style={{width: "300px"}} onClick={() => setViewMoreOptions(!viewMoreOptions)}> 
                    <div className="moreButtonContent">
                        <img src={more} alt="remove"/>
                        
                        {viewMoreOptions && (
                            <>
                                <div onClick={() => HandleClick("edit")}> endre </div>
                                <div onClick={() => HandleClick("delete")}> {options[1]} </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="sideCard" onClick={() => LoadRecipe(props.recipe.id)}>  
                    <img className='recipeImage' src={props.recipe.image} alt="food"/>
                    <div className="recipeInfo">
                        <div className='recipeTitle'> {props.recipe.name} </div>
                        <div className="cookTime"><img src={clock} alt="clock"/>{props.recipe.time}</div>
                        {props.recipe.tags.length > 0 && (<Tag tags={props.recipe.tags} />)}
                    </div>
                    
                </div>
            </div>
        </>
    )
}
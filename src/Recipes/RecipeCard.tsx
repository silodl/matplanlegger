import { Recipe } from './AddRecipe';
import clock from '../Images/Icons/Clock.svg';
import { Tag } from './Tag';
import './RecipeCard.css';
import React, { useState } from 'react';
import { EditRecipe } from './EditRecipe';
import more from '../Images/Icons/More.svg';
import { DeleteRecipe } from './DeleteRecipe';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { RemoveRecipeFromBook } from '../Cookbook/RemoveRecipeFromBook';
import recipeCover from '../Images/Icons/EmptyRecipe.svg';

export const Card = (props: {recipe: Recipe, clickable: boolean, bookID?: string}) => {

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
        else if (action === "delete") {
            if(window.location.pathname === "/oppskrifter" && user) {
                DeleteRecipe({recipe: props.recipe, user})
            }
            else if(window.location.pathname.includes("/kokebok") && user) {
                RemoveRecipeFromBook({recipeID: props.recipe.id, user, bookID: props.bookID})
            }
        }
        else if (action === "view") {
            LoadRecipe(props.recipe.id)
        }        
    }

    return(
        <>
            {doEditRecipe 
            ?
            <EditRecipe recipe={props.recipe} avbryt={() => setDoEditRecipe(false)}/>
            :
            <div>
                {props.clickable && (
                    <div className="moreButton" onClick={() => setViewMoreOptions(!viewMoreOptions)} 
                    tabIndex={0} onBlur={() => setViewMoreOptions(false)}> 
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
                )}
                <div className={props.clickable ? "card clickable" : "card" } onClick={() => (props.clickable ? HandleClick("view") : "")}>  
                    {props.recipe.image !== "" 
                    ? <img className='recipeImage' src={props.recipe.image} alt="food"/>
                    : <img className='recipeImage' style={{width: "50%", padding: "0 25%", objectFit: "contain", backgroundColor: "var(--color-primary)"}} src={recipeCover} alt="recipe cover"/>
                    }
                    <div className="recipeInfo">
                        <div className="recipeTitle">{props.recipe.name}</div>
                        <div className="cookTime"><img src={clock} alt="clock"/>{props.recipe.time}</div>
                        {props.recipe.tags.length > 0 && (<Tag tags={props.recipe.tags} />)}
                    </div>
                </div>
            </div>
            }

        </>
    )
}
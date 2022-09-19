import { Recipe } from './AddRecipe';
import clock from '../Images/Icons/Clock.png';
import { Tag } from './Tag';
import './RecipeCard.css';
import React, { useState } from 'react';
import { EditRecipe } from './EditRecipe';
import more from '../Images/Icons/More.png';
import { DeleteRecipe } from './DeleteRecipe';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { RemoveRecipeFromBook } from '../Cookbook/RemoveRecipeFromBook';
import recipeCover from '../Images/Icons/EmptyRecipe.svg';
import checkmark from '../Images/Icons/Checkmark_black.svg';

export const Card = (props: {recipe: Recipe, clickable: boolean, bookID?: string}) => {

    const [doEditRecipe, setDoEditRecipe] = useState(false);
    const [viewMoreOptions, setViewMoreOptions] = useState(false);
    const options = (window.location.pathname) === "/oppskrifter" ? ["endre", "slett"] : ["endre", "fjern"];
    const user = useLoggedInUser();
    const [viewDelete, setViewDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFinishedDeleting, setIsFinishedDeleting] = useState(false);

    const LoadRecipe = (id: string) => {
        window.location.pathname = `/oppskrifter/${id}`;
    }

    const HandleClick = (action: string) => {

        if (action === "endre") {
            setDoEditRecipe(true); 
        }
        else if (action === "slett") {
            setViewDelete(true);
        }
        else if(action === "fjern" && user) {
            RemoveRecipeFromBook({recipeID: props.recipe.id, user, bookID: props.bookID})
        }
        else if (action === "view") {
            LoadRecipe(props.recipe.id)
        }        
    }

    const deleteRecipe = () => {
        if(window.location.pathname === "/oppskrifter" && user) {
            setIsDeleting(true);
            DeleteRecipe({recipe: props.recipe, user})
        }
    }

    return(
        <>
            {doEditRecipe 
            ?
            <EditRecipe recipe={props.recipe} avbryt={() => setDoEditRecipe(false)}/>
            :
            <div>
                {viewDelete && (
                    <div className="popup">
                        <div className="popupContent deleteAlert">
                            <div style={{display: "flex", flexWrap: "wrap"}}> Er du sikker på at du vil slette {props.recipe.name} ? </div>
                            <div className="centerElements">
                                <div className="button" onClick={() => setViewDelete(false)}> Avbryt </div>
                                <div className="deleteButton button" onClick={() => deleteRecipe()}> Slett </div>
                            </div>
                        </div>
                    </div>
                )}

                {isDeleting && (
                    <div className="popup dataLoader">
                        <div className="function">
                        {isFinishedDeleting
                        ? <> 
                            <div> Slettet! </div>
                            <div className="checkmarkCircle"><img src={checkmark} width="40px" alt="checkmark"/></div>
                        </>
                        : <>
                            <div> Sletter oppskriften </div>
                            <div className="loading"/>
                            </>
                        }
                        
                        </div>
                    </div>
                )}

                {props.clickable && (
                    <div className="moreButton" onClick={() => setViewMoreOptions(!viewMoreOptions)} 
                    tabIndex={0} onBlur={() => setViewMoreOptions(false)}> 
                        <div className="moreButtonContent">
                            <img src={more} alt="remove"/>
                        
                            {viewMoreOptions && (
                                <>
                                    <div onClick={() => HandleClick("endre")}> endre </div>
                                    <div onClick={() => HandleClick(options[1].toString())}> {options[1]} </div>
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
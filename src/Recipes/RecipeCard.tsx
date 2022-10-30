import { Recipe } from './AddRecipe';
import clock from '../Images/Icons/Clock.png';
import './RecipeCard.css';
import React, {useState } from 'react';
import { EditRecipe } from './EditRecipe';
import { DeleteRecipe } from './DeleteRecipe';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { RemoveRecipeFromBook } from '../Cookbook/RemoveRecipeFromBook';
import recipeCover from '../Images/Icons/EmptyRecipe.svg';
import checkmark from '../Images/Icons/Checkmark.svg';
import edit from '../Images/Icons/Edit.png';
import deleteIcon from '../Images/Icons/Delete.png';
import remove from '../Images/Icons/Remove.png';

export const Card = (props: {recipe: Recipe, bookID?: string, isSelected?: boolean, hasOptions: boolean}) => {

    const [doEditRecipe, setDoEditRecipe] = useState(false);
    const user = useLoggedInUser();
    const [viewDelete, setViewDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFinishedDeleting, setIsFinishedDeleting] = useState(false);
    const path = window.location.pathname;

    const loadRecipe = () => {
        if(props.recipe.url) {
            window.open(props.recipe.url, "_blank");
        }
        else {
            window.location.pathname = `/oppskrifter/${props.recipe.id}`;
        } 
    }

    const deleteRecipe = () => {
        if(window.location.pathname === "/oppskrifter" && user) {
            setIsDeleting(true);
            DeleteRecipe({recipe: props.recipe, user});
        }
    }

    const removeRecipe = () => {
        if(user) {
            RemoveRecipeFromBook({recipeID: props.recipe.id, user, bookID: props.bookID});
        }
    }

    return(
        <>
            {doEditRecipe 
            ?
            <EditRecipe recipe={props.recipe} avbryt={() => setDoEditRecipe(false)}/>
            :
            <>
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

                <div className={props.isSelected ? "card selected" : "card"}>   

                    {props.recipe.image !== "" 
                    ? <img className='recipeImage' loading='lazy' src={props.recipe.image} alt="food" onClick={() => loadRecipe()}/>
                    : <img className='recipeImage' loading='lazy' 
                        style={{width: "50%", padding: "0 25%", objectFit: "contain", backgroundColor: "var(--color-primary)"}} src={recipeCover} alt="recipe cover"
                        onClick={() => loadRecipe()}/>
                    }

                    <div className="recipeInfo">
                        <div className="recipeTitle">{props.recipe.name}</div>
                        <div className="cookTime"><img loading='lazy' src={clock} alt="clock" width="20px"/>{props.recipe.time}</div>
                        {props.hasOptions && (
                            <div className="centerElements" style={{padding: "10px 0"}}>                        
                                <div className="button recipeButton" onClick={() => loadRecipe()}> Vis </div>
                                <div style={{display: "flex"}}>
                                    <img src={edit} width="20px" alt="edit" onClick={() => setDoEditRecipe(true)}/>
                                    {path === "/oppskrifter" && (<img onClick={() => setViewDelete(true)} src={deleteIcon} width="20px" alt="delete"/>)}
                                    {path !== "/oppskrifter" && (<img onClick={() => removeRecipe()} src={remove} width="20px" alt="remove"/>)}
                                </div>
                            </div>
                        )}
                    </div>

                </div>

            </>
            }
        </>
    )
}
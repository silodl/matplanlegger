import { Recipe } from './AddRecipe';
import clock from '../Images/Icons/Clock.png';
import { Tag } from './Tag';
import './RecipeCard.css';
import downArrow from '../Images/Icons/DownArrow.png';
import upArrow from '../Images/Icons/UpArrow.png';
import React, { useEffect, useState } from 'react';
import { EditRecipe } from './EditRecipe';
import { DeleteRecipe } from './DeleteRecipe';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { RemoveRecipeFromBook } from '../Cookbook/RemoveRecipeFromBook';
import recipeCover from '../Images/Icons/EmptyRecipe.svg';
import checkmark from '../Images/Icons/Checkmark.svg';

export const Card = (props: {recipe: Recipe, bookID?: string, isSelected?: boolean, hasOptions: boolean}) => {

    const [doEditRecipe, setDoEditRecipe] = useState(false);
    const user = useLoggedInUser();
    const [viewDelete, setViewDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFinishedDeleting, setIsFinishedDeleting] = useState(false);
    const [viewOptions, setViewOptions] = useState(false);
    const [tagOverflow, setTagOverflow] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const LoadRecipe = (id: string, url: string | undefined) => {
        if(url) {
            window.open(url, "_blank");
        }
        else {
            window.location.pathname = `/oppskrifter/${id}`;
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

    useEffect(() => {
        let recipeInfo = document.getElementById(`tags${props.recipe.id}`);
        if(recipeInfo && recipeInfo.scrollHeight > 26) {
            setTagOverflow(true);
        }
    },[props.recipe])

    useEffect(() => {
        let options = document.getElementById("options");
        if(options) {
            options.focus();
        }
    },[viewOptions])

    useEffect(() => {
        setViewOptions(false);
    },[doEditRecipe])

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

                <div className={props.isSelected ? "card selected" : "card"}  onClick={() => setViewOptions(true)}>   
                    {viewOptions && (
                        <div className="alignRecipeOptions" id="options" tabIndex={0} onBlur={() => setViewOptions(false)}>
                            <div className="recipeOptions">
                                <div onClick={() => LoadRecipe(props.recipe.id, props.recipe.url)}> Vis </div>
                                <div onClick={() => setDoEditRecipe(true)}> Endre </div>
                                {(window.location.pathname) === "/oppskrifter" && (<div onClick={() => setViewDelete(true)}> Slett </div>)}
                                {(window.location.pathname) !== "/oppskrifter" && (<div onClick={() => removeRecipe()}> Fjern </div>)}
                            </div>
                        </div>
                    )}  

                    {props.recipe.image !== "" 
                    ? <img className='recipeImage' loading='lazy' src={props.recipe.image} alt="food" style={{opacity: (viewOptions ? "0.5": "0.8")}}/>
                    : <img className='recipeImage' loading='lazy' style={{width: "50%", padding: "0 25%", objectFit: "contain", backgroundColor: "var(--color-primary)"}} src={recipeCover} alt="recipe cover"/>
                    }

                    
                    <div className={(isExpanded && props.isSelected === undefined) ? "recipeInfo recipeInfoExpanded" : "recipeInfo"}
                    style={{opacity: (viewOptions ? "0.5": "1")}}>
                        <div className="recipeTitle">{props.recipe.name}</div>
                        <div className="cookTime"><img loading='lazy' src={clock} alt="clock" width="18px"/>{props.recipe.time}</div>
                        {props.isSelected === undefined && (
                            <div className="recipeTags" id={`tags${props.recipe.id}`}>
                                {props.recipe.tags.length > 0 && (
                                    <Tag tags={props.recipe.tags}/>
                                )} 
                            </div>
                        )}
                    </div>
                    
                    {tagOverflow && (
                        <div className="expandButton">
                            {isExpanded 
                            ? <img src={upArrow} loading='lazy' alt="up arrow" width="30px" height="15px" onClick={() => setIsExpanded(false)}/>
                            : <img src={downArrow} loading='lazy' alt="down arrow" width="30px" height="15px" onClick={() => setIsExpanded(true)}/>
                            }
                        </div>
                    )}

                </div>

            </>
            }
        </>
    )
}
import { useState } from "react";
import { Recipe } from "./AddRecipe";
import clock from '../Images/Icons/Clock.png';
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { UpdateRecipe } from "./UpdateRecipe";
import { DeleteRecipe } from "./DeleteRecipe";
import './RecipeCard.css';
import recipeCover from '../Images/Icons/EmptyRecipe.svg';
import { Tag } from "./Tag";
import checkmark from '../Images/Icons/Checkmark.svg';
import { timeOptions } from "./NewRecipe";

export const EditRecipe = (props: {recipe: Recipe, avbryt: Function}) => {

    const [name, setName] = useState(props.recipe.name);
    const [time, setTime] = useState(props.recipe.time);
    const [tags, setTags] = useState(props.recipe.tags);
    const [viewTimeOptions, setViewTimeOptions] = useState(false);
    const [viewDelete, setViewDelete] = useState(false);
    const [image, setImage] = useState<File | undefined>();
    const [previewImage, setPreviewImage] = useState("");
    const user = useLoggedInUser();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFinishedDeleting, setIsFinishedDeleting] = useState(false);

    const [titleError, setTitleError] = useState<string | undefined>();

    const handleTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter" && e.target.value !== "") {
            if(tags) {
                let newArray = tags;
                newArray.push(e.target.value)
                setTags([...newArray])
            }
            else {
                setTags([e.target.value])
            }
            let tagField = window.document.getElementById("tagField") as HTMLInputElement
            if(tagField) {
                tagField.value = ""
            }
        }
    }

    const removeTag = (tag: string) => {
        if(tag && tags && tags.includes(tag)) {
            let newArray = tags;
            const index = tags?.indexOf(tag)
            newArray?.splice(index, 1)
            setTags([...newArray]) 
        }
    }

    const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            const imageUrl = URL.createObjectURL(e.target.files[0])
            setPreviewImage(imageUrl);
            setImage(e.target.files[0]);
        }
    }

    const updateRecipe = () => {
        if (user) {
            if(name === "") {
                setTitleError("Legg til tittel")
            }
              else {
                const updatedRecipe: Recipe = props.recipe;
                updatedRecipe.name = name;
                updatedRecipe.tags = tags;
                updatedRecipe.time = time;
                UpdateRecipe({recipe: updatedRecipe, imageFile: image})
                .then(() => 
                props.avbryt())
              }
        }
    }

    const deleteRecipe = () => {
        if(user) {
            setIsDeleting(true);
            DeleteRecipe({recipe: props.recipe, user})
        }
    }

    return (
        <div className="popup">

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

            <div className="card popupContent">  
               {previewImage 
               ? <img className='recipeImage' src={previewImage} alt="new food cover"/>
               : (props.recipe.image)
                    ? <img className='recipeImage' src={props.recipe.image} alt="food"/>
                    : <img className='recipeImage' style={{width: "50%", padding: "0 25%", objectFit: "contain", backgroundColor: "var(--color-primary)"}} src={recipeCover} alt="recipe cover"/>
                }

                <input type="file" className="imageInput" accept="image/*" onChange={(e) => handleImageInput(e)}/>

                <div className="recipeInfo">
                    <div>
                        <div className="fieldTitle"> Tittel </div>
                        <input className="inputField" 
                            value={name} style={{width: "320px"}}
                            onChange={(e) => setName(e.target.value)}/>
                        {titleError && (<div className="errorMessage"> {titleError} </div> )} 
                    </div>
                    
                    <div>
                        <div className="fieldTitle"> Tid </div>
                        <div className="cookTime">
                            <img src={clock} alt="clock"/>
                            <div tabIndex={0} onBlur={() => setViewTimeOptions(false)}>
                                <div className={viewTimeOptions ? "selectField selectFieldOpen" :"selectField"} style={{width: "100px"}}
                                    onClick={() => setViewTimeOptions(!viewTimeOptions)}> {time} <div className="selectFieldArrow"/>
                                </div>

                                <div style={{position: "relative", top: 0}}><div style={{position: "absolute", height:"0"}}>
                                    {viewTimeOptions && (
                                        <div className='selectOptions' style={{width:"116px"}}>
                                            {timeOptions.map((timeOption) => {
                                            return(
                                                <div key={timeOption} className='option'
                                                onClick={() => (setTime(timeOption), setViewTimeOptions(false))}> {timeOption} </div>
                                            )
                                            })} 
                                        </div>
                                    )}
                                </div></div>
                            </div> 
                        </div>
                    </div>
                    
                    <div>
                        <div className="fieldTitle"> Tags <span style={{fontSize: "14px"}}>(maks 4)</span> </div>
                        <input type="text" id="tagField" className="inputField" onKeyDown={(e) => handleTags(e)}/>
                    </div>

                    {tags && (<Tag tags={tags} removable={true} onRemove={(tag) => removeTag(tag)} />)}
                    
                </div>

                <div className="centerElements" style={{padding: "10px"}}>
                    <div className="deleteButton button" onClick={() => setViewDelete(true)}> Slett </div>
                    <div style={{display: "flex", columnGap: "10px"}}>
                        <div className="button" onClick={() => props.avbryt()}> Avbryt </div>
                        <div className="primaryButton button" onClick={() => updateRecipe()}> Lagre </div>
                    </div>
                </div>

            </div>

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
        </div>
    )
}
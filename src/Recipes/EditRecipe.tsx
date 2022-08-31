import { useState } from "react";
import { Recipe } from "./AddRecipe";
import clock from '../Images/Icons/Clock.svg';
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { UpdateRecipe } from "./UpdateRecipe";
import { DeleteRecipe } from "./DeleteRecipe";
import './RecipeCard.css';
import recipeCover from '../Images/Icons/EmptyRecipe.svg';

export const EditRecipe = (props: {recipe: Recipe, avbryt: Function}) => {

    const [name, setName] = useState(props.recipe.name);
    const [time, setTime] = useState(props.recipe.time.split(" ")[0]);
    const [timeUnit, setTimeUnit] = useState(props.recipe.time.split(" ")[1]);
    const [tags, setTags] = useState(props.recipe.tags);
    const [viewTimeOptions, setViewTimeOptions] = useState(false);
    const [viewDelete, setViewDelete] = useState(false);
    const [image, setImage] = useState<File | undefined>();
    const [previewImage, setPreviewImage] = useState("");
    const user = useLoggedInUser();

    const handleTags = (tagString: string) => {
        if (tagString.includes(",")) {
            setTags(tagString.split(","))
        }
        else {
            setTags([tagString])
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
        const cookTime = time + " " + timeUnit
        if (user) {
            const updatedRecipe: Recipe = props.recipe;
            updatedRecipe.name = name;
            updatedRecipe.tags = tags;
            updatedRecipe.time = cookTime;
            UpdateRecipe({recipe: updatedRecipe, imageFile: image})
            .then(() => 
            props.avbryt())
        }
    }

    const deleteRecipe = (recipe: Recipe) => {
        if(user) {
           DeleteRecipe({recipe: recipe, user})
            .then(() => 
            props.avbryt()) 
        }
    }

    return (
        <div className="popup">
            <div className="card popupContent">  
               {previewImage 
               ? <img className='recipeImage' src={previewImage} alt="new food cover"/>
               : (props.recipe.image)
                    ? <img className='recipeImage' src={props.recipe.image} alt="food" style={{opacity: "0.5"}}/>
                    : <img className='recipeImage' style={{width: "50%", padding: "0 25%", objectFit: "contain", backgroundColor: "var(--color-primary)", opacity: "0.5"}} src={recipeCover} alt="recipe cover"/>
                }

                <input type="file" className="imageInput" accept="image/*" onChange={(e) => handleImageInput(e)}/>

                <div className="recipeInfo">
                    <div>
                        <div className="fieldTitle"> Tittel </div>
                        <input className="inputField" 
                            value={name} size={35}
                            onChange={(e) => setName(e.target.value)}/>
                    </div>
                    
                    <div>
                        <div className="fieldTitle"> Tidsbruk </div>
                        <div className="cookTime">
                            <img src={clock} alt="clock"/>

                            <input className="inputField" 
                            value={time} size={3}
                            onChange={(e) => setTime(e.target.value)}/>

                            <div tabIndex={0} onBlur={() => setViewTimeOptions(false)}>
                                <div className={viewTimeOptions? "selectField selectFieldOpen" :"selectField"} style={{width: "85px"}}
                                onClick={() => setViewTimeOptions(!viewTimeOptions)}> {timeUnit} <div className="selectFieldArrow"/> 
                                </div>

                                <div style={{position: "absolute", height:"0"}}>
                                {viewTimeOptions && (
                                    <div className='selectOptions' style={{width: "101px"}}>
                                    <div onClick={() => (setTimeUnit("minutter"), setViewTimeOptions(false))} className="option"> minutter </div>
                                    <div onClick={() => (setTimeUnit("timer"), setViewTimeOptions(false))} className="option"> timer </div>
                                    </div>
                                )}
                                </div>
          
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div className="fieldTitle"> Tags <span style={{fontSize: "14px"}}>(maks 4)</span> </div>
                        <input className="inputField" value={tags} size={30}
                            onChange={(e) => handleTags(e.target.value)}/>
                    </div>
                </div>

                <div className="centerElements" style={{padding: "10px"}}>
                    <div className="deleteButton button" onClick={() => setViewDelete(true)}> Slett </div>
                    <div style={{display: "flex", columnGap: "10px"}}>
                        <div className="secondaryButton button" onClick={() => props.avbryt()}> Avbryt </div>
                        <div className="primaryButton button" onClick={() => updateRecipe()}> Lagre </div>
                    </div>
                </div>

            </div>

            {viewDelete && (
                    <div className="popup">
                        <div className="popupContent deleteAlert">
                            <div style={{display: "flex", flexWrap: "wrap"}}> Er du sikker på at du vil slette {props.recipe.name} ? </div>
                            <div className="centerElements">
                                <div className="secondaryButton button" onClick={() => setViewDelete(false)}> Avbryt </div>
                                <div className="deleteButton button" onClick={() => deleteRecipe(props.recipe)}> Slett </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}
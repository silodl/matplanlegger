import { useState } from "react";
import { Recipe } from "./AddRecipe";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { UpdateRecipe } from "./UpdateRecipe";
import { DeleteRecipe } from "./DeleteRecipe";
import './RecipeCard.css';
import recipeCover from '../Images/Icons/EmptyRecipe.svg';
import checkmark from '../Images/Icons/Checkmark.svg';
import { timeOptions } from "./NewRecipe";
import { useTags } from "./UseTags";
import { SelectField } from "../Components/SelectField";
import { MultiselectField } from "../Components/MultiselectField";

export const EditRecipe = (props: {recipe: Recipe, avbryt: Function}) => {

    const [name, setName] = useState(props.recipe.name);
    const [time, setTime] = useState(props.recipe.time);
    const [tags, setTags] = useState(props.recipe.tags);
    const [viewDelete, setViewDelete] = useState(false);
    const [image, setImage] = useState<File | undefined>();
    const [previewImage, setPreviewImage] = useState("");
    const user = useLoggedInUser();
    const tagSuggestions =  useTags();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFinishedDeleting, setIsFinishedDeleting] = useState(false);

    const [titleError, setTitleError] = useState<string | undefined>();

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
                          value={name} style={{width: "310px"}}
                          onChange={(e) => setName(e.target.value)}/>
                      {titleError && (<div className="errorMessage"> {titleError} </div> )} 
                    </div>
                    
                    <div>
                      <div className="fieldTitle"> Tid </div>
                      <SelectField options={timeOptions} defaultValue={"20-40 min"} width={120} select={(time: string) => setTime(time)}/>
                    </div>

                    <div style={{paddingBottom: "120px"}}>
                      <div className="fieldTitle"> Tags </div>
                      <MultiselectField options={[...tagSuggestions]} placeholder="kylling" canWrite={true} width={150} select={(tags: string[]) => setTags(tags)}/>
                    </div>
                    
                </div>
                
                
                <div className="centerElements" style={{padding: "10px"}}>
                    <div className="deleteButton button" onClick={() => setViewDelete(true)}> Slett </div>
                    <div>
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
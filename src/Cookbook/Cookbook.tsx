import { useState } from 'react';
import { AppLayout } from '../App';
import { Card } from '../Recipes/RecipeCard';
import { Recipe } from '../Recipes/AddRecipe';
import { useParams } from 'react-router-dom';
import { useCookbook } from './UseCookbook';
import book from '../Images/book.png';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { ViewAllRecipes } from '../Recipes/ViewAllRecipes';
import { AddRecipeToCookbook } from './AddRecipeToCookbook';
import settings from '../Images/Icons/Settings.svg';
import { CookbookProps } from './UseCookbooks';
import { DeleteCookbook } from './DeleteCookbook';
import { UpdateCookbook } from './UpdateCookbook';
import '../App.css';

const EditCookbook = (props: {cookbook: CookbookProps, avbryt: Function}) => {
  const [name, setName] = useState(props.cookbook.name);
  const [share, setShare] = useState(props.cookbook.owners.length > 1 ? true: false);
  const [owners, setOwners] = useState<string[]>(props.cookbook.owners);
  const [viewDelete, setViewDelete] = useState(false);
  const user = useLoggedInUser();

  const handleOwners = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ownersString = e.target.value;
    if (ownersString.includes(",") && user && user.email) {
      setOwners(ownersString.split(",").concat([user.email]))
    }
    else if (user && user.email) {
      setOwners([ownersString, user.email])
    }
  }

  const deleteCookbook = () => {
    if(user) {
      DeleteCookbook({cookbook: props.cookbook, user})
      .then(() =>
      window.location.href = "/kokebok")
    }
  }

  const updateCookbook = () => {
    if (user) {
        const updatedCookbook: CookbookProps = props.cookbook;
        updatedCookbook.name = name;
        updatedCookbook.owners = owners;
        UpdateCookbook(updatedCookbook)
        .then(() => 
        props.avbryt())
    }
}

  return(
      <div className="popup">
        <div className="popupContent editCookbook">
          <div>
            <div className="fieldTitle"> Navn </div>
            <input className='inputField' style={{width: "330px"}}
              value={name} onChange={(e) => setName(e.target.value)}  
            />    
          </div>

          <div>
            <div className="fieldTitle alignCheckbox"> 
                <span onClick={() => setShare(!share)} className="checkbox">
                  {share && (
                      <div className="checkMark">
                        <div className="checkmark_stem"></div>
                        <div className="checkmark_kick"></div>
                      </div>
                    )}     
                </span> 
                Del med andre 
            </div>
          </div>
          {share ? 
            <input className='inputField' style={{width: "330px"}}
            value={owners} onChange={(e) => handleOwners(e)}/>  
          : null}
        
          <div className="centerElements" style={{marginTop: "15px"}}>
            <div className="deleteButton button" onClick={() => setViewDelete(true)}> Slett </div>
            <div style={{display: "flex", columnGap: "10px"}}>
              <div className="secondaryButton button" onClick={() => props.avbryt()}> Avbryt </div>
              <div className="primaryButton button" onClick={() => updateCookbook()}> Lagre </div>
            </div>
          </div>

        </div>

        {viewDelete && (
          <div className="popup">
              <div className="popupContent deleteAlert">
                  <div style={{display: "flex", flexWrap: "wrap"}}> Er du sikker på at du vil slette {props.cookbook.name} ? </div>
                  <div className="centerElements">
                      <div className="secondaryButton button" onClick={() => setViewDelete(false)}> Avbryt </div>
                      <div className="deleteButton button" onClick={() => deleteCookbook()}> Slett </div>
                  </div>
              </div>
          </div>
        )}
      </div>
  )
}

export const Cookbook = () => {

  const { id } = useParams();
  const {cookbook, recipes} = useCookbook({id});
  const user = useLoggedInUser();
  const [viewAllRecipes, setViewAllRecipes] = useState(false);
  const [doEditCookbook, setDoEditCookbook] = useState(false);


  const AddRecipe = async(recipeID: string) => {
    if (user && id) {
      AddRecipeToCookbook({recipeID, userID: user.uid, bookID: id})
      .then(() => setViewAllRecipes(false))
    }
  }

  return (
    <AppLayout>     
      {viewAllRecipes && (
        <ViewAllRecipes close={() => setViewAllRecipes(false)} action={(recipeID: string) => AddRecipe(recipeID)}/>
      )}

      {doEditCookbook && cookbook && (
        <EditCookbook cookbook={cookbook} avbryt={() => setDoEditCookbook(false)}/>
      )}

      {recipes.length > 0 
      ?
      <>
        <div className="pageHeader"> 
          <div className="left" onClick={() => setDoEditCookbook(true)}><img src={settings} alt="settings" width="30px"/></div>
          <div className='title'> {cookbook?.name} </div>
          <div className='right secondaryButton' onClick={() => setViewAllRecipes(true)}> 
            <span className="mobile mobileButton"> + </span> <span className="desktop button"> Legg til oppskrift </span>
          </div>
        </div>

        <div className='cardWrapper'>
          {recipes.map((recipe: Recipe) => {
            return(
              <Card key={recipe.url} recipe={recipe} clickable={true} bookID={id}/>
            )
          })}
        </div>
      </>
      : 
      <div className="emptyState">
        <div className='pageHeader'>
          <div className="left" onClick={() => setDoEditCookbook(true)}><img src={settings} alt="settings" width="30px"/></div>
          <div className='title'> {cookbook?.name} </div>
          <div></div>
        </div>
        
        <div> Boken har ingen oppskrifter enda </div>
        <img width={"200px"} src={book} alt="book"/>
        <div className='primaryButton button' onClick={() => setViewAllRecipes(true)}> 
          Legg til dens første oppskrift
        </div>
      </div>
      }
      
    </AppLayout>
  );
}
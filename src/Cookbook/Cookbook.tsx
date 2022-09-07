import { useEffect, useState } from 'react';
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
import checkmark from '../Images/Icons/Checkmark_color.svg';

const EditCookbook = (props: {cookbook: CookbookProps, avbryt: Function}) => {
  const [name, setName] = useState(props.cookbook.name);
  const [share, setShare] = useState(props.cookbook.owners.length > 1 ? true: false);
  const [owners, setOwners] = useState<string[]>(props.cookbook.owners);
  const [viewDelete, setViewDelete] = useState(false);
  const user = useLoggedInUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFinishedDeleting, setIsFinishedDeleting] = useState(false);

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
      setIsDeleting(true);
      DeleteCookbook({cookbook: props.cookbook, user})
      .then(() => {
        setIsFinishedDeleting(true);
        setTimeout(window.location.href = "/kokebok", 1000)
      })
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

        {isDeleting && (
          <div className="popup dataLoader">
            <div className="function">
              {isFinishedDeleting
              ? <> 
                  <div> Slettet! </div>
                  <div className="checkmarkCircle"><img src={checkmark} width="40px" alt="checkmark"/></div>
              </>
              : <>
                  <div> Sletter kokeboken </div>
                  <div className="loading"/>
                </>
              }
              
            </div>
          </div>
        )}


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
                      <img src={checkmark} id="checkmark" width="12px" alt="checkmark"/>
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
  const [isLoading, setIsLoading] = useState(true);
  const [loadCount, setLoadCount] = useState(1);

  useEffect(() => {
    if(loadCount > 1) {
      setIsLoading(false);
    }
    setLoadCount(loadCount + 1);
  }, [cookbook])

  const AddRecipe = async(recipeID: string) => {
    if (user && id) {
      AddRecipeToCookbook({recipeID, userID: user.uid, bookID: id})
      .then(() => setViewAllRecipes(false))
    }
  }

  return (
    <AppLayout>   

      {isLoading && (
        <div className="cardloading">
            {Array.from(Array(3).keys()).map((i) => {
              return(
                <div className="emptyCard" key={i}>
                  <div className="emptyContent">
                    <div className="emptyText" style={{width: "90%"}}/>
                    <div className="emptyText" style={{width: "70%"}}/>
                  </div> 
                </div>
              )
            })}
        </div>
      )} 

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
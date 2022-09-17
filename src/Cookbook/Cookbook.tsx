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
import checkmark from '../Images/Icons/Checkmark_black.svg';
import { categories, timeOptions } from "../Recipes/NewRecipe";
import { Tag } from "../Recipes/Tag";
import filter from '../Images/Icons/Filter.svg';
import close from '../Images/Icons/Close.svg';

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
  const user = useLoggedInUser();
  const [viewAllRecipes, setViewAllRecipes] = useState(false);
  const [doEditCookbook, setDoEditCookbook] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadCount, setLoadCount] = useState(1);
  const [recipeIDs, setRecipeIDs] = useState<string[]>([]);
  const [viewFilters, setViewFilters] = useState(false);
  const [chosenCategories, setChosenCategories] = useState<string[]>();
  const [tags, setTags] = useState<string[]>();
  const [time, setTime] = useState<string[]>();
  const [viewSearchField, setViewSearchField] = useState(false);
  const [searchWords, setSearchWords] = useState<string[]>([]);
  const {cookbook, recipes} = useCookbook(id, time, chosenCategories, tags, searchWords);

  useEffect(() => {
    if(loadCount > 1) {
      setIsLoading(false);
    }
    setLoadCount(loadCount + 1);
  }, [cookbook])

  useEffect(() => {
    setRecipeIDs([]);
    recipes.forEach((recipe) => {
      setRecipeIDs(old => [...old, recipe.id]);
    })
  },[recipes])

  const AddRecipeToBook = async(recipeID: string) => {
    if (user && id) {
      AddRecipeToCookbook({recipeID, userID: user.uid, bookID: id})
      .then(() => setViewAllRecipes(false))
    }
  }

  const handleCategories = (category: string) => {
    let checkmark = document.getElementById(`checkmark${category}`);
    let checkbox = document.getElementById(`checkbox${category}`);

    if(chosenCategories && chosenCategories.includes(category) && chosenCategories.length !== 6) {
        if(chosenCategories.length === 1) {
            setChosenCategories(undefined)
        }
        else {
            let newArray = chosenCategories;
            const index = newArray.indexOf(category);
            newArray.splice(index, 1);
            setChosenCategories([...newArray])
        }

        if(checkmark) {
            checkmark.className = "hiddenCheckmark"
        }
        if(checkbox) {
        checkbox.className = "checkbox"
        }
    }
    else {
        if(chosenCategories && chosenCategories.length !== 6) {
            let newArray = chosenCategories;
            newArray.push(category);
            setChosenCategories([...newArray])
        }
        else {
            setChosenCategories([category])
        }

        if(checkmark) {
            checkmark.className = ""
        }
        if(checkbox) {
            checkbox.className = "checkbox checked"
        }
    }
  }

  const handleTime = (timeOption: string) => {
    let checkmark = document.getElementById(`checkmark${timeOption}`);
    let checkbox = document.getElementById(`checkbox${timeOption}`);

    if(time && time.includes(timeOption) && time.length !== 5) {
        if(time.length === 1) {
            setTime(undefined)
        }
        else {
            let newArray = time;
            const index = newArray.indexOf(timeOption);
            newArray.splice(index, 1);
            setTime([...newArray])
        }

        if(checkmark) {
            checkmark.className = "hiddenCheckmark"
        }
        if(checkbox) {
        checkbox.className = "checkbox"
        }
    }
    else {
        if(time && time.length !== 5) {
            let newArray = time;
            newArray.push(timeOption);
            setTime([...newArray])
        }
        else {
            setTime([timeOption])
        }

        if(checkmark) {
            checkmark.className = ""
        }
        if(checkbox) {
            checkbox.className = "checkbox checked"
        }
    }
}

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

  const Header = () => {
    return (
        <div className="pageHeader fullHeader"> 
            <div className="left centerElements"> 
              <div className="secondaryButton filterButton" onClick={() => setViewFilters(true)}>
                <img src={filter} alt="filter" width="20px"/>  
                <span className="desktop"> Filtrer </span> 
              </div>

              <input className="searchField inputField desktop" type="text"  key="search"
                defaultValue={searchWords.toString().replaceAll(",", " ")}
                placeholder="Søk"
                onClick={(e) => e.currentTarget.className += " searchAnimation"}
                autoFocus={viewSearchField}
                onFocus={() => setTimeout(() => {
                    setViewSearchField(true)
                }, 300)}
                style={{width: (viewSearchField  ? "200px" : "40px")}}
                onChange={(e) => setSearchWords([...e.target.value.split(" ")])}
                onBlur={() => setViewSearchField(false)}
              />

              <img src={settings} className="mobile" onClick={() => setDoEditCookbook(true)} alt="settings" width="28px"/>

            </div>
            

            <div className='title'> {cookbook?.name} </div>

            <div className='right centerElements'> 

              <img src={settings} className="desktop" onClick={() => setDoEditCookbook(true)} alt="settings" width="28px"/>

              <input type="text" key="searchMobile" className="searchField inputField mobile"
                autoFocus={viewSearchField}
                onClick={(e) => e.currentTarget.className += " searchAnimation"}
                defaultValue={searchWords.toString().replaceAll(",", " ")}
                onFocus={() => setTimeout(() => {
                    setViewSearchField(true)
                }, 300)}
                style={{width: (viewSearchField  ? "171px" : "0px")}}
                onChange={(e) => setSearchWords([...e.target.value.toLowerCase().split(" ")])}
                onBlur={() => setViewSearchField(false)}
              />

              <div onClick={() => setViewAllRecipes(true)}>
                <span className="mobile mobileButton secondaryButton"> + </span> <span className="desktop button secondaryButton"> Legg til oppskrift </span>
              </div>

            </div>
        </div>
    )
  }

  const Filters = () => {
    return (
        <>
        {viewFilters && (
          <>
            <div className="sideBox"> 

              <div>
                <span> Kategorier </span>

                {categories.map((category) => {
                  return(
                    <div key={category} className='alignCheckbox' 
                    onClick={() => handleCategories(category)}> 
                      <div id={`checkbox${category}`} className={chosenCategories && chosenCategories.includes(category) ? "checkbox checked" : "checkbox"}>
                        <img src={checkmark} id={`checkmark${category}`} width="12px" alt="checkmark" className={chosenCategories && chosenCategories.includes(category) ? "" : "hiddenCheckmark"}/>
                      </div>
                      {category} 
                    </div>
                  )
                })}
              </div>
          
              <div className="space">
                <span> Tags </span>
                <input type="text" className="inputField" onKeyDown={(e) => handleTags(e)}/>
                
                {tags && (<Tag tags={tags} removable={true} onRemove={(tag) => removeTag(tag)} />)}
              </div>
          
              <div>
                  <span> Tid </span>
                  {timeOptions.map((timeOption) => {
                      return(
                        <div key={timeOption} className='alignCheckbox' 
                        onClick={() => handleTime(timeOption)}> 
                            <div id={`checkbox${timeOption}`} className={time && time.includes(timeOption) ? "checkbox checked" : "checkbox"}>
                                <img src={checkmark} id={`checkmark${timeOption}`} width="12px" alt="checkmark" className={time && time.includes(timeOption) ? "" : "hiddenCheckmark"}/>
                            </div>
                            {timeOption} 
                        </div>
                      )
                  })}
              </div>

              <img src={close} alt="close" className="closeButton" onClick={() => setViewFilters(false)}/>

            </div>
          </>
        )}
        </>
    )
  }

  return (
    <AppLayout>   

      <Filters/>

      {viewAllRecipes && (
        <ViewAllRecipes addedRecipes={recipeIDs} close={() => setViewAllRecipes(false)} action={(recipeID: string) => AddRecipeToBook(recipeID)}/>
      )}

      {doEditCookbook && cookbook && (
        <EditCookbook cookbook={cookbook} avbryt={() => setDoEditCookbook(false)}/>
      )}

      {recipes.length > 0 || isLoading
      ?
      <>
        <Header/>

        {!isLoading && (
          <div className={viewFilters ? 'cardWrapper smaller' : 'cardWrapper'}>
            {recipes.map((recipe: Recipe) => {
              return(
                <Card key={recipe.url} recipe={recipe} clickable={true} bookID={id}/>
              )
            })}
          </div>
        )}
        

        {isLoading && (
        <div className="cardWrapper cardloading">
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
      </>
      : 
      <div className="emptyState">
        {(chosenCategories || tags || time || searchWords.length > 0) && (
          <>
          <Header/>
            <div> Boken har ingen oppskrifter som matcher filterene </div>
          </>
        )}

        {!(chosenCategories || tags || time || searchWords.length > 0) && (
          <>
            <Header/>
            <div> Boken har ingen oppskrifter enda </div>
          </>
        )}
        
        <img width={"200px"} src={book} alt="book"/>
        <div className='primaryButton button' onClick={() => setViewAllRecipes(true)}> 
          Legg til dens første oppskrift
        </div>
      </div>
      }
      
    </AppLayout>
  );
}
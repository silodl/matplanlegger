import { useEffect, useState } from 'react';
import { AppLayout } from '../App';
import { Card } from '../Recipes/RecipeCard';
import { Recipe } from '../Recipes/AddRecipe';
import { useParams } from 'react-router-dom';
import { useCookbook } from './UseCookbook';
import book from '../Images/book.png';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { ViewAllRecipes } from '../Recipes/ViewAllRecipes';
import { AddRecipesToCookbook } from './AddRecipeToCookbook';
import settings from '../Images/Icons/Settings.png';
import '../App.css';
import add from '../Images/Icons/Add.png';
import { EditCookbook } from './EditCookbook';
import leftArrow from '../Images/Icons/LeftArrow.png';
import { RecipeFilter } from '../Components/RecipeFilter';


export const Cookbook = () => {

  const { id } = useParams();
  const user = useLoggedInUser();
  const [viewAllRecipes, setViewAllRecipes] = useState(false);
  const [doEditCookbook, setDoEditCookbook] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadCount, setLoadCount] = useState(1);
  const [recipeIDs, setRecipeIDs] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>();
  const [selectedTimes, setSelectedTimes] = useState<string[]>();
  const [searchWords, setSearchWords] = useState<string[]>([]);
  const [activeSearch, setActiveSearch] = useState(false);
  const {cookbook, recipes} = useCookbook(id, selectedTimes, selectedCategories, searchWords);
  

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

  const AddRecipesToBook = async(recipeIDs: string[]) => {
    if (user && id) {
      AddRecipesToCookbook({recipeIDs, userID: user.uid, bookID: id})
      .then(() => setViewAllRecipes(false))
    }
  }

  const Header = () => {
    return (
      <>
        <div className="header"> 
          <img src={leftArrow} onClick={() => window.history.back()} alt="left arrow" width="22px"/>
          <div className='title cookbookTitle'> {cookbook?.name} </div>

          <div>
            <div className="iconButton"><img src={settings} onClick={() => setDoEditCookbook(true)} alt="settings" width="22px"/></div>

            <div onClick={() => setViewAllRecipes(true)}>
              <div className="mobile iconButton"><img src={add} width="22px" alt="add"/></div> 
              <div className="desktop button"> <img src={add} width="22px" alt="add"/> Legg til </div>
            </div>
          </div>

        </div>
        
        <RecipeFilter 
          updateTime={(times: string[]) => setSelectedTimes([...times])}
          updateSearch={(search: string[]) => setSearchWords([...search])}
          updateCategory={(categories: string[]) => setSelectedCategories([...categories])}
          selectedTimes={selectedTimes}
          selectedCategories={selectedCategories}
          searchWords={searchWords}
          activeSearch={activeSearch}
          updateActiveSearch={(value: boolean) => setActiveSearch(value)}
        />
        </>
    )
  }


  return (
    <AppLayout>  

      <Header/> 

      {viewAllRecipes && (
        <ViewAllRecipes addedRecipes={recipeIDs} close={() => setViewAllRecipes(false)} action={(recipeIDs: string[]) => AddRecipesToBook(recipeIDs)}/>
      )}

      {doEditCookbook && cookbook && (
        <EditCookbook cookbook={cookbook} avbryt={() => setDoEditCookbook(false)}/>
      )}

      {recipes.length > 0 || isLoading
      ?
      <>
        {!isLoading && (
          <div className="cardWrapper">
            {recipes.map((recipe: Recipe) => {
              return(
                <Card key={recipe.url} recipe={recipe}bookID={id} hasOptions={true}/>
              )
            })}
          </div>
        )}

        {isLoading && (
        <div className="cardWrapper">
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
        {(selectedCategories || selectedTimes || searchWords.length > 0) && (
          <div> Boken har ingen oppskrifter som matcher filterene </div>
        )}

        {!(selectedCategories || selectedTimes || searchWords.length > 0) && (
          <div> Boken har ingen oppskrifter enda </div>
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

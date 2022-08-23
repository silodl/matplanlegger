import { useState } from 'react';
import { AppLayout } from '../App';
import { Card } from '../Components/RecipeCard';
import { Recipe } from '../Recipes/AddRecipe';
import { useParams } from 'react-router-dom';
import { useCookbook } from './UseCookbook';
import book from '../Images/book.png';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { ViewAllRecipes } from '../Components/ViewAllRecipes';
import { AddRecipeToCookbook } from './AddRecipeToCookbook';

export const Cookbook = () => {

  const { id } = useParams();
  const {cookbook, recipes} = useCookbook({id});
  const isMobile = (window.innerWidth < 481) ? true : false;
  const user = useLoggedInUser();
  const [viewAllRecipes, setViewAllRecipes] = useState(false);

  const AddRecipe = async(recipeID: string) => {
    if (user && id) {
        AddRecipeToCookbook({recipeID, userID: user.uid, bookID: id})
        .then(() => setViewAllRecipes(false))
    }
  }

  return (
    <AppLayout>     
      {viewAllRecipes && (
        <ViewAllRecipes close={() => (setViewAllRecipes(false), console.log("lukker"))} action={(recipeID: string) => AddRecipe(recipeID)}/>
      )}
        {recipes.length > 0 
        ?
        <>
          <div> 
            <div className='pageTitle'> {cookbook?.name} </div>
            <div className='secondaryButton button corner' onClick={() => setViewAllRecipes(true)}> 
                {isMobile ? "+" : "Legg til oppskrift"}
            </div>
          </div>
          <div className='cardWrapper'>
            {recipes.map((recipe: Recipe) => {
              return(
                <Card key={recipe.url} recipe={recipe} clickable={true}/>
              )
            })}
          </div>
        </>
        : 
        <div className="emptyState">
          <div className='pageTitle'> {cookbook?.name} </div>
          <div> Boken har ingen oppskrifter enda </div>
          <img width={"200px"}
          src={book} alt="book"/>
          <div className='primaryButton button' onClick={() => setViewAllRecipes(true)}> 
            Legg til dens første oppskrift
          </div>
        </div>
        }
      
    </AppLayout>
  );
}
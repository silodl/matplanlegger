import { AppLayout } from "../App";
import { Card } from "./RecipeCard"
import { useRecipes } from "./UseRecipes"
import { Recipe } from "./AddRecipe";
import './NewRecipe.css';
import './RecipeCard.css';
import book from '../Images/book.png';

export const Recipes = () => {

    const recipes = useRecipes();
    const isMobile = (window.innerWidth < 481) ? true : false;

    return (
        <AppLayout>    

            {recipes.length > 0 
            ?
            <>
                <div className="pageHeader"> 
                    <div></div>
                    <div className='title'> Mine oppskrifter </div>
                    <div className='secondaryButton button'> 
                        <a href="/ny_oppskrift"> {isMobile ? "+" : "Legg til oppskrift"} </a>
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

            : <div className="emptyState">
                <div className='pageHeader title'> Mine oppskrifter </div>
                <div> Du har ingen oppskrifter enda </div>
                <img width={"200px"}
                src={book} alt="book"/>
                <div className='primaryButton button'> 
                    <a href="/ny_oppskrift"> Legg til din første oppskrift </a>
                </div>
              </div>
            }
            
        </AppLayout>
    )
}
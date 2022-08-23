import { AppLayout } from "../App";
import { Card } from "../Components/RecipeCard"
import { useRecipes } from "./UseRecipes"
import { Recipe } from "./AddRecipe";
import './NewRecipe.css';
import '../Components/RecipeCard.css';
import book from '../Images/book.png';

export const Recipes = () => {

    const recipes = useRecipes();
    const isMobile = (window.innerWidth < 481) ? true : false;

    const LoadRecipe = (id: string) => {
        window.location.href = `/oppskrifter/${id}`;
    }

    return (
        <AppLayout>    

            {recipes.length > 0 
            ?
            <>
                <div> 
                    <div className='pageTitle'> Mine oppskrifter </div>
                    <div className='secondaryButton button corner'> 
                        <a href="/ny_oppskrift"> {isMobile ? "+" : "Legg til oppskrift"} </a>
                    </div>
                </div>
            
                <div className='cardWrapper'>
                    {recipes.map((recipe: Recipe) => {
                        return(
                            <div onClick={() => LoadRecipe(recipe.id)} key={recipe.id}>
                                <Card key={recipe.url} recipe={recipe} clickable={true}/>
                            </div>
                        )
                    })}
                </div>
            </>

            : <div className="emptyState">
                <div className='pageTitle'> Mine oppskrifter </div>
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
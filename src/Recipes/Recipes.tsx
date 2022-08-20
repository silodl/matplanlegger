import { AppLayout } from "../App";
import { Card } from "../Components/Card"
import { useRecipes } from "./UseRecipes"
import { Recipe } from "./AddRecipe";
import './NewRecipe.css';
import hat from '../Images/Icons/Hat_brown.svg';
import clock from '../Images/Icons/Clock.svg';

export const Recipes = () => {

    const recipes = useRecipes();

    const LoadRecipe = (id: string) => {
        window.location.href = `/oppskrifter/${id}`;
    }

    return (
        <AppLayout>
        <div className='pageTitle'> Mine oppskrifter</div>

        {recipes.length > 0
        ?
        <div className='secondaryButton button center'> 
            <a href="/ny_oppskrift"> Legg til oppskrift </a>
        </div>
        : 
        <div className='primaryButton button center'> 
            <a href="/ny_oppskrift"> Legg til din første oppskrift </a>
        </div>
        }

        <div className='cardWrapper'>
            {recipes.length > 0 
            ?
            recipes.map((recipe: Recipe) => {
                return(
                    <div onClick={() => LoadRecipe(recipe.id)} key={recipe.id}>
                        <Card key={recipe.url} cardType="nonEmpty" image={recipe.image}>
                            <div className="cardText">
                                <div className="title">{recipe.name}</div>
                                <div><img src={clock} alt="clock"/>{recipe.time}</div>
                                <div className="tag">{recipe.tags}</div>
                            </div>
                        </Card>
                    </div>
                )
            })
            :
            <Card cardType={"empty"} image={hat}>
                <div className="cardText cardTextEmpty"> Ingen lagrede oppskrifter</div>
            </Card> 
            }
            
        </div>
        </AppLayout>
    )
}
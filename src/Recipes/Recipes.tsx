import { AppLayout } from "../App";
import { Card } from "./RecipeCard"
import { useRecipes } from "./UseRecipes"
import { Recipe } from "./AddRecipe";
import './NewRecipe.css';
import './RecipeCard.css';
import book from '../Images/book.png';
import { useEffect, useState } from "react";

export const Recipes = () => {

    const recipes = useRecipes();
    const [isLoading, setIsLoading] = useState(true);
    const [loadCount, setLoadCount] = useState(1);

    useEffect(() => {
        if(loadCount > 1) {
            setIsLoading(false);
        }
        setLoadCount(loadCount + 1);
    }, [recipes])

    return (
        <AppLayout>  

            {isLoading && (
                <div className="popup" style={{backdropFilter: "blur(5px)"}}>
                    <div className="loading"/>
                </div>
            )}  

            {recipes.length > 0 
            ?
            <>
                <div className="pageHeader"> 
                    <div className="left"/>
                    <div className='title'> Mine oppskrifter </div>
                    <div className='right secondaryButton'> 
                        <a href="/ny_oppskrift">
                            <span className="mobile mobileButton"> + </span> <span className="desktop button"> Legg til oppskrift </span>
                        </a>
                    </div>
                </div>
            
                <div className='cardWrapper' onLoad={() => setIsLoading(false)}>
                    {recipes.map((recipe: Recipe) => {
                        return(
                            <Card key={recipe.id} recipe={recipe} clickable={true}/>
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
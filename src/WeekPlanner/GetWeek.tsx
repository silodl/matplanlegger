import { useState } from 'react';
import { WeekRecipeCard } from './/WeekRecipeCard';
import { Recipe } from '../Recipes/AddRecipe';
import { useRecipes } from '../Recipes/UseRecipes';
import clock from '../Images/Icons/Clock.svg';
import close from '../Images/Icons/Close.svg';
import { PlanRecipe } from './PlanRecipe';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { usePlannedWeek } from './UsePlannedWeek';
import { Tag } from '../Components/Tag';
import book from '../Images/book.png';
import { Card } from '../Components/RecipeCard';

export const GetWeek = (props: {week: number}) => {

    const [planDay, setPlanDay] = useState<number | undefined>();
    const allRecipes  = useRecipes();
    const user = useLoggedInUser();
    const plannedRecipes = usePlannedWeek({week: props.week.toString()});
    const weeknames = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

    const AddRecipeToPlan = async(recipeID: string) => {
        if (planDay !== undefined && user) {
            PlanRecipe({recipeID, day:planDay, week:props.week, userID: user.uid})
            .then(() => setPlanDay(undefined))
        } 
    }

    return(
        <>  
            {typeof(planDay) === "number" && (
                <div className="alignRecipes">  
                    {allRecipes.map((recipe: Recipe) => {
                        return(
                            <div onClick={() => AddRecipeToPlan(recipe.id)} key={recipe.id}>
                                <Card key={recipe.url} image={recipe.image}>
                                    <div className="recipeInfo">
                                        <div className="recipeTitle">{recipe.name}</div>
                                        <div className="cookTime"><img src={clock} alt="clock"/>{recipe.time}</div>
                                        {recipe.tags.length > 0 && (<Tag tags={recipe.tags} />)}
                                    </div>
                                </Card>
                            </div>
                        )
                    })}
                    <img src={close} alt="close" className="closeButton"
                    onClick={() => setPlanDay(undefined)}/>
                </div>
            )}

            {plannedRecipes && (
                plannedRecipes.map((recipes) => {
                    return(
                        <div className="weekday"> 
                            <div className="weekdayHeader">
                                <div>{weeknames[plannedRecipes.indexOf(recipes)]} </div>
                                <div className="addRecipe" onClick={() => setPlanDay(plannedRecipes.indexOf(recipes))}> Planlegg <span> + </span> </div>
                            </div>
                            <div key={plannedRecipes.indexOf(recipes)} className="recipeWrapper">                      
                                {recipes.length > 0 && recipes.map((recipe: Recipe) => {
                                    return(
                                        <WeekRecipeCard key={recipe.id} recipe={(recipe)}/>                  
                                    )
                                })}
                                
                                {recipes.length === 0 && (
                                    <div className="noCards">
                                        <div> Ingen planlagte oppskrifter </div>
                                        <img src={book} alt="book" width="100px"/>
                                    </div>                                    
                                )}
                            </div>
                        </div>
                    )
                })
                
            )}
        </>
    )
}
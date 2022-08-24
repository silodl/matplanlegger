import { useState } from 'react';
import { WeekRecipeCard } from './WeekRecipeCard';
import { Recipe } from '../Recipes/AddRecipe';
import { PlanRecipe } from './PlanRecipe';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { usePlannedWeek } from './UsePlannedWeek';
import book from '../Images/book.png';
import { ViewAllRecipes } from '../Recipes/ViewAllRecipes';

export const GetWeek = (props: {week: number}) => {

    const [planDay, setPlanDay] = useState<number | undefined>();
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
                <ViewAllRecipes close={() => setPlanDay(undefined)} action={(recipeID: string) => AddRecipeToPlan(recipeID)} />
            )}

            {plannedRecipes && (
                plannedRecipes.map((recipes) => {
                    return(
                        <div className="weekday" key={weeknames[plannedRecipes.indexOf(recipes)]}> 
                            <div className="weekdayHeader">
                                <div>{weeknames[plannedRecipes.indexOf(recipes)]} </div>
                                <div className="addRecipe" onClick={() => setPlanDay(plannedRecipes.indexOf(recipes))}> Planlegg <span> + </span> </div>
                            </div>
                            <div key={plannedRecipes.indexOf(recipes)} className="recipeWrapper">                      
                                {recipes.length > 0 && recipes.map((recipe: Recipe) => {
                                    return(
                                        <WeekRecipeCard key={recipe.id} recipe={(recipe)} week={props.week.toString()} daynr={plannedRecipes.indexOf(recipes).toString()}/>                  
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
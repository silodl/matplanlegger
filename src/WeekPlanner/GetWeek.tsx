import { useState, useEffect } from 'react';
import { WeekRecipeCard } from './WeekRecipeCard';
import { Recipe } from '../Recipes/AddRecipe';
import { PlanRecipe } from './PlanRecipe';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { usePlannedWeek } from './UsePlannedWeek';
import coverImage from '../Images/Fork and spoon.png';
import { ViewAllRecipes } from '../Recipes/ViewAllRecipes';
import add from '../Images/Icons/Add.svg';

export const GetWeek = (props: {week: number}) => {

    const [planDay, setPlanDay] = useState<number | undefined>();
    const user = useLoggedInUser();
    const plannedRecipes = usePlannedWeek({week: props.week.toString()});
    const [isLoading, setIsLoading] = useState(true);
    const [loadCount, setLoadCount] = useState(1);

    const weeknames = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

    const AddRecipesToPlan = async(recipeIDs: string[]) => {
        if (planDay !== undefined && user && recipeIDs.length === 1) {
            PlanRecipe({recipeIDs, day:planDay, week:props.week, userID: user.uid})
            .then(() => setPlanDay(undefined))
        } 
        else if (user && recipeIDs.length === 7) {
            PlanRecipe({recipeIDs, week:props.week, userID: user.uid})
            .then(() => setPlanDay(undefined))
        }
    }

    useEffect(() => {
        if(loadCount > 1) {
            setIsLoading(false);
        }
        setLoadCount(loadCount + 1);
    }, [plannedRecipes])

    return(
        <>  
            {isLoading && 
                Array.from(Array(4).keys()).map((i: number) => {
                    return(
                        <div className="emptySideCard emptyCard" key={i}>
                            <div className="headerLoader"> 
                                <div className="emptyText" style={{width: "25%"}}/> <div className="emptyText" style={{width: "20%"}}/> 
                            </div>
                            <div className="emptyContent">
                                <div className="emptyText" style={{width: "40%"}}/>
                                <div className="emptyText" style={{width: "30%"}}/>
                            </div> 
                        </div>
                    )
                })
            }  

            {typeof(planDay) === "number" && (
                <ViewAllRecipes close={() => setPlanDay(undefined)} action={(recipeIDs: string[]) => AddRecipesToPlan(recipeIDs)} />
            )}

            {!isLoading && Object.entries(plannedRecipes).map(([day, recipes]) => {
                return(
                    <div className="weekday" key={weeknames[parseInt(day)]} onLoad={() => setIsLoading(false)} > 
                        <div className="weekdayHeader">
                            <div>{weeknames[parseInt(day)]} </div>
                            <div className="button" onClick={() => setPlanDay(parseInt(day))}> <img src={add} width="16px" alt="add"/> Planlegg </div>
                        </div>
                        <div key={parseInt(day)} className="recipeWrapper">                      
                            {recipes.length > 0 && recipes.map((recipe: Recipe) => {
                                return(
                                    <WeekRecipeCard key={recipe.id} recipe={(recipe)} week={props.week.toString()} daynr={day}/>                  
                                )
                            })}
                            
                            {recipes.length === 0 && (
                                <div className="noCards">
                                    <img src={coverImage} alt="Fork and spoon"/>
                                    <div> Ingen planlagte oppskrifter </div>
                                </div>                                    
                            )}
                        </div>
                    </div>
                )
            })}
        </>
    )
}
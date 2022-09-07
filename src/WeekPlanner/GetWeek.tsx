import { useState, useEffect } from 'react';
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
    const [isLoading, setIsLoading] = useState(true);
    const [loadCount, setLoadCount] = useState(1);

    const weeknames = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

    const AddRecipeToPlan = async(recipeID: string) => {
        if (planDay !== undefined && user) {
            PlanRecipe({recipeID, day:planDay, week:props.week, userID: user.uid})
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
            {isLoading && (
                <div className="cardloading weekloader">
                    {Array.from(Array(7).keys()).map((i: number) => {
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
                    })}
                </div>
            )}  

            {typeof(planDay) === "number" && (
                <ViewAllRecipes close={() => setPlanDay(undefined)} action={(recipeID: string) => AddRecipeToPlan(recipeID)} />
            )}

            {Object.entries(plannedRecipes).map(([day, recipes]) => {
                return(
                    <div className="weekday" key={weeknames[parseInt(day)]} onLoad={() => setIsLoading(false)} > 
                        <div className="weekdayHeader">
                            <div>{weeknames[parseInt(day)]} </div>
                            <div className="addRecipe" onClick={() => setPlanDay(parseInt(day))}> Planlegg <span> + </span> </div>
                        </div>
                        <div key={parseInt(day)} className="recipeWrapper">                      
                            {recipes.length > 0 && recipes.map((recipe: Recipe) => {
                                return(
                                    <WeekRecipeCard key={recipe.id} recipe={(recipe)} week={props.week.toString()} daynr={day}/>                  
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
            })}
        </>
    )
}
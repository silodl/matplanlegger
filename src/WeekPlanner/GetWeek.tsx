import { useState } from 'react';
import { Card } from '../Components/Card';
import { Recipe } from '../Recipes/AddRecipe';
import { useRecipes } from '../Recipes/UseRecipes';
import hat from '../Images/Icons/Hat_brown.svg';
import clock from '../Images/Icons/Clock.svg';
import close from '../Images/Icons/Close.svg';
import { PlanRecipe } from './PlanRecipe';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { usePlannedWeek } from './UsePlannedWeek';
import { Tag } from '../Components/Tag';

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
                                <Card key={recipe.url} cardType="nonEmpty" image={recipe.image}>
                                    <div className="cardText">
                                        <div className="title">{recipe.name}</div>
                                        <div><img src={clock} alt="clock"/>{recipe.time}</div>
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
                        <span key={plannedRecipes.indexOf(recipes)}>                      
                            {recipes.length > 0 && recipes.map((recipe: Recipe) => {
                                return(
                                    <Card cardType='nonEmpty' image={recipe.image} weekday={weeknames[plannedRecipes.indexOf(recipes)]} key={recipe.id}>        
                                        <div className='cardText'>
                                            <div className="title">{recipe.name}</div>
                                            <div><img src={clock} alt="clock"/>{recipe.time}</div>
                                            {recipe.tags.length > 0 && (<Tag tags={recipe.tags} />)}
                                        </div>
                                    </Card>                         
                                )
                            })}
                            
                            {recipes.length === 0 && (
                            <Card cardType="empty" weekday={weeknames[plannedRecipes.indexOf(recipes)]}>
                                <div className="cardText cardTextEmpty">
                                    <div> Ingen planlagte oppskrifter </div> 
                                    <div className="button primaryButton" onClick={() => setPlanDay(plannedRecipes.indexOf(recipes))}> Planlegg </div>
                                </div>
                            </Card>
                            )}
                        </span>
                    )
                })
            )}
        </>
    )
}
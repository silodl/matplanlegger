import close from '../Images/Icons/Close.svg';
import { useRecipes } from '../Recipes/UseRecipes';
import book from '../Images/book.png';
import { Recipe } from '../Recipes/AddRecipe';
import { Card } from './RecipeCard';
import './ViewAllRecipes.css';

interface Props {
    action: Function,
    close: Function,
}

export const ViewAllRecipes = (props: Props) => {

    const allRecipes  = useRecipes();

    return (
        <>
            <div className="alignRecipes">
                {allRecipes.length === 0
                ? 
                    <div className="emptyState" style={{margin: "auto", marginTop: "150px"}}>
                    <div> Du har ingen oppskrifter enda </div>
                    <img width={"200px"}
                    src={book} alt="book"/>
                    </div>
                :
                    allRecipes.map((recipe: Recipe) => {
                        return(
                            <div onClick={() => props.action(recipe.id)} key={recipe.id}>
                                <Card key={recipe.url} recipe={recipe} clickable={false}/>
                            </div>
                        )
                    })
                }
            <img src={close} alt="close" className="closeButton" onClick={() => props.close()}/>
            </div> 
        </>
    )
}
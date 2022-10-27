import { AppLayout } from "../App";
import { Card } from "./RecipeCard"
import { useAllRecipes } from "./UseAllRecipes"
import { Recipe } from "./AddRecipe";
import './Recipe.css';
import './NewRecipe.css';
import './RecipeCard.css';
import book from '../Images/book.png';
import { useEffect, useState } from "react";
import add from '../Images/Icons/Add.png';
import { RecipeFilter } from "../Components/RecipeFilter";

export const Recipes = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [loadCount, setLoadCount] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState<string[]>();
    const [selectedTimes, setSelectedTimes] = useState<string[]>();
    const [activeSearch, setActiveSearch] = useState(false);
    const [searchWords, setSearchWords] = useState<string[]>([]);
    const recipes = useAllRecipes(undefined, selectedTimes, selectedCategories, searchWords);

    useEffect(() => {
        if(loadCount > 1) {
            setIsLoading(false);
        }
        setLoadCount(loadCount + 1);
    }, [recipes])

    const Header = () => {
        return (
            <>
            <div className="header">
                <div style={{width: "38px"}}/>
                <div className='title'> Mine oppskrifter </div>
                <div>
                    <a href="/ny_oppskrift">
                        <div className="mobile iconButton"><img src={add} width="22px" alt="add"/></div> 
                        <span className="desktop button"> <img src={add} width="22px" alt="add"/> Ny oppskrift </span>
                    </a>
                </div>

            </div>
            
            <RecipeFilter 
                updateTime={(times: string[]) => setSelectedTimes([...times])}
                updateSearch={(search: string[]) => setSearchWords([...search])}
                updateCategory={(categories: string[]) => setSelectedCategories([...categories])}
                selectedTimes={selectedTimes}
                selectedCategories={selectedCategories}
                searchWords={searchWords}
                activeSearch={activeSearch}
                updateActiveSearch={(value: boolean) => setActiveSearch(value)}
            />
            </>
        )
    }

    return (
        <AppLayout>  

            <Header/>   

            {recipes.length > 0 || isLoading
            ?
            <>
                {!isLoading && (
                   <div className="cardWrapper" onLoad={() => setIsLoading(false)}>
                        {recipes.map((recipe: Recipe) => {
                            return(
                                <Card key={recipe.id} recipe={recipe} hasOptions={true}/>
                            )
                        })}
                    </div> 
                )}
                
                {isLoading && (
                    <div className="cardWrapper">
                        {Array.from(Array(3).keys()).map((i) => {
                            return(
                                <div className="card emptyCard" key={i}>
                                    <div className="emptyContent">
                                        <div className="emptyText" style={{width: "90%"}}/>
                                        <div className="emptyText" style={{width: "70%"}}/>
                                    </div> 
                                </div>
                            )
                        })}
                    </div>
                )}  
            </>

            : <div className="emptyState">
                {(selectedCategories || selectedTimes || searchWords.length > 0) && (
                    <div> Du har ingen oppskrifter som matcher filterene </div>
                )}

                {!(selectedCategories || selectedTimes || searchWords.length > 0) && (
                    <div> Du har ingen oppskrifter enda </div>
                )}

                <img width={"200px"}
                src={book} alt="book"/>
                {!(selectedCategories || selectedTimes) && (
                    <div className='primaryButton button'> 
                        <a href="/ny_oppskrift"> Legg til oppskrift </a>
                    </div>
                )}
                
            </div>
            }

        </AppLayout>
    )
}
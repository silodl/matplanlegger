import { useAllRecipes } from './UseAllRecipes';
import book from '../Images/book.png';
import { Recipe } from './AddRecipe';
import { Card } from './RecipeCard';
import './ViewAllRecipes.css';
import { useState } from 'react';
import checkmark from '../Images/Icons/Checkmark.svg';
import dinner from '../Images/Dinner.png';
import { RecipeFilter } from '../Components/RecipeFilter';

interface Props {
    action: Function,
    close: Function,
    addedRecipes?: string[],
}

export const ViewAllRecipes = (props: Props) => {

    const [selectedCategories, setSelectedCategories] = useState<string[]>();
    const [selectedTimes, setSelectedTimes] = useState<string[]>();
    const [activeSearch, setActiveSearch] = useState(false);
    const [searchWords, setSearchWords] = useState<string[]>([]);
    const recipes = useAllRecipes(props.addedRecipes, selectedTimes, selectedCategories, searchWords);
    const dinners = useAllRecipes(props.addedRecipes, selectedTimes, ["Middag"], searchWords);

    const isCookbook = window.location.pathname.includes("kokebok");
    const [checkedRecipes, setCheckedRecipes] = useState<string[]>([])
    const isPlanning = window.location.pathname.includes("ukeplanlegger");

    const handleClick = (recipeID: string) => {
        let checkmark = document.getElementById(`checkmark${recipeID}`);
        let checkbox = document.getElementById(`checkbox${recipeID}`);

        if(checkedRecipes.includes(recipeID)) {
            const index = checkedRecipes.indexOf(recipeID);
            checkedRecipes.splice(index, 1);
            setCheckedRecipes([...checkedRecipes]);

            if(checkmark) {
                checkmark.className = "hiddenCheckmark"
            }
            if(checkbox) {
                checkbox.className = "checkbox"
            }
        }
        else {
            setCheckedRecipes(old => [...old, recipeID]);

            if(checkmark) {
                checkmark.className = ""
            }
            if(checkbox) {
                checkbox.className = "checkbox checked"
            }
        }
    }

    const getRandomRecipe = () => {
        const randomIndex = Math.floor(Math.random() * dinners.length)
        const randomRecipe = dinners[randomIndex];
        let weekRecipes: string[] = [randomRecipe.id];
        props.action(weekRecipes);
    }

    const getRandomWeek = () => {
        let weekRecipes: string[] = [];
        const randomIndex = Math.floor(Math.random() * dinners.length)
        const randomRecipe = dinners[randomIndex];
        weekRecipes.push(randomRecipe.id);
        for(let i = 1; i < 7; i++) {
            let randomIndex = Math.floor(Math.random() * dinners.length)
            let randomRecipe = dinners[randomIndex];
            while(weekRecipes.includes(randomRecipe.id)) {
                randomIndex = Math.floor(Math.random() * dinners.length)
                randomRecipe = dinners[randomIndex];
            }
            weekRecipes.push(randomRecipe.id);
        }
        props.action(weekRecipes);
    }

    return (
        <>
            <div className="alignRecipes">

                <RecipeFilter
                    updateTime={(times: string[]) => setSelectedTimes([...times])}
                    updateSearch={(search: string[]) => setSearchWords([...search])}
                    updateCategory={(categories: string[]) => setSelectedCategories([...categories])}
                    selectedTimes={selectedTimes}
                    selectedCategories={selectedCategories}
                    searchWords={searchWords}
                    activeSearch={activeSearch}
                    updateActiveSearch={(value: boolean) => setActiveSearch(value)}
                    canClose={true}
                    close={() => window.history.back()}    
                />

                {recipes.length === 0
                ? 
                    <div className="emptyState" style={{margin: "auto", marginTop: "150px"}}>
                    {(selectedCategories || selectedTimes || searchWords.length > 0) 
                    ? <div> Du har ingen oppskrifter som matcher filterene </div>
                    : <div> Du har ingen oppskrifter som ikke allerede er i boken </div>
                    }
                    <img width={"200px"}
                    src={book} alt="book"/>
                    </div>
                :
                    <>
                    {isPlanning && (
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                            <div className="card" onClick={() => getRandomRecipe()}>
                                <div className="randomRecipe">
                                    Tilfeldig middag
                                    <img src={dinner} alt="random" width="40px"/>
                                </div>
                            </div>

                            <div className="card" onClick={() => getRandomWeek()}>
                                <div className="randomRecipe">
                                    Tilfeldig ukemeny
                                    <div>
                                        <img src={dinner} alt="random" width="35px"/>
                                        <img src={dinner} alt="random" width="35px" style={{margin: "0 10px"}}/>
                                        <img src={dinner} alt="random" width="35px"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {recipes.map((recipe: Recipe) => {
                        return(
                            <div onClick={() => (isPlanning && (props.action([recipe.id])))} key={recipe.id}>
                                
                                {isCookbook && (
                                    <div className="recipeCardCheckbox"> <div>
                                        <div id={`checkbox${recipe.id}`} className={checkedRecipes.includes(recipe.id) ? "checkbox checked" : "checkbox"} onClick={() => handleClick(recipe.id)}>
                                            <img src={checkmark} id={`checkmark${recipe.id}`} width="12px" alt="checkmark" className={checkedRecipes.includes(recipe.id) ? "" : "hiddenCheckmark"}/>
                                        </div>
                                    </div></div>
                                )}

                                <Card key={recipe.url} recipe={recipe} isSelected={checkedRecipes.includes(recipe.id)} hasOptions={false}/>
                            </div>
                        )
                    })}
                    </>
                }
            </div> 
        </>
    )
}
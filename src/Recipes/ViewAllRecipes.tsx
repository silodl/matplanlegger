import close from '../Images/Icons/Close.png';
import { useRecipes } from './UseRecipes';
import book from '../Images/book.png';
import { Recipe } from './AddRecipe';
import { Card } from './RecipeCard';
import './ViewAllRecipes.css';
import filter from '../Images/Icons/Filter.png';
import { useState } from 'react';
import { categories, timeOptions } from "./NewRecipe";
import { Tag } from "./Tag";
import checkmark from '../Images/Icons/Checkmark.svg';
import dinner from '../Images/Dinner.png';

interface Props {
    action: Function,
    close: Function,
    addedRecipes?: string[],
}

export const ViewAllRecipes = (props: Props) => {

    const [viewFilters, setViewFilters] = useState(false);
    const [chosenCategories, setChosenCategories] = useState<string[]>();
    const [tags, setTags] = useState<string[]>(); 
    const [time, setTime] = useState<string[]>();
    const [searchWords, setSearchWords] = useState<string[]>([]);
    const recipes = useRecipes(props.addedRecipes, time, chosenCategories, tags, searchWords);
    const dinners = useRecipes(props.addedRecipes, time, ["Middag"], tags, searchWords);

    const isCookbook = window.location.pathname.includes("kokebok");
    const [checkedRecipes, setCheckedRecipes] = useState<string[]>([])
    const isPlanning = window.location.pathname.includes("ukeplanlegger");

    const handleCategories = (category: string) => {
        let checkmark = document.getElementById(`checkmark${category}`);
        let checkbox = document.getElementById(`checkbox${category}`);

        if(chosenCategories && chosenCategories.includes(category) && chosenCategories.length !== 6) {
            if(chosenCategories.length === 1) {
                setChosenCategories(undefined)
            }
            else {
                let newArray = chosenCategories;
                const index = newArray.indexOf(category);
                newArray.splice(index, 1);
                setChosenCategories([...newArray])
            }

            if(checkmark) {
                checkmark.className = "hiddenCheckmark"
            }
            if(checkbox) {
            checkbox.className = "checkbox"
            }
        }
        else {
            if(chosenCategories && chosenCategories.length !== 6) {
                let newArray = chosenCategories;
                newArray.push(category);
                setChosenCategories([...newArray])
            }
            else {
                setChosenCategories([category])
            }

            if(checkmark) {
                checkmark.className = ""
            }
            if(checkbox) {
                checkbox.className = "checkbox checked"
            }
        }
    }

    const handleTime = (timeOption: string) => {
        let checkmark = document.getElementById(`checkmark${timeOption}`);
        let checkbox = document.getElementById(`checkbox${timeOption}`);

        if(time && time.includes(timeOption) && time.length !== 5) {
            if(time.length === 1) {
                setTime(undefined)
            }
            else {
                let newArray = time;
                const index = newArray.indexOf(timeOption);
                newArray.splice(index, 1);
                setTime([...newArray])
            }

            if(checkmark) {
                checkmark.className = "hiddenCheckmark"
            }
            if(checkbox) {
            checkbox.className = "checkbox"
            }
        }
        else {
            if(time && time.length !== 5) {
                let newArray = time;
                newArray.push(timeOption);
                setTime([...newArray])
            }
            else {
                setTime([timeOption])
            }

            if(checkmark) {
                checkmark.className = ""
            }
            if(checkbox) {
                checkbox.className = "checkbox checked"
            }
        }
    }

    const handleTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter" && e.target.value !== "") {
            if(tags) {
                let newArray = tags;
                newArray.push(e.target.value)
                setTags([...newArray])
            }
            else {
                setTags([e.target.value])
            }
        }
    }

    const removeTag = (tag: string) => {
        if(tag && tags && tags.includes(tag)) {
            let newArray = tags;
            const index = tags?.indexOf(tag)
            newArray?.splice(index, 1)
            setTags([...newArray]) 
        }
    }

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
        props.action(randomRecipe.id);
    }

    const getRandomWeek = () => {
        let weekRecipes: Recipe[] = [];
        const randomIndex = Math.floor(Math.random() * dinners.length)
        const randomRecipe = dinners[randomIndex];
        weekRecipes.push(randomRecipe);
        for(let i = 1; i < 7; i++) {
            let randomIndex = Math.floor(Math.random() * dinners.length)
            let randomRecipe = dinners[randomIndex];
            while(weekRecipes.includes(randomRecipe)) {
                randomIndex = Math.floor(Math.random() * dinners.length)
                randomRecipe = dinners[randomIndex];
            }
            weekRecipes.push(randomRecipe);

        }
        console.log("??", weekRecipes)
        weekRecipes.forEach((recipe) => {
            console.log(recipe.name)
        })
        //const randomRecipe = dinners[randomIndex];
        //props.action(randomRecipe.id);
    }

    const Filters = () => {
        return (
            <>
            {viewFilters && (
                <>
                    <div className="sideBox"> 

                        <div>
                            <span> Kategorier </span>

                            {categories.map((category) => {
                                return(
                                    <div key={category} className='alignCheckbox' 
                                    onClick={() => handleCategories(category)}> 
                                        <div id={`checkbox${category}`} className={chosenCategories && chosenCategories.includes(category) ? "checkbox checked" : "checkbox"}>
                                            <img src={checkmark} id={`checkmark${category}`} width="12px" alt="checkmark" className={chosenCategories && chosenCategories.includes(category) ? "" : "hiddenCheckmark"}/>
                                        </div>
                                        {category} 
                                    </div>
                                )
                            })}
                        </div>
                    
                        <div className="space">
                            <span> Tags </span>
                            <input type="text" className="inputField" onKeyDown={(e) => handleTags(e)}/>
                            
                            {tags && (<Tag tags={tags} removable={true} onRemove={(tag) => removeTag(tag)} />)}
                        </div>
                    
                        <div>
                            <span> Tid </span>
                            {timeOptions.map((timeOption) => {
                                return(
                                    <div key={timeOption} className='alignCheckbox' 
                                    onClick={() => handleTime(timeOption)}> 
                                        <div id={`checkbox${timeOption}`} className={time && time.includes(timeOption) ? "checkbox checked" : "checkbox"}>
                                            <img src={checkmark} id={`checkmark${timeOption}`} width="12px" alt="checkmark" className={time && time.includes(timeOption) ? "" : "hiddenCheckmark"}/>
                                        </div>
                                        {timeOption} 
                                    </div>
                                )
                            })}
                        </div>

                        <img src={close} alt="close" className="closeButton" onClick={() => setViewFilters(false)}/>

                    </div>
                </>
            )}
            </>
        )
    }

    return (
        <>
            <div className={viewFilters ? "alignRecipes smaller" : "alignRecipes"}>

                <Filters/>

                <div className="pageHeader fullHeader"> 
                    <div className="left centerElements"> 
                        <div className="button desktop" onClick={() => setViewFilters(true)}>
                            <img src={filter} alt="filter" width="20px"/>  
                            <span> Filtrer </span> 
                        </div>

                        <div className="iconButton mobile" onClick={() => setViewFilters(true)}>
                            <img src={filter} alt="filter" width="20px"/>  
                        </div> 

                        <div className="button" onClick={() => props.action(checkedRecipes)}> Legg til  </div>
                    </div>

                    <div className='right'> 
                        <input type="text" key="searchMobile" className="searchField inputField mobile"
                            onClick={(e) => e.currentTarget.className += " searchAnimation"}
                            defaultValue={searchWords.toString().replaceAll(",", " ")}
                            style={{width: "171px"}}
                            placeholder="Søk"
                            onChange={(e) => setSearchWords([...e.target.value.toLowerCase().split(" ")])}
                        />

                        <input className="searchField inputField desktop" type="text"  key="search"
                            defaultValue={searchWords.toString().replaceAll(",", " ")}
                            placeholder="Søk"
                            style={{width: "200px"}}
                            onChange={(e) => setSearchWords([...e.target.value.split(" ")])}
                        />
                    </div>
                </div>

                {recipes.length === 0
                ? 
                    <div className="emptyState" style={{margin: "auto", marginTop: "150px"}}>
                    {(chosenCategories || tags || time || searchWords.length > 0) 
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
                            <div className="card half" onClick={() => getRandomRecipe()}>
                                <div className="randomRecipe">
                                    La oss plukke ut en middag for deg
                                    <img src={dinner} alt="random" width="40px"/>
                                </div>
                            </div>

                            <div className="card half" onClick={() => getRandomWeek()}>
                                <div className="randomRecipe">
                                    La oss planlegge hele uken din
                                    <div>
                                        <img src={dinner} alt="random" width="30px"/>
                                        <img src={dinner} alt="random" width="30px" style={{margin: "0 10px"}}/>
                                        <img src={dinner} alt="random" width="30px"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {recipes.map((recipe: Recipe) => {
                        return(
                            <div onClick={() => (!isCookbook && (props.action(recipe.id)))} key={recipe.id}>
                                
                                {isCookbook && (
                                    <div className="moreButton"> 
                                        <div id={`checkbox${recipe.id}`} className={checkedRecipes.includes(recipe.id) ? "checkbox checked" : "checkbox"} onClick={() => handleClick(recipe.id)}>
                                            <img src={checkmark} id={`checkmark${recipe.id}`} alt="checkmark" className={checkedRecipes.includes(recipe.id) ? "" : "hiddenCheckmark"}/>
                                        </div>
                                    </div>
                                )}

                                <Card key={recipe.url} recipe={recipe} clickable={false}/>
                            </div>
                        )
                    })}
                    </>
                }
            <img src={close} alt="close" className="closeButton" onClick={() => props.close()}/>
            </div> 
        </>
    )
}
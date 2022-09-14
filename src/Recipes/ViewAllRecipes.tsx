import close from '../Images/Icons/Close.svg';
import { useRecipes } from './UseRecipes';
import book from '../Images/book.png';
import { Recipe } from './AddRecipe';
import { Card } from './RecipeCard';
import './ViewAllRecipes.css';
import filter from '../Images/Icons/Filter.svg';
import { useState } from 'react';
import { categories } from "./NewRecipe";
import { Tag } from "./Tag";
import checkmark from '../Images/Icons/Checkmark_black.svg';


interface Props {
    action: Function,
    close: Function,
    addedRecipes?: string[],
}

export const ViewAllRecipes = (props: Props) => {

    const [viewFilters, setViewFilters] = useState(false);
    const [chosenCategories, setChosenCategories] = useState<string[]>();
    const [tags, setTags] = useState<string[]>(); 
    const [time, setTime] = useState<string>();
    const [searchWords, setSearchWords] = useState<string[]>([]);
    const recipes = useRecipes(props.addedRecipes, time, chosenCategories, tags, searchWords);

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
                            <div className="centerElements">
                                Maks 
                                <input type="number" className="inputField" style={{width: "30px", fontSize: "14px"}} onChange={(e) => setTime(time)}/>
                                timer
                            </div>
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
                    <div className="left"> 
                        <div className="secondaryButton filterButton" onClick={() => setViewFilters(true)}>
                            <img src={filter} alt="filter" width="20px"/>  
                            <span className="desktop"> Filtrer </span> 
                        </div>
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
                    recipes.map((recipe: Recipe) => {
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
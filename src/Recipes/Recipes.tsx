import { AppLayout } from "../App";
import { Card } from "./RecipeCard"
import { useRecipes } from "./UseRecipes"
import { Recipe } from "./AddRecipe";
import './NewRecipe.css';
import './RecipeCard.css';
import book from '../Images/book.png';
import filter from '../Images/Icons/Filter.svg';
import { useEffect, useState } from "react";
import checkmark from '../Images/Icons/Checkmark_black.svg';
import { categories } from "./NewRecipe";
import { Tag } from "./Tag";
import close from '../Images/Icons/Close.svg';

export const Recipes = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [loadCount, setLoadCount] = useState(1);
    const [viewFilters, setViewFilters] = useState(false);
    const [chosenCategories, setChosenCategories] = useState<string[]>();
    const [tags, setTags] = useState<string[]>();
    const [time, setTime] = useState<string>();
    const [viewSearchField, setViewSearchField] = useState(false);
    const [searchWords, setSearchWords] = useState<string[]>([]);
    const recipes = useRecipes(undefined, time, chosenCategories, tags, searchWords);

    useEffect(() => {
        if(loadCount > 1) {
            setIsLoading(false);
        }
        setLoadCount(loadCount + 1);
    }, [recipes])

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

    const Header = () => {
        return (
            <div className="pageHeader fullHeader"> 
                <div className="left centerElements"> 
                    <div className="secondaryButton filterButton" onClick={() => setViewFilters(true)}>
                        <img src={filter} alt="filter" width="20px"/>  
                        <span className="desktop"> Filtrer </span> 
                    </div>

                    <input className="searchField inputField desktop" type="text"  key="search"
                        defaultValue={searchWords.toString().replaceAll(",", " ")}
                        placeholder="Søk"
                        onClick={(e) => e.currentTarget.className += " searchAnimation"}
                        autoFocus={viewSearchField}
                        onFocus={() => setTimeout(() => {
                            setViewSearchField(true)
                        }, 300)}
                        style={{width: (viewSearchField  ? "200px" : "40px")}}
                        onChange={(e) => setSearchWords([...e.target.value.split(" ")])}
                        onBlur={() => setViewSearchField(false)}
                    />
                </div>
                

                <div className='title'> Mine oppskrifter </div>

                <div className='right centerElements'> 
                        <input type="text" key="searchMobile" className="searchField inputField mobile"
                            autoFocus={viewSearchField}
                            onClick={(e) => e.currentTarget.className += " searchAnimation"}
                            defaultValue={searchWords.toString().replaceAll(",", " ")}
                            onFocus={() => setTimeout(() => {
                                setViewSearchField(true)
                            }, 300)}
                            style={{width: (viewSearchField  ? "171px" : "0px")}}
                            onChange={(e) => setSearchWords([...e.target.value.toLowerCase().split(" ")])}
                            onBlur={() => setViewSearchField(false)}
                        />

                    <div>
                        <a href="/ny_oppskrift">
                            <span className="mobile mobileButton secondaryButton"> + </span> <span className="desktop button secondaryButton"> Ny oppskrift </span>
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <AppLayout>  

            <Filters/>

            {recipes.length > 0 || isLoading
            ?
            <>
                <Header/>
                
                {!isLoading && (
                   <div className={viewFilters ? 'cardWrapper smaller' : 'cardWrapper'} onLoad={() => setIsLoading(false)}>
                        {recipes.map((recipe: Recipe) => {
                            return(
                                <Card key={recipe.id} recipe={recipe} clickable={true}/>
                            )
                        })}
                    </div> 
                )}
                
                {isLoading && (
                    <div className="cardWrapper cardloading">
                        {Array.from(Array(3).keys()).map((i) => {
                            return(
                                <div className="emptyCard" key={i}>
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
                {(chosenCategories || tags || time || searchWords.length > 0) && (
                    <>
                        <Header/>
                        <div> Du har ingen oppskrifter som matcher filterene </div>
                    </>
                )}

                {!(chosenCategories || tags || time || searchWords.length > 0) && (
                    <>
                        <Header/>
                        <div> Du har ingen oppskrifter enda </div>
                    </> 
                )}

                <img width={"200px"}
                src={book} alt="book"/>
                {!(chosenCategories || tags || time) && (
                    <div className='primaryButton button'> 
                        <a href="/ny_oppskrift"> Legg til oppskrift </a>
                    </div>
                )}
                
            </div>
            }

        </AppLayout>
    )
}
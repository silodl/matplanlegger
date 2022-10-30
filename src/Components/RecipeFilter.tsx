import { useState } from 'react';
import { SelectField } from '../Components/SelectField';
import { categories, timeOptions } from "../Recipes/NewRecipe";
import closeIcon from '../Images/Icons/Close.png';
import '../Recipes/Recipe.css';

interface Props {
    updateTime: Function,
    updateSearch: Function,
    updateCategory: Function,
    selectedTimes: string[] | undefined,
    selectedCategories: string[] | undefined,
    searchWords: string[] | undefined,
    activeSearch: boolean,
    updateActiveSearch: Function,
    canClose?: boolean,
    close?: Function,
}

export const RecipeFilter = (props: Props) => {

    const [selectedCategories, setSelectedCategories] = useState<string[] | undefined>(props.selectedCategories);
    const [selectedTimes, setSelectedTimes] = useState<string[] | undefined>(props.selectedTimes);
    const [searchWords, setSearchWords] = useState<string[] | undefined>(props.searchWords);

    const handleCategories = (category: string) => {
        let newArray: string[];
        if(selectedCategories && selectedCategories.length > 0) {
            if(selectedCategories.includes(category)) {
                let old = selectedCategories;
                let index = selectedCategories.indexOf(category);
                old.splice(index, 1);
                newArray = old;
            }
            else {
                let old = selectedCategories;
                newArray = old.concat([category])
            }
            setSelectedCategories(newArray)
        }
        else {
            newArray = [category];
            setSelectedCategories([category])
        }
        props.updateCategory(newArray)
    }

    const handleTime = (time: string) => {
        let newArray: string[];
        if(selectedTimes && selectedTimes.length > 0) {
            if(selectedTimes.includes(time)) {
                let old = selectedTimes;
                let index = selectedTimes.indexOf(time);
                old.splice(index, 1);
                newArray = old;
            }
            else {
                let old = selectedTimes;
                newArray = old.concat([time])
                setSelectedTimes(newArray)
            }
        }
        else {
            newArray = [time];
            setSelectedTimes([time])
        }
        props.updateTime(newArray)
    }

    const handleSearch = (searchString: string) => {
        let newString = searchString.split(" ");
        setSearchWords([...newString]);
        props.updateSearch([...newString]);
        props.updateActiveSearch(true);
    }

    const close = () => {
        if(props.close !== undefined) {
            props.close()
        }
    }

    return (
        <div className='header'>
            <input className="searchField inputField" type="text"  key="search"
            defaultValue={searchWords?.toString().replaceAll(",", " ")}
            placeholder="Søk"
            autoFocus={props.activeSearch}
            onChange={(e) => handleSearch(e.target.value.toLowerCase())}
            />
            <div>
                <SelectField options={categories} width={70} select={(category: string) => handleCategories(category)} fieldName="Kategori" selectedOptions={selectedCategories}/>
                <SelectField options={timeOptions} width={105} select={(time: string) => handleTime(time)} fieldName="Tid" selectedOptions={selectedTimes}/>
            </div>
            {props.canClose && (
                <img src={closeIcon} alt="close" width="18px" onClick={() => close()} style={{cursor: "pointer"}}/>
            )}
        </div>
    )
}
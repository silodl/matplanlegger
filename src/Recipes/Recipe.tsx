import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecipe } from './UseRecipe';
import './Recipe.css'
import leftArrow from '../Images/Icons/LeftArrow.png';

export const Recipe = () => {
    const { id } = useParams();
    const recipe = useRecipe({id});
    const [isLoading, setIsLoading] = useState(true);
    const [loadCount, setLoadCount] = useState(1);

    useEffect(() => {
        if(loadCount > 1) {
            setIsLoading(false);
        }
        setLoadCount(loadCount + 1);
    }, [recipe])

    return (
        <div className='root'>

            {isLoading && (
                <div className="popup dataLoader">
                    <div className="function"> 
                        <div> Laster oppskriften </div>
                        <div className="loading"/>
                    </div> 
                </div>
            )}  

            <div className='backbutton' onClick={() => window.history.back()}>
                <img src={leftArrow} alt="left-arrow"/> 
                <span> Tilbake </span>
            </div>
            
            {recipe && recipe.file && (
                <div className="recipePreview">
                    <object data={recipe.file} title="Viser oppskrift"  className="recipePreview" type="text/html"></object>
                </div>
            )}     

        </div>   
    )
}
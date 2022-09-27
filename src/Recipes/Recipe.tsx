import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecipe } from './UseRecipe';
import './Recipe.css'
import leftArrow from '../Images/Icons/LeftArrow.png';
import error from '../Images/Error2.png';

export const Recipe = () => {
    const { id } = useParams();
    const recipe = useRecipe({id});
    const [isLoading, setIsLoading] = useState(true);
    const [loadCount, setLoadCount] = useState(1);
    const [viewError, setViewError] = useState(false);

    useEffect(() => {
        if(loadCount > 1) {
            setIsLoading(false);
        }
        setLoadCount(loadCount + 1);
    }, [recipe])

    return(
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

            {recipe && recipe.url && !viewError && (
                <object data={recipe.url} id="recipe" className="recipePreview"
                type="text/html" onErrorCapture={() => setViewError(true)}/>
            )}

            {viewError && recipe && recipe.url && (
                <div className="noPreview">
                    <div>
                        <div> Kunne ikke hente innholdet</div>
                        <div> Trykk <a href={recipe.url} target="index" style={{textDecoration:"underline"}}>her</a> for å åpne oppskriften i en ny fane </div>
                    </div>
                    <img src={error} alt="error" width="80px"/>
                </div>
            )}

            {viewError && (
                <div> ERROR </div>
            )}
            
            {recipe && recipe.file && (
                <div className="recipePreview">
                    <object data={recipe.file}  className="recipePreview" type="text/html"/>
                </div>
            )}     

        </div>   
    )
}
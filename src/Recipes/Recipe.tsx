import { useParams } from 'react-router-dom';
import { useRecipe } from './UseRecipe';
import './Recipe.css'
import leftArrow from '../Images/Icons/LeftArrow.svg';

export const Recipe = () => {
    const { id } = useParams();
    const recipe = useRecipe({id});

    return(
        <div className='root'>
            <div className='backbutton' onClick={() => window.history.back()}>
                <img src={leftArrow} alt="left-arrow"/> 
                <span> tilbake </span>
            </div>
            {recipe && recipe.url && (
                <div>
                    <object data={recipe.url} className="recipePreview"
                    type="text/html">
                        <div className="noPreview">
                            <div> Kunne ikke hente innholdet</div>
                            <div> Trykk <a href={recipe.url} target="popup">her</a> for å opne oppskriften i ny fane</div>
                        </div>
                    </object>
                </div>
            )}
            
            {recipe && recipe.file && (
                <div className="recipePreview">
                    <object data={recipe.file}  className="recipePreview" type="text/html"/>
                </div>
            )}     

        </div>   
    )
}
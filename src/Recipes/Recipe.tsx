import { useParams } from 'react-router-dom';
import { useRecipe } from './UseRecipe';
import './Recipe.css'
import leftArrow from '../Images/Icons/LeftArrow.svg';

export const Recipe = () => {
    const { id } = useParams();
    const recipe = useRecipe({id}); 

    return(
        <div className='root'>
            <div className='backbutton'><a href="/oppskrifter"><img src={leftArrow} alt="left-arrow"/> <span> tilbake til alle oppskrifter </span></a></div>
            {recipe && recipe.url 
            ? <div> <iframe id="iframe" src={recipe.url} frameBorder="0" title={recipe.name}/> </div>
            : null
            }
        </div>   
    )
}
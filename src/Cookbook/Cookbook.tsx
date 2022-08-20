import { AppLayout } from '../App';
import { Card } from '../Components/Card';
import { Recipe } from '../Recipes/AddRecipe';
import { useParams } from 'react-router-dom';
import { useCookbook } from './UseCookbook';
import hat from '../Images/Icons/Hat_brown.svg';


export const Cookbook = () => {

  const { id } = useParams();
  const {cookbook, recipes} = useCookbook({id});

  return (
    <AppLayout>
      <div className='pageTitle'> {cookbook?.name} </div>
      
      {recipes.length > 0
        ?
        <div className='secondaryButton button center'> 
            <a href="/ny_oppskrift"> Legg til oppskrift </a>
        </div>
        : 
        <div className='primaryButton button center'> 
            <a href="/ny_oppskrift"> Legg til din første oppskrift </a>
        </div>
        }

      <div className='cardWrapper'>
        {recipes.length > 0 ?
        recipes.map((recipe: Recipe) => {
          return(
            <Card key={recipe.url} cardType="nonEmpty" image={recipe.image}>
              <div className="cardText"></div>
            </Card>
          )
        })
        : 
        <Card cardType="empty" image={hat}>
          <div className="cardText cardTextEmpty"> Ingen lagrede oppskrifter </div>
        </Card>
        }
      </div>
    </AppLayout>
  );
}
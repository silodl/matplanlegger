import { AppLayout } from '../App';
import { Card } from '../Components/Card';
import { Recipe } from '../Recipes/AddRecipe';
import { useParams } from 'react-router-dom';
import { useCookbook } from './UseCookbook';
import book from '../Images/book.png';



export const Cookbook = () => {

  const { id } = useParams();
  const {cookbook, recipes} = useCookbook({id});
  const isMobile = (window.innerWidth < 481) ? true : false;

  return (
    <AppLayout>     

        {recipes.length > 0 
        ?
        <>
          <div> 
            <div className='pageTitle'> {cookbook?.name} </div>
            <div className='secondaryButton button corner'> 
                <a href="/ny_oppskrift"> {isMobile ? "+" : "Legg til oppskrift"} </a>
            </div>
          </div>
          <div className='cardWrapper'>
            {recipes.map((recipe: Recipe) => {
              return(
                <Card key={recipe.url} cardType="nonEmpty" image={recipe.image}>
                  <div className="cardText"></div>
                </Card>
              )
            })}
          </div>
        </>
        : 
        <div className="emptyState">
          <div className='pageTitle'> {cookbook?.name} </div>
          <div> Boken har ingen oppskrifter enda </div>
          <img width={"200px"}
          src={book} alt="book"/>
          <div className='primaryButton button'> 
              <a href="/ny_oppskrift"> Legg til dens første oppskrift </a>
          </div>
        </div>
        }
      
    </AppLayout>
  );
}
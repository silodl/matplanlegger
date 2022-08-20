import { AppLayout } from '../App';
import { useCookbooks } from './UseCookbooks';
import { Card } from '../Components/Card';

export const LoadCookbook = (id: string) => {
    window.location.href = `/kokebok/${id}`;
}

export const Cookbooks = () => {

    const cookbooks = useCookbooks();

    return (
        <AppLayout>
        <div className='pageTitle'> Mine kokebøker </div>
        <div className='secondaryButton button center'> 
            <a href="/ny_kokebok"> Ny kokebok </a>
        </div>
        <div className='cardWrapper'>
            {cookbooks && cookbooks.length > 0 ?
            cookbooks.map((book) => {
            return(
                <div onClick={() => LoadCookbook(book.id)} key={book.id}>
                    <Card key={book.id} cardType="nonEmpty" image={book.image}>
                        <div className='cardText'>
                            {book.name}    
                        </div>    
                    </Card> 
                </div>
            )
            })
            : 
            <>
                <Card cardType='empty' image="../Images/Icons/Cookbook_brown.svg">
                    <div className='cardText'> Ingen lagrede kokebøker </div>
                </Card>
                
                <div className='primaryButton button center' 
                style={{marginTop:"10vh"}}> 
                <a href="/ny_kokebok"> Opprett din første kokebok </a></div>
            </>
            }
        </div>
        </AppLayout>
    );
}
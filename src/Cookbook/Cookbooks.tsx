import { AppLayout } from '../App';
import { useCookbooks } from './UseCookbooks';
import { Book } from '../Components/Book';

export const LoadCookbook = (id: string) => {
    window.location.href = `/kokebok/${id}`;
}

export const Cookbooks = () => {

    const cookbooks = useCookbooks();

    return (
        <AppLayout>
            <div className='pageTitle'> Mine kokebøker </div>
            <div className='secondaryButton button corner'> 
                <a href="/ny_kokebok"> Ny kokebok </a>
            </div>
            <div className='cardWrapper'>
                {cookbooks && cookbooks.length > 0 ?
                cookbooks.map((book) => {
                return(
                    <div onClick={() => LoadCookbook(book.id)} key={book.id}>
                        <Book key={book.id}  image={book.image}>
                            <div className='bookTitle'>
                                {book.name}    
                            </div>    
                        </Book> 
                    </div>
                )
                })
                : 
                <>
                    <div className='cardText'> Ingen lagrede kokebøker </div>

                    <div className='primaryButton button center' 
                    style={{marginTop:"10vh"}}> 
                    <a href="/ny_kokebok"> Opprett din første kokebok </a></div>
                </>
                }
            </div>
        </AppLayout>
    );
}
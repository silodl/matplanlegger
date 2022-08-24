import { AppLayout } from '../App';
import { useCookbooks } from './UseCookbooks';
import { Book } from './Book';
import books from '../Images/books.png';

export const LoadCookbook = (id: string) => {
    window.location.href = `/kokebok/${id}`;
}

export const Cookbooks = () => {

    const cookbooks = useCookbooks();
    const isMobile = (window.innerWidth < 481) ? true : false;

    return (
        <AppLayout>
            
            {cookbooks.length > 0 
            ?
            <>
                <div className="pageHeader">
                    <div></div>
                    <div className='title'> Mine kokebøker </div>
                    <div className='secondaryButton button'> 
                        <a href="/ny_kokebok"> {isMobile ? "+" : "Ny kokebok"} </a>
                    </div>
                </div>

                <div className='cardWrapper'>
                    {cookbooks.map((book) => {
                        return(
                            <div onClick={() => LoadCookbook(book.id)} key={book.id}>
                                <Book key={book.id}>
                                    <div className='bookTitle'>
                                        {book.name}
                                    </div> 
                                </Book> 
                            </div>
                        )
                    })}
                </div>
            </>
            : 
            <div className="emptyState">
                <div className='pageHeader title'> Mine kokebøker </div>
                <div> Du har ingen kokebøker enda </div>
                <img width={"170px"}
                src={books} alt="books"/>
                <div className='primaryButton button'> 
                    <a href="/ny_kokebok"> Legg til din første kokebok </a>
                </div>
            </div>
            }
        </AppLayout>
    );
}
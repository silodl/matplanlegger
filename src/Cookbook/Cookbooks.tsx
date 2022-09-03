import { AppLayout } from '../App';
import { useCookbooks } from './UseCookbooks';
import { Book } from './Book';
import books from '../Images/books.png';
import { useState, useEffect } from 'react';

export const LoadCookbook = (id: string) => {
    window.location.href = `/kokebok/${id}`;
}

export const Cookbooks = () => {

    const cookbooks = useCookbooks();
    const [isLoading, setIsLoading] = useState(true);
    const [loadCount, setLoadCount] = useState(1);

    useEffect(() => {
        if(loadCount > 1) {
            setIsLoading(false);
        }
        setLoadCount(loadCount + 1);
    }, [cookbooks])

    return (
        <AppLayout>

            {isLoading && (
                <div className="popup" style={{backdropFilter: "blur(5px)"}}>
                    <div className="loading"/>
                </div>
            )} 
            
            {cookbooks.length > 0 
            ?
            <>
                <div className="pageHeader">
                    <div className='title'> Mine kokebøker </div>
                    <div className='right secondaryButton'> 
                        <a href="/ny_kokebok">
                            <span className="mobile mobileButton"> + </span> <span className="desktop button"> Ny kokebok </span>
                        </a>
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
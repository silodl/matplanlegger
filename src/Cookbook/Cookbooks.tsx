import { AppLayout } from '../App';
import { useCookbooks } from './UseCookbooks';
import { Book } from './Book';
import books from '../Images/books.png';
import { useState, useEffect } from 'react';

export const LoadCookbook = (id: string) => {
    window.location.pathname = `/kokebok/${id}`;
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
            
            {cookbooks.length > 0 || isLoading
            ?
            <>
                <div className="pageHeader">
                    <div className='title'> Mine kokebøker </div>
                    <div className='right'> 
                        <a href="/ny_kokebok">
                            <span className="mobile mobileButton secondaryButton"> + </span> <span className="desktop button secondaryButton"> Ny kokebok </span>
                        </a>
                    </div>
                </div>

                {!isLoading && (
                    <div className='cardWrapper' style={{columnGap: "40px", rowGap: "30px"}} onLoad={() => setIsLoading(false)}>
                        {cookbooks.map((book) => {
                            return(
                                <div onClick={() => LoadCookbook(book.id)} key={book.id}>
                                    <Book booktitle={book.name} />   
                                </div>
                            )
                        })}
                    </div>
                )}
                

                {isLoading && (
                <div className="cardWrapper cardloading" style={{columnGap: "40px"}}>
                {Array.from(Array(3).keys()).map((i) => {
                    return(
                        <div className="book bookLoading" key={i}>
                            <div className="inner-book">
                                <div className="coverPage"></div>
                                <div className="page"></div>
                                <div className="page page-2"></div>
                                <div className="page page-3"></div>
                                <div className="page page-4"></div>
                                <div className="page page-5"></div>
                                <div className="final-page">
                                </div>
                            </div>
                        </div>
                    )
                })}
                </div>
            )}
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
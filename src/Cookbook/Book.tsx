import './Book.css'; 

export const Book = (props: {booktitle: string}) => {

    return(
        <div className="book">
            <div className="inner-book">
                <div className="coverPage">
                    <div className="bookTitle"> {props.booktitle} </div>
                </div>
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
}
import './Book.css'; 

type BookProps = {
    children: React.ReactNode,
    image?: string,
}

export const Book = (props: BookProps) => {

    return(
        <div className="book">  
            {props.image && (
                <img className='bookcover' src={props.image} alt="food"/>
            )}
            {props.children}
        </div>
    )
}
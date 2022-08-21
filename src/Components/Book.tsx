import './Book.css'; 

type BookProps = {
    children: React.ReactNode,
}

export const Book = (props: BookProps) => {

    return(
        <div className="book">  
            {props.children}
        </div>
    )
}
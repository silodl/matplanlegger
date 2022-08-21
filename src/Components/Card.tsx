import './Card.css';

type CardProps = {
    children: React.ReactNode,
    image?: string,
    weekday?: string,
}

export const Card = (props: CardProps) => {

    return(
        <div className="card">  
            {props.weekday && (
                <div className='weekday'> {props.weekday} </div>
            )}
            {props.image && (
                <img className='recipeImage' src={props.image} alt="food"/>
            )}
            {props.children}
        </div>
    )
}
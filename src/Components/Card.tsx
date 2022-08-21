import './Card.css';

type CardType = "nonEmpty" | "empty"; 

type CardProps = {
    children: React.ReactNode,
    cardType: CardType,
    image?: string,
    weekday?: string,
}

export const Card = (props: CardProps) => {

    return(
        <div className={props.cardType === "empty" 
            ? "emptyCard card"
            : "card"
        }>  
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
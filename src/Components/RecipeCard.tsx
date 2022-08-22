import './RecipeCard.css';

type CardProps = {
    children: React.ReactNode,
    image: string,
}

export const Card = (props: CardProps) => {

    return(
        <div className="card">  
            {props.image && (
                <img className='recipeImage' src={props.image} alt="food"/>
            )}
            {props.children}
        </div>
    )
}
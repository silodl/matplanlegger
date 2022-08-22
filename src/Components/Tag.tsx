import './RecipeCard.css';

export const Tag = (props:{tags: string[]}) => {

    const colors: string[] = ["#e1f1f6", "#dff0d0", "#f5dbd9", "#feecb5"];

    return(
        <div className="tags">
        {props.tags.map((tag) => {
            return(
                (tag.length > 1 && (
                    <div key={tag} className="tag" style={{backgroundColor: colors[props.tags.indexOf(tag)]}}> 
                        {tag} 
                    </div> 
                )) 
            )
        })}
        </div>
    )
}
import './RecipeCard.css';

export const Tag = (props:{tags: string[], removable?: boolean, onRemove?(tag: string): void}) => {

    const colors: string[] = ["#e1f1f6", "#dff0d0", "#feecb5", "#f5dbd9", "#e9d5c5"];

    const setColor = (tag: string) => {
        let index = props.tags.indexOf(tag);
        if(index > 4) {
            index = index % 5;
        }
        return colors[index]
    }

    return(
        <div className="tags">
        {props.tags.map((tag) => {
            return(
                (tag.length > 1 && (
                    <div key={tag} id={tag} className="tag" style={{backgroundColor: setColor(tag)}}> 
                        {tag} 
                    </div> 
                )) 
            )
        })}
        </div>
    ) 
}
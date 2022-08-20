export const Tag = (props:{tag: string, color: string}) => {

    return(
        <div className="tag" style={{backgroundColor: props.color}}> 
            {props.tag} 
        </div> 
    )
}
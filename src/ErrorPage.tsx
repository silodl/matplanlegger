import error from './Images/Error.svg';

export const ErrorPage = () => {

    return(
        <div className="root">
            <div className="emptyState" style={{marginTop: "100px", lineHeight: "2em"}}>
                <img src={error} alt="error" width="150px"/>
                <div> 
                    Denne siden finnes ikke 
                    <br/>
                    Ta meg til <i><a href="/oppskrifter" style={{textDecorationLine: "underline"}}> Mine oppskrifter </a></i>
                </div>
            </div>
        </div>
    )
}
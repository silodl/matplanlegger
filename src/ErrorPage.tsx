import error from './Images/Error.svg';

export const ErrorPage = () => {

    return(
        <div className="root">
            <div className="emptyState" style={{marginTop: "100px"}}>
                <img src={error} alt="error" width="150px"/>
                <div> Denne siden finnes ikke </div>
            </div>
        </div>
    )
}
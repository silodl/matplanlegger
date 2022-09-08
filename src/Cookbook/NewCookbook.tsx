import { AppLayout } from '../App';
import '../Recipes/NewRecipe.css';
import '../App.css';
import { useState } from 'react';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { AddCookbook } from './AddCookbook';
import checkmark from '../Images/Icons/Checkmark_black.svg';

export const NewCookbook = () => {

  const [name, setName] = useState("");
  const [share, setShare] = useState(false);
  const [owners, setOwners] = useState<string[]>([]);
  const user = useLoggedInUser();
  const [isSending, setIsSending] = useState(false);
  const [isFinishedSending, setIsFinishedSending] = useState(false);

  const [nameError, setNameError] = useState<string | undefined>();

  const submit = () => {
    if(owners && name !== "") {
      setIsSending(true);
      if( owners.length === 0 && user && user.email) {
        AddCookbook({name, owners: [user.email]})
        .then(() => {
          setIsFinishedSending(true);
          setTimeout( window.location.href = "/kokebok", 1000)
        })
      }
      else {
        AddCookbook({name, owners})
        .then(() => {
          setIsFinishedSending(true);
          setTimeout( window.location.href = "/kokebok", 1000)
        })
      }
    }
    else {
      setNameError("Du må gi navn til kokeboken din!")
    }
  }

  const handleOwners = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ownersString = e.target.value;
    if (ownersString.includes(",") && user && user.email) {
      setOwners(ownersString.split(",").concat([user.email]))
    }
    else if (user && user.email) {
      setOwners([ownersString, user.email])
    }
  }

  return (
    <AppLayout>

      {isSending && (
        <div className="popup dataLoader">
          <div className="function">
            {isFinishedSending 
            ? <> 
                <div> Oprettet! </div>
                <div className="checkmarkCircle"><img src={checkmark} width="40px" alt="checkmark"/></div>
             </>
            : <>
                <div> Oppretter kokeboken </div>
                <div className="loading"/>
              </>
            }
            
          </div>
        </div>
      )}

      <form className="formWrapper">
        <div className='center' style={{fontSize: "25px"}}> Ny kokebok </div>

        <div>
          <div className="fieldTitle"> Navn </div>
          <input className='inputField maxWidth'
            value={name}
            onChange={(e) => (setName(e.target.value), nameError && (setNameError(undefined)))}  
          />  
          {nameError && (<div className="errorMessage"> {nameError} </div> )}  
        </div>

        <div>
        <div className="fieldTitle alignCheckbox"> 
            <span onClick={() => setShare(!share)} className={share? "checkbox checked" : "checkbox"}>
              {share && (
                <img src={checkmark} id="checkmark" width="12px" alt="checkmark"/>
              )}    
            </span> 
            Del med andre 
        </div></div>
        {share ? 
          <input className='inputField maxWidth'
          placeholder='F.eks. ola@gmail.com, kari@gmail.com'
          onChange={(e) => handleOwners(e)}/>  
        : null}

        <div className='primaryButton button center' onClick={() => submit()}> Legg til </div> 
      
      </form>
    </AppLayout>
  );
}
import { AppLayout } from '../App';
import '../Recipes/NewRecipe.css';
import '../App.css';
import { useState } from 'react';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { AddCookbook } from './AddCookbook';
import checkmark from '../Images/Icons/Checkmark_black.svg';
import { useCheckUser } from './UseCheckUser';
import close from '../Images/Icons/Close.png';

export const NewCookbook = () => {

  const [name, setName] = useState("");
  const [share, setShare] = useState(false);
  const [owners, setOwners] = useState<string[]>([]);
  const user = useLoggedInUser();
  const [isSending, setIsSending] = useState(false);
  const [isFinishedSending, setIsFinishedSending] = useState(false);
  const [newOwner, setNewOwner] = useState("");
  const isNewUser = useCheckUser(newOwner);

  const [nameError, setNameError] = useState<string | undefined>();
  const [ownerError, setOwnerError] = useState<string | undefined>();


  const submit = () => {
    if(owners && name !== "") {
      setIsSending(true);
      if( owners.length === 0 && user && user.email) {
        AddCookbook({name, owners: [user.email]})
        .then(() => {
          setIsFinishedSending(true);
          setTimeout( window.location.pathname = "/kokebok", 1000)
        })
      }
      else {
        AddCookbook({name, owners})
        .then(() => {
          setIsFinishedSending(true);
          setTimeout( window.location.pathname = "/kokebok", 1000)
        })
      }
    }
    else {
      setNameError("Du må gi navn til kokeboken din!")
    }
  }

  const handleOwners = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter" && e.target.value !== "") {
      if(isNewUser && !owners.includes(e.target.value) && user && e.target.value !== user.email) {
        if(owners) {
          let newArray = owners;
          newArray.push(e.target.value)
          setOwners([...newArray])
        }
        else {
          setOwners([e.target.value])
        }
        setNewOwner("");
      }
      else {
        if(user && e.target.value === user.email) {
          setOwnerError("Du trenger ikke dele med deg selv")
        }
        else(
          setOwnerError("Finner ikke brukeren")
        )
      }
    }
  }

  const removeOwner = (owner: string) => {
    let newOwners = owners;
    const index = newOwners.indexOf(owner);
    newOwners.splice(index, 1);
    setOwners([...newOwners]);
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
          </div>
        </div>
        {share && (
            <>
            <div className="owners">
              {owners.map((owner) => {
                return(
                  <div className="owner" key={owner}>{owner} <img src={close} className="removeTag" alt="close" onClick={() => removeOwner(owner)}/></div>
                )
              })}
              <input className='inputField' value={newOwner} placeholder="ola@mail.no"
              onChange={(e) => (setNewOwner(e.target.value), setOwnerError(undefined))} onKeyDown={(e) => handleOwners(e)}
              />
            </div>
            {ownerError && (<div className="errorMessage"> {ownerError} </div>)}
            </>
          )}

        <div className='primaryButton button center' onClick={() => submit()}> Legg til </div> 
      
      </form>
    </AppLayout>
  );
}
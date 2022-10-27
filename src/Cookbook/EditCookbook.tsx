import { CookbookProps } from './UseCookbooks';
import { DeleteCookbook } from './DeleteCookbook';
import { UpdateCookbook } from './UpdateCookbook';
import '../App.css';
import checkmark from '../Images/Icons/Checkmark.svg';
import close from '../Images/Icons/Close.png';
import { useCheckUser } from './UseCheckUser';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { useEffect, useState } from 'react';

export const EditCookbook = (props: {cookbook: CookbookProps, avbryt: Function}) => {
    const [name, setName] = useState(props.cookbook.name);
    const [share, setShare] = useState(props.cookbook.owners.length > 1);
    const [owners, setOwners] = useState<string[]>([]);
    const [viewDelete, setViewDelete] = useState(false);
    const user = useLoggedInUser();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFinishedDeleting, setIsFinishedDeleting] = useState(false);
    const [newOwner, setNewOwner] = useState("");
    const isNewUser = useCheckUser(newOwner);
  
    const [nameError, setNameError] = useState<string | undefined>();
    const [ownerError, setOwnerError] = useState<string | undefined>();
  
    useEffect(() => {
      if(user && user.email) {
        let cookBookOwners = props.cookbook.owners;
        const index = cookBookOwners.indexOf(user.email);
        cookBookOwners.splice(index, 1);
        setOwners([...cookBookOwners]);
        if(cookBookOwners.length >= 1) {
          setShare(true);
        }
      }
    },[props.cookbook, user])
  
    const handleOwners = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if(e.key === "Enter" && e.target.value !== "") {
        if(isNewUser && !owners.includes(e.target.value) && user && e.target.value !== user.email ) {
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
          setOwnerError("Finner ikke brukeren")
        }
      }
    }
  
    const removeOwner = (owner: string) => {
      let newOwners = owners;
      const index = newOwners.indexOf(owner);
      newOwners.splice(index, 1);
      setOwners([...newOwners]);
    }
  
    const handleCookbookName = (name: string) => {
      const cookbookName = name.charAt(0).toUpperCase() + name.substring(1)
      setName(cookbookName)
  
      if(nameError) {
        setNameError(undefined)
      }
    }
  
    const deleteCookbook = () => {
      if(user) {
        setIsDeleting(true);
        DeleteCookbook({cookbook: props.cookbook, user})
        .then(() => {
          setIsFinishedDeleting(true);
          setTimeout(window.location.pathname = "/kokebok", 1000)
        })
      }
    }
  
    const updateCookbook = () => {
      if (user && user.email && name) {
        const updatedCookbook: CookbookProps = props.cookbook;
        updatedCookbook.name = name;
        updatedCookbook.owners = owners.concat([user.email]);
        UpdateCookbook(updatedCookbook)
        .then(() => 
        props.avbryt())
      }
      else {
        if(!name) {
          setNameError("Du må gi navn til kokeboken din!")
        }
      }
  }
  
    return(
        <div className="popup">
  
          {isDeleting && (
            <div className="popup dataLoader">
              <div className="function">
                {isFinishedDeleting
                ? <> 
                    <div> Slettet! </div>
                    <div className="checkmarkCircle"><img src={checkmark} width="40px" alt="checkmark"/></div>
                </>
                : <>
                    <div> Sletter kokeboken </div>
                    <div className="loading"/>
                  </>
                }
                
              </div>
            </div>
          )}
  
          <div className="popupContent editCookbook">
            <div>
              <div className="fieldTitle"> Navn </div>
              <input className='inputField' style={{width: "330px"}} maxLength={30}
                value={name} onChange={(e) => handleCookbookName(e.target.value)}  
              />
              {nameError && (<div className="errorMessage">{nameError}</div>)}    
            </div>
  
            <div>
              <div className="fieldTitle alignCheckbox"> 
                  <span onClick={() => (setShare(!share), setOwners([]))} className={share? "checkbox checked" : "checkbox"}>
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
                <input className='inputField' style={{width: "330px"}}
                value={newOwner} 
                onChange={(e) => (setNewOwner(e.target.value), setOwnerError(undefined))} onKeyDown={(e) => handleOwners(e)}
                />
              </div>
              {ownerError && (<div className="errorMessage"> {ownerError} </div>)}
              </>
            )}
          
            <div className="centerElements" style={{marginTop: "15px"}}>
              <div className="deleteButton button" onClick={() => setViewDelete(true)}> Slett </div>
              <div>
                <div className="button" onClick={() => props.avbryt()}> Avbryt </div>
                <div className="primaryButton button" onClick={() => updateCookbook()}> Lagre </div>
              </div>
            </div>
  
          </div>
  
          {viewDelete && (
            <div className="popup">
                <div className="popupContent deleteAlert">
                    <div style={{display: "flex", flexWrap: "wrap"}}> Er du sikker på at du vil slette {props.cookbook.name} ? </div>
                    <div className="centerElements">
                        <div className="button" onClick={() => setViewDelete(false)}> Avbryt </div>
                        <div className="deleteButton button" onClick={() => deleteCookbook()}> Slett </div>
                    </div>
                </div>
            </div>
          )}
        </div>
    )
  }
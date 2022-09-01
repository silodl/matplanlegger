import { AppLayout } from '../App';
import '../Recipes/NewRecipe.css';
import '../App.css';
import { useState } from 'react';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { AddCookbook } from './AddCookbook';

export const NewCookbook = () => {

  const [name, setName] = useState("");
  const [share, setShare] = useState(false);
  const [owners, setOwners] = useState<string[]>([]);
  const user = useLoggedInUser();

  const submit = () => {
    if(owners) {
      if( owners.length === 0 && user && user.email) {
        AddCookbook({name, owners: [user.email]});
      }
      else {
        AddCookbook({name, owners});

      }
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

      <form className="formWrapper">
        <div className='center' style={{fontSize: "25px"}}> Ny kokebok </div>

        <div>
          <div className="fieldTitle"> Navn </div>
          <input className='inputField maxWidth'
            value={name}
            onChange={(e) => setName(e.target.value)}  
          />    
        </div>

        <div>
        <div className="fieldTitle"> 
            <span onClick={() => setShare(!share)} className="checkbox">
                {share && (
                  <div className="checkMark">
                    <div className="checkmark_stem"></div>
                    <div className="checkmark_kick"></div>
                  </div>
                )}    
            </span> 
            Del med andre 
        </div></div>
        {share ? 
          <input className='inputField' size={30}
          placeholder='F.eks. ola@gmail.com, kari@gmail.com'
          onChange={(e) => handleOwners(e)}/>  
        : null}

        <div className='primaryButton button center' onClick={() => submit()}> Legg til </div> 
      
      </form>
    </AppLayout>
  );
}
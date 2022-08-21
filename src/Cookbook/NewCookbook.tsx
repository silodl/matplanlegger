import { AppLayout } from '../App';
import '../Recipes/NewRecipe.css';
import '../App.css';
import { useState } from 'react';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { AddCookbook } from './AddCookbook';

export const NewCookbook = () => {

  const [name, setName] = useState("");
  const [share, setShare] = useState(false);
  
  const user = useLoggedInUser();

  const submit = () => {
    AddCookbook({name, user});
  }

  return (
    <AppLayout>

      <form className="formWrapper" style={{padding: "0 17vw", width: "66vw"}}>
        <div className='center' style={{fontSize: "25px"}}> Ny kokebok </div>

        <div>
          <div className="fieldTitle"> Navn </div>
          <input className='inputField' size={30}
            value={name}
            onChange={(e) => setName(e.target.value)}  
          />    
        </div>

        <div>
        <div className="fieldTitle"> 
            <span onClick={() => setShare(!share)} className="checkBox">
                {share ? <span className="checkMark">&#10004;</span> : null}    
            </span> 
            Del med andre 
        </div></div>
        {share ? 
          <input className='inputField' size={30}
          placeholder='F.eks. ola.nordmann@gmail.com'/>  
        : null}

        <div className='primaryButton button center' onClick={() => submit()}> Legg til </div> 
      
      </form>
    </AppLayout>
  );
}
import { AppLayout } from '../App';
import '../Recipes/NewRecipe.css';
import '../App.css';
import { useState } from 'react';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import Cookbook from '../Images/Icons/Cookbook_brown.svg'
import { AddCookbook } from './AddCookbook';

export const NewCookbook = () => {

  const [name, setName] = useState("");
  const [share, setShare] = useState(false);
  
  const user = useLoggedInUser();

  const submit = () => {
    AddCookbook({name, image: Cookbook, user});
  }

  return (
    <AppLayout>

      <form className="formWrapper">
        <div className='center' style={{fontSize: "25px"}}> Ny kokebok </div>

        <div className="inputTitle"> Navn </div>
        <input className='inputField'
          value={name}
          onChange={(e) => setName(e.target.value)}  
        />   

        <div className="inputTitle"> Bilde </div>   
        <div className="selectImage">
          <img src={Cookbook} alt="kokebok"/>
        </div>
        <div className="inputTitle"> 
            <span onClick={() => setShare(!share)} className="checkBox">
                {share ? <span className="checkMark">&#10004;</span> : null}    
            </span> 
            Del med andre 
        </div>
        {share ? 
          <input className='inputField' placeholder='F.eks. ola.nordmann@gmail.com'/>  
        : null}

        <div className='primaryButton button center' onClick={() => submit()}> Legg til </div> 
      
      </form>
    </AppLayout>
  );
}
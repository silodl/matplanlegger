import { useState, useEffect } from 'react';
import {Navigate} from 'react-router-dom';
import '../App.css';
import './Authentication.css';
import '../Recipes/NewRecipe.css';
import Phone from '../Images/Phone.svg';
import Blob from '../Images/blob.svg';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth';
import { auth, db } from '../Firebase';
import { setDoc, doc } from 'firebase/firestore';
import { useLoggedInUser } from './UseLoggedInUser';

export const Authentication = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [page, setPage] = useState("login");

    const user = useLoggedInUser();

    useEffect(() => {
      if(user){
        setRedirect(true);
      }
    },[user])

    const login = () =>{
        if(email && password){
          signInWithEmailAndPassword(auth, email, password)
          .then((user) => {
            if(user){
                setRedirect(true);
            }
          })
          .catch( error => {
            setError(error.message)
          })
        }
        else {
          let error = "Vennligst fyll inn dette feltet";
          if(!password){
            setPasswordError(error);
            document.getElementById("password")?.focus();
          }
          if(!email){
            setEmailError(error);
            document.getElementById("email")?.focus();
          }
        }
      }

      const newUser = async (userId: string) => {
        await setDoc(doc(db, "users", userId), {
          email: email,
          });  
      }
    
      const register = () => {
        if(email && password){
          createUserWithEmailAndPassword(auth, email, password)
          .then(userCredential => {
            let userId = userCredential.user.uid;
            newUser(userId);       
          })
          .catch( error => {
            setError(error.message)
          })
        }
        else {
          let error = "Vennligst fyll inn dette feltet";
          if(!password){
            setPasswordError(error);
            document.getElementById("password")?.focus();
          }
          if(!email){
            setEmailError(error);
            document.getElementById("email")?.focus();
          }
        }
      }

    return(
        <div className="root">

            {redirect ? <Navigate to="/ukeplanlegger"/> : null}
            
            <div className="landingPageTitle"> Den digitale kokeboken </div>
            <div className="landingPageText">
                <ul>
                    <li> Lagre oppskrifter </li>
                    <li> Lag egen ukemeny </li>
                    <li> Lag felles kokebok </li>
                </ul>
            </div>

            <div className="loginWrapper">
                <div className='title'> {page === "login" ? "Logg inn" : "Registrer"} </div>
                
                <div> {error} </div>

                <div className="inputTitle"> E-post </div>
                <input className='inputField'
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}  
                />
                
                <div className="inputTitle"> Passord </div>
                <input className='inputField'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}  
                />
                
                <div className="centerElements">
                    {page === "login" 
                    ? 
                    <>
                        <div className="secondaryButton button" onClick={() => setPage("register")}> Registrer </div>
                        <div className="primaryButton button" onClick={login}> Logg inn </div>
                    </>
                    :
                    <>
                        <div className="secondaryButton button" onClick={() => setPage("login")}> Logg inn</div>
                        <div className="primaryButton button" onClick={register}> Registrer </div>
                    </>
                    }
                </div>
            </div>
            <img className="imageFrame" src={Blob} alt=""/>
            <img className="landingPageImage" src={Phone} alt=""/>
            
        </div>
    );
}
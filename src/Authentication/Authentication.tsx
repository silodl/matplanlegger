import { useState, useEffect } from 'react';
import {Navigate} from 'react-router-dom';
import '../App.css';
import './Authentication.css';
import '../Recipes/NewRecipe.css';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth';
import { auth, db } from '../Firebase';
import { setDoc, doc } from 'firebase/firestore';
import { useLoggedInUser } from './UseLoggedInUser';
import hat from '../Images/Icons/Hat_brown.svg';
import food1 from '../Images/food1.jpg';
import food2 from '../Images/food2.jpg';

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
      .then((currentUser) => {
        if(currentUser){
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

  console.log(window.innerWidth)


  return(
      <div className="root" style={{overflow: "auto"}}>

          {redirect ? <Navigate to="/oppskrifter"/> : null}
          
          <div className="landingPageTitle"> 
            Matplanlegger 
            <img src={hat} alt="chef's hat"/>
          </div>

          <div className="landingpage center">

            <div className="loginWrapper">
                <div className='title'> {page === "login" ? "Logg inn" : "Registrer"} </div>
                
                {error && (
                  <div> {error} </div>
                )}
                
                <div>
                  <div className="fieldTitle"> E-post </div>
                  <input className='inputField'
                  type="email"
                  value={email}
                  size={25}
                  onChange={(e) => setEmail(e.target.value)}  
                  />
                </div>
                
                <div>
                  <div className="fieldTitle"> Passord </div>
                  <input className='inputField'
                  type="password"
                  size={25}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}  
                  />
                </div>
                
                {/** 
                <div>
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
                </div>*/}
                {page === "login" 
                    ? 
                    <>
                      <div className="primaryButton button center" onClick={login}> Logg inn </div>
                      <div> Ny bruker? <u style={{cursor: "pointer"}} onClick={() => setPage("register")}> Register deg </u> </div>
                    </>
                    :
                    <>
                      <div className="primaryButton button center" onClick={register}> Registrer </div>
                      <div> Allerede en bruker? <u style={{cursor: "pointer"}} onClick={() => setPage("login")}> Logg inn </u> </div>
                    </>
                    }
            </div>
            
            <div className="landingPageImage mobile">
              <img src={food1} alt="pasta" style={{width:"130px", rotate:"-83deg", position: "relative", left: "30px"}}/>
              <img src={food2} alt="seafood" style={{width:"130px", rotate:"83deg", position: "relative", top: "115px", right: "30px"}}/>
            </div>
            
            <div className="landingPageText pc">
              <ul>
                <li> Lagre oppskrifter </li>
                <li> Planlegg ukemeny </li>
                <li> Lag felles kokebok </li>
              </ul>

              <img src={food1} alt="pasta" style={{width:"80px", rotate:"-83deg", position: "relative", top: "-15px"}}/>
              <img src={food2} alt="seafood" style={{width:"80px", rotate:"83deg", position: "relative", top: "40px", right: "-15px"}}/>
          </div>
            
          </div>

      </div>
  );
}
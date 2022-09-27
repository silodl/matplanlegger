import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from './Firebase';
import logo from './Images/Logo.png';
import './LoadingPage.css';

export const LoadingPage = () => {

    useEffect(() => {
        const unlisten = onAuthStateChanged(auth, (user) => {
          if (!user && window.location.pathname !== "/logg_inn" && window.location.pathname !== "/registrer") {
            window.location.pathname = "/logg_inn";
          }
          else {
            window.location.pathname = "/oppskrifter";
          }
        });
        return () => {
          unlisten();
        }
      },[])

    return (
        <div className="root loadingpage">
            <img src={logo} alt="logo" width="150px" height="150px"/>
        </div>
    )
}
import './Navbar.css';
import recipes2 from '../Images/NavbarIcons/Recipe2.svg';
import calendar2 from '../Images/NavbarIcons/Calendar2.svg';
import cookbook2 from '../Images/NavbarIcons/Cookbook2.svg';
import profile2 from '../Images/NavbarIcons/Profile2.svg';
import { useEffect } from 'react';

export const Navbar = () => {

    const path = window.location.pathname;

    useEffect(() => {
        let ukeplanlegger = document.getElementById("ukeplanlegger");
        let kokebok = document.getElementById("kokebok");
        let oppskrifter = document.getElementById("oppskrifter");
        let min_profil = document.getElementById("min_profil");

        if(path === "/ukeplanlegger" && ukeplanlegger) {
            ukeplanlegger.className = "active";
        }
        else if((path.includes("/kokebok") || path === "/ny_kokebok") && kokebok) {
            kokebok.className = "active";
        }
        else if((path === "/oppskrifter" || path === "/ny_oppskrift") && oppskrifter) {
            oppskrifter.className = "active";
        }
        else if(path === "/min_profil" && min_profil) {
            min_profil.className = "active";
        }
    },[path])



    return(
        <div className="navbar">
            <div className="navbarContent">
                <a href="/oppskrifter" id="oppskrifter"> 
                    <span className="desktop">Mine oppskrifter</span>
                    <span className="mobile"><img src={recipes2} alt="add recipe"/> <div/></span> 
                </a>

                <a href="/ukeplanlegger" id="ukeplanlegger"> 
                    <span className="desktop"> Ukeplanlegger </span>
                    <span className="mobile"> <img src={calendar2} alt="Plate"/> <div/> </span>
                </a> 

                <a href="/kokebok" id="kokebok"> 
                    <span className="desktop"> Mine kokebøker </span>
                    <span className="mobile"> <img src={cookbook2} alt="Cookbook"/> <div/> </span>
                </a> 

                <a href="/min_profil" id="min_profil"> 
                    <span className="desktop"> Min profil </span> 
                    <span className="mobile"><img src={profile2} style={{transform: "scale(0.95)"}} alt="Profil"/><div/></span>
                </a>
            </div>
        </div>
    );
}
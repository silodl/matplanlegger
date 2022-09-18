import './Navbar.css';
import recipes from '../Images/NavbarIcons/Recipe.png';
import calendar from '../Images/NavbarIcons/Calendar.png';
import cookbook from '../Images/NavbarIcons/Cookbook.png';
import profile from '../Images/NavbarIcons/Profile.png';

export const Navbar = () => {

    const path = window.location.pathname;

    return(
        <div className="navbar">
            <div className="navbarText">
                <a className={path === "/ukeplanlegger" ? "active" : ""} href="/ukeplanlegger"> Ukeplanlegger </a> 
                <a className={path === "/kokebok" ? "active" : ""} href="/kokebok"> Mine kokebøker </a> 
                <a className={path === "/oppskrifter" ? "active" : ""} href="/oppskrifter"> Mine oppskrifter </a>
                <a className={path === "/min_profil" ? "active" : ""} href="/min_profil"> Min profil </a>
            </div>
            <div className='navbarIcons'>
                <a className={path === "/oppskrifter" ? "active" : ""} style={{transform: "scale(0.9)"}} href="/oppskrifter"><img src={recipes} alt="add recipe"/></a>
                <a className={path === "/ukeplanlegger" ? "active" : ""} href="/ukeplanlegger"><img src={calendar} alt="Plate"/></a>
                <a className={path === "/kokebok" ? "active" : ""} href="/kokebok"><img src={cookbook} alt="Cookbook"/></a>
                <a className={path === "/min_profil" ? "active" : ""} style={{transform: "scale(1.1)"}} href="/min_profil"><img src={profile} alt="Profil"/></a>
            </div>
        </div>
    );
}
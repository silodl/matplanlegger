import './Navbar.css';
import cookbook from '../Images/Icons/Cookbook.svg';
import recipes from '../Images/Icons/Recipes.svg';
import profile from '../Images/Icons/Profile.svg';
import calendar from '../Images/Icons/Calendar.svg';

export const Navbar = () => {

    const path = window.location.pathname;

    return(
        <div className="navbar">
            <div className="navbarText">
                <a className={path === "/ukeplanlegger" ? "active" : ""} href="/ukeplanlegger"> Ukeplanlegger </a> 
                <a className={path === "/kokebok" ? "active" : ""} href="/kokebok"> Kokebok </a> 
                <a className={path === "/oppskrifter" ? "active" : ""} href="/oppskrifter"> Mine oppskrifter </a>
                <a className={path === "/min_profil" ? "active" : ""} href="/min_profil"> Min profil </a>
            </div>
            <div className='navbarIcons'>
                <a className={path === "/oppskrifter" ? "active" : ""} href="/oppskrifter"><img src={recipes} alt="add recipe"/></a>
                <a className={path === "/ukeplanlegger" ? "active" : ""} href="/ukeplanlegger"><img src={calendar} alt="Plate"/></a>
                <a className={path === "/kokebok" ? "active" : ""} href="/kokebok"><img src={cookbook} alt="Cookbook"/></a>
                <a className={path === "/min_profil" ? "active" : ""} href="/min_profil"><img src={profile} alt="Profil"/></a>
            </div>
        </div>
    );
}
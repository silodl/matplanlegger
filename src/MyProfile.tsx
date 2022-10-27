import './App.css';
import { useLoggedInUser } from './Authentication/UseLoggedInUser';
import { auth } from './Firebase';
import { signOut } from '@firebase/auth';
import { AppLayout } from './App';

export const MyProfile = () => {

    const user = useLoggedInUser();

    return(
        <AppLayout>
            <div className='header'> 
                <div/>
                <div className="title">Min profil</div>  
                <div/>               
            </div>

            {user
            ? 
            <>
                <div> E-post: {user.email} </div>
                <div className="primaryButton button center" onClick={() => signOut(auth)}> <a href="/logg_inn"> Logg ut </a> </div>
            </>
            : null}
        </AppLayout>
    )
}
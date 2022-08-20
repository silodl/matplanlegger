import './App.css';
import { Navbar } from "./Components/Navbar";

export const AppLayout = (props: {children: React.ReactNode}) => {

    return(
        <div className='root'>
            {props.children}
            <Navbar/>
        </div>
    )
}
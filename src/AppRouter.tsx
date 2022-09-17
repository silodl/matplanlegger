import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
  
import { WeekPlanner } from './WeekPlanner/WeekPlanner';
import { NewRecipe } from "./Recipes/NewRecipe";
import { Cookbook } from "./Cookbook/Cookbook";
import { Authentication } from "./Authentication/Authentication";
import { Cookbooks } from "./Cookbook/Cookbooks";
import { NewCookbook } from "./Cookbook/NewCookbook";
import { MyProfile } from "./MyProfile";
import { Recipes } from "./Recipes/Recipes";
import { Recipe } from "./Recipes/Recipe";
import { ErrorPage } from "./ErrorPage";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";
  
export const AppRouter = () => {

    useEffect(() => {
        const unlisten = onAuthStateChanged(auth, (user) => {
          if (!user) {
            window.location.href = "/";
          }
        });
        return () => {
          unlisten();
        }
    },[])

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Authentication/>}/>
                <Route path="/ukeplanlegger" element={<WeekPlanner/>}/>
                <Route path="/oppskrifter" element={<Recipes/>}/>
                <Route path="/oppskrifter/:id" element={<Recipe/>}/>
                <Route path="/ny_oppskrift" element={<NewRecipe/>}/>
                <Route path="/kokebok" element={<Cookbooks/>}/>
                <Route path="/ny_kokebok" element={<NewCookbook/>}/>
                <Route path="/kokebok/:id" element={<Cookbook/>}/>
                <Route path="/min_profil" element={<MyProfile/>}/>
                <Route path="*" element={<ErrorPage/>}/>
            </Routes>
        </Router>
    );
}
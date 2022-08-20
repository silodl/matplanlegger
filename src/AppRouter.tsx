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
  
export const AppRouter = () => {

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
            </Routes>
        </Router>
    );
}
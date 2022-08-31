import { AppLayout } from '../App';
import './NewRecipe.css';
import { useEffect, useState } from 'react';
import { AddRecipe, NewRecipeInterface } from './AddRecipe';
import fetch from 'node-fetch';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';

type FoodCategory = "Frokost" | "Lunsj" | "Middag" | "Dessert" | "Drinker";

export const NewRecipe = () => {

  const [type, setType] = useState("url");
  const [tags, setTags] = useState<string[]>([]);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<FoodCategory>("Middag");
  const [viewCategoryOptions, setViewCategoryOptions] = useState(false);
  const [viewTimeOptions, setViewTimeOptions] = useState(false);
  const [timeUnit, setTimeUnit] = useState("minutter");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");

  const user = useLoggedInUser();

  const categories: FoodCategory[] = ["Frokost", "Lunsj", "Middag", "Dessert", "Drinker"]

  const handleTags = (tagString: string) => {
    if (tagString.includes(",")) {
      setTags(tagString.split(","))
    }
    else {
      setTags([tagString])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  const AddNewRecipe = () => {
    const cookTime = time + " " + timeUnit
    if (user) {
      const owner = user.uid;
      const id = "";
      const newRecipe: NewRecipeInterface = {url, file, name: title, category, image: imageUrl, time: cookTime, tags, owner, id}
      AddRecipe(newRecipe);
    }
  }

  const GetContent = () => {        
    fetch(`https://jsonlink.io/api/extract?url=${url}`)
    .then((res) => {
      return res.json();
    })
    .then((content) => {
      let recipeTitle: string = content["title"]
      recipeTitle = recipeTitle.charAt(0).toUpperCase() + recipeTitle.slice(1).toLowerCase();
      setTitle(recipeTitle)
      setImageUrl(content["images"][0])
    })
  }

  useEffect(() => {
    if( url !== "") {
      GetContent();
    }
  },[url])

  useEffect(() => {
    if(file) {
      let newTitle = file.name.split(".")[0];
      newTitle = newTitle.charAt(0).toUpperCase() + newTitle.slice(1).toLowerCase();
      setTitle(newTitle)  
    }

  },[file])

  return (
    <AppLayout>

      <form className="formWrapper">
        <div className="formTitle"> Ny oppskrift </div>

        <div>
          <div className="fieldTitle"> Hvor henter du oppskriften fra? </div>
            <div className={type === "url" ? "toggleWrapper leftToggle" : "toggleWrapper rightToggle"}>

              <div onClick={() => setType("url")} className={type === "url" ? "lTest" : ""}> link </div>
              <div onClick={() => setType("file")} className={type === "url" ? "" : "rTest"}> fil </div>
            </div>
            
        </div>

        {type === "url" 
          ?  <input
              id="urlField"
              className="inputField"
              type="url"
              size={35}
              placeholder="matbloggen.no/kyllingsuppe"
              onChange={(e) => setUrl(e.target.value)}
            />
          : <input
            id="fileField"
            className="fileInput"
            type="file"
            onChange={(e) => handleFileInput(e)}
            />
        }
        
        <div>
          <div className="fieldTitle"> Tittel </div>
          <input className='inputField' size={35}
            placeholder='Kyllingsuppe'
            onChange={(e) => setTitle(e.target.value)}
            value={title}/>
        </div>

        <div>
          <div className="fieldTitle"> Kategori </div>

          <div tabIndex={0} onBlur={() => setViewCategoryOptions(false)}>
            <div className={viewCategoryOptions? "selectField selectFieldOpen" :"selectField"} style={{width: "100px"}}
              onClick={() => setViewCategoryOptions(!viewCategoryOptions)}> {category} <div className="selectFieldArrow"/>
            </div>

            <div style={{position: "absolute", height:"0"}}>
              {viewCategoryOptions && (
                  <div className='selectOptions' id="selectOptions" style={{width:"116px"}}>
                    {categories.map((categoryOption) => {
                      return(
                        <div key={categoryOption} className='option' id="option"
                        onClick={() => (setCategory(categoryOption), setViewCategoryOptions(false))}> {categoryOption} </div>
                      )
                    })} 
                  </div>

              )}
            </div>
          </div>  
        </div>

        <div>
          <div className="fieldTitle"> Tidsbruk </div>
            <div className="multiField">
              <input 
                className='inputField'
                type="number"
                placeholder='30'
                style={{width: "50px"}}
                onChange={(e) => setTime(e.target.value)}/>
            
              <div tabIndex={0} onBlur={() => setViewTimeOptions(false)}>
                <div className={viewTimeOptions? "selectField selectFieldOpen" :"selectField"} style={{width: "85px"}}
                  onClick={() => setViewTimeOptions(!viewTimeOptions)}> {timeUnit} <div className="selectFieldArrow"/> 
                </div>

                <div style={{position: "absolute", height:"0"}}>
                  {viewTimeOptions && (
                    <div className='selectOptions' style={{width: "101px"}}>
                      <div onClick={() => (setTimeUnit("minutter"), setViewTimeOptions(false))} className="option"> minutter </div>
                      <div onClick={() => (setTimeUnit("timer"), setViewTimeOptions(false))} className="option"> timer </div>
                    </div>
                  )}
                </div>
              
              </div>
            </div>
        </div>

        <div>
          <div className="fieldTitle"> Tags <span style={{fontSize: "14px"}}>(maks 4)</span> </div>
          <input className='inputField' size={35}
            onChange={(e) => handleTags(e.target.value)}
            placeholder="f.eks. kylling, thai, asiatisk"/>
          </div>
        
        <div className='primaryButton button center' onClick={() => AddNewRecipe()}> Legg til </div>
      </form>
    </AppLayout>
  );
}
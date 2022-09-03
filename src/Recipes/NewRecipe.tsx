import { AppLayout } from '../App';
import './NewRecipe.css';
import { useEffect, useState } from 'react';
import { AddRecipe, NewRecipeInterface } from './AddRecipe';
import fetch from 'node-fetch';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { Tag } from './Tag';
import { CookbookProps, useCookbooks } from '../Cookbook/UseCookbooks';

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
  const [viewCookbooks, setViewCookbooks] = useState(false);
  const [addToCookbook, setAddToCookbook] = useState<CookbookProps[]>([])
  const user = useLoggedInUser();
  const cookbooks = useCookbooks();
  const [timeOptions, setTimeOptions] = useState(["minutter", "timer"]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadCount, setLoadCount] = useState(1);

  const categories: FoodCategory[] = ["Frokost", "Lunsj", "Middag", "Dessert", "Drinker"];

  useEffect(() => {
    if(parseInt(time) < 2) {
      setTimeOptions(["minutter", "time"])
    } 
    else if(timeOptions !== ["minutter", "timer"]) {
      setTimeOptions(["minutter", "timer"])
    }
  },[time])

  useEffect(() => {
    if(loadCount > 1) {
      setIsLoading(false);
    }
    setLoadCount(loadCount + 1);
  },[cookbooks])

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

  const handleAddToCookbook = (cookbook: CookbookProps) => {
    let checkbox = document.getElementById(cookbook.id);
    if (addToCookbook.includes(cookbook)) {
      const newArray = addToCookbook;
      const index = addToCookbook.indexOf(cookbook);
      newArray.splice(index, 1);
      setAddToCookbook(newArray);

      if(checkbox) {
        checkbox.className = "checkMark hiddenCheckMark"
      }
    }
    else {
      setAddToCookbook(arr => [...arr, cookbook]);
      if(checkbox) {
        checkbox.className = "checkMark"
      }
    }
  }

  const AddNewRecipe = () => {
    const cookTime = time + " " + timeUnit
    if (user) {
      const owner = user.uid;
      const newRecipe: NewRecipeInterface = {url, file, name: title, category, image: imageUrl, time: cookTime, tags, owner}
      AddRecipe(newRecipe, addToCookbook);
    }
  }

  const GetContent = () => {  
    setIsLoading(true);
    fetch(`https://jsonlink.io/api/extract?url=${url}`)
    .then((res) => {
      return res.json();
    })
    .then((content) => {
      let recipeTitle: string = content["title"]
      recipeTitle = recipeTitle.charAt(0).toUpperCase() + recipeTitle.slice(1).toLowerCase();
      setTitle(recipeTitle)
      setImageUrl(content["images"][0])
      setIsLoading(false);
    })
    .catch(() => {
      setIsLoading(false);
    })
  }

  useEffect(() => {
    if( url !== "" && url.includes(".") && url.includes("/")) {
      GetContent();
    }
  },[url])

  useEffect(() => {
    setIsLoading(true);
    if(file) {
      let newTitle = file.name.split(".")[0];
      newTitle = newTitle.charAt(0).toUpperCase() + newTitle.slice(1).toLowerCase();
      setTitle(newTitle);
      setIsLoading(false);
    }
  },[file])


  return (
    <AppLayout>

      {isLoading && (
        <div className="popup" style={{backdropFilter: "blur(1px)"}}>
          <div className="function"> 
            <div className="loading"/>
          </div> 
        </div>
      )} 

      <form className="formWrapper">
        <div className="formTitle"> Ny oppskrift </div>

        <div>
          <div className="fieldTitle"> Hvor henter du oppskriften fra? </div>
            <div style={{position: "relative"}}> <div className={type === "url" ? "toggle leftToggle" : "toggle rightToggle"}/> </div>
            <div className={type === "url" ? "toggleWrapper leftToggle" : "toggleWrapper rightToggle"}>
              <div onClick={() => setType("url")}> link </div>
              <div onClick={() => setType("file")}> fil </div>
            </div>
            
        </div>

        {type === "url" 
          ?  <input
              className="inputField maxWidth"
              placeholder="matbloggen.no/kyllingsuppe"
              onChange={(e) => setUrl(e.target.value)}
            />
          : <input
            className="fileInput"
            type="file"
            onChange={(e) => handleFileInput(e)}
            />
        }
        
        <div>
          <div className="fieldTitle"> Tittel </div>
          <input className='inputField maxWidth'
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

            <div style={{position: "relative", top: 0}}><div style={{position: "absolute", height:"0"}}>
                {viewCategoryOptions && (
                    <div className='selectOptions' style={{width:"116px"}}>
                      {categories.map((categoryOption) => {
                        return(
                          <div key={categoryOption} className='option'
                          onClick={() => (setCategory(categoryOption), setViewCategoryOptions(false))}> {categoryOption} </div>
                        )
                      })} 
                    </div>
                )}
            </div></div>
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
                <div className={viewTimeOptions? "selectField selectFieldOpen": "selectField"} style={{width: "85px"}}
                  onClick={() => setViewTimeOptions(!viewTimeOptions)}> {timeUnit} <div className="selectFieldArrow"/> 
                </div>

                <div style={{position: "relative", top: 0}}><div style={{position: "absolute", height:"0"}}>
                  {viewTimeOptions && (
                    <div className='selectOptions' style={{width: "101px"}}>
                      {timeOptions.map((timeoption) => {
                        return(
                          <div key={timeoption} className='option'
                          onClick={() => (setTimeUnit(timeoption), setViewTimeOptions(false))}> {timeoption} </div>
                        )
                      })} 
                    </div>
                  )}
                </div></div>
              
              </div>
            </div>
        </div>

        <div>
          <div className="fieldTitle"> Tags <span style={{fontSize: "14px"}}>(maks 4)</span> </div>
          <input className='inputField' size={35}
            onChange={(e) => handleTags(e.target.value)}
            placeholder="f.eks. kylling, thai, asiatisk"/>
        </div>
        
        {tags.length > 0 && (<Tag tags={tags} />)}
        
        {cookbooks && cookbooks.length > 0 && (
          <div>
            <div className="fieldTitle"> Legg til i kokebok </div>

            <div tabIndex={0} onBlur={() => setViewCookbooks(false)}>
              <div className={viewCookbooks? "selectField selectFieldOpen" :"selectField"} style={{width: "120px"}}
                onClick={() => setViewCookbooks(!viewCookbooks)}> Velg <div className="selectFieldArrow"/>
              </div>
            
              <div style={{position: "relative", top: 0}}><div style={{position: "absolute", height:"0"}}>
                {viewCookbooks && (
                    <div className='selectOptions' style={{width:"136px"}}>
                      {cookbooks.map((cookbook) => {
                        return(
                          <div key={cookbook.id} className='option alignCheckbox' 
                          onClick={() => handleAddToCookbook(cookbook)}> 
                            <div className="checkbox">
                              <div id={cookbook.id} className={addToCookbook.includes(cookbook) ? "checkMark" : "checkMark hiddenCheckMark"}>
                                <div className="checkmark_stem"/>
                                <div className="checkmark_kick"/>
                              </div>
                            </div> 
                            {cookbook.name} </div>
                        )
                      })} 
                    </div>
                )}
              </div></div>
            </div> 
  
          </div>
        )}
        
        <div className='primaryButton button center' onClick={() => AddNewRecipe()}> Legg til </div>
      </form>
    </AppLayout>
  );
}
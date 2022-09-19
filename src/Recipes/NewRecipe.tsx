import { AppLayout } from '../App';
import './NewRecipe.css';
import { useEffect, useState } from 'react';
import { AddRecipe, NewRecipeInterface } from './AddRecipe';
import fetch from 'node-fetch';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { Tag } from './Tag';
import { CookbookProps, useCookbooks } from '../Cookbook/UseCookbooks';
import checkmark from '../Images/Icons/Checkmark_black.svg';

type FoodCategory = "Frokost" | "Lunsj" | "Middag" | "Dessert" | "Bakverk" | "Drinker";

export const categories: FoodCategory[] = ["Frokost", "Lunsj", "Middag", "Dessert", "Bakverk", "Drinker"];
export const timeOptions = ["Under 20 min", "20-40 min", "40-60 min", "1-2 timer", "Over 2 timer"];

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
  const [time, setTime] = useState("20-40 min");
  const [title, setTitle] = useState("");
  const [viewCookbooks, setViewCookbooks] = useState(false);
  const [addToCookbook, setAddToCookbook] = useState<CookbookProps[]>([])
  const user = useLoggedInUser();
  const cookbooks = useCookbooks();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [loadCount, setLoadCount] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [isFinishedSending, setIsFinishedSending] = useState(false);

  const [urlError, setUrlError] = useState<string | undefined>();
  const [fileError, setFileError] = useState<string | undefined>();
  const [titleError, setTitleError] = useState<string | undefined>();

  useEffect(() => {
    if(loadCount > 1) {
      setIsLoadingPage(false);
    }
    setLoadCount(loadCount + 1);
  },[cookbooks])

  const handleTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter" && e.target.value !== "") {
      if(tags) {
        let newArray = tags;
        newArray.push(e.target.value)
        setTags([...newArray])
      }
      else {
        setTags([e.target.value])
      }
      let tagField = window.document.getElementById("tagField") as HTMLInputElement
      if(tagField) {
        tagField.value = ""
      }
    } 
  }

  const removeTag = (tag: string) => {
    if(tag && tags && tags.includes(tag)) {
      let newArray = tags;
      const index = tags?.indexOf(tag)
      newArray?.splice(index, 1)
      setTags([...newArray]) 
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  const handleAddToCookbook = (cookbook: CookbookProps) => {
    let checkmark = document.getElementById(`checkmark${cookbook.id}`);
    let checkbox = document.getElementById(`checkbox${cookbook.id}`);
    if (addToCookbook.includes(cookbook)) {
      const newArray = addToCookbook;
      const index = addToCookbook.indexOf(cookbook);
      newArray.splice(index, 1);
      setAddToCookbook(newArray);

      if(checkmark) {
        checkmark.className = "hiddenCheckmark"
      }
      if(checkbox) {
        checkbox.className = "checkbox"
      }
    }
    else {
      setAddToCookbook(arr => [...arr, cookbook]);
      if(checkmark) {
        checkmark.className = ""
      }
      if(checkbox) {
        checkbox.className = "checkbox checked"
      }
    }
  }

  const AddNewRecipe = async() => {
    const cookTime = time + " " + timeUnit
    if (user) {
      if ((url === "" && type === "url") || (!file && type === "file") || title === "" || time === "") {
        if(url === "" && type === "url") {
          setUrlError("Legg inn link til oppskriften")
        }
        if(!file && type === "file") {
          setFileError("Mangler fil")
        }
        if(title === "") {
          setTitleError("Legg til tittel")
        }
      }
      else {
        setIsSending(true)
        const owner = user.uid;
        const newRecipe: NewRecipeInterface = {url, file, name: title, category, image: imageUrl, time: cookTime, tags, owner}
        await AddRecipe(newRecipe, addToCookbook)
        .then(() => {
          setIsFinishedSending(true);
          setTimeout(window.location.pathname = "/oppskrifter", 1000);
        })
      }
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
      setTitle("");
      setImageUrl("");
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
    }
    setIsLoading(false);
  },[file])


  return (
    <AppLayout>

      {isLoadingPage && (
        <div className="popup dataLoader formLoader">
          <div className="emptyText" style={{width: "100%"}}/>
          <div className="emptyText" style={{width: "60%"}}/>
          <div className="emptyText" style={{width: "80%"}}/>
        </div>
      )}

      {isSending && (
        <div className="popup dataLoader">
          <div className="function">
            {isFinishedSending 
            ? <> 
                <div> Lagret! </div>
                <div className="checkmarkCircle"><img src={checkmark} width="40px" alt="checkmark"/></div>
             </>
            : <>
                <div> Lagrer oppskriften </div>
                <div className="loading"/>
              </>
            }
          </div>
        </div>
      )}

      {isLoading && (
        <div className="popup dataLoader">
          <div className="function"> 
            <div> Henter data </div>
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

        {type === "url" && (
          <div>
            <input
              className="inputField maxWidth"
              placeholder="matbloggen.no/kyllingsuppe"
              onChange={(e) => (setUrl(e.target.value), urlError && (setUrlError(undefined)))}
            />
            {urlError && (<div className="errorMessage"> {urlError} </div> )}  
          </div>
        )}

        {type === "file" && (
          <div>
            <input
              className="fileInput"
              type="file"
              onChange={(e) => (handleFileInput(e), fileError && (setFileError(undefined)))}
            />
            {fileError && (<div className="errorMessage"> {fileError} </div> )}  
          </div>
        )} 
        
        <div>
          <div className="fieldTitle"> Tittel </div>
          <input className='inputField maxWidth'
            placeholder='Kyllingsuppe'
            onChange={(e) => (setTitle(e.target.value), titleError && (setTitleError(undefined)))}
            value={title}/>
            {titleError && (<div className="errorMessage"> {titleError} </div> )} 
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
          <div className="fieldTitle"> Tid </div>
            <div tabIndex={0} onBlur={() => setViewTimeOptions(false)}>
              <div className={viewTimeOptions ? "selectField selectFieldOpen" :"selectField"} style={{width: "100px"}}
                onClick={() => setViewTimeOptions(!viewTimeOptions)}> {time} <div className="selectFieldArrow"/>
              </div>

              <div style={{position: "relative", top: 0}}><div style={{position: "absolute", height:"0"}}>
                  {viewTimeOptions && (
                      <div className='selectOptions' style={{width:"116px"}}>
                        {timeOptions.map((timeOption) => {
                          return(
                            <div key={timeOption} className='option'
                            onClick={() => (setTime(timeOption), setViewTimeOptions(false))}> {timeOption} </div>
                          )
                        })} 
                    </div>
                  )}
              </div></div>
            </div> 
        </div>

        <div>
          <div className="fieldTitle"> Tags <span style={{fontSize: "14px"}}>(maks 4)</span> </div>
          <input className='inputField maxWidth' type="text" 
            onKeyDown={(e) => handleTags(e)}
            id={"tagField"}
            placeholder="trykk enter for å legge til"/>
        </div>
        
        {tags.length > 0 && (<Tag tags={tags} removable={true} onRemove={(tag) => removeTag(tag)} />)}
        
        {cookbooks && cookbooks.length > 0 && (
          <div>
            <div className="fieldTitle"> Legg til i kokebok </div>

            <div tabIndex={0} onBlur={() => setViewCookbooks(false)}>
              <div className={viewCookbooks? "selectField selectFieldOpen" :"selectField"} style={{width: "250px"}}
                onClick={() => setViewCookbooks(!viewCookbooks)}> Velg <div className="selectFieldArrow"/>
              </div>
            
              <div style={{position: "relative", top: 0}}><div style={{position: "absolute", height:"0"}}>
                {viewCookbooks && (
                    <div className='selectOptions' style={{width:"266px"}}>
                      {cookbooks.map((cookbook) => {
                        return(
                          <div key={cookbook.id} className='option alignCheckbox' 
                          onClick={() => handleAddToCookbook(cookbook)}> 
                            <div id={`checkbox${cookbook.id}`} className={addToCookbook.includes(cookbook) ? "checkbox checked" : "checkbox"}>
                              <img src={checkmark} id={`checkmark${cookbook.id}`} width="12px" alt="checkmark" className={addToCookbook.includes(cookbook) ? "" : "hiddenCheckmark"}/>
                            </div> 
                            {cookbook.name} 
                          </div>
                        )
                      })} 
                    </div>
                )}
              </div></div>
            </div> 
  
          </div>
        )}
        
        <div className='primaryButton button center' style={{minHeight: "40px"}} onClick={() => AddNewRecipe()}> Legg til </div>
      </form>
    </AppLayout>
  );
}
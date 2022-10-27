import { AppLayout } from '../App';
import './NewRecipe.css';
import { useEffect, useState } from 'react';
import { AddRecipe, NewRecipeInterface } from './AddRecipe';
import fetch from 'node-fetch';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { CookbookProps, useCookbooks } from '../Cookbook/UseCookbooks';
import checkmark from '../Images/Icons/Checkmark.svg';
import { useTags } from './UseTags';
import { SelectField } from '../Components/SelectField';
import { MultiselectField } from '../Components/MultiselectField';
import leftArrow from '../Images/Icons/LeftArrow.png';

type FoodCategory = "Frokost" | "Lunsj" | "Middag" | "Dessert" | "Bakverk" | "Drinker";

export const categories: FoodCategory[] = ["Frokost", "Lunsj", "Middag", "Dessert", "Bakverk", "Drinker"];
export const timeOptions = ["Under 20 min", "20-40 min", "40-60 min", "1-2 timer", "Over 2 timer"];

export const NewRecipe = () => {

  const [type, setType] = useState("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState("20-40 min");
  const [tags, setTags] = useState<string[]>([]);
  const [viewCookbooks, setViewCookbooks] = useState(false);
  const [addToCookbook, setAddToCookbook] = useState<CookbookProps[]>([])
  const user = useLoggedInUser();
  const tagSuggestions =  useTags();
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
        const newRecipe: NewRecipeInterface = {url, file, name: title, category, image: imageUrl, time, tags, owner}
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
        
        <div className="formHeader">
          <img src={leftArrow} onClick={() => window.history.back()} alt="left arrow" width="22px"/>
          <div className="title"> Ny oppskrift </div>
          <div style={{width: "22px"}}/>
        </div>

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
          <SelectField options={categories} defaultValue="Middag" width={100} select={(category: string) => setCategory(category)}/>
        </div> 

        <div>
          <div className="fieldTitle"> Tid </div>
          <SelectField options={timeOptions} defaultValue={"20-40 min"} width={120} select={(time: string) => setTime(time)}/>
        </div>

        <div>
          <div className="fieldTitle"> Tags </div>
          <MultiselectField options={[...tagSuggestions]} placeholder="kylling" canWrite={true} width={150} select={(tags: string[]) => setTags(tags)}/>
        </div>
     
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
        
        <div className='primaryButton button center' style={{minHeight: "40px", marginBottom: "60px"}} onClick={() => AddNewRecipe()}> Legg til </div>
      </form>
    </AppLayout>
  );
}
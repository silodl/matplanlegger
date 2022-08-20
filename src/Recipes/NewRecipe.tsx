import { AppLayout } from '../App';
import './NewRecipe.css';
import { useEffect, useState } from 'react';
import { Tag } from '../Components/Tag';
import { AddRecipe, Recipe } from './AddRecipe';
import fetch from 'node-fetch';
import { useLoggedInUser } from '../Authentication/UseLoggedInUser';
import { Card } from '../Components/Card';

type FoodCategory = "Frokost" | "Lunsj" | "Middag" | "Dessert" | "Drinker";

export const NewRecipe = () => {

  const [type, setType] = useState("url");
  const [tags, setTags] = useState<string[]>([]);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<FileList | null>();
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<FoodCategory>("Middag");
  const [viewCategoryOptions, setViewCategoryOptions] = useState(false);
  const [viewTimeOptions, setViewTimeOptions] = useState(false);
  const [timeUnit, setTimeUnit] = useState("minutter");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");

  const user = useLoggedInUser();

  const categories: FoodCategory[] = ["Frokost", "Lunsj", "Middag", "Dessert", "Drinker"]
  const tagColors: string[] = ["#e1f1f6", "#dff0d0", "#f5dbd9", "#feecb5"];

  const handleToggle = (value: string) => {
    let toggle = document.getElementById("toggle");
    if(toggle && value !== type) {
      if(value === "url"){
        toggle.className = "toggle toggleLeft";
      }
      else if(value === "file") {
        toggle.className = "toggle toggleRight";
      }
      setType(value);
    }
  }

  const handleTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      let value = e.target.value
      if(value.includes(",")) {
        let newTags = value.split(",");
        setTags(tags.concat(newTags))
      }
      else {
        setTags(old => [...old, value])
      }
    }
  }

  const AddNewRecipe = () => {
    const cookTime = time + " " + timeUnit
    if (user) {
      const userID = user.uid;
      const id = "";
      const newRecipe: Recipe = {url, file, name: title, category, image: imageUrl, time: cookTime, tags, userID, id}
      console.log(newRecipe)
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
      recipeTitle = recipeTitle.charAt(0) + recipeTitle.slice(1).toLowerCase()
      setTitle(recipeTitle)
      setImageUrl(content["images"][0])
    })
  }

  useEffect(() => {
    if( url !== "") {
      GetContent();
    }
  },[url])

  return (
    <AppLayout>

      <form className="formWrapper">
        <div className='center' style={{fontSize: "25px"}}> Ny oppskrift </div>
        <div className="inputTitle"> Hvor henter du oppskriften fra? </div>

        <div className="fileChoiceContainer"> 
          <div className='toggleWrapper'><div id="toggle" className='toggle'/></div>
          <span className={type === "url" ? "activeToggle" : ""}
            onClick={() => handleToggle("url")}>
              link 
          </span>
          <span className={type === "file" ? "activeToggle" : ""}
            onClick={() => handleToggle("file")}>
              last opp 
          </span>
        </div>

        {type === "url"
        ? 
          <input
            id="urlField"
            className="inputField"
            type="url"
            placeholder="matbloggen.no/kyllingsuppe"
            onChange={(e) => setUrl(e.target.value)}
          />
        : <input
          id="fileField"
          className="fileInput fileInputField"
          type="file"
          onChange={(e) => setFile(e.currentTarget.files)}
          />
        }
        
        <div className="inputTitle"> Tittel </div>
        <input className='inputField'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <div className="inputTitle"> Kategori </div>
        
        <div onClick={() => setViewCategoryOptions(!viewCategoryOptions)}
        className={viewCategoryOptions? "selectedField selectedFieldOpen" :"selectedField"}> {category}</div>
        {viewCategoryOptions 
        ?
          <div className="alignSelectField">
            <div className='selectField'>
            {categories.map((categoryOption) => {
              return(
                <div key={categoryOption} className='option'
                onClick={() => (setCategory(categoryOption), setViewCategoryOptions(false))}> {categoryOption} </div>
              )
            })}
            </div>
          </div>
        : null}

        <div className="inputTitle"> Tidsbruk </div>
          <div className="timeField">
            <input 
              className='inputField'
              type="number"
              placeholder='30'
              onChange={(e) => setTime(e.target.value)}
            />
            
            <div onClick={() => setViewTimeOptions(!viewTimeOptions)}
            className={viewTimeOptions? "selectedField selectedFieldOpen" :"selectedField"}> {timeUnit} </div>
            
              {viewTimeOptions 
              ?
                <div className="alignSelectField">
                  <div className='selectField'>
                    <div onClick={() => (setTimeUnit("minutter"), setViewTimeOptions(false))} className="option"> minutter </div>
                    <div onClick={() => (setTimeUnit("timer"), setViewTimeOptions(false))} className="option"> timer </div>
                  </div>
                </div>
              : null
              }
        </div>

        <div className="inputTitle"> Tags </div>
        <input className='inputField'
          onKeyDown={(e) => handleTags(e)}
          placeholder="f.eks. kylling, thai, asiatisk"/>

        {tags.length > 0
        ? <div className="tagContainer">
            {tags.map((tag) => {
              return(
                <Tag key={tag} tag={tag} color={tagColors[tags.indexOf(tag)]}/>
              )
            })}
          </div>
        : null}

        {url && type === "url" &&(
          <div className="previewCard">
            <Card cardType='nonEmpty' image={imageUrl}>
              <div className="cardText"> 
                <div className="title"> {title} </div>
              </div>
            </Card>
          </div>
        )}
        

        <div className='primaryButton button center' onClick={() => AddNewRecipe()}> Legg til </div>
      </form>
    </AppLayout>
  );
}
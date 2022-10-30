import { AppLayout } from "../App";
import { useCookbooks } from "./UseCookbooks";
import books from "../Images/books.png";
import { useState, useEffect } from "react";
import "./Book.css";
import add from "../Images/Icons/Add.png";
import { useRecipes } from "../Recipes/UseRecipes";
import { Recipe } from "../Recipes/AddRecipe";

export const LoadCookbook = (id: string) => {
  window.location.pathname = `/kokebok/${id}`;
};

const GetImagesFromCookbook = (props: {
  recipeIds: string[];
  cookbookId: string;
}) => {
  let recipes: (Recipe | undefined)[] = useRecipes(props.recipeIds);

  useEffect(() => {
    while (recipes.length < 2) {
      recipes.push(undefined);
    }
  }, []);

  return (
    <div className="cookbookImages">
      {Array.from(Array(2).keys()).map((i) => {
        return (
          <>
            {recipes[i]?.image ? (
              <img
                src={recipes[i]?.image}
                key={props.cookbookId + recipes[i]?.id}
                alt="cookbook images"
              />
            ) : (
              <div key={props.cookbookId + recipes[i]?.id} />
            )}
          </>
        );
      })}
    </div>
  );
};

export const Cookbooks = () => {
  const cookbooks = useCookbooks();
  const [isLoading, setIsLoading] = useState(true);
  const [loadCount, setLoadCount] = useState(1);

  useEffect(() => {
    if (loadCount > 1) {
      setIsLoading(false);
    }
    setLoadCount(loadCount + 1);
  }, [cookbooks]);


  return (
    <AppLayout>
      {cookbooks.length > 0 || isLoading ? (
        <>
          <div className="header">
            <div style={{ width: "38px" }} />
            <div className="title"> Mine kokebøker </div>
            <div className="right">
              <a href="/ny_kokebok">
                <div className="mobile iconButton">
                  <img src={add} width="22px" alt="add" />
                </div>
                <div className="desktop button"> Ny kokebok </div>
              </a>
            </div>
          </div>

          {!isLoading && (
            <div className="bookWrapper" onLoad={() => setIsLoading(false)}>
              {cookbooks.map((book) => {
                return (
                  <div onClick={() => LoadCookbook(book.id)} key={book.id}>
                    <div className="book">
                      {book.recipes.length >= 2 ? (
                        <GetImagesFromCookbook
                          recipeIds={book.recipes.slice(0, 2)}
                          cookbookId={book.id}
                        />
                      ) : (
                        <GetImagesFromCookbook
                          recipeIds={book.recipes.slice(
                            0,
                            book.recipes.length - 1
                          )}
                          cookbookId={book.id}
                        />
                      )}
                      <div className="bookTitle">{book.name}</div>
                      {book.recipes.length >= 4 ? (
                        <GetImagesFromCookbook
                          recipeIds={book.recipes.slice(2, 4)}
                          cookbookId={book.id}
                        />
                      ) : (
                        <GetImagesFromCookbook
                          recipeIds={book.recipes.slice(
                            2,
                            book.recipes.length - 1
                          )}
                          cookbookId={book.id}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {isLoading && (
            <div className="bookWrapper">
              {Array.from(Array(3).keys()).map((i) => {
                return (
                  <div className="book bookLoading" key={i}>
                    <GetImagesFromCookbook
                      recipeIds={[]}
                      cookbookId={"loading"}
                    />
                    <GetImagesFromCookbook
                      recipeIds={[]}
                      cookbookId={"loading2"}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="emptyState">
          <div className="pageHeader title"> Mine kokebøker </div>
          <div> Du har ingen kokebøker enda </div>
          <img width={"170px"} src={books} alt="books" />
          <div className="primaryButton button">
            <a href="/ny_kokebok"> Legg til din første kokebok </a>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

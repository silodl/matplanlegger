import { CookbookProps } from "./UseCookbooks";
import { DeleteCookbook } from "./DeleteCookbook";
import { UpdateCookbook } from "./UpdateCookbook";
import "../App.css";
import checkmark from "../Images/Icons/Checkmark.svg";
import close from "../Images/Icons/Close.png";
import { useLoggedInUser } from "../Authentication/UseLoggedInUser";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

export const EditCookbook = (props: {
  cookbook: CookbookProps;
  avbryt: Function;
}) => {
  const [name, setName] = useState(props.cookbook.name);
  const [share, setShare] = useState(props.cookbook.owners.length > 1);
  const [owners, setOwners] = useState<string[]>([]);
  const [viewDelete, setViewDelete] = useState(false);
  const user = useLoggedInUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFinishedDeleting, setIsFinishedDeleting] = useState(false);
  const [newOwner, setNewOwner] = useState("");

  const [nameError, setNameError] = useState<string | undefined>();
  const [ownerError, setOwnerError] = useState<string | undefined>();

  useEffect(() => {
    if (user && user.email) {
      let cookbookOwners: string[] = [];
      props.cookbook.owners.forEach((owner) => {
        if(owner !== user.email) {
          cookbookOwners.push(owner);
        }
      })
      setOwners([...cookbookOwners]);
      if (cookbookOwners.length >= 1) {
        setShare(true);
      }
    }
  }, [props.cookbook, user]);

  useEffect(() => {
    if(newOwner && newOwner.includes(".") && newOwner.split(".")[1].length >= 2) {
      let isUser = false
      const q = query(collection(db, "users"), where("email", "==", newOwner));
      getDocs(q)
      .then((docs) => {
        if(docs.size === 1){
          isUser = true;
        }
      })
      .then(() => {
        if(isUser && !owners.includes(newOwner) && !props.cookbook.owners.includes(newOwner)) {
          setOwners(old => [...old, newOwner]);
          setNewOwner("");
        }
        else if(isUser && (owners.includes(newOwner) || props.cookbook.owners.includes(newOwner))) {
          setOwnerError("Deler allerede med denne brukeren");
        }
        else {
          setOwnerError("Finner ikke brukeren");
        }
      })
    } 
  },[newOwner])

  const removeOwner = (owner: string) => {
    let newOwners = owners;
    const index = newOwners.indexOf(owner);
    newOwners.splice(index, 1);
    setOwners([...newOwners]);
  };

  const handleCookbookName = (name: string) => {
    const cookbookName = name.charAt(0).toUpperCase() + name.substring(1);
    setName(cookbookName);

    if (nameError) {
      setNameError(undefined);
    }
  };

  const deleteCookbook = () => {
    if (user && props.cookbook) {
      setIsDeleting(true);
      DeleteCookbook({ cookbook: props.cookbook, user })
      .then(() => {
        setIsFinishedDeleting(true);
        setTimeout((window.location.pathname = "/kokebok"), 1000);
      });
    }
  };

  const updateCookbook = () => {
    if (user && user.email && name) {
      const updatedCookbook: CookbookProps = props.cookbook;
      updatedCookbook.name = name;
      updatedCookbook.owners = owners.concat([user.email]);
      UpdateCookbook(updatedCookbook).then(() => props.avbryt());
    } else {
      if (!name) {
        setNameError("Du må gi navn til kokeboken din!");
      }
    }
  };

  return (
    <div className="popup">
      {isDeleting && (
        <div className="popup dataLoader">
          <div className="function">
            {isFinishedDeleting ? (
              <>
                <div> Slettet! </div>
                <div className="checkmarkCircle">
                  <img src={checkmark} width="40px" alt="checkmark" />
                </div>
              </>
            ) : (
              <>
                <div> Sletter kokeboken </div>
                <div className="loading" />
              </>
            )}
          </div>
        </div>
      )}

      <div className="popupContent editCookbook">
        <div>
          <div className="fieldTitle"> Navn </div>
          <input
            className="inputField"
            style={{ width: "330px" }}
            maxLength={30}
            value={name}
            onChange={(e) => handleCookbookName(e.target.value)}
          />
          {nameError && <div className="errorMessage">{nameError}</div>}
        </div>

        <div>
          <div className="fieldTitle alignCheckbox">
            <span
              onClick={() => (setShare(!share), setOwners([]))}
              className={share ? "checkbox checked" : "checkbox"}
            >
              {share && (
                <img
                  src={checkmark}
                  id="checkmark"
                  width="12px"
                  alt="checkmark"
                />
              )}
            </span>
            Del med andre
          </div>
        </div>

        {share && (
          <div className="fieldTitle">
            Brukernes mail
            <div className="owners">
              {owners.map((owner) => {
                return (
                  <div className="owner" key={owner}>
                    {owner}{" "}
                    <img
                      src={close}
                      className="removeTag"
                      alt="close"
                      onClick={() => removeOwner(owner)}
                    />
                  </div>
                );
              })}
              <input
                className="inputField"
                style={{ width: "330px" }}
                value={newOwner}
                placeholder="ola.nordmann@mail.no"
                onChange={(e) => (
                  setNewOwner(e.target.value),
                  setOwnerError(undefined)
                )}
              />
            </div>
            {ownerError && <div className="errorMessage"> {ownerError} </div>}
          </div>
        )}

        <div className="centerElements" style={{ marginTop: "15px" }}>
          <div
            className="deleteButton button"
            onClick={() => setViewDelete(true)}
          >
            {" "}
            Slett{" "}
          </div>
          <div>
            <div className="button" onClick={() => props.avbryt()}>
              {" "}
              Avbryt{" "}
            </div>
            <div
              className="primaryButton button"
              onClick={() => updateCookbook()}
            >
              {" "}
              Lagre{" "}
            </div>
          </div>
        </div>
      </div>

      {viewDelete && (
        <div className="popup">
          <div className="popupContent deleteAlert">
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {" "}
              Er du sikker på at du vil slette {props.cookbook.name} ?{" "}
            </div>
            <div className="centerElements">
              <div className="button" onClick={() => setViewDelete(false)}>
                {" "}
                Avbryt{" "}
              </div>
              <div
                className="deleteButton button"
                onClick={() => deleteCookbook()}
              >
                {" "}
                Slett{" "}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

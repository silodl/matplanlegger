import { getDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";
import { useState, useEffect } from "react";

export const useTags = () => {
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        const fetchTags = async() => {
            const docRef = doc(db, "data", "tags");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const tags: string[] = docSnap.get("tags");
                setTags(tags);
            }
        }
        fetchTags(); 
    },[]);

    return tags;
}
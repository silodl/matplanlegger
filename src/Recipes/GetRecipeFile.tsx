import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';



export const GetRecipeFile = (props: {file: string}) => {
    const [file, setFile] = useState("");
    const storage = getStorage();
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    getDownloadURL(ref(storage, props.file))
    .then((url) => {
       //setFile(url);
       console.log(url)
    })
        /*<img src={file} alt="recipe"/>*/

}

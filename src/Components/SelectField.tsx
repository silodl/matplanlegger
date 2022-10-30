import { useEffect, useState } from "react";
import './Fields.css';

interface Props {
    options: string[], 
    fieldName?: string, 
    selectedOptions: string[] | undefined,
    width: number,
    select: Function,
}

export const SelectField = (props: Props) => {

    const [viewOptions, setViewOptions] = useState(false);
    const [fieldName, setFieldName] = useState(props.fieldName)
    const [selectedOptions, setSelectedOptions] = useState(props.selectedOptions);
    const [options, setOptions] = useState([...props.options]);

    useEffect(() => {
        setOptions(props.options)
    },[props.options])

    const handleClick = (option: string) => {
        props.select(option);
        setViewOptions(false);
    }

    return(
        <div tabIndex={0} onBlur={() => setViewOptions(false)} style={{width: (props.width + 18) + "px"}}>
            <div className={viewOptions ? "selectField selectFieldOpen" :"selectField"} 
                style={{width: props.width + "px"}}
                onClick={() => setViewOptions(!viewOptions)}> 
                {fieldName} 
            </div>

            <div style={{position: "relative", top: 0}}><div style={{position: "absolute", height:"0"}}>
                {viewOptions && (
                    <div className='selectOptions' style={{width: (props.width + 16) + "px"}}>
                      {options.map((option) => {
                        return(
                          <div key={option} 
                          className={`option ${(selectedOptions?.includes(option)) ? "checkedOption" : ""}`}
                          onClick={() => handleClick(option)}> {option} </div>
                        )
                      })} 
                  </div>
                )}
            </div></div>
        </div>
    )
}
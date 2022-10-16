import { useEffect, useState } from "react";

interface Props {
    options: string[], 
    defaultValue?: string, 
    width: number,
    select: Function,
}

export const SelectField = (props: Props) => {

    const [viewOptions, setViewOptions] = useState(false);
    const [selectedOption, setSelectedOption] = useState(props.defaultValue);
    const [options, setOptions] = useState([...props.options]);

    useEffect(() => {
        setOptions(props.options)
    },[props.options])

    const handleClick = (option: string) => {
        setSelectedOption(option);
        props.select(option);
        setViewOptions(false);
    }

    // fiks scrolling i felt

    return(
        <div tabIndex={0} onBlur={() => setViewOptions(false)} style={{width: "fit-content"}}>
            <div className={viewOptions ? "selectField selectFieldOpen" :"selectField"} 
                style={{width: props.width + "px"}}
                onClick={() => setViewOptions(!viewOptions)}> 
                {selectedOption} 
            </div>

            <div style={{position: "relative", top: 0}}><div style={{position: "absolute", height:"0"}}>
                {viewOptions && (
                    <div className='selectOptions' style={{width: (props.width + 16) + "px"}}>
                      {options.map((option) => {
                        return(
                          <div key={option} 
                          className={`option ${(selectedOption === option) ? "checkedOption" : ""}`}
                          onClick={() => handleClick(option)}> {option} </div>
                        )
                      })} 
                  </div>
                )}
            </div></div>
        </div>
    )
}
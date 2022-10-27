import { useEffect, useState } from "react";

interface Props {
    options: string[], 
    placeholder?: string, 
    canWrite: boolean, 
    width: number,
    select: Function,
}

export const MultiselectField = (props: Props) => {

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [options, setOptions] = useState([...props.options]);
    const [newOption, setNewOption] = useState("");
    const [inputFocus, setInputFocus] = useState(false);
    const [optionsFocus, setOptionsFocus] = useState(false);

    useEffect(() => {
        if(options.length === 0) {
            setOptions(props.options)
        }
    },[props.options])

    const filterOptions = (option: string) => {
        setNewOption(option);
        let newOptions: string[] = [];
        if(option !== "" && !props.options.includes(option[0]) && !props.options.includes(option)) {
            newOptions.push(option);
            props.options.forEach((opt) => {
                if(opt.startsWith(option) && props.options.includes(opt)){
                    newOptions.push(opt);
                }
            })
        }
        else if(option !== "" && props.options.includes(options[0]) && !props.options.includes(option)) {
            options.unshift(option);
        }
        else if(option === "") {
            newOptions = props.options;
        }
        else {
            options.forEach((opt) => {
                if(props.options.includes(opt) || opt === option){
                    newOptions.push(opt);
                }
            })
        }
        selectedOptions.forEach((opt) => {
            if(!newOptions.includes(opt)){
                newOptions.push(opt)
            }
        })
        setOptions([...newOptions]);
    }

    const handleClick = (option: string) => {
        if(selectedOptions.includes(option)) {
            const index = selectedOptions.indexOf(option);
            selectedOptions.splice(index, 1);
            setSelectedOptions([...selectedOptions]);
            props.select([...selectedOptions]);
        } 
        else {
            selectedOptions.push(option);
            setSelectedOptions([...selectedOptions]);
            props.select([...selectedOptions]);
            if(options.includes(option)) {
                const index = options.indexOf(option);
                options.splice(index, 1);
            }
            options.unshift(option);
            setNewOption("");
        }
        setOptions([...options]);
    }
    
    return(
        <>
            <div className={`selectField multiselectField ${(inputFocus || optionsFocus) ? "selectFieldOpen": ""}`}
                style={{width: props.width + "px"}}> 
                    {props.canWrite && (
                        <input className="inputField" type="text"
                        onChange={(e) => filterOptions(e.target.value.toLowerCase().trim())}
                        value={newOption} onFocus={() => setInputFocus(true)} onBlur={() => setTimeout(() => setInputFocus(false), 100)}
                        placeholder={props.placeholder} style={{width: (props.width - 30) + "px"}}/>
                    )}
            </div>

            <div style={{position: "relative", top: 0}} tabIndex={0} onBlur={() => setOptionsFocus(false)} onFocusCapture={() => setOptionsFocus(true)}>
                <div style={{position: "absolute", height:"0"}}> 
                    {(inputFocus || optionsFocus) && ( 
                        <div className='selectOptions' style={{width: (props.width + 16) + "px"}}>
                        {options.map((option) => {
                            return (
                                <div key={option} onClick={() => handleClick(option)}
                                className={selectedOptions.includes(option) ? "option checkedOption" : "option"}> 
                                    {option} 
                                </div>
                            )
                        })} 
                        </div>  
                    )} 
                </div>
            </div>
        </>
    )
}
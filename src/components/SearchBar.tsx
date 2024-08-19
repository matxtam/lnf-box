import { useState } from "react"

export default function SrchBar ({callSearch}:{callSearch: (input: string) => void}) {
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    return (<div>
        <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search..."
        ></input>
        <button onClick={() => callSearch(inputValue)}>Go</button>
    </div>)
}
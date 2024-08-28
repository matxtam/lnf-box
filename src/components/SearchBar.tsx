import { useState } from "react"
import { Calendar } from "@/components/ui/calendar.tsx"

export default function SrchBar({
    setSrchName, setSrchLoc, setSrchDate1, setSrchDate2, stage
}: {
    setSrchName: (name: string) => void,
    setSrchLoc: (loc: string) => void,
    setSrchDate1: (date: Date | undefined) => void,
    setSrchDate2: (date: Date | undefined) => void,
    stage: string
}) {

    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }


    const itemNameList: string[] = ["錢包", "手機", "雨傘", "證件"]
    const itemLocList: string[] = ["故宮博物院", "士林夜市", "淡水老街", "龍山寺", "象山步道", "北投溫泉",
        "淡水漁人碼頭", "貓空纜車", "台北車站", "國父紀念館", "中正紀念堂", "台北市立動物園", "華山1914文化創意產業園區",
        "松山文創園區", "寶藏巖國際藝術村", "林本源園區", "台北植物園", "台北當代藝術館", "四四南村", "天母運動公園中正紀念堂",
        "鼻頭角"]
    const [selectedName, setSelectedName] = useState(-1)
    const [selectedLoc, setSelectedLoc] = useState(-1)
    const [range, setRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({
        from: undefined, to: undefined
    });

    return (
        <main className="flex flex-row flex-wrap items-center m-8 gap-2">
            {(stage != "search3") ?
                <>
                    <div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Search..."
                        ></input>
                    </div>
                    {(stage == "search1") ?
                        itemNameList.map((itemName, index) => (itemName.includes(inputValue) ? <button
                            className={(selectedName == index) ? "bg-black" : "bg-gray-500"}
                            onClick={() => { setSelectedName(index); setSrchName(itemNameList[index]); }}
                        >{itemName}</button> : <></>))
                        : <></>}
                    {(stage == "search2") ?
                        itemLocList.map((itemLoc, index) => (itemLoc.includes(inputValue) ? <button
                            className={(selectedLoc == index) ? "bg-black" : "bg-gray-500"}
                            onClick={() => { setSelectedLoc(index); setSrchLoc(itemLocList[index]); }}
                        >{itemLoc}</button> : <></>))
                        : <></>}
                </>
                :
                <>
                    <Calendar
                        mode="range"
                        selected={range}
                        onSelect={(range) => {
                            setRange(range ?? { from: undefined, to: undefined });
                            setSrchDate1(range?.from);
                            setSrchDate2(range?.to);
                        }}
                        className="rounded-md border"
                    />
                </>}
        </main>
    )
}
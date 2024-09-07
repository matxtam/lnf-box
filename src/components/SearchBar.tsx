import { useState, useEffect } from "react"
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

    const server = "https://lnf-box-server.vercel.app/"
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }
    const [itemNameList, setItemNameList] = useState<string[]>([])
    const [itemLocList, setItemLocList] = useState<string[]>([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fetchName = async () => {
            setLoading(true);
            const res = await fetch(server + "name");
            const payload = await res.json();
            // console.log(payload);
            setItemNameList(payload);
            setLoading(false)
        }
        const fetchLoc = async () => {
            const res = await fetch(server + "loc");
            const payload = await res.json();
            // console.log(payload);
            setItemLocList(payload);
        }
        fetchName();
        fetchLoc();
    }, [])
    
    // Fake lists
    // const itemNameList: string[] = ["錢包", "手機", "雨傘", "證件"]
    // const itemLocList: string[] = ["故宮博物院", "士林夜市", "淡水老街", "龍山寺", "象山步道", "北投溫泉",
    //     "淡水漁人碼頭", "貓空纜車", "台北車站", "國父紀念館", "中正紀念堂", "台北市立動物園", "華山1914文化創意產業園區",
    //     "松山文創園區", "寶藏巖國際藝術村", "林本源園區", "台北植物園", "台北當代藝術館", "四四南村", "天母運動公園中正紀念堂",
    //     "鼻頭角"]
    const [selectedName, setSelectedName] = useState(-1)
    const [selectedLoc, setSelectedLoc] = useState(-1)
    const [range, setRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({
        from: undefined, to: undefined
    });

    return (
        <>
            {(stage != "search3") ?
                <>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Search..."
                        ></input>
                    <div className="flex flex-row flex-wrap p-8 gap-2">
                    {loading ? <p className="font-bold">loading...</p> : <></>}
                    {(stage == "search1") ?
                        itemNameList.map((itemName, index) => (itemName.includes(inputValue) ? <button
                            className={(selectedName == index) ? "border-google-blue" : ""}
                            onClick={() => { setSelectedName(index); setSrchName(itemNameList[index]); }}
                            key={index}
                        >{itemName}</button> : <></>))
                        : <></>}
                    {(stage == "search2") ?
                        itemLocList.map((itemLoc, index) => (itemLoc.includes(inputValue) ? <button
                            className={(selectedLoc == index) ? "border-google-blue" : ""}
                            onClick={() => { setSelectedLoc(index); setSrchLoc(itemLocList[index]); }}
                            key={index}
                        >{itemLoc}</button> : <></>))
                        : <></>}
                    </div>
                </>
                :
                <>
                    <Calendar
                        mode="range"
                        selected={range}
                        onSelect={(range) => {
                            setRange({from: range?.from, to: (range?.to) ? (range?.to) : (range?.from)});
                            setSrchDate1(range?.from);
                            setSrchDate2((range?.to) ? (range?.to) : (range?.from));
                        }}
                        className="rounded-md border-none m-8"
                    />
                </>}
            </>
    )
}
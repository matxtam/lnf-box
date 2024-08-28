import { useState } from 'react'
import './App.css'
import './components/Item'
import { typeItem } from './utils/Types'
import Item from './components/Item'
import SrchBar from './components/SearchBar'


function App() {

  const [stage, setStage] = useState("start")
  const [srchName, setSrchName] = useState("")
  const [srchLoc, setSrchLoc] = useState("")
  const [srchDate1, setSrchDate1] = useState<Date | undefined>(new Date())
  const [srchDate2, setSrchDate2] = useState<Date | undefined>(new Date())
  const [itemList, setItemList] = useState<typeItem[]>([]);
  const [gameStraitList, setGameStraitList] = useState<string[]>([]);

  // fake data
  const itemsFake: typeItem[] = [
    {
      name: "錢包",
      loc: "台北車站",
      time: new Date("2024-08-27T19:21:00.000+08:00"),
    },
    {
      name: "雨傘",
      loc: "陽明山",
      time: new Date("2024-08-27T19:21:00.000+08:00"),
    },
    {
      name: "證件",
      loc: "台北101",
      time: new Date("2024-08-27T19:21:00.000+08:00"),
    }
  ]

  const getGameList = () => {
    // fetch data and filter
    setItemList(itemsFake.filter(item => (
      item.name.includes(srchName) && item.loc.includes(srchLoc) &&
      item.time.getTime() < (srchDate2?.getTime() ?? 10000000) &&
      item.time.getTime() > (srchDate1?.getTime() ?? 0)
    )))
    setGameStraitList(itemList.reduce<string[]>((acc, item) => {
      acc.push(...(item.straits ?? []), ...(item.colors ?? []));
      return acc;
    }, []))
  }
  return (
    <>
      <header className="fixed top-0 left-0 text-left bg-gray-500 w-full pb-12 pl-4 pt-2" >
        <h1>Lost & Found Platform</h1>
      </header>

      <button onClick={() => {
        fetch("http://localhost:8000/")
          .then((response) => response.json())
          .then((payload) => {
            console.log(payload)
          })
      }
      }>fetch test</button>

      <h1 className='p-4'>{
        (stage == "start") ? "東西好像掉了？" :
          (stage == "search1") ? "您遺失了什麼？" :
            (stage == "search2") ? "在哪裡遺失的？" :
              (stage == "search3") ? "什麼時候遺失的？" :
                (stage == "found") ? "搜尋結果" : ""
      }</h1>

      {// search for items
      (stage == "search1" || stage == "search2" || stage == "search3") ?
        <SrchBar
          stage={stage}
          setSrchName={(name) => setSrchName(name)}
          setSrchLoc={(loc) => setSrchLoc(loc)}
          setSrchDate1={(date) => setSrchDate1(date)}
          setSrchDate2={(date) => setSrchDate2(date)}
        />
        : <></>}

      {// game playing list
      (stage == "game") ?
        <article>
          {gameStraitList.map((strait) =>
            <div>{strait}</div>
          )}
        </article> : <></>}

      {// found items list
      (stage == "found") ?
        <article className='flex flex-col gap-2'>
          {itemsFake.map(item => {
            if (item.name.includes(srchName) && item.loc.includes(srchLoc) &&
              item.time.getTime() < (srchDate2?.getTime() ?? 10000000) &&
              item.time.getTime() > (srchDate1?.getTime() ?? 0))
              return (<Item
                name={item.name}
                loc={item.loc}
                time={item.time}
              />);
            else return (<></>);
          })}
        </article>
        : <></>}

      {// last step btn
      (stage == "search2" || stage == "search3") ?
        <button onClick={() => {
          if (stage == "search2") setStage("search1");
          else if (stage == "search3") setStage("search2");
        }}>上一步</button>
        : <></>}

      {/* next step btn */}
      <button onClick={() => {
        if (stage == "start") setStage("search1");
        else if (stage == "search1") setStage("search2");
        else if (stage == "search2") setStage("search3");
        else if (stage == "search3") {
          setStage("found");
          console.log(srchName); console.log(srchDate1); console.log(srchDate2);
          getGameList();
        }
        else {
          setStage("start");
          setSrchName(""); setSrchLoc("");
          setSrchDate1(undefined); setSrchDate2(undefined);
        }
      }}
        disabled={
          (stage == "search1" && srchName == "") ? true :
            (stage == "search2" && srchLoc == "") ? true :
              (stage == "search3" && srchDate1 == undefined) ? true :
                false
        }
      >{(stage == "start") ? "立即查詢" : (stage == "found") ? "再找一次" : "下一步"}</button>

    </>
  )
}

export default App

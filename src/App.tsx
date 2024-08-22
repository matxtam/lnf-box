import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import './components/Item'
import { typeItem } from './utils/Types'
import Item from './components/Item'
import SrchBar from './components/SearchBar'
import { Link } from 'lucide-react'
// import Dialog from '../@/components/dialog.tsx'


function App() {

  const [stage, setStage] = useState("start")
  const [srchName, setSrchName] = useState("")
  const [srchLoc, setSrchLoc] = useState("")
  const [srchDate1, setSrchDate1] = useState<Date|undefined>(new Date())
  const [srchDate2, setSrchDate2] = useState<Date|undefined>(new Date())

  // fake data
  const items:typeItem[] = [
    {
      name: "錢包",
      loc: "台北車站",
      time: "19:55 5/21/2024"
    },
    {
      name: "雨傘",
      loc: "陽明山",
      time: "07:14 2/14/2024"
    },
    {
      name: "證件",
      loc: "台北101",
      time: "18:35 8/15/2024"
    }
  ]

  return (
    <>
      <header className="fixed top-0 left-0 text-left bg-gray-500 w-full pb-12 pl-4 pt-2" >
        <h1>Lost & Found Platform</h1>
      </header>

      <h1 className='p-4'>{
        (stage == "start") ? "東西好像掉了？" : 
        (stage == "search1") ? "您遺失了什麼？" :
        (stage == "search2") ? "在哪裡遺失的？" :
        (stage == "search3") ? "什麼時候遺失的？" :
        (stage == "found") ? "搜尋結果" :""
      }</h1>

      {(stage == "search1" || stage == "search2"  || stage == "search3") ? 
      <SrchBar 
        stage={stage}
        setSrchName={(name) => setSrchName(name)}
        setSrchLoc={(loc) => setSrchLoc(loc)}
        setSrchDate1={(date) => setSrchDate1(date)}
        setSrchDate2={(date) => setSrchDate2(date)}
      />
      : <></>}

      {(stage == "found") ?
      <article className='flex flex-col gap-2'>
      {items.map(item => {
        if( item.name.includes(srchName) && item.loc.includes(srchLoc) ) return (<Item
          name = {item.name}
          loc = {item.loc}
          time = {item.time}
        />);
        else return(<></>);
      })}
      </article>
      : <></> }      

      <button onClick={() =>{
        if(stage == "start") setStage("search1");
        else if(stage == "search1") setStage("search2");
        else if(stage == "search2") setStage("search3");
        else if(stage == "search3") setStage("found");
        else setStage("start")
      }}>{(stage=="start") ? "立即查詢" : (stage == "found") ? "再找一次" : "下一步"}</button>

   </>
  )
}

export default App

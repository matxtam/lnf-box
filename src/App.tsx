import { useState } from 'react'
import './App.css'
import './components/Item'
import { typeItem } from './utils/Types'
import Item from './components/Item'
import SrchBar from './components/SearchBar'

type typeGameStrait = {
  strait:string;
  selected: boolean
}

function App() {
  // const server = process.env.REACT_APP_API_URL;
  const server = "https://lnf-box-server.vercel.app/"
  // const server = "http://localhost:8000/"
  const [stage, setStage] = useState("start")
  const [srchName, setSrchName] = useState("")
  const [srchLoc, setSrchLoc] = useState("")
  const [srchDate1, setSrchDate1] = useState<Date | undefined>(new Date())
  const [srchDate2, setSrchDate2] = useState<Date | undefined>(new Date())
  const [itemList, setItemList] = useState<typeItem[]>([]);
  const [gameStraitList, setGameStraitList] = useState<typeGameStrait[]>([]);
  const [gameStraitSelected, setGameStraitSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [passcode, setPasscode] = useState({passcode: "", loc:""});

  // fake data
  // const itemsFake: typeItem[] = [
  //   {
  //     name: "錢包",
  //     loc: "台北車站",
  //     time: new Date("2024-08-27T19:21:00.000+08:00"),
  //   },
  //   {
  //     name: "雨傘",
  //     loc: "陽明山",
  //     time: new Date("2024-08-27T19:21:00.000+08:00"),
  //   },
  //   {
  //     name: "證件",
  //     loc: "台北101",
  //     time: new Date("2024-08-27T19:21:00.000+08:00"),
  //   }
  // ]

  const getGameList = () => {
    // for fetching fake data
    // setItemList(itemsFake.filter(item => (
    //   item.name.includes(srchName) && item.loc.includes(srchLoc) &&
    //   item.time.getTime() < (srchDate2?.getTime() ?? 10000000) &&
    //   item.time.getTime() > (srchDate1?.getTime() ?? 0)
    // )))

    // for fetching real data
    setLoading(true);
    fetch(server + `?name=${srchName}&loc=${srchLoc}&date1=${srchDate1}&date2=${srchDate2}`)
      .then((response) => response.json())
      .then((payload) => {
        setItemList(payload.map((item: Omit<typeItem, "time"> & { time: string }) => {
          return { ...item, time: new Date(item.time) }
          
        }));
        setGameStraitList(payload.reduce((acc:string[], item:Omit<typeItem, "time"> & { time: string }) => {
          acc.push(...(item.straits ? item.straits.map((strait) => (strait)) : []),
                   ...(item.colors ?  item.colors.map((strait) => (strait)) : []));
          return acc;
        }, []).reduce((acc:string[], item:string) => {
          if(!acc.includes(item)) acc.push(item);
          return acc;
        }, []).map((strait:string) => ({strait, selected: false})))
        setLoading(false);
        // console.log(payload);
      })
      .catch((error) => console.log(error))
  }

  const handleNextStep = () => {
    if (stage == "start") setStage("search1");
    else if (stage == "search1") setStage("search2");
    else if (stage == "search2") setStage("search3");
    else if (stage == "search3") {
      setStage("game1");
      getGameList();
      setGameStraitSelected([]);
      // console.log(srchName); console.log(srchDate1); console.log(srchDate2);
    }
    else if (stage == "game1"){
      const listLength = itemList.length;
      if(listLength == 0 )setStage("no-found");
      else if(listLength == 1)setStage("found");
      else setStage("game2")
    }
    else if (stage == "game2"){
      setItemList(itemList.reduce<typeItem[]>((acc, item) => {
        let counter= 0;
        gameStraitSelected.forEach((strait) => {
          if (item.colors?.includes(strait)) counter += 1;
          if (item.straits?.includes(strait)) counter += 1;
        })
        if (counter != 0) acc.push({...item, game_matches:counter})
        return acc;
      }, []).sort((a, b) => {
        if((a.game_matches ?? 0) > (b.game_matches ?? 0)) return -1;
        if((a.game_matches ?? 0) < (b.game_matches ?? 0)) return 1;
        else return 0;
      }))
      setStage("found");
    }
    else {
      setStage("start");
      setSrchName(""); setSrchLoc("");
      setSrchDate1(undefined); setSrchDate2(undefined);
    }
  }

  return (
    <>
        <p className='fixed top-0 text-6 w-full text-center'>Nexus: lost & Found Platform</p>

      {/* <button onClick={() => { 
        // GET method fetching test:
        // fetch(`server?name=${srchName}&loc=${srchLoc}&date1=${srchDate1}&date2=${srchDate2}`)
        //   .then((response) => response.json())
        //   .then((payload) => {
        //     console.log(payload)
        //   })
        // POST method fetching test:
        fetch("serverpost", {
          method: "POST",
          body: JSON.stringify({
            page_id:"c36ee444-e65c-4381-a053-b48c412c0de2",
            name: "name",
            ID_number: "A123456789"
          })
        }).then((res) => res.json())
        .then((payload) => console.log(payload))
      }
      }>fetch test</button>*/}

      <h1 className='p-4'>{ // Header
        (stage == "start") ? "東西好像掉了？" :
          (stage == "search1") ? "您遺失了什麼？" :
            (stage == "search2") ? "在哪裡遺失的？" :
              (stage == "search3") ? "什麼時候遺失的？" :
                (stage == "game1") ? "我們找到了一些..." :
                  (stage == "game2") ? "請點選符合您遺失物的特徵" :
                    (stage == "found") ? "這是您的嗎？" : 
                    (stage == "posting") ? "送出中..." :
                      (stage == "passcode") ? "請記住您的驗證碼" : ""
      }</h1>

      {//subtitle
        (stage == "game1") ? loading ? <p>Loading...</p>:<p>{"我們共找到了 "+itemList.length+" 件物品。"}</p> : 
        (stage == "game2") ? <p>*至多選取四項特徵。*</p>:
        (stage == "no-found") ? <p>未找到符合條件的物品 ಠ╭╮ಠ</p> :
        (stage == "passcode") ? <div>
          <p className="font-bold text-7xl tracking-widest bg-gray-500 rounded-2xl">{passcode.passcode}</p>
          <p>{"並請至 "+passcode.loc+ " 的遺失物箱子領回您的遺失物。"}</p>
        </div>
        :<></>
      }

      <main className="flex flex-col flex-wrap items-center max-w-screen-sm place-items-center m-4 gap-2">
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
        (stage == "game2") ?
          <article className='flex flex-row flex-wrap gap-2'>
            {gameStraitList.map((strait, index) =>
              <button
                key={index}
                className={gameStraitList[index].selected ? "border-google-blue" : ""}
                onClick={() => {
                  if(gameStraitSelected.length < 4 || gameStraitList[index].selected){
                    setGameStraitSelected(gameStraitList[index].selected 
                      ? gameStraitSelected.filter((strait) => (strait != gameStraitList[index].strait))
                      : [...gameStraitSelected, gameStraitList[index].strait])
                    setGameStraitList([...gameStraitList.slice(0, index), 
                    {strait: gameStraitList[index].strait,
                    selected:!gameStraitList[index].selected},
                    ...gameStraitList.slice(index+1)
                  ])}}
                }
              >{strait.strait}</button>
            )}
          </article> : <></>}
      
          {// found items list
        (stage == "found") ?
          <article className='flex flex-row flex-wrap gap-2 justify-center align-items-center'>
            {/* {itemsFake.map(item => { */}
            {itemList.map(item => {
              // filtering items at frontend
              // if (item.name.includes(srchName) && item.loc.includes(srchLoc) &&
              //   item.time.getTime() < (srchDate2?.getTime() ?? 10000000) &&
              //   item.time.getTime() > (srchDate1?.getTime() ?? 0))
                // if(true)
                return (<Item
                  name={item.name}
                  loc={item.loc}
                  time={item.time}
                  page_id={item.page_id}
                  key={item.page_id}
                  image_url={item.image_url}
                  id={item.id}
                  setStage={setStage}
                  setId={setPasscode}
                />);
              // else return (<></>);
            })}
          </article>
          : <></>}
         

      <div className='flex flex-row-reverse w-full justify-between mt-8'>
            {/* next step btn */}
      <button onClick={handleNextStep}
        disabled={
          ((stage == "search1" && srchName == "") ||
            (stage == "search2" && srchLoc == "")  ||
              (stage == "search3" && srchDate1 == undefined) ||
                (stage == "game2" && gameStraitSelected.length == 0) ||
                loading) ? true :
                  false
        }
      >{(stage == "start") ? "立即查詢" :
        (stage == "found") ? "再找一次" :
        (stage == "no-found" || stage == "passcode") ? "回到首頁" : "下一步"}</button>
      {// last step btn
        (stage == "search2" || stage == "search3") ?
          <button onClick={() => {
            if (stage == "search2") setStage("search1");
            else if (stage == "search3") setStage("search2");
          }}>上一步</button>
          : <></>}


    </div></main>
    </>
  )
}

export default App

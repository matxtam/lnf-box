import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import './components/Item'
import { typeItem } from './utils/Types'
import Item from './components/Item'
import SrchBar from './components/SearchBar'
// import Dialog from '../@/components/dialog.tsx'


function App() {

  const [srchInput, setSrchInput] = useState("")

  // fake data
  const items:typeItem[] = [
    {
      name: "wallet",
      loc: "MRT taipei station",
      time: "19:55 5/21/2024"
    },
    {
      name: "umbrella",
      loc: "C.K.S. Memorial Hall Station",
      time: "07:14 2/14/2024"
    },
    {
      name: "ID card",
      loc: "Taipei 101",
      time: "18:35 8/15/2024"
    }
  ]

  return (
    <>
      <header className='w-full '>
        <h1>Lost & Found Platform</h1>
        <button>Login</button>
      </header>

      <SrchBar callSearch={(input:string) => {
        // todo: search for name
        setSrchInput(input);
      }}/>
      
      <article className='flex flex-col gap-2'>
      {items.map(item => {
        if(item.name.includes(srchInput))return (<Item
          name = {item.name}
          loc = {item.loc}
          time = {item.time}
        />);
        else return(<></>);
      })}
      </article>
      
      
   </>
  )
}

export default App

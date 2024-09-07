import { useRef } from "react"
import { typeItem } from "../utils/Types.tsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"

export default function item({ name, loc, time, page_id, game_matches, image_url}: typeItem) {
  const server = "https://lnf-box-server.vercel.app/"
  const nameRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    fetch((server + "post"), {
      method: "POST",
      body: JSON.stringify({
        page_id,
        name: nameRef.current?.value ?? null,
        ID_number: idRef.current?.value ?? null,
      })
    }).then((res) => res.json())
    .then((payload) => console.log(payload))
  }

  return (<div className="flex bg-gray-500 text-white border-8 border-google-green hover:border-google-yellow rounded-xl p-4 m-4 gap-4 min-w-max transition-all">
    <img src={image_url} referrerPolicy="no-referrer"
      className="rounded-xl h-36"/>
    <div className="flex flex-col content-start justify-start text-start">
      <h2 className="text-2xl font-bold m-2">{name}</h2>
      <p className="truncate mx-2">{loc}</p>
      <p className="mx-2">{time.toDateString()}</p>
      <p className="mx-2">{"matched:"+game_matches}</p>
    <Dialog>
      <DialogTrigger>立即領取</DialogTrigger>
      <DialogContent>
        <DialogHeader className="">
          <DialogTitle>登記領取</DialogTitle>
          <DialogDescription>
            請填入您的身分證字號及姓名，並至指定地點領取您的遺失物
          </DialogDescription>
            <p>{"您遺失的物品為：" + name}</p>
            <p>{"請至 " + loc + " 的遺失物箱子領取"}</p>
          <input placeholder="身分證字號" ref={idRef} required></input>
          <input placeholder="姓名"      ref={nameRef} required></input>
        </DialogHeader>
        <DialogClose onClick={handleSubmit} type="submit">送出</DialogClose>
      </DialogContent>
    </Dialog>
    </div>

  </div>)
}
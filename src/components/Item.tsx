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

export default function item({ name, loc, time, page_id }: typeItem) {
  const nameRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    fetch("http://localhost:8000/post", {
      method: "POST",
      body: JSON.stringify({
        page_id,
        name: nameRef.current?.value ?? null,
        ID_number: idRef.current?.value ?? null,
      })
    }).then((res) => res.json())
    .then((payload) => console.log(payload))
  }

  return (<div className="bg-gray-500 text-white rounded p-4 m-4">
    <h2>{name}</h2>
    <p className="">{loc}</p>
    <p>{time.toDateString()}</p>
    <Dialog>
      <DialogTrigger className="bg-transparent text-white border-black border-4">立即領取</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>登記領取</DialogTitle>
          <DialogDescription>
            <p>請填入您的身分證字號及姓名，並至指定地點領取您的遺失物</p>
            <p>{"您遺失的物品為：" + name}</p>
            <p>{"請至 " + loc + " 的遺失物箱子領取"}</p>
          </DialogDescription>
          <input placeholder="身分證字號" ref={idRef} required></input>
          <input placeholder="姓名"      ref={nameRef} required></input>
        </DialogHeader>
        <DialogClose onClick={handleSubmit} type="submit">送出</DialogClose>
      </DialogContent>
    </Dialog>

  </div>)
}
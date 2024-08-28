import { typeItem } from "../utils/Types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"

export default function item({ name, loc, time }: typeItem) {
  return (<div className="bg-gray-500 text-white rounded p-4 m-4">
    <h2>{name}</h2>
    <p className="">{loc}</p>
    <p>{time.toLocaleDateString()}</p>
    <Dialog>
      <DialogTrigger className="bg-transparent text-white border-black border-4">立即領取</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>登記領取</DialogTitle>
          <DialogDescription>
            <p>請填入您的身分證字號及電話號碼，並至指定地點領取您的遺失物</p>
            <p>{"您遺失的物品為：" + name}</p>
            <p>{"請至 " + loc + " 的遺失物箱子領取"}</p>
          </DialogDescription>
          <input placeholder="身分證字號"></input>
          <input placeholder="行動電話"></input>
        </DialogHeader>
        <DialogClose>送出</DialogClose>
      </DialogContent>
    </Dialog>

  </div>)
}
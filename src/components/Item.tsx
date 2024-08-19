import { typeItem } from "../utils/Types"

export default function item({name, loc, time}:typeItem) {
    return (<div className="bg-white text-black">
        <h2>{name}</h2>
        <p className="">{loc}</p>
        <p>{time}</p>
    </div>)
}
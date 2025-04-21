import { IconType } from "react-icons";
import TopBar from "./TopBar";

type PanelProps={
    title:string,
    Icon:IconType,
}

const Panel:React.FC<PanelProps>=({title,Icon})=>{
    return(
        <div className="h-full bg-indigo-950 w-full mx-3 p-3 flex flex-col items-center rounded-3xl">
            <TopBar title={title} Icon={Icon}/>
            <hr/>
            <div className="w-full h-full bg-transparent">
                
            </div>
        </div>
    )
}
export default Panel;
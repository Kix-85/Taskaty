import { MdAccountCircle } from "react-icons/md";
import "../../../styles/globals.css"
const SideBarAccount=()=>{
    return(
        <div className="flex">
            < MdAccountCircle size={50} color="white"/><div><div className="font-bold text-white">Kareem Al Deeb</div><div className="text-gray-400">Project Manager</div></div>
        </div>
    )
}
export default SideBarAccount
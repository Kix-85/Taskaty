import SideBarAccount from "./SideBar-components/SideBarAccount";
import SideBarMain from "./SideBar-components/SideBarMain";
import SideBarProjects from "./SideBar-components/SideBarProjects";

const SideBar=()=>{
    return(
        <div className="w-2/10 rounded-3xl min-h-full p-2 py-4 bg-indigo-950">
            <SideBarAccount/>
            <SideBarMain/>
            <SideBarProjects/>
        </div>
    )
}
export default SideBar;
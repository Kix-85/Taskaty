// import ListView from '@/components/ListView/List';
// import DropdownOptions from '@/components/Dropdown/DropdownOptions';
// import styles from './home.module.css';
// import ProjectCard  from '../projectCard/projectCard';
// import { FaLock } from "react-icons/fa";
// import ContributerCard from '../contributerCard/ContributerCard';
// function HomePage() {
//     return (
//         <>
//             <div className='bg-[#0e0d16] grid grid-cols-1 gap-2 lg:grid-cols-2 w-[100%] min-h-[100vh]'>
//                 <div className='tasksContainer rounded-xl bg-[#101228] w-[100%] max-h-[100%] overflow-y-hidden'>
//                     {/* <ListView/> */}
//                     <div className={styles.titleContainer}>
//                         <div className={`flex justify-between items-center p-4`}>
//                             <h3 className='text-[20px] text-white'>My Tasks <span className='text-[#95accb]'>5</span></h3>
//                             <DropdownOptions/>
//                         </div>
//                     </div>
//                     <ListView/>
//                 </div>
//                 <div className='tasksContainer rounded-xl bg-[#101228] w-[100%] h-[100%]'>
//                     {/* <ListView/> */}
//                     <div className={styles.titleContainer}>
//                         <div className={`flex justify-between items-center p-4`}>
//                             <h3 className='text-[20px] text-white'>Projects <span className='text-[#95accb]'>4</span></h3>
//                             <span className='text-[#fff] bg-[#141c4a] px-[16px] py-[10px] cursor-pointer rounded-[10px] text-[20px]'>+</span>
//                         </div>
//                     </div>
//                     <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
//                         <ProjectCard project={"Paybal"}/>
//                         <ProjectCard project={"Paybal"}/>
//                         <ProjectCard project={"Paybal"}/>
//                         <ProjectCard project={"Paybal"}/>
//                     </div>
//                 </div>
//                 <div className='tasksContainer rounded-xl bg-[#101228] w-[100%] min-h-[100%]'>
//                     {/* <ListView/> */}
//                     <div className={styles.titleContainer}>
//                         <div className={`flex justify-between items-center p-4`}>
//                             <h3 className='text-[20px] text-white'>Users <span className='text-[#95accb]'>8</span></h3>
//                             <span className='text-[#fff] bg-[#141c4a] px-[16px] py-[10px] cursor-pointer rounded-[10px] text-[20px]'>+</span>
//                         </div>
//                     </div>
//                     <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
//                         <ContributerCard conName='Esther Howard' conEmail='esther.howard@gmail.com'/>
//                         <ContributerCard conName='Esther Howard' conEmail='esther.howard@gmail.com'/>
//                         <ContributerCard conName='Esther Howard' conEmail='esther.howard@gmail.com'/>
//                         <ContributerCard conName='Esther Howard' conEmail='esther.howard@gmail.com'/>                        
//                     </div>
                    
//                 </div>
//                 <div className='tasksContainer rounded-xl bg-[#101228] w-[100%] min-h-[100%]'>
//                     {/* <ListView/> */}
//                     <div className={styles.titleContainer}>
//                         <div className={`flex justify-between items-center p-4`}>
//                             <h3 className='text-[20px] text-white'>Private Notepad</h3>
//                             <FaLock size={20} color='slategrey'/>
//                         </div>
//                     </div>
//                     <div className="textArea h-[68%]">
//                         <textarea className="w-full h-[100%] outline bg-[#121638] p-[18px] pr-[28px]outline-[#85a5ff] border-0 text-gray-50 rounded-[12px]" placeholder="Write your notes here...">
//                         </textarea>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }


// export default HomePage;


"use client";
import ListView from '@/components/ListView/List';
// import ListView from './listHome';
import DropdownOptions from '@/components/Dropdown/DropdownOptions';
import styles from './home.module.css';
import ProjectCard from '../projectCard/projectCard';
import { FaLock } from "react-icons/fa";
import ContributerCard from '../contributerCard/ContributerCard';

function HomePage() {
  return (
    <>
      <div className={`${styles.myCon} bg-[#0e0d16] grid grid-cols-1 gap-2 lg:grid-cols-2 w-full lg:h-[80vh] overflow-hidden`}>
        {/* My Tasks Section */}
        <div className={`${styles.tasksContainer} lg:h-[40vh] rounded-xl bg-[#101228] overflow-y-auto`}>
          <div className={styles.titleContainer}>
            <div className="flex justify-between items-center p-4">
              <h3 className="text-[20px] text-white">My Tasks <span className="text-[#95accb]">5</span></h3>
              <DropdownOptions />
            </div>
          </div>
          <ListView />
        </div>

        {/* Projects Section */}
        <div className={`${styles.tasksContainer} lg:h-[40vh] rounded-xl bg-[#101228] overflow-y-auto`}>
          <div className={styles.titleContainer}>
            <div className="flex justify-between items-center p-4">
              <h3 className="text-[20px] text-white">Projects <span className="text-[#95accb]">4</span></h3>
              <span className="text-[#fff] bg-[#141c4a] px-[16px] py-[10px] cursor-pointer rounded-[10px] text-[20px]">+</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            <ProjectCard project={"Paybal"} />
            <ProjectCard project={"Paybal"} />
            <ProjectCard project={"Paybal"} />
            <ProjectCard project={"Paybal"} />
          </div>
        </div>

        {/* Users Section */}
        <div className={`${styles.tasksContainer}  lg:h-[40vh] rounded-xl bg-[#101228] overflow-y-auto`}>
          <div className={styles.titleContainer}>
            <div className="flex justify-between items-center p-4">
              <h3 className="text-[20px] text-white">Users <span className="text-[#95accb]">8</span></h3>
              <span className="text-[#fff] bg-[#141c4a] px-[16px] py-[10px] cursor-pointer rounded-[10px] text-[20px]">+</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            <ContributerCard conName="Esther Howard" conEmail="esther.howard@gmail.com" />
            <ContributerCard conName="Esther Howard" conEmail="esther.howard@gmail.com" />
            <ContributerCard conName="Esther Howard" conEmail="esther.howard@gmail.com" />
            <ContributerCard conName="Esther Howard" conEmail="esther.howard@gmail.com" />
          </div>
        </div>

        {/* Private Notepad Section */}
        <div className={`${styles.tasksContainer} lg:h-[40vh] rounded-xl bg-[#101228] overflow-y-auto`}>
          <div className={styles.titleContainer}>
            <div className="flex justify-between items-center p-4">
              <h3 className="text-[20px] text-white">Private Notepad</h3>
              <FaLock size={20} color="slategrey" />
            </div>
          </div>
          <div className="textArea h-[68%]">
            <textarea
              className="w-full h-[100%] sm:min-h-[300px] outline-none bg-[#121638] p-[18px] pr-[28px] border-0 text-gray-50 rounded-[12px]"
              placeholder="Write your notes here..."
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
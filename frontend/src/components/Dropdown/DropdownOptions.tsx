// "use client"
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import { useState } from 'react';
// import "../../app/globals.css"


// function DropdownOptions() {
//     const [age, setAge] = useState<string>('');

//     const handleChange = (event: SelectChangeEvent) => {
//         setAge(event.target.value);
//     };

    
//     return (
//         <div>
//             <FormControl sx={{ m: 1, minWidth: 80 }}>
//                 <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel>
//                 <Select
//                 labelId="demo-simple-select-autowidth-label"
//                 id="demo-simple-select-autowidth"
//                 value={age}
//                 onChange={handleChange}
//                 autoWidth
//                 label="Age"
//                 >
//                 <MenuItem value="">
//                     <em>None</em>
//                 </MenuItem>
//                 <MenuItem value={20}>Twenty</MenuItem>
//                 <MenuItem value={21}>Twenty one</MenuItem>
//                 <MenuItem value={22}>Twenty one and a half</MenuItem>
//                 </Select>
//             </FormControl>
//         </div>
//     );
// }

// export default DropdownOptions;

"use client";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import "../../app/globals.css";

function DropdownOptions() {
  const [age, setAge] = useState<string>("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <div className="flex items-center justify-center">
      <FormControl
        className="w-[150px] h-[45px] bg-[#121638] text-[#fff] px-[20px] py-[10px] rounded-[10px]"
        sx={{
          "& .MuiInputLabel-root": {
            color: "#fff", // Label text color
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none", // Remove default border
          },
          "& .MuiSelect-select": {
            padding: "4px 8px", // Adjust padding for height consistency
            color: "#fff", // Text color inside the dropdown
          },
          "& .MuiSvgIcon-root": {
            color: "#fff", // Arrow icon color
          },
        }}
      >
        <Select
          value={age}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          className="w-full h-full bg-transparent"
        >
          <MenuItem value="" disabled>
            <em className="text-[#95accb]">None</em>
          </MenuItem>
          <MenuItem value={20} className="text-[#fff]">
            Twenty
          </MenuItem>
          <MenuItem value={21} className="text-[#fff]">
            Twenty One
          </MenuItem>
          <MenuItem value={22} className="text-[#fff]">
            Twenty One Half
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default DropdownOptions;
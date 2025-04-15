import { Button as ButtonMUI, ButtonPropsColorOverrides } from "@mui/material";

type Size="large"|"medium"|"small";
interface ButtonProps{
    startIcon?:string;
    endIcon?:string;
    text?:string;
    size:Size;
    color?:ButtonPropsColorOverrides;
    loading?:boolean;
}

const Button= ({startIcon,endIcon,color="primary",text,size,loading}:ButtonProps)=>{
    if(loading===true)
    {
        return(
            <ButtonMUI loading variant="contained" color={color?color:"primary"} size={size} startIcon={startIcon?startIcon:null} endIcon={endIcon?endIcon:null}>{text}</ButtonMUI>
        )
    }
    else{
        
        return(
            <ButtonMUI fullWidth variant="contained" color={color?color:"primary"} size={size} startIcon={startIcon?startIcon:null} endIcon={endIcon?endIcon:null}>{text}</ButtonMUI>
        )
    }
}

export default Button;
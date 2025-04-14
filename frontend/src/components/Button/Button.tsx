interface ButtonProps{
    icon?:string;
    text:string;
}

const Button= ({icon, text}:ButtonProps)=>{
    return(
        <>
        <button>{icon? icon: null}{text}</button>
        </>
    )
}

export default Button;
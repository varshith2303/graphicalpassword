export default function PasswordIcon(props) {

    const selectedClasses = "blur-md"
    //const selectedClasses = "bg-purple-500 shadow-xl"

    return (
        <img
            alt=""
            src={props.src}
            onClick={() => props.onClick(props.id, props.iteration)}
            className={`w-[85%] h-[100px] transition duration-300 ease-in-out 
                        hover:shadow-2xl hover:scale-105 
                        rounded-lg p-1 cursor-pointer 
                        ${props.selected ? selectedClasses : ""}`}
        />
    )
}

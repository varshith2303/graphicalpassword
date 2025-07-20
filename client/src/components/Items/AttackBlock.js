export default function AttackBlock(props) {
    return (
        <div className="transition duration-500 ease-in-out bg-cover bg-[#A27B5C] hover:scale-95 w-4/5 rounded-[25px] bg-[#A27B5C] p-6 sm:p-12 mb-12">
            <div className="h-full w-full">
                <div >
                    <img className="w-1/6" alt="" src={`${props.icon}`}/>
                    <p className="text-white text-2xl sm:text-3xl pt-4 font-bold">{props.title}</p><br/>
                </div>
                <div className="text-white sm:text-xl">
                    <p>{props.desc}</p>
                </div>
            </div>
        </div>
    )
}
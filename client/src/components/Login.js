import {useState} from "react"; 
import { checkUsername} from "../util/validation";
import {successToast, Toast} from "../util/toast";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import PasswordIcon from "./Items/PasswordIcon";
import axios from "axios";
import {Page} from "../util/config";
import {api} from "../static/config";
import {getNameByNumber} from "../util/util";
import {nanoid} from "nanoid";
import BlockedBox from "./Items/BlockedBox";

export default function Login(props) {

    const [next, setNext] = useState(false)
    const [blocked, setBlocked] = useState(false)
    const [iteration, setIteration] = useState(0)
    const [imageData, setImageData] = useState([])
    const [loginInfo, setLoginInfo] = useState({
        username: "",
        password: "",
        pattern: ["", "", "", ""]
    })

    // Fisher-Yates Shuffle Algorithm for shuffling 16 images within each set
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));  // Random index
            [array[i], array[j]] = [array[j], array[i]];    // Swap elements
        }
    }

    function handleChange(event) {
        setLoginInfo(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }

    function validateData() {
        if (loginInfo.username.length < 1) {
            Toast("Invalid Username!")
            return false
        }
        else if (loginInfo.password.length < 8) {
            Toast("Password Length Must Be Greater Than 8")
            return false
        }
        return true
    }

    async function validateUsernameAndEmail() {
        const isUsernameExists = await checkUsername(loginInfo.username, props.setLoading)
        if (!isUsernameExists) Toast("Username does not exist!")
        return isUsernameExists
    }

    async function handleNextClick(event) {
        if (validateData() && await validateUsernameAndEmail()) {
            axios.get(`${api.url}/api/image?username=${loginInfo.username}`)
                .then(res => {
                    let shuffledImageSets = res.data.map(set => {
                        shuffleArray(set);  // Shuffle images within each set of 16
                        return set;
                    });
                    setImageData(shuffledImageSets);  // Set shuffled image sets
                    setNext(true);
                })
                .catch(err => Toast("Internal server error"));
        }
    }

    function getIcons() {
        return imageData[iteration].map(prev => <PasswordIcon iteration={iteration} id={prev.id} key={nanoid()} src={prev.url} selected={prev.id === loginInfo.pattern[iteration]} onClick={handleImageClick}/>)
    }

    function handleImageClick(id, iteration) {
    setLoginInfo(prev => {
        const newPattern = [...prev.pattern];
        newPattern[iteration] = id;
        return {
            ...prev,
            pattern: newPattern
        }
    });
}


    function login() {
    if (loginInfo.pattern[iteration] === "") {
        Toast("Select an image first!");
        return;
    }

    if (iteration < 3) {
        setIteration(iteration + 1);
        return;
    }

    if (loginInfo.pattern.length < 4 || loginInfo.pattern.includes("")) {
        Toast("Choose all 4 images!");
        return;
    }

    props.setLoading(true);

    axios.post(`${api.url}/api/user/login`, {
        username: loginInfo.username,
        password: loginInfo.password,
        pattern: loginInfo.pattern  // send pattern as ARRAY, not string
    })
    .then(res => {
        props.setLoading(false);
        props.setUserInfo({email: res.data.email, username: res.data.username});
        props.setLoggedIn(true);
        successToast("Logged In!");
        props.setPage(Page.HOME_PAGE);
    })
    .catch(err => {
        props.setLoading(false);
        setIteration(0);
        setLoginInfo(prev => ({
            ...prev,
            pattern: ["", "", "", ""]
        }));
        setNext(false);
        if (err.response?.data?.status === 'blocked') {
            setBlocked(true);
        } else {
            Toast(err.response?.data?.message || "Login failed");
        }
    });
}



    function getButtonTitle() {
        if (iteration < 3) return "Next"
        else return "Login"
    }

    function handleBackClick() {
        if (iteration === 0) setNext(false)
        else setIteration(iteration - 1)
    }

    return (
        <div className=" sm:h-[38rem] sm:mt-12">

            {blocked && <BlockedBox onClick={setBlocked}/>}

            {!next && <div className="flex justify-center h-full">
                {/*IMAGE*/}
                <div className="hidden sm:block">
                    <img className="transition duration-500 ease-in-out hover:scale-95 h-full" alt=""/>
                </div>
                {/*LOGIN FORM*/}
                <div className="font-['Work_Sans'] mt-16">
                    <p className="text-white text-3xl sm:text-5xl sm:font-bold px-4 sm:px-0">Login</p><br/>
                    <p className="text-white text-lg sm:text-2xl px-4 sm:px-0">Welcome Back! Enter Your Details Below</p>
                    <p className="text-white text-2xl"></p><br/>
                    <div className="flex flex-col w-[80%] sm:w-2/3 px-4 sm:px-0">
                        <input value={loginInfo.username} onChange={handleChange} name="username" className="rounded-lg h-8 sm:h-12 px-6 font-3xl" type="text" placeholder="Username"/>
                        <input value={loginInfo.password} onChange={handleChange} name="password" className="rounded-lg h-8 sm:h-12 px-6 font-3xl mt-4" type="password" placeholder="Password"/>
                    </div>
                    <button onClick={handleNextClick} className="ml-4 sm:ml-0 transition duration-500 ease-in-out h-8 sm:h-12 bg-[#A27B5C] rounded-lg px-6 sm:w-2/3 mt-6 text-white border-2 hover:bg-transparent border-[#A27B5C] font-bold">Next</button>
                </div>
            </div>}

            {next && <div className="sm:flex justify-center h-full">
                <div className="hidden sm:grid grid-cols-4 bg-[#3F4E4F] h-full rounded-lg w-[75%] justify-items-center py-4 px-2 gap-2 ml-12">
                    {getIcons()}
                </div>

                {/*DESKTOP VIEW*/}
                <div className="sm:block hidden font-['Work_Sans'] mt-4 ml-16">
                    <p className="text-white text-5xl  font-bold">Set Graphical Password</p><br/>
                    <p className="text-white text-2xl">Select Images For Your Graphical Password.</p>
                    <p className="text-white text-2xl">Select <span className="text-green-400">{getNameByNumber(iteration+1)}</span> Image.</p><br/>
                    <button onClick={login} className="transition duration-500 ease-in-out h-12 bg-[#A27B5C] rounded-lg px-6 w-2/3 mt-6 text-white border-2 hover:bg-transparent border-[#A27B5C] font-bold">{getButtonTitle()}</button>
                    <button onClick={handleBackClick} className="transition duration-500 ease-in-out border-2 border-[#A27B5C] rounded-lg px-4 h-12 ml-4 hover:bg-[#A27B5C]">
                        <FontAwesomeIcon className="text-white" icon={faArrowLeft} />
                    </button>
                </div>

                {/*MOBILE VIEW*/}
                <div className="sm:hidden font-['Work_Sans'] mt-4 ml-4">
                    <p className="text-white text-2xl font-bold">Set Graphical Password</p><br/>
                    <p className="text-white text-lg">Select Images For Your Graphical Password.</p>
                    <p className="text-white text-lg">Select <span className="text-green-400">{getNameByNumber(iteration+1)}</span> Image.</p><br/>

                    <div className="-ml-4 grid grid-cols-2 bg-[#3F4E4F] gap-x-0 h-full rounded-md justify-items-center py-4 gap-1">
                        {getIcons()}
                    </div>

                    <button onClick={login} className="transition duration-500 ease-in-out h-8 sm:h-12 bg-[#A27B5C] rounded-lg px-6 w-2/3 mt-6 text-white border-2 hover:bg-transparent border-[#A27B5C]">{getButtonTitle()}</button>
                    <button onClick={handleBackClick} className="transition duration-500 ease-in-out border-2 border-[#A27B5C] rounded-lg px-4 h-8 sm:h-12 ml-4 hover:bg-[#A27B5C]">
                        <FontAwesomeIcon className="text-white" icon={faArrowLeft} />
                    </button>
                </div>
            </div>}
        </div>
    )
}
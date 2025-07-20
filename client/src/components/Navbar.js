import {Page} from "../util/config";

export default function Navbar(props) {

    const additionalClasses = "text-[#DCD7C9]"

    function setPage(property) {
        props.setPage(property)
    }

    function logout() {
        props.setUserInfo({username: "", email: ""})
        props.setLoggedIn(false)
        setPage(Page.HOME_PAGE)
    }

    return (
        <div className="md:p-6 py-2 px-4 flex justify-between bg-[#3F4E4F]">

            {/*logo and text*/}
            <div className="flex items-center cursor-pointer" onClick={() => window.location.reload()}>
                <img className="" width="24px" src="https://www.downloadclipart.net/large/security-safe-transparent-background.png" alt=""/>
                <p className="md:text-xl text-white ml-2 font-['Space_Mono']">Graphical Password Authenticator</p>
            </div>

            {/*nav element list*/}
            <div className="font-['Work_Sans'] text-white hidden md:flex items-center">
                <p className={`hover:text-gray-300 text-xl cursor-pointer ${props.currentPage === Page.HOME_PAGE ? additionalClasses : ""}`} onClick={() => setPage(Page.HOME_PAGE)}>Home</p>
                {/*<p className={`text-xl ml-12 ${props.currentPage === Page.ABOUT ? additionalClasses : ""}`}>About Us</p>*/}

                {!props.loggedIn && <div>
                    <button onClick={() => setPage(Page.LOGIN_PAGE)} className="transition duration-500 ease-in-out bg-[#A27B5C] rounded-lg px-4 py-1 ml-12 border-[#A27B5C] border-2 hover:bg-transparent">Login</button>
                    <button onClick={() => setPage(Page.SIGNUP_PAGE)} className="transition duration-500 ease-in-out bg-[#A27B5C] rounded-lg px-4 py-1 ml-6 border-[#A27B5C] border-2 hover:bg-transparent">Sign Up</button>
                </div>}

                {props.loggedIn && <div className="flex">
                    <p className={`text-2xl font-mono text-[#e4e1d9] ml-3`}>{props.userInfo.username}</p>
                    <button onClick={() => logout()} className="transition duration-500 ease-in-out bg-[#A27B5C] rounded-lg px-4 py-1 ml-4 border-[#A27B5C] border-2 hover:bg-transparent">Logout</button>
                </div>}
            </div>

            <div className="md:hidden">
                <img onClick={() => props.setSlider(true)} className="ml-2" width="32px" src="https://img.icons8.com/fluency-systems-regular/48/A259FF/menu--v1.png" alt=""/>
            </div>

        </div>
    )
}
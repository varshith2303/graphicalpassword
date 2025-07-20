import {Page} from "../util/config";
import {useState} from "react";
import validator from "validator/es";
import {successToast, Toast} from "../util/toast";
import axios from "axios";
import {api} from "../static/config";

export default function Footer(props) {

    const[email, setEMail] = useState("")

    function handleChange(event) {
        setEMail(event.target.value)
    }

    function handleSubmit() {
        if (validator.isEmail(email)) {
            axios.post(`${api.url}/api/digest`, {email: email})
                .then(() => {
                    successToast("Thank You For Subscribing!")
                    clearData()
                })
                .catch(err => {
                    Toast(err.response.data.message)
                    clearData()
                })
        }
        else Toast("Invalid Email")
    }

    function clearData() {
        setEMail("")
    }

    return (
        <div className="bg-[#3F4E4F]">
            <div className="bg-[#3F4E4F] mt-24 flex justify-around flex-col sm:flex-row">

                <div className="ml-4 sm:ml-12 mt-6">
                    <div className="flex">
                        <img className="" width="24px" src="https://www.downloadclipart.net/large/security-safe-transparent-background.png" alt=""/>
                        <p className="sm:text-xl text-white ml-2 font-['Space_Mono']">Graphical Password Authenticator</p>
                    </div>
                    <p className="text-gray-300 font-['Work_Sans'] mt-2 sm:mt-4">A Novel Approach For Security</p>
                </div>



            </div>
            <hr className="rounded-full border-gray-300 border-1 bg-gray-200 h-px mt-8 mx-auto w-3/4"/>
            <p className="mt-2 text-[#9b9b9b] sm:text-md text-sm text-center pb-4">summer internship project</p>
        </div>

    )
}

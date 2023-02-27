import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { generateOTP, getMSISDN } from "../../redux/functions/auth"
import Button from "../../components/buttons/Button"
import Header from "../../components/Header"
import authStyle from "../../styles/auth.style"
import { useNavigate } from "react-router"

const Signup = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { authLoading } = useSelector(state => state.ui)
    const [phoneNumber, setPhoneNumber] = useState("")
    const [password, setPassword] = useState("")
    const [showAuthButton, setShowAuthButton] = useState(false)

    useEffect(() => {
        const initGetMSISDN = () => {
            let x = getMSISDN()
            if (x) {
                setPhoneNumber(x.toString())
                setShowAuthButton(true)
            }
        }
        initGetMSISDN()
    }, [])

    const handleInput = (e) => {
        setPhoneNumber(e.target.value)
        if (e.target.value.length === 9 && e.target.value.split("")[0] === "9") setShowAuthButton(true)
        else setShowAuthButton(false)
    }

    return (
        <>
            <Header />
            <wc-toast></wc-toast>
            <main className={authStyle.main}>
                <div className={authStyle.authContainer}>
                    <h3 className={authStyle.h3}>Phone number</h3>
                    <div className="mt-5 flex flex-col">
                        <div className="flex flex-col mb-3">
                            <input
                                value={phoneNumber}
                                onChange={handleInput}
                                placeholder="Enter phone number"
                                className={authStyle.input}
                            />
                        </div>
                        {showAuthButton ? <Button
                            isDisabled={authLoading}
                            action={() => generateOTP(navigate, phoneNumber, dispatch)}
                            label={authLoading ? "Loading..." : "Continue"}
                        /> : <></>}
                    </div>
                </div>
            </main>
        </>
    )
}

export default Signup
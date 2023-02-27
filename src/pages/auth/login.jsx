import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getMSISDN, login } from "../../redux/functions/auth"
import AltButton from "../../components/buttons/AltButton"
import Button from "../../components/buttons/Button"
import Header from "../../components/Header"

const Login = () => {
    const dispatch = useDispatch()
    const { authLoading } = useSelector(state => state.ui)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <>
            <Header />
            <wc-toast></wc-toast>
            <main className={styles.main}>
                <div className={styles.authContainer}>
                    <h3 className={styles.h3}>Sign in</h3>
                    <div className="mt-5 flex flex-col">
                        <div className="flex flex-col">
                            <label className="-mb-2">Email</label>
                            <input onChange={e => setEmail(e.target.value)} placeholder="Enter email address" className={styles.input} />
                        </div>
                        <div className="flex mt-3 flex-col">
                            <label className="-mb-2">Password</label>
                            <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Enter password" className={styles.input} />
                        </div>
                        <div className="m-3" />
                        <small className="text-right text-brand -mt-5 mb-3">
                            <Link to="/forgot-password">
                                Forgot password?
                            </Link>
                        </small>
                        {
                            authLoading
                                ? <p>signing in...</p>
                                : <Button action={() => login(email, password, dispatch)} label="Sign in" />
                        }
                        <p className="max-w-[210px] text-center leading-[9px] text-[12px] m-auto mt-5">
                            By siginging in, you agree to Kairos Play
                            <span>
                                <Link to="/">
                                    <span className="text-brand"> Terms of use.</span>
                                </Link>
                            </span>
                        </p>
                    </div>
                </div>
            </main>
        </>
    )
}

const styles = {
    main: `auth-bg w-screen h-screen -mt-[60px] bg-[red] flex items-center justify-center`,
    authContainer: `bg-secondary p-5 rounded-md mx-4`,
    h3: `font-medium text-2xl`,
    input: `outline-none w-full my-2 px-3 py-2 text-sm rounded-md max-w-[300px] text-[#222]`,
}

export default Login
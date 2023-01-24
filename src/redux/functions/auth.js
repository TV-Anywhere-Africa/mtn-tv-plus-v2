import axios from "axios"
import { v4 as uuidv4 } from "uuid"
import { UAParser } from "ua-parser-js"
import { toast } from "wc-toast"
import { setAuthLoading } from "../slices/ui.slice"
import { COOKIES } from "../../constants/global.const"
import { AUTH_BASE_URL, BASE_URL, OPERATOR_UID } from "../../config/apis.config"
import routes from "../../constants/routes.const"
import { sendLog } from "../../utils/sendLog.util"

const parser = new UAParser()
const userInfoCookie = COOKIES.get("user_info")
const { access_token, operator_uid } = userInfoCookie || {}

export const checkDeviceIP = async () => {
    try {
        const res = await axios.get(`https://tvanywhereonline.com/cm/api/auth/?operator_uid=${OPERATOR_UID}`, {
            headers: {
                'Password': 'tva12345#',
                'Username': 'tva'
            }
        })

        if (!res.data.valid) window.location.replace(routes.outOfRegion)

        return res.data.valid

    } catch (e) {
        // window.location.replace(routes.login)
    }
}

export const getMSISDN = () => {
    try {

        const msisdn = COOKIES.get("msisdn")

        // COOKIES.set("msisdn", "123456789", { path: "/" })
        // COOKIES.remove("msisdn", { path: "/" })

        return msisdn

    } catch (e) {
        // console.log(e.message)
    }
}

export const generateOTP = async (navigate, phoneNumber, dispatch) => {
    try {

        const msisdn = getMSISDN()
        let phoneNumber_ = phoneNumber ? phoneNumber.trim() : ""
        let formattedPhoneNumber = phoneNumber_.replace(/[^\d]/g, '')

        if (!phoneNumber || formattedPhoneNumber.split("")[0] === "0" || !formattedPhoneNumber || formattedPhoneNumber.length < 9 || formattedPhoneNumber.length > 9) {
            toast.error("Please enter a valid phone number")
            return
        }

        if (formattedPhoneNumber === msisdn) {

            // console.log("MSISDN valid", formattedPhoneNumber, msisdn)

            localStorage.setItem("_tva_mobile_number", formattedPhoneNumber)
            localStorage.setItem("_tva_username", "mtnss" + formattedPhoneNumber)
            localStorage.setItem("_tva_uniqcast_username", "mtnss" + formattedPhoneNumber + "@" + OPERATOR_UID)
            signUp(dispatch)

            return
        }

        // console.log("MSISDN invalid", formattedPhoneNumber, msisdn)

        dispatch(setAuthLoading(true))

        localStorage.setItem("_tva_mobile_number", formattedPhoneNumber)
        localStorage.setItem("_tva_username", "mtnss" + formattedPhoneNumber)
        localStorage.setItem("_tva_uniqcast_username", "mtnss" + formattedPhoneNumber + "@" + OPERATOR_UID)

        await axios.post(
            BASE_URL + `/api/otp/?operator_uid=${OPERATOR_UID}&mode=generate`, {
            mobile_number: formattedPhoneNumber
        })

        // console.log("otpRes", otpRes.data)
        dispatch(setAuthLoading(false))
        navigate(routes.verifyOTP)

    } catch (e) {
        dispatch(setAuthLoading(false))
        toast.error(e.message)
        // console.error('generate otp: ', e.message)
    }
}

export const verifyOTP = async (otp, dispatch, navigate) => {
    try {

        if (!otp) {
            toast.error("Please enter an OTP")
            return
        }

        dispatch(setAuthLoading(true))

        const otpRes = await axios.post(
            BASE_URL + `/api/otp/?operator_uid=${OPERATOR_UID}&mode=validate`, {
            mobile_number: localStorage.getItem("_tva_mobile_number"),
            otp: otp
        })

        if (otpRes.data.status === "error") {
            dispatch(setAuthLoading(false))
            toast.error(otpRes.data.message)
            return
        }

        dispatch(setAuthLoading(false))
        signUp(dispatch, navigate)
        // window.location.href = routes.home

    } catch (e) {
        dispatch(setAuthLoading(false))
        toast.error(e.message)
        // console.error('generate otp: ', e.message)
    }
}

export const signUp = async (dispatch, navigate) => {
    try {

        dispatch(setAuthLoading(true))

        const signUpRes = await axios.post(
            BASE_URL + `/api/subscriber/?operator_uid=${OPERATOR_UID}`, {
            first_name: "MTN",
            last_name: "SSD",
            phone_number: localStorage.getItem("_tva_mobile_number"),
            username: localStorage.getItem("_tva_username"),
        })

        if (signUpRes.data.message === "subscriber already exist") {
            dispatch(setAuthLoading(false))
            await login(dispatch)
            // navigate(routes.home)

            // console.log(operator_uid)

            window.history.go(+1)
            return
        }

        if (
            signUpRes.data.status === "error" &&
            signUpRes.data.message !== "subscriber already exist"
        ) {
            dispatch(setAuthLoading(false))
            toast.error(`${signUpRes.data.message}`)
            return
        }

        if (signUpRes.data.status === "ok") {
            dispatch(setAuthLoading(false))
            await login(dispatch)
            // window.location.replace("/#/home")

            // console.log(operator_uid)
            window.history.go(+1)
        }

    } catch (e) {
        dispatch(setAuthLoading(false))
        toast.error(e.message)
        // console.error('sign up: ', e.message)
    }
}

const getGlobalKeys = async () => {
    const getGlobalKeys = await axios.get("https://tvanywhereonline.com/cm/api/client/?operator_uid=mtnssd&mode=web")
    return getGlobalKeys.data.data
}

export const login = async (dispatch) => {
    try {

        const { deviceId, deviceInfo } = setDeviceInfoCookies()

        if (dispatch) dispatch(setAuthLoading(true))

        const globalKeys = await getGlobalKeys()

        const loginRes = await axios.post(
            AUTH_BASE_URL + `/api/client/v1/global/login`, {
            username: localStorage.getItem("_tva_uniqcast_username"),
            password: globalKeys.defaultpassword,
            device: deviceId,
            device_class: deviceInfo.device.type ? deviceInfo.device.type : "Desktop",
            device_type: deviceInfo.device.vendor || "Desktop",
            device_os: "Windows",
        })

        if (loginRes.data.status === "ok") {
            COOKIES.set("user_info", loginRes.data.data, { path: "/" })
            await sendLog({ action: "login" })
            await getProfile()
            if (dispatch) dispatch(setAuthLoading(false))
        }
    } catch (e) {
        if (dispatch) dispatch(setAuthLoading(false))
        toast.error(e.message)
        // console.error('login error: ', e.message)
    }
}

export const setDeviceInfoCookies = () => {
    if (!COOKIES.get("device")) {

        // console.warn("COOKIE DOES NOT EXIST")

        const deviceInfo = parser.getResult()
        const deviceId = uuidv4()

        COOKIES.set("device", deviceId, { path: "/" })
        COOKIES.set("device_info", deviceInfo, { path: "/" })

        return {
            deviceId: deviceId,
            deviceInfo: deviceInfo
        }
    }


    // console.warn("COOKIE EXISTS")

    return {
        deviceId: COOKIES.get('device'),
        deviceInfo: COOKIES.get('device_info'),
    }
}

export const refreshToken = async (dispatch) => {
    try {

        axios.interceptors.response.use(function (response) {
            return response;
        }, async function (error) {
            if (error.response.status === 401) {

                // console.warn("REFRESHING TOKEN")

                // const refreshTokenRes = await axios.post(
                //     AUTH_BASE_URL + `/api/client/v1/global/refresh`, {
                //     refresh_token: COOKIES.get("user_info").refresh_token
                // })

                // COOKIES.set("user_info", refreshTokenRes, { path: "/" })


                await login(dispatch || undefined)
                // window.location.href = routes.home
                // window.location.reload()
            }
            return Promise.reject(error);
        });



    } catch (e) {
        // console.error("refresh token: ", e.message)
    }
}

export const logout = async (navigate) => {
    await sendLog({ action: "logout" })
    COOKIES.remove('user_info')
    COOKIES.remove('device_info')
    COOKIES.remove('device')
    localStorage.clear()
    navigate(routes.login)
}

export const getProfile = async () => {
    let username = localStorage.getItem('_tva_username')

    const profileRes = await axios.get(BASE_URL + `/api/subscriber/?operator_uid=${OPERATOR_UID}&subscriber_uid=${username}&limit=30`,
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        }
    )

    localStorage.setItem("_tva_profile", JSON.stringify(profileRes.data.data[0]))
}
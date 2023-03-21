import axios from "axios"
import { LOG_BASE_URL } from "../config/apis.config"
import { COOKIES } from "../constants/global.const"
import { setDeviceInfoCookies } from "../redux/functions/auth"

const LOG_MESSAGES = {
    login: "User logged in",
    logout: "User logged out",
    playMovie: "User played movie",
    playLive: "User played live TV channel",
    playSeries: "User played series",
    visitLandingGlobal: "User visited MTN TV web",
    visitLandingGH: 'User visited Ghana instance',
    visitLandingNG: 'User visited Nigeria instance',
    search: "User searched for content",
    quit: "User closed web client",
}

export const sendLog = async (data) => {
    const { action, content_uid, content_type, content_name, duration } = data

    // console.log(data)

    try {

        if (!COOKIES.get("device_info")) setDeviceInfoCookies()

        let logMessage
        let deviceInfoCookie = COOKIES.get("device_info")
        let device_id = COOKIES.get("device")
        let user_uid = window.localStorage.getItem("tva_username")
        let device_platform = deviceInfoCookie.os.name
        let device_name = deviceInfoCookie.browser.name
        let durationInt = 0

        if (action === 'logout') logMessage = LOG_MESSAGES.logout
        if (action === 'search') logMessage = LOG_MESSAGES.search
        if (action === 'login') logMessage = LOG_MESSAGES.login
        if (action === 'quit') logMessage = LOG_MESSAGES.quit

        if (action === 'play' && content_type === 'movie') logMessage = LOG_MESSAGES.playMovie
        if (action === 'play' && content_type === 'series') logMessage = LOG_MESSAGES.playSeries
        if (action === 'play' && content_type === 'live') logMessage = LOG_MESSAGES.playLive
        // if (action === 'play' && (content_type !== 'series' && content_type !== 'movie')) logMessage = LOG_MESSAGES.playMovie

        if (action === 'visit') logMessage = LOG_MESSAGES.visitLandingGlobal

        if (duration) {
            duration.replace(',', '')
            durationInt = Number(duration)
        }

        const requestData = {
            "subscriber_uid": user_uid || 'anonymous',
            "device_id": device_id,
            "device_type": deviceInfoCookie.device.vendor || "Desktop",
            "device_name": device_name,
            "platform": device_platform,
            "action": action,
            "content_uid": content_uid,
            "content_type": content_type,
            "content_name": content_name,
            "content_details": logMessage,
            "duration": durationInt,
            "medium": "Web"
        }

        // console.log(requestData)

        await axios.post(LOG_BASE_URL, requestData)

    } catch (e) {
        // console.log(e)
    }

}
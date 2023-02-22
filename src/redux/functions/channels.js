import axios from "axios";
import { VOD_BASE_URL, OPERATOR_UID } from "../../config/apis.config";
import { COOKIES } from "../../constants/global.const";
import { getPackages } from "./vod";

const userInfoCookie = COOKIES.get("user_info")
const { access_token, operator_uid, user_id } = userInfoCookie || {}

export const getChannels = async (dispatch) => {
    try {

        const { packageIdsString } = await getPackages()

        const response = await axios.get(
            VOD_BASE_URL + `/api/client/v2/${operator_uid}/channels?packages=${packageIdsString}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        return response.data.data

    } catch (e) {
        // console.error("get channels", e.message)
    }
}

export const getUserChannels = async () => {
    try {

        const { packageIdsString } = await getPackages()

        const response = await axios.get(
            VOD_BASE_URL + `/api/client/v2/${operator_uid}/users/${user_id}/channels?packages=${packageIdsString}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        return response.data.data

    } catch (e) {
        console.error("get user channels", e.message)
    }
}

export const getChannelCategories = async (dispatch) => {
    console.log("getting channel categories")
    try {
        const channelCategoriesRes = await axios.get(
            VOD_BASE_URL + `/api/client/v1/${OPERATOR_UID}/categories/channels`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        console.warn("channelCategoriesRes", channelCategoriesRes)

        return channelCategoriesRes.data.data
    } catch (e) {
        // console.log(e)
    }
}

export const getChannelEPGInfo = async (channels) => {

    if (!channels) return

    try {

        const response = await axios.get(VOD_BASE_URL + `/api/client/v2/${OPERATOR_UID}/shows/grid?channels=${channels}`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })

        return response.data.data
    } catch (e) {
        // console.warn(e.message)
    }
}

export const getChannelInfo = async (channelId) => {
    // console.log(channelId)
    try {

        const channelInfoRes = await axios.get(
            VOD_BASE_URL + `/api/client/v1/${operator_uid}/channels/${channelId}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        console.log("channel info", channelInfoRes.data)

        if (channelInfoRes.data.status === "error") return {}

        if (channelInfoRes.data.status === "ok") {
            if (channelInfoRes.data.data) return channelInfoRes.data.data
        }

    } catch (e) {
        // console.log(e)
    }
}
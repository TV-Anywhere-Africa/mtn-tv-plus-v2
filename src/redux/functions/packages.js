import axios from "axios"
import { toast } from "wc-toast"
import { COOKIES } from "../../constants/global.const"

const userInfoCookie = COOKIES.get("user_info")
const { operator_uid } = userInfoCookie || {}

export const networkPurchase = async (packageDetails, subscriptionType, navigate) => {
    if (!navigate || !packageDetails) return

    let packageId = subscriptionType === "auto-renewal" ? packageDetails.autorenewalId : packageDetails.id

    await axios.post(`https://tvanywhereonline.com/cm/api/purchase/?operator_uid=${operator_uid}`, {
        "subscriber_uid": localStorage.getItem("tva_subscriber_uid"),
        "subscription_type": subscriptionType || "one-off",
        "bill": true,
        "product_id": packageId
    }).then(response_ => {
        console.log("response_", response_.data)
        if (response_.data.status === "error") {
            toast.error(response_.data.message)
        } else {
            toast.success(response_.data.message)
            setTimeout(() => {
                navigate(window.location.hash.replace("#/packages?previous=", ""))
            }, 3000);
        }
    }).catch(error => {
        console.log("error", error.message)
        // toast.log(error.message)
    })
}


import routes from "../constants/routes.const"

export const authRedirect = () => {
    let redirectUrl = window.location.search.replace("?redirect=", "")
    if (window.location.search && redirectUrl)
        window.location.replace(redirectUrl)
    else window.location.replace(routes.home)
}
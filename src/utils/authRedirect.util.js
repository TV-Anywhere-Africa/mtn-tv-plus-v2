import routes from "../constants/routes.const"

export const authRedirect = (navigate) => {
    // let redirectUrl = window.location.search.replace("?redirect=", "")
    let redirectUrl = sessionStorage.getItem("redirect")


    console.log(navigate, redirectUrl)



    if (redirectUrl !== null) {

        window.location.href = redirectUrl

        // window.location.replace(redirectUrl)
        // window.location.reload()
        // navigate(redirectUrl)
        // window.location.reload()

    } else {

        window.location.href = `${routes.home}`

        // navigate(`${routes.home}`)
        // window.location.reload()
        // console.log("no sesh")
    }
}
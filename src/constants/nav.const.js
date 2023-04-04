import routes from "./routes.const"

export const NAV_LINKS = [
    {
        name: "Sign up",
        link: routes.login
    },
    {
        name: "Sign In",
        link: routes.login
    },
]

export const AUTHORIZED_NAV_LINKS = [
    {
        name: "Movies",
        link: routes.movies
    },
    {
        name: "Live TV",
        link: routes.livetv
    },
    {
        name: "Packages",
        link: routes.packages
    },
    {
        name: "My profile",
        link: routes.account
    },
]

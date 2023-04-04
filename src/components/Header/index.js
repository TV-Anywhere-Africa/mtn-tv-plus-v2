import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { COOKIES } from "../../constants/global.const"
import { AUTHORIZED_NAV_LINKS, NAV_LINKS } from "../../constants/nav.const"
import { logout } from "../../redux/functions/auth"
import profile from "../../assets/profile.png"
import search from "../../assets/icons/search.svg"
// import profile from "../../assets/icons/profile.svg"
import menu from "../../assets/icons/menu.svg"
import Drawer from "../Drawer"
import Button from "../buttons/Button"
import routes from "../../constants/routes.const"
import { useDispatch, useSelector } from "react-redux"
import { setSearchQuery } from "../../redux/slices/ui.slice"

const userInfoCookie = COOKIES.get("user_info")

const Header = () => {
    const location = useLocation()
    const dispatch = useDispatch()

    const { searchQuery } = useSelector(state => state.ui)

    const [showDrawer, setShowDrawer] = useState(true)
    const [navLinks_, setNavLinks_] = useState([])
    const [showPopup, setShowPopup] = useState(false)
    const [name, setName] = useState("...")
    const [iconLink, setIconLink] = useState(routes.landing)

    useEffect(() => {
        if (location.pathname === routes.verifyOTP || location.pathname === routes.login || location.pathname === routes.landing) setIconLink(routes.landing)
        else setIconLink(routes.home)
    }, [])

    useEffect(() => {
        try {
            let storedProfile = JSON.parse(localStorage.getItem("tva_profile"))
            setName(storedProfile.first_name)
        } catch (e) {
            // console.error(e)
        }
    }, [])

    useEffect(() => {
        setShowDrawer(false)
        if (userInfoCookie) setNavLinks_(AUTHORIZED_NAV_LINKS)
        else setNavLinks_(NAV_LINKS)
    }, [location])

    const togglePopup = () => {
        setShowPopup(!showPopup)
    }

    const initSearch = (str) => {
        // if (str === "") return
        dispatch(setSearchQuery(str))
    }

    return (
        <>
            <wc-toast></wc-toast>
            <Drawer showLogout={userInfoCookie} links={navLinks_} show={showDrawer} onClose={() => setShowDrawer(false)} />
            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                    <div className="flex items-center">
                        <Link to={iconLink}>
                            <img src="https://res.cloudinary.com/dou9sjstz/image/upload/v1673646720/logo_cjkaaa.png" alt="mtn_tv_logo" width="53px" />
                        </Link>
                        <div className="m-5" />
                        {userInfoCookie ?
                            <nav className="lg:flex items-center hidden">
                                {
                                    AUTHORIZED_NAV_LINKS.map((link, i) => {
                                        if (link.link !== routes.account) return (
                                            <Link key={i} to={link.link}>
                                                <p className={location.pathname === link.link ? styles.activeNavLink : styles.navLink}>{link.name}</p>
                                            </Link>
                                        )
                                    })
                                }
                            </nav> : <></>}
                    </div>
                    <div className="flex items-center">
                        {userInfoCookie ? <div>
                            {
                                location.pathname !== routes.search
                                    ? <Link to={routes.search} className="cursor-pointer m-3 lg:m-0 hover:opacity-70 transition-all">
                                        <img src={search} alt="search_icon" />
                                    </Link>
                                    : <input
                                        autoFocus
                                        value={searchQuery}
                                        onChange={e => initSearch(e.target.value)}
                                        placeholder="Search..."
                                        className="px-3 py-1 mr-4 outline-none text-black rounded-md w-full text-sm"
                                    />
                            }

                        </div> : <></>}
                        {userInfoCookie
                            ? <div className="hidden lg:block ml-5">
                                <div onClick={togglePopup} className={styles.iconNavLink}>
                                    <div className="w-[35px] m-2">
                                        <img src={profile} width={35} height={35} alt="profile_button" />
                                    </div>
                                    <p className="text-secondary">{name}</p>
                                </div>
                                {showPopup ? <div className={styles.popup}>
                                    <Button action={logout} label="Logout" />
                                    <div className="m-3" />
                                    <Link to={routes.account}>My profile</Link>
                                </div> : <></>}
                            </div>
                            : <></>}
                        <div className="lg:hidden ml-5" onClick={() => setShowDrawer(true)}>
                            <img src={menu} alt="menu_icon" />
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

const styles = {
    header: `relative -mt-2 z-[10000] h-[70px] text-[#fff]`,
    headerWrapper: `p-5 py-[65px] h-full flex items-center justify-between max-w-[2000px] m-auto`,
    nav: `ml-5 hidden lg:flex items-center justify-center`,
    navLink: `p-3 hover:opacity-50 transition-all`,
    activeNavLink: `text-secondary p-3 hover:opacity-50 transition-all`,
    iconNavLink: `flex items-center whitespace-nowrap p-3 hover:opacity-50 transition-all cursor-pointer`,
    activeIconNavLink: `text-secondary flex items-center whitespace-nowrap p-3 hover:opacity-50 transition-all cursor-pointer`,
    menuBtn: `block lg:hidden`,
    input: `text-[#222] border-none outline-none p-1 px-3 rounded-sm w-full lg:max-w-xl max-w-[300px] m-auto`,
    popup: `bg-[#fff] absolute top-[90px] right-5 rounded-md text-black p-3 py-2 text-sm`,
}

export default Header
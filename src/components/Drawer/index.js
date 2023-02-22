import { Link, useLocation, useNavigate } from "react-router-dom"
import { logout } from "../../redux/functions/auth"
import Button from "../buttons/Button"

const Drawer = ({ showLogout, show, links, onClose }) => {
    const location = useLocation()
    const navigate = useNavigate()

    if (!show) return (<></>)

    return (
        <>
            <div className={styles.drawerWrapper}>
                <div className={styles.drawer}>
                    <span onClick={onClose} className={styles.closeBtn}>&times;</span>
                    <div className="m-10" />
                    {
                        links.map((link, i) => {
                            return <Link key={i} to={link.link}>
                                <p className={location.pathname === link.link ? styles.activeNavLink : styles.navLink} >{link.name}</p>
                            </Link>
                        })
                    }
                    <div className="my-10" />
                    {showLogout ? <Button label="Logout" action={logout} /> : <></>}
                </div>
            </div>
        </>
    )
}

const styles = {
    drawer: `drawer bg-drawerBg p-3 h-screen w-[90vw] fixed right-0 top-0`,
    drawerWrapper: `w-screen h-screen fixed top-0 left-0 bg-[#00000080] z-[10001]`,
    navLink: `text-[#fff] m-3 font-medium text-lg`,
    activeNavLink: `text-brand m-3 font-medium text-lg`,
    closeBtn: `text-5xl absolute right-[10px] hover:opacity-50 cursor-pointer transition-all`,
}

export default Drawer
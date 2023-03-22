import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import Header from "../../components/Header"
import { NETWORK_PACKAGES, NON_NETWORK_PACKAGES } from "../../constants/packages.const"
// import { networkPurchase, purchaseNonGlo } from "../../redux/functions/packages"
// import { networkPurchase, purchaseNonGlo } from "./packages.js"
import { getGlobalKeys } from "../../redux/functions/auth"
import Button from "../../components/buttons/Button"
import useQuery from "../../hooks/useQuery"
import { toast } from "wc-toast"
import { networkPurchase, purchaseNonGlo } from "../../redux/functions/packages"

const Packages = () => {
    const navigate = useNavigate()
    const query = useQuery()

    const [previousPage, setPreviousPage] = useState("")
    const [packages, setPackages] = useState(NETWORK_PACKAGES)
    const [fwPublicKey, setFWPublicKey] = useState()
    const [price, setPrice] = useState(0)
    const [showPurchaseModal, setShowPurchaseModal] = useState(false)
    const [purchasing, setPurchasing] = useState(false)
    const [selectedPackage, setSelectedPackage] = useState({})
    const [onProceed, setOnProceed] = useState(false)
    const [subscriptionType, setSubscriptionType] = useState('');

    const handleCheckboxChange = (e) => {
        if (e.target.name === 'autorenewal' && e.target.checked) {
            setSubscriptionType('auto-renewal');
        } else if (e.target.name === 'one-off' && e.target.checked) {
            setSubscriptionType('one-off');
        }
    }

    useEffect(() => {
        setPreviousPage(window.location.hash.replace("#/packages?previous=", ""))
    }, [query])

    const onPurchasePackage = async () => {
        setPurchasing(true)
        await networkPurchase(selectedPackage, subscriptionType, navigate)
        setOnProceed(false)
        setShowPurchaseModal(false)
        setPurchasing(false)
        setSubscriptionType("")
    }

    return (
        <div>
            <Header />
            {showPurchaseModal ? <div className="w-screen h-screen flex items-center justify-center fixed top-0 left-0 bg-[#000000d1]">
                <div className="bg-white text-black p-5 rounded-md w-full max-w-[400px] text-center m-5">
                    {!onProceed ? <div>
                        <h2 className="font-[500] mb-5">Buy {selectedPackage.name} at  {selectedPackage.price}</h2>
                        <div className="flex items-center justify-center gap-3 mb-3">
                            {selectedPackage.hasAutorenewal && <label className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    name="autorenewal"
                                    checked={subscriptionType === 'auto-renewal'}
                                    onChange={handleCheckboxChange}
                                />
                                Auto-renewal
                            </label>}
                            <label className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    name="one-off"
                                    checked={subscriptionType === 'one-off'}
                                    onChange={handleCheckboxChange}
                                />
                                One-off
                            </label>
                        </div>
                    </div> : <h2 className="font-[500] mb-5">
                        {selectedPackage.price} will be deducted from your {localStorage.getItem("tva_is_glo") === "true" ? "GLO Airtime" : "account"}.
                        Do you want to proceed?
                    </h2>}
                    <div className="flex items-center justify-center">
                        {!onProceed
                            ? <div>{subscriptionType && <Button label={`Proceed`} action={() => setOnProceed(true)} />}</div>
                            : <Button isDisabled={purchasing} label={purchasing ? "loading..." : `Buy ${selectedPackage.price}`} action={onPurchasePackage} />}
                        <div>
                            <p onClick={() => {
                                setOnProceed(false)
                                setShowPurchaseModal(false)
                                setSubscriptionType("")
                            }} className="ml-3 cursor-pointer hover:opacity-50 transition-all">Cancel</p>
                        </div>
                    </div>
                </div>
            </div> : <></>}
            <div className="w-screen h-screen -mt-[65px] flex items-center justify-center flex-col md:pt-0 pt-[500px]">
                <h1 className="text-xl lg:text-3xl mb-10 font-[600]">Buy an MTN Package</h1>
                <ul className={styles.packageWrapper}>
                    {packages.map((item, i) => {
                        return (
                            <li onClick={() => {
                                setPrice(Number(item.price.replace("₦", "")))
                                setSelectedPackage(item)
                                setShowPurchaseModal(true)
                            }} className={styles.package} key={i}>
                                <h3 className="text-xl font-[600]">{item.name}</h3>
                                <p className="my-5">{item.accessTo}</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-xl font-[600]">{item.price}</p>
                                    <small>{item.validityPeriod}</small>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

const styles = {
    package: `border-2 border-[#555] bg-[#1d1d1d] w-full p-5 rounded-md hover:bg-brand hover:border-brand transition-all cursor-pointer`,
    packageWrapper: `grid lg:grid-cols-3 gap-3 p-5 w-full max-w-7xl`,
}

export default Packages
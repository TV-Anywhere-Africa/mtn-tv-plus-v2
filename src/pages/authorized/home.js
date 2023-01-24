import { useEffect, useState } from "react"
import { getBannerContent, getCategoryMovies } from "../../redux/functions/vod"
import Banner from "../../components/Banner"
import Carousel from "../../components/Carousel"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import getVODImage from "../../utils/vod/getVODImage"
import { useLocation } from "react-router"
import usePrevLocation from "../../hooks/usePrevLocation"

const Home = () => {
    // const location = useLocation()
    const [categoryMovies, setCategoryMovies] = useState([])
    const [bannerDetails, setBannerDetails] = useState({})

    // const [route, setRoute] = useState({
    //     to: location.pathname,
    //     from: location.pathname
    // });

    // useEffect(() => {
    //     setRoute((prev) => ({ to: location.pathname, from: prev.to }))
    // }, [location])

    // console.log(route) 

    useEffect(() => {
        const init = async () => {
            if (await getCategoryMovies())
                setCategoryMovies(await getCategoryMovies())
        }
        init()
    }, [])

    useEffect(() => {
        const initSetBannerDetails = async () => {
            let content = await getBannerContent()
            if (content) {
                let x = {
                    title: content.title,
                    description: content.description,
                    watchLink: `/watch/live/${content.link}?title=${content.title}`,
                    bgImage: getVODImage(content.preview_image_id),
                    video: "",
                    id: content.id,
                }
                setBannerDetails(x)
            }
        }

        initSetBannerDetails()
    }, [])

    useEffect(() => {
        const initGetChannels = async () => {
            // console.log(await getChannels())
        }

        initGetChannels()
    }, [])

    return (
        <>
            <Header />
            <wc-toast></wc-toast>
            <Banner content={bannerDetails}></Banner>
            {
                categoryMovies.map((category, i) => {
                    // console.log(category)
                    return (
                        <Carousel
                            // showTitles
                            key={i + Date.now()}
                            title={category.title}
                            items={category.content}
                        />
                    )
                })
            }
            <Footer />
        </>
    )
}

export default Home
import { useEffect, useState } from "react"
import { getBannerContent, getCategoryMovies } from "../../redux/functions/vod"
import { refreshToken } from "../../redux/functions/auth"
import Banner from "../../components/Banner"
import Carousel from "../../components/Carousel"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import getVODImage from "../../utils/vod/getVODImage"
import GenreMovies from "../../components/GenreMovies"
import { useSelector } from "react-redux"

const Movies = () => {
    const { activeMovieGenre } = useSelector(state => state.ui)
    const [categoryMovies, setCategoryMovies] = useState([])
    const [bannerDetails, setBannerDetails] = useState({})
    const [channels, setChannels] = useState([])

    refreshToken()

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
            let x = {
                title: content.title,
                description: content.description,
                watchLink: `/watch/movie/${content.link}`,
                bgImage: getVODImage(content.preview_image_id),
                video: "",
                id: content.id,
            }
            setBannerDetails(x)
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
            <Banner content={bannerDetails} >
                {/* <div className="z-50 w-screen">
                    <Carousel
                        maxLines={1}
                        showTitles title="Pop-up channels"
                        items={[{}, {}, {}, {}, {}, {}, {}, {}]}
                    />
                </div> */}
            </Banner>
            {/* <GenreTabs /> */}
            {activeMovieGenre !== "All"
                ? <GenreMovies />
                : <div>
                    {
                        categoryMovies.map((category, i) => {
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
                </div>}
            <Footer />
        </>
    )
}

export default Movies
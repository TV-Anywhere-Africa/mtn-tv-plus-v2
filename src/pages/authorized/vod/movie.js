import Header from "../../../components/Header"
import { useEffect, useState } from "react"
import { getGenres, getMovieDetails, getWatchlist, removeFromWatchlist, updateWatchlist } from "../../../redux/functions/vod"
import { Link, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FiPlay } from "react-icons/fi"
import Loader from "../../../components/Loader"
import secondsToReadableTime from "../../../utils/secondsToReadableTime"
import getGenreName from "../../../utils/vod/getGenreName"
import getVODImage from "../../../utils/vod/getVODImage"
import Button from "../../../components/buttons/Button"
import share from "../../../utils/share.util"

const Movie = () => {
    const dispatch = useDispatch()
    const { id, type } = useParams()
    const { vodDetailsLoading } = useSelector(state => state.ui)
    const [vodDetails, setVODDetails] = useState({})
    const [genre, setGenre] = useState("")
    const [watchlisted, setWatchlisted] = useState(true)
    const [watchlist, setWatchlist] = useState([])

    // console.log("vodDetails", vodDetails)

    useEffect(() => {
        const init = async () => {
            setVODDetails(await getMovieDetails(id, type, dispatch))
            setWatchlist(await getWatchlist())
        }
        init()
    }, [])

    useEffect(() => {
        const getGenreDetails = async () => {
            if (vodDetails && vodDetails.genres) {
                setGenre(getGenreName(vodDetails.genres, await getGenres()))
            }
        }
        getGenreDetails()
    }, [vodDetails])

    useEffect(() => {
        const initCheckIsWatchlisted = () => {
            let _ids = []
            for (let i = 0; i < watchlist.length; i++) {
                const element = watchlist[i];
                _ids.push(element.movie_id)
            }
            if (_ids.includes(vodDetails.id))
                setWatchlisted(true)
            else setWatchlisted(false)
        }
        initCheckIsWatchlisted()
    }, [vodDetails, watchlist])

    const toggleAddToWatchlist = (action) => {
        setWatchlisted(!watchlisted)
        if (action === 'add') updateWatchlist(vodDetails.id, 'movie', 0)
        if (action === 'remove') removeFromWatchlist(vodDetails.id, 'movie')
    }

    if (vodDetailsLoading) return (
        <Loader />
    )

    if (vodDetails) return (
        <>
            <Header />
            <wc-toast></wc-toast>
            <main>
                <div className={styles.banner}>
                    <div className={styles.bannerWrapper}>
                        <div className={styles.bannerContent}>

                            <div className="flex items-center justify-center">
                                {vodDetails.images
                                    ? <img className="w-full lg:w-max lg:max-w-[250px] max-w-[140px] lg:mb-0 mb-5 border-[3px] border-[#fff] rounded-md" src={getVODImage(vodDetails.image_store_id)} alt={"poster of " + vodDetails.title} />
                                    : <></>}
                            </div>

                            <div className="lg:ml-6">
                                <h1 className="text-2xl lg:text-4xl text-secondary font-medium mb-3">{vodDetails.title}</h1>
                                <div className="flex items-center mb-3">

                                    <Link to={"/watch/movie/" + vodDetails.uid + "?title=" + vodDetails.title + "&id=" + vodDetails.id} className="hover:opacity-50 transition-all">
                                        <div className="bg-[#fff] w-[50px] h-[50px] pl-1 flex items-center justify-center rounded-full">
                                            <FiPlay color="#000" fill="#000" size={30} />
                                        </div>
                                    </Link>

                                    <div className="m-1 lg:m-2" />
                                    <Button action={() => share(vodDetails)} label="Share" />
                                    <div className="m-1 lg:m-2" />

                                    {
                                        watchlisted
                                            ? <Button action={() => toggleAddToWatchlist("remove")} label="Remove from list" />
                                            : <Button action={() => toggleAddToWatchlist("add")} label="Add to watchlist" />
                                    }
                                </div>
                                <p className="mt-5">{vodDetails.description}</p>
                                <div>
                                    <p className="mt-8 mb-3">{secondsToReadableTime(vodDetails.duration)} | {vodDetails.year} | {vodDetails.user_rating}</p>
                                    <div className="flex items-center">
                                        <b>Genre:&nbsp;</b>
                                        <p>{genre}</p>
                                    </div>
                                    {
                                        vodDetails.audio_languages
                                            ? <div className="flex items-center">
                                                <b>Audio:&nbsp;</b>
                                                <p>{vodDetails.audio_languages}</p>
                                            </div>
                                            : <></>
                                    }
                                    {
                                        vodDetails.subtitle_languages
                                            ? <div className="flex items-center">
                                                <b>Subtitles:&nbsp;</b>
                                                <p>{vodDetails.subtitle_languages}</p>
                                            </div>
                                            : <></>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        vodDetails.image_store_id
                            ? <div className="fixed top-0 w-screen h-screen">
                                <img className={styles.bannerBgImg} src={getVODImage(vodDetails.images.PREVIEW || vodDetails.image_store_id)} alt={"poster of " + vodDetails.title} />
                                <div className="banner-gradient vod-details-gradient" />
                            </div>
                            : <></>
                    }
                </div>
                <div className="banner-gradient vod-details-gradient w-full h-full fixed left-0 top-0" />
                {/* <div className={styles.bannerSlid ? <div className="fixed top-0 w-screen h-screen">e}>
                    <Carousel maxLines={1} showTitles title="Section #3" items={[{}, {}, {}, {}, {}, {}, {}, {}]} />
                </div> */}
            </main>
        </>
    )

    return (
        <>
            <Header />
        </>
    )
}

const styles = {
    banner: `text-[#fff] flex flex-col items-center -mt-[60px]`,
    bannerWrapper: `z-10 w-screen mt-[100px] pb-32 max-w-[1300px] m-auto lg:mt-[180px]`,
    bannerContent: `lg:flex mt-10 p-5`,
    bannerSlide: `z-50 w-screen`,
    bannerBgImg: `absolute top-0 left-0 h-full w-full object-cover`,
}

export default Movie
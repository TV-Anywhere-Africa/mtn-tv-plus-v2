import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { getMovieDetails, getPackages, getSeriesDetails, getVideo, updateWatchlist } from "../../redux/functions/vod"
import { sendLog } from "../../utils/sendLog.util"
import useQuery from "../../hooks/useQuery"
import { getUserChannels } from "../../redux/functions/channels"
import arraysHaveCommonElements from "../../utils/arraysHaveCommonElements.util"
import routes from "../../constants/routes.const"
import ProPlayer from "pro-player"
import 'pro-player/dist/index.css'

const Watch = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const query = useQuery()
    const params = useParams()

    const { id, type } = useParams()
    const [videoSource, setVideoSource] = useState("")
    const [isLiveTv, setIsLiveTv] = useState(true)
    const [lengthWatchedInMs, setLengthWatchedInMs] = useState(0)
    const [secondsPlayed, setSecondsPlayed] = useState(0)
    const [isPurchasedLoading, setIsPurchasedLoading] = useState(true)

    useEffect(() => {
        const checkIsPurchased = async () => {

            try {
                setIsPurchasedLoading(true)

                let details;
                if (type === "series") details = await getSeriesDetails(query.get("id"), dispatch)
                if (type === "movie") details = await getMovieDetails(query.get("id"), '', dispatch)

                console.log('details', details)

                if (type === "live") {
                    console.log('is live')
                    let userChannels = await getUserChannels()
                    let channel

                    for (let a = 0; a < userChannels.length; a++) {
                        const element = userChannels[a];

                        // console.log('element.id', element.id, '===', Number(query.get("id")))

                        if (element.id === Number(query.get("id"))) {
                            channel = element
                            console.log('channel = element', element)
                        }
                    }

                    console.log('userChannels', userChannels)
                    console.log('channel', typeof channel.purchased)

                    //     console.log('live', channel)

                    if (typeof channel.purchased !== "string") {
                        console.log('no package')
                        redirectToPurchasePage()
                    } else setIsPurchasedLoading(false)
                }

                let packages_ = await getPackages()

                console.log('packages_', packages_)

                // console.log('packages_', packages_.purchasedPackages)
                // console.log(arraysHaveCommonElements(details.packages, packages_.purchasedPackages))

                if (!arraysHaveCommonElements(details.packages, packages_.purchasedPackages))
                    redirectToPurchasePage()
                else setIsPurchasedLoading(false)
            } catch (error) {
                console.log(error.message)

                if (error.message === 'channel is undefined') redirectToPurchasePage()
                // toast.error(error.message)
                // setIsPurchasedLoading(false)
            }
        }

        if (typeof dispatch === 'function') checkIsPurchased()
    }, [dispatch])

    useEffect(() => {
        if (!isPurchasedLoading) {

            const route = location.pathname
            if (route.substring(0, 12) === '/watch/live/') setIsLiveTv(true)
            else setIsLiveTv(false)
        }
    }, [isPurchasedLoading, location.pathname])

    useEffect(() => {
        const initGetVideo = async () => {
            console.log("getting video")
            let videoRes = await getVideo(id, type, dispatch, params.id, query.get("title") || "")
            console.log("videoRes", videoRes)
            if (videoRes) setVideoSource(videoRes.url)
        }

        if (!isPurchasedLoading) initGetVideo()
    }, [isPurchasedLoading])

    const redirectToPurchasePage = () => {
        let thisRoute = `${location.pathname}${location.search}`
        navigate(routes.packages + `?previous=` + thisRoute, { replace: true })
    }

    const setProgressInMs = (e) => {
        // console.warn("setProgressInMs", e.currentTime)
        const _lengthWatchedInMs = (e.currentTime * 100).toFixed(0) * 10
        setLengthWatchedInMs(_lengthWatchedInMs)
        initSendPlayLogs(e.currentTime.toFixed(0))
        setSecondsPlayed(e.currentTime.toFixed(0))
    }

    const initSendPlayLogs = async (x) => {
        // console.warn("initSendPlayLogs", x)
        //* check if playtime is 60seconds (value is a multiple of 60)
        let remainder = x % 60
        if (remainder === 0)
            await sendLog({
                action: 'play',
                content_uid: id,
                content_type: type,
                content_name: query.get("title") || "",
                duration: Number(x)
            })
    }

    const initUpdateWatchlist = async () => {
        // console.warn("initUpdateWatchlist")
        if (type === 'series') updateWatchlist(id, 'series', lengthWatchedInMs, true)
        if (type === 'movie') updateWatchlist(id, 'movie', lengthWatchedInMs, true)

        await sendLog({
            action: 'play',
            content_uid: id,
            content_type: type,
            content_name: query.get("title") || "",
            duration: Number(lengthWatchedInMs)
        })
    }

    const onMovieEnd = async () => {
        const _secondsInt = secondsPlayed
        _secondsInt.replace(',', '')
        await sendLog({
            action: 'play',
            content_uid: id,
            content_type: type,
            content_name: query.get("title") || "",
            duration: Number(_secondsInt)
        })
    }

    return (
        <>
            <wc-toast></wc-toast>

            <div className="w-screen h-screen flex items-center justify-center">
                <div className="w-screen lg:w-[89.2vw] m-auto">
                    {videoSource && <ProPlayer
                        source={videoSource}
                        autoPlay={true}
                        muted={false}
                        videoTitle={query.get("title") || ""}

                        onEnded={onMovieEnd}
                        onPause={initUpdateWatchlist}
                        onSeek={initUpdateWatchlist}
                        onStart={initUpdateWatchlist}
                        onBufferEnd={initUpdateWatchlist}
                        onPlay={initUpdateWatchlist}
                        onProgress={setProgressInMs}
                    />}
                </div>
            </div>


            {/* <ProPlayer
                source={videoSource}
                onEnded={onMovieEnd}
                onPause={initUpdateWatchlist}
                onSeek={initUpdateWatchlist}
                onStart={initUpdateWatchlist}
                onBufferEnd={initUpdateWatchlist}
                onPlay={initUpdateWatchlist}
                onProgress={setProgressInMs}
                title={query.get("title") || ""} 
            /> */}

            {/* <VideoPlayer
                onEnded_={onMovieEnd}
                onPause_={initUpdateWatchlist}
                onSeek_={initUpdateWatchlist}
                onStart_={initUpdateWatchlist}
                onBufferEnd_={initUpdateWatchlist}
                onPlay_={initUpdateWatchlist}
                onProgress_={setProgressInMs}
                title={query.get("title") || ""}
                liveURL={videoSource}
            /> */}
        </>
    );

    // return (
    //     <>
    //         <div className="fixed top-0 l-0 w-screen h-[60px]">
    //             <div className="w-full h-full flex items-center justify-between px-5">
    //                 <p className="cursor-pointer text-sm hover:opacity-40 whitespace-nowrap transition-all" onClick={() => window.history.back()} >&larr; Back</p>
    //                 <p className="max-lines-1 mx-1 text-sm">{query.get("title") || ""}</p>
    //                 <div onClick={() => goFullScreen()}>
    //                     <FiMaximize onClick={() => goFullScreen()} className="cursor-pointer hover:opacity-40 transition-all" />
    //                 </div>
    //             </div>
    //         </div>
    //         <wc-toast></wc-toast>
    //         <div className="mt-[60px]" />
    //         <ReactPlayer
    //             url={videoSource}
    //             width="100vw"
    //             height="90vh"
    //             muted={false}
    //             autoPlay={true}
    //             playing={true}
    //             volume={1}
    //             controls={isLiveTv ? false : true}

    //             onProgress={setProgressInMs}
    //             onPlay={initUpdateWatchlist}
    //             onBufferEnd={initUpdateWatchlist}
    //             onEnded={onMovieEnd}
    //             onPause={initUpdateWatchlist}
    //             onSeek={initUpdateWatchlist}
    //             onStart={initUpdateWatchlist}
    //         />
    //     </>
    // )
}

export default Watch



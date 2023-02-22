import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import Banner from "../../components/Banner"
import Header from "../../components/Header"
import LiveTVCarousel from "../../components/LiveTVCarousel"
import { getChannelCategories, getChannelEPGInfo } from "../../redux/functions/channels"

const LiveTV = () => {
    const dispatch = useDispatch()
    const [bannerDetails, setBannerDetails] = useState({})
    const [EPGs, setEPGs] = useState([])
    const [channelCategories, setChannelCategories] = useState([])

    // useEffect(() => {
    //     const initSetBannerDetails = async () => {
    //         let content = await getBannerContent()
    //         let x = {
    //             title: content.title,
    //             description: content.description,
    //             watchLink: `/watch/movie/${content.uid}`,
    //             bgImage: getVODImage(content.preview_image_id),
    //             video: "",
    //             id: content.id,
    //         }
    //         setBannerDetails(x)
    //     }

    //     initSetBannerDetails()
    // }, [])

    useEffect(() => {
        const getAllChanelsIDs = async () => {
            const channelIDs = []
            const _channelCategories = await getChannelCategories(dispatch)

            console.log("_channelCategories", _channelCategories)

            if (_channelCategories) setChannelCategories(_channelCategories)

            for (let i = 0; i < _channelCategories.length; i++) {
                const element = _channelCategories[i];
                let channels = element.channels

                for (let j = 0; j < channels.length; j++) {
                    channelIDs.push(channels[j].id)
                }
            }

            // console.warn(channelIDs.toString())

            // console.warn(await getChannelEPGInfo(channelIDs.toString()))
            setEPGs(await getChannelEPGInfo(channelIDs.toString()))
        }

        getAllChanelsIDs()
    }, [])

    return (
        <>
            <Header />
            <wc-toast></wc-toast>
            {/* <Banner content={bannerDetails}></Banner> */}
            <div className="my-20" />
            {
                channelCategories ? channelCategories.map((channel, index) => {
                    // console.log("EPGs", channel)
                    return (
                        <div key={channel.id + index}>
                            <LiveTVCarousel
                                channel={channel}
                                items={EPGs}
                                title={channel.name}
                            />
                        </div>
                    )
                }) : <></>
            }
        </>
    )
}

export default LiveTV
import { sliderConfig } from "../../config/slider.config"
import { capitalizeString } from "../../utils/global.utils"
import Slider from "react-slick"
import LiveTVCard from "../Cards/LiveTVCard"

const LiveTVCarousel = ({ maxLines = 2, showTitles = false, channel, items = [], title }) => {
    // if (items.length < 1 || !title) return (<></>)

    // console.log(channel)

    return (
        <>
            <div className="max-w-[2000px] px-5 py-[30px] pb-[10px] m-auto">
                <h2 className="text-[#fff] text-xl font-medium">{capitalizeString(title)}</h2>
                <div className="-ml-2 mb-5">
                    <Slider {...sliderConfig(6)}>
                        {
                            items ? channel.channels.map((vod, i) => {

                                const _vod = { ...vod }
                                const _epg = items.filter(epg => {
                                    return vod.id === epg.id
                                })

                                if (_epg.length > 0) _vod.shows = _epg[0].shows

                                // console.log("_VOD", _vod)

                                return (
                                    <LiveTVCard
                                        key={i + _vod.id}
                                        content={_vod}
                                        showTitles={showTitles}
                                        maxLines={maxLines}
                                    />
                                )
                            }) : <></>
                        }
                    </Slider>
                </div>
            </div>
        </>
    )
}

export default LiveTVCarousel
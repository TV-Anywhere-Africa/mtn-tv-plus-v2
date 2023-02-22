import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getChannelInfo } from "../../../redux/functions/channels"
import { capitalizeString } from "../../../utils/global.utils"
import getEPGInfo from "../../../utils/vod/getEPGInfo"
import getVODImage from "../../../utils/vod/getVODImage"

const LiveTVCard = ({ content, showTitles, maxLines, isGridItem, subtitle, id }) => {
    const [channelInfo, setChannelInfo] = useState({})
    const [epgInfo, setEPGInfo] = useState({ start: '00:00', end: '00:00', title: '' })

    useEffect(() => {
        const initFetchChannelInfo = async () => {
            setChannelInfo(await getChannelInfo(content.id))
        }

        const initSetDates = async () => {
            setEPGInfo(getEPGInfo(content.shows))
        }

        initSetDates()
        initFetchChannelInfo()
    }, [content])

    if (!channelInfo) return (<></>)

    return (
        <>
            <Link to={`/watch/live/${channelInfo.uid}?title=${channelInfo.name}&id=${id}`}>
                <div className={styles.card}>
                    {channelInfo.image_stores && channelInfo.image_stores[0] && epgInfo ? <div>
                        <img className="rounded-md h-[150px] w-full object-contain bg-[#000]" src={getVODImage(channelInfo.image_stores[0].id)} alt={"poster of " + epgInfo.title} />
                    </div> : <></>}

                    {epgInfo ? <div>
                        <p className="max-lines-1 text-sm mt-3 opacity-60">{capitalizeString(epgInfo.title.replace(/ *\([^)]*\) */g, ""))}</p>
                        <p className="text-sm">{epgInfo.start} - {epgInfo.end}</p>
                    </div> : <></>}
                </div>
            </Link>
        </>
    )
}

const styles = {
    card: `bg-[#1b1b1b] w-full p-2 rounded-md`,
    gridCard: `w-full max-w-[120px] lg:max-w-[150px] m-3`,
}

export default LiveTVCard
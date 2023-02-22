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
        async function initFetchChannelInfo  ()  {
            let channelInfo_=getEPGInfo(content.shows)
            if (channelInfo_)  setChannelInfo(channelInfo_)
            // setChannelInfo(await getChannelInfo(content.id))
        }

        async function initSetDates  ()  {
            let epgInfo_=getEPGInfo(content.shows)
            if(epgInfo_)    setEPGInfo(epgInfo_)
            // setEPGInfo(getEPGInfo(content.shows))
        }

        initSetDates()
        initFetchChannelInfo()
    }, [content])

    if (!channelInfo) return (<></>)

    return (
      <Link to={`/watch/live/${channelInfo.uid}?title=${channelInfo.name}&id=${id}`}>
            <div className={styles.card}>
                
       </div>
        </Link> 
    )

    // return (
    //     <>
    //         <Link to={`/watch/live/${channelInfo.uid}?title=${channelInfo.name}&id=${id}`}>
    //             <div className={styles.card}>
    //                 {channelInfo.image_stores && epgInfo ? <div>
    //                     <img className="rounded-md h-[150px] w-full object-contain bg-[#000]" src={getVODImage(channelInfo.image_stores[0].id)} alt={"poster of " + epgInfo.title} />
    //                 </div> : <></>}

    //                 {epgInfo ? <div>
    //                     <p className="max-lines-1 text-sm mt-3 opacity-60">{capitalizeString(epgInfo.title.replace(/ *\([^)]*\) */g, ""))}</p>
    //                     <p className="text-sm">{epgInfo.start} - {epgInfo.end}</p>
    //                 </div> : <></>}
    //             </div>
    //         </Link>
    //     </>
    // )
}

const styles = {
    card: `bg-[#1b1b1b] lg:min-h-[200px] w-full p-2 rounded-md`,
    gridCard: `bg-[#1b1b1b] lg:min-h-[200px] w-full max-w-[120px] lg:max-w-[150px] m-3`,
}

export default LiveTVCard

// import { useEffect, useState } from "react"
// import { LazyLoadImage } from "react-lazy-load-image-component"
// import { Link } from "react-router-dom"
// import { getChannelEPGInfo, getChannelInfo } from "../../../redux/functions/channels"
// import { capitalizeString } from "../../../utils/global.utils"
// import getVODImage from "../../../utils/vod/getVODImage"
// // import getEPGInfo from "../../../utils/vod/getEPGInfo.util"
// // import getVODImage from "../../../utils/vod/getVODImage.util"

// const LiveTVCard = ({ content, showTitles, maxLines, isGridItem, subtitle }) => {
//     const [channelInfo, setChannelInfo] = useState({})
//     const [epgInfo, setEPGInfo] = useState({ start: '00:00', end: '00:00', title: '' })

//     useEffect(() => {
//         async function initFetchChannelInfo() { 
//             if (!content) return

//             let channelInfo_ = await getChannelInfo(content.id)
       
//             if (channelInfo_) {
//                 console.log(channelInfo_)
//                 // setChannelInfo(channelInfo_)
//             }
//         }

//         async function initSetDates() {
//             setEPGInfo(getChannelEPGInfo(content.shows))
//         }

//         initSetDates()
//         initFetchChannelInfo()
//     }, [content])

//     return (
//         <>{channelInfo.image_stores.toString()}</>
//     )

//     // if (!channelInfo) return (<></>)

//     // if (epgInfo && channelInfo.image_stores[0]) return (
//     //     <>
//     //         <Link to={`/watch/live/` + channelInfo.uid + "?i=" + channelInfo.uid + "&t=" + epgInfo.title}>
//     //             <div className={styles.card}>
//     //                 <LazyLoadImage
//     //                     className="rounded-md w-full h-[120px] object-contain bg-[#121619]"
//     //                     src={getVODImage(channelInfo.image_stores[0].id)}
//     //                     alt={"poster of " + content.title}
//     //                 />
//     //                 {epgInfo.title && <div>
//     //                     <p className="max-lines-1 text-sm mt-3 opacity-60">{capitalizeString(epgInfo.title.replace(/ *\([^)]*\) */g, ""))}</p>
//     //                     <p className="text-sm">{epgInfo.start} - {epgInfo.end}</p>
//     //                 </div>}
//     //             </div>
//     //         </Link>
//     //     </>
//     // )
// }

// const styles = {
//     card: `rounded-md`,
//     gridCard: `w-full max-w-[120px] lg:max-w-[150px] m-3`,
// }

// export default LiveTVCard

// import { useEffect, useState } from "react"
// import { Link } from "react-router-dom"
// import { getChannelInfo } from "../../../redux/functions/channels"
// import { capitalizeString } from "../../../utils/global.utils"
// import getEPGInfo from "../../../utils/vod/getEPGInfo"
// import getVODImage from "../../../utils/vod/getVODImage"

// const LiveTVCard = ({ content, showTitles, maxLines, isGridItem, subtitle }) => {
//     const [channelInfo, setChannelInfo] = useState({})
//     const [epgInfo, setEPGInfo] = useState({ start: '00:00', end: '00:00', title: '' })

//     useEffect(() => {
//         async function initFetchChannelInfo() {
//             setChannelInfo(await getChannelInfo(content.id))
//         }

//         async function initSetDates() {
//             setEPGInfo(getEPGInfo(content.shows))
//         }

//         initSetDates()
//         initFetchChannelInfo()
//     }, [content])

//     // if (!channelInfo) return (<></>)
//     // if (channelInfo.image_stores) console.log("channelInfo", channelInfo.image_stores[0])

//     if (epgInfo && channelInfo) return (
//         <>
//             <Link to={`/watch/live/${channelInfo.uid}?title=${channelInfo.name}`}>
//                 <div className={styles.card}>
//                     {/* {channelInfo.image_stores && <img className="rounded-md h-[150px] w-full object-contain bg-[#000]" src={getVODImage(channelInfo.image_stores[0].id)} alt={"poster of " + epgInfo.title} />} */}

//                     {channelInfo.image_stores && <p>{channelInfo.image_stores[0].toString()}</p>}

//                     <div>
//                         <p className="max-lines-1 text-sm mt-3 opacity-60">{capitalizeString(epgInfo.title.replace(/ *\([^)]*\) */g, ""))}</p>
//                         <p className="text-sm">{epgInfo.start} - {epgInfo.end}</p>
//                     </div>
//                 </div>
//             </Link>
//         </>
//     )
// }

// const styles = {
//     card: `bg-[#1b1b1b] w-full p-2 rounded-md`,
//     gridCard: `w-full max-w-[120px] lg:max-w-[150px] m-3`,
// }

// export default LiveTVCard
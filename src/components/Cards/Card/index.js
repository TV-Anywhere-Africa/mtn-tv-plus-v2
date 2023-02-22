import { Link } from "react-router-dom"
import { capitalizeString } from "../../../utils/global.utils"
import getVODImage from "../../../utils/vod/getVODImage"

const Card = ({ content, showTitles, type, maxLines, isGridItem, subtitle }) => {
    return (
        <>
            <Link to={`/vod/` + content.type + "/" + content.id}>
                <div className={isGridItem ? styles.gridCard : styles.card}>
                    {content.image_id ? <div>
                        <img className="rounded-md" src={getVODImage(content.image_id)} alt={"poster of " + content.title} />
                    </div> : <></>}

                    {showTitles ? <div>
                        <p className={`max-lines-${maxLines} leading-7 mt-3`}>{capitalizeString(content.title || "")}</p>
                        <p className="text-sm mt-1 opacity-60">{subtitle}</p>
                    </div> : <></>}
                </div>
            </Link>
        </>
    )
}

const styles = {
    gridCard: `mb-5 bg-[#f5f3f31f] lg:min-h-[220px]`,
    card: `mb-5 bg-[#f5f3f31f] lg:min-h-[220px]`,
}

export default Card
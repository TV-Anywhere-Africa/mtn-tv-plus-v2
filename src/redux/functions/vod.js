// import axios from "axios"
// import axiosRetry from "axios-retry"
// import { toast } from "wc-toast"
// import { VOD_BASE_URL } from "../../config/apis.config"
// import { COOKIES } from "../../constants/global.const"
// import { getKeyByValue } from "../../utils/global.utils"
// import { sendLog } from "../../utils/sendLog.util"
// import getGenreId from "../../utils/vod/getGenreId"
// import { setGenreMoviesLoading, setSearchResultsLoading, setVideoLoading, setVODDetailsLoading } from "../slices/ui.slice"
// import { refreshToken } from "./auth"

// const userInfoCookie = COOKIES.get("user_info")
// const { access_token, operator_uid, user_id } = userInfoCookie || {}

// export const getPackages = async () => {
//     try {

//         let packageIds = []
//         let purchasedPackages = []
//         let packageIdsString = ""

//         await refreshToken()

//         const packages = await axios.get(
//             VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/packages?device_class=desktop`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`
//                 }
//             }
//         )

//         if (packages.data.status === "ok") {
//             [...packages.data.data].forEach((item) => {
//                 return packageIds.push(item.id);
//             })
//             packageIdsString = packageIds.join(',')
//         }

//         for (let a = 0; a < packages.data.data.length; a++) {
//             const element = packages.data.data[a];
//             if (element.purchased) purchasedPackages.push(element.id)
//         }

//         return {
//             packages: packages.data.data,
//             packageIds,
//             packageIdsString,
//             purchasedPackages
//         }
//     } catch (e) {
//         // console.error("get packages:", e.message)
//     }
// }

// export const getCategories = async () => {
//     try {

//         let { packageIdsString } = await getPackages()
//         let categoryIds = []
//         let categoriesIdsString = ""

//         const categories = await axios.get(
//             VOD_BASE_URL + `/api/client/v2/${operator_uid}/categories/vod?packages=${packageIdsString}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`
//                 }
//             }
//         )

//         console.log("CATEGORIES", categories.data.data)

//         categoryIds = categories.data.data.map((item) => {
//             return item.id;
//         })

//         categoriesIdsString = categoryIds.join(',')

//         return {
//             categories: categories.data.data,
//             categoryIds,
//             categoriesIdsString
//         }

//     } catch (e) {
//         // console.error('get categories:', e.message)
//     }
// }

// export const getCategoryMovies = async () => {
//     try {

//         let { categories, categoriesIdsString } = await getCategories()
//         let { packageIds } = await getPackages()
//         let categoryNamesAndId = {}
//         const vods = []

//         // console.log("categories >", categories)

//         categories.map((item) => {
//             return (categoryNamesAndId[item.name] = item.id);
//         })

//         let categoryMovies = await axios.get(
//             VOD_BASE_URL + `/api/client/v1/${operator_uid}/categories/vod/content?packages=${packageIds}&categories=${categoriesIdsString}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`
//                 }
//             }
//         )

//         // let ordered = categoryMovies.data.data.sort((a, b) => a.position - b.position)

//         console.log("categoryMovies", categoryMovies.data.data)

//         for (let a = 0; a < categoryMovies.data.data.length; a++) {
//             const element = categoryMovies.data.data[a];
//             const vodContent = {}

//             vodContent.title = getKeyByValue(categoryNamesAndId, element.id)
//             vodContent.content = element.content
//             vods.push(vodContent)
//         }

//         return vods

//     } catch (e) {
//         // console.error("get category movies:", e.message)
//         toast.error(e.message)
//     }
// }

// export const getGenreMovies = async (activeMovieGenre, dispatch) => {
//     try {

//         if (activeMovieGenre === "All") return []

//         dispatch(setGenreMoviesLoading(true))

//         let { categories, categoriesIdsString } = await getCategories()
//         let { packageIds } = await getPackages()
//         let categoryNamesAndId = {}
//         let genreId = getGenreId(await getGenres(), activeMovieGenre)

//         categories.map((item) => {
//             return (categoryNamesAndId[item.uid] = item.id);
//         })

//         let categoryMovies = await axios.get(
//             VOD_BASE_URL + `/api/client/v1/${operator_uid}/categories/vod/content?packages=${packageIds}&categories=${categoriesIdsString}&genres=${genreId}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`
//                 }
//             }
//         )

//         let genreMovies = []

//         for (let a = 0; a < categoryMovies.data.data.length; a++) {
//             const element = categoryMovies.data.data[a];
//             for (let b = 0; b < element.content.length; b++) {
//                 const _element = element.content[b]
//                 genreMovies.push(_element)
//             }
//         }

//         dispatch(setGenreMoviesLoading(false))
//         return genreMovies

//     } catch (e) {
//         // console.error("get genre movies:", e.message)
//         dispatch(setGenreMoviesLoading(false))
//         toast.error(e.message)
//     }
// }

// export const getSeriesDetails = async (id, dispatch) => {
//     try {

//         if (!id) return {}

//         dispatch(setVODDetailsLoading(true))

//         const seriesDetailsRes = await axios.get(
//             VOD_BASE_URL + `/api/client/v1/${operator_uid}/series/${id}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`
//                 }
//             }
//         )

//         dispatch(setVODDetailsLoading(false))
//         return seriesDetailsRes.data.data

//     } catch (e) {
//         // console.error("get VOD details:", e.message)
//         dispatch(setVODDetailsLoading(false))
//         toast.error(e.message)
//     }
// }

// export const getSearchResults = async (query, dispatch) => {

//     if (!query) return {}

//     try {

//         dispatch(setSearchResultsLoading(true))

//         await refreshToken(dispatch)

//         const { packageIdsString } = await getPackages()
//         const sanitizedQuery = query.replace(/[^a-zA-Z ]/g, "")

//         const searchResultsResponse = await axios.get(
//             VOD_BASE_URL + `/api/client/v1/${operator_uid}/search/movies/${sanitizedQuery}?translation=hr&packages=${packageIdsString}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`
//                 }
//             }
//         )

//         await sendLog({
//             action: 'search',
//             content_type: 'Movie',
//             content_name: sanitizedQuery
//         })

//         dispatch(setSearchResultsLoading(false))

//         return searchResultsResponse.data.data

//     } catch (e) {
//         // console.error("get search results:", e.message)
//         dispatch(setSearchResultsLoading(false))
//         // toast.error(e.message)
//     }
// }

// export const getMovieDetails = async (id, dispatch) => {
//     try {

//         if (!id) return {}

//         dispatch(setVODDetailsLoading(true))

//         await refreshToken(dispatch)

//         const movieDetailsRes = await axios.get(
//             VOD_BASE_URL + `/api/client/v2/${operator_uid}/movies?movies=${id.toString()}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`
//                 }
//             }
//         )

//         dispatch(setVODDetailsLoading(false))
//         return movieDetailsRes.data.data[0]

//     } catch (e) {
//         // console.error("get VOD details:", e.message)
//         dispatch(setVODDetailsLoading(false))
//         toast.error(e.message)
//     }
// }

// export const getGenres = async () => {
//     try {
//         const genreRes = await axios.get(
//             VOD_BASE_URL + `/api/client/v1/${operator_uid}/genres`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`
//                 }
//             }
//         )

//         return genreRes.data.data
//     } catch (e) {
//         // console.error("get genres:", e.message)
//     }
// }

// export const getVideo = async (id, type, dispatch, uid, title) => {
//     try {

//         dispatch(setVideoLoading(true))

//         await refreshToken(dispatch)

//         let url

//         if (type === "movie") url = VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/vod/movies/${id}`
//         if (type === "series") url = VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/vod/episodes/${id}`
//         if (type === "live") url = VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/live/channels/${id}`

//         const videoRes = await axios.get(url,
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`
//                 }
//             }
//         )

//         // console.log(videoRes.data)

//         await sendLog({
//             action: 'play',
//             content_uid: uid,
//             content_type: type,
//             content_name: title,
//             duration: 0
//         })

//         dispatch(setVideoLoading(false))
//         return videoRes.data.data

//     } catch (e) {
//         dispatch(setVideoLoading(false))
//         toast.error(e.message)
//         // console.error("get video:", e.message)
//     }
// }

// export const getTrailer = async (id) => {
//     try {
//         let trailerRes = await axios.get(
//             VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/vod/trailers/movies/${id}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`
//                 }
//             }
//         )

//         console.log(trailerRes.data)

//         return trailerRes.data.data.url

//     } catch (e) {
//         // console.error("get trailer:", e.message)
//     }
// }

// export const getBannerContent = async () => {
//     try {
//         // console.log(operator_uid)
//         const bannerContentRes = await axios.get(
//             VOD_BASE_URL + `/api/client/v1/${operator_uid}/banners?translation=en&accessKey=WkVjNWNscFhORDBLCg==`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`
//                 }
//             }
//         )

//         // console.log(bannerContentRes.data)

//         // axiosRetry(axios, { retries: 3 });
//         // axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });

//         return bannerContentRes.data.data

//     } catch (e) {
//         toast.error(e.message)
//         // console.error("get banner content:", e.message)
//     }
// }

// export const getSimilarMovies = async (id, type, dispatch) => {
//     try {

//         let similarMoviesRes = await axios.get(
//             VOD_BASE_URL + `/api/client/v1/${operator_uid}/vod/${type}/${id}/related`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`
//                 }
//             }
//         )

//         return similarMoviesRes.data.data

//     } catch (e) {
//         // console.error(e.message)
//     }
// }

// export const getWatchlist = async () => {
//     try {

//         const watchlistRes = await axios.get(
//             VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/my_content`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         )

//         return watchlistRes.data.data.movie_bookmarks

//     } catch (e) {
//         toast.error(e.message)
//         // console.error("get watchlist:", e.message)
//     }
// }

// export const updateWatchlist = async (id, type, lengthWatchedInMs = 0, hideSnackBar) => {

//     try {

//         if (!id) return

//         let url

//         if (type === 'series') url = VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/bookmarks/episodes/${id}`
//         if (type === 'movie') url = VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/bookmarks/movies/${id}/${id}`

//         const updateWatchlistRes = await axios.put(
//             url, {
//             "time": lengthWatchedInMs,
//             "name": id,
//         },
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         )

//         if (hideSnackBar) return

//         if (updateWatchlistRes.data.data.updated)
//             toast.success("Added to watchlist")

//     } catch (e) {
//         toast.error(e.message)
//         // console.error("update watchlist:", e.message)
//     }
// }

// export const removeFromWatchlist = async (id, type) => {

//     try {

//         if (!id) return

//         const removeFromWatchlistRes = await axios.delete(
//             VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/bookmarks/movies/${id}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`
//                 },
//             }
//         )

//         if (removeFromWatchlistRes.data.data.affectedRows > 0)
//             toast.success("Removed from watchlist")

//     } catch (e) {
//         toast.error(e.message)
//         // console.error("remove from watchlist:", e.message)
//     }
// }









import axios from "axios"
import axiosRetry from "axios-retry"
import { toast } from "wc-toast"
import { VOD_BASE_URL } from "../../config/apis.config"
import { COOKIES } from "../../constants/global.const"
import { getKeyByValue } from "../../utils/global.utils"
import { sendLog } from "../../utils/sendLog.util"
import getGenreId from "../../utils/vod/getGenreId"
import { setGenreMoviesLoading, setSearchResultsLoading, setVideoLoading, setVODDetailsLoading } from "../slices/ui.slice"
import { refreshToken } from "./auth"

const userInfoCookie = COOKIES.get("user_info")
const { access_token, operator_uid, user_id } = userInfoCookie || {}

export const getPackages = async () => {
    try {

        let packageIds = []
        let purchasedPackages = []
        let packageIdsString = ""

        await refreshToken()

        const packages = await axios.get(
            VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/packages?device_class=desktop`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        if (packages.data.status === "ok") {
            [...packages.data.data].forEach((item) => {
                return packageIds.push(item.id);
            })
            packageIdsString = packageIds.join(',')
        }

        for (let a = 0; a < packages.data.data.length; a++) {
            const element = packages.data.data[a];
            if (element.purchased) purchasedPackages.push(element.id)
        }

        return {
            packages: packages.data.data,
            packageIds,
            packageIdsString,
            purchasedPackages
        }
    } catch (e) {
        // console.error("get packages:", e.message)
    }
}

export const getCategories = async () => {
    try {

        let { packageIdsString } = await getPackages()
        let categoryIds = []
        let categoriesIdsString = ""

        const categories = await axios.get(
            VOD_BASE_URL + `/api/client/v2/${operator_uid}/categories/vod?packages=${packageIdsString}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        categoryIds = categories.data.data.map((item) => {
            return item.id;
        })

        categoriesIdsString = categoryIds.join(',')

        return {
            categories: categories.data.data,
            categoryIds,
            categoriesIdsString
        }

    } catch (e) {
        // console.error('get categories:', e.message)
    }
}

export const getCategoryMovies = async () => {
    try {

        let { categories, categoriesIdsString } = await getCategories()
        let { packageIds } = await getPackages()
        let categoryNamesAndId = {}
        const vods = []

        categories.map((item) => {
            return (categoryNamesAndId[item.name] = item.id);
        })

        let categoryMovies = await axios.get(
            VOD_BASE_URL + `/api/client/v1/${operator_uid}/categories/vod/content?packages=${packageIds}&categories=${categoriesIdsString}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        for (let a = 0; a < categoryMovies.data.data.length; a++) {
            const element = categoryMovies.data.data[a];
            const vodContent = {}

            vodContent.title = getKeyByValue(categoryNamesAndId, element.id)
            vodContent.content = element.content
            vods.push(vodContent)
        }

        return vods

    } catch (e) {
        // console.error("get category movies:", e.message)
        toast.error(e.message)
    }
}

export const getGenreMovies = async (activeMovieGenre, dispatch) => {
    try {

        if (activeMovieGenre === "All") return []

        dispatch(setGenreMoviesLoading(true))

        let { categories, categoriesIdsString } = await getCategories()
        let { packageIds } = await getPackages()
        let categoryNamesAndId = {}
        let genreId = getGenreId(await getGenres(), activeMovieGenre)

        categories.map((item) => {
            return (categoryNamesAndId[item.uid] = item.id);
        })

        let categoryMovies = await axios.get(
            VOD_BASE_URL + `/api/client/v1/${operator_uid}/categories/vod/content?packages=${packageIds}&categories=${categoriesIdsString}&genres=${genreId}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        let genreMovies = []

        for (let a = 0; a < categoryMovies.data.data.length; a++) {
            const element = categoryMovies.data.data[a];
            for (let b = 0; b < element.content.length; b++) {
                const _element = element.content[b]
                genreMovies.push(_element)
            }
        }

        dispatch(setGenreMoviesLoading(false))
        return genreMovies

    } catch (e) {
        // console.error("get genre movies:", e.message)
        dispatch(setGenreMoviesLoading(false))
        toast.error(e.message)
    }
}

export const getSeriesDetails = async (id, dispatch) => {
    try {

        if (!id) return {}

        dispatch(setVODDetailsLoading(true))

        const seriesDetailsRes = await axios.get(
            VOD_BASE_URL + `/api/client/v1/${operator_uid}/series/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        dispatch(setVODDetailsLoading(false))
        return seriesDetailsRes.data.data

    } catch (e) {
        // console.error("get VOD details:", e.message)
        dispatch(setVODDetailsLoading(false))
        toast.error(e.message)
    }
}

export const getSearchResults = async (query, dispatch) => {

    if (!query) return {}

    try {

        dispatch(setSearchResultsLoading(true))

        await refreshToken(dispatch)

        const { packageIdsString } = await getPackages()
        const sanitizedQuery = query.replace(/[^a-zA-Z ]/g, "")

        const searchResultsResponse = await axios.get(
            VOD_BASE_URL + `/api/client/v1/${operator_uid}/search/movies/${sanitizedQuery}?translation=hr&packages=${packageIdsString}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        await sendLog({
            action: 'search',
            content_type: 'Movie',
            content_name: sanitizedQuery
        })

        dispatch(setSearchResultsLoading(false))

        return searchResultsResponse.data.data

    } catch (e) {
        // console.error("get search results:", e.message)
        dispatch(setSearchResultsLoading(false))
        // toast.error(e.message)
    }
}

export const getMovieDetails = async (id, type, dispatch) => {
    try {

        if (!id) return {}

        dispatch(setVODDetailsLoading(true))

        await refreshToken(dispatch)

        const movieDetailsRes = await axios.get(
            VOD_BASE_URL + `/api/client/v2/${operator_uid}/movies?movies=${id.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        dispatch(setVODDetailsLoading(false))
        return movieDetailsRes.data.data[0]

    } catch (e) {
        // console.error("get VOD details:", e.message)
        dispatch(setVODDetailsLoading(false))
        toast.error(e.message)
    }
}

export const getGenres = async () => {
    try {
        const genreRes = await axios.get(
            VOD_BASE_URL + `/api/client/v1/${operator_uid}/genres`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        return genreRes.data.data
    } catch (e) {
        // console.error("get genres:", e.message)
    }
}

export const getVideo = async (id, type, dispatch, uid, title) => {
    try {

        dispatch(setVideoLoading(true))

        await refreshToken(dispatch)

        let url

        if (type === "movie") url = VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/vod/movies/${id}`
        if (type === "series") url = VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/vod/episodes/${id}`
        if (type === "live") url = VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/live/channels/${id}`

        const videoRes = await axios.get(url,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        // console.log(videoRes.data)

        await sendLog({
            action: 'play',
            content_uid: uid,
            content_type: type,
            content_name: title,
            duration: 0
        })

        dispatch(setVideoLoading(false))
        return videoRes.data.data

    } catch (e) {
        dispatch(setVideoLoading(false))
        toast.error(e.message)
        // console.error("get video:", e.message)
    }
}

export const getTrailer = async (id, type) => {
    try {

        const trailerRes = await axios.get(
            VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/vod/trailers/movies/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        return trailerRes.data.data.url

    } catch (e) {
        // console.error("get trailer:", e.message)
    }
}

export const getBannerContent = async () => {
    try {
        // console.log(operator_uid)
        const bannerContentRes = await axios.get(
            VOD_BASE_URL + `/api/client/v1/${operator_uid}/banners?translation=en&accessKey=WkVjNWNscFhORDBLCg==`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        axiosRetry(axios, { retries: 3 });
        // axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });

        return bannerContentRes.data.data[0]

    } catch (e) {
        toast.error(e.message)
        // console.error("get banner content:", e.message)
    }
}

export const getSimilarMovies = async (id, type, dispatch) => {
    try {

        let similarMoviesRes = await axios.get(
            VOD_BASE_URL + `/api/client/v1/${operator_uid}/vod/${type}/${id}/related`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )

        return similarMoviesRes.data.data

    } catch (e) {
        // console.error(e.message)
    }
}

export const getWatchlist = async () => {
    try {

        const watchlistRes = await axios.get(
            VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/my_content`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        return watchlistRes.data.data.movie_bookmarks

    } catch (e) {
        toast.error(e.message)
        // console.error("get watchlist:", e.message)
    }
}

export const updateWatchlist = async (id, type, lengthWatchedInMs = 0, hideSnackBar) => {

    try {

        if (!id) return

        let url

        if (type === 'series') url = VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/bookmarks/episodes/${id}`
        if (type === 'movie') url = VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/bookmarks/movies/${id}/${id}`

        const updateWatchlistRes = await axios.put(
            url, {
            "time": lengthWatchedInMs,
            "name": id,
        },
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        if (hideSnackBar) return

        if (updateWatchlistRes.data.data.updated)
            toast.success("Added to watchlist")

    } catch (e) {
        toast.error(e.message)
        // console.error("update watchlist:", e.message)
    }
}

export const removeFromWatchlist = async (id, type) => {

    try {

        if (!id) return

        const removeFromWatchlistRes = await axios.delete(
            VOD_BASE_URL + `/api/client/v1/${operator_uid}/users/${user_id}/bookmarks/movies/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            }
        )

        if (removeFromWatchlistRes.data.data.affectedRows > 0)
            toast.success("Removed from watchlist")

    } catch (e) {
        toast.error(e.message)
        // console.error("remove from watchlist:", e.message)
    }
}
export const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
}

export const capitalizeString = (str) => {
    let str_ = str.toLowerCase()
    const str2 = str_.charAt(0).toUpperCase() + str_.slice(1);
    return str2.replaceAll("_", " ")
} 
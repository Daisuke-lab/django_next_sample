

interface Props {
    [key: string] : any
}

export const removeBlank = (data:Props) => {
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (data[key] === "" || data[key] === undefined) {
            data[key] = null
        }
    }
    return data
}
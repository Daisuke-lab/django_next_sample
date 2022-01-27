export const convertObjectToQuery = (object: { [key: string | number]: string | number | Date | Array<any> }) => {
    var query:string = "?"
    for (let i = 0; i < Object.keys(object).length; i++) {
        const key = Object.keys(object)[i]
        var value = object[key]
        if (value instanceof Date) {
            value = dateFormatter(value)
        }

        if (typeof value === "boolean") {
            value = value===true?"True":"False"
        }
        if (value instanceof Array) {
            var newValue = []
            for (let i = 0; i < value.length; i++) {
                var element = value[i]
                element = element===true?"True":element
                element = element===false?"False":element
                newValue.push(element)
              }
            value = newValue

        }
        query += `${key}=${value}&`
      }
    query = query.slice(0, query.length-1)
    return query
}


const dateFormatter = (datetime:Date) => {
    const date = new Date(datetime)
    const string_datetime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    return string_datetime
}
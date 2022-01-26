const dateFormatter = (datetime:Date) => {
    if (datetime === null || datetime === undefined) {
      return ""
    } else {
      const date = new Date(datetime)
      const string_datetime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
      return string_datetime
    }
    }
   
  export default dateFormatter
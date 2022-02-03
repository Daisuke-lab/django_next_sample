import { ConsoleLogger } from "@aws-amplify/core"

const formatter = (data:any) => {
  const newDate = new Date(data)
  var newData:any = data
  if ("Invalid Date" !== newDate.toString() && data !== null) {
    newData = dateFormatter(newDate)
  } else if (data instanceof Array) {
    newData = arrayFormatter(data)
  }
  return newData

}


const dateFormatter = (datetime:Date) => {
  console.log('you are on dateFromatter')
    if (datetime === null || datetime === undefined) {
      return ""
    } else {
      const date = new Date(datetime)
      const string_datetime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
      return string_datetime
    }
    }

const arrayFormatter = (data:Array<any>) => {
  var string_data = ""
  for (let i = 0; i < data.length; i++) {
    const element = data[i]
    string_data += element + ", "
  }
  string_data = string_data.slice(0, string_data.length-2)
  return string_data
}
   
  export default formatter
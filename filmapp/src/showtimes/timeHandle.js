
const timeHandle = (time, date) => {
    let day
    let timestamp
    if(date == null){
        const today = new Date()
        let dayNumber = today.getDate().toString()
        let month = (today.getMonth() + 1).toString()
        const year = today.getFullYear().toString()

        if (parseInt(dayNumber) < 10) {dayNumber = '0'+dayNumber}
        if (parseInt(month) < 10) {month = '0'+month}
        day = year+"-"+month+"-"+dayNumber
        timestamp=day +" "+time+"+02"
        return timestamp
      }else{
        const dateSplit=date.split(".")
        let dayNumber=dateSplit[0]
        let month=dateSplit[1]
        const year = dateSplit[2]
        if (parseInt(dayNumber) < 10) {dayNumber = '0'+dayNumber}
        if (parseInt(month) < 10) {month = '0'+month}
        day = year+"-"+month+"-"+dayNumber 
        timestamp=day+" "+time+"+02"
        return timestamp
      }
}

export {timeHandle}


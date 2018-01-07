class Util {
  constructor(){}
  normalizeDate(date) {
    let y= date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    return `${y}-${m < 10 ? "0" + m: m}-${d < 10 ? "0" + d: d}`
  }
  parseDateDesc(dateDesc) {
    let dateStr
    if(dateDesc == "today") {
      dateStr = util.normalizeDate(new Date())
    } else if (dateDesc == "yesterday") {
      dateStr = util.normalizeDate(new Date(Date.now() - 24 * 60 * 60 * 1000))
    } else {
      dateStr = dateDesc
    }
    return dateStr
  }
  normalizeFloat(number) {
    let n, i
    i = number.toString().indexOf(".") 
    if(i > -1) {
      n = number.toString().substr(0, i + 3)
      return parseFloat(n)
    } else {
      return number
    }
  }
  getRiserateLevel(rate) {
    let level
    if(rate > 80) {
      level = "higher"
    } else if(rate > 60) {
      level = "high"
    } else if(rate > 40) {
      level = "normal"
    } else if(rate > 20) {
      level = "low"
    } else {
      level = "lower"
    }
    return level
  }
  normalizeRiserate(riserate) {
    if(riserate < 0) {
      return "无课"
    }
    let n, i
    i = riserate.toString().indexOf(".") 
    if(i > -1) {
      n = riserate.toString().substr(0, i + 3)
      return parseFloat(n)
    } else {
      return riserate
    }
  }
  parseQueryString(query) {
    let obj = {}
    if(query.charAt(0) == "?") {
      query = query.substr(1)
    }
    let paramArray = query.split("&")
    let tempArray
    paramArray.forEach(function(item ,i) {
      tempArray = item.split("=")
      obj[tempArray[0]] = decodeURIComponent(tempArray[1])
    })
    return obj
  }
}

let util = new Util()

export default util
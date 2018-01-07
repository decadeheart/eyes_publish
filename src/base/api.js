let proxyMode = true

class Request {
  constructor({url, method="get", params, data=null}) {
    if(proxyMode) {
      url = "/api" + url
    }
    let queryString = ""
    let postData = null
    for (var key in params) {
      this[key] = params[key]
      queryString = queryString + encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&"
    }
    if(queryString != "") {
      queryString = queryString.substr(0, queryString.length - 1)
      if(url.indexOf("?") > -1) {
        url += `&${queryString}`
      } else {
        url += `?${queryString}`
      }
    }
    if(method.toLowerCase() == "post") {
      postData = new FormData()
      for(var key in data) {
        postData.append(key, data[key])
      }
    }
    let xhr = this.xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.onload = ()=> {
      if(xhr.status >= 200 && xhr.status < 300) {
        let json = JSON.parse(xhr.responseText)
        if(json.code == 200) {
          this.successCallback && this.successCallback(json)
        } else {
          this.errorCallback && this.errorCallback(json)
        }
      } else {
        this.failCallback && this.failCallback(xhr.status)
      }
    }
    xhr.send(postData)
  }
  onSuccess(callback) {
    if(this.successCallback) {
      throw "not support multiple callback to the same event"
    }
    this.successCallback = callback
    return this
  }
  onError(callback) {
    if(this.errorCallback) {
      throw "not support multiple callback to the same event"
    }
    this.errorCallback = callback
    return this
  }
  onFail(callback) {
    if(this.failCallback) {
      throw "not support multiple callback to the same event"
    }
    this.failCallback = callback
    return this
  }
}

class Api {
  constructor() {}
  getPeriodRiserate({date,classroomName,period}){
    return new Request({
      url: "/riseData",
      params:{
        date,
        classroomName,
        period
      }      
    })    
  }
  getHeatChartData({date,classroomName,period}){
    return new Request({
      url: "/hotMap",
      params:{
        date,
        classroomName,
        period
      }
    })
  }
}

let api = new Api()
export default api

import "../less/global.less"

import Vue from "vue"
import DetailPage from "../components/DetailPage.vue"
import echarts from "echarts/lib/echarts"
import "echarts/lib/chart/line"
import "echarts/lib/component/title"
import "echarts/lib/component/tooltip"

let app = new Vue({
  el: "#app",
  components: {
    "detail-page": DetailPage
  }
})

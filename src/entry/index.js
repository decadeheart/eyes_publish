import "../less/global.less"

import Vue from "vue"
import IndexPage from "../components/IndexPage.vue"
import echarts from "echarts/lib/echarts"
import "echarts/lib/chart/line"
import "echarts/lib/component/title"
import "echarts/lib/component/tooltip"

let app = new Vue({
  el: "#app",
  components: {
    "index-page": IndexPage
  }
})

<template lang="html">
  <div>
    <div class="loading-wrapper" v-if="loadingVisible">
      <div class="loader"></div>
    </div>
    <eye-header
    ></eye-header>
    <div class="main">
      <div class="inner">
        <div v-if="!error">
          <div class="classroom">
            <span>({{selectedDate}})</span>
            <span>某高校</span>
            <span>某号楼</span>
            <span>{{classroomName}}</span>
            <span>{{choosePeriod}}节课</span>
            <span>课程详情</span>
          </div>
          <div class="content-wrap">
            <div>
              <div class="real-time-wrap">
                <div class="title">课堂实景</div>
                <div class="loading-wrapper" v-if="pictureLoadingVisible">
                  <div class="loader"></div>
                </div>
                <img class="real-time-img"
                  v-if="pictureUrl != ''"
                  :src="pictureUrl"
                  @error="imgErrorHandler"
                  @load="pictureLoadedHandler"
                >
              </div>
              <div class="heat-chart-wrap">
                <div class="title">课堂注意力热力图</div>
                <div class="heat-chart"
                  ref="heat-chart"
                >
                </div>
                <!--<div class="bottom-tooltip" v-if="activePeriod">
                  <div class="">第{{(activePeriod.value + 1) * 2 - 1}}-{{(activePeriod.value + 1) * 2}}节课注意力热力图</div>
                </div>-->
              </div>
              <div class="clear-fix"></div>
            </div>
            <div>
              <div class="LineChart-container">
                <div class="loading-wrapper" v-if="chartLoadingVisible">
                  <div class="loader"></div>
                </div>
                <div class="LineChart"
                  ref="LineChart" id="LineChart"
                ></div>
                <div class="data">
                  <div class="head">
                    <div class="title">当前抬头人数</div>
                    <div class="content">{{riseCount}}</div>
                  </div>
                  <div class="rise">
                    <div class="title">当前到课人数</div>
                    <div class="content">{{totalCount}}</div>
                  </div>
                  <div class="time">
                    <div class="title">当前时间</div>
                    <div class="content">{{time}}</div>
                  </div>               
                </div>
              </div>
              <div class="clear-fix"></div>
            </div>
          </div>
        </div>
        <div class="other" v-else>
          该节课没有数据
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header.vue"
import echarts from "echarts/lib/echarts"
import HeatMap from "heatmap.js"
import G2 from "g2"

import "echarts/lib/chart/line"
import "echarts/lib/component/visualMap"
import "echarts/lib/component/title"
import "echarts/lib/component/tooltip"

import util from "../base/util"
import api from "../base/api"
import fakeData from "../base/fakeData"

import {getNoiseHelper} from "../base/noise.js"

let urlParams = util.parseQueryString(window.location.search)
let DetailPage = {
  components: {
    "eye-header": Header,
  },
  data() {
    let width = 50
    let height = parseInt(width * 1080 / 1920)
    return {
      classroomName: urlParams.classroomName,
      selectedDate: urlParams.date,
      classPeriod: urlParams.period,
      choosePeriod: "1-2",
      chartLoadingVisible: false,
      loadingVisible: false,// 是否显示页面loading遮罩
      pictureLoadingVisible: false,// 是否显示左上角图片的loading遮罩
      periods: [],// 当前教室, 当前日期, 所有上课时候的抬头情况
      lineChart: null,// 折线图的g2实例
      riseData: [],// 折线图的数据
      picUrlList: [],// 折线图数据对应的教室图片(一一对应)
      dataIndex: 0,// 点击折线图所选中的点, 在riseData数组中的index
      picturePrefix: "/files",// 图片前缀
      pictureUrl: "",// 左上角图片的url
      isFinished: false,
      heatChart: null,// 热力图实例
      heatChartWidth: width,// 生成热力图时, 图片横向栅格划分
      heatChartHeight: height,// 生成热力图时, 图片纵向栅格划分
      lineChartTimerId: null,// setTimeout返回的id, 控制折线图的定时更新
      heatMapTimerId: null,// setTimeout返回的id, 控制热力图的定时更新    
      time:"2017-04-25 08:00:00",
      riseCount:13,
      totalCount:100,
      error: null,
    }
  },
  mounted() {
    /*
      修改title
      渲染PeriodFilterPanel
    */
    let self = this
    switch(self.classPeriod) {
      case "0":
        self.choosePeriod = "1-2"
        break
      case "1":
        self.choosePeriod = "3-4"
        break
      case "2":
        self.choosePeriod = "5-6"
        break
      case "3":
        self.choosePeriod = "7-8"
        break 
      case "4":
        self.choosePeriod = "9-10"
        break 
      case "5":
        self.choosePeriod = "11-12"
        break                        
      default:
        self.choosePeriod = "error"
        break
    }
    self.renderHeatChart()
    setTimeout(self.renderLineChart(),3000)
  },
  methods: {
    initLineChart(data) {
      /*
        实例化G2组件
        绑定点击事件
      */
      let self = this
      function pick(dataP, field) {
        return dataP.map(item => {
          const result = {};
          for (const key in item) {
            if (item.hasOwnProperty(key) && field.indexOf(key) !== -1) {
              result[key] = item[key];
            }
          }
          return result;
        });
      }
      self.lineChart = new G2.Chart({
        id: 'LineChart',
        forceFit: true,
        height: 300
      })
      self.lineChart.legend({
        mode: false,
        position: 'top',
        dy: 5,
      });
      let scale = {
        time: {
          alias: '时间',
          mask: "HH:MM:ss"
        },
        riseRate: {
          alias: '抬头率'
        },
        totalCount: {
          alias: '到课人数',
          min: 0,
        },
      };
      const view1 = self.lineChart.createView();
      view1.source(pick(data, [ 'riseRate', 'time', 'totalCount' ]), scale);
      view1.line().position('time*riseRate').color('#4FAAEB').size(2);
      view1.line().position('time*totalCount').color('#9AD681').size(2);
      self.lineChart.render();
      self.lineChart.on('tooltipchange',function(ev){
        var item = ev.items[0]; // 获取tooltip要显示的内容
        item.value = item.value + '%';
      })
      self.lineChart.on("plotclick", function(ev) {
        var point = {
          x: ev.x,
          y: ev.y
        }
        var item = self.lineChart.getTooltipItems(point)[0]
        for(var i = 0; i < self.riseData.length + 1; i++){
          if(self.riseData[i].time.split(" ")[1] == item.title) {
            if(self.isFinished){
              let rencentdata = self.riseData[i]
              self.time = rencentdata.time
              self.riseCount = rencentdata.riseCount
              self.totalCount = rencentdata.totalCount
            }
            self.lineChartClickHandler(i)
            break
          }
        }
      })
    },
    lineChartClickHandler(dataIndex) {
      /*
        点击折线图时, 更新左上角的图片
      */
      if(dataIndex == this.dataIndex) return// fix bug: 左上角图片loading不消失
      this.dataIndex = dataIndex
      this.pictureUrl = this.picturePrefix + this.picUrlList[dataIndex]
      this.pictureLoadingVisible = true
      console.log("line chart click handler")
    },
    imgErrorHandler() {
      //图片加载出错时使用缺省图
      this.pictureUrl = "../imgs/error-img.jpg"
      this.pictureLoadingVisible = true
      console.warn("img error")
    },
    pictureLoadedHandler() {
      this.pictureLoadingVisible = false
      console.log("%c hide picture loading", "background-color: green; color: yellow;")
    },
    normalizeLineChartData(data) {
      /*
        将服务器返回的折线图数据进行格式化, 并找出value最大的点
        需要修改, 使G2组件适用
      */
      let result = []
      let maxValue = 0
      let index = 0
      data.forEach(function(item, i) {
        if(item.value > maxValue) {
          maxValue = item.value
          index = i
        }
        result.push([item.time, parseInt(item.value)])
      })
      return {array: result, index: index}
    },
    renderLineChart() {
      /*
        清除定时更新计时器
        向服务器请求拆线图数据并绘制拆线图
        该节课未结束时, 设置定时器定时更新
      */
      let self = this
      self.chartLoadingVisible = true
      clearTimeout(self.lineChartTimerId)
      api.getPeriodRiserate({
        date: self.selectedDate,
        classroomName: self.classroomName,
        period: self.classPeriod        
      })
      .onSuccess(function(resp) {
        self.chartLoadingVisible = false
        self.isFinished = resp.isFinished

        self.riseData = resp.riseData
        self.picUrlList = resp.picUrlList
        self.isFinished = resp.isFinished

        let rencentdata = self.riseData[self.riseData.length-1]
        self.time = rencentdata.time
        self.riseCount = rencentdata.riseCount
        self.totalCount = rencentdata.totalCount

        let data = resp.riseData

        self.initLineChart(data)
        
        if(!self.isFinished) {
          self.lineChartTimerId = setInterval(function(){
              self.$refs.LineChart.removeChild(self.$refs.LineChart.childNodes[0])
              self.renderLineChart()
          },3000)
          self.lineChartClickHandler(resp.riseData.length - 1)
        } else {
          self.lineChartClickHandler(resp.riseData.length - 1)
        }
      }).onFail(function(status) {

        self.chartLoadingVisible = false
        self.riseData = fakeData.getPeriodRiserate.riseData
        self.picUrlList = fakeData.getPeriodRiserate.picUrlList
        self.isFinished = fakeData.getPeriodRiserate.isFinished

        let rencentdata = self.riseData[self.riseData.length-1]
        self.time = rencentdata.time
        self.riseCount = rencentdata.riseCount
        self.totalCount = rencentdata.totalCount
        let data = self.riseData

        self.initLineChart(data)
      })
    },
    initHeatChart() {
      /*
        实例化热力图组件
      */
      this.heatChart = HeatMap.create({
        container: this.$refs["heat-chart"],
        radius: 20
      })
    },
    normalizeHeatChartData(coordinates, max) {
      /*
        将服务器返回的热力图信息进行格式化
        使其符合heatmap.js要求的数据格式
      */
      let containerWidth = 500
      let containerHeight = containerWidth / 1920 * 1080
      let xCount = coordinates.length
      if(xCount == 0) {
        return {
          max: 0,
          data: []
        }
      }
      let yCount = coordinates[0].length
      let cubeWidth = containerWidth/xCount
      let cubeHeight = containerHeight/yCount
      let points = []
      var coordinateX, coordinateY
      for(let x=0; x<xCount; x++) {
        for(let y=0; y<yCount; y++) {
          coordinateX = x * cubeWidth + cubeWidth / 2
          coordinateY = y * cubeHeight + cubeHeight / 2
          points.push({
            x: coordinateX,
            y: coordinateY,
            value: coordinates[x][y]
          })
        }
      }
      return {
        max: max,
        data: points
      }
    },
    renderHeatChart() {
      /*
        获取热力图数据, 并渲染
      */
      let self = this
      clearTimeout(self.heatMapTimerId)
      api.getHeatChartData({
        date: self.selectedDate,
        classroomName: self.classroomName,
        period: self.classPeriod   
      }).onSuccess(function(resp) {
        let data = self.normalizeHeatChartData(resp.coordinates, resp.max)
        self.error = resp.err
        if(self.heatChart) {
          /*self.heatChart.showLoading()*/
        } else {
          self.initHeatChart()
        }
        self.heatChart.setData(data)
        if(!resp.isFinished) {
          console.log("not finished yet")
          self.heatMapTimerId = setTimeout(function() {
            self.renderHeatChart()
          }, 5 * 60 * 1000)
        }
      }).onFail(function(status) {
        let resp = fakeData.getHeatChartData
        let data = self.normalizeHeatChartData(resp.coordinates, resp.max)
        self.error = fakeData.getHeatChartData.err
        if(self.heatChart) {
          /*self.heatChart.showLoading()*/
        } else {
          self.initHeatChart()
        }
        self.heatChart.setData(data)      
      })
    },    
  }
}

export default DetailPage
</script>

<style lang="less" scoped>
@import (reference)"../less/global";
.main {
  margin-top: 20px;
  .inner {
    width: @inner-width;
    margin: 0 auto;
    background-color: white;
    padding: 10px 10px;
    box-sizing: border-box;
    @picture-width: 500px;
    @picture-height: @picture-width / 1920 * 1080;
    .other{
      font-size:30px;
      font-weight:bold;
      text-align: center;
    }
    .classroom {      
      margin-bottom: 20px;
      text-align:center;
      span{
      font-weight: bold;
      font-size: 20px;
      }
    }
    .title {
      font-size: 18px;
      font-weight: bold;
    }
    .real-time-wrap {
      position: relative;
      float: left;
      .real-time-img {
        width: @picture-width;
        height: @picture-height;
        margin-top: 15px;
      }
    }
    .heat-chart-wrap {
      width: @picture-width;
      height: @picture-height;
      float: right;
      .heat-chart {
        height: 100%;
        margin-top: 15px;
        img{
          width:100%;
        }
      }
    }
    .LineChart-container {
      @heat-map-width: 500px;
      height: 300px;
      margin-top: 20px;
      padding-top: 10px;
      padding-bottom: 10px;
      position: relative;
      /*background-color: #ccc;*/
      .loading-wrapper{
        position: absolute;
      }
      .LineChart {
        height: 100%;
      }
      .data{
        float:right;
        .time{
          width: 200px;
          float:right;
          padding:20px;
          margin:10px;
          background:#f5f7f9;
          text-align:center;
          .title{
            font-size:20px;
          }
          .content{
            font-size:20px;
          }
        }
        .head{
          width: 200px;
          float:right;
          padding:20px;
          margin:10px;
          background:#f5f7f9;
          text-align:center;
          .title{
            font-size:20px;
          }
          .content{
            font-size:20px;
          }
        }
        .rise{
          width: 200px;
          float:right;
          padding:20px;
          margin:10px;
          background:#f5f7f9;
          text-align:center;
          .title{
            font-size:20px;
          }
          .content{
            font-size:20px;
          }
        }
      }
    }
    .hint {
      text-align: center;
      font-size: 16px;
      color: @color-hint;
    }
  }
}
</style>

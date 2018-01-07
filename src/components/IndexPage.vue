<template lang="html">
  <div>
    <div class="loading-wrapper" v-if="loadingVisible">
      <div class="loader"></div>
    </div>
    <eye-header
    ></eye-header>
    <div class="main">
      <div class="inner">
        <div class="real-wrap">
          <div class="loading-wrapper" v-if="pictureLoadingVisible">
            <div class="loader"></div>    
          </div>
          <div class="real-img">
              <img class="real-time-img"
                :src="realData.pictureUrl"
              >       
          </div>
          <div class="real-data">
            <div class="top">
              <div class="title">当前时间</div>
              <div class="number">{{realData.time}}</div>
            </div>
            <div class="bottom">
              <div class="title">当前抬头人数</div>
              <div class="number">{{realData.count}}</div>
            </div>
            <div class="clear-fix"></div>
            <div class="chart-wrap">
              <div class="loading-wrapper" v-if="chartLoadingVisible">
                <div class="loader"></div>    
              </div>            
              <div class="real-chart" id="LineChart"></div>
            </div>
          </div>        
        </div>
        <div class="clear-fix"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header.vue"
import echarts from "echarts/lib/echarts"
import Element from "element-ui"
import {DatePicker} from "element-ui"
import G2 from "g2"

import util from "../base/util"
import api from "../base/api"
import fakeData from "../base/fakeData"
import global from '../less/global.less'

let DetailPage = {
  components: {
    "eye-header": Header,
  },
  data() {
    return {
      loadingVisible: false,// 是否显示页面loading遮罩
      chartLoadingVisible: false,
      pictureLoadingVisible: false,// 是否显示左上角图片的loading遮罩
      riserate: [],// 折线图的数据
      realData: [],
      isFinished: false ,
      dataIndex: 0,// 点击折线图所选中的点, 在riserate数组中的index
      picturePrefix: "/files",// 图片前缀
      pictureUrl: "http://res.cloudinary.com/dyb29pfpm/image/upload/v1490269792/stock-photo-201884497_qyti3l.jpg",// 左上角图片的url
      lineChartTimerId: null,// setTimeout返回的id, 控制折线图的定时更新
    }
  },
  mounted() {
    /*
      初始化拆线图
      渲染拆线图
      渲染左上角的数据面板
    */
    let self = this
    setTimeout(self.renderLineChart(),3000)
    setTimeout(self.renderContent(),3000)
  },
  methods: {
    initLineChart(data) {
      /*
        实例化G2组件
        绑定点击事件
      */
      var chart = new G2.Chart({
        id: 'LineChart',
        forceFit: true,
        height: 300
      });
      chart.source(data, {
        time: {
          alias: '时间',
          mask: "HH:MM:ss"
        },
        head_count: {
          alias: '抬头人数',
          min: 0,
        }
      });
      chart.line().position('time*head_count').size(2);
      chart.render();
    },
    renderLineChart() {
      /*
        清除定时更新计时器
        向服务器请求拆线图数据并绘制拆线图
        该节课未结束时, 设置定时器定时更新
      */
      let self = this
      let dateStr = util.parseDateDesc(self.selectedDate)
      self.chartLoadingVisible = true
      clearTimeout(self.lineChartTimerId)
      api.getChartData()
      .onSuccess(function(resp) {
        self.chartLoadingVisible = false

        self.riserate = resp.riserate
        let data = resp.riserate

        self.initLineChart(data)
        if(!self.isFinished){
          self.lineChartTimerId = setInterval(function(){
              self.$refs.LineChart.removeChild(self.$refs.LineChart.childNodes[0])
              self.renderLineChart()
          },3000)
        }
      }).onFail(function(status) {
        self.chartLoadingVisible = false

        self.riserate = fakeData.getPeriodRiserate.riserate
        let data = self.riserate

        self.initLineChart(data)
      })
    },
    renderContent() {
      let self = this
      self.pictureLoadingVisible = true
      api.getRealData().onSuccess(function(resp){
        self.realData = resp.realDatas
        self.pictureLoadingVisible = false
      }).onFail(function(){
        self.realData = fakeData.getRealData.realDatas
        self.pictureLoadingVisible = false
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
    .real-wrap{
      position:relative;
      float:left;
      .real-img{
        float:left;
        width:500px;  
        img{
          width:100%;
        }    
      }
      .real-data{
        float:right;
        .chart-wrap{
          position:relative;
        }
        .top{
          width:200px;
          float:left;
          padding:20px;
          background:#f5f7f9;
          margin-left:30px;
          margin-bottom:30px;
          .title{
            font-size:20px;
          }
          .number{
            font-size:30px;
          }
        }
        .bottom{
          width:200px;
          float:left;
          padding:20px;
          background:#f5f7f9;
          margin-left:30px;
          .title{
            font-size:20px;
          }
          .number{
            font-size:30px;
          }
        }
      }
    }
  }
}
</style>

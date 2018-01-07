<template lang="html">
  <div class="header">
    <div class="header-main">
      <div class="inner">
        <div class="logo-wrap f-left">
          <a class="block" href="#">
            <img class="logo inline" src="../imgs/logo.png"/>
            <div class="product-name inline">慧眼</div>
            <div class="padding inline"></div>
            <div class="product-desc inline">智慧教室行为感知系统</div>
          </a>
        </div>
      </div>
    </div>
    <div class="header-sub">
      <div class="inner">
        <ul>       
          <li class="icon"><a href="./detail.html" class="item">课程详情</a></li>       
        </ul>    
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue"

import Element from "element-ui"
import {DatePicker} from "element-ui"
Vue.use(Element)

let Header = {
  props: ["defaultDate", "disableToday"],
  data() {
    return {    
      icons: [
        {
          src: "../imgs/icon-home.png",
          text: "主页"
        },
        {
          src: "../imgs/icon-setting.png",
          text: "设置"
        },
        {
          src: "../imgs/icon-account.png",
          text: "帐号"
        }
      ]
    }
  }
}
export default Header
</script>

<style lang="less" scoped>
@import (reference) "../less/global";

@theme-hover: #eee;
@theme-blue-hover: #349bdc;
.f-left {
  float: left;
}
.f-right {
  float: right;
}
.inline {
  display: inline;
}
.block {
  display: block;
}
a {
  text-decoration: none;
}
.inner {
  width: 1100px;
  margin: 0 auto;
}
.header-main {
  background-color: white;
  border-bottom: 1px solid #f1f1f1;
  .inner {
    .logo-wrap {
      margin-top: 5px;
      display: block;
      &>a {
        padding: 5px 10px;
      }
      .logo {
        width: 34px;
        /*height: 40px;*/
        vertical-align: bottom;
      }
      .product-name {
        line-height: 1.2;
        color: @theme-blue;
        font-size: 26px;
        vertical-align: text-bottom;
        margin-left: 5px;
      }
      .padding {
        width: 2px;
        height: 26px;
        background-color: #ccc;
        display: inline-block;
        margin: 0 3px;
        vertical-align: -4px;
      }
      .product-desc {
        font-size: 20px;
        vertical-align: text-bottom;
      }
    }
    .icons-wrap {
      .icon {
        text-align: center;
        position: relative;
        .popup-menu {
          display: none;
          position: absolute;
          width: 130px;
          top: 98%;
          left: 0;
          background-color: white;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
          .item {
            text-align: left;
            line-height: 36px;
            padding: 0 10px;
            &:hover {
              background: @theme-hover;
            }
          }
        }
        &:hover {
          background-color: @theme-hover;
          .popup-menu {
            display: block;
          }
        }
        &>a {
          padding: 10px 10px;
        }
        .icon-pic {
          width: 26px;
          height: 26px;
        }
        .icon-text {
          line-height: 1.1;
        }
      }
      .icon + .icon {
        margin-left: 12px;
      }
    }
    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }
}
.header-sub {
  background-color: @theme-yellow;
  height:30px;
  .inner {
    .icon{
      text-align: center;
      position: relative;
      display: inline-block;
      .popup-menu{
        display:block;
        position:absolute;
      }
      a{
        padding: 0 8px;
        display: block;
        color: white;
        font-weight: bold;
        line-height: 30px;
      }
      a:hover{
        background-color: #fff;
        color: @theme-yellow;
        cursor: pointer;
      }
    }
  }
}
</style>
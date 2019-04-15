import Vue from 'vue'
import * as d3 from 'd3'
import d3Tip from "d3-tip";

d3.tip = d3Tip;
Vue.set(Vue.prototype, 'd3', d3);
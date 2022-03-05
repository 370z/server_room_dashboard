import Vue from 'vue'

if (process.browser) {
  const mqtt = require('vue-mqttsocket').default;
  Vue.use(mqtt, {uri: 'ws://itdev.cmtc.ac.th:2003/mqtt'});
}
export default {
  SET_TEMP(state, data) {
    console.log(data);
    state.temp = data;
  },
  SET_HUMI(state, data) {
    console.log(data);
    state.humi = data;
  },
  SET_NOTIFY_SETTING(state, data) {
    state.notify_setting = data;
  },
};

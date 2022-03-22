import axios from 'axios'
export default {
  setDrawer({ commit }, drawer) {
    commit("SET_DRAWER", drawer);
  },
  setImage({ commit }, image) {
    commit("SET_IMAGE", image);
  },
  setColor({ commit }, color) {
    commit("SET_COLOR", color);
  },
  async retrieveLineData({ commit }) {
    await axios
      .get("http://itdev.cmtc.ac.th:2002/api/v1/userData")
      .then((response) => {
        commit("SET_LINE_TOKEN", response.data[0].line_token);
        commit("SET_TEMP_NOTIFY_VALUE", response.data[0].notify_setting);
        // console.log(response.data[0]);
      });
  },
};

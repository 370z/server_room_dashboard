export default {
  async setNotify({ commit }, user) {
    await this.$axios
      .get("http://localhost:8080/api/v1/notifySetting")
      .then((res) => {
        commit(
          "SET_NOTIFY_SETTING",
          res.data.notify_setting
        );
      });
  },
};

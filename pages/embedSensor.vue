<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout wrap>
      <v-flex sm6 xs12 md6 lg4>
        <material-stats-card
          color="green"
          icon="mdi-thermometer"
          title="Temperature"
          :value="getTemp"
          small-value="C"
          sub-icon="mdi-calendar"
          sub-text="Realtime Temperature"
        />
      </v-flex>
      <v-flex sm6 xs12 md6 lg4>
        <material-stats-card
          color="orange"
          icon="mdi-water-percent"
          title="Humidity"
          :value="getHumi"
          small-value="%"
          sub-icon="mdi-calendar"
          sub-text="Realtime Humidity"
        />
      </v-flex>
      <v-flex sm6 xs12 md6 lg4>
        <material-stats-card
          color="red"
          icon="mdi-information-outline"
          title="Server Room Temp"
          :value="serverStatusHandler"
          sub-icon="mdi-tag"
          sub-text="Tracked from AM2315"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import materialCard from "~/components/material/AppCard";
import materialChartCard from "~/components/material/AppChartCard";
import materialStatsCard from "~/components/material/AppStatsCard";
import mqtt from "mqtt";
import { mapGetters } from "vuex";
import mqttMixin from "~/mixins/mqtt-mixin";
export default {
  //   layout: "dashboard",
  // middleware: "authentication",
  mixins: [mqttMixin],
  components: {
    materialCard,
    materialChartCard,
    materialStatsCard,
  },
  computed: {
    serverStatusHandler() {
      if (this.getTemp > 0 && this.getTemp <= this.getNotifySetting) {
        return "Normal";
      } else if (this.getTemp > this.getNotifySetting) {
        return "High Temp";
      } else {
        return "Sensor not working";
      }
    },
  },
  methods: {},
  async created() {
    try {
      this.$axios
        .get("http://itdev.cmtc.ac.th:2002/api/v1/notifySetting")
        .then((res) => {
          this.$store.commit(
            "sensor/SET_NOTIFY_SETTING",
            res.data.notify_setting
          );
        });
    } catch (error) {}
  },
};
</script>
<style scoped>
.line_token_field {
  width: 300px;
}
</style>
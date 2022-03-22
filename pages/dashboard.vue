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

      <v-flex md12 lg12>
        <material-card color="orange" title="History Every 1 Hour">
          <v-data-table :headers="headers" :items="items">
            <template slot="headerCell" slot-scope="{ header }">
              <span
                class="font-weight-light text-warning text--darken-3"
                v-text="header.text"
              />
            </template>
            <template slot="items" slot-scope="{ index, item }">
              <td>{{ index + 1 }}</td>
              <td class="text-xs-center">{{ item.temp }}</td>
              <td class="text-xs-center">{{ item.humi }}</td>
              <td class="text-xs-center">{{ item.createdAt }}</td>
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import materialCard from "~/components/material/AppCard";
import materialChartCard from "~/components/material/AppChartCard";
import materialStatsCard from "~/components/material/AppStatsCard";
import mqttMixin from "~/mixins/mqtt-mixin";
export default {
  middleware: ["auth"],
  layout: "dashboard",
  mixins: [mqttMixin],
  // middleware: "authentication",
  components: {
    materialCard,
    materialChartCard,
    materialStatsCard,
  },
  data() {
    return {
      tempNotifyValue: this.$auth.$state.user.notify_setting,
      headers: [
        {
          sortable: false,
          text: "ID",
          value: "id",
        },
        {
          sortable: false,
          text: "Temperature",
          value: "temp",
          align: "center",
        },
        {
          sortable: false,
          text: "Humidity",
          value: "humi",
          align: "center",
        },
        {
          sortable: false,
          text: "Reading Time",
          value: "createdAt",
          align: "center",
        },
      ],
      items: [],
      tabs: 0,
      list: {
        0: false,
        1: false,
        2: false,
      },
    };
  },
  watch:{

  },
  computed: {
    serverStatusHandler() {
      if (
        this.getTemp > 0 &&
        this.getTemp <= this.getNotifySetting
      ) {
        return "Normal";
      } else if (this.getTemp > this.getNotifySetting) {
        return "High Temp";
      } else {
        return "Sensor not working";
      }
    },
  },
  methods: {
    async retrieveData() {
      await this.$axios
        .$get("http://itdev.cmtc.ac.th:2002/api/v1/sensorData")
        .then((response) => {
          this.items = response.map(this.getDisplayData);
          console.log(response);
        });
    },
    myDateFormat(d) {
      return (
        d.getFullYear() +
        "/" +
        ("0" + d.getDate()).slice(-2) +
        "/" +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        "/" +
        ("0" + d.getHours()).slice(-2) +
        ":" +
        ("0" + d.getMinutes()).slice(-2)
      );
    },
    getDisplayData(data) {
      return {
        id: data.id,
        temp: data.temp,
        humi: data.humi,
        createdAt: this.myDateFormat(new Date(data.createdAt)),
      };
    },
    complete(index) {
      this.list[index] = !this.list[index];
    },
  },
  async mounted() {
    await this.retrieveData();
  },
};
</script>
<style scoped>
.line_token_field {
  width: 300px;
}
</style>

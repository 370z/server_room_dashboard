<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout wrap>
      <v-flex sm6 xs12 md6 lg3>
        <material-stats-card
          color="green"
          icon="mdi-thermometer"
          title="Temperature"
          :value="receiveNews.temp"
          small-value="C"
          sub-icon="mdi-calendar"
          sub-text="Realtime Temperature"
        />
      </v-flex>
      <v-flex sm6 xs12 md6 lg3>
        <material-stats-card
          color="orange"
          icon="mdi-water-percent"
          title="Humidity"
          :value="receiveNews.humi"
          small-value="%"
          sub-icon="mdi-calendar"
          sub-text="Realtime Humidity"
        />
      </v-flex>
      <v-flex sm6 xs12 md6 lg3>
        <material-stats-card
          color="red"
          icon="mdi-information-outline"
          title="Server Room Temp"
          :value="serverStatusHandler"
          sub-icon="mdi-tag"
          sub-text="Tracked from AM2315"
        />
      </v-flex>
      <v-flex sm6 xs12 md6 lg3>
        <v-card>
          <v-card-text>
            Line Token: {{ line_token }}
            <form @submit.prevent="updateLineToken()" class="d-flex">
              <v-text-field
                type="text"
                placeholder="Enter Line Token"
                outlined
                clearable
                v-model="line_token"
              ></v-text-field>
              <v-btn type="submit" color="green"> Submit </v-btn>
            </form>
            Temp Notify Setting: {{ tempNotifyValue }}
            <v-slider
              v-model="tempNotifyValue"
              max="50"
              step="0.1"
              thumb-label
              ticks
            ></v-slider>
          </v-card-text>
        </v-card>
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
              <td>{{ item.temp }}</td>
              <td class="text-xs-right">{{ item.humi }}</td>
              <td class="text-xs-right">{{ item.createdAt }}</td>
              <td class="text-xs-right">{{ item.city }}</td>
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
import mqtt from "mqtt";
export default {
  layout: "dashboard",
  // middleware: "authentication",
  components: {
    materialCard,
    materialChartCard,
    materialStatsCard,
  },
  data() {
    return {
      tempNotifyValue: 30.0,
      line_token: "",
      receiveNews: { temp: "0", humi: "0" },
      connection: {
        host: "itdev.cmtc.ac.th",
        port: 2003,
        endpoint: "/ws",
        clean: true, // Reserved session
        connectTimeout: 4000, // Time out
        reconnectPeriod: 4000, // Reconnection interval
        // Certification Information
        clientId: "mqttjs_3be2c321",
        username: "admin",
        password: "admin",
      },
      subscription: {
        topic1: "temp",
        topic2: "humi",
        qos: 0,
      },
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
  watch: {
    async tempNotifyValue(value) {
      await this.$axios
        .$put("http://localhost:8080/api/v1/updateNotify/1", {
          notify_setting: value,
        })
        .then((response) => {
          console.log(response);
        });
      console.log(value);
    },
  },
  computed: {
    serverStatusHandler() {
      if (this.receiveNews.temp > 0 && this.receiveNews.temp <= 35.0) {
        return "Normal";
      } else if (this.receiveNews.temp > 35.1) {
        return "High Temp";
      } else {
        return "Sensor not working";
      }
    },
  },
  methods: {
    async updateLineToken() {
      await this.$axios
        .$put("http://localhost:8080/api/v1/updateToken/1", {
          line_token: this.line_token,
        })
        .then((response) => {
          console.log(response);
        });
    },
    async retrieveLineData() {
      await this.$axios
        .$get("http://localhost:8080/api/v1/userData")
        .then((response) => {
          this.line_token = response[0].line_token;
          this.tempNotifyValue = response[0].notify_setting;
          console.log(response);
        });
    },
    async retrieveData() {
      await this.$axios
        .$get("http://localhost:8080/api/v1/sensorData")
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
    await this.retrieveLineData();
    const { topic1, topic2, qos } = this.subscription;
    const { host, port, endpoint, ...options } = this.connection;
    const connectUrl = `ws://${host}:${port}${endpoint}`;
    try {
      this.client = mqtt.connect(connectUrl, options);
    } catch (error) {
      console.log("mqtt.connect error", error);
    }
    this.client.on("connect", () => {
      //console.log("Connection succeeded!");
    });
    this.client.subscribe(topic1, { qos }, (error, res) => {
      if (error) {
        console.log("Subscribe to topics error", error);
        return;
      }
      this.subscribeSuccess = true;
      console.log("Subscribe to topics res", res);
    });
    this.client.subscribe(topic2, { qos }, (error, res) => {
      if (error) {
        console.log("Subscribe to topics error", error);
        return;
      }
      this.subscribeSuccess = true;
      console.log("Subscribe to topics res", res);
    });
    this.client.on("error", (error) => {
      console.log("Connection failed", error);
    });
    this.client.on("message", (topic, message) => {
      if (topic === this.subscription.topic1) {
        this.receiveNews.temp = message.toString();
      } else if (topic === this.subscription.topic2) {
        this.receiveNews.humi = message.toString();
      }
      // this.receiveNews = this.receiveNews.concat(message);
      // console.log(`Received message ${message} from topic ${topic}`);
    });

    this.$nextTick(() => {
      /*this.dailySalesChart.options = {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        };
        this.dataCompletedTasksChart.options = {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        };*/
    });
  },
};
</script>
<style scoped>
.line_token_field {
  width: 300px;
}
</style>

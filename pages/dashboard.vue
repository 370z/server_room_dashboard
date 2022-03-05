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
          sub-text="Last 24 Hours"
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
          sub-text="Last 24 Hours"
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

      <v-flex md12 lg6>
        <material-card color="orange" title="History">
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
      <v-flex md12 lg6>
        <material-card class="card-tabs" color="green">
          <v-flex slot="header">
            <v-tabs v-model="tabs" color="transparent" slider-color="white">
              <span
                class="subheading font-weight-light mr-3"
                style="align-self: center"
                >Tasks:</span
              >
              <v-tab class="mr-3">
                <v-icon class="mr-2">mdi-bug</v-icon>
                Bugs
              </v-tab>
              <v-tab class="mr-3">
                <v-icon class="mr-2">mdi-code-tags</v-icon>
                Website
              </v-tab>
              <v-tab>
                <v-icon class="mr-2">mdi-cloud</v-icon>
                Server
              </v-tab>
            </v-tabs>
          </v-flex>

          <v-tabs-items v-model="tabs">
            <v-tab-item v-for="n in 3" :key="n">
              <v-list three-line>
                <v-list-tile @click="complete(0)">
                  <v-list-tile-action>
                    <v-checkbox :value="list[0]" color="green" />
                  </v-list-tile-action>
                  <v-list-tile-title>
                    Sign contract for "What are conference organized afraid of?"
                  </v-list-tile-title>
                  <div class="d-flex">
                    <v-tooltip top content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="success"
                        icon
                      >
                        <v-icon color="primary">mdi-pencil</v-icon>
                      </v-btn>
                      <span>Edit</span>
                    </v-tooltip>
                    <v-tooltip top content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="danger"
                        icon
                      >
                        <v-icon color="error">mdi-close</v-icon>
                      </v-btn>
                      <span>Close</span>
                    </v-tooltip>
                  </div>
                </v-list-tile>
                <v-divider />
                <v-list-tile @click="complete(1)">
                  <v-list-tile-action>
                    <v-checkbox :value="list[1]" color="success" />
                  </v-list-tile-action>
                  <v-list-tile-title>
                    Lines From Great Russian Literature? Or E-mails From My
                    Boss?
                  </v-list-tile-title>
                  <div class="d-flex">
                    <v-tooltip top content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="success"
                        icon
                      >
                        <v-icon color="primary">mdi-pencil</v-icon>
                      </v-btn>
                      <span>Edit</span>
                    </v-tooltip>

                    <v-tooltip top content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="danger"
                        icon
                      >
                        <v-icon color="error">mdi-close</v-icon>
                      </v-btn>
                      <span>Close</span>
                    </v-tooltip>
                  </div>
                </v-list-tile>
                <v-divider />
                <v-list-tile @click="complete(2)">
                  <v-list-tile-action>
                    <v-checkbox :value="list[2]" color="success" />
                  </v-list-tile-action>
                  <v-list-tile-title>
                    Flooded: One year later, assessing what was lost and what
                    was found when a ravaging rain swept through metro Detroit
                  </v-list-tile-title>
                  <div class="d-flex">
                    <v-tooltip top content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="success"
                        icon
                      >
                        <v-icon color="primary">mdi-pencil</v-icon>
                      </v-btn>
                      <span>Edit</span>
                    </v-tooltip>
                    <v-tooltip top content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="danger"
                        icon
                      >
                        <v-icon color="error">mdi-close</v-icon>
                      </v-btn>
                      <span>Close</span>
                    </v-tooltip>
                  </div>
                </v-list-tile>
              </v-list>
            </v-tab-item>
          </v-tabs-items>
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
      dailySalesChart: {
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          series: [[12, 17, 7, 17, 23, 18, 38]],
        },
        options: {
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },
      dataCompletedTasksChart: {
        data: {
          labels: ["12am", "3pm", "6pm", "9pm", "12pm", "3am", "6am", "9am"],
          series: [[230, 750, 450, 300, 280, 240, 200, 190]],
        },
        options: {
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },
      emailsSubscriptionChart: {
        data: {
          labels: [
            "Ja",
            "Fe",
            "Ma",
            "Ap",
            "Mai",
            "Ju",
            "Jul",
            "Au",
            "Se",
            "Oc",
            "No",
            "De",
          ],
          series: [
            [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
          ],
        },
        options: {
          axisX: {
            showGrid: false,
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0,
          },
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0];
                },
              },
            },
          ],
        ],
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
  computed: {
    serverStatusHandler() {
      if (this.receiveNews.temp > 0 && this.receiveNews.temp <= 30.0) {
        return "Normal";
      } else if (this.receiveNews.temp > 30.1) {
        return "High Temp";
      } else {
        return "Sensor not working";
      }
    },
  },
  methods: {
    async retrieveData() {
      await this.$axios
        .$get("http://localhost:8080/sensorData")
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

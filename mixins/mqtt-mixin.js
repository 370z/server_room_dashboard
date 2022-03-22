import mqtt from "mqtt";
import {mapGetters} from "vuex";
export default {
  data() {
    return {
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
    };
  },
  computed:{
    ...mapGetters({getTemp:'sensor/getTemp', getHumi:'sensor/getHumi', getNotifySetting:'sensor/getNotifySetting'}),
  },
  async mounted() {
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
     this.client.on("message",async (topic, message) => {
      if (topic === this.subscription.topic1) {
        await this.$store.commit("sensor/SET_TEMP", message.toString());
        await this.client.end()
        // this.receiveNews.temp = message.toString();
      }
      if (topic === this.subscription.topic2) {
       await this.$store.commit("sensor/SET_HUMI", message.toString());
        await this.client.end()
        // this.receiveNews.humi = message.toString();
      }
      // this.receiveNews = this.receiveNews.concat(message);
      // console.log(`Received message ${message} from topic ${topic}`);
    });



  },
};

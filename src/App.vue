<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue';
import 'leaflet/dist/leaflet.css';
import ApiService from "src/service/api.service";
import StorageService from "src/service/storage.service";

export default defineComponent({
  name: 'App',
  methods: {
    sendMessageTelegram() {
      let tg = {
        token: "7091504581:AAHJBiaS85VDTNGWIVyZSixi_4RLe-cCHFM", // Your bot's token that got from @BotFather
        chat_id: 1994816040 // The user's(that you want to send a message) telegram chat id
      }
      const url = `https://api.telegram.org/bot${tg.token}/sendMessage?chat_id=${tg.chat_id}&text=Hello`; // The url to request
      const xht = new XMLHttpRequest();
      xht.open("GET", url);
      xht.send();
    }
  },
  beforeMount() {
    // @ts-ignore
    ApiService.init(process.env.MAIN_API_URL);
    ApiService.mount401Interceptor();
    if (StorageService.getToken()) {
      ApiService.setHeader();
    } else {
      ApiService.removeHeader();
    }
    const theme = StorageService.getTheme();
    this.dark = !(theme && theme === 'false');
    this.$q.dark.set(this.dark)
  }
})
</script>

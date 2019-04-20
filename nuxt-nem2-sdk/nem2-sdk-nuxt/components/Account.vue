<template>
  <div style="margin-top: 2rem;">
    <button @click="listenConfirmed" class="button--grey">confirmed</button>
    <pre style="text-align: left; font-size: xx-small;">{{ JSON.stringify(confirmed, null, "\t") }}</pre>
  </div>
</template>
<script>
import { Address, Listener } from 'nem2-sdk'

export default {
  name: 'Account',
  data() {
    return {
      confirmed: []
    }
  },
  methods: {
    listenConfirmed() {
      const endpoint = 'http://13.114.200.132:3000';
      const listener = new Listener(endpoint);
      // const wsEndpoint = endpoint.replace('http', 'ws');
      // const listener = new Listener(wsEndpoint, WebSocket);
      const address = Address.createFromRawAddress('SCA7ZS-2B7DEE-BGU3TH-SILYHC-RUR32Y-YE55ZB-LYA2');
      listener.open().then(() => {
        listener.confirmed(address).subscribe((x) => {
          this.confirmed.push(x)
        })
      });
    }
  }
}
</script>
<style>
</style>

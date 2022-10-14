import {createApp, h, provide} from 'vue'
import App from './App.vue'
import router from './router'
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import {DefaultApolloClient, provideApolloClient} from "@vue/apollo-composable";

import './assets/main.css'

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://beta.pokeapi.co/graphql/v1beta'
})


const app = createApp({
  setup() {
    provideApolloClient(apolloClient)
  },
  render: () => h(App)
})

app.use(router)

app.mount('#app')

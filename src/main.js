import {createApp, h} from 'vue'
import App from './App.vue'
import router from './router'
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import {provideApolloClient} from "@vue/apollo-composable";

import './assets/main.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faChevronDown)

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

app.component('font-awesome-icon', FontAwesomeIcon).mount('#app')

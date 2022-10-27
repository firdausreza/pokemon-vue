import { createRouter, createWebHistory } from 'vue-router';
import Pokedex from "../views/Pokedex.vue";
import PokeDetail from "../views/PokeDetail.vue";
import PageNotFound from "@/views/PageNotFound.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/pokedex'
    },
    {
      path: '/pokedex',
      name: 'pokedex',
      component: Pokedex
    },
    {
      path: '/pokedex/:name',
      name: 'pokemon-details',
      component: PokeDetail
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'page-not-found',
      component: PageNotFound
    },
  ]
})

export default router

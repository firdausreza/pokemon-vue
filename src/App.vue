<script setup>
import { RouterLink, RouterView } from 'vue-router'

let windowWidth = window.innerWidth
document.addEventListener('resize', () => {
  windowWidth = window.innerWidth
  console.log(windowWidth)
})
</script>

<template>
  <header class="w-full bg-green-600 text-white">
    <nav class="max-w-7xl flex items-center justify-between mx-auto p-4">
      <router-link to="/" class="text-2xl font-bold">PokePedia!</router-link>
      <ul class="w-max flex items-center">
        <li class="mr-5">
          <router-link :to="{ name: 'pokedex' }">Pokedex</router-link>
        </li>
        <li class="mr-5">
          <router-link to="#">Berrypedia</router-link>
        </li>
        <li>
          <router-link to="#">Lokapedia</router-link>
        </li>
      </ul>
    </nav>
  </header>

  <RouterView />
</template>


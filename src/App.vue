<script setup>
import { RouterLink, RouterView } from 'vue-router'

let windowWidth = window.innerWidth
document.addEventListener('resize', () => {
  windowWidth = window.innerWidth
})
</script>

<template>
  <header class="w-full bg-green-600 text-white">
    <nav class="max-w-7xl flex items-center justify-between mx-auto p-4">
      <a href="/" class="text-2xl font-bold">PokePedia!</a>
      <ul class="w-max flex items-center">
        <li class="mr-5">
          <a href="/pokedex">Pokedex</a>
        </li>
        <li class="mr-5">
          <a href="/berrypedia">Berrypedia</a>
        </li>
        <li>
          <a href="/lokapedia">Lokapedia</a>
        </li>
      </ul>
    </nav>
  </header>

  <RouterView />
</template>


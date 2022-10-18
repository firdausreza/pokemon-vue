<template>
  <article class="bg-white rounded-md shadow-md p-3 flex flex-col items-center">
    <h1 class="text-sm text-gray-400 text-left w-full">#{{ pokemon.id }}</h1>
    <img :src="pokemon.official_art" :alt="pokemon.name" class="w-full mt-2">
    <h2 class="text-xl font-bold mt-2 capitalize">
      {{ pokemon.name }}
    </h2>
    <div class="flex flex-wrap items-center justify-center">
      <h3 v-show="pokemon.legendary" class="text-sm bg-amber-400 px-3 py-1 text-white rounded-full mr-1 mt-2">
        Legendary
      </h3>
      <h3 v-show="pokemon.mythical" class="text-sm bg-indigo-400 px-3 py-1 text-white rounded-full mr-1 mt-2">
        Mythical
      </h3>
      <h3 v-for="type in pokemon.details" class="text-sm capitalize px-3 py-1 text-white rounded-full mr-1 mt-2" :class="typeColorMatch[type]">
        {{ type }}
      </h3>
    </div>
  </article>
</template>

<script>
export default {
  name: "Pokecard",
  props: {
    pokemon: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      typeColorMatch: {
        grass: 'bg-green-500',
        water: 'bg-blue-500',
        fire: 'bg-orange-500',
        electric: 'bg-yellow-400',
        normal: 'bg-stone-300',
        ice: 'bg-cyan-400',
        dark: 'bg-black',
        fighting: 'bg-red-700',
        fairy: 'bg-rose-300',
        psychic: 'bg-pink-300',
        ghost: 'bg-indigo-800',
        bug: 'bg-lime-600',
        flying: 'bg-gray-500',
        steel: 'bg-slate-400',
        dragon: 'bg-indigo-600',
        ground: 'bg-yellow-800',
        poison: 'bg-purple-600',
        rock: 'bg-amber-800'
      }
    }
  }
}
</script>

<style scoped>

</style>
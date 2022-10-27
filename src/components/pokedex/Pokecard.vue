<template>
  <router-link :to="{ name: 'pokemon-details', params: { name: pokemon.name } }" class="relative bg-white rounded-md shadow-md p-3 flex flex-col justify-start cursor-pointer hover:border hover:border-green-500">
    <h3 v-show="pokemon.legendary" class="w-max absolute top-0 left-0 shadow-md text-xs bg-amber-400 px-1.5 py-1 text-white rounded-r-full mr-1 mt-2">
      Legendary
    </h3>
    <h3 v-show="pokemon.mythical" class="w-max absolute top-0 left-0 shadow-md text-xs bg-indigo-400 px-1.5 py-1 text-white rounded-r-full mr-1 mt-2">
      Mythical
    </h3>
    <img :src="pokemon.official_art" :alt="pokemon.name" class="w-full">
    <h1 class="text-sm text-gray-400 text-left w-full">{{ $dexnumber(pokemon.id) }}</h1>
    <h2 class="text-xl font-bold mt-2 capitalize text-left w-full">
      {{ pokemon.name }}
    </h2>
    <div class="w-full flex flex-wrap items-center justify-start">
      <type-label v-for="type in pokemon.details" :poke-type="type" text-size="text-xs" :class="typeColorMatch[type]" class="mr-1 mt-2" />
    </div>
  </router-link>
</template>

<script>
import TypeLabel from "../TypeLabel.vue";
export default {
  name: "Pokecard",
  components: {
    TypeLabel
  },
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
  },
  computed: {
    pokedexNumber() {
      if (this.pokemon.id && this.pokemon.id < 10) {
        return `#00${this.pokemon.id}`
      } else if (this.pokemon.id && this.pokemon.id < 100) {
        return `#0${this.pokemon.id}`
      } else {
        return `#${this.pokemon.id}`
      }
    }
  }
}
</script>

<style scoped>

</style>

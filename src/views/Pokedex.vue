<template>
  <main>
    <section class="max-w-7xl mx-auto px-4 pt-8">
      <h1 class="text-4xl text-center">
        Welcome to <span class="font-bold text-green-500">PokePedia!</span>
      </h1>
      <article class="w-full flex flex-col lg:flex-row lg:items-start pt-12">
        <section id="filters" class="w-full lg:w-[30%] flex flex-col justify-start p-4 border shadow-lg rounded-lg">
          <h2 class="text-xl font-bold">Filter pokedex here</h2>
          <div class="w-full flex flex-col pt-4">
            <div @click="toggleTypeFilter = !toggleTypeFilter" class="w-full flex items-center justify-between border-b border-gray-400 pb-2 cursor-pointer">
              <h3 class="text-md w-max">Pokemon type:</h3>
              <font-awesome-icon icon="fa-solid fa-chevron-down" class="fa-1x transition duration-350 ease-in-out" :class="toggleTypeFilter ? 'rotate-180' : ''" />
            </div>
            <div
                v-show="toggleTypeFilter"
                class="w-full flex flex-wrap items-start pt-2 text-white font-semibold transition-all"
            >
              <div v-for="typeFilter in typeFilterOptions" class="px-4 py-2 flex items-center rounded-full mt-2 mr-2 text-sm" :class="typeFilter.color">
                <input v-model="typeFilter.selected" type="checkbox" :id="typeFilter.label" />
                <label :for="typeFilter.label" class="ml-2">{{ typeFilter.label }}</label>
              </div>
            </div>
          </div>
          <div class="w-full flex flex-col pt-4">
            <h3 class="text-md">Generation:</h3>
            <select v-model="generationSelected" id="generation-select" class="p-2 mt-2 bg-transparent border border-gray-400 rounded-lg focus:outline-none cursor-pointer">
              <option value="generation-i">Generation 1</option>
              <option value="generation-ii">Generation 2</option>
              <option value="generation-iii">Generation 3</option>
              <option value="generation-iv">Generation 4</option>
              <option value="generation-iv">Generation 5</option>
              <option value="generation-vi">Generation 6</option>
              <option value="generation-vii">Generation 7</option>
              <option value="generation-viii">Generation 8</option>
            </select>
          </div>
          <div class="w-full flex flex-col pt-4">
            <h3 class="text-md">Region:</h3>
            <select v-model="regionSelected" id="region-select" class="p-2 mt-2 bg-transparent border border-gray-400 rounded-lg focus:outline-none cursor-pointer">
              <option value="kanto">Kanto</option>
              <option value="johto">Johto</option>
              <option value="hoenn">Hoenn</option>
              <option value="sinnoh">Sinnoh</option>
              <option value="unova">Unova</option>
              <option value="kalos">Kalos</option>
              <option value="alola">Alola</option>
              <option value="galar">Galar</option>
            </select>
          </div>
        </section>
      </article>
    </section>
  </main>
</template>

<script>
import gql from 'graphql-tag';
import { useQuery } from '@vue/apollo-composable';

const GET_POKEMONS_QUERY = gql`
  query getPokemons($offset: Int) {
    pokemon: pokemon_v2_pokemonspecies(limit: 20, offset: $offset, order_by: {id: asc}) {
      name
      id
      evolution_chain_id
      forms_switchable
      is_legendary
      is_mythical
      gen_region: pokemon_v2_generation {
        name
        region: pokemon_v2_region {
          name
        }
      }
    }
  }
`

export default {
  name: "Homepage",
  data() {
    return {
      pokemons: null,
      currentOffset: 0,
      toggleTypeFilter: false,
      toggleGenFilter: false,
      generationSelected: 'generation-i',
      regionSelected: 'kanto',
      typeFilterOptions: [
        {
          label: 'Grass',
          color: 'bg-green-500',
          selected: false
        },
        {
          label: 'Water',
          color: 'bg-blue-500',
          selected: false
        },
        {
          label: 'Fire',
          color: 'bg-red-600',
          selected: false
        },
        {
          label: 'Electric',
          color: 'bg-yellow-400',
          selected: false
        },
        {
          label: 'Normal',
          color: 'bg-stone-300',
          selected: false
        },
        {
          label: 'Ice',
          color: 'bg-cyan-400',
          selected: false
        },
        {
          label: 'Dark',
          color: 'bg-black',
          selected: false
        },
        {
          label: 'Fighting',
          color: 'bg-orange-500',
          selected: false
        },
        {
          label: 'Fairy',
          color: 'bg-rose-400',
          selected: false
        },
        {
          label: 'Psychic',
          color: 'bg-rose-600',
          selected: false
        },
        {
          label: 'Ghost',
          color: 'bg-indigo-800',
          selected: false
        },
        {
          label: 'Bug',
          color: 'bg-lime-600',
          selected: false
        },
        {
          label: 'Flying',
          color: 'bg-gray-500',
          selected: false
        },
        {
          label: 'Steel',
          color: 'bg-slate-400',
          selected: false
        },
        {
          label: 'Dragon',
          color: 'bg-indigo-600',
          selected: false
        },
        {
          label: 'Ground',
          color: 'bg-yellow-800',
          selected: false
        },
        {
          label: 'Poison',
          color: 'bg-purple-600',
          selected: false
        },
        {
          label: 'Rock',
          color: 'bg-amber-800',
          selected: false
        },
      ]
    }
  },
  mounted() {
    this.getPokemons()
  },
  methods: {
    getPokemons() {
      const {result} = useQuery(GET_POKEMONS_QUERY, () => ({
        offset: this.currentOffset
      }))
      this.pokemons = result
    },
    addOffset() {
      this.currentOffset += 20
    }
  }
}
</script>

<style>
option {
  border: none;
  outline: none;
}
</style>
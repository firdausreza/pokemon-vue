<template>
  <main>
    <section class="max-w-7xl mx-auto px-4 pt-8">
      <h1 class="text-4xl text-center">
        Welcome to <span class="font-bold text-green-500">PokePedia!</span>
      </h1>
      <article class="w-full flex flex-col lg:flex-row lg:items-start pt-12">
        <!-- Filter Card -->
        <section id="filters" class="w-full lg:w-[30%] flex flex-col justify-start p-4 border shadow-lg rounded-lg bg-white">
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
              <div v-for="typeFilter in filter.type" class="px-4 py-2 flex items-center rounded-full mt-2 mr-2 text-sm" :class="typeFilter.color">
                <input v-model="typeFilter.selected" type="checkbox" :id="typeFilter.label" />
                <label :for="typeFilter.label" class="ml-2">{{ typeFilter.label.toUpperCase() }}</label>
              </div>
            </div>
          </div>
          <div class="w-full flex flex-col pt-4">
            <h3 class="text-md">Pokemon rarity:</h3>
            <select v-model="filter.rarity" id="rarity-select" class="p-2 mt-2 bg-transparent border border-gray-400 rounded-lg focus:outline-none cursor-pointer">
              <option value="all-rarity">All Rarity</option>
              <option value="common">Common</option>
              <option value="legendary">Legendary</option>
              <option value="mythical">Mythical</option>
            </select>
          </div>
          <div class="w-full flex flex-col pt-4">
            <h3 class="text-md">Generation:</h3>
            <select v-model="filter.generation" id="generation-select" class="p-2 mt-2 bg-transparent border border-gray-400 rounded-lg focus:outline-none cursor-pointer">
              <option value="all-generation">All Generation</option>
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
            <select v-model="filter.region" id="region-select" class="p-2 mt-2 bg-transparent border border-gray-400 rounded-lg focus:outline-none cursor-pointer">
              <option value="all-region">All Region</option>
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
          <div class="w-full flex items-center">
            <button @click="applyFilter" class="bg-blue-400 rounded-md mt-4 text-white py-2 w-full mr-2">
              Apply Filter
            </button>
            <button class="bg-red-400 rounded-md mt-4 text-white py-2 w-full">
              Reset
            </button>
          </div>
        </section>

        <!-- Pokedex section -->
        <section class="w-full lg:w-[60%] flex flex-col justify-start px-4">
          <h1 class="text-xl font-bold">
            Use below search field to get pokemons by <span class="text-green-500">name</span>
          </h1>
          <h2 class="font-bold mt-2">
            or, you can use advanced search with provided <span class="text-green-500">filter card</span>.
          </h2>
          <input
            type="text"
            id="name-search"
            class="w-full p-2 rounded-md focus:outline-none border-2 border-green-500 mt-2 text-md"
            placeholder="Search pokemon by name...">
        </section>
      </article>
    </section>
  </main>
</template>

<script>
import gql from 'graphql-tag';
import {useQuery} from '@vue/apollo-composable';

const GET_POKEMONS_QUERY = gql`
  query getPokemons {
    pokemon: pokemon_v2_pokemonspecies(order_by: {id: asc}) {
      name
      id
      evolution_chain_id
      forms_switchable
      legendary: is_legendary
      mythical: is_mythical
      generations: pokemon_v2_generation {
        name
        region: pokemon_v2_region {
          name
        }
      }
      details: pokemon_v2_pokemons {
        types: pokemon_v2_pokemontypes {
          type: pokemon_v2_type {
            name
          }
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
      filteredPokemons: null,
      currentOffset: 0,
      nextOffset: 20,
      disableNextButton: false,
      disablePrevButton: false,
      toggleTypeFilter: false,
      isFiltered: false,
      filter: {
        rarity: 'all-rarity',
        generation: 'all-generation',
        region: 'all-region',
        type: [
          {
            label: 'grass',
            color: 'bg-green-500',
            selected: false
          },
          {
            label: 'water',
            color: 'bg-blue-500',
            selected: false
          },
          {
            label: 'fire',
            color: 'bg-red-600',
            selected: false
          },
          {
            label: 'electric',
            color: 'bg-yellow-400',
            selected: false
          },
          {
            label: 'normal',
            color: 'bg-stone-300',
            selected: false
          },
          {
            label: 'ice',
            color: 'bg-cyan-400',
            selected: false
          },
          {
            label: 'dark',
            color: 'bg-black',
            selected: false
          },
          {
            label: 'fighting',
            color: 'bg-orange-500',
            selected: false
          },
          {
            label: 'fairy',
            color: 'bg-rose-400',
            selected: false
          },
          {
            label: 'psychic',
            color: 'bg-rose-600',
            selected: false
          },
          {
            label: 'ghost',
            color: 'bg-indigo-800',
            selected: false
          },
          {
            label: 'bug',
            color: 'bg-lime-600',
            selected: false
          },
          {
            label: 'flying',
            color: 'bg-gray-500',
            selected: false
          },
          {
            label: 'steel',
            color: 'bg-slate-400',
            selected: false
          },
          {
            label: 'dragon',
            color: 'bg-indigo-600',
            selected: false
          },
          {
            label: 'ground',
            color: 'bg-yellow-800',
            selected: false
          },
          {
            label: 'poison',
            color: 'bg-purple-600',
            selected: false
          },
          {
            label: 'rock',
            color: 'bg-amber-800',
            selected: false
          },
        ]
      }
    }
  },
  mounted() {
    this.getPokemons()
  },
  methods: {
    getPokemons() {
      const { onResult } = useQuery(GET_POKEMONS_QUERY)

      onResult((result) => {
        this.pokemons = result.data.pokemon.map((item) => {
          return {
            ...item,
            types: item.details[0].types.map((item) => item.type.name),
            official_art: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`
          }
        })
      })
    },
    addOffset() {
      if (this.currentOffset >= 0 && this.nextOffset <= this.pokemons.length) {
        this.currentOffset += 20
        this.nextOffset += 20
        if (this.currentOffset + 20 > this.pokemons.length && this.nextOffset >= this.pokemons.length) {
          this.disableNextButton = true
        }
        if (this.disablePrevButton) {
          this.disablePrevButton = false
        }
      }
    },
    reduceOffset() {
      if (this.currentOffset !== 0) {
        this.currentOffset -= 20
        this.nextOffset -= 20
        if (this.currentOffset - 20 < 0) {
          this.disablePrevButton = true
        }
        if (this.disableNextButton) {
          this.disableNextButton = false
        }
      }
    },
    applyFilter() {
      this.currentOffset = 0
      this.nextOffset = 20
      this.isFiltered = true
      let typeFiltered = (this.filter.type.filter((item) => item.selected) || []).map(item => item.label)

      this.filteredPokemons = this.pokemons.map((item) => {
        return {
          ...item,
          official_art: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`
        }
      }).filter((item) => {
        if (!this.filter.rarity.includes('all')) {
          return item.legendary === (this.filter.rarity === 'legendary') && item.mythical === (this.filter.rarity === 'mythical')
        }
      }).filter((item) => {
        if (!this.filter.generation.includes('all')) {
          return item.generations.name === this.filter.generation
        }
      }).filter((item) => {
        if (!this.filter.region.includes('all')) {
          return item.generations.region.name === this.filter.region
        }
      }).slice(this.currentOffset, this.nextOffset)

      // this.filteredPokemons = this.pokemons.map((item) => {
      //   return {
      //     ...item,
      //     official_art: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`
      //   }
      // }).filter((item) => {
      //   if (!this.filter.generation.includes('all') && !this.filter.region.includes('all')) { // check if generation and region are filtered
      //     return item.legendary === (this.filter.rarity === 'legendary')
      //         && item.mythical === (this.filter.rarity === 'mythical')
      //         && item.generations.name === this.filter.generation
      //         && item.generations.region.name === this.filter.region
      //   } else if (this.filter.generation.includes('all') && !this.filter.region.includes('all')) { // check if generation is not filtered and region is filtered
      //     return item.legendary === (this.filter.rarity === 'legendary')
      //         && item.mythical === (this.filter.rarity === 'mythical')
      //         && item.generations.region.name === this.filter.region
      //   } else if (!this.filter.generation.includes('all') && this.filter.region.includes('all')) { // check if generation is filtered and region is not
      //     return item.legendary === (this.filter.rarity === 'legendary')
      //         && item.mythical === (this.filter.rarity === 'mythical')
      //         && item.generations.name === this.filter.generation
      //   } else { // if both are not filtered
      //     return item.legendary === (this.filter.rarity === 'legendary')
      //         && item.mythical === (this.filter.rarity === 'mythical')
      //   }
      // }).slice(this.currentOffset, this.nextOffset)
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

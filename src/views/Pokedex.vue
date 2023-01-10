<template>
  <main class="py-12">
    <section class="max-w-7xl mx-auto px-4">
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
                <label :for="typeFilter.label" class="ml-2 capitalize">{{ typeFilter.label }}</label>
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
            <button @click="resetFilter" class="bg-red-400 rounded-md mt-4 text-white py-2 w-full">
              Reset
            </button>
          </div>
        </section>
        <!-- Pokedex section -->
        <section class="w-full lg:w-[70%] flex flex-col justify-start px-5 mt-8 lg:mt-0">
          <h1 class="text-xl font-bold">
            Use below search field to get pokemons by <span class="text-green-500">name</span>
          </h1>
          <h2 class="font-bold mt-2">
            or, you can use advanced search with provided <span class="text-green-500">filter contents</span>.
          </h2>
          <div class="flex border-2 border-green-500 mt-2 text-md w-full rounded-md">
            <input
              v-model="nameSearch"
              type="text"
              id="name-search"
              class="flex-1 p-2 focus:outline-none border-none rounded-l-md "
              placeholder="Search pokemon by name...">
            <button @click="handleOnNameSearch" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white outline-none border-none">
              Search
            </button>
          </div>
          <h3 class="mt-2 text-sm">
            Current filters:
            <span v-if="isFiltered" v-for="(text, index) in appliedFilter" class="font-bold capitalize">
              {{ index === (appliedFilter.length-1) ? text : `${text}, ` }}
            </span>
          </h3>
          <h4 v-show="!isLoadingPokemons" class="text-sm text-gray-400 mt-4">
            Showing
            <span v-if="this.currentPokemonsArray === 'pokemons'">
              <template v-if="this.pokemons && this.pokemons.length === 0">
                0 of 0 collection
              </template>
              <template v-else>
                {{ this.currentOffset+1 }} - {{ this.nextOffset > (this.pokemons && this.pokemons.length) ? this.pokemons && this.pokemons.length : this.nextOffset }}
                of {{ this.pokemons && this.pokemons.length }} collections
              </template>
            </span>
            <span v-else-if="this.currentPokemonsArray === 'filtered'">
              <template v-if="this.filteredPokemons && this.filteredPokemons.length === 0">
                0 of 0 collection
              </template>
              <template v-else>
                {{ this.currentOffset+1 }} - {{ this.nextOffset > (this.filteredPokemons && this.filteredPokemons.length) ? this.filteredPokemons && this.filteredPokemons.length : this.nextOffset }}
                of {{ this.filteredPokemons && this.filteredPokemons.length }} collections
              </template>
            </span>
            <span v-else>
              <template v-if="this.searchedPokemons && this.searchedPokemons.length === 0">
                0 of 0 collection
              </template>
              <template v-else>
                {{ this.currentOffset+1 }} - {{ this.nextOffset > (this.searchedPokemons && this.searchedPokemons.length) ? this.searchedPokemons && this.searchedPokemons.length : this.nextOffset }}
                of {{ this.searchedPokemons && this.searchedPokemons.length }} collections
              </template>
            </span>
          </h4>
          <div v-show="searchPrompt" class="w-full flex items-center justify-between text-lg mt-4">
            <h1>
              Search results for <span class="font-bold text-green-500">'{{ this.nameSearch }}'</span>
            </h1>
            <button @click="clearResults" class="bg-red-500 text-white text-sm px-3 py-1 rounded-md">
              Clear
            </button>
          </div>
          <section v-if="!isLoadingPokemons" class="w-full py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <poke-card v-if="isFiltered && !searchPrompt" v-for="pokemon in (filteredPokemons || []).slice(currentOffset, nextOffset)" :key="pokemon.id" :pokemon="pokemon" />
            <poke-card v-else-if="(isFiltered || !isFiltered) && searchPrompt" v-for="pokemon in (searchedPokemons || []).slice(currentOffset, nextOffset)" :key="pokemon.id" :pokemon="pokemon" />
            <poke-card v-else v-for="pokemon in (pokemons || []).slice(currentOffset, nextOffset)" :key="pokemon.id" :pokemon="pokemon" />
          </section>
          <section v-else class="w-full py-24 flex items-center justify-center">
            <img src="https://raw.githubusercontent.com/firdausreza/vue-todo-lists/master/src/assets/load.svg" alt="loading" class="w-[100px] h-[100px] animate-spin">
          </section>
          <section v-show="!isLoadingPokemons" id="pagination" class="w-full flex items-center justify-center">
            <button
              @click="reduceOffset"
              class="px-4 py-2"
              :disabled="disablePrevBtn"
            >
              <font-awesome-icon icon="fa-solid fa-chevron-left" :class="disablePrevBtn ? 'text-gray-400' : 'text-black'" />
            </button>
            <h5 class="mx-3 text-sm">{{ this.page.currentPage }} of {{ this.page.totalPage }}</h5>
            <button
              @click="addOffset"
              class="px-4 py-2"
              :disabled="disableNextBtn"
            >
              <font-awesome-icon icon="fa-solid fa-chevron-right" :class="disableNextBtn ? 'text-gray-400' : 'text-black'" />
            </button>
          </section>
        </section>
      </article>
    </section>
  </main>
</template>

<script>
import gql from 'graphql-tag';
import {useQuery} from '@vue/apollo-composable';
import Pokecard from "../components/pokedex/Pokecard.vue";

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
  components: {
    'poke-card': Pokecard
  },
  data() {
    return {
      appliedFilter: null,
      pokemons: null,
      filteredPokemons: null,
      searchedPokemons: null,
      currentOffset: 0,
      nextOffset: 20,
      disableNextButton: false,
      disablePrevButton: true,
      toggleTypeFilter: false,
      isFiltered: false,
      isLoadingPokemons: true,
      searchPrompt: false,
      currentPokemonsArray: '',
      nameSearch: '',
      page: {
        currentPage: 1,
        totalPage: 0
      },
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
            color: 'bg-orange-500',
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
            color: 'bg-red-700',
            selected: false
          },
          {
            label: 'fairy',
            color: 'bg-rose-300',
            selected: false
          },
          {
            label: 'psychic',
            color: 'bg-pink-300',
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
  computed: {
    typeFiltered() {
      return (this.filter.type.filter((item) => item.selected) || []).map(item => item.label)
    },
    disableNextBtn() {
      return this.page.currentPage === this.page.totalPage;
    },
    disablePrevBtn() {
      return (this.page.currentPage - 1) === 0
    }
  },
  created() {
    this.getPokemons()

    // G-tag
    this.$gtag.pageview('/pokedex')
  },
  watch: {
    currentPokemonsArray(newVal) {
      if (newVal === 'pokemons') {
        this.page.currentPage = 1
        this.page.totalPage = Math.ceil(this.pokemons.length/20)
      } else if (newVal === 'filtered') {
        this.page.currentPage = 1
        this.page.totalPage = Math.ceil(this.filteredPokemons.length/20)
      } else if (newVal.includes('search')) {
        this.page.currentPage = 1
        if (this.searchedPokemons.length === 0) this.page.totalPage = 1
        else this.page.totalPage = Math.ceil(this.searchedPokemons.length/20)
      }
    }
  },
  methods: {
    getPokemons() {
      const { onResult } = useQuery(GET_POKEMONS_QUERY)

      onResult((result) => {
        this.pokemons = result.data.pokemon.map((item) => {
          return {
            ...item,
            details: item.details[0].types.map((item) => item.type.name),
            official_art: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`
          }
        })
        this.currentPokemonsArray = 'pokemons'
        this.isLoadingPokemons = false
      })
    },
    addOffset() {
      if (!this.disableNextButton) {
        this.isLoadingPokemons = true
        this.currentOffset = this.nextOffset
        this.nextOffset += 20
        this.page.currentPage++
        setTimeout(() => {
          this.isLoadingPokemons = false
        }, 1500)
      }
    },
    reduceOffset() {
      if (!this.disablePrevButton) {
        this.isLoadingPokemons = true
        this.nextOffset = this.currentOffset
        this.currentOffset -= 20
        this.page.currentPage--
        setTimeout(() => {
          this.isLoadingPokemons = false
        }, 1500)
      }
    },
    applyFilter() {
      this.page.currentPage = 1
      this.nameSearch = ''
      this.searchPrompt = false
      this.isLoadingPokemons = true
      this.currentPokemonsArray = 'filtered'
      this.currentOffset = 0
      this.nextOffset = 20
      this.isFiltered = true
      this.appliedFilter = [...this.typeFiltered, this.filter.rarity, this.filter.generation, this.filter.region]

      this.filteredPokemons = (this.pokemons || []).filter((poke) => { // filter by rarity
        if (!this.filter.rarity.includes('all') || this.filter.rarity !== 'common') {
          if (this.filter.rarity === 'legendary') return poke.legendary === true
          else if (this.filter.rarity === 'mythical') return poke.mythical === true
        } return poke
      }).filter((poke) => { // filter by generations
        if (!this.filter.generation.includes('all')) return poke.generations.name.toLowerCase() === this.filter.generation.toLowerCase()
        else return poke
      }).filter((poke) => { // filter by region
        if (!this.filter.region.includes('all')) return poke.generations.region.name.toLowerCase() === this.filter.region.toLowerCase()
        else return poke
      }).filter((poke) => { // filter by type
        if (this.typeFiltered && this.typeFiltered.length > 1) {
          if (poke.details.length > 1) {
            return poke.details.every((type) => this.typeFiltered.includes(type))
          }
        }
        else if (this.typeFiltered && this.typeFiltered.length === 1) return poke.details.some((type) => this.typeFiltered.includes(type))
        else return poke
      }).sort((a, b) => a.id - b.id)

      this.page.totalPage = Math.ceil(this.filteredPokemons.length/20)

      setTimeout(() => {
        this.isLoadingPokemons = false
      }, 2500)
    },
    resetFilter() {
      this.nameSearch = ''
      this.searchPrompt = false
      this.isLoadingPokemons = true
      this.isFiltered = false
      this.currentPokemonsArray = 'pokemons'
      this.filteredPokemons = []
      this.appliedFilter = []
      this.currentOffset = 0
      this.nextOffset = 20
      this.page.currentPage = 1
      this.page.totalPage = Math.ceil(this.pokemons.length/20)
      this.filter.rarity = 'all-rarity'
      this.filter.generation = 'all-generation'
      this.filter.region = 'all-region'
      this.filter.type.forEach((item) => {
        if (item.selected) item.selected = false
      })
      setTimeout(() => {
        this.isLoadingPokemons = false
      }, 2000)
    },
    handleOnNameSearch() {
      if (this.nameSearch !== '') {
        this.isLoadingPokemons = true
        this.searchPrompt = true
        if (this.isFiltered) {
          this.page.currentPage = 1
          this.currentOffset = 0
          this.nextOffset = 20
          this.currentPokemonsArray = 'filtered-search'
          this.searchPrompt = true
          this.searchedPokemons = this.filteredPokemons.filter((poke) => {
            return poke.name.includes(this.nameSearch.toLowerCase())
          }).sort((a, b) => a.id - b.id)
        } else {
          this.page.currentPage = 1
          this.currentOffset = 0
          this.nextOffset = 20
          this.currentPokemonsArray = 'pokemons-search'
          this.searchPrompt = true
          this.searchedPokemons = this.pokemons.filter((poke) => {
            return poke.name.includes(this.nameSearch.toLowerCase())
          }).sort((a, b) => a.id - b.id)
        }
        setTimeout(() => {
          this.isLoadingPokemons = false
        }, 2000)
      }
    },
    clearResults() {
      this.currentOffset = 0
      this.nextOffset = 20
      this.isLoadingPokemons = true
      this.searchPrompt = false
      this.nameSearch = ''
      this.searchedPokemons = null
      if (this.isFiltered) {
        this.currentPokemonsArray = 'filtered'
        this.page.currentPage = 1
        this.page.totalPage = Math.ceil(this.filteredPokemons.length/20)
      } else {
        this.currentPokemonsArray = 'pokemons'
        this.page.currentPage = 1
        this.page.totalPage = Math.ceil(this.pokemons.length/20)
      }
      setTimeout(() => {
        this.isLoadingPokemons = false
      }, 2000)
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

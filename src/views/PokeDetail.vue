<template>
  <main class="py-12">
    <section v-if="!isLoadingPage && !errorState" class="max-w-7xl mx-auto px-4 py-8">
      <article v-show="(currentFormData && true)" id="detail" class="w-full flex flex-col md:flex-row items-center md:items-start justify-center">
        <section class="max-w-[400px] max-h-[400px] flex flex-col items-center">
          <div class="w-full bg-stone-200 rounded-lg p-6">
            <img :src="(currentFormData || {}).image" :alt="(currentFormData || {}).name" class="w-full">
          </div>
          <select v-model="formSelected" id="form-select" class="w-full p-2 mt-4 border border-gray-400 rounded-lg focus:outline-none cursor-pointer capitalize">
            <option v-for="form in forms" :value="form.name" :key="form.name" class="capitalize">
              {{ form.form_name + ' ' + pokemon.name }}
            </option>
          </select>
        </section>
        <section class="w-full md:w-[50%] flex flex-col items-start mt-6 md:mt-0 md:px-6">
          <p class="text-lg text-gray-400">{{ $dexnumber(pokemon_id) }}</p>
          <h1 class="text-4xl font-bold capitalize mt-4">
            {{ pokemon.name }}
          </h1>
          <div class="w-full flex items-center justify-start mt-4">
            <type-label
              v-for="type in (currentFormData || []).types"
              :key="type"
              :poke-type="type"
              text-size="text-md"
              :class="typeColorMatch[type]"
              class="mr-2"
            />
          </div>
          <h2 class="text-lg mt-4 font-light">{{ description }}</h2>
          <section
            id="detail-card"
            class="relative w-full h-[250px] px-6 py-4 flex items-start bg-blue-500 rounded-lg text-lg text-white mt-4"
            :class="showAbility ? 'z-0' : 'z-10'"
          >
            <div class="w-[50%] flex flex-col justify-start">
              <div class="w-full flex flex-col justify-start">
                <h3>Height:</h3>
                <p class="mt-1 font-bold" v-html="generatedHeight"></p>
              </div>
              <div class="w-full flex flex-col justify-start mt-2">
                <h3>Weight:</h3>
                <p class="mt-1 font-bold">{{ generatedWeight }} <span class="text-sm">lbs</span></p>
              </div>
              <div class="w-full flex flex-col justify-start mt-2">
                <h3>Gender:</h3>
                <span v-if="pokemon.gender_rate === 1" class="mt-1">
                  <font-awesome-icon icon="fa-solid fa-venus" class="fa-xl mr-2" />
                  <font-awesome-icon icon="fa-solid fa-mars" class="fa-xl" />
                </span>
                <p v-else class="mt-1 font-bold">None/Genderless</p>
              </div>
            </div>
            <div class="w-[50%] flex flex-col justify-start">
              <h3>Ability:</h3>
              <ul class="list-disc">
                <li v-for="ability in (currentFormData || {}).abilities" class="mt-2 font-bold capitalize ml-[1.5rem]">
                  {{ ability.name }}
                  <font-awesome-icon
                    icon="fa-regular fa-circle-question"
                    class="fa-lg ml-2 cursor-pointer"
                    @click="showAbilityInfo(ability.name)"
                  />
                </li>
              </ul>
            </div>
            <section
              class="absolute top-0 left-0 w-full h-[250px] flex flex-col justify-start bg-zinc-700 rounded-lg text-white transition-opacity"
              :class="showAbility ? 'opacity-100 z-10' : 'opacity-0 -z-10'"
            >
              <div class="w-full flex items-center justify-between pl-6">
                <h1 class="text-lg">Ability info:</h1>
                <button @click="showAbility = false" class="text-sm px-4 py-4 rounded-bl-lg rounded-r-lg bg-zinc-900 flex items-center">
                  <font-awesome-icon icon="fa-solid fa-xmark" class="fa-lg mr-2" />
                  close
                </button>
              </div>
              <div class="w-full px-6 py-5">
                <p class="text-md">
                  {{ abilityInfo }}
                </p>
              </div>
            </section>
          </section>
        </section>
      </article>
    </section>
    <section v-else-if="!isLoadingPage && errorState">
      <h1>There was an unexpected error, please come again.</h1>
    </section>
  </main>
</template>

<script>
import gql from 'graphql-tag';
import {useQuery} from '@vue/apollo-composable';
import TypeLabel from "../components/TypeLabel.vue";

export default {
  name: "PokeDetail",
  components: {
    TypeLabel
  },
  data() {
    return {
      errorState: false,
      isLoadingPage: true,
      pokemon: null,
      pokemon_id: 0,
      description: null,
      forms: null,
      formSelected: '',
      games: null,
      showAbility: false,
      abilityInfoSelected: '',
      abilityInfo: '',
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
  created() {
    this.getPokemon()
  },
  computed: {
    currentFormData() {
      if (this.formSelected !== '') {
        let pokemon = {
          ...(this.pokemon || []).detail?.filter((poke) => poke.name.toLowerCase() === this.formSelected)[0]
        }
        pokemon.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.forms.pokemon_id}.png`
        return pokemon
      }
    },
    generatedNames() {

    },
    generatedHeight() {
      let inches = ((((this.currentFormData || {}).height || 0) * 10) * 0.393700787).toFixed(0)
      const feet = Math.floor(inches / 12)
      inches %= 12
      return `${feet} <span class="text-sm">ft</span> ${inches} <span class="text-sm">in</span>`
    },
    generatedWeight() {
      return Math.round((((this.currentFormData || {}).weight || 0) / 4.536) * 100) / 100
    },
    generateAbilityInfo() {
      if (this.abilityInfoSelected !== '') {
        return ((this.currentFormData || {}).abilities.filter((abl) => abl.name === this.abilityInfoSelected)[0].desc[0]?.effect || '')
      }
    }
  },
  watch: {
    abilityInfoSelected(newVal) {
      if (newVal !== '') {
        this.abilityInfo = ((this.currentFormData || {}).abilities.filter((abl) => abl.name === newVal)[0].desc[0]?.effect || '')
      }
    }
  },
  methods: {
    getPokemon() {
      const { onResult, onError } = useQuery(gql`
        query getPokemonDetail {
          pokemon: pokemon_v2_pokemonspecies(where: {name: {_in: ${this.$route.params.name}}}) {
            name
            id
            legendary: is_legendary
            mythical: is_mythical
            gender_rate
            gen_region: pokemon_v2_generation {
              name
              region: pokemon_v2_region {
                name
              }
              games: pokemon_v2_versiongroups {
                ver: pokemon_v2_versions {
                  name
                }
              }
            }
            detail: pokemon_v2_pokemons {
              name
              weight
              height
              abilities: pokemon_v2_pokemonabilities {
                ability: pokemon_v2_ability {
                  name
                  desc: pokemon_v2_abilityeffecttexts(where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
                    effect
                    short_effect
                  }
                }
              }
              types: pokemon_v2_pokemontypes {
                type: pokemon_v2_type {
                  name
                }
              }
              forms: pokemon_v2_pokemonforms {
                pokemon_id
                name
                form_name
              }
              stats: pokemon_v2_pokemonstats {
                base: base_stat
                name: pokemon_v2_stat {
                  name
                }
              }
            }
            evolution: pokemon_v2_evolutionchain {
              species: pokemon_v2_pokemonspecies {
                name
                id
              }
            }
          }
        }
      `)

      onResult(async (result) => {
        const pokemonObj = result.data.pokemon[0]
        this.pokemon = {
          ...pokemonObj,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonObj.id}.png`,
          gen_region: {
            ...pokemonObj.gen_region,
            games: pokemonObj.gen_region.games.map((game) => ({ ver: game.ver.map((item) => item.name)}))
          },
          detail: pokemonObj.detail.map((item) => {
            return {
              ...item,
              abilities: item.abilities.map((ab) => ab.ability),
              stats: item.stats.map((stat) => ({...stat, name: stat.name.name})),
              types: item.types.map((type) => type.type.name),
              forms: item.forms[0]
            }
          }),
          evolution: pokemonObj.evolution.species.map((item) => ({ ...item, image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png` }))
        }
        this.pokemon_id = this.pokemon.id
        this.games = this.pokemon.gen_region.games
        this.isLoadingPage = false
        await this.getDescriptions()
        await this.getForms()
      })

      onError((err) => {
        console.log(err)
        this.errorState = true
      })
    },
    getDescriptions() {
      const { onResult, onError } = useQuery(gql`
        query getDescriptions {
          desc: pokemon_v2_pokemonspeciesflavortext(where: {pokemon_v2_language: {name: {_eq: "en"}}, pokemon_species_id: {_eq: ${this.pokemon_id}}}) {
            text: flavor_text
            ver: pokemon_v2_version {
              name
            }
          }
        }
      `)

      onResult((result) => {
        this.description = result.data.desc[0].text.replaceAll('\n', ' ').replaceAll('\f', ' ')
      })

      onError((err) => {
        console.log(err)
        this.errorState = true
      })
    },
    getForms() {
      const { onResult, onError } = useQuery(gql`
        query getForms {
          forms: pokemon_v2_pokemon(where: {pokemon_species_id: {_eq: ${this.pokemon_id}}}) {
            form: pokemon_v2_pokemonforms {
              pokemon_id
              name
              form_name
            }
          }
        }
      `)

      onResult((res) => {
        const forms = res.data.forms
        this.forms = forms.map((form) => form.form[0])
        this.formSelected = this.forms && this.forms[0].name
      })

      onError((err) => {
        console.log(err)
        this.errorState = true
      })
    },
    showAbilityInfo(name) {
      this.showAbility = true
      this.abilityInfoSelected = name
    }
  }
}
</script>

<style scoped>

</style>

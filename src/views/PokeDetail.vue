<template>
  <main class="py-12">
    <section v-if="!isLoadingPage && !errorState" class="max-w-7xl mx-auto px-4 py-8">
      <article id="detail" class="w-full flex flex-col md:flex-row items-center md:items-start justify-center">
        <section class="max-w-[400px] flex flex-col items-center">
          <div class="w-full bg-stone-200 rounded-lg p-6">
            <img :src="pokemon.image" :alt="pokemon.name" class="w-full">
          </div>
          <select v-model="formSelected" id="form-select" class="w-full p-2 mt-4 bg-transparent border border-gray-400 rounded-lg focus:outline-none cursor-pointer capitalize">
            <option v-for="form in forms" :value="form.name" :key="form.name" class="capitalize">
              {{ form.name && form.name.includes('-') ? form.name.replace('-', ' ') : form.name }}
            </option>
          </select>
        </section>
        <section class="w-full md:w-[60%] flex flex-col items-start mt-6 md:mt-0 md:px-6">
          <p class="text-lg text-gray-400">{{ $dexnumber(pokemon_id) }}</p>
          <h1 class="text-4xl font-bold capitalize mt-2">
            {{ pokemon.name }}
            <span v-show="pokemon.gender_rate === 1">
              <font-awesome-icon icon="fa-solid fa-venus" class="fa-xs mr-2 text-pink-400" />
              <font-awesome-icon icon="fa-solid fa-mars" class="fa-xs text-blue-400" />
            </span>
          </h1>
          <div class="w-full flex items-center justify-start mt-2">
            <type-label
              v-for="type in pokemon.detail?.filter((poke) => poke.name.toLowerCase() === pokemon.name.toLowerCase())[0].types"
              :key="type"
              :poke-type="type"
              text-size="text-md"
              :class="typeColorMatch[type]"
              class="mr-2"
            />
          </div>
          <h2 class="text-lg mt-2 font-light">{{ description }}</h2>
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
    // pokedexNumber() {
    //   if (this.pokemon_id && this.pokemon_id < 10) {
    //     return `#00${this.pokemon_id}`
    //   } else if (this.pokemon_id && this.pokemon_id < 100) {
    //     return `#0${this.pokemon_id}`
    //   } else {
    //     return `#${this.pokemon_id}`
    //   }
    // },
  },
  created() {
    this.getPokemon()
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
    }
  }
}
</script>

<style scoped>

</style>

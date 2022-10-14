<template>
  <main>
    <section class="max-w-7xl">

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
      currentOffset: 0
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

<style scoped>

</style>
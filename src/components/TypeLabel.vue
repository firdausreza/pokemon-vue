<template>
  <div :class="textSize" class="capitalize px-3 py-1 text-white rounded-md">
    <p>{{ pokeType }}</p>
  </div>
</template>

<script>
export default {
  name: "TypeLabel",
  props: {
    pokeType: {
      type: String,
      default: ''
    },
    textSize: String
  }
}
</script>

<style scoped>

</style>
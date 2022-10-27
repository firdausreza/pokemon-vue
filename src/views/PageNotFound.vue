<template>
  <main class="py-12">
    <h1 class="text-4xl text-center">
      Whoops, seems like the page you're accessing is <span class="font-bold text-red-500">not found.</span>
    </h1>
    <h2 class="text-lg text-center mt-4">
      Back to <router-link to="/" class="text-blue-500 underline">homepage</router-link>
    </h2>
  </main>
</template>

<script>
export default {
  name: "404NotFound"
}
</script>

<style scoped>

</style>

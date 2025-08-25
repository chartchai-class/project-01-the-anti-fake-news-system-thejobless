<script setup>
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useNewsStore } from "../store/news"
const id = useRoute().params.id
const router = useRouter()
const store = useNewsStore()
const choice = ref("fake")
const text = ref("")
const imageUrl = ref("")
const submit = () => {
  store.addVoteAndComment(id, choice.value === "fake", text.value.trim(), imageUrl.value.trim())
  router.push(`/news/${id}`)
}
</script>

<template>
  <div class="max-w-xl mx-auto space-y-3">
    <RouterLink :to="`/news/${id}`" class="text-sm underline">← Back to details</RouterLink>
    <h1 class="text-xl font-bold">Vote this news</h1>

    <form @submit.prevent="submit" class="space-y-3">
      <div class="flex gap-4">
        <label class="flex items-center gap-2"><input type="radio" value="fake" v-model="choice"> Fake</label>
        <label class="flex items-center gap-2"><input type="radio" value="not_fake" v-model="choice"> Not Fake</label>
      </div>
      <textarea v-model="text" rows="4" class="w-full border rounded p-2" placeholder="Why? (optional)"></textarea>
      <input v-model="imageUrl" class="w-full border rounded p-2" placeholder="Image URL (optional)"/>
      <button class="px-4 py-2 border rounded">Submit</button>
    </form>
  </div>
</template>

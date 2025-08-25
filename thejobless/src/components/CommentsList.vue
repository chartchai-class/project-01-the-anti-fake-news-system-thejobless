<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({ 
  items: { type: Array, default: () => [] }, 
  perPage: { type: Number, default: 5 } 
});

const page = ref(1);
const totalPages = computed(() => Math.max(1, Math.ceil(props.items.length / props.perPage)));
const paged = computed(() => props.items.slice((page.value-1)*props.perPage, (page.value)*props.perPage));

watch(() => props.items.length, () => page.value = 1);
</script>

<template>
  <ul class="space-y-2 sm:space-y-3">
    <li v-for="c in paged" :key="c.id" class="border-2 border-gray-100 rounded-xl p-3 sm:p-4 bg-gray-50">
      <div class="text-xs sm:text-sm mb-1 sm:mb-2 text-gray-600 font-medium">
        {{ new Date(c.at).toLocaleString() }} · 
        <span :class="c.isFake ? 'text-red-600' : 'text-green-600'">
          {{ c.isFake ? 'Vote: Fake' : 'Vote: Not Fake' }}
        </span>
      </div>
      <p class="text-sm sm:text-base text-gray-800 leading-relaxed">{{ c.text }}</p>
      <a 
        v-if="c.imageUrl" 
        :href="c.imageUrl" 
        target="_blank" 
        class="text-blue-600 underline text-xs sm:text-sm hover:text-blue-800 font-medium mt-2 inline-block"
      >
        evidence image
      </a>
    </li>
  </ul>
  
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
    <button 
      class="px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 text-sm sm:text-base" 
      :disabled="page === 1" 
      @click="page--"
    >
      Prev
    </button>
    <span class="text-sm sm:text-base font-medium text-gray-700">Page {{ page }} / {{ totalPages }}</span>
    <button 
      class="px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 text-sm sm:text-base" 
      :disabled="page === totalPages" 
      @click="page++"
    >
      Next
    </button>
  </div>
</template>

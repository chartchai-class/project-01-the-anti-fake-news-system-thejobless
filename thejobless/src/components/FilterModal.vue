<script setup>
import { ref, watch } from "vue";
import { useNewsStore } from "../store/news";

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const store = useNewsStore();

const categories = [
  "All Categories", "Politics", "Technology", "Health", 
  "Entertainment", "Sports", "Business", "Science", "Education"
];

const selectedCategory = ref(store.filters.category);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    selectedCategory.value = store.filters.category;
  }
});

const applyFilters = () => {
  store.filters.category = selectedCategory.value;
  store.setFilter(store.filter); // Refresh the current filter
  emit('close');
};

const resetFilters = () => {
  selectedCategory.value = "all";
  store.filters.category = "all";
  store.setFilter(store.filter);
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Advanced Filters</h3>
        <p class="text-sm text-gray-600 mt-1">Customize your news feed</p>
      </div>
      
      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Category</label>
          <select 
            v-model="selectedCategory"
            class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:border-blue-500 focus:outline-none transition-colors"
          >
            <option 
              v-for="category in categories" 
              :key="category" 
              :value="category === 'All Categories' ? 'all' : category"
            >
              {{ category }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="p-6 border-t border-gray-200 flex gap-3">
        <button 
          @click="resetFilters"
          class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button 
          @click="applyFilters"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
      
      <!-- Close Button -->
      <button 
        @click="emit('close')"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

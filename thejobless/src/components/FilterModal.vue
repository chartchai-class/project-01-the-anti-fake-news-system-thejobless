<script setup>
import { ref, computed } from "vue";
import { useNewsStore } from "../store/news";

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const store = useNewsStore();
const newCategoryInclude = ref('');
const newCategoryExclude = ref('');

const availableCategories = computed(() => store.availableCategories);

const addCategoryInclude = () => {
  if (newCategoryInclude.value.trim()) {
    store.addCategoryInclude(newCategoryInclude.value.trim());
    newCategoryInclude.value = '';
  }
};

const addCategoryExclude = () => {
  if (newCategoryExclude.value.trim()) {
    store.addCategoryExclude(newCategoryExclude.value.trim());
    newCategoryExclude.value = '';
  }
};

const resetFilters = () => {
  store.resetFilters();
};

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-blue-600">Filter</h2>
      </div>
      
      <!-- Filter Content -->
      <div class="p-6 space-y-6">
        <!-- Validation Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Validation</label>
          <select 
            v-model="store.filters.validation"
            @change="store.setValidationFilter(store.filters.validation)"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="fake">Fake News (Majority)</option>
            <option value="not_fake">Verified News (Majority)</option>
          </select>
        </div>
        
        <!-- Category Include -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category (include)</label>
          <div class="flex gap-2 mb-2">
            <input 
              v-model="newCategoryInclude"
              @keyup.enter="addCategoryInclude"
              type="text" 
              placeholder="Type to add..."
              class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            <button 
              @click="addCategoryInclude"
              class="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Add
            </button>
          </div>
          <div v-if="store.filters.categoriesInclude.length > 0" class="flex flex-wrap gap-2">
            <span 
              v-for="category in store.filters.categoriesInclude" 
              :key="category"
              class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {{ category }}
              <button 
                @click="store.removeCategoryInclude(category)"
                class="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          </div>
        </div>
        
        <!-- Category Exclude -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category (exclude)</label>
          <div class="flex gap-2 mb-2">
            <input 
              v-model="newCategoryExclude"
              @keyup.enter="addCategoryExclude"
              type="text" 
              placeholder="Type to add..."
              class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            <button 
              @click="addCategoryExclude"
              class="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Add
            </button>
          </div>
          <div v-if="store.filters.categoriesExclude.length > 0" class="flex flex-wrap gap-2">
            <span 
              v-for="category in store.filters.categoriesExclude" 
              :key="category"
              class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {{ category }}
              <button 
                @click="store.removeCategoryExclude(category)"
                class="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </span>
          </div>
        </div>
        
        <!-- Post per page -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Post per page</label>
          <input 
            v-model.number="store.filters.postPerPage"
            @change="store.setPostPerPage(store.filters.postPerPage)"
            type="number" 
            min="1" 
            max="50"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="p-6 border-t border-gray-200 flex gap-3">
        <button 
          @click="resetFilters"
          class="flex-1 bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium"
        >
          Reset
        </button>
        <button 
          @click="closeModal"
          class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

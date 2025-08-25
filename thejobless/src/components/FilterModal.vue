<script setup>
import { ref, computed } from "vue";
import { useNewsStore } from "../store/news";

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const store = useNewsStore();

const resetFilters = () => {
  store.resetFilters();
};

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md mx-auto max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <h2 class="text-xl sm:text-2xl font-bold text-blue-600">Filter</h2>
      </div>
      
      <!-- Filter Content -->
      <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <!-- Validation Filter -->
        <div>
          <label class="block text-sm sm:text-base font-medium text-gray-700 mb-2">Validation</label>
          <select 
            v-model="store.filters.validation"
            @change="store.setValidationFilter(store.filters.validation)"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="fake">Fake News (Majority)</option>
            <option value="not_fake">Verified News (Majority)</option>
          </select>
        </div>
        
        <!-- Category Filter -->
        <div>
          <label class="block text-sm sm:text-base font-medium text-gray-700 mb-2">Category</label>
          <select 
            v-model="store.filters.category"
            @change="store.setCategoryFilter(store.filters.category)"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Politics">Politics</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Sports">Sports</option>
            <option value="Business">Business</option>
            <option value="Science">Science</option>
            <option value="Education">Education</option>
          </select>
        </div>
        
        <!-- Post per page -->
        <div>
          <label class="block text-sm sm:text-base font-medium text-gray-700 mb-2">Post per page</label>
          <select 
            v-model.number="store.filters.postPerPage"
            @change="store.setPostPerPage(store.filters.postPerPage)"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:border-blue-500 focus:outline-none"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="p-4 sm:p-6 border-t border-gray-200 flex gap-2 sm:gap-3">
        <button 
          @click="resetFilters"
          class="flex-1 bg-red-100 text-red-600 py-2 px-3 sm:px-4 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm sm:text-base"
        >
          Reset
        </button>
        <button 
          @click="closeModal"
          class="flex-1 bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

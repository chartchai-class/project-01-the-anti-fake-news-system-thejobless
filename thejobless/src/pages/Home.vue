<script setup>
import { onMounted, computed, ref } from "vue";
import { useNewsStore } from "../store/news";
import { useRouter } from "vue-router";
import FilterModal from "../components/FilterModal.vue";

const store = useNewsStore();
const router = useRouter();
const isFilterModalOpen = ref(false);

onMounted(() => { 
  if (!store.all.length) store.fetchNews(); 
});

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= store.totalPages; i++) {
    pages.push(i);
  }
  return pages;
});

const goToNewsDetail = (newsId) => {
  router.push(`/news/${newsId}`);
};

const getVoteStatus = (newsId) => {
  return store.majorityVote(newsId);
};

const getNewsStatus = (newsId) => {
  const voteStatus = getVoteStatus(newsId);
  if (voteStatus.total === 0) return news.status; // ใช้ status เดิมถ้าไม่มีโหวต
  
  if (voteStatus.result === 'fake') return 'fake';
  if (voteStatus.result === 'not_fake') return 'not_fake';
  return 'tie';
};

const getStatusBadge = (newsId) => {
  const status = getNewsStatus(newsId);
  const voteStatus = getVoteStatus(newsId);
  
  if (status === 'fake') {
    return {
      text: 'Fake News',
      class: 'bg-red-100 text-red-800 border border-red-200'
    };
  } else if (status === 'not_fake') {
    return {
      text: 'Verified',
      class: 'bg-green-100 text-green-800 border border-green-200'
    };
  } else if (status === 'tie') {
    return {
      text: 'Split Vote',
      class: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    };
  } else {
    return {
      text: 'No Votes',
      class: 'bg-gray-100 text-gray-600 border border-gray-200'
    };
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 space-y-6 p-6">
    <!-- Header -->
    <div class="text-center bg-white p-8 rounded-xl shadow-sm border">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">The Jobless News</h1>
      <p class="text-lg text-gray-600">Fact-checking platform for news verification</p>
    </div>

    <!-- Filter and Page Size Controls -->
    <div class="flex flex-wrap gap-4 justify-between items-center bg-white p-6 rounded-xl shadow-sm border">
      <div class="flex gap-3">
        <button 
          @click="store.setFilter('all')"
          :class="[
            'px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-base',
            store.filter === 'all' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
          ]"
        >
          All News
        </button>
        <button 
          @click="store.setFilter('fake')"
          :class="[
            'px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-base',
            store.filter === 'fake' 
              ? 'bg-red-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
          ]"
        >
          Fake News
        </button>
        <button 
          @click="store.setFilter('not_fake')"
          :class="[
            'px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-base',
            store.filter === 'not_fake' 
              ? 'bg-green-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
          ]"
        >
          Verified News
        </button>
        
        <!-- Advanced Filter Button -->
        <button 
          @click="isFilterModalOpen = true"
          class="px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-base bg-purple-100 text-purple-700 hover:bg-purple-200 hover:shadow-sm"
        >
          🔍 Advanced Filters
        </button>
      </div>
      
      <div class="flex items-center gap-3">
        <label class="text-base font-medium text-gray-700">Show:</label>
        <select 
          @change="store.setPageSize(Number($event.target.value))"
          :value="store.pageSize"
          class="border-2 border-gray-200 rounded-lg px-4 py-2 text-base focus:border-blue-500 focus:outline-none"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="store.filters.categoriesInclude.length > 0 || store.filters.categoriesExclude.length > 0 || store.filters.validation !== 'all'" class="bg-white p-4 rounded-xl shadow-sm border">
      <h3 class="font-medium text-gray-700 mb-3">Active Filters:</h3>
      <div class="flex flex-wrap gap-2">
        <span v-if="store.filters.validation !== 'all'" class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          Validation: {{ store.filters.validation === 'fake' ? 'Fake News' : 'Verified News' }}
        </span>
        <span v-for="category in store.filters.categoriesInclude" :key="`include-${category}`" class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          Include: {{ category }}
        </span>
        <span v-for="category in store.filters.categoriesExclude" :key="`exclude-${category}`" class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
          Exclude: {{ category }}
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="grid gap-6">
      <div v-for="i in 6" :key="i" class="bg-white border-2 border-gray-100 rounded-xl p-6 h-40 shadow-sm">
        <div class="animate-pulse space-y-4">
          <div class="h-6 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- News Grid -->
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="news in store.paginatedNews" 
        :key="news.id"
        @click="goToNewsDetail(news.id)"
        class="bg-white border-2 border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:border-blue-200 hover:scale-105 cursor-pointer group"
      >
        <div class="relative overflow-hidden">
          <img 
            :src="news.imageUrl" 
            :alt="news.title"
            class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <!-- Overlay with click hint -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 px-4 py-2 rounded-lg">
              <span class="text-blue-600 font-semibold">Click to view details & vote</span>
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <div class="flex items-center justify-between mb-3">
            <!-- Status Badge ที่เปลี่ยนตามเสียงข้างมาก -->
            <span :class="`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(news.id).class}`">
              {{ getStatusBadge(news.id).text }}
            </span>
            <div class="text-right">
              <span class="text-sm font-medium text-gray-600">{{ news.reporter }}</span>
              <div class="text-xs text-gray-500">{{ news.category }}</div>
            </div>
          </div>
          
          <h3 class="font-bold text-xl mb-3 text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-200">{{ news.title }}</h3>
          <p class="text-gray-700 text-base leading-relaxed mb-4">{{ news.summary }}</p>
          
          <!-- Majority Vote Display -->
          <div v-if="getVoteStatus(news.id).total > 0" class="mb-4 p-3 rounded-lg" :class="{
            'bg-red-50 border border-red-200': getVoteStatus(news.id).result === 'fake',
            'bg-green-50 border border-green-200': getVoteStatus(news.id).result === 'not_fake',
            'bg-yellow-50 border border-yellow-200': getVoteStatus(news.id).result === 'tie'
          }">
            <div class="text-center">
              <div class="text-lg font-bold" :class="{
                'text-red-700': getVoteStatus(news.id).result === 'fake',
                'text-green-700': getVoteStatus(news.id).result === 'not_fake',
                'text-yellow-700': getVoteStatus(news.id).result === 'tie'
              }">
                {{ getVoteStatus(news.id).result === 'fake' ? ' Community says: FAKE' : 
                   getVoteStatus(news.id).result === 'not_fake' ? '👍 Community says: VERIFIED' : 
                   ' Community is split' }}
              </div>
              <div class="text-sm text-gray-600 mt-1">
                {{ getVoteStatus(news.id).percentage }}% majority 
                ({{ getVoteStatus(news.id).total }} total votes)
              </div>
            </div>
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600 font-medium">{{ new Date(news.reportedAt).toLocaleDateString() }}</span>
            <div class="flex gap-3">
              <span class="text-red-600 font-semibold">👎 {{ getVoteStatus(news.id).fakeVotes || 0 }}</span>
              <span class="text-green-600 font-semibold">👍 {{ getVoteStatus(news.id).notFakeVotes || 0 }}</span>
            </div>
          </div>
          
          <!-- Quick action buttons -->
          <div class="mt-4 pt-4 border-t border-gray-100 flex gap-2">
            <button 
              @click.stop="goToNewsDetail(news.id)"
              class="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
            >
              📰 View Details
            </button>
            <button 
              @click.stop="router.push(`/news/${news.id}/vote`)"
              class="flex-1 bg-green-50 text-green-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors duration-200"
            >
              🗳️ Vote Now
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="store.totalPages > 1" class="flex justify-center">
      <div class="flex gap-2">
        <button 
          @click="store.setPage(store.currentPage - 1)"
          :disabled="store.currentPage === 1"
          class="px-4 py-2 rounded-lg border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 font-medium text-gray-700 transition-all duration-200"
        >
          Previous
        </button>
        
        <button 
          v-for="page in pageNumbers"
          :key="page"
          @click="store.setPage(page)"
          :class="[
            'px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200',
            store.currentPage === page 
              ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
              : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          {{ page }}
        </button>
        
        <button 
          @click="store.setPage(store.currentPage + 1)"
          :disabled="store.currentPage === store.totalPages"
          class="px-4 py-2 rounded-lg border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 font-medium text-gray-700 transition-all duration-200"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!store.loading && store.paginatedNews.length === 0" class="text-center py-16 bg-white rounded-xl shadow-sm border">
      <div class="text-gray-400 text-8xl mb-6">📰</div>
      <h3 class="text-2xl font-bold text-gray-700 mb-3">No news found</h3>
      <p class="text-lg text-gray-500">Try adjusting your filters or check back later.</p>
    </div>
  </div>

  <!-- Filter Modal -->
  <FilterModal 
    :is-open="isFilterModalOpen" 
    @close="isFilterModalOpen = false" 
  />
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

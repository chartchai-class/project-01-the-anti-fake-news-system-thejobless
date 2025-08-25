<script setup>
import { onMounted, computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useNewsStore } from "../store/news";
import CommentsList from "../components/CommentsList.vue";

const id = useRoute().params.id;
const store = useNewsStore();

onMounted(async () => {
  if (!store.all.length) await store.fetchNews({ useCache: true });
});

const news = computed(() => store.all.find(n => n.id === id));
const vote = computed(() => store.majorityVote(id));
const comments = computed(() => store.commentsOf(id));

const getVoteDisplay = (newsId) => {
  const voteData = store.majorityVote(newsId);
  return {
    fake: voteData.fakeVotes || 0,
    notFake: voteData.notFakeVotes || 0,
    total: voteData.total || 0,
    result: voteData.result || 'no_votes'
  };
};

const getStatusBadge = (newsId) => {
  const voteStatus = store.majorityVote(newsId);
  
  if (voteStatus.total > 0) {
    if (voteStatus.result === 'fake') {
      return {
        text: 'Fake News (Community)',
        class: 'bg-red-50 text-red-700 border-2 border-red-200 shadow-sm'
      };
    } else if (voteStatus.result === 'not_fake') {
      return {
        text: 'Verified (Community)',
        class: 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200 shadow-sm'
      };
    } else if (voteStatus.result === 'tie') {
      return {
        text: 'Split Vote',
        class: 'bg-amber-50 text-amber-700 border-2 border-amber-200 shadow-sm'
      };
    }
  }
  
  const news = store.all.find(n => n.id === newsId);
  if (news?.status === 'fake') {
    return {
      text: 'Fake News',
      class: 'bg-red-50 text-red-700 border-2 border-red-200 shadow-sm'
    };
  } else {
    return {
      text: 'Unverified',
      class: 'bg-slate-50 text-slate-600 border-2 border-slate-200 shadow-sm'
    };
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
    <!-- Loading State -->
    <div v-if="!news" class="flex justify-center items-center min-h-screen">
      <div class="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
        <p class="text-slate-600 text-lg font-medium">Loading news...</p>
      </div>
    </div>

    <!-- News Content -->
    <div v-else class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <!-- Header Card -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
        <div class="space-y-6">
          <!-- Status Badge -->
          <div class="flex justify-start">
            <span :class="`px-4 py-2 rounded-full text-sm font-bold ${getStatusBadge(news.id).class}`">
              {{ getStatusBadge(news.id).text }}
            </span>
          </div>
          
          <!-- Title -->
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
            {{ news.title }}
          </h1>
          
          <!-- Summary -->
          <p class="text-xl text-slate-600 leading-relaxed max-w-4xl">
            {{ news.summary }}
          </p>
          
          <!-- Meta Info -->
          <div class="flex flex-wrap gap-6 text-sm">
            <div class="flex items-center gap-2 text-slate-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span class="font-medium">{{ news.reporter }}</span>
            </div>
            <div class="flex items-center gap-2 text-slate-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              <span class="font-medium">{{ news.category }}</span>
            </div>
            <div class="flex items-center gap-2 text-slate-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span class="font-medium">{{ new Date(news.reportedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- News Image -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <img 
          :src="news.imageUrl" 
          :alt="news.title"
          loading="lazy"
          class="w-full h-80 sm:h-96 lg:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
        />
      </div>

      <!-- Full Story -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
        <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Full Story
        </h2>
        <p class="text-lg text-slate-700 leading-relaxed max-w-none">
          {{ news.content }}
        </p>
      </div>

      <!-- Votes & Comments Section -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
        <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          Community Verdict & Comments
        </h2>
        
        <!-- Vote Summary -->
        <div class="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 mb-8 border border-slate-200">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div class="bg-white/80 rounded-lg p-4 shadow-sm border border-red-100">
              <div class="text-3xl font-bold text-red-600 mb-2">{{ getVoteDisplay(news.id).fake }}</div>
              <div class="text-sm font-medium text-slate-600">Voted Fake</div>
            </div>
            <div class="bg-white/80 rounded-lg p-4 shadow-sm border border-emerald-100">
              <div class="text-3xl font-bold text-emerald-600 mb-2">{{ getVoteDisplay(news.id).notFake }}</div>
              <div class="text-sm font-medium text-slate-600">Voted Verified</div>
            </div>
            <div class="bg-white/80 rounded-lg p-4 shadow-sm border border-blue-100">
              <div class="text-3xl font-bold text-blue-600 mb-2">{{ getVoteDisplay(news.id).total }}</div>
              <div class="text-sm font-medium text-slate-600">Total Votes</div>
            </div>
          </div>
          
          <!-- Community Verdict -->
          <div v-if="getVoteDisplay(news.id).total > 0" class="mt-6 p-4 rounded-lg text-center" :class="{
            'bg-red-50 border-2 border-red-200': getVoteDisplay(news.id).result === 'fake',
            'bg-emerald-50 border-2 border-emerald-200': getVoteDisplay(news.id).result === 'not_fake',
            'bg-amber-50 border-2 border-amber-200': getVoteDisplay(news.id).result === 'tie'
          }">
            <div class="text-lg font-bold" :class="{
              'text-red-700': getVoteDisplay(news.id).result === 'fake',
              'text-emerald-700': getVoteDisplay(news.id).result === 'not_fake',
              'text-amber-700': getVoteDisplay(news.id).result === 'tie'
            }">
              {{ getVoteDisplay(news.id).result === 'fake' ? '👎 Community says: FAKE NEWS' : 
                 getVoteDisplay(news.id).result === 'not_fake' ? '✅ Community says: VERIFIED' : 
                 '🤝 Community is split' }}
            </div>
            <div class="text-sm text-slate-600 mt-2">
              Based on {{ getVoteDisplay(news.id).total }} community votes
            </div>
          </div>
        </div>

        <!-- Comments List -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-slate-800 mb-4">Community Comments</h3>
          <CommentsList :items="comments" :perPage="5" />
        </div>
        
        <!-- Vote Button -->
        <div class="text-center">
          <RouterLink 
            :to="`/news/${news.id}/vote`" 
            class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Add Your Vote
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

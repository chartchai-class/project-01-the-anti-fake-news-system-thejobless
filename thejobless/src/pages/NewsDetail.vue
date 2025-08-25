<script setup>
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useNewsStore } from "../store/news";
import CommentsList from "../components/CommentsList.vue";

const id = useRoute().params.id;
const store = useNewsStore();

const news = computed(() => store.all.find(n => n.id === id));
const vote = computed(() => store.votes[id] || { fake: 0, notFake: 0 });
const comments = computed(() => store.comments[id] || []);
const majorityVote = computed(() => store.majorityVote(id));
</script>

<template>
  <div v-if="news" class="min-h-screen bg-gray-50">
    <div class="max-w-5xl mx-auto p-6 space-y-6">
      <!-- Header Section -->
      <div class="text-center bg-white p-8 rounded-xl shadow-sm border">
        <h1 class="text-4xl font-bold text-gray-900 mb-4 leading-tight">{{ news.title }}</h1>
        <div class="flex items-center justify-center gap-6 text-base text-gray-600">
          <span class="font-medium">Reporter: {{ news.reporter }}</span>
          <span>•</span>
          <span class="font-medium">{{ new Date(news.reportedAt).toLocaleDateString() }}</span>
          <span>•</span>
          <span 
            :class="[
              'px-3 py-1 rounded-full text-sm font-semibold',
              news.status === 'fake' 
                ? 'bg-red-100 text-red-800 border border-red-200' 
                : 'bg-green-100 text-green-800 border border-green-200'
            ]"
          >
            {{ news.status === 'fake' ? 'Fake News' : 'Verified News' }}
          </span>
        </div>
      </div>

      <!-- Image Section -->
      <div class="w-full bg-white p-4 rounded-xl shadow-sm border">
        <img 
          :src="news.imageUrl" 
          :alt="news.title"
          class="w-full h-96 object-cover rounded-lg"
        />
      </div>

      <!-- Content Section -->
      <div class="bg-white p-8 rounded-xl shadow-sm border">
        <h2 class="text-2xl font-bold mb-4 text-gray-900">Summary</h2>
        <p class="text-lg text-gray-700 leading-relaxed mb-8">{{ news.summary }}</p>
        
        <h2 class="text-2xl font-bold mb-4 text-gray-900">Full Content</h2>
        <p class="text-lg text-gray-700 leading-relaxed">{{ news.content }}</p>
      </div>

      <!-- Community Verdict Section -->
      <section v-if="majorityVote.total > 0" class="bg-white p-8 rounded-xl shadow-sm border">
        <h2 class="font-bold text-2xl mb-6 text-gray-900">Community Verdict</h2>
        
        <div class="text-center p-8 rounded-xl" :class="{
          'bg-red-50 border-2 border-red-200': majorityVote.result === 'fake',
          'bg-green-50 border-2 border-green-200': majorityVote.result === 'not_fake',
          'bg-yellow-50 border-2 border-yellow-200': majorityVote.result === 'tie'
        }">
          <div class="text-6xl mb-4">
            {{ majorityVote.result === 'fake' ? '' : 
               majorityVote.result === 'not_fake' ? '👍' : '🤝' }}
          </div>
          
          <h3 class="text-3xl font-bold mb-3" :class="{
            'text-red-700': majorityVote.result === 'fake',
            'text-green-700': majorityVote.result === 'not_fake',
            'text-yellow-700': majorityVote.result === 'tie'
          }">
            {{ majorityVote.result === 'fake' ? 'FAKE NEWS DETECTED!' : 
               majorityVote.result === 'not_fake' ? 'VERIFIED AS TRUE!' : 
               'COMMUNITY IS SPLIT' }}
          </h3>
          
          <p class="text-lg text-gray-600 mb-4">
            {{ majorityVote.result === 'fake' ? 'The community has identified this as potentially misleading or false information.' : 
               majorityVote.result === 'not_fake' ? 'The community has verified this information as accurate and trustworthy.' : 
               'The community is evenly divided on this news item.' }}
          </p>
          
          <div class="text-2xl font-bold" :class="{
            'text-red-600': majorityVote.result === 'fake',
            'text-green-600': majorityVote.result === 'not_fake',
            'text-yellow-600': majorityVote.result === 'tie'
          }">
            {{ majorityVote.percentage }}% Majority
          </div>
          
          <div class="text-sm text-gray-500 mt-2">
            Based on {{ majorityVote.total }} community votes
          </div>
        </div>
      </section>

      <!-- Quick Vote Section -->
      <section class="bg-white p-8 rounded-xl shadow-sm border">
        <h2 class="font-bold text-2xl mb-6 text-gray-900">Quick Vote</h2>
        <p class="text-lg text-gray-600 mb-6">What do you think about this news?</p>
        
        <div class="flex gap-4 justify-center">
          <RouterLink 
            :to="`/news/${id}/vote?vote=fake`"
            class="flex-1 max-w-xs bg-red-50 border-2 border-red-200 text-red-700 p-6 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-200 text-center group"
          >
            <div class="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">👎</div>
            <h3 class="text-xl font-bold mb-2">Fake News</h3>
            <p class="text-sm">I think this is misleading or false</p>
          </RouterLink>
          
          <RouterLink 
            :to="`/news/${id}/vote?vote=not_fake`"
            class="flex-1 max-w-xs bg-green-50 border-2 border-green-200 text-green-700 p-6 rounded-xl hover:bg-green-100 hover:border-green-300 transition-all duration-200 text-center group"
          >
            <div class="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">👍</div>
            <h3 class="text-xl font-bold mb-2">Verified News</h3>
            <p class="text-sm">I think this is accurate and true</p>
          </RouterLink>
        </div>
      </section>

      <!-- Votes & Comments Section -->
      <section class="bg-white p-8 rounded-xl shadow-sm border">
        <h2 class="font-bold text-2xl mb-6 text-gray-900">Votes & Comments</h2>
        
        <!-- Vote Summary -->
        <div class="flex items-center gap-8 mb-8 p-6 bg-gray-50 rounded-xl">
          <div class="text-center">
            <div class="text-3xl font-bold text-red-600">{{ vote.fake }}</div>
            <div class="text-base font-medium text-gray-700">Voted Fake</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">{{ vote.notFake }}</div>
            <div class="text-base font-medium text-gray-700">Voted Not Fake</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{ vote.fake + vote.notFake }}</div>
            <div class="text-base font-medium text-gray-700">Total Votes</div>
          </div>
        </div>

        <!-- Comments List -->
        <div v-if="comments.length > 0">
          <h3 class="font-bold text-xl mb-4 text-gray-800">Community Comments</h3>
          <CommentsList :items="comments" :perPage="5" />
        </div>
        
        <div v-else class="text-center py-12 text-gray-500">
          <div class="text-6xl mb-4">💬</div>
          <p class="text-lg">No comments yet. Be the first to share your thoughts!</p>
        </div>

        <!-- Add Vote Button -->
        <div class="mt-8 text-center">
          <RouterLink 
            :to="`/news/${id}/vote`" 
            class="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-bold text-lg shadow-md hover:shadow-lg"
          >
            Add Your Vote & Comment
          </RouterLink>
        </div>
      </section>

      <!-- Back to Home -->
      <div class="text-center">
        <RouterLink 
          to="/" 
          class="inline-block px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium text-lg"
        >
          ← Back to News List
        </RouterLink>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="flex justify-center items-center min-h-screen bg-gray-50">
    <div class="text-center bg-white p-8 rounded-xl shadow-sm border">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
      <p class="text-xl font-medium text-gray-700">Loading news...</p>
    </div>
  </div>
</template>

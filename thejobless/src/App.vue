<script setup>
</script>

<template>
  <header class="p-4 border-b border-gray-200 bg-white">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <RouterLink to="/" class="text-xl font-bold text-gray-900">Social Anti-Fake News</RouterLink>
      <!-- <a href="https://github.com/chartchai-class/project-01-the-anti-fake-news-system-thejobless" target="_blank" class="text-sm underline">GitHub</a> -->
    </div>
  </header>
  <main class="w-full">
    <RouterView />
  </main>
</template>

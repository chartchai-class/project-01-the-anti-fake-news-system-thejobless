import { defineStore } from "pinia";

const CACHE_KEY = "db_cache_v1";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 นาที

export const useNewsStore = defineStore("news", {
  state: () => ({
    all: [],
    comments: {},
    votes: {},
    filter: "all",
    pageSize: 10,
    currentPage: 1,
    loading: false,
    filters: { validation: "all", category: "all", postPerPage: 10 },
  }),

  getters: {
    voteOf: (s) => (id) => s.votes[id] || { fake: 0, notFake: 0 },
    commentsOf: (s) => (id) => s.comments[id] || [],
    
    // แก้ไขให้แสดงผลตามการโหวตจริง
    majorityVote: (s) => (newsId) => {
      const v = s.voteOf(newsId);
      const total = (v.fake || 0) + (v.notFake || 0);
      if (!total) {
        return { result: "no_votes", total: 0, fakeVotes: 0, notFakeVotes: 0, percentage: 0 };
      }

      const fake = v.fake || 0;
      const notFake = v.notFake || 0;
      const majority = Math.max(fake, notFake);
      const percentage = Math.round((majority / total) * 100);

      if (fake > notFake) {
        return { result: "fake", total, fakeVotes: fake, notFakeVotes: notFake, percentage };
      }
      if (notFake > fake) {
        return { result: "not_fake", total, fakeVotes: fake, notFakeVotes: notFake, percentage };
      }
      // tie
      return { result: "tie", total, fakeVotes: fake, notFakeVotes: notFake, percentage: 50 };
    },

    filteredNews: (s) => {
      let list = s.all;
      
      // กรองตาม validation status
      if (s.filter === "fake") {
        list = list.filter(n => {
          const mv = s.majorityVote(n.id);
          // ถ้ามีการโหวตแล้ว ให้ใช้ผลการโหวต
          if (mv.total > 0) return mv.result === "fake";
          // ถ้ายังไม่มีใครโหวต ให้ใช้ status เดิมจากข่าว
          return n.status === "fake";
        });
      } else if (s.filter === "not_fake") {
        list = list.filter(n => {
          const mv = s.majorityVote(n.id);
          // ถ้ามีการโหวตแล้ว ให้ใช้ผลการโหวต
          if (mv.total > 0) return mv.result === "not_fake";
          // ถ้ายังไม่มีใครโหวต ให้ใช้ status เดิมจากข่าว
          return n.status === "not_fake";
        });
      }
      
      // กรองตาม category
      if (s.filters.category !== "all") {
        list = list.filter(n => n.category === s.filters.category);
      }
      
      return list;
    },
    
    totalPages: (s) => Math.max(1, Math.ceil(s.filteredNews.length / s.pageSize)),
    paginatedNews: (s) => {
      const start = (s.currentPage - 1) * s.pageSize;
      return s.filteredNews.slice(start, start + s.pageSize);
    },
  },

  actions: {
    _assign(news = [], comments = [], votes = []) {
      this.all = news;
      this.comments = comments.reduce((acc, c) => {
        (acc[c.newsId] ??= []).push(c); 
        return acc;
      }, {});
      this.votes = votes.reduce((acc, v) => {
        acc[v.newsId] = { fake: v.fake, notFake: v.notFake }; 
        return acc;
      }, {});
    },
    
    _hydrateFromCache() {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return false;
        const { ts, payload } = JSON.parse(raw);
        if (Date.now() - ts > CACHE_TTL_MS) return false;
        const { news = [], comments = [], votes = [] } = payload || {};
        this._assign(news, comments, votes);
        return true;
      } catch { return false; }
    },
    
    _saveCache(payload) {
      try { 
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), payload })); 
      } catch {}
    },

    async fetchNews({ force = false, useCache = true } = {}) {
      if (this.all.length && !force) return;

      this.loading = true;
      let hydrated = false;
      
      if (useCache) hydrated = this._hydrateFromCache();
      if (hydrated) { this.loading = false; }

      try {
        const res = await fetch("/data/db.json", { cache: "no-store" });
        if (!res.ok) throw new Error("fetch failed");
        const { news = [], comments = [], votes = [] } = await res.json();
        this._assign(news, comments, votes);
        this._saveCache({ news, comments, votes });
      } catch (e) {
        if (!hydrated) console.error("Error fetching news:", e);
      } finally {
        this.loading = false;
      }
    },

    setFilter(f){ this.filter = f; this.currentPage = 1; },
    setPageSize(n){ this.pageSize = n; this.currentPage = 1; },
    setPage(p){ this.currentPage = p; },

    addVoteAndComment(id, isFake, text="", imageUrl=""){
      if (!this.votes[id]) this.votes[id] = { fake: 0, notFake: 0 };
      isFake ? this.votes[id].fake++ : this.votes[id].notFake++;
      if (text || imageUrl){
        (this.comments[id] ??= []).push({ 
          id: "u"+Date.now(), 
          isFake, 
          text, 
          imageUrl, 
          at: new Date().toISOString() 
        });
      }
    }
  }
});

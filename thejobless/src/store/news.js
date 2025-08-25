import { defineStore } from "pinia";

export const useNewsStore = defineStore("news", {
  state: () => ({
    all: [],
    comments: {}, 
    votes: {},
    filter: "all", 
    pageSize: 10, 
    currentPage: 1,
    loading: false
  }),
  
  actions: {
    async fetchNews() {
      this.loading = true;
      const res = await fetch("/data/db.json"); // environment call (GET)
      const { news, comments, votes } = await res.json();

      // map เข้ารูปแบบ state
      this.all = news;
      this.comments = comments.reduce((acc, c) => {
        (acc[c.newsId] ??= []).push(c); 
        return acc;
      }, {});
      this.votes = votes.reduce((acc, v) => {
        acc[v.newsId] = { fake: v.fake, notFake: v.notFake }; 
        return acc;
      }, {});
      
      // หน่วงนิดเพื่อเห็น loading (ตาม rubric)
      await new Promise(r => setTimeout(r, 400));
      this.loading = false;
    },
    
    setFilter(f) { 
      this.filter = f; 
      this.currentPage = 1; 
      this._fakeLoad(); 
    },
    
    setPageSize(n) { 
      this.pageSize = n; 
      this.currentPage = 1; 
    },
    
    setPage(p) { 
      this.currentPage = p; 
    },
    
    _fakeLoad() { 
      this.loading = true; 
      setTimeout(() => this.loading = false, 250); 
    },
    
    addVoteAndComment(id, isFake, text = "", imageUrl = "") {
      if (!this.votes[id]) this.votes[id] = { fake: 0, notFake: 0 };
      isFake ? this.votes[id].fake++ : this.votes[id].notFake++;
      
      if (text || imageUrl) {
        (this.comments[id] ??= []).push({
          id: "u" + Date.now(), 
          isFake, 
          text, 
          imageUrl, 
          at: new Date().toISOString()
        });
      }
    }
  },
  
  getters: {
    filteredNews: (state) => {
      let filtered = state.all;
      
      if (state.filter === "fake") {
        filtered = filtered.filter(news => news.status === "fake");
      } else if (state.filter === "not_fake") {
        filtered = filtered.filter(news => news.status === "not_fake");
      }
      
      return filtered;
    },
    
    paginatedNews: (state) => {
      const start = (state.currentPage - 1) * state.pageSize;
      const end = start + state.pageSize;
      return state.filteredNews.slice(start, end);
    },
    
    totalPages: (state) => {
      return Math.ceil(state.filteredNews.length / state.pageSize);
    },
    
    // เพิ่ม getter สำหรับ NewsDetail
    voteOf: (state) => (newsId) => {
      return state.votes[newsId] || { fake: 0, notFake: 0 };
    },
    
    commentsOf: (state) => (newsId) => {
      return state.comments[newsId] || [];
    }
  }
});

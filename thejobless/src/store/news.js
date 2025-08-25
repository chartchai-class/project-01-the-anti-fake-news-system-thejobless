import { defineStore } from "pinia";

export const useNewsStore = defineStore("news", {
  state: () => ({
    all: [],
    comments: {}, 
    votes: {},
    filter: "all", 
    pageSize: 10, 
    currentPage: 1,
    loading: false,
    // ปรับ filters ใหม่
    filters: {
      validation: "all", // all, fake, not_fake
      category: "all", // all, Politics, Technology, Health, Entertainment, Sports, Business, Science, Education
      postPerPage: 10
    }
  }),
  
  actions: {
    async fetchNews() {
      this.loading = true;
      const res = await fetch("/data/db.json");
      const { news, comments, votes } = await res.json();

      // เพิ่ม category ให้กับข่าว
      const categories = ["Politics", "Technology", "Health", "Entertainment", "Sports", "Business", "Science", "Education"];
      this.all = news.map((item, index) => ({
        ...item,
        category: categories[index % categories.length] // กระจาย categories
      }));

      this.comments = comments.reduce((acc, c) => {
        (acc[c.newsId] ??= []).push(c); 
        return acc;
      }, {});
      this.votes = votes.reduce((acc, v) => {
        acc[v.newsId] = { fake: v.fake, notFake: v.notFake }; 
        return acc;
      }, {});
      
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
    
    // ปรับ actions สำหรับ filters ใหม่
    setValidationFilter(validation) {
      this.filters.validation = validation;
      this.currentPage = 1;
      this._fakeLoad();
    },
    
    setCategoryFilter(category) {
      this.filters.category = category;
      this.currentPage = 1;
      this._fakeLoad();
    },
    
    setPostPerPage(count) {
      this.filters.postPerPage = count;
      this.pageSize = count;
      this.currentPage = 1;
      this._fakeLoad();
    },
    
    resetFilters() {
      this.filters = {
        validation: "all",
        category: "all",
        postPerPage: 10
      };
      this.pageSize = 10;
      this.currentPage = 1;
      this._fakeLoad();
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
      
      // Filter by validation (majority vote)
      if (state.filters.validation === "fake") {
        filtered = filtered.filter(news => {
          const vote = state.votes[news.id] || { fake: 0, notFake: 0 };
          return vote.fake > vote.notFake;
        });
      } else if (state.filters.validation === "not_fake") {
        filtered = filtered.filter(news => {
          const vote = state.votes[news.id] || { fake: 0, notFake: 0 };
          return vote.notFake > vote.fake;
        });
      }
      
      // Filter by category
      if (state.filters.category !== "all") {
        filtered = filtered.filter(news => 
          news.category === state.filters.category
        );
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
    
    voteOf: (state) => (newsId) => {
      return state.votes[newsId] || { fake: 0, notFake: 0 };
    },
    
    commentsOf: (state) => (newsId) => {
      return state.comments[newsId] || [];
    },
    
    majorityVote: (state) => (newsId) => {
      const vote = state.votes[newsId] || { fake: 0, notFake: 0 };
      const total = vote.fake + vote.notFake;
      
      if (total === 0) return { result: 'no_votes', percentage: 0, leading: null };
      
      const fakePercentage = (vote.fake / total) * 100;
      const notFakePercentage = (vote.notFake / total) * 100;
      
      if (vote.fake > vote.notFake) {
        return { 
          result: 'fake', 
          percentage: Math.round(fakePercentage), 
          leading: 'fake',
          fakeVotes: vote.fake,
          notFakeVotes: vote.notFake,
          total: total
        };
      } else if (vote.notFake > vote.fake) {
        return { 
          result: 'not_fake', 
          percentage: Math.round(notFakePercentage), 
          leading: 'not_fake',
          fakeVotes: vote.fake,
          notFakeVotes: vote.notFake,
          total: total
        };
      } else {
        return { 
          result: 'tie', 
          percentage: 50, 
          leading: null,
          fakeVotes: vote.fake,
          notFakeVotes: vote.notFake,
          total: total
        };
      }
    },
    
    // เพิ่ม getter สำหรับ categories ที่มีอยู่
    availableCategories: (state) => {
      const categories = [...new Set(state.all.map(news => news.category))];
      return categories.sort();
    }
  }
});

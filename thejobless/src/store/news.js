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
    filters: {
      validation: "all",
      category: "all",
      postPerPage: 10
    }
  }),
  
  getters: {
    // กรองข่าวตาม filter ที่เลือก
    filteredNews: (state) => {
      let filtered = state.all;
      
      // กรองตาม validation status (fake/not_fake)
      if (state.filter === 'fake') {
        filtered = filtered.filter(news => news.status === 'fake');
      } else if (state.filter === 'not_fake') {
        filtered = filtered.filter(news => news.status === 'not_fake');
      }
      
      // กรองตาม category
      if (state.filters.category !== 'all') {
        filtered = filtered.filter(news => news.category === state.filters.category);
      }
      
      return filtered;
    },
    
    // คำนวณจำนวนหน้าทั้งหมด
    totalPages: (state) => {
      return Math.ceil(state.filteredNews.length / state.pageSize);
    },
    
    // ข่าวที่แสดงในหน้าปัจจุบัน
    paginatedNews: (state) => {
      const start = (state.currentPage - 1) * state.pageSize;
      const end = start + state.pageSize;
      return state.filteredNews.slice(start, end);
    },
    
    // ข้อมูลการโหวตของข่าว
    voteOf: (state) => (newsId) => {
      return state.votes[newsId] || { fake: 0, notFake: 0 };
    },
    
    // คอมเมนต์ของข่าว
    commentsOf: (state) => (newsId) => {
      return state.comments[newsId] || [];
    },
    
    // ผลการโหวตแบบ majority
    majorityVote: (state) => (newsId) => {
      const vote = state.voteOf(newsId);
      const total = vote.fake + vote.notFake;
      
      if (total === 0) {
        return { result: 'no_votes', total: 0, fakeVotes: 0, notFakeVotes: 0, percentage: 0 };
      }
      
      const fakePercentage = Math.round((vote.fake / total) * 100);
      const notFakePercentage = Math.round((vote.notFake / total) * 100);
      
      if (vote.fake > vote.notFake) {
        return { 
          result: 'fake', 
          total, 
          fakeVotes: vote.fake, 
          notFakeVotes: vote.notFake, 
          percentage: fakePercentage 
        };
      } else if (vote.notFake > vote.fake) {
        return { 
          result: 'not_fake', 
          total, 
          fakeVotes: vote.fake, 
          notFakeVotes: vote.notFake, 
          percentage: notFakePercentage 
        };
      } else {
        return { 
          result: 'tie', 
          total, 
          fakeVotes: vote.fake, 
          notFakeVotes: vote.notFake, 
          percentage: 50 
        };
      }
    }
  },
  
  actions: {
    async fetchNews() {
      this.loading = true;
      
      try {
        const res = await fetch("/data/db.json");
        if (!res.ok) throw new Error('Failed to fetch data');
        
        const { news, comments, votes } = await res.json();
        
        // ตรวจสอบและกำหนดค่าเริ่มต้น
        this.all = news || [];
        this.comments = (comments || []).reduce((acc, c) => {
          (acc[c.newsId] ??= []).push(c); 
          return acc;
        }, {});
        this.votes = (votes || []).reduce((acc, v) => {
          acc[v.newsId] = { fake: v.fake, notFake: v.notFake }; 
          return acc;
        }, {});
        
        // ลด loading time
        await new Promise(r => setTimeout(r, 200));
        
      } catch (error) {
        console.error("Error fetching news:", error);
        this.all = [];
        this.comments = {};
        this.votes = {};
      } finally {
        this.loading = false;
      }
    },
    
    setFilter(filter) { 
      this.filter = filter; 
      this.currentPage = 1; 
      this._fakeLoad(); 
    },
    
    setPageSize(size) { 
      this.pageSize = size; 
      this.currentPage = 1; 
    },
    
    setPage(page) { 
      this.currentPage = page; 
    },
    
    _fakeLoad() { 
      this.loading = true; 
      setTimeout(() => this.loading = false, 150); 
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
  }
});

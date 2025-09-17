# 🔄 Backend Integration Guide

## 📍 **Hardcoded Data Locations - FIXED!**

All hardcoded data has been **consolidated** into organized files for easy backend replacement:

### **✅ BEFORE (Scattered)**
- `src/App.tsx` - Lines 97-172: Large mockSegments array
- `src/App.tsx` - Lines 174-179: Hardcoded suggestions object  
- `src/App.tsx` - Line 185: Mock search filtering
- `src/App.tsx` - Line 194: Mock source filtering  
- `src/App.tsx` - Line 242: Mock duration calculation
- `src/components/audio-player.tsx` - Lines 61-84: Mock audio progress
- `src/components/superpod-sidebar.tsx` - Line 80: Mock duration calculation
- `src/components/superpod-details-modal.tsx` - Line 77: Mock auto-summary

### **✅ AFTER (Consolidated)**
- `src/data/mockData.ts` - **ALL** mock data in one organized file
- `src/services/mockApi.ts` - **ALL** API simulation logic
- Environment-controlled switching between mock and real APIs

---

## 🎯 **Quick Start for Your Developer**

### **Option 1: Environment Toggle (Recommended)**
```bash
# Use mock data (current)
REACT_APP_USE_MOCK_API=true

# Switch to real backend
REACT_APP_USE_MOCK_API=false
REACT_APP_API_URL=https://your-backend.com/api
```

### **Option 2: Gradual Migration**
Replace individual API calls one by one:

```typescript
// In src/services/mockApi.ts
async searchPodcasts(params) {
  // REPLACE THIS MOCK FUNCTION with real API call
  const response = await fetch('/api/search', { ... });
  return response.json();
}
```

---

## 📊 **Mock Data Structure**

### **Podcast Segments**
```typescript
// src/data/mockData.ts
export const mockPodcastSegments: PodcastSegment[] = [
  {
    id: "1",
    title: "The Future of AI in Creative Industries", 
    podcast: "Tech Talk Daily",
    duration: "8:45",
    tags: ["AI", "creativity", "technology", "future"],
    description: "...",
    transcript: "...",
    // ... complete with all fields your backend needs
  }
  // 6 total segments with realistic data
];
```

### **API Endpoints to Implement**
```typescript
// Your backend needs these endpoints:

GET  /api/search?query=AI&tags[]=technology
POST /api/superpods
GET  /api/superpods  
PATCH /api/superpods/:id
DELETE /api/superpods/:id
GET  /api/segments/:id
GET  /api/segments/:id/related
GET  /api/audio/:id
POST /api/ai/summarize
POST /api/ai/transitions
POST /api/auth/login
POST /api/auth/logout
```

---

## 🔄 **Migration Strategy**

### **Phase 1: Replace Mock API Service**
1. Keep `src/data/mockData.ts` as reference for data structure
2. Replace functions in `src/services/mockApi.ts` with real API calls
3. Test each endpoint individually

### **Phase 2: Update Components** 
Components are already prepared - they use the API service, so no changes needed!

### **Phase 3: Remove Mock Data**
Once backend is working:
1. Delete `src/data/mockData.ts`
2. Delete `src/services/mockApi.ts` 
3. Update environment variables

---

## 🎭 **Current Mock API Features**

### **✅ Realistic Behavior**
- Network delays (200-1500ms)
- Error handling and status codes
- Pagination support
- Search filtering and relevance scoring
- Graph positioning for knowledge graph

### **✅ Complete Data Set**
- **6 podcast segments** with full metadata
- **2 sample SuperPods** 
- **Graph connections** between segments
- **Search suggestions** for each direction
- **Audio metadata** with durations and waveforms
- **AI settings** with all options

### **✅ API Response Format**
```typescript
// All responses follow this format:
{
  success: boolean;
  data?: any;           // On success
  error?: {             // On error
    message: string;
    code: number;
    timestamp: string;
  };
  pagination?: {        // On paginated endpoints
    page: number;
    limit: number; 
    total: number;
  };
}
```

---

## 🔧 **Environment Configuration**

Create these files:

### **.env.development**
```bash
REACT_APP_USE_MOCK_API=true
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_DEBUG=true
```

### **.env.production**  
```bash
REACT_APP_USE_MOCK_API=false
REACT_APP_API_URL=https://api.superpod.com
REACT_APP_DEBUG=false
```

---

## 🎯 **Developer Checklist**

### **Backend Requirements**
- [ ] Implement all 12 API endpoints listed above
- [ ] Return data in the exact format shown in `mockData.ts`
- [ ] Handle pagination for search results
- [ ] Implement user authentication with JWT
- [ ] Set up audio file serving/streaming
- [ ] Add CORS headers for frontend domain

### **Data Requirements**
- [ ] Podcast segments with full metadata (title, description, transcript, tags, etc.)
- [ ] Audio files accessible via URL
- [ ] User management (registration, login, preferences)
- [ ] SuperPod storage and management
- [ ] Search indexing for segments
- [ ] AI integration for summaries and transitions

### **Testing**
- [ ] Test each API endpoint with Postman/curl
- [ ] Verify response formats match mock data structure  
- [ ] Test error handling (404, 500, validation errors)
- [ ] Load test search with large datasets
- [ ] Test audio streaming performance

---

## 🚀 **Ready for Handoff!**

Your developer now has:
- ✅ **Clear separation** between UI and data
- ✅ **Complete mock API** with realistic behavior  
- ✅ **Exact data formats** needed for backend
- ✅ **Environment-based switching** between mock and real APIs
- ✅ **All hardcoded data** consolidated in 2 files
- ✅ **12 specific API endpoints** to implement
- ✅ **Working prototype** they can test against

The frontend will work **exactly the same** once they replace the mock API functions with real backend calls! 🎉

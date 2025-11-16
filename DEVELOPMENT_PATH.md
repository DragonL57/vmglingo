# VMGLingo Development Path

This document outlines the complete development roadmap to transform VMGLingo into a comprehensive language learning platform.

## 🎯 Current State

- ✅ Basic course structure (Units, Lessons, Challenges)
- ✅ Two question types: SELECT and ASSIST
- ✅ Hearts system
- ✅ Points/XP system
- ✅ Basic shop with hearts refill
- ✅ Leaderboard
- ✅ User authentication (Clerk)
- ✅ Subscription system (Stripe)
- ✅ Admin panel for content management
- ✅ Vietnamese language interface for learning English

---

## 📋 Phase 1: Core Learning Experience (Weeks 1-4)

### 1.1 Expand Question Types
**Priority: High** | **Difficulty: Medium**

- [ ] Add TRANSLATION type (Vietnamese → English)
- [ ] Add REVERSE_TRANSLATION type (English → Vietnamese)
- [ ] Add FILL_IN_BLANK type
- [ ] Add MATCHING_PAIRS type
- [ ] Add WORD_ORDER type (arrange words to form sentence)
- [ ] Update database schema to support new types
- [ ] Create UI components for each type
- [ ] Add validation logic for each type

**Files to modify:**
- `db/schema.ts` - Update challengesEnum
- `app/lesson/challenge.tsx` - Add new challenge components
- `app/lesson/quiz.tsx` - Handle new challenge types
- `scripts/prod.ts` - Add sample data for new types

### 1.2 Enhanced Content Database
**Priority: High** | **Difficulty: Medium**

- [ ] Expand vocabulary to 500+ words
- [ ] Add themed units:
  - [ ] Greetings & Basics
  - [ ] Food & Drinks
  - [ ] Family & Relationships
  - [ ] Numbers & Time
  - [ ] Travel & Transportation
  - [ ] Work & Education
  - [ ] Health & Body
  - [ ] Hobbies & Entertainment
- [ ] Add grammar explanations table
- [ ] Create tips/notes for each lesson
- [ ] Add example sentences

**Files to create/modify:**
- `db/schema.ts` - Add grammarNotes, lessonTips tables
- `scripts/seed-vocabulary.ts` - Comprehensive vocabulary data
- `components/lesson-tips.tsx` - Tips display component

### 1.3 Better Feedback System
**Priority: High** | **Difficulty: Low**

- [ ] Show correct answer when user is wrong
- [ ] Add explanation for why answer is correct
- [ ] Add "Report a problem" button
- [ ] Show alternative correct answers
- [ ] Add encouraging messages based on performance

**Files to modify:**
- `app/lesson/result-card.tsx`
- `app/lesson/footer.tsx`
- `components/modals/feedback-modal.tsx` (new)

---

## 📋 Phase 2: Skill Progression & Review (Weeks 5-8)

### 2.1 Skill Strength System
**Priority: High** | **Difficulty: High**

- [ ] Add strength meter to each lesson (0-5 levels)
- [ ] Implement spaced repetition algorithm
- [ ] Decay strength over time if not practiced
- [ ] Add "Practice" button for weak skills
- [ ] Track individual word strength
- [ ] Show "words to review" count

**Files to create/modify:**
- `db/schema.ts` - Add skillStrength, wordProgress tables
- `actions/skill-progress.ts` - Strength calculation logic
- `app/(main)/learn/lesson-button.tsx` - Show strength meter
- `lib/spaced-repetition.ts` - SRS algorithm

### 2.2 Review & Practice Modes
**Priority: Medium** | **Difficulty: Medium**

- [ ] Add "Review weak words" mode
- [ ] Add "Timed practice" mode
- [ ] Add "Legendary level" challenges
- [ ] Create practice-only sessions (no hearts lost)
- [ ] Add "Mixed review" across multiple lessons

**Files to create/modify:**
- `app/(main)/practice/page.tsx` (new)
- `app/(main)/practice/timed/page.tsx` (new)
- `components/practice-mode-selector.tsx` (new)

### 2.3 Skill Tree UI
**Priority: Medium** | **Difficulty: Medium**

- [ ] Redesign learn page to show skill tree
- [ ] Add locked/unlocked visual states
- [ ] Show progress percentage on each skill
- [ ] Add checkpoint tests every 5 lessons
- [ ] Visual connections between skills

**Files to modify:**
- `app/(main)/learn/page.tsx`
- `app/(main)/learn/skill-node.tsx` (new)
- `app/(main)/learn/checkpoint.tsx` (new)

---

## 📋 Phase 3: Gamification & Engagement (Weeks 9-12)

### 3.1 Streaks & Daily Goals
**Priority: High** | **Difficulty: Medium**

- [ ] Add daily streak counter
- [ ] Add streak freeze (purchasable with gems)
- [ ] Set daily XP goals (customizable)
- [ ] Add "Streak Saver" notification
- [ ] Show streak in profile
- [ ] Add longest streak record
- [ ] Celebrate milestone streaks (7, 30, 100, 365 days)

**Files to create/modify:**
- `db/schema.ts` - Add streaks, dailyGoals tables
- `actions/streak-actions.ts` (new)
- `components/streak-display.tsx` (new)
- `components/modals/streak-freeze-modal.tsx` (new)
- `app/(main)/learn/header.tsx` - Show streak

### 3.2 League System
**Priority: Medium** | **Difficulty: High**

- [ ] Implement weekly leagues (Bronze → Diamond → Pearl)
- [ ] Add promotion/demotion system
- [ ] Weekly leaderboard reset
- [ ] League rewards (XP boost, badges)
- [ ] Show league progress in leaderboard
- [ ] Add "shield" to prevent demotion

**Files to create/modify:**
- `db/schema.ts` - Add leagues, weeklyProgress tables
- `actions/league-actions.ts` (new)
- `app/(main)/leaderboard/page.tsx` - Update with leagues
- `components/league-badge.tsx` (new)
- `lib/league-system.ts` - League logic

### 3.3 Achievements & Badges
**Priority: Low** | **Difficulty: Medium**

- [ ] Create achievement system
- [ ] Add badges for milestones:
  - [ ] First lesson completed
  - [ ] 10/50/100 lessons completed
  - [ ] 7/30/100 day streak
  - [ ] Perfect lesson (no mistakes)
  - [ ] 10 perfect lessons in a row
  - [ ] Complete a unit
  - [ ] Reach top 10 in league
- [ ] Display badges on profile
- [ ] Add achievement notifications

**Files to create/modify:**
- `db/schema.ts` - Add achievements, userAchievements tables
- `actions/achievement-actions.ts` (new)
- `app/(main)/profile/page.tsx` (new)
- `components/achievement-badge.tsx` (new)
- `components/modals/achievement-unlocked-modal.tsx` (new)

### 3.4 Enhanced Shop System
**Priority: Low** | **Difficulty: Low**

- [ ] Add gem currency (earned through achievements)
- [ ] Add shop items:
  - [ ] Streak freeze
  - [ ] Heart refill
  - [ ] XP boost (2x for 1 hour)
  - [ ] League shield
  - [ ] Mascot outfits/accessories
- [ ] Add item inventory
- [ ] Add "Use item" functionality

**Files to modify:**
- `db/schema.ts` - Add gems, inventory, shopItems tables
- `app/(main)/shop/page.tsx`
- `app/(main)/shop/items.tsx`
- `actions/shop-actions.ts` (new)

---

## 📋 Phase 4: Audio & Speaking (Weeks 13-16)

### 4.1 Professional Audio Integration
**Priority: High** | **Difficulty: Medium**

- [ ] Record/source native speaker audio for all vocabulary
- [ ] Add slow playback option
- [ ] Add audio for sentences
- [ ] Multiple voice options (male/female)
- [ ] Different accent options (US/UK)
- [ ] Audio quality settings

**Files to modify:**
- `app/lesson/challenge.tsx` - Add audio controls
- `components/audio-player.tsx` (new)
- `public/audio/` - Organize audio files

### 4.2 Listening Comprehension
**Priority: High** | **Difficulty: Medium**

- [ ] Add LISTENING question type
- [ ] Play audio, user types what they hear
- [ ] Show audio waveform
- [ ] Add "Slow" and "Normal" speed buttons
- [ ] Add "Can't hear" report option

**Files to create/modify:**
- `db/schema.ts` - Add LISTENING to challengesEnum
- `app/lesson/listening-challenge.tsx` (new)
- `scripts/prod.ts` - Add listening challenges

### 4.3 Speaking Practice
**Priority: Medium** | **Difficulty: High**

- [ ] Integrate Web Speech API
- [ ] Add SPEAKING question type
- [ ] Show pronunciation feedback
- [ ] Add "Skip" option for public places
- [ ] Record and playback user's voice
- [ ] Score pronunciation accuracy

**Files to create/modify:**
- `db/schema.ts` - Add SPEAKING to challengesEnum
- `app/lesson/speaking-challenge.tsx` (new)
- `lib/speech-recognition.ts` (new)
- `components/microphone-access.tsx` (new)

---

## 📋 Phase 5: Social Features (Weeks 17-20)

### 5.1 Friends System
**Priority: Low** | **Difficulty: Medium**

- [ ] Add friend requests
- [ ] Follow/unfollow users
- [ ] See friends' progress
- [ ] Compare XP with friends
- [ ] Friends leaderboard
- [ ] Activity feed

**Files to create/modify:**
- `db/schema.ts` - Add friendships, friendRequests tables
- `actions/friend-actions.ts` (new)
- `app/(main)/friends/page.tsx` (new)
- `components/friend-card.tsx` (new)

### 5.2 Clubs/Groups
**Priority: Low** | **Difficulty: Medium**

- [ ] Create/join clubs
- [ ] Club leaderboard
- [ ] Club chat/discussion
- [ ] Club challenges
- [ ] Club achievements

**Files to create/modify:**
- `db/schema.ts` - Add clubs, clubMembers tables
- `app/(main)/clubs/page.tsx` (new)
- `app/(main)/clubs/[clubId]/page.tsx` (new)

### 5.3 Discussion Forums
**Priority: Low** | **Difficulty: High**

- [ ] Lesson-specific discussions
- [ ] Ask questions about exercises
- [ ] Upvote/downvote answers
- [ ] Mark best answer
- [ ] Moderation system

**Files to create/modify:**
- `db/schema.ts` - Add discussions, comments tables
- `app/(main)/discussions/page.tsx` (new)
- `app/(main)/discussions/[discussionId]/page.tsx` (new)

---

## 📋 Phase 6: Advanced Features (Weeks 21-24)

### 6.1 Stories Mode
**Priority: Medium** | **Difficulty: High**

- [ ] Create interactive stories
- [ ] Fill-in-blank within story context
- [ ] Multiple choice questions about story
- [ ] Audio narration
- [ ] Difficulty levels (beginner/intermediate/advanced)
- [ ] Track stories completed

**Files to create/modify:**
- `db/schema.ts` - Add stories, storyParagraphs tables
- `app/(main)/stories/page.tsx` (new)
- `app/(main)/stories/[storyId]/page.tsx` (new)
- `components/story-reader.tsx` (new)

### 6.2 Placement Test
**Priority: Medium** | **Difficulty: Medium**

- [ ] Create placement test for new users
- [ ] Determine starting level
- [ ] Skip already known content
- [ ] Test across multiple skills
- [ ] Show placement results

**Files to create/modify:**
- `app/(main)/placement/page.tsx` (new)
- `actions/placement-test.ts` (new)
- `lib/placement-algorithm.ts` (new)

### 6.3 Progress Analytics
**Priority: Medium** | **Difficulty: Medium**

- [ ] Add detailed progress dashboard
- [ ] Show graphs:
  - [ ] XP over time
  - [ ] Lessons completed per week
  - [ ] Accuracy rate
  - [ ] Time spent learning
- [ ] Vocabulary count
- [ ] Weakest areas
- [ ] Study time heatmap
- [ ] Personalized insights

**Files to create/modify:**
- `app/(main)/progress/page.tsx` (new)
- `components/charts/xp-chart.tsx` (new)
- `components/charts/heatmap.tsx` (new)
- `actions/analytics-actions.ts` (new)

### 6.4 Offline Mode & PWA
**Priority: Medium** | **Difficulty: High**

- [ ] Configure PWA manifest
- [ ] Add service worker for offline caching
- [ ] Cache lessons for offline use
- [ ] Sync progress when back online
- [ ] Download lessons for offline use
- [ ] Offline indicator in UI

**Files to create/modify:**
- `public/manifest.json` (new)
- `public/sw.js` (new)
- `app/layout.tsx` - Register service worker
- `lib/offline-sync.ts` (new)

---

## 📋 Phase 7: Polish & Optimization (Weeks 25-28)

### 7.1 Notifications & Reminders
**Priority: Medium** | **Difficulty: Medium**

- [ ] Push notifications for practice reminders
- [ ] Email notifications for streaks at risk
- [ ] In-app notifications
- [ ] Notification preferences
- [ ] Smart timing based on user habits

**Files to create/modify:**
- `lib/notifications.ts` (new)
- `app/api/notifications/route.ts` (new)
- `app/(main)/settings/notifications/page.tsx` (new)

### 7.2 Accessibility Improvements
**Priority: Medium** | **Difficulty: Medium**

- [ ] Complete keyboard navigation
- [ ] Screen reader support (ARIA labels)
- [ ] High contrast mode
- [ ] Text size adjustment
- [ ] Reduced motion option
- [ ] Color blind friendly colors

**Files to modify:**
- All component files - Add ARIA labels
- `app/globals.css` - Add accessibility classes
- `app/(main)/settings/accessibility/page.tsx` (new)

### 7.3 Performance Optimization
**Priority: High** | **Difficulty: Medium**

- [ ] Implement lazy loading for lessons
- [ ] Optimize images (use next/image)
- [ ] Database query optimization
- [ ] Add caching strategy
- [ ] Code splitting
- [ ] Bundle size optimization

**Files to modify:**
- `next.config.mjs` - Optimize build
- All page components - Add lazy loading
- `db/queries.ts` - Optimize queries

### 7.4 Mobile Responsiveness
**Priority: High** | **Difficulty: Medium**

- [ ] Test all pages on mobile devices
- [ ] Optimize touch targets
- [ ] Mobile-specific UI adjustments
- [ ] Swipe gestures for navigation
- [ ] Mobile keyboard optimization
- [ ] Portrait/landscape support

**Files to modify:**
- All component files - Add mobile styles
- `app/globals.css` - Mobile breakpoints

---

## 📋 Phase 8: Content Expansion (Ongoing)

### 8.1 Vocabulary Expansion
**Priority: High** | **Difficulty: Low-Medium**

- [ ] Expand to 2000+ words
- [ ] Add idioms and expressions
- [ ] Business English
- [ ] Academic English
- [ ] Conversational phrases
- [ ] Slang and informal language

### 8.2 Grammar Lessons
**Priority: High** | **Difficulty: High**

- [ ] Present tense
- [ ] Past tense
- [ ] Future tense
- [ ] Conditionals
- [ ] Passive voice
- [ ] Articles (a/an/the)
- [ ] Prepositions
- [ ] Phrasal verbs
- [ ] Modal verbs

### 8.3 Additional Courses
**Priority: Low** | **Difficulty: High**

- [ ] Add more languages to learn from Vietnamese
- [ ] Different proficiency levels
- [ ] Specialized courses (Business, Travel, etc.)

---

## 🎯 Success Metrics

Track these KPIs to measure success:

- **User Engagement:**
  - Daily Active Users (DAU)
  - Average session duration
  - Lessons completed per user
  - Retention rate (D1, D7, D30)

- **Learning Effectiveness:**
  - Average accuracy rate
  - Words learned per user
  - Completion rate per lesson
  - Progress speed

- **Gamification:**
  - Average streak length
  - League participation rate
  - Achievement unlock rate
  - Shop item usage

---

## 🛠️ Technical Stack Requirements

### Current Stack:
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Drizzle ORM
- PostgreSQL (Neon)
- Clerk (Auth)
- Stripe (Payments)

### Additional Tools Needed:
- **Speech Recognition:** Web Speech API / Google Cloud Speech-to-Text
- **Audio Processing:** Howler.js or similar
- **Charts:** Recharts or Chart.js
- **Animations:** Framer Motion
- **PWA:** next-pwa
- **Push Notifications:** Web Push API / Firebase Cloud Messaging
- **Real-time:** Pusher or Socket.io (for chat/social features)
- **Image Optimization:** Sharp (already in Next.js)
- **Testing:** Jest + React Testing Library
- **E2E Testing:** Playwright or Cypress

---

## 📝 Development Best Practices

1. **Version Control:**
   - Create feature branches for each phase
   - Regular commits with meaningful messages
   - Pull request reviews before merging

2. **Testing:**
   - Write unit tests for business logic
   - E2E tests for critical user flows
   - Test on multiple devices/browsers

3. **Documentation:**
   - Keep README updated
   - Document API endpoints
   - Component documentation
   - Update this roadmap as needed

4. **Code Quality:**
   - ESLint + Prettier
   - TypeScript strict mode
   - Code reviews
   - Refactor regularly

5. **Database:**
   - Regular backups
   - Migration strategy
   - Index optimization
   - Monitor query performance

---

## 🚀 Quick Start Guide

To start implementing this roadmap:

1. **Choose a phase** based on priority and your skills
2. **Create a feature branch:** `git checkout -b feature/phase-1-question-types`
3. **Implement the feature** following the checklist
4. **Test thoroughly** on different devices
5. **Commit and push:** Include meaningful commit messages
6. **Deploy to staging** for testing
7. **Merge to main** and deploy to production

---

## 📞 Next Steps

**Immediate priorities (Next 2 weeks):**
1. ✅ Expand question types (TRANSLATION, FILL_IN_BLANK)
2. ✅ Add 200+ more vocabulary words
3. ✅ Implement skill strength system
4. ✅ Add streak tracking

**What to work on first?** 
Start with Phase 1.1 (Expand Question Types) as it's high priority and will significantly improve the learning experience.

Good luck building VMGLingo! 🎉

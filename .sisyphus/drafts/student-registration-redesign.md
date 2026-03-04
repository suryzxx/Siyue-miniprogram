# Draft: Student Registration Page Redesign

## Current State Analysis

### File Structure
- `pages/enroll/select-student.js` - Page logic and handlers
- `pages/enroll/select-student.wxml` - Template structure
- `pages/enroll/select-student.wxss` - Styling
- `pages/enroll/select-student.json` - Page configuration

### Current Student Card Implementation
**Template (WXML):**
```xml
<view class="student-item {{selectedStudentId === item.id ? 'is-active' : ''}}"
      wx:for="{{students}}" wx:key="id" data-id="{{item.id}}" bindtap="onSelectStudent">
  <image class="avatar" src="{{item.avatar}}" mode="aspectFill" />
  <view class="student-info">
    <text class="student-name">{{item.name}}</text>
    <text class="student-meta">性别：{{item.gender}} · 
      <text wx:if="{{item.needTest === true}}" class="book-test-link" data-id="{{item.id}}" bindtap="onBookTest">待评测</text>
      <text wx:else>{{item.evaluationStatus}}</text>
    </text>
  </view>
</view>
```

**Current Layout:**
- Line 1: Student name
- Line 2: "性别：[gender] · [status]" where status is either:
  - "待评测" (clickable link) for `needTest === true`
  - Level (e.g., "K3飞跃") for evaluated students

**Current Data Structure (from app.js):**
```javascript
{
  id: string,
  name: string,
  gender: string,  // "男" or "女"
  birthDate: string,
  avatar: string,
  level: string | null,  // null = not evaluated
  needTest: boolean      // true if level is null
}
```

### Current Click Behavior
1. **Card click** (`onSelectStudent`): Sets `selectedStudentId`
2. **"待评测" link click** (`onBookTest`): Navigates to `/pages/student/book-test?studentId={{id}}`
3. **"下一步" button** (`onNext`): Only enabled when `canProceed` is true

### Current Logic
**Computed Properties:**
```javascript
evaluationStatus(item) {
  if (item.level !== null) {
    return item.level;
  } else if (item.needTest === true) {
    return '待评测';
  } else {
    return '';
  }
},
canProceed() {
  const selectedStudent = this.data.students.find(
    (item) => item.id === this.data.selectedStudentId
  );
  return selectedStudent && !selectedStudent.needTest;
}
```

**Navigation Flow:**
- "待评测" students → `/pages/student/book-test?studentId={{id}}`
- Evaluated students → Order/payment page (based on course availability)

## New Requirements Analysis

### 1. Student Card Layout Redesign
**Required Changes:**
- Remove gender display entirely
- New layout:
  - Line 1: Student name (keep as is)
  - Line 2: Level OR "待评测" tag (no gender)

### 2. Click Behavior Changes
**Required Logic:**
- Students with "待评测" status: Click navigates to book-test page
- Students with existing levels: Click selects student and enables "下一步" button

**Current vs New:**
- **Current**: Card click always selects student, "待评测" is separate clickable link
- **New**: Card click behavior depends on student status

### 3. Navigation Flow
- **待评测 students**: `/pages/student/book-test?studentId={{id}}`
- **Evaluated students**: Enable registration → Order payment page

### 4. Button Logic
- "下一步" button only enabled for evaluated students
- Show order/payment page when enabled

## Key Questions to Resolve

1. **Selection Logic**: Should we preserve current selection pattern or change it?
2. **Click Handler**: Should card click behavior be unified or split?
3. **Styling Updates**: How to update card layout for new design?
4. **Data Flow**: Any adjustments needed to student data structure?
5. **Component Structure**: Should we create a reusable student card component?

## Additional Analysis from Background Agent

### Current Navigation Flow
1. **Course detail page** → checks if student needs test
2. **If needs test**: shows modal → navigates to book-test
3. **If no test needed**: navigates to select-student page
4. **Select-student page** → validates `canProceed` before allowing next step

### Key Business Rules
- Students must complete level test before enrolling in courses
- "待评测" is a clickable link that navigates to test booking
- Next button is disabled for students needing tests
- Course level must match student level (checked in course detail)

### Existing Tag Patterns in Codebase
Found multiple tag/badge patterns in other pages:
- `.level-tag` - For displaying student levels
- `.need-test-tag` - For "待评测" status
- `.status-chip` - For various status displays
- `.course-tag` - For course-related tags

These suggest we should follow existing design patterns for consistency.

## Test Infrastructure Assessment
**Initial findings**: No test infrastructure found in project
- No package.json file
- No test configuration files (jest.config, vitest.config, etc.)
- No test files (*.test.*, *.spec.*)
- This appears to be a standard WeChat miniprogram without automated tests

**Verification approach needed**: Manual verification via WeChat Developer Tools and browser automation

## Finalized Requirements (Based on User Confirmation)
1. **Click Behavior**: Hybrid approach - entire card clickable for "待评测" students (navigates to book-test), card selection for evaluated students (enables "下一步")
2. **Visual Display**: Use existing `.level-tag` and `.need-test-tag` patterns from other pages for consistency
3. **Selection Highlighting**: Blue border only for evaluated students (since they can proceed)
4. **Styling**: Follow existing patterns from `pages/student/manage.wxss`
5. **Component Structure**: Modify inline implementation (no new component creation)
6. **Data Flow**: Keep current `evaluationStatus` computed property but simplify output

## Remaining Questions for Plan Generation
1. **Test Strategy**: Since no test infrastructure exists, we need manual verification procedures
2. **Edge Cases**: Need to define handling for empty states, loading states, error cases
3. **Performance Considerations**: Any specific performance requirements for the UI updates?
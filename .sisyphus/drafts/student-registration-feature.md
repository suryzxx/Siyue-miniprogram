# Draft: Student Registration Feature Implementation

## Requirements Analysis

### User Requirements:
1. On the immediate registration student selection page, show student cards with grade information
2. For students without evaluation: show "待评测" (pending evaluation) after their grade
3. For students with evaluation: show their evaluation level (e.g., "K3飞跃") after their grade  
4. Students with "待评测" status should be clickable and navigate to an appointment/scheduling page for level testing
5. Only students with evaluation levels can proceed with immediate registration

### Current Examples Mentioned:
- 秦思: "待评测" (pending evaluation)
- sury: "待评测" (pending evaluation)  
- cat: "K3飞跃" level (has evaluation)

## Codebase Analysis Findings

### 1. Project Structure
- WeChat mini-program with standard structure
- Main directories: pages, components, utils, images
- Student-related pages exist in `pages/student/` and `pages/enroll/`

### 2. Student Data Structure (from app.js)
Students have these key fields:
- `id`: Student ID (string)
- `name`: Student name (string)
- `gender`: Gender (string)
- `birthDate`: Birth date (string)
- `avatar`: Avatar image URL (string)
- `level`: Evaluation level (string or null) - **CRITICAL FIELD**
  - `null`: Not evaluated
  - String like "K3飞跃": Has evaluation level
- `needTest`: Boolean derived from level
  - `true`: When level is null (needs evaluation)
  - `false`: When level exists (already evaluated)

### 3. Existing Pages Identified
- `pages/enroll/select-student`: Current student selection page for registration
- `pages/student/book-test`: Appointment scheduling page for level testing
- `pages/student/manage`: Student management page with evaluation status display

### 4. Current Implementation Status
**Student Management Page (`pages/student/manage`)**:
- Already displays "待测评" for students with `needTest: true`
- Already displays evaluation level for students with `level` field
- Has navigation to book-test page via `onBookTest` function

**Student Selection Page (`pages/enroll/select-student`)**:
- Currently only shows: name, grade, gender
- **MISSING**: Evaluation status display
- **MISSING**: Navigation logic for "待评测" students
- **MISSING**: Validation for registration eligibility

**Book Test Page (`pages/student/book-test`)**:
- Complete appointment scheduling flow exists
- Can simulate test completion with `onSimulateComplete()` function
- Updates student's `level` field and sets `needTest: false`

### 5. Navigation Patterns
- `wx.navigateTo()` used for page navigation
- Parameters passed via URL query strings
- Book-test page expects `studentId` parameter

## Technical Decisions (Recommended)

### 1. Grade Field Resolution
**Decision**: Remove grade display from UI (simplest solution)
**Rationale**: 
- Student data structure doesn't have grade field
- No grade calculation found in codebase
- Removing `{{item.grade}}` from WXML is cleanest fix
- Can add grade later if needed

### 2. UI Display Logic
**Decision**: Show evaluation status inline after gender
**Layout**: `年级：{{item.grade}} · 性别：{{item.gender}} · {{evaluationStatus}}`
**Styling**: 
- "待评测": Red text with underline (clickable link)
- "K3飞跃": Green text (static)
**Implementation**: Add `evaluationStatus` computed property in JS

### 3. Navigation Logic
**Decision**: Make "待评测" clickable link that navigates to book-test
**Flow**: 
1. Click "待评测" → Navigate to `/pages/student/book-test?studentId={{item.id}}`
2. After booking → Return to selection page via `wx.navigateBack()`
3. Student data refreshed automatically from app.globalData

### 4. Registration Validation
**Decision**: Disable "下一步" button for "待评测" students
**Implementation**:
- Add `canProceed` computed property based on `student.level`
- Disable button with CSS class when `!canProceed`
- Show tooltip: "请先完成等级测试"
- Alternative: Show error message on click (less user-friendly)

### 5. Test Strategy
**Decision**: Manual verification (no test infrastructure found)
**Verification Steps**:
1. Visual inspection of UI changes
2. Click testing for navigation
3. Data flow validation
4. Cross-browser/device testing

### 6. Data Flow
**Decision**: Rely on existing app.globalData synchronization
**Implementation**:
- Student data already in `app.globalData.students`
- Book-test page updates `level` field via `app.completeStudentTest()`
- Selection page automatically gets updated data on return
- No additional synchronization needed

## New Findings from Explore Agent

### 1. Grade Information Mystery
- WXML files reference `student.grade` but student data structure doesn't have `grade` field
- Possible scenarios:
  - Grade is calculated from `birthDate` somewhere (not found in codebase)
  - Grade is added dynamically to student objects
  - This is a bug or missing implementation

### 2. Course Enrollment Integration
- Course detail page validates student has completed evaluation
- Enforces `student.level === course.level` requirement
- Redirects to evaluation booking if student needs test

### 3. Personal Center Display
- `pages/my/my.js` also shows "待测评" display
- Consistent evaluation status display across multiple pages

### 4. Status Constants
- `utils/status.js` has `ASSESS_STATUS` constants: `UNASSESSED` and `ASSESSED`
- Could be used for more standardized status handling

## Open Questions

1. **Grade Information**: Need to resolve the `grade` field discrepancy. Options:
   - Add grade calculation from birthDate
   - Add grade field to student data structure
   - Remove grade display from WXML (simplest)

2. **Mock Data**: Are there example students with different evaluation statuses for testing?

3. **Styling**: Should we reuse styles from student management page or create new ones?

4. **Error Handling**: How strict should registration validation be?
   - Option A: Disable "下一步" button for "待评测" students
   - Option B: Allow selection but show error on click
   - Option C: Show warning but allow override

5. **User Experience**: Should we show warning before navigating to book-test?
   - "您需要先完成等级测试才能报名课程，是否立即预约？"

## Scope Boundaries

### INCLUDE:
- Update student selection page UI to show evaluation status
- Add clickable "待评测" navigation to book-test page
- Add registration validation for evaluation status
- Reuse existing book-test page functionality
- Maintain consistent styling with existing pages

### EXCLUDE:
- Modifying student data structure (already suitable)
- Creating new appointment scheduling page (exists)
- Changing student management page (already works)
- Adding new evaluation levels (handled by existing system)
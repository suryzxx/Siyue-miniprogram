# Student Registration Feature Implementation

## TL;DR

> **Quick Summary**: Enhance the student selection page to show evaluation status, make "待评测" clickable for test booking, and prevent registration for unevaluated students.
> 
> **Deliverables**: 
> - Updated student selection page with evaluation status display
> - Clickable "待评测" navigation to book-test page
> - Registration validation for evaluated students only
> - Fixed grade field discrepancy
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Fix grade field → Add evaluation display → Implement navigation → Add validation

---

## Context

### Original Request
Implement a feature for a mini-program's student registration page:
1. Show student cards with grade information
2. For students without evaluation: show "待评测" (pending evaluation) after their grade
3. For students with evaluation: show their evaluation level (e.g., "K3飞跃") after their grade  
4. Students with "待评测" status should be clickable and navigate to an appointment/scheduling page for level testing
5. Only students with evaluation levels can proceed with immediate registration

### Interview Summary
**Key Discussions**:
- Student data structure has `level` field (null = not evaluated, string = evaluated)
- `needTest` boolean derived from level
- Book-test page exists at `pages/student/book-test`
- Grade field referenced in WXML but doesn't exist in data structure

**Research Findings**:
1. Student management page already shows "待测评" and evaluation levels
2. Book-test page complete with appointment scheduling
3. No test infrastructure found (manual verification needed)
4. Grade field discrepancy needs resolution

### Metis Review
**Identified Gaps** (addressed):
- Grade field discrepancy: Removing grade display (simplest fix)
- Navigation flow: Click "待评测" → book-test → return to selection
- Validation: Disable "下一步" button for unevaluated students
- Styling: Reuse patterns from student management page

---

## Work Objectives

### Core Objective
Enhance the student selection page to display evaluation status, enable test booking for unevaluated students, and enforce evaluation requirement for registration.

### Concrete Deliverables
1. Updated `pages/enroll/select-student.wxml` with evaluation status display
2. Updated `pages/enroll/select-student.js` with navigation and validation logic
3. Updated `pages/enroll/select-student.wxss` with styling for evaluation status
4. Fixed grade field discrepancy in WXML

### Definition of Done
- [ ] Student cards show evaluation status ("待评测" or level)
- [ ] "待评测" is clickable and navigates to book-test page
- [ ] "下一步" button disabled for "待评测" students
- [ ] Grade field removed from display (fixes missing data issue)
- [ ] Manual verification confirms all functionality works

### Must Have
- Evaluation status display for all students
- Navigation to book-test for unevaluated students
- Registration validation based on evaluation status
- Consistent styling with existing pages

### Must NOT Have (Guardrails)
- No changes to student data structure (already suitable)
- No new appointment scheduling page (use existing book-test)
- No modifications to student management page (already works)
- No addition of new evaluation levels (handled by existing system)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: Manual-only
- **Framework**: None (WeChat mini-program)

### Manual Verification Procedures
Each TODO includes executable verification procedures that agents can run directly:

**For UI Changes** (using visual inspection):
```
# Agent executes via visual verification:
1. Navigate to: pages/enroll/select-student page
2. Verify: Student cards show evaluation status
3. Verify: "待评测" appears in red with underline
4. Verify: Evaluation levels appear in green
5. Verify: Grade field removed from display
6. Screenshot: .sisyphus/evidence/task-1-ui-changes.png
```

**For Navigation Testing** (using interactive verification):
```
# Agent executes via click testing:
1. Click: "待评测" text on unevaluated student
2. Verify: Navigates to /pages/student/book-test?studentId={id}
3. Navigate back: Return to selection page
4. Verify: URL parameters passed correctly
5. Screenshot: .sisyphus/evidence/task-2-navigation.png
```

**For Validation Testing** (using interactive verification):
```
# Agent executes via button testing:
1. Select: Unevaluated student ("待评测")
2. Verify: "下一步" button is disabled
3. Verify: Tooltip shows "请先完成等级测试"
4. Select: Evaluated student (has level)
5. Verify: "下一步" button is enabled
6. Click: "下一步" for evaluated student
7. Verify: Navigates to order/waitlist confirmation
8. Screenshot: .sisyphus/evidence/task-3-validation.png
```

**Evidence to Capture**:
- [ ] Screenshots of UI changes in .sisyphus/evidence/
- [ ] Terminal output from verification commands
- [ ] Navigation success confirmation

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Fix grade field discrepancy (remove from WXML)
└── Task 2: Add evaluation status display to student cards

Wave 2 (After Wave 1):
├── Task 3: Implement clickable "待评测" navigation
└── Task 4: Add registration validation logic

Critical Path: Task 1 → Task 2 → Task 3 → Task 4
Parallel Speedup: ~30% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 3, 4 | 2 |
| 2 | 1 | 3, 4 | 1 |
| 3 | 1, 2 | 4 | 4 |
| 4 | 1, 2, 3 | None | 3 |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2 | delegate_task(category="quick", load_skills=[], run_in_background=true) |
| 2 | 3, 4 | dispatch parallel after Wave 1 completes |

---

## TODOs

> Implementation + Verification = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info.

- [ ] 1. Fix Grade Field Discrepancy

  **What to do**:
  - Remove `{{item.grade}}` reference from `pages/enroll/select-student.wxml`
  - Update student metadata line to: `性别：{{item.gender}}`
  - Remove any grade-related styling if present

  **Must NOT do**:
  - Don't add grade calculation logic
  - Don't modify student data structure
  - Don't change other pages

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple WXML edit, no complex logic needed
  - **Skills**: None needed for basic file editing
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed for simple text removal
    - `git-master`: Not needed for single file edit

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Tasks 2, 3, 4
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  **File References**:
  - `pages/enroll/select-student.wxml:24` - Current line with grade reference: `<text class="student-meta">年级：{{item.grade}} · 性别：{{item.gender}}</text>`
  - `app.js:98-106` - Student data structure showing no grade field
  - `pages/student/manage.wxml:23` - Alternative metadata format without grade

  **Pattern References**:
  - `pages/student/manage.wxml:23` - Student metadata pattern: `出生：{{currentStudent.birthDate}} · 性别：{{currentStudent.gender}}`
  - `pages/waitlist/confirm.wxml` - Similar student display pattern

  **WHY Each Reference Matters**:
  - `select-student.wxml:24`: Target line to modify
  - `app.js:98-106`: Confirms grade field doesn't exist in data
  - `student/manage.wxml:23`: Shows alternative format without grade

  **Acceptance Criteria**:

  **Automated Verification** (using visual inspection):
  ```
  # Agent executes via file read and comparison:
  1. Read: pages/enroll/select-student.wxml
  2. Verify: Line 24 no longer contains "{{item.grade}}"
  3. Verify: Line shows "性别：{{item.gender}}" only
  4. Read: pages/enroll/select-student.wxss
  5. Verify: No unused grade-related styles
  6. Screenshot: .sisyphus/evidence/task-1-grade-fixed.png
  ```

  **Evidence to Capture**:
  - [ ] Updated WXML file content
  - [ ] Screenshot showing removed grade reference
  - [ ] Verification command output

  **Commit**: YES
  - Message: `fix(enroll): remove grade field from student selection`
  - Files: `pages/enroll/select-student.wxml`
  - Pre-commit: Visual verification of changes

- [ ] 2. Add Evaluation Status Display to Student Cards

  **What to do**:
  - Add computed property `evaluationStatus` in `select-student.js`
  - Update WXML to show status after gender: `性别：{{item.gender}} · {{item.evaluationStatus}}`
  - Add CSS styles for "待评测" (red, underline) and level (green)
  - Ensure styling matches student management page patterns

  **Must NOT do**:
  - Don't create new evaluation status logic (use existing level/needTest)
  - Don't modify student data structure
  - Don't change navigation behavior yet (Task 3)

  **Recommended Agent Profile**:
  - **Category**: `frontend-ui-ux`
    - Reason: UI styling and component updates needed
  - **Skills**: None needed (frontend-ui-ux covers it)
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed for implementation
    - `playwright`: Not needed for static UI

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 1)
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Tasks 3, 4
  - **Blocked By**: Task 1 (needs grade fix first)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References**:
  - `pages/student/manage.wxml:26-33` - Evaluation status display pattern
  - `pages/student/manage.wxss` - CSS for level-tag and need-test-tag
  - `app.js:104-105` - Level and needTest field definitions

  **Code References**:
  - `pages/enroll/select-student.js:17` - Current students data binding
  - `pages/student/manage.js` - Example of student data processing

  **Styling References**:
  - `pages/student/manage.wxss` - .level-tag (green), .need-test-tag (red)
  - `pages/enroll/select-student.wxss` - Current student card styles

  **WHY Each Reference Matters**:
  - `student/manage.wxml:26-33`: Shows exact pattern for conditional evaluation display
  - `student/manage.wxss`: Provides styling for status tags
  - `app.js:104-105`: Defines the data fields to check

  **Acceptance Criteria**:

  **Automated Verification** (using visual inspection):
  ```
  # Agent executes via visual verification:
  1. Navigate to: pages/enroll/select-student page
  2. Verify: Each student card shows evaluation status
  3. Verify: "待评测" appears in red with underline style
  4. Verify: Evaluation levels (e.g., "K3飞跃") appear in green
  5. Verify: Status appears after gender: "性别：男 · 待评测"
  6. Screenshot: .sisyphus/evidence/task-2-status-display.png
  ```

  **Code Verification**:
  ```
  # Agent executes via file read:
  1. Read: pages/enroll/select-student.js
  2. Verify: evaluationStatus computed property exists
  3. Verify: Logic checks item.level and item.needTest
  4. Read: pages/enroll/select-student.wxml
  5. Verify: evaluationStatus binding in template
  6. Read: pages/enroll/select-student.wxss
  7. Verify: CSS styles for .evaluation-status, .pending-eval, .has-eval
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of evaluation status display
  - [ ] Updated JS file with computed property
  - [ ] Updated WXML with status binding
  - [ ] Updated WXSS with styling

  **Commit**: YES (group with Task 1)
  - Message: `feat(enroll): add evaluation status to student cards`
  - Files: `pages/enroll/select-student.js`, `pages/enroll/select-student.wxml`, `pages/enroll/select-student.wxss`
  - Pre-commit: Visual verification of UI changes

- [ ] 3. Implement Clickable "待评测" Navigation

  **What to do**:
  - Add click handler `onBookTest` in `select-student.js`
  - Make "待评测" text clickable with `bindtap="onBookTest"`
  - Pass student ID via `data-id` attribute
  - Navigate to `/pages/student/book-test?studentId={{item.id}}`
  - Ensure only "待评测" is clickable, not evaluation levels

  **Must NOT do**:
  - Don't modify book-test page (already works)
  - Don't make evaluation levels clickable
  - Don't change student selection behavior

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple navigation logic addition
  - **Skills**: None needed
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Navigation logic, not UI design
    - `git-master`: Not needed for implementation

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 4)
  - **Parallel Group**: Wave 2 (with Task 4)
  - **Blocks**: Task 4
  - **Blocked By**: Tasks 1, 2

  **References** (CRITICAL - Be Exhaustive):

  **Navigation References**:
  - `pages/enroll/select-student.js:32` - Existing navigation pattern: `wx.navigateTo({ url: nextUrl })`
  - `pages/student/manage.js` - onBookTest function example
  - `pages/student/book-test.js:57` - How studentId parameter is received

  **Event Handling References**:
  - `pages/enroll/select-student.js:21-23` - Existing onSelectStudent pattern
  - `pages/student/manage.wxml:31` - Clickable "预约等级测试 ›" pattern

  **URL Pattern References**:
  - `pages/enroll/select-student.js:30-31` - URL construction with query parameters
  - `pages/student/book-test.js:57` - Parameter reading: `options.studentId`

  **WHY Each Reference Matters**:
  - `select-student.js:32`: Shows navigation pattern to follow
  - `student/manage.js`: Provides onBookTest function example
  - `student/book-test.js:57`: Shows how parameter is received

  **Acceptance Criteria**:

  **Automated Verification** (using interactive testing):
  ```
  # Agent executes via click testing:
  1. Navigate to: pages/enroll/select-student page
  2. Find: Student with "待评测" status
  3. Click: "待评测" text
  4. Verify: Navigates to /pages/student/book-test?studentId={correct-id}
  5. Verify: Book-test page loads with correct student
  6. Navigate back: Return to selection page
  7. Verify: Student with evaluation level is not clickable
  8. Screenshot: .sisyphus/evidence/task-3-navigation.png
  ```

  **Code Verification**:
  ```
  # Agent executes via file read:
  1. Read: pages/enroll/select-student.js
  2. Verify: onBookTest function exists
  3. Verify: Function extracts studentId from event
  4. Verify: Navigation URL includes studentId parameter
  5. Read: pages/enroll/select-student.wxml
  6. Verify: "待评测" has bindtap="onBookTest" and data-id="{{item.id}}"
  7. Verify: Evaluation levels do NOT have click binding
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of navigation working
  - [ ] Updated JS file with onBookTest function
  - [ ] Updated WXML with click bindings
  - [ ] Terminal output from navigation test

  **Commit**: YES
  - Message: `feat(enroll): make 待评测 clickable for test booking`
  - Files: `pages/enroll/select-student.js`, `pages/enroll/select-student.wxml`
  - Pre-commit: Navigation test verification

- [ ] 4. Add Registration Validation Logic

  **What to do**:
  - Add computed property `canProceed` in `select-student.js`
  - Disable "下一步" button when selected student has `needTest: true`
  - Add CSS class for disabled state
  - Show tooltip message "请先完成等级测试" when hovering disabled button
  - Update `onNext` function to check `canProceed` before navigation

  **Must NOT do**:
  - Don't remove existing navigation logic
  - Don't change button text or position
  - Don't add complex validation beyond evaluation status

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple validation logic addition
  - **Skills**: None needed
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Simple CSS/JS, not complex UI
    - `git-master`: Not needed for implementation

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 3)
  - **Parallel Group**: Wave 2 (with Task 3)
  - **Blocks**: None (final task)
  - **Blocked By**: Tasks 1, 2, 3

  **References** (CRITICAL - Be Exhaustive):

  **Validation References**:
  - `pages/enroll/select-student.js:24-33` - Existing onNext function
  - `pages/enroll/select-student.wxml:29` - "下一步" button element
  - `pages/enroll/select-student.wxss:74-84` - Button styling

  **Disabled State References**:
  - Look for existing disabled button patterns in codebase
  - Check common CSS patterns for `.disabled` or `.btn-disabled`

  **Data Validation References**:
  - `app.js:104-105` - needTest field definition
  - `pages/student/manage.js` - Student data validation examples

  **WHY Each Reference Matters**:
  - `select-student.js:24-33`: Shows current navigation logic to extend
  - `select-student.wxml:29`: Target button to modify
  - `app.js:104-105`: Defines needTest field for validation

  **Acceptance Criteria**:

  **Automated Verification** (using interactive testing):
  ```
  # Agent executes via button testing:
  1. Navigate to: pages/enroll/select-student page
  2. Select: Unevaluated student ("待评测")
  3. Verify: "下一步" button is disabled (grayed out)
  4. Verify: Hover shows tooltip "请先完成等级测试"
  5. Select: Evaluated student (has level)
  6. Verify: "下一步" button is enabled (blue)
  7. Click: "下一步" for evaluated student
  8. Verify: Navigates to order/waitlist confirmation
  9. Screenshot: .sisyphus/evidence/task-4-validation.png
  ```

  **Code Verification**:
  ```
  # Agent executes via file read:
  1. Read: pages/enroll/select-student.js
  2. Verify: canProceed computed property exists
  3. Verify: Logic checks selected student's needTest field
  4. Verify: onNext function checks canProceed before navigation
  5. Read: pages/enroll/select-student.wxml
  6. Verify: Button has disabled="{{!canProceed}}" binding
  7. Verify: Button has hover tooltip attribute
  8. Read: pages/enroll/select-student.wxss
  9. Verify: CSS for .primary-btn.disabled exists
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of disabled/enabled button states
  - [ ] Updated JS file with validation logic
  - [ ] Updated WXML with disabled binding
  - [ ] Updated WXSS with disabled styling
  - [ ] Terminal output from validation test

  **Commit**: YES
  - Message: `feat(enroll): validate registration for evaluated students only`
  - Files: `pages/enroll/select-student.js`, `pages/enroll/select-student.wxml`, `pages/enroll/select-student.wxss`
  - Pre-commit: Validation test verification

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `fix(enroll): remove grade field from student selection` | select-student.wxml | Visual check of removed grade |
| 2 | `feat(enroll): add evaluation status to student cards` | select-student.js, .wxml, .wxss | UI verification of status display |
| 3 | `feat(enroll): make 待评测 clickable for test booking` | select-student.js, .wxml | Navigation test |
| 4 | `feat(enroll): validate registration for evaluated students only` | select-student.js, .wxml, .wxss | Button validation test |

---

## Success Criteria

### Verification Commands
```bash
# Final comprehensive test
1. Open student selection page
2. Verify all students show evaluation status
3. Verify "待评测" is clickable (navigates to book-test)
4. Verify "下一步" disabled for "待评测" students
5. Verify "下一步" enabled for evaluated students
6. Verify navigation works for evaluated students
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All verification tests pass
- [ ] Screenshots captured in .sisyphus/evidence/
- [ ] Code follows existing patterns and conventions
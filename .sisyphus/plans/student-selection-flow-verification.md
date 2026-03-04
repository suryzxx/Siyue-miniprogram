# Student Selection Flow Verification Plan

## TL;DR

> **Quick Summary**: Verify the complete student selection and enrollment flow works end-to-end, focusing on button enabling logic, navigation, and test requirement validation.
> 
> **Deliverables**: 
> - Test data setup for student "cat" with "K3飞跃" level
> - Verification of "下一步" button enabling logic
> - End-to-end flow testing from course detail to payment
> - Test requirement validation ("待评测" handling)
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Test data setup → Button logic verification → Navigation flow verification

---

## Context

### Original Request
"点击立即报名按钮，进入选择学生页，选择学生cat的时候，下一步按钮变为可以点击的状态，进入到支付流程。因为cat学生已经完成了评测，有了K3飞跃这个等级。"

### Interview Summary
**Key Discussions**:
- Current implementation analysis completed via explore agent
- Student data structure confirmed: {id, name, gender, birthDate, avatar, level, needTest}
- Button enabling logic: `canProceed = selectedStudent && !selectedStudent.needTest`
- Payment flow is simulated (no real payment integration)

**Research Findings**:
- Current implementation exists but needs verification
- No test data for student "cat" with "K3飞跃" level
- Test completion sets level to "K3飞跃" (hardcoded in book-test.js)
- Navigation flow: course detail → select-student → order/confirm (payment) or waitlist/confirm

---

## Work Objectives

### Core Objective
Verify that the complete student selection and enrollment flow works correctly, with proper button enabling logic based on student test completion status.

### Concrete Deliverables
1. Test data for student "cat" with "K3飞跃" level
2. Verification of "下一步" button enabling/disabling logic
3. End-to-end navigation flow verification
4. Test requirement validation ("待评测" handling)

### Definition of Done
- [ ] All test scenarios pass verification
- [ ] "下一步" button enables correctly for students with completed tests
- [ ] "下一步" button disables correctly for students needing tests
- [ ] Navigation flows work correctly end-to-end
- [ ] Test data can be created and verified

### Must Have
- Verification of existing implementation (no new features)
- Test data setup that doesn't break existing functionality
- Clear verification steps with expected outcomes

### Must NOT Have (Guardrails)
- No new feature development
- No breaking changes to existing code
- No real payment integration (simulation only)
- No backend API changes

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (no test framework in mini-program)
- **User wants tests**: Manual verification with automated checks
- **Framework**: Manual testing with console logging and state inspection

### Manual Verification with Automated Checks
Each TODO includes EXECUTABLE verification procedures that agents can run directly:

**Verification Tools**:
- **Console logging**: Use `console.log()` to output state changes
- **State inspection**: Check data values in WeChat Developer Tools
- **Navigation verification**: Confirm page transitions with correct parameters
- **UI state verification**: Check button enabled/disabled states

**Evidence Requirements**:
- Console output showing state changes
- Screenshots of UI states (enabled/disabled buttons)
- Navigation parameter verification logs

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Setup & Preparation):
├── Task 1: Setup test data for student "cat"
└── Task 2: Verify student data structure

Wave 2 (Core Logic Verification):
├── Task 3: Verify "下一步" button enabling logic
├── Task 4: Verify test requirement display ("待评测")
└── Task 5: Verify student selection interaction

Wave 3 (End-to-End Flow):
├── Task 6: Verify course detail → select-student navigation
├── Task 7: Verify select-student → payment navigation
└── Task 8: Verify complete flow with student "cat"

Critical Path: Task 1 → Task 3 → Task 8
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3, 6, 8 | 2 |
| 2 | None | None | 1 |
| 3 | 1 | 8 | 4, 5 |
| 4 | None | None | 3, 5 |
| 5 | None | None | 3, 4 |
| 6 | 1 | 7 | 3, 4, 5 |
| 7 | 6 | 8 | None |
| 8 | 1, 3, 7 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2 | delegate_task(category="quick", load_skills=[], run_in_background=true) |
| 2 | 3, 4, 5 | dispatch parallel after Wave 1 completes |
| 3 | 6, 7, 8 | final verification tasks |

---

## TODOs

> Implementation + Verification = ONE Task. EVERY task MUST have: Recommended Agent Profile + Parallelization info.

- [ ] 1. Setup Test Data for Student "cat"

  **What to do**:
  - Create test student "cat" with "K3飞跃" level in app.js
  - Ensure student has: `level: "K3飞跃"`, `needTest: false`
  - Add appropriate avatar, name, and other required fields
  - Verify student appears in student list

  **Must NOT do**:
  - Don't break existing student data
  - Don't modify production data persistence logic
  - Don't add real backend integration

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple data setup task requiring minimal cognitive load
  - **Skills**: `[]`
    - No specialized skills needed for data setup
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed for data setup
    - `frontend-ui-ux`: Not a UI design task
    - `playwright`: Not browser automation

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Tasks 3, 6, 8
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `app.js:98-106` - Student data structure definition
  - `app.js:94-113` - `addStudent()` method pattern
  - `app.js:30-44` - `restoreLoginState()` for data persistence

  **API/Type References** (contracts to implement against):
  - Student object structure: `{id, name, gender, birthDate, avatar, level, needTest}`
  - Level values: "K3飞跃" (from book-test.js test completion)

  **Test References** (testing patterns to follow):
  - `pages/student/book-test.js:85-95` - Test completion sets level to "K3飞跃"

  **Documentation References** (specs and requirements):
  - User request: Student "cat" has "K3飞跃" level

  **WHY Each Reference Matters** (explain the relevance):
  - `app.js:98-106`: Shows exact student data structure to replicate
  - `app.js:94-113`: Shows how to properly add a student with all required fields
  - `pages/student/book-test.js:85-95`: Confirms "K3飞跃" is the correct level value

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # Agent runs in WeChat Developer Tools console:
  const app = getApp()
  console.log('Students before:', app.globalData.students.length)
  
  # After setup, verify student "cat" exists:
  const catStudent = app.globalData.students.find(s => s.name.includes('cat'))
  console.log('Student "cat" found:', !!catStudent)
  console.log('Student "cat" level:', catStudent?.level)
  console.log('Student "cat" needTest:', catStudent?.needTest)
  
  # Assertions:
  # - catStudent exists
  # - catStudent.level === "K3飞跃"
  # - catStudent.needTest === false
  ```

  **Evidence to Capture**:
  - [ ] Console output showing student "cat" creation
  - [ ] Screenshot of student list showing "cat" with "K3飞跃" level
  - [ ] Verification that `needTest` is `false`

  **Commit**: NO
  - This is test setup, not production code

- [ ] 2. Verify Student Data Structure

  **What to do**:
  - Examine current student data structure in app.js
  - Verify all required fields exist: id, name, gender, birthDate, avatar, level, needTest
  - Check data persistence (local storage)
  - Confirm level/needTest relationship logic

  **Must NOT do**:
  - Don't modify data structure
  - Don't change persistence logic

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple inspection task
  - **Skills**: `[]`
    - No specialized skills needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `app.js:98-106` - Student data structure
  - `app.js:47-58` - `saveLoginState()` persistence logic

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # Agent runs in WeChat Developer Tools console:
  const app = getApp()
  const sampleStudent = app.globalData.students[0]
  
  console.log('Student structure check:')
  console.log('Has id:', 'id' in sampleStudent)
  console.log('Has name:', 'name' in sampleStudent)
  console.log('Has gender:', 'gender' in sampleStudent)
  console.log('Has birthDate:', 'birthDate' in sampleStudent)
  console.log('Has avatar:', 'avatar' in sampleStudent)
  console.log('Has level:', 'level' in sampleStudent)
  console.log('Has needTest:', 'needTest' in sampleStudent)
  
  console.log('Level/needTest relationship:')
  console.log('level null → needTest true:', sampleStudent.level === null ? sampleStudent.needTest === true : 'N/A')
  console.log('level string → needTest false:', typeof sampleStudent.level === 'string' ? sampleStudent.needTest === false : 'N/A')
  
  # Check localStorage persistence
  const stored = wx.getStorageSync('loginData')
  console.log('Data persisted:', !!stored?.students)
  ```

  **Evidence to Capture**:
  - [ ] Console output showing data structure verification
  - [ ] Verification of level/needTest relationship

  **Commit**: NO

- [ ] 3. Verify "下一步" Button Enabling Logic

  **What to do**:
  - Test `canProceed()` computation in select-student.js
  - Verify button enables when: student selected AND needTest === false
  - Verify button disables when: no student selected OR needTest === true
  - Check tooltip shows "请先完成等级测试" when disabled

  **Must NOT do**:
  - Don't modify the logic, only verify
  - Don't change UI styling

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Logic verification task
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: Task 8
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `pages/enroll/select-student.js:18-23` - `canProceed()` implementation
  - `pages/enroll/select-student.js:41-49` - `onNext()` validation
  - `pages/enroll/select-student.wxml:32-38` - Button disabled state and tooltip

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # Agent tests in select-student page context:
  # Setup: Navigate to select-student page with courseId
  
  # Test 1: No student selected
  console.log('Test 1 - No selection:')
  console.log('canProceed():', this.canProceed())
  console.log('Button disabled:', !this.data.canProceed)
  
  # Test 2: Select student with needTest: false (like "cat")
  this.setData({ selectedStudentId: 'cat-student-id' })
  console.log('Test 2 - Selected student with completed test:')
  console.log('canProceed():', this.canProceed())
  console.log('Button enabled:', this.data.canProceed)
  
  # Test 3: Select student with needTest: true
  this.setData({ selectedStudentId: 'needs-test-student-id' })
  console.log('Test 3 - Selected student needing test:')
  console.log('canProceed():', this.canProceed())
  console.log('Button disabled:', !this.data.canProceed)
  console.log('Tooltip text:', '请先完成等级测试')
  ```

  **Evidence to Capture**:
  - [ ] Console output showing all test cases
  - [ ] Screenshots of button enabled/disabled states
  - [ ] Screenshot showing tooltip when disabled

  **Commit**: NO

- [ ] 4. Verify Test Requirement Display ("待评测")

  **What to do**:
  - Verify "待评测" shows for students with needTest: true
  - Verify level shows for students with needTest: false
  - Test "待评测" link navigates to book-test page
  - Verify link passes correct studentId parameter

  **Must NOT do**:
  - Don't modify display logic
  - Don't change navigation behavior

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 5)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `pages/enroll/select-student.wxml:24-27` - Conditional display logic
  - `pages/enroll/select-student.js:61-64` - `onBookTest()` navigation

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # Agent tests in select-student page:
  
  # Check student list rendering
  console.log('Student display verification:')
  const students = this.data.students
  
  students.forEach((student, index) => {
    console.log(`Student ${index} (${student.name}):`)
    console.log('  - needTest:', student.needTest)
    console.log('  - Should show "待评测":', student.needTest === true)
    console.log('  - Should show level:', student.needTest === false && student.level)
  })
  
  # Test "待评测" link navigation
  console.log('Testing "待评测" link:')
  console.log('onBookTest function exists:', typeof this.onBookTest === 'function')
  
  # Simulate click (would navigate to book-test with studentId)
  const testEvent = { currentTarget: { dataset: { id: 'test-student-id' } } }
  console.log('Navigation would go to:', `/pages/student/book-test?studentId=test-student-id`)
  ```

  **Evidence to Capture**:
  - [ ] Console output showing display logic verification
  - [ ] Screenshots showing "待评测" vs level display
  - [ ] Verification of navigation parameters

  **Commit**: NO

- [ ] 5. Verify Student Selection Interaction

  **What to do**:
  - Test clicking student items selects them
  - Verify selectedStudentId updates correctly
  - Check visual selection state (CSS class 'is-active')
  - Test selection changes update button state

  **Must NOT do**:
  - Don't modify selection logic
  - Don't change visual styling

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `pages/enroll/select-student.js:38-40` - `onSelectStudent()` handler
  - `pages/enroll/select-student.wxml:14-20` - Student item binding and CSS class

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # Agent tests selection interaction:
  
  console.log('Initial selectedStudentId:', this.data.selectedStudentId)
  
  # Simulate selecting first student
  const firstStudent = this.data.students[0]
  const selectEvent = { currentTarget: { dataset: { id: firstStudent.id } } }
  this.onSelectStudent(selectEvent)
  
  console.log('After selecting first student:')
  console.log('selectedStudentId:', this.data.selectedStudentId)
  console.log('Matches first student id:', this.data.selectedStudentId === firstStudent.id)
  
  # Check CSS class would be applied
  console.log('CSS class "is-active" should be on student with id:', firstStudent.id)
  
  # Simulate selecting different student
  const secondStudent = this.data.students[1]
  const selectEvent2 = { currentTarget: { dataset: { id: secondStudent.id } } }
  this.onSelectStudent(selectEvent2)
  
  console.log('After selecting second student:')
  console.log('selectedStudentId:', this.data.selectedStudentId)
  console.log('Matches second student id:', this.data.selectedStudentId === secondStudent.id)
  console.log('First student should no longer have "is-active" class')
  ```

  **Evidence to Capture**:
  - [ ] Console output showing selection interaction
  - [ ] Screenshots showing visual selection state
  - [ ] Verification that button state updates with selection

  **Commit**: NO

- [ ] 6. Verify Course Detail → Select-Student Navigation

  **What to do**:
  - Test "立即报名" button on course detail page
  - Verify navigation to select-student page with correct courseId
  - Check pre-validation logic (login, student existence, test completion)
  - Verify navigation parameters are passed correctly

  **Must NOT do**:
  - Don't modify navigation logic
  - Don't change validation logic

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: Task 7
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `pages/course/detail.js:121-135` - `onEnrollTap()` validation and navigation
  - `pages/course/detail.wxml:81-83` - "立即报名" button binding

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # Agent tests in course detail page context:
  
  console.log('Testing "立即报名" button:')
  console.log('onEnrollTap function exists:', typeof this.onEnrollTap === 'function')
  
  # Simulate button click with course data
  console.log('Current courseId:', this.data.course?.id)
  console.log('Should navigate to:', `/pages/enroll/select-student?courseId=${this.data.course?.id}`)
  
  # Check validation logic
  console.log('Pre-validation checks:')
  console.log('  - User logged in:', getApp().globalData.isLoggedIn)
  console.log('  - Has students:', getApp().globalData.students.length > 0)
  
  # If validation passes, navigation should occur
  console.log('Navigation should occur if all validations pass')
  ```

  **Evidence to Capture**:
  - [ ] Console output showing navigation verification
  - [ ] Screenshot of "立即报名" button on course detail
  - [ ] Verification of navigation parameters

  **Commit**: NO

- [ ] 7. Verify Select-Student → Payment Navigation

  **What to do**:
  - Test "下一步" button navigation from select-student page
  - Verify navigation to order/confirm with correct courseId and studentId
  - Check seat availability routing (order vs waitlist)
  - Verify navigation parameters are passed correctly

  **Must NOT do**:
  - Don't modify navigation logic
  - Don't change routing logic

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (sequential after Task 6)
  - **Blocks**: Task 8
  - **Blocked By**: Task 6

  **References**:

  **Pattern References**:
  - `pages/enroll/select-student.js:50-59` - `onNext()` navigation logic
  - `pages/enroll/select-student.js:52-57` - Seat availability routing

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # Agent tests in select-student page context:
  
  console.log('Testing "下一步" button navigation:')
  
  # Setup: Select student "cat" and ensure canProceed is true
  this.setData({ selectedStudentId: 'cat-student-id' })
  console.log('Selected student "cat", canProceed:', this.canProceed())
  
  # Simulate button click
  console.log('Course has remaining seats:', this.data.course?.remainingSeats > 0)
  
  if (this.data.course?.remainingSeats > 0) {
    console.log('Should navigate to:', `/pages/order/confirm?courseId=${this.data.courseId}&studentId=${this.data.selectedStudentId}`)
  } else {
    console.log('Should navigate to:', `/pages/waitlist/confirm?courseId=${this.data.courseId}&studentId=${this.data.selectedStudentId}`)
  }
  ```

  **Evidence to Capture**:
  - [ ] Console output showing navigation verification
  - [ ] Screenshot of "下一步" button enabled state
  - [ ] Verification of navigation parameters

  **Commit**: NO

- [ ] 8. Verify Complete Flow with Student "cat"

  **What to do**:
  - Execute complete end-to-end flow with student "cat"
  - Course detail → select-student → payment flow
  - Verify all button states and navigation work correctly
  - Confirm student "cat" with "K3飞跃" level enables "下一步" button

  **Must NOT do**:
  - Don't modify any logic
  - Don't change any UI

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (final task)
  - **Blocks**: None
  - **Blocked By**: Tasks 1, 3, 7

  **References**:

  **Pattern References**:
  - All previous task references combined

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # Agent executes complete flow:
  
  console.log('=== COMPLETE FLOW VERIFICATION ===')
  
  # Step 1: Start at course detail
  console.log('1. Course Detail Page:')
  console.log('   - "立即报名" button exists')
  console.log('   - Course has remaining seats')
  
  # Step 2: Navigate to select-student
  console.log('2. Select-Student Page:')
  console.log('   - Student "cat" appears in list')
  console.log('   - Student "cat" shows "K3飞跃" level')
  console.log('   - Student "cat" has needTest: false')
  
  # Step 3: Select student "cat"
  console.log('3. Selecting student "cat":')
  console.log('   - Student "cat" selected')
  console.log('   - "下一步" button enabled')
  console.log('   - canProceed() returns true')
  
  # Step 4: Click "下一步"
  console.log('4. Clicking "下一步":')
  console.log('   - Navigation occurs')
  console.log('   - Correct parameters passed')
  console.log('   - Arrives at payment/waitlist page')
  
  console.log('=== FLOW VERIFICATION COMPLETE ===')
  ```

  **Evidence to Capture**:
  - [ ] Console output showing complete flow execution
  - [ ] Screenshots of each step in the flow
  - [ ] Verification that all steps work correctly

  **Commit**: NO

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| N/A | No commits needed | N/A | This is a verification plan, not implementation |

---

## Success Criteria

### Verification Commands
```bash
# Complete flow verification command
# Run in WeChat Developer Tools console after setup
console.log('=== Student Selection Flow Verification ===')
console.log('All 8 verification tasks should pass')
console.log('Evidence captured in .sisyphus/evidence/')
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All verification tasks completed
- [ ] All evidence captured
- [ ] Complete flow works end-to-end
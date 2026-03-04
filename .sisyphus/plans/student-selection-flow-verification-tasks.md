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
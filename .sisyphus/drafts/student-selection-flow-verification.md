# Draft: Student Selection Flow Verification

## User Request Analysis
**Original Request**: "点击立即报名按钮，进入选择学生页，选择学生cat的时候，下一步按钮变为可以点击的状态，进入到支付流程。因为cat学生已经完成了评测，有了K3飞跃这个等级。"

**Translation**: "Click the '立即报名' (Enroll Now) button, enter the select-student page, when selecting student 'cat', the '下一步' (Next) button becomes clickable, entering the payment flow. Because student 'cat' has completed the evaluation and has the 'K3飞跃' level."

## Current Implementation Analysis

### 1. Student Selection Page (`pages/enroll/select-student.*`)
**Current State**:
- ✅ Shows student list with avatar, name, and level or "待评测" (pending evaluation)
- ✅ `canProceed()` logic correctly checks `!selectedStudent.needTest`
- ✅ "下一步" button disabled when `!canProceed` with tooltip "请先完成等级测试"
- ✅ `onNext()` navigates to payment flow when `canProceed` is true
- ✅ `onBookTest()` navigates to test booking page for students needing evaluation

**Gaps Identified**:
- ❌ No test data setup for student "cat" with "K3飞跃" level
- ❌ No verification that the complete flow works end-to-end
- ❌ No automated testing of the button enabling logic

### 2. Course Detail Page (`pages/course/detail.*`)
**Current State**:
- ✅ "立即报名" button shows based on `course.remainingSeats > 0`
- ✅ `onEnrollTap()` should navigate to select-student page with `courseId`
- ❌ **CRITICAL GAP**: Need to verify navigation from course detail to select-student

### 3. Payment Flow (`pages/order/confirm.*`)
**Current State**:
- ✅ Order confirmation page shows course and student info
- ✅ "微信支付" button present
- ❌ **GAP**: Need to verify navigation from select-student to payment flow

### 4. Student Data Structure (`app.js`)
**Current State**:
- ✅ Student objects have: `id`, `name`, `gender`, `birthDate`, `avatar`, `level`, `needTest`
- ✅ `level: null` means not evaluated, `needTest: true`
- ✅ `level: "K3飞跃"` means evaluated, `needTest: false`
- ❌ **GAP**: No test data for student "cat" with "K3飞跃" level

## Test Scenarios to Verify

### Scenario 1: Student with Completed Evaluation (cat)
1. Student "cat" has `level: "K3飞跃"` and `needTest: false`
2. Click "立即报名" on course detail → navigate to select-student with `courseId`
3. Select student "cat" → "下一步" button should be enabled
4. Click "下一步" → navigate to payment flow with correct `courseId` and `studentId`

### Scenario 2: Student Needing Evaluation
1. Student has `level: null` and `needTest: true`
2. Click "立即报名" on course detail → navigate to select-student
3. Select student → "下一步" button should be disabled
4. "待评测" link should be clickable → navigate to test booking

### Scenario 3: No Students Available
1. No students in `globalData.students`
2. Click "立即报名" → what happens? (Need to verify)

## Technical Decisions Needed

1. **Test Data Setup**: How to create test student "cat" with "K3飞跃" level?
   - Option A: Modify `app.js` to add test data in `onLaunch()`
   - Option B: Create test utility function
   - Option C: Use mock data in test environment

2. **Verification Method**:
   - Manual testing vs automated testing
   - If automated: Use WeChat mini-program testing framework?

3. **Flow Verification**:
   - Need to verify navigation parameters are passed correctly
   - Need to verify button states update correctly

## Open Questions

1. Does the course detail page's `onEnrollTap()` method exist and work correctly?
2. Are there any authentication requirements before enrollment?
3. What is the exact student data for "cat"? (avatar, name format, etc.)
4. Should we also test edge cases (multiple students, switching selection, etc.)?
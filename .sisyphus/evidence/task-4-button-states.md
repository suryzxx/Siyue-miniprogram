# Button States Visualization

## Enabled State (canProceed = true)
```
[ 下一步 ] - Blue button (#1a5fdb), white text
Hover: Darker blue (#0f4bc2)
Click: Navigates to order/waitlist confirmation
```

## Disabled State (canProceed = false)
```
[ 下一步 ] - Gray button (#d1d5db), light gray text (#9ca3af)
Hover: No effect
Click: Shows toast "请先完成等级测试", no navigation
```

## CSS Implementation
```css
.primary-btn {
  background: #1a5fdb;
  color: #ffffff;
  transition: background-color 0.2s ease;
}

.primary-btn-hover {
  background: #0f4bc2;
}

.primary-btn.disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

.primary-btn.disabled:active {
  background: #d1d5db;
}
```

## WXML Implementation
```xml
<view 
  class="primary-btn {{!canProceed ? 'disabled' : ''}}" 
  bindtap="onNext"
  hover-class="{{canProceed ? 'primary-btn-hover' : ''}}"
  hover-stop-propagation="{{true}}"
  data-tooltip="{{!canProceed ? '请先完成等级测试' : ''}}"
>下一步</view>
```

## JavaScript Logic
```javascript
canProceed() {
  const selectedStudent = this.data.students.find(
    (item) => item.id === this.data.selectedStudentId
  );
  return selectedStudent && !selectedStudent.needTest;
},

onNext() {
  if (!this.data.canProceed) {
    wx.showToast({
      title: '请先完成等级测试',
      icon: 'none',
      duration: 2000
    });
    return;
  }
  // ... navigation logic
}
```
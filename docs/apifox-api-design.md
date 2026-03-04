# Apifox 接口配置指南

## 在 Apifox 中创建以下接口

### 📁 新建目录：课程模块

---

### 1. GET /api/v1/classes - 获取班级列表

**Query 参数**:
- semester (string, 可选) - 学期筛选，如 "2026春季"
- campusId (string, 可选) - 校区ID
- teacherId (string, 可选) - 主教老师ID
- cursor (string, 可选) - 游标，用于无限滚动加载更多

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "class-001",
        "name": "K3进阶一班",
        "productName": "K3进阶体系课",
        "productType": "体系课",
        "needAssessment": true,
        "level": "G2A",
        "semester": "春季",
        "campus": {
          "id": "campus-001",
          "name": "同曦校区",
          "city": "南京",
          "district": "江宁区",
          "address": "同曦万尚城二楼"
        },
        "mainTeacher": {
          "id": "teacher-001",
          "name": "Esther于哲敏",
          "avatar": "https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/avatar1.png"
        },
        "schedule": "2026.03.07-2026.06.20 周二、周六 12:00-14:30",
        "classroom": "201教室",
        "capacity": 15,
        "enrolled": 12,
        "remaining": 3,
        "price": 5475.00,
        "sessions": 15,
        "status": "open"
      },
      {
        "id": "class-002",
        "name": "K2启蒙二班",
        "productName": "K2启蒙体系课",
        "productType": "体系课",
        "needAssessment": true,
        "level": "G1B",
        "semester": "2026春季",
        "campus": {
          "id": "campus-002",
          "name": "奥体网球中心校区",
          "city": "南京",
          "district": "建邺区",
          "address": "奥体中心梦之蓝网球中心3楼"
        },
        "mainTeacher": {
          "id": "teacher-002",
          "name": "Shirley苡爽",
          "avatar": "https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/avatar2.png"
        },
        "schedule": "2026.03.07-2026.06.20 周二、周六 14:50-16:50",
        "classroom": "302教室",
        "capacity": 15,
        "enrolled": 15,
        "remaining": 0,
        "price": 4425.00,
        "sessions": 15,
        "status": "full"
      },
      {
        "id": "class-003",
        "name": "K1启蒙专项班",
        "productName": "K1启蒙专项课",
        "productType": "专项课",
        "needAssessment": false,
        "level": "K1",
        "semester": "2026春季",
        "campus": {
          "id": "campus-001",
          "name": "同曦校区",
          "city": "南京",
          "district": "江宁区",
          "address": "同曦万尚城二楼"
        },
        "mainTeacher": {
          "id": "teacher-001",
          "name": "Esther于哲敏",
          "avatar": "https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/avatar1.png"
        },
        "schedule": "2026.03.10-2026.06.25 周三、周日 10:00-12:00",
        "classroom": "105教室",
        "capacity": 12,
        "enrolled": 8,
        "remaining": 4,
        "price": 3980.00,
        "sessions": 12,
        "status": "open"
      }
    ],
    "nextCursor": "",
    "hasMore": false
  }
}
```

---

### 2. GET /api/v1/classes/{id} - 获取班级详情

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "class-001",
    "name": "K3进阶一班",
    "productName": "K3进阶体系课",
    "productType": "体系课",
    "needAssessment": true,
    "level": "G2A",
    "semester": "2026春季",
    "campus": {
      "id": "campus-001",
      "name": "同曦校区",
      "city": "南京",
      "district": "江宁区",
      "address": "同曦万尚城二楼"
    },
    "mainTeacher": {
      "id": "teacher-001",
      "name": "Esther于哲敏",
      "avatar": "https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/avatar1.png"
    },
    "schedule": "2026.03.07-2026.06.20 周二、周六 12:00-14:30",
    "classroom": "201教室",
    "capacity": 15,
    "enrolled": 12,
    "remaining": 3,
    "price": 5475.00,
    "sessions": 15,
    "status": "open",
    "syllabus": [
      { "week": 1, "title": "课程导学与能力评估", "time": "2026.03.07 周二 12:00-14:30" },
      { "week": 2, "title": "核心主题训练一", "time": "2026.03.10 周六 12:00-14:30" },
      { "week": 3, "title": "核心主题训练二", "time": "2026.03.14 周二 12:00-14:30" },
      { "week": 4, "title": "阶段复盘与反馈", "time": "2026.03.17 周六 12:00-14:30" }
    ]
  }
}
```

---

### 3. GET /api/v1/classes/filters - 获取筛选选项

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "semesters": ["2026春季", "2025冬季", "2025秋季"],
    "campuses": [
      { "id": "campus-001", "name": "同曦校区" },
      { "id": "campus-002", "name": "奥体网球中心校区" },
      { "id": "campus-003", "name": "河西万达校区" }
    ],
    "teachers": [
      { "id": "teacher-001", "name": "Esther于哲敏" },
      { "id": "teacher-002", "name": "Shirley苡爽" },
      { "id": "teacher-003", "name": "Tom王明" }
    ]
  }
}
```

---

### 4. POST /api/v1/classes/{id}/enroll - 报名班级

**请求体**: `{ "studentId": "STU202602220001" }`

**Mock 响应**:
```json
{
  "code": 200,
  "message": "报名成功，请完成支付",
  "data": {
    "orderId": "ORD202602241530001",
    "classId": "class-001",
    "studentId": "STU202602220001",
    "amount": 5475.00,
    "status": "pending"
  }
}
```

---

### 5. POST /api/v1/classes/{id}/waitlist - 加入候补（有空位时同时通知所有候补用户）

**请求体**: `{ "studentId": "STU202602220001" }`

**Mock 响应**:
```json
{
  "code": 200,
  "message": "候补成功，有空位时将通知您",
  "data": {
    "waitlistId": "WAIT202602241535001",
    "classId": "class-002",
    "studentId": "STU202602220001",
    "status": "pending"
  }
}

---

### 📁 新建目录：订单模块

---

### 6. GET /api/v1/orders - 获取订单列表

**Query 参数**: status (string, 可选) - pending/completed/refunding

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "ORD202602241530001",
        "className": "K3进阶一班",
        "studentName": "张小明",
        "lessonCount": "15课次",
        "price": 5475.00,
        "status": "pending",
        "statusLabel": "待支付",
        "createTime": "2026-02-24 15:30:00"
      },
      {
        "id": "ORD202602201020001",
        "className": "K2启蒙二班",
        "studentName": "张小红",
        "lessonCount": "15课次",
        "price": 4425.00,
        "status": "completed",
        "statusLabel": "已完成",
        "createTime": "2026-02-20 10:20:00",
        "payTime": "2026-02-20 10:25:00"
      }
    ],
    "total": 2
  }
}
```

---

### 7. GET /api/v1/orders/{id} - 获取订单详情

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "ORD202602241530001",
    "classId": "class-001",
    "className": "K3进阶一班",
    "studentId": "STU202602220001",
    "studentName": "张小明",
    "lessonCount": "15课次",
    "price": 5475.00,
    "paid": 0,
    "usedLessons": 0,
    "status": "pending",
    "statusLabel": "待支付",
    "createTime": "2026-02-24 15:30:00",
    "payTime": null
  }
}
```

---

### 8. POST /api/v1/orders - 创建订单

**请求体**: `{ "classId": "class-001", "studentId": "STU202602220001" }`

**Mock 响应**:
```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "id": "ORD202602241600001",
    "amount": 5475.00,
    "status": "pending"
  }
}
```

---

### 9. POST /api/v1/orders/{id}/pay - 支付订单

**Mock 响应**:
```json
{
  "code": 200,
  "message": "支付成功",
  "data": {
    "orderId": "ORD202602241530001",
    "status": "completed",
    "payTime": "2026-02-24 16:05:00"
  }
}
```

---

### 10. POST /api/v1/orders/{id}/cancel - 取消订单

**Mock 响应**:
```json
{
  "code": 200,
  "message": "订单已取消",
  "data": {
    "orderId": "ORD202602241530001",
    "status": "cancelled"
  }
}
```

---

### 📁 新建目录：候补模块

---

### 11. GET /api/v1/waitlists - 获取我的候补列表（该账号的所有候补记录）

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "WAIT202602221530001",
        "classId": "class-002",
        "className": "K2启蒙二班",
        "studentName": "张小明",
        "status": "pending",
        "createTime": "2026-02-22 15:30:00"
      },
      {
        "id": "WAIT202602201000001",
        "classId": "class-004",
        "className": "K2进阶三班",
        "studentName": "张小红",
        "status": "available",
        "createTime": "2026-02-20 10:00:00",
        "notifyTime": "2026-02-24 14:00:00"
      }
    ],
    "total": 2
  }
}

---

### 12. GET /api/v1/waitlists/{id} - 获取候补详情

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "WAIT202602221530001",
    "classId": "class-002",
    "className": "K2启蒙二班",
    "studentId": "STU202602220001",
    "studentName": "张小明",
    "status": "pending",
    "createTime": "2026-02-22 15:30:00",
    "notifyTime": null
  }
}

---

### 13. DELETE /api/v1/waitlists/{id} - 取消候补

**Mock 响应**:
```json
{
  "code": 200,
  "message": "候补已取消",
  "data": {
    "waitlistId": "WAIT202602221530001",
    "status": "cancelled"
  }
}
```

### 14. GET /api/v1/enrollments - 获取我的班级列表

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "ENR202602201030001",
        "classId": "class-001",
        "className": "K3进阶一班",
        "productType": "体系课",
        "level": "G2A",
        "schedule": "2026.03.07-2026.06.20 周二、周六 12:00-14:30",
        "campus": {
          "name": "同曦校区",
          "address": "江宁区同曦万尚城二楼"
        },
        "teacher": {
          "name": "Esther于哲敏",
          "avatar": "https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/avatar1.png"
        },
        "studentName": "张小明",
        "status": "confirmed",
        "enrollTime": "2026-02-20 10:30:00",
        "totalSessions": 15,
        "completedSessions": 2
      }
    ],
    "total": 1
  }
}
```

---

## 接口汇总表

| 序号 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 1 | GET | /api/v1/classes | 获取班级列表 |
| 2 | GET | /api/v1/classes/{id} | 获取班级详情 |
| 3 | GET | /api/v1/classes/filters | 获取筛选选项 |
| 4 | POST | /api/v1/classes/{id}/enroll | 报名班级 |
| 5 | POST | /api/v1/classes/{id}/waitlist | 加入候补 |
| 6 | GET | /api/v1/orders | 获取订单列表 |
| 7 | GET | /api/v1/orders/{id} | 获取订单详情 |
| 8 | POST | /api/v1/orders | 创建订单 |
| 9 | POST | /api/v1/orders/{id}/pay | 支付订单 |
| 10 | POST | /api/v1/orders/{id}/cancel | 取消订单 |
| 11 | GET | /api/v1/waitlists | 获取我的候补列表 |
| 12 | GET | /api/v1/waitlists/{id} | 获取候补详情 |
| 13 | DELETE | /api/v1/waitlists/{id} | 取消候补 |
| 14 | GET | /api/v1/enrollments | 获取我的班级 |

---

## 候补系统说明

### 候补状态
- `pending` - 候补中：等待班级有空位
- `available` - 可报名：班级有空位，已通知用户，可创建订单
- `success` - 候补成功：用户已成功报名
- `cancelled` - 已取消：用户取消候补

### 候补流程
1. 用户加入候补（status: pending）
2. 班级有空位时，系统同时通知所有候补用户（status: available）
3. 用户收到通知后，先创建订单的用户获得名额
4. 订单创建成功后，该候补记录状态变为 success

### 专项课班层
专项课的班层（level）与体系课不同：
- 体系课：G2A、G1B 等评测等级
- 专项课：剑少一级、剑少二级、剑少三级、KET综合冲刺、KET口语写作专项、PET综合冲刺、PET口语写作专项、FCE综合冲刺、FCE口语写作专项、自拼一级、自拼二级、自拼三级、KET核心语法、PET核心语法、神奇树屋、神奇校车、苍蝇小子、夏洛的网、国家探索、国家地理足迹-KET、国家地理足迹-PET


### 📁 新建目录：我的班级模块

---

### 15. GET /api/v1/myclasses - 获取我的班级列表

**Query 参数**:
- studentId (string, 必填) - 学生ID（一个用户可能有多个学生，必须指定具体学生）
- status (string, 可选) - 班级状态：未开课/开课中/已结课

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "class-001",
        "name": "K3进阶一班",
        "productType": "体系课",
        "level": "G2A",
        "schedule": "2026.03.07-2026.06.20 周二、周六 12:00-14:30",
        "campus": {
          "name": "同曦校区",
          "address": "江宁区同曦万尚城二楼"
        },
        "teacher": {
          "name": "Esther于哲敏",
          "avatar": "/images/pic/avatar.png"
        },
        "status": "开课中",
        "enrollTime": "2026-02-20 10:30:00",
        "totalSessions": 15,
        "completedSessions": 2,
        "currentSession": 3
      },
      {
        "id": "class-002",
        "name": "K2启蒙二班",
        "productType": "体系课",
        "level": "G1B",
        "schedule": "2026.03.07-2026.06.20 周二、周六 14:50-16:50",
        "campus": {
          "name": "奥体网球中心校区",
          "address": "建邺区奥体中心梦之蓝网球中心3楼"
        },
        "teacher": {
          "name": "Shirley苡爽",
          "avatar": "/images/pic/avatar.png"
        },
        "status": "已结课",
        "enrollTime": "2025-09-10 14:20:00",
        "totalSessions": 15,
        "completedSessions": 15,
        "currentSession": 15
      }
    ],
    "total": 2
  }
}
```

---

### 16. GET /api/v1/myclasses/{id} - 获取班级详情

**Query 参数**:
- studentId (string, 可选) - 学生ID

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "class-001",
    "name": "K3进阶一班",
    "productName": "K3进阶体系课",
    "productType": "体系课",
    "level": "G2A",
    "semester": "2026春季",
    "campus": {
      "id": "campus-001",
      "name": "同曦校区",
      "city": "南京",
      "district": "江宁区",
      "address": "同曦万尚城二楼"
    },
    "teacher": {
      "id": "teacher-001",
      "name": "Esther于哲敏",
      "avatar": "/images/pic/avatar.png"
    },
    "schedule": "2026.03.07-2026.06.20 周二、周六 12:00-14:30",
    "classroom": "201教室",
    "totalSessions": 15,
    "completedSessions": 2,
    "currentSession": 3,
    "status": "开课中",
    "enrollTime": "2026-02-20 10:30:00",
    "syllabus": [
      { "week": 1, "title": "课程导学与能力评估", "time": "2026.03.07 周二 12:00-14:30", "status": "completed" },
      { "week": 2, "title": "核心主题训练一", "time": "2026.03.10 周六 12:00-14:30", "status": "completed" },
      { "week": 3, "title": "核心主题训练二", "time": "2026.03.14 周二 12:00-14:30", "status": "upcoming" },
      { "week": 4, "title": "阶段复盘与反馈", "time": "2026.03.17 周六 12:00-14:30", "status": "upcoming" }
    ]
  }
}
```

---

### 17. GET /api/v1/myclasses/{id}/transfer-option - 获取可转班列表

**Query 参数**:
- studentId (string, 可选) - 学生ID

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "currentClass": {
      "id": "class-001",
      "name": "K3进阶一班",
      "campus": "同曦校区",
      "teacher": "Esther于哲敏",
      "schedule": "2026.03.07-2026.06.20 周二、周六 12:00-14:30",
      "currentSession": 3
    },
    "options": [
      {
        "id": "class-004",
        "name": "K3进阶二班",
        "campus": "同曦校区",
        "teacher": "Tom王明",
        "schedule": "2026.03.07-2026.06.20 周二、周六 14:50-16:50",
        "currentSession": 3,
        "capacity": 15,
        "enrolled": 10,
        "remaining": 5
      },
      {
        "id": "class-005",
        "name": "K3进阶三班",
        "campus": "奥体网球中心校区",
        "teacher": "Shirley苡爽",
        "schedule": "2026.03.08-2026.06.21 周三、周日 10:00-12:00",
        "currentSession": 3,
        "capacity": 12,
        "enrolled": 8,
        "remaining": 4
      }
    ]
  }
}
```

---

### 18. POST /api/v1/myclasses/{id}/transfer - 申请转班

**请求体**:
```json
{
  "studentId": "STU202602220001",
  "targetClassId": "class-004",
  "reason": "时间冲突，需要调整上课时间"
}
```

**Mock 响应**:
```json
{
  "code": 200,
  "message": "转班申请已提交，等待管理员审核",
  "data": {
    "applicationId": "TRANS202602251045001",
    "currentClassId": "class-001",
    "targetClassId": "class-004",
    "studentId": "STU202602220001",
    "status": "pending",
    "applyTime": "2026-02-25 10:45:00"
  }
}
```

---

### 19. GET /api/v1/myclasses/{id}/adjust-option - 获取可调课列表

**Query 参数**:
- date (string, 可选) - 调课日期（格式：2026-03-14）

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "currentClass": {
      "id": "class-001",
      "name": "K3进阶一班",
      "campus": "同曦校区",
      "teacher": "Esther于哲敏",
      "schedule": "2026.03.07-2026.06.20 周二、周六 12:00-14:30",
      "currentSession": 3
    },
    "options": [
      {
        "id": "class-006",
        "name": "K3进阶四班",
        "campus": "同曦校区",
        "teacher": "Tom王明",
        "schedule": "2026.03.14 周二 14:50-16:50",
        "currentSession": 3,
        "capacity": 15,
        "enrolled": 12,
        "remaining": 3
      }
    ]
  }
}
```

---

### 20. POST /api/v1/myclasses/{id}/adjust - 申请调课

**请求体**:
```json
{
  "studentId": "STU202602220001",
  "targetClassId": "class-006",
  "date": "2026-03-14",
  "reason": "临时有事，需要调整上课时间"
}
```

**Mock 响应**:
```json
{
  "code": 200,
  "message": "调课申请已提交，等待管理员审核",
  "data": {
    "applicationId": "ADJUST202602251050001",
    "currentClassId": "class-001",
    "targetClassId": "class-006",
    "studentId": "STU202602220001",
    "date": "2026-03-14",
    "status": "pending",
    "applyTime": "2026-02-25 10:50:00"
  }
}
```

---

### 21. GET /api/v1/myclasses/{id}/refund-info - 获取退班信息

**Query 参数**:
- studentId (string, 可选) - 学生ID

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "classInfo": {
      "id": "class-001",
      "name": "K3进阶一班",
      "campus": "同曦校区",
      "teacher": "Esther于哲敏",
      "schedule": "2026.03.07-2026.06.20 周二、周六 12:00-14:30",
      "currentSession": 3
    },
    "paymentInfo": {
      "totalAmount": 5475.00,
      "paidAmount": 5475.00,
      "totalSessions": 15,
      "completedSessions": 2,
      "remainingSessions": 13,
      "refundableAmount": 4745.00,
      "refundableSessions": 13
    },
    "refundPolicy": "按讲次退费：已上课讲次不退费，剩余讲次按比例退款。"
  }
}
```

---

### 22. POST /api/v1/myclasses/{id}/refund - 申请退班

**请求体**:
```json
{
  "studentId": "STU202602220001",
  "reason": "个人原因无法继续上课",
  "refundAmount": 4745.00
}
```

**Mock 响应**:
```json
{
  "code": 200,
  "message": "退班申请已提交，等待管理员审核",
  "data": {
    "applicationId": "REFUND202602251055001",
    "classId": "class-001",
    "studentId": "STU202602220001",
    "refundAmount": 4745.00,
    "status": "pending",
    "applyTime": "2026-02-25 10:55:00"
  }
}
```

---

### 23. POST /api/v1/myclasses/{id}/cancel-refund - 撤销退班申请

**请求体**:
```json
{
  "studentId": "STU202602220001"
}
```

**Mock 响应**:
```json
{
  "code": 200,
  "message": "退班申请已撤销",
  "data": {
    "applicationId": "REFUND202602251055001",
    "status": "cancelled"
  }
}
```

---

### 24. GET /api/v1/myclasses/{id}/attendance - 获取考勤记录

**Query 参数**:
- month (string, 可选) - 月份（格式：2026-03）

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "classInfo": {
      "id": "class-001",
      "name": "K3进阶一班",
      "teacher": "Esther于哲敏"
    },
    "attendance": [
      {
        "date": "2026-03-07",
        "time": "12:00-14:30",
        "session": 1,
        "title": "课程导学与能力评估",
        "status": "present",
        "checkInTime": "2026-03-07 11:55:00",
        "checkOutTime": "2026-03-07 14:28:00"
      }
    ]
  }
}
```

---

### 25. GET /api/v1/myclasses/{id}/schedule - 获取课表

**Query 参数**:
- month (string, 可选) - 月份（格式：2026-03）

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "classInfo": {
      "id": "class-001",
      "name": "K3进阶一班",
      "teacher": "Esther于哲敏",
      "classroom": "201教室"
    },
    "schedule": [
      {
        "date": "2026-03-07",
        "time": "12:00-14:30",
        "session": 1,
        "title": "课程导学与能力评估",
        "status": "completed"
      },
      {
        "date": "2026-03-10",
        "time": "12:00-14:30",
        "session": 2,
        "title": "核心主题训练一",
        "status": "completed"
      },
      {
        "date": "2026-03-14",
        "time": "12:00-14:30",
        "session": 3,
        "title": "核心主题训练二",
        "status": "upcoming"
      }
    ]
  }
}
```

---

### 26. GET /api/v1/myclasses/current - 获取当前班级（用于个人中心展示）

**Mock 响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "class-001",
        "name": "K3进阶一班",
        "campus": "同曦校区",
        "teacher": "Esther于哲敏",
        "schedule": "2026.03.07-2026.06.20 周二、周六 12:00-14:30",
        "currentSession": 3
      }
    ]
  }
}
```

---

## 接口汇总表更新

| 序号 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 15 | GET | /api/v1/myclasses | 获取我的班级列表 |
| 16 | GET | /api/v1/myclasses/{id} | 获取班级详情 |
| 17 | GET | /api/v1/myclasses/{id}/transfer-option | 获取可转班列表 |
| 18 | POST | /api/v1/myclasses/{id}/transfer | 申请转班 |
| 19 | GET | /api/v1/myclasses/{id}/adjust-option | 获取可调课列表 |
| 20 | POST | /api/v1/myclasses/{id}/adjust | 申请调课 |
| 21 | GET | /api/v1/myclasses/{id}/refund-info | 获取退班信息 |
| 22 | POST | /api/v1/myclasses/{id}/refund | 申请退班 |
| 23 | POST | /api/v1/myclasses/{id}/cancel-refund | 撤销退班申请 |
| 24 | GET | /api/v1/myclasses/{id}/attendance | 获取考勤记录 |
| 25 | GET | /api/v1/myclasses/{id}/schedule | 获取课表 |
| 26 | GET | /api/v1/myclasses/current | 获取当前班级（个人中心展示） |

---

## 我的班级模块说明

### 班级状态
- `未开课` - 课程尚未开始
- `开课中` - 课程正在进行中
- `已结课` - 课程已结束

### 考勤状态
- `present` - 正常出勤
- `absent` - 缺勤
- `late` - 迟到
- `leave` - 请假
- `upcoming` - 未开始

### 课程状态
- `completed` - 已完成
- `upcoming` - 未开始
- `cancelled` - 已取消

### 申请状态
- `pending` - 待审核
- `approved` - 已通过
- `rejected` - 已拒绝
- `cancelled` - 已撤销

### 退班退款规则
1. 按讲次退费：已上课讲次不退费，剩余讲次按比例退款
2. 退款金额 = (剩余讲次 ÷ 总讲次) × 已支付金额
3. 例如：总讲次15讲，已上5讲，剩余10讲，退款金额 = (10 ÷ 15) × 5475 = 3650元

### 转班与调课区别
- **转班**：学生永久转到新班级，后续所有课程都在新班级上
- **调课**：学生临时到其他班级上课，仅针对特定日期或讲次

---

## Apifox 配置指南

### 1. 创建目录结构
1. 在Apifox中创建"我的班级"目录
2. 在目录下创建子目录：转班、调课、退班、考勤、课表

### 2. 配置接口
1. 按照上述接口文档创建12个接口
2. 设置请求方法、路径、Query参数
3. 配置请求体格式（JSON）

### 3. 配置Mock数据
1. 在"高级Mock"中创建Mock规则
2. 复制上述Mock响应到响应示例
3. 设置响应状态码为200
4. 配置Content-Type为application/json

### 4. 配置环境变量
1. 创建"开发环境"，设置baseUrl为你的后端地址
2. 创建"Mock环境"，设置baseUrl为Mock服务器地址
3. 配置全局变量：studentId = "STU202602220001"

### 5. 测试接口
1. 在"运行"页面选择"Mock环境"
2. 发送请求验证Mock数据返回
3. 检查响应格式是否符合预期

### 6. 生成文档
1. 点击"分享"按钮生成API文档
2. 设置文档权限为"公开"或"私有"
3. 复制文档链接分享给团队成员

---

## 注意事项

1. **头像路径**：所有teacher.avatar字段使用本地图片路径 `/images/pic/avatar.png`
2. **状态一致性**：确保接口返回的状态与页面显示的状态一致
3. **退款计算**：退班退款金额必须按讲次计算，不能全额退款
4. **转班与调课**：明确区分转班（永久）和调课（临时）的业务逻辑
5. **权限控制**：所有接口需要验证学生身份，确保只能访问自己的班级数据

---

## 快速开始

1. **导入接口**：将上述接口文档导入Apifox
2. **配置Mock**：复制Mock响应到对应接口
3. **测试接口**：在Mock环境下测试所有接口
4. **集成前端**：在小程序中使用services/my-class.js调用接口
5. **开发调试**：切换至开发环境连接真实后端

/**
 * 本地模拟数据
 * 手机号1: 17788889999 - 有3个学生
 * 手机号2: 12233334444 - 无学生，需要创建档案
 */

// 用户数据
const mockUsers = {
  '17788889999': {
    id: 'user_001',
    phone: '17788889999',
    nickname: '张妈妈',
    token: 'mock_token_17788889999',
    students: [
      {
        id: 'stu_001',
        name: '张小明',
        englishName: 'Tommy',
        gender: 'male',
        birthDate: '2018-05-15',
        grade: '一年级',
        school: '南京市实验小学',
        city: '南京',
        avatar: '/images/pic/avatar.png',
        level: 'K3进阶',
        needTest: false
      },
      {
        id: 'stu_002',
        name: '张小红',
        englishName: 'Lucy',
        gender: 'female',
        birthDate: '2016-08-20',
        grade: '三年级',
        school: '南京市实验小学',
        city: '南京',
        avatar: '/images/pic/avatar.png',
        level: 'K4飞跃',
        needTest: false
      },
      {
        id: 'stu_003',
        name: '张小刚',
        englishName: 'Jack',
        gender: 'male',
        birthDate: '2020-01-10',
        grade: '幼儿园大班',
        school: '南京市第一幼儿园',
        city: '南京',
        avatar: '/images/pic/avatar.png',
        level: null,
        needTest: true
      }
    ]
  },
  '12233334444': {
    id: 'user_002',
    phone: '12233334444',
    nickname: '新用户',
    token: 'mock_token_12233334444',
    students: []
  }
}

// 班级数据 - 按学生ID关联
const mockClasses = {
  'stu_001': [
    {
      id: 'class_001',
      name: 'K3进阶一班',
      productName: 'K3进阶体系课',
      productType: 'system',
      campus: { id: 'campus_001', name: '同曦校区', address: '同曦万尚城二楼' },
      mainTeacher: { id: 'teacher_001', name: 'Esther于哲敏', avatar: '/images/pic/avatar.png' },
      assistantTeacher: { id: 'teacher_003', name: 'Cici陈思', avatar: '/images/pic/avatar.png' },
      schedule: '2026.03.07-2026.06.20 周二、周六 12:00-14:30',
      classroom: '201教室',
      totalSessions: 15,
      currentSession: 6,
      status: 'active',
      joinDate: '2026-02-25',
      nextClassTime: '2026-03-14 12:00',
      attendanceRate: 85,
      remainingSessions: 9
    }
  ],
  'stu_002': [
    {
      id: 'class_002',
      name: 'K4飞跃二班',
      productName: 'K4飞跃体系课',
      productType: 'system',
      campus: { id: 'campus_002', name: '奥体网球中心校区', address: '奥体中心东门' },
      mainTeacher: { id: 'teacher_002', name: 'Shirley苡爽', avatar: '/images/pic/avatar.png' },
      assistantTeacher: { id: 'teacher_004', name: 'Mia米娅', avatar: '/images/pic/avatar.png' },
      schedule: '2026.03.07-2026.06.20 周三、周日 14:00-16:30',
      classroom: '302教室',
      totalSessions: 15,
      currentSession: 4,
      status: 'active',
      joinDate: '2026-02-20',
      nextClassTime: '2026-03-12 14:00',
      attendanceRate: 100,
      remainingSessions: 11
    },
    {
      id: 'class_003',
      name: '剑少一级周末班',
      productName: '剑少一级专项课',
      productType: 'special',
      campus: { id: 'campus_001', name: '同曦校区', address: '同曦万尚城二楼' },
      mainTeacher: { id: 'teacher_001', name: 'Esther于哲敏', avatar: '/images/pic/avatar.png' },
      assistantTeacher: null,
      schedule: '2026.04.01-2026.06.30 周六 09:00-11:00',
      classroom: '203教室',
      totalSessions: 12,
      currentSession: 0,
      status: 'active',
      joinDate: '2026-03-01',
      nextClassTime: '2026-04-01 09:00',
      attendanceRate: 0,
      remainingSessions: 12
    }
  ],
  'stu_003': []
}

// 考勤课表数据 - 按班级ID关联
const mockAttendanceSchedule = {
  'class_001': {
    statistics: {
      presentCount: 4,
      absentCount: 1,
      lateCount: 1,
      leaveCount: 0,
      totalSessions: 6,
      attendanceRate: 83
    },
    attendanceSchedule: [
      {
        date: '2026-03-07',
        session: 5,
        scheduleInfo: {
          startTime: '12:00',
          endTime: '14:30',
          topic: '核心主题训练一',
          scheduleStatus: 'completed'
        },
        attendanceInfo: {
          attendanceStatus: 'present',
          checkInTime: '12:05',
          checkOutTime: '14:25'
        }
      },
      {
        date: '2026-03-04',
        session: 4,
        scheduleInfo: {
          startTime: '12:00',
          endTime: '14:30',
          topic: '词汇拓展训练',
          scheduleStatus: 'completed'
        },
        attendanceInfo: {
          attendanceStatus: 'late',
          checkInTime: '12:20',
          checkOutTime: '14:30'
        }
      },
      {
        date: '2026-02-29',
        session: 3,
        scheduleInfo: {
          startTime: '12:00',
          endTime: '14:30',
          topic: '阅读理解专项',
          scheduleStatus: 'completed'
        },
        attendanceInfo: {
          attendanceStatus: 'present',
          checkInTime: '11:58',
          checkOutTime: '14:28'
        }
      },
      {
        date: '2026-02-25',
        session: 2,
        scheduleInfo: {
          startTime: '12:00',
          endTime: '14:30',
          topic: '语法基础巩固',
          scheduleStatus: 'completed'
        },
        attendanceInfo: {
          attendanceStatus: 'absent',
          checkInTime: '',
          checkOutTime: ''
        }
      },
      {
        date: '2026-02-22',
        session: 1,
        scheduleInfo: {
          startTime: '12:00',
          endTime: '14:30',
          topic: '开学第一课',
          scheduleStatus: 'completed'
        },
        attendanceInfo: {
          attendanceStatus: 'present',
          checkInTime: '12:02',
          checkOutTime: '14:30'
        }
      },
      {
        date: '2026-03-11',
        session: 6,
        scheduleInfo: {
          startTime: '12:00',
          endTime: '14:30',
          topic: '核心主题训练二',
          scheduleStatus: 'upcoming'
        },
        attendanceInfo: {
          attendanceStatus: '',
          checkInTime: '',
          checkOutTime: ''
        }
      },
      {
        date: '2026-03-14',
        session: 7,
        scheduleInfo: {
          startTime: '12:00',
          endTime: '14:30',
          topic: '听力专项训练',
          scheduleStatus: 'upcoming'
        },
        attendanceInfo: {
          attendanceStatus: '',
          checkInTime: '',
          checkOutTime: ''
        }
      },
      {
        date: '2026-03-18',
        session: 8,
        scheduleInfo: {
          startTime: '12:00',
          endTime: '14:30',
          topic: '口语交际实践',
          scheduleStatus: 'upcoming'
        },
        attendanceInfo: {
          attendanceStatus: '',
          checkInTime: '',
          checkOutTime: ''
        }
      },
      {
        date: '2026-03-21',
        session: 9,
        scheduleInfo: {
          startTime: '12:00',
          endTime: '14:30',
          topic: '写作技巧提升',
          scheduleStatus: 'upcoming'
        },
        attendanceInfo: {
          attendanceStatus: '',
          checkInTime: '',
          checkOutTime: ''
        }
      }
    ]
  },
  'class_002': {
    statistics: {
      presentCount: 4,
      absentCount: 0,
      lateCount: 0,
      leaveCount: 0,
      totalSessions: 4,
      attendanceRate: 100
    },
    attendanceSchedule: [
      {
        date: '2026-03-05',
        session: 4,
        scheduleInfo: {
          startTime: '14:00',
          endTime: '16:30',
          topic: '高级阅读技巧',
          scheduleStatus: 'completed'
        },
        attendanceInfo: {
          attendanceStatus: 'present',
          checkInTime: '13:55',
          checkOutTime: '16:30'
        }
      },
      {
        date: '2026-03-02',
        session: 3,
        scheduleInfo: {
          startTime: '14:00',
          endTime: '16:30',
          topic: '写作表达训练',
          scheduleStatus: 'completed'
        },
        attendanceInfo: {
          attendanceStatus: 'present',
          checkInTime: '14:00',
          checkOutTime: '16:28'
        }
      },
      {
        date: '2026-02-26',
        session: 2,
        scheduleInfo: {
          startTime: '14:00',
          endTime: '16:30',
          topic: '语法深化练习',
          scheduleStatus: 'completed'
        },
        attendanceInfo: {
          attendanceStatus: 'present',
          checkInTime: '14:02',
          checkOutTime: '16:30'
        }
      },
      {
        date: '2026-02-23',
        session: 1,
        scheduleInfo: {
          startTime: '14:00',
          endTime: '16:30',
          topic: '课程导入与目标',
          scheduleStatus: 'completed'
        },
        attendanceInfo: {
          attendanceStatus: 'present',
          checkInTime: '13:58',
          checkOutTime: '16:30'
        }
      },
      {
        date: '2026-03-09',
        session: 5,
        scheduleInfo: {
          startTime: '14:00',
          endTime: '16:30',
          topic: '口语交际实践',
          scheduleStatus: 'upcoming'
        },
        attendanceInfo: {
          attendanceStatus: '',
          checkInTime: '',
          checkOutTime: ''
        }
      },
      {
        date: '2026-03-12',
        session: 6,
        scheduleInfo: {
          startTime: '14:00',
          endTime: '16:30',
          topic: '听力强化训练',
          scheduleStatus: 'upcoming'
        },
        attendanceInfo: {
          attendanceStatus: '',
          checkInTime: '',
          checkOutTime: ''
        }
      }
    ]
  },
  'class_003': {
    statistics: {
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      leaveCount: 0,
      totalSessions: 0,
      attendanceRate: 0
    },
    attendanceSchedule: [
      {
        date: '2026-04-01',
        session: 1,
        scheduleInfo: {
          startTime: '09:00',
          endTime: '11:00',
          topic: '剑少一级入门',
          scheduleStatus: 'upcoming'
        },
        attendanceInfo: {
          attendanceStatus: '',
          checkInTime: '',
          checkOutTime: ''
        }
      },
      {
        date: '2026-04-05',
        session: 2,
        scheduleInfo: {
          startTime: '09:00',
          endTime: '11:00',
          topic: '词汇积累一',
          scheduleStatus: 'upcoming'
        },
        attendanceInfo: {
          attendanceStatus: '',
          checkInTime: '',
          checkOutTime: ''
        }
      },
      {
        date: '2026-04-08',
        session: 3,
        scheduleInfo: {
          startTime: '09:00',
          endTime: '11:00',
          topic: '词汇积累二',
          scheduleStatus: 'upcoming'
        },
        attendanceInfo: {
          attendanceStatus: '',
          checkInTime: '',
          checkOutTime: ''
        }
      }
    ]
  }
}

// 退班信息
const mockRefundInfo = {
  'class_001': {
    classInfo: {
      id: 'class_001',
      name: 'K3进阶一班',
      campus: { id: 'campus_001', name: '同曦校区' },
      mainTeacher: { id: 'teacher_001', name: 'Esther于哲敏' },
      schedule: '2026.03.07-2026.06.20 周二、周六 12:00-14:30',
      currentSession: 6,
      totalSessions: 15
    },
    paymentInfo: {
      totalSessions: 15,
      attendedSessions: 5,
      remainingSessions: 10,
      totalPrice: 5475.00,
      pricePerSession: 365.00,
      refundableAmount: 3650.00,
      refundFee: 365.00,
      finalRefundAmount: 3285.00
    }
  }
}

/**
 * 根据手机号获取用户数据
 */
function getUserByPhone(phone) {
  return mockUsers[phone] || null
}

/**
 * 根据学生ID获取班级列表
 */
function getClassesByStudentId(studentId) {
  return mockClasses[studentId] || []
}

/**
 * 根据班级ID获取考勤课表数据
 */
function getAttendanceScheduleByClassId(classId) {
  return mockAttendanceSchedule[classId] || {
    statistics: { presentCount: 0, absentCount: 0, lateCount: 0, leaveCount: 0, totalSessions: 0, attendanceRate: 0 },
    attendanceSchedule: []
  }
}

/**
 * 根据班级ID获取退班信息
 */
function getRefundInfoByClassId(classId) {
  return mockRefundInfo[classId] || null
}

/**
 * 检查手机号是否存在
 */
function isPhoneRegistered(phone) {
  return !!mockUsers[phone]
}

/**
 * 检查用户是否有学生
 */
function hasStudents(phone) {
  const user = mockUsers[phone]
  return user && user.students && user.students.length > 0
}

module.exports = {
  mockUsers,
  mockClasses,
  mockAttendanceSchedule,
  mockRefundInfo,
  getUserByPhone,
  getClassesByStudentId,
  getAttendanceScheduleByClassId,
  getRefundInfoByClassId,
  isPhoneRegistered,
  hasStudents
}

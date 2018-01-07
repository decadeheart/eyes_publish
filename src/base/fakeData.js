import Mock from "mockjs"
export default {
  getPeriodRiserate: {
    code: 200,
    isFinished: false,
    riseData: [
      {riseRate: 20, time: "2017-04-25 08:00:00",riseCount:13,totalCount:100},
      {riseRate: 40, time: "2017-04-25 08:00:30",riseCount:10,totalCount:100},
      {riseRate: 50, time: "2017-04-25 08:01:00",riseCount:15,totalCount:100},
      {riseRate: 10, time: "2017-04-25 08:01:30",riseCount:18,totalCount:100},
      {riseRate: 50, time: "2017-04-25 08:02:00",riseCount:23,totalCount:100},
      {riseRate: 60, time: "2017-04-25 08:02:30",riseCount:19,totalCount:100},
      {riseRate: 80, time: "2017-04-25 08:03:00",riseCount:33,totalCount:100},
      {riseRate: 70, time: "2017-04-25 08:03:30",riseCount:23,totalCount:100},
      {riseRate: 80, time: "2017-04-25 08:04:00",riseCount:17,totalCount:100},
      {riseRate: 75, time: "2017-04-25 08:04:30",riseCount:24,totalCount:100},
      {riseRate: 80, time: "2017-04-25 08:05:00",riseCount:16,totalCount:100},
      {riseRate: 40, time: "2017-04-25 08:05:30",riseCount:18,totalCount:100},
      {riseRate: 30, time: "2017-04-25 08:06:00",riseCount:27,totalCount:100},
      {riseRate: 70, time: "2017-04-25 08:06:30",riseCount:19,totalCount:100},
      {riseRate: 30, time: "2017-04-25 08:07:00",riseCount:29,totalCount:100},
      {riseRate: 20, time: "2017-04-25 08:07:30",riseCount:31,totalCount:100},
      {riseRate: 20, time: "2017-04-25 08:08:00",riseCount:15,totalCount:100},
      {riseRate: 30, time: "2017-04-25 08:08:30",riseCount:13,totalCount:100}
    ],
    picUrlList: [
      "/imgs/test.jpg",
      "/imgs/test1.jpg",
      "/imgs/test.jpg",
      "/imgs/test1.jpg",
      "/imgs/test.jpg",
      "/imgs/test1.jpg",
      "/imgs/test.jpg",
      "/imgs/test.jpg",
      "/imgs/test1.jpg",
      "/imgs/test.jpg",
      "/imgs/test1.jpg",
      "/imgs/test1.jpg",
      "/imgs/test.jpg",
      "/imgs/test.jpg",
      "/imgs/test1.jpg",
      "/imgs/test.jpg",
      "/imgs/test1.jpg",
      "/imgs/test1.jpg"
    ]
  },
  getHeatChartData: {
    code: 200,
    coordinates: [
      [1,9,9,4,5,7,3,8,3,5],
      [4,5,2,4,5,7,3,8,3,5],
      [9,0,4,4,5,7,3,8,3,5],
      [4,4,7,4,5,7,3,8,3,5],
      [8,8,9,4,5,7,3,8,3,5],
      [8,7,4,4,5,7,3,8,3,5],
      [9,4,4,4,5,7,3,8,3,5],
      [5,3,8,4,5,7,3,8,3,5],
      [2,2,3,4,5,7,3,8,3,5],
      [1,2,3,4,5,7,3,8,3,5]
    ],
    max:9
  },
  getRoomInfo: {
    code: 200,
    className: '软工1502班',
    courseName: 'C语言', 
  }
}

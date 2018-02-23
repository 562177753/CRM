var pagesize = 10;
var oppotunity_data = [];
var selected_row = 0;
var m_query_options = {};
$(document).ready(function() {
	pmAgent = pmAgent.load();
	if((!pmAgent) || (pmAgent.is_login != 'Y')) {
		window.location = 'login.html';
		return;
	}
	var currentdate = new Date().Format("yyyy-MM-dd");
	//生成日历
	$('#calendar')
		.fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				//	right : 'month,agendaWeek,agendaDay'
				 right: ' '
			},
			monthNames: ["一月", "二月",
				"三月", "四月", "五月", "六月",
				"七月", "八月", "九月", "十月",
				"十一月", "十二月"
			],
			monthNamesShort:["一月", "二月",
				"三月", "四月", "五月", "六月",
				"七月", "八月", "九月", "十月",
				"十一月", "十二月"
			],
			dayNames:["星期日", "星期一",
				"星期二", "星期三", "星期四",
				"星期五", "星期六"
			],
			dayNamesShort:["星期日", "星期一",
				"星期二", "星期三", "星期四",
				"星期五", "星期六"
			],
			today:["今天"],
			firstDay: 1,
			buttonText: {
                today: '本月',
				month: ' ',
				//													week : '周',
				//													day : '日',
				prev: '上一月',
				next: '下一月'
			},
			defaultDate: currentdate,
			lang: 'zh-cn',
			//					navLinks: true, // can click day/week names to navigate views
			selectable: true,
			selectHelper: true,
			events: function(start, end, timezone, callback) {
				//接口调用
				var options = m_query_options;
				options['username'] = pmAgent.userid;
				var now = new Date(start._i);//获得当前月
				var nowmonth = now.getMonth();
				options['startdate'] =start._d.Format("yyyy-MM-dd");
				options['enddate'] =end._d.Format("yyyy-MM-dd");
				var params = $.param(options, true);
//				console.log(params)
				//流水
				service.liushui_month(params)
					.then(function(data) {
					//	console.log(data);
						var marks = [];
//						var j=0;
						for(var i=0;i<data.length;i++){
//							var _date = new Date(data[i].date);
//							var month =  _date.getMonth();
//							if(nowmonth==month){
								var mark={};
								mark.id='riliushui'+i;
								mark.title='日流水：'+data[i].riliushui;
								mark.start=data[i].date;
//								marks[i-j]=mark;
                                marks[i]=mark;
//							}else{
//								j++;
//							}
						}
						//通话
					service.tonghua_month(params)
						.then(function(data) {
							console.log(data);
							var marks2 = [];
							var marks3 = [];
							for(var i=0;i<data.length;i++){
								var mark={};
								mark.id = 'ritonghua'+i;
								mark.title='通话数：'+data[i].ritonghua;
								mark.start=data[i].date;
								marks2[i]=mark;
								mark={};
								mark.id = 'rishichang'+i;
								mark.title='通话时长：'+data[i].rishichang
								mark.start=data[i].date;
								marks3[i]=mark;	
							}
//						    callback(marks.concat(marks2).concat(marks3));
						     //首姿
						service.shouzi_cnt_month(params)
						.then(function(data) {
							console.log(data);
							var marks4 = [];
//							var marks3 = [];
							for(var i=0;i<data.length;i++){
								var mark={};
								mark.id = 'shouzishu'+i;
								mark.title='首咨数：'+data[i].shouzishu;
								mark.start=data[i].date;
								marks4[i]=mark;
//								
//								marks3[i]=mark;
								
							}
						   	callback(marks.concat(marks4).concat(marks3).concat(marks2));
						
						});
						});
					});
			   }
		});
});


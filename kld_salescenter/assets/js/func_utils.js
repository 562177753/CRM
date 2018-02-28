 // var SERVICE_URL = 'http://192.168.1.85:9091/BlastBomb/';
// var SERVICE_URL = '/kld_salescenter/';
 var SERVICE_URL = 'http://192.168.1.85:9090/kld_salescenter/';
// var SERVICE_URL = 'http://10.75.1.235:8080/kld_salescenter/';

var pmAgent = {
	userid: '',
	password: '',
	exten: '', // 实际登录分机号
	is_login_cti: 'N', //是否勾选
	// 登录后信息
	name: '',
	org_id: '',
	org_name: '',
	corp_id: '',
	corp_name: '',
	department_name: '',
	group_name: '',
	role_id: '',
	role_name: '',
	cti_api: '',
	account: '', // 工号
	is_login: 'N',
	ip:'',
	//	// 操作方法，序列化后方法失效
	save: function () {
		sessionStorage.setItem('pmAgent', JSON.stringify(this));
	},
	load: function () {
		var ret = sessionStorage.getItem('pmAgent');
		return JSON.parse(ret);
	}
};

var service = {
	login: function (uid, pwd, ext, b_cti) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'login?callback=?&user_id=' + uid +
			'&password=' + pwd + '&exten=' + ext;

		$.getJSON(url, function (result) {
			//console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('登录失败');
			else if (result[0]['rescode'] == 1)
			{
				if(result[0]['ip_check'] == 'true'&& result[0]['ip_result'] == 'false')
                    promise.reject('登录环境异常');
				else
					promise.resolve(result[0]);
			}
			else
				promise.reject(result[0]['resmsg']);
		});
		return promise;
	},

    //消息提醒
    get_message: function (params) {
        var promise = $.Deferred(); //
        var url = SERVICE_URL + 'get_message?callback=?';
        $.getJSON(url, params, function (result) {
            // console.log(result)
            promise.resolve(result);
        });
        return promise;
    },



	// 首咨：account=用户名&datatype=0&pagesize=每页数据量&pageindex=当前页数
	oppotunity: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'oppotunity?callback=?';
        // var url='http://10.75.2.212:8080/BlastBomb/oppotunity?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});

		return promise;
	},
	//	//人员信息
	//	online_record:function(params){
	//		var promise = $.Deferred();
	//		var url = SERVICE_URL + 'oppotunity?callback=?';
	//		$.getJSON(url, params, function(result) {
	////			console.log(JSON.stringify(result));
	//				promise.resolve(result);
	//		});
	//		
	//		return promise;
	//		
	//	},

	// 保存工单
	oppotunity_work_ticket: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'oppotunity_work_ticket?callback=?';

		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('保存失败');
			else if (result[0]['rescode'] == -500)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -200)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -100)
				promise.reject(result[0]['resmsg']);
			else
				promise.resolve(result);
		});

		return promise;
	},

	//项目消息中的数据
	get_reservation: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_reservation?callback=?';

		$.getJSON(url, params, function (result) {
			//			    console.log(JSON.stringify(result));

			promise.resolve(result);
		});

		return promise;
	},


	//取消预订
	reservation_cancel: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'reservation_cancel?callback=?';
		$.getJSON(url, params, function (result) {
			// console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('保存失败');
			else if (result[0]['rescode'] == -500)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -200)
				promise.reject(result[0]['resmsg']);
			else
				promise.resolve(result);
		});
		return promise;
	},

	//获取按钮
	get_operate_log: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_operate_log?callback=?';
		$.getJSON(url, params, function (result) {
			//	  	   console.log(result)  
			promise.resolve(result);
		});
		return promise;
	},
	//外省电话获取省份 前加 '0'
	//http://192.168.1.85:9090/BlastBomb/get_finnal_called?mobile=17610391212
	get_finnal_called: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_finnal_called?callback=?';
		$.getJSON(url, params, function (result) {
			// console.log(result)  
			promise.resolve(result);
		});
		return promise;
	},

	//获取分组
	get_role_groups_by_account: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_role_groups_by_account?callback=?';
		$.getJSON(url, params, function (result) {
			//	  	   console.log(result)  
			promise.resolve(result);
		});
		return promise;
	},

	//获取等级
	get_user_level: function (params) {
		var promise = $.Deferred(); //
		var url = SERVICE_URL + 'get_user_level?callback=?';
		$.getJSON(url, params, function (result) {
			//	  	   console.log(result)  
			promise.resolve(result);
		});
		return promise;
	},
	//咨询师获取
	get_role_user_in_group: function (params) {
		var promise = $.Deferred(); //
		var url = SERVICE_URL + 'get_role_user_in_group?callback=?';
		$.getJSON(url, params, function (result) {
			//	  	   console.log(result)  
			promise.resolve(result);
		});
		return promise;
	},
	// 预约报名
	reservation_add: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'reservation_add?callback=?';

		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('保存失败');
			else if (result[0]['rescode'] == -500)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -200)
				promise.reject(result[0]['resmsg']);
			else
				promise.resolve(result);
		});

		return promise;
	},
	// 反馈结果
	oppotunity_feedback: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'oppotunity_feedback?callback=?';

		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('保存失败');
			else if (result[0]['rescode'] == -500)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -200)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -100)
				promise.reject(result[0]['resmsg']);
			else
				promise.resolve(result);
		});

		return promise;
	},
	//个人数据页面查询	
	oppotunity_self: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'oppotunity_self?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('保存失败');
			else if (result[0]['rescode'] == -500)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -200)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -100)
				promise.reject(result[0]['resmsg']);
			else
				promise.resolve(result);
		});

		return promise;
	},
	//个人工作统计->流水
	liushui_month: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'liushui_month?callback=?';

		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			promise.resolve(result);
		});
		return promise;
	},
	//个人工作统计->通话
	tonghua_month : function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'tonghua_month?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			promise.resolve(result);
		});

		return promise;
	},
	//首咨
	shouzi_cnt_month : function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'shouzi_cnt_month?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			promise.resolve(result);
		});

		return promise;
	},
	//首页->排行榜
	liushui_rank: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'liushui_rank?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			promise.resolve(result);
		});

		return promise;
	},
	// 修改学员信息 
	student_mod: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'student_mod?callback=?';
        // var url='http://10.75.2.212:8080/BlastBomb/student_mod?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('保存失败');
			else if (result[0]['rescode'] == -500)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -200)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -100)
				promise.reject(result[0]['resmsg']);
			else
				promise.resolve(result);
		});

		return promise;
	},
    student_mod_1: function (params) {
        var promise = $.Deferred();
        var url = SERVICE_URL + 'student_mod?callback=?';
        // var url='http://10.75.2.212:8080/BlastBomb/student_mod?callback=?';
        $.getJSON(url, params, function (result) {
            //			console.log(JSON.stringify(result));

                promise.resolve(result);
        });

        return promise;
    },
	// 录入校
	get_campus_big_id: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_campus_big_id?callback=?';

		$.getJSON(url,params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});

		return promise;
	},
	//http://10.75.2.212:8080/BlastBomb/get_legion?username=zhaochengzhi
	//获取军团
    get_legion: function (params) {
        var promise = $.Deferred();
        // var url='http://10.75.2.212:8080/BlastBomb/get_legion?callback=?';
        var url = SERVICE_URL + 'get_legion?callback=?';

        $.getJSON(url, params, function (result) {
            //console.log(JSON.stringify(result));
            if (result.length == 0)
                promise.reject('查询失败');
            else if (result[0]['rescode'] == -500)
                promise.reject('查询失败');
            else
                promise.resolve(result);
        });

        return promise;
    },

	//获取小组  http://10.75.2.212:8080/BlastBomb/get_group?username=zhaochengzhi&legion=1001
    get_group: function (params) {
        var promise = $.Deferred();
        // var url='http://10.75.2.212:8080/BlastBomb/get_group?callback=?';
        var url = SERVICE_URL + 'get_group?callback=?';

        $.getJSON(url, params, function (result) {
            //			console.log(JSON.stringify(result));
            if (result.length == 0)
                promise.reject('查询失败');
            else if (result[0]['rescode'] == -500)
                promise.reject('查询失败');
            else
                promise.resolve(result);
        });

        return promise;
    },

	// 分校报名点 school_id=...
	get_campus_id: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_campus_id?callback=?';

		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});

		return promise;
	},
	// 推荐院校 school_id=...
	get_course_major: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_course_major?callback=?';

		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});

		return promise;
	},
	// 推荐班型 major_id=...&big_id=...
	get_course_class: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_course_class?callback=?';

		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});

		return promise;
	},
	//分配提交按钮
	oppotunity_admin_allot: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'oppotunity_admin_allot?callback=?';
		// var url=
		$.getJSON(url, params, function (result) {
			if (result.length == 0)
				promise.reject('提交失败');
			else if (result[0]['rescode'] == -200)
				promise.reject(result[0]['resmsg']);
			else
				promise.resolve(result);
		});

		return promise;
	},
	//首页显示当日通时和当日通话个数
	tonghua: function (uid) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'tonghua?callback=?&username=' + uid;
		$.getJSON(url, uid, function (result) {
			//			    console.log(JSON.stringify(result));

			promise.resolve(result);
		});

		return promise;
	},
	//首页展示当日所分首咨条数
	shouzi_cnt: function (uid) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'shouzi_cnt?callback=?&username=' + uid;
		$.getJSON(url, uid, function (result) {
			//			    console.log(JSON.stringify(result));

			promise.resolve(result);
		});

		return promise;
	},
	//首页->有效统计
	youxiao_tongji: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'youxiao_tongji?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			promise.resolve(result);
		});
		return promise;
	},
	//首页回访比
	huifangbi: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'huifangbi?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			promise.resolve(result);
		});
		return promise;
	},

	get_feedback_list: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_feedback_list?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			promise.resolve(result);
		});
		return promise;
	},
	//首页完成度
	pie_homepage: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'pie_homepage?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			promise.resolve(result);
		});
		return promise;
	},
	// 关联工单选项卡  
	oppotunity_work_ticket_select: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'oppotunity_work_ticket_select?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -200)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -100)
				promise.reject(result[0]['resmsg']);
			else
				promise.resolve(result);
		});

		return promise;
	},
	//反馈记录
	oppotunity_work_ticket_select: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'oppotunity_work_ticket_select?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -200)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -100)
				promise.reject(result[0]['resmsg']);
			else
				promise.resolve(result);
		});

		return promise;
	},
	// 数据录入提交
	oppotunity_inflow: function (params) {
		var promise = $.Deferred();
		/*
		var url = SERVICE_URL + 'oppotunity_inflow?callback=?';
		$.getJSON(url, params, function(result) {
//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});
		*/
		var url = SERVICE_URL + 'oppotunity_inflow';
		$.ajax({
			url: url,
			crossDomain: true,
			type: 'POST',
			// contentType : 'application/x-www-form-urlencoded',
			data: params,
			dataType: 'json',
			// headers:{ 'Access-Control-Allow-Origin' : '*' },
			// xhrFields:{ withCredentials: true },
			success: function (result) {
				//	        	console.log(JSON.stringify(result));
				if (result.length == 0)
					promise.reject('查询失败');
				else
					promise.resolve(result);
			},
			error: function (xhr, status, err) {
				promise.reject('查询失败');
			},
			timeout: 30000
		});

		return promise;
	},
	// 数据录入页面-获取录入校options选项
	// get_campus_big_id: function (params) {
	// 	var promise = $.Deferred();
	// 	var url = SERVICE_URL + 'get_campus_big_id?callback=?';
	// 	$.getJSON(url,params, function (result) {
	// 		//			console.log(JSON.stringify(result));
	// 		if (result.length == 0)
	// 			promise.reject('查询失败');
	// 		else if (result[0]['rescode'] == -500)
	// 			promise.reject('查询失败');
	// 		else
	// 			promise.resolve(result);
	// 	});
	// 	return promise;
	// },

	// 数据录入页面-获取数据来源options选项
	get_source_code: function () {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_source_code?callback=?';
		$.getJSON(url, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});
		return promise;
	},
	// 数据录入页面-获取分配方式options选项
	get_allocation_code: function () {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_allocation_code?callback=?';
		$.getJSON(url, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});
		return promise;
	},
	// 数据录入页面-获取流量中心options选项
	get_flow_name: function () {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_flow_name?callback=?&account=' + pmAgent.userid;
		$.getJSON(url, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});
		return promise;
	},
	// 数据录入页面-获取省份options选项
	get_province: function () {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_province?callback=?';
		$.getJSON(url, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});
		return promise;
	},
	// 数据录入页面-获取城市
	get_city: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_city?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});
		return promise;
	},
	// 获取项目大类
	get_course_big_id: function () {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_course_big_id?callback=?';
		$.getJSON(url, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});
		return promise;
	},
	// 数据录入页面-根据子站点URL获取录入校、项目、流量中心、省份、城市
	get_project_info: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_project_info?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});
		return promise;
	},
	//分配任务
	get_user_mission: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'get_user_mission?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});
		return promise;
	},
	set_user_mission: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'set_user_mission?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});
		return promise;
	},


	// 录音查询
	record_select: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'record_select?callback=?';

		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('保存失败');
			else if (result[0]['rescode'] == -500)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -200)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -100)
				promise.reject(result[0]['resmsg']);
			else
				promise.resolve(result);
		});

		return promise;
	},
	// 公海查询
	oppotunity_pool_select: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'oppotunity_pool_select?callback=?';

		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else if (result[0]['rescode'] == -500)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -200)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -100)
				promise.reject(result[0]['resmsg']);
			else
				promise.resolve(result);
		});

		return promise;
	},
	// 批量领取
	oppotunity_pool_batch_get: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'oppotunity_pool_batch_get?callback=?';

		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('领取失败');
			else if (result[0]['rescode'] == -500)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -200)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -100)
				promise.reject(result[0]['resmsg']);
			else
				promise.resolve(result);
		});

		return promise;
	},
	// 放弃到公海
	oppotunity_pool_abandon: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'oppotunity_pool_abandon?callback=?';

		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('提交失败');
			else if (result[0]['rescode'] == -500)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -200)
				promise.reject(result[0]['resmsg']);
			else if (result[0]['rescode'] == -100)
				promise.reject(result[0]['resmsg']);
			else
				promise.resolve(result);
		});

		return promise;
	},

	// 手机号查询
	oppotunity_search: function (params) {
		var promise = $.Deferred();
		var url = SERVICE_URL + 'oppotunity_search?callback=?';
		// var url='http://10.75.2.212:8080/BlastBomb/oppotunity_search?callback=?';
		$.getJSON(url, params, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('查询失败');
			else
				promise.resolve(result);
		});

		return promise;
	},
	//优惠券绑定
    link_coupon: function (params) {
        var promise = $.Deferred();
        var url = SERVICE_URL + 'link_coupon?callback=?';
        $.getJSON(url, params, function (result) {
            //console.log(JSON.stringify(result));
            if (result.length == 0)
                promise.reject('绑定失败');
            else
                promise.resolve(result);
        });
        return promise;
    },


    //优惠券查询
    get_coupon_stu: function (params) {
        var promise = $.Deferred();
        var url = SERVICE_URL + 'get_coupon_stu?callback=?';
        $.getJSON(url, params, function (result) {
            //console.log(JSON.stringify(result));
            if (result.length == 0)
                promise.reject('查询失败');
            else
                promise.resolve(result);
        });
        return promise;
    },
	//提交推广费
    spread_edit: function (params) {
        var promise = $.Deferred();
        // var url = 'http://10.76.1.29:8080/BlastBomb/spread_edit?callback=?';
		var url = SERVICE_URL + 'spread_edit?callback=?';
        $.getJSON(url, params, function (result) {
            //			console.log(JSON.stringify(result));
            if (result.length == 0)
                promise.reject('保存失败');
            else if (result[0]['rescode'] == -500)
                promise.reject(result[0]['resmsg']);
            else
                promise.resolve(result);
        });

        return promise;
    },

    //工作明细
    // http://192.168.1.85:9090/BlastBomb/rpt_search?username=fengwei&account=fengwei
    rpt_search: function (params) {
        var promise = $.Deferred();
        //http://192.168.1.85:9091/BlastBomb/rpt_search?username=fengwei&account=zhaochengzhi
		// var url = 'http://10.75.2.212:8080/BlastBomb/rpt_search?callback?';
        var url = SERVICE_URL + 'rpt_search?callback=?';
        $.getJSON(url, params, function (result) {
            //console.log(JSON.stringify(result));
            if (result.length == 0)
                promise.reject('查询失败');
            else
                promise.resolve(result);
        });
        return promise;
    },

	/*********************************************************************************************/

	set_session: function (key, value) {
		sessionStorage.setItem(key, value);
	},

	get_session: function (key) {
		var ret = sessionStorage.getItem(key);
		return ret;
	},

	delete_session: function (key) {
		sessionStorage.removeItem(key);
	},

	alert: function (msg, level, type) {
		if (type == 0) {
			// sweetAlert
			swal({
				"title": "提示",
				"text": msg,
				"type": level, //"warning", "error", "success", "info"
				"confirmButtonText": "确定",
				"customClass": "kaladi-sweet-alert"
			});
		}
	}
};

var softcall = {
	//检查分机是否存在，是否登陆SIP
	getGhidExten: function (uid, ext) {
		var promise = $.Deferred();
		var url = pmAgent.cti_api + '/kjcc/getGhidExten/' + uid + '/' + ext +
			'?callback=?'

		$.getJSON(url, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('获取工号和分机信息失败');
			else if (result['errcode'] == 200)
				promise.resolve(result);
			else
				promise.reject(result['errTips']);
		});

		return promise;
	},

	ATGetExtstatus: function (ext) {
		var promise = $.Deferred();
		var url = pmAgent.cti_api + '/kjcc/ATGetExtstatus/' + ext +
			'?callback=?'

		$.getJSON(url, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('获取分机状态信息失败');
			else if (result['extstatus'] == 0)
				promise.resolve(result);
			else
				promise.reject(result['msg']);
		});

		return promise;
	},
	//签出技能组
	doQueueRemove: function (uid, ext) {
		var promise = $.Deferred();
		var url = pmAgent.cti_api + '/kjcc/doQueueRemove/' + uid + '/' + ext +
			'?callback=?'

		$.getJSON(url, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('签出失败');
			else if (result['msg'] == 1)
				promise.resolve(result);
			else
				promise.reject(result['status']);
		});

		return promise;
	},
	//拨号
	ATPlacecall: function (uid, caller, called) {
		var promise = $.Deferred();
		var url = pmAgent.cti_api + '/kjcc/ATPlacecall/' + uid + '/' + caller + '/' + called +
			'?callback=?'

		$.getJSON(url, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('呼叫失败');
			else if (result['placecall'] == 200)
				promise.resolve(result['msg']);
			else
				promise.reject(result['msg']);
		});

		return promise;
	},
	//挂机
	ATHangup: function (ext) {
		var promise = $.Deferred();
		var url = pmAgent.cti_api + '/kjcc/ATHangup/' + ext + '?callback=?'

		$.getJSON(url, function (result) {
			//			console.log(JSON.stringify(result));
			if (result.length == 0)
				promise.reject('挂机失败');
			else if (result['hangup'] == 1)
				promise.resolve(result['msg']);
			else
				promise.reject(result['msg']);
		});

		return promise;
	}
};
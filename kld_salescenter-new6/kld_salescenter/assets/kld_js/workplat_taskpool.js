var m_pagesize = 60;

var m_oppotunity_data = [];

var m_query_options = {};


$(document).ready(function() {
	// 登录个人信息
	pmAgent = pmAgent.load();
	if ((!pmAgent) || (pmAgent.is_login != 'Y')) {
		window.location = 'login.html';
		return;
	}
	
	// 查询
	$('#query_btn').on('click', function() { onTriggerEventHandler('#query_btn'); });
	// 重置
	$('#reset_btn').on('click', function() { onTriggerEventHandler('#reset_btn'); });
	// 批量领取
	$('#batch_get_btn').on('click', function() { onTriggerEventHandler('#batch_get_btn'); });
	// 全选
	$('#row_all_chk').on('change', function() { onTriggerEventHandler('#row_all_chk') });
	// 当点击 上一页、下一页  输入值
	$('.am-pagination-prev').on('click', function() { onTriggerEventHandler('.am-pagination-prev'); });
	$('.am-pagination-next').on('click', function() {onTriggerEventHandler('.am-pagination-next');
	});
	$("#page_enter").click(function () {onTriggerEventHandler('#page_enter');});

	// 填充数据
	options={
		"account": pmAgent.userid
	}
	var params = $.param(options, true);
	service.get_campus_big_id(params)
	.then(function(data) {
		var opts = '<option value="" selected="selected"></option>';
		for (var i = 0; i < data.length; i++) {
			opts += '<option value="' + data[i].id + '">' 
				+ data[i].name 
				+ '</option>';
		}
		$('#campus_big_select').html(opts);
	});
	
	service.get_course_big_id()
	.then(function(data) {
		var opts = '<option value="" selected="selected"></option>';
		for (var i = 0; i < data.length; i++) {
			opts += '<option value="' + data[i].id + '">' 
				+ data[i].name 
				+ '</option>';
		}
		$('#course_type_select').html(opts);
	});
	
	$('#first_sdate_txt').attr('placeholder', getDateNow('yyyy-MM-01'));
	$('#first_edate_txt').attr('placeholder', getDateNow('yyyy-MM-dd'));
});

function fill_dataGrid(data) {
	var row = '';
	var table = $('#pool_tbl tbody');
	table.empty();
//	console.log(data)
	for (var i = 1; i < data.length; i++) {
		row = '<tr>'
			+ '<td  class="am-text-right am-text-middle">'
			+ '<input class="table-cell-checkbox" type="checkbox" onchange="onRowItemClickedEventHandler(' + i + ', \'select\')" />' 
			+ '</td>'
			+ '<td  class="am-text-center am-text-middle">' + data[i].student_name + '</td>'
			+ '<td  class="am-text-center am-text-middle">' + data[i].t_sys_office_campus_name + '</td>'
			+ '<td  class="am-text-center am-text-middle">' + data[i].course_big_name + '</td>'
			+ '<td  class="am-text-center am-text-middle">' + data[i].first_account + '</td>'
			+ '<td  class="am-text-center am-text-middle">' + data[i].create_time + '</td>'
			+ '<td  class="am-text-center am-text-middle">' + data[i].account + '</td>'
			+ '<td  class="am-text-center am-text-middle">' + data[i].feedback_time + '</td>'
//			+ '<td>' + data[i].cur_intent_code + '</td>'
//			+ '<td  class="am-text-center am-text-middle">' + data[i].effective_count + '</td>'
//			+ '<td>' + data[i].recovery_num + '</td>'
			+ '<td  class="am-text-center am-text-middle">' + data[i].reference_code + '</td>'
			+ '<td  class="am-text-center am-text-middle"><div class="tpl-table-black-operation">' 
			+ '<a href="javascript:;" onclick="onRowItemClickedEventHandler(' + i + ', \'get\')" style="width: 50px;height: 25px;background-color: #6193d8;border-radius: 4px;margin-right: 5px;color: #fff;font-size: 16px">领取</a>'
			+ '<a class="tpl-table-black-operation-del" href="javascript:;" onclick="onRowItemClickedEventHandler(' + i + ', \'hist\')" style="width: 50px;height: 25px;background-color: #f6748e;border-radius: 4px;color: #fff;font-size: 16px">历史</a>'
			+ '</div></td>'
			+ '</tr>';
		
		table.append(row);
	}
	
	var page_total = Math.ceil(data[0].count / m_pagesize);
	var page_index = parseInt(data[0].pageindex);
	if (page_total > 0)
		$('.am-pagination-current span').text(page_index + ' / ' + page_total);
}

function onRowItemClickedEventHandler(row, name) {
	if (name == 'select') {
		// 选中行特效
		var chkbox = $('.table-cell-checkbox').eq(row);
		var tableRow = $('#pool_tbl').find('tr').eq(row);
		if (chkbox.is(':checked'))
			tableRow.removeClass('am-primary').addClass('am-primary');
		else
			tableRow.removeClass('am-primary');
	}
	else if (name == 'get') {
		var options = {
			"opid" : m_oppotunity_data[row]['id'],
			"account" : pmAgent.userid
		};
		// console.log(options);
		var params = $.param(options, true);
		service.oppotunity_pool_batch_get(params)
		.then(function(data) {
			// 刷新dataGrid
			var page_index = parseInt(m_oppotunity_data[0].pageindex);
			var options = m_query_options;
			options['pagesize'] = m_pagesize;
			options['pageindex'] = page_index;
			options['account'] = pmAgent.userid;
			var params = $.param(options, true);
			service.oppotunity_pool_select(params)
			.then(function(data) {
				m_oppotunity_data = data;
				
				if (m_oppotunity_data.length < 2) {
					service.alert('没有记录', 'info', 0);
					return;
				}
				
				fill_dataGrid(m_oppotunity_data);
			})
			.fail(function(data) {
				m_oppotunity_data = [];
			});
			
			service.alert(data[0]['resmsg'], 'info', 0);
		})
		.fail(function(data) {
			service.alert(data, 'error', 0);
		});
	}
	else if (name == 'hist') {
		$('#hist_content').text(m_oppotunity_data[row]['sky_work_ticket_remark']);
		$('#hist_modal').modal();
	}
}


function onTriggerEventHandler(selector) {
	if (selector == '#query_btn') {
		
		//修改的全选按钮
		var qxa=setTimeout(function(){
			$("#row_all_chk").attr("checked",false);
			$("#row_all_chk").removeAttr("disabled")
		},600)
		
		
		var options = {};
		
		var val = $('#campus_big_select').val();
		if (val) options['campus_big_id'] = val;
		val = $('#course_type_select').val();
		if (val) options['course_type_id'] = val;
		val = $('#first_person_txt').val();
		if (val) options['first_person'] = val;
		val = $('#first_sdate_txt').val();
		if (val) 
			options['first_sdate'] = val;
		else
			options['first_sdate'] = getDateNow('yyyy-MM-01');
		val = $('#first_edate_txt').val();
		if (val) 
			options['first_edate'] = val;
		else
			options['first_edate'] = getDateNow('yyyy-MM-dd');
		val = $('#last_person_txt').val();
		if (val) options['last_person'] = val;
		val = $('#last_sdate_txt').val();
		if (val) options['last_sdate'] = val;
		val = $('#last_edate_txt').val();
		if (val) options['last_edate'] = val;
//		val = $('#follow_cnt_txt').val();
//		if (val) options['follow_cnt'] = val;
//		val = $('#abandon_cnt_txt').val();
//		if (val) options['abandon_cnt'] = val;
		val = $('#last_type_select').val();
		if (val) options['last_type'] = val;
		
		m_query_options = options;
		
		options['pagesize'] = m_pagesize;
		options['pageindex'] = 1;
		options['account'] = pmAgent.userid;
		var params = $.param(options, true);
		service.oppotunity_pool_select(params)
		.then(function(data) {
			m_oppotunity_data = data;
			
			if (m_oppotunity_data.length < 2) {
				service.alert('没有记录', 'info', 0);
				return;
			}
			
			fill_dataGrid(m_oppotunity_data);
		})
		.fail(function(data) {
			m_oppotunity_data = [];
			service.alert(data, 'error', 0);
		});
		
		
		
	}
	else if (selector == '#reset_btn') {
		m_query_options = {};
		
		$('form')[0].reset();
		$('[data-am-selected]').trigger('changed.selected.amui');
		//$('[data-am-datepicker]').datepicker('setValue', '');
	}
	else if (selector == '#batch_get_btn') {
		//修改的全选按钮
		var qxa=setTimeout(function(){
			$("#row_all_chk").attr("checked",false);
			$("#row_all_chk").removeAttr("disabled")
		},600)
		
		var opid_lst = '';
		$('.table-cell-checkbox:not(#row_all_chk)').each(function(i, el) {
			if ($(this).is(':checked'))
				opid_lst += m_oppotunity_data[i + 1]['id'] + '|';
		});
		opid_lst = opid_lst.replace(/\|$/, '');
		
		if(opid_lst == '') {
			service.alert('请选取公海数据', 'warning', 0);
			return;
		}
		
		var options = {
			"opid" : opid_lst,
			"account" : pmAgent.userid
		};
		var params = $.param(options, true);
		service.oppotunity_pool_batch_get(params)
		.then(function(data) {
			// 刷新dataGrid
			var page_index = parseInt(m_oppotunity_data[0].pageindex);
			var options = m_query_options;
			options['pagesize'] = m_pagesize;
			options['pageindex'] = page_index;
			options['account'] = pmAgent.userid;
			var params = $.param(options, true);
			service.oppotunity_pool_select(params)
			.then(function(data) {
				m_oppotunity_data = data;
				
//				if (m_oppotunity_data.length < 2) {
//					service.alert('没有记录', 'info', 0);
//					return;
//				}
				
				fill_dataGrid(m_oppotunity_data);
			})
			.fail(function(data) {
				m_oppotunity_data = [];
			});
			
			service.alert(data[0]['resmsg'], 'info', 0);
		})
		.fail(function(data) {
			service.alert(data, 'error', 0);
		});
	}
	else if (selector == '#row_all_chk') {
		if ($(selector).is(':checked')) {
			$('.table-cell-checkbox:not(' + selector + '):not(:checked)').click();
		}
		else {
			$('.table-cell-checkbox:not(' + selector + '):checked').click();
		}
	}
	else if (selector == '.am-pagination-prev') {
		var page_total = Math.ceil(m_oppotunity_data[0].count / m_pagesize);
		var page_index = parseInt(m_oppotunity_data[0].pageindex);
		if (page_index <= 1) return;
		
		
		
		var options = m_query_options;
		options['pagesize'] = m_pagesize;
		options['pageindex'] = page_index - 1;
		options['account'] = pmAgent.userid;
		var params = $.param(options, true);
		service.oppotunity_pool_select(params)
		.then(function(data) {
			m_oppotunity_data = data;
			
			fill_dataGrid(m_oppotunity_data);
		})
		.fail(function(data) {
			m_oppotunity_data = [];
		});
	}
	else if (selector == '.am-pagination-next') {
		var page_total = Math.ceil(m_oppotunity_data[0].count / m_pagesize);
		var page_index = parseInt(m_oppotunity_data[0].pageindex);
		if (page_index >= page_total) return;
		var options = m_query_options;
		options['pagesize'] = m_pagesize;
		options['pageindex'] = page_index + 1;
		options['account'] = pmAgent.userid;
		var params = $.param(options, true);
		service.oppotunity_pool_select(params)
		.then(function(data) {
			m_oppotunity_data = data;
			
			fill_dataGrid(m_oppotunity_data);
		})
		.fail(function(data) {
			m_oppotunity_data = [];
		});
	
	}//当输入页码时
    else if (selector == '#page_enter') {
	
        var page_total = Math.ceil(m_oppotunity_data[0].count / m_pagesize);
        var page_index = parseInt(m_oppotunity_data[0].pageindex);
        var options = m_query_options;
        options['pagesize'] = m_pagesize;
        var page_index_new = $('.page_num').val();
        if (page_index_new > page_total) {
            // options['pageindex'] = page_total;
            // $('.am-pagination-current span').text( page_total + ' / ' + page_total);
            swal("", '请输入合理数值', "warning");
        }else {
            options['pageindex'] = page_index_new;
        }
        options['account'] = pmAgent.userid;
        var params = $.param(options, true);
        service.oppotunity_pool_select(params)
            .then(function(data) {
              //  console.log(data);
                m_oppotunity_data = data;

                fill_dataGrid(m_oppotunity_data);
            })
            .fail(function(data) {
                m_oppotunity_data = [];
            });

    }
}

function getDateNow(fmt) {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1 + '';
	if (month.length < 2) month = '0' + month;
	var day = date.getDate() + '';
	if (day.length < 2) day = '0' + day;
	
	if (fmt == 'yyyy-MM-dd') {
		return year + '-' + month + '-' + day;
	}
	else if (fmt == 'yyyy-MM-01') {
		return year + '-' + month + '-01';
	}
}
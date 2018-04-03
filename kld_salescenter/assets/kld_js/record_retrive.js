var m_pagesize = 10;

var m_record_data = [];
var m_selected = 0;

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
	// 上一页、下一页
	$('.am-pagination-prev').on('click', function() { onTriggerEventHandler('.am-pagination-prev'); });
	$('.am-pagination-next').on('click', function() { onTriggerEventHandler('.am-pagination-next'); });
	// 关闭录音播放
	$('#play_close_btn'). on('click', function() { onTriggerEventHandler('#play_close_btn'); });
	//输入页码
	$('#page_enter'). on('click', function() { onTriggerEventHandler('#page_enter'); });
	
	// 填充数据
	//	$('#sdate_txt').val(getDateNow('yyyy-MM-dd'));
	//	$('#edate_txt').val(getDateNow('yyyy-MM-dd'));
	
});

//填充dataGrid，注意分页
function fill_dataGrid(data) {
	var row = '';
	var table = $('#record_tbl tbody');
	table.empty();
	
	for (var i = 1;i < data.length;i++) {
		row = '<tr>'
			+ '<td class="am-text-center am-text-middle">' + data[i].SERVERID + '</td>'
			+ '<td class="am-text-center am-text-middle">' + data[i].CALLER + '</td>'
			+ '<td class="am-text-center am-text-middle">' + data[i].CALLED + '</td>'
			+ '<td class="am-text-center am-text-middle">' + data[i].OPID + '</td>'
			+ '<td class="am-text-center am-text-middle">' + data[i].starttime + '</td>'
			+ '<td class="am-text-center am-text-middle">' + data[i].endtime + '</td>'
			+ '<td class="am-text-center am-text-middle">' + data[i].totalentime + '</td>'
			+ '<td class="am-text-center am-text-middle">' + data[i].callstate + '</td>'
			+ '<td class="am-text-center am-text-middle">' + data[i].calltype + '</td>'
			+ '<td class="am-text-center am-text-middle"><div class="tpl-table-black-operation">'
			+ '<a href="javascript:;" onclick="onRowItemClickedEventHandler(' + i + ', \'play\')"><i class="am-icon-music"></i>播放</a>'
			+ '</div></td>'
			+ '</tr>';
		
		table.append(row);
	}
	
	var page_total = Math.ceil(data[0].count / m_pagesize);
	var page_index = parseInt(data[0].pageindex);
	if (page_total > 0){
		$('.am-pagination-current span').text(page_index + ' / ' + page_total)
	}else {
        $('.am-pagination-current span').text(' ... ');
    };
}
function onRowItemClickedEventHandler(row, name) {
	m_selected = row;
	// 选中行特效
	var table = $('#record_tbl tbody');
	table.find('tr').each(function(i, el) {
		if (i == (row - 1))
			$(this).removeClass('am-primary').addClass('am-primary');
		else 
			$(this).removeClass('am-primary');
	});
	
	if (name == 'play') {
		$('#play_mediaplayer')[0].src = m_record_data[row]['LOG_FILE'];
		$('#play_mediaplayer')[0].play();
		$('#play_modal').modal();
	}
}

function onTriggerEventHandler(selector) {
	if (selector == '#query_btn') {
		var options = {};
		options['account'] = pmAgent.userid;
		var val = $('#ghid_txt').val();
		if (val) options['opcode'] = val;
		val = $('#caller_txt').val();
		if (val) options['caller'] = val;
		val = $('#called_txt').val();
		if (val) options['called'] = val;
		val = $('#sdate_txt').val();
		if (val) options['sdate'] = val;
		val = $('#edate_txt').val();
		if (val) options['edate'] = val;
		val = $('#connect_select').val();
		if (val) options['is_call_connect'] = val;
		val = $('#slen_txt').val();
		if (val) options['STOTALEN'] = val;
		val = $('#elen_txt').val();
		if (val) options['ETOTALEN'] = val;
		
		if (options['opcode'] || options['caller'] || options['called']) {
			
		}
		else {
			service.alert('请填写工号、主叫、被叫至少一项', 'warning', 0);
			return;
		}
		
		if (options['sdate'] && options['edate']) {
			val = options['sdate'].substr(0, 7);
		}
		else {
			service.alert('查询日期不能为空', 'warning', 0);
			return;
		}
		
		if (val == options['edate'].substr(0, 7)) {
			
		}
		else {
			service.alert('只能查询同一个月内的录音记录', 'warning', 0);
			return;
		}
		m_query_options = options;
		
		options['pagesize'] = m_pagesize;
		options['pageindex'] = 1;
		var params = $.param(options, true);
		service.record_select(params)
		.then(function(data) {
			m_record_data = data;
			m_selected = 0;
			
			if (m_record_data.length < 2) {
                var table = $('#record_tbl tbody');
                table.empty();
                fill_dataGrid(m_record_data);
				service.alert('没有记录', 'info', 0);
				return;
			}
			
			fill_dataGrid(m_record_data);
		})
		.fail(function(data) {
			m_record_data = [];
			m_selected = 0;
			service.alert(data, 'error', 0);
		});
	}
	else if (selector == '#reset_btn') {
		m_query_options = {};
		
		$('form')[0].reset();
		$('#sdate_txt').datepicker('setValue', "MM-dd")
		$('#edate_txt').datepicker('setValue', "MM-dd")
	}
	else if (selector == '.am-pagination-prev') {
		var page_total = Math.ceil(m_record_data[0].count / m_pagesize);
		var page_index = parseInt(m_record_data[0].pageindex);
		if (page_index <= 1) return;
		
		var options = m_query_options;
		options['pagesize'] = m_pagesize;
		options['pageindex'] = page_index - 1;
		var params = $.param(options, true);
		service.record_select(params)
		.then(function(data) {
			m_record_data = data;
			m_selected = 0;
			
			fill_dataGrid(m_record_data);
		})
		.fail(function(data) {
			m_record_data = [];
			m_selected = 0;
		});
	}
	else if (selector == '.am-pagination-next') {
		var page_total = Math.ceil(m_record_data[0].count / m_pagesize);
		var page_index = parseInt(m_record_data[0].pageindex);
		if (page_index >= page_total) return;
		
		var options = m_query_options;
		options['pagesize'] = m_pagesize;
		options['pageindex'] = page_index + 1;
		var params = $.param(options, true);
		service.record_select(params)
		.then(function(data) {
			m_record_data = data;
			m_selected = 0;
			
			fill_dataGrid(m_record_data);
		})
		.fail(function(data) {
			m_record_data = [];
			m_selected = 0;
		});
	}
	
	else if (selector == '#page_enter') {
		var page_total = Math.ceil(m_record_data[0].count / m_pagesize);
		var page_index = parseInt(m_record_data[0].pageindex);
		if (page_index >= page_total) return;
		
		var options = m_query_options;
		options['pagesize'] = m_pagesize;
		// options['pageindex'] = page_index + 1;
		var page_index_new = $('.page_num').val();
        if (page_index_new > page_total) {
           // options['pageindex'] = page_total;
           // $('.am-pagination-current span').text(page_index + ' / ' + page_total);
            swal("", '请输入合理数值', "warning");
        } else {
            options['pageindex'] = page_index_new;
        }
		var params = $.param(options, true);
		service.record_select(params)
		.then(function(data) {
			m_record_data = data;
			m_selected = 0;
			
			fill_dataGrid(m_record_data);
		})
		.fail(function(data) {
			m_record_data = [];
			m_selected = 0;
		});
	}

	else if (selector == '#play_close_btn') {
		$('#play_mediaplayer')[0].pause();
		$('#play_modal').modal('close');
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
const pagesize = 10;
const datatype = 6;
var inquiry_data = [];
//var selected_row = 0;

var m_query_options = {};

$(document).ready(function() {	
	// 登录个人信息
	pmAgent = pmAgent.load();
	if((!pmAgent) || (pmAgent.is_login != 'Y')) {
		window.location = 'login.html';
		return;
	}
    // 开始查询按钮
	$('#query_btn_2').on('click', function() {
		onTriggerEventHandler('#query_btn_2');
	});
	// 上一页、下一页 先做分 ，参考那边做
	$('.am-pagination-prev').on('click', function() {
		onTriggerEventHandler('.am-pagination-prev');
	});
	$('.am-pagination-next').on('click', function() {
		onTriggerEventHandler('.am-pagination-next');
	});
     
})


function onTriggerEventHandler(selector) {
		if(selector == "#query_btn_2") {
		    	var options = {};
		    	options["account"] = pmAgent.userid;
		        var val = $('#inquiry_flow_2').val(); //类型
		        if(val) options['type'] = val;
		        
		        val = $('#last_sdate_txt_2').val(); //日期
		        if(val) options['date'] = val;
		        
		         m_query_options=options
		         options['pagesize'] = pagesize;
		         options['pageindex'] = 1;
		         options['datatype'] = datatype;
		         var params = $.param(options, true);
		         service.oppotunity_self(params)
				.then(function(data) {
						inquiry_data = data;
					    fill_dataGrid(inquiry_data);
                    //    console.log(data)
				});
		         
		}else if(selector.indexOf('#get_operate_log') > -1) {
		var params = selector.split(";");
		var param = params[1];
		service.get_operate_log(param)
			.then(function(data) {
				// console.log(data);
				//取到数据 数据绑定窗口里 然后显示窗口
				var options = {
					'width': '650px'
				};
				$('#appoint_modal').modal(options);
				var row = '';
				var table2 = $('#inquirey_appointment tbody');
				table2.empty();
				var init = 0;
				for(var i = 0; i < data.length; i++) {
					init++;
					row = '<tr style="height: 60px;">' +
						'<td  class="am-text-center am-text-middle" style="border: none;height: 60px;">' + ([init] || '') + '</td>' +
						'<td  class="am-text-center am-text-middle" style="border: none;height: 60px;">' + (data[i].account || '') + '</td>' +
						'<td  class="am-text-center am-text-middle" style="border: none;height: 60px;">' + (data[i].operator || '') + '</td>' +
						'<td  class="am-text-center am-text-middle" style="border: none;height: 60px;">' + (data[i].operator_time || '') + '</td>' +
						'<td  class="am-text-center am-text-middle" style="border: none;height: 60px;">' + (data[i].operate_type_code || '') + '</td>' +
						'<td class="am-text-center am-text-middle" style="border: none;height: 60px;">' + (data[i].sub_operate_type || '') + '</td>' +
						'<td  class="am-text-center am-text-middle" style="border: none;height: 60px;">' + (data[i].remark || '') + '</td>' +
						'</tr>';
					table2.append(row);
				}
			});
	}else if(selector.indexOf('#oppotunity') > -1) {
		var params = selector.split(";");
		var param = params[1] + "&datatype="+datatype;
		service.oppotunity(param)
			.then(function(data) {
				console.log(data);
				var options = {
					'width': '600px'
				};
				$('#appoint_modal2').modal(options);
				var row = '';
				var table3 = $('#inquirey_appointment2 tbody');
				table3.empty();

				for(var i = 1; i < data.length; i++) {
					row = '<tr>' +
						'<td style="padding: 0;"><textarea style="width:100%;height:200px">' + (data[i].online_record || '') + '</textarea></td>' +
						'</tr>';
				}
				table3.append(row); 
			})
	}
	 //前翻页
	  else if (selector == '.am-pagination-prev') {
	  	if(inquiry_data.length>0){
	  		var page_total = Math.ceil(inquiry_data[0].count / pagesize);
			var page_index = parseInt(inquiry_data[0].pageindex);
			if (page_index <= 1) return;
			
			var options = m_query_options;
			options['account'] = pmAgent.userid;
			options['pagesize'] = pagesize;
			options['pageindex'] = page_index - 1;
			options['datatype'] =datatype; //
			var params = $.param(options, true);
			service.oppotunity_self(params)
			.then(function(data) {
				inquiry_data = data;
				fill_dataGrid(inquiry_data);
			})
			.fail(function(data) {
				inquiry_data = [];
			});
	  	}else{
	  		var table = $('#inquirys_tbl_2 tbody');
			table.empty();
	  	}
	}
	  //后翻页  
	  else if (selector == '.am-pagination-next') {
	  	if(inquiry_data.length>0){
	  	   var page_total = Math.ceil(inquiry_data[0].count / pagesize);
			var page_index = parseInt(inquiry_data[0].pageindex);
			if (page_index >= page_total) return;
			
			var options = m_query_options;
			options['account'] = pmAgent.userid;
			options['pagesize'] = pagesize;
			options['pageindex'] = page_index + 1;
			options['datatype'] = datatype;
			var params = $.param(options, true);
			service.oppotunity_self(params)
			.then(function(data) {
				inquiry_data = data;
				fill_dataGrid(inquiry_data);
			})
			.fail(function(data) {
				inquiry_data = [];
				selected_row = 0;
			});
	  	}else{
	  		var table = $('#inquirys_tbl_2 tbody');
			table.empty();
	  	}
		
	}
		
		
}
	
	
	//填充数据
	function fill_dataGrid(data) {
	var row = '';
	var table = $('#inquirys_tbl_2 tbody');
	table.empty();
	if(data.length > 0) {
		var page_index = parseInt(data[0].pageindex);
		var no = (page_index - 1) * pagesize + 1; //
		for(var i = 1; i < data.length; i++) {
			var bean = data[i];
//			var param = "account=" + bean.account + "&id=" + bean.student_id + "&opid=" + bean.id;
            var param = "account=" + pmAgent.userid + "&opid=" + bean.id;
			var param2 = "account=" + pmAgent.userid + "&opid=" + bean.id;
			row = '<tr>' +
				'<td class="am-text-center am-text-middle">' + no + '</td>' +
				'<td class="am-text-center am-text-middle">' + (bean.course_big_id_name || '') + '</td>' +
				'<td class="am-text-center am-text-middle">' + (bean.student_name || '') + '</td>' +
				'<td class="am-text-center am-text-middle">' + (bean.student_cellphone || '') + '</td>' +
				'<td class="am-text-center am-text-middle" >' + (bean.reference_code || '') + '</td>' +
				'<td class="am-text-center am-text-middle">' + (bean.source_code || '') + '</td>' +
				'<td class="am-text-center am-text-middle">' + (bean.create_time || '') + '</td>' +
				'<td class="am-text-center am-text-middle">' + (bean.distribution_time || '') + '</td>' +
				'<td class="am-text-center am-text-middle">' + (bean.account || '') + '</td>' +
				'<td class="am-text-center am-text-middle inquiry_fp">' + (bean.editable_code || '') + '</td>' +
				'<td class="am-text-center am-text-middle inquiry_fk">' + (bean.fankui_state|| '') + '</td>' +
				'<td class="am-text-center am-text-middle">' + (bean.effective_code || '') + '</td>' +
				'<td class="am-text-center am-text-middle" >' + (bean.flow_legion || '') + '</td>' + //流量中心
				//			'<td>' + ( bean.project_Page_Name|| '') + '</td>' +
				'<td class="td1"><button  type="button"  class="am-btn am-round am-btn-xs am-btn-default am-btn-warning inquirys_business" onclick="onTriggerEventHandler(\'#get_operate_log;opid=' + bean.id + '&type=self&account='+pmAgent.userid+'\')" style="margin-bottom: 2px">业务日志</button><br>' +
				'<button type="button" class="am-btn am-round am-btn-default am-btn-xs am-btn-secondary" onclick="onTriggerEventHandler(\'#oppotunity;' + param + '\')">在线记录</button>';
			'</tr>'
			table.append(row);
			no++;
		}
		var page_total = Math.ceil(data[0].count / pagesize);
		var page_index = parseInt(data[0].pageindex);
		if(page_total > 0) {
			$('.am-pagination-current span').text(page_index + ' / ' + page_total);
		}
	}
}



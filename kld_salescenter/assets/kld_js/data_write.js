/**
 * @params 数据录入|option选项动态读取后台api填充
 * @author liuhongjian
 * @date   2017-08-14
 */

function newdata_write()
    {
//	 console.log('数据录入者：'+pmAgent.userid);
	 //start 获取被选中的[分校名称];by liuhongjian 2017-08-14
	 var campus_select = document.getElementById("campus_select");
	 var campus_selected = [];
	 for(i=0;i<campus_select.length;i++)
	 {
	     if(campus_select.options[i].selected)
	     {
	    	 campus_selected.push(campus_select[i].value);
	     }
	 }
	 //console.log(campus_select);
	//end获取被选中的[分校名称];by liuhongjian 2017-08-14
	 
	//start 获取被选中的[项目名称];by liuhongjian 2017-08-14
	 var items_select = document.getElementById("items_select");
	 var items_selected = [];
	 for(i=0;i<items_select.length;i++)
	 {
	     if(items_select.options[i].selected)
	     {
	    	 items_selected.push(items_select[i].value);
	     }
	 }
	//end获取被选中的[项目名称];by liuhongjian 2017-08-14
	 
	//start 获取被选中的[数据类型];by liuhongjian 2017-08-14
//	 var data_type_select = document.getElementById("data_type_select");
//	 var data_type_selected = [];
//	 for(i=0;i<data_type_select.length;i++)
//	 {
//	     if(data_type_select.options[i].selected)
//	     {
//	    	 data_type_selected.push(data_type_select[i].text);
//	     }
//	 }
	 
	//end获取被选中的[数据类型];by liuhongjian 2017-08-14
	 
	//start 获取录入URL的值|学员姓名|学员手机号码|学员微信|学员QQ;by liuhongjian 2017-08-14
	 var write_url=document.getElementById("write_url").value;
	 var student_name=document.getElementById("student_name").value; 
	 var student_telphone=document.getElementById("student_telphone").value;
	 var student_wechat=document.getElementById("student_wechat").value;
	 var student_qq=document.getElementById("student_qq").value;
	 var province_selected=document.getElementById("province").value;
	 var student_shi=document.getElementById("city").value;
	//end 获取录入URL的值|学员姓名|学员手机号码|学员微信|学员QQ;by liuhongjian 2017-08-14
	 
	//start 获取被选中的[数据来源];by liuhongjian 2017-08-14
	 var data_source_select = document.getElementById("data_source_select");
	 var data_source_selected = [];
	 for(i=0;i<data_source_select.length;i++)
	 {
	     if(data_source_select.options[i].selected)
	     {
	    	 data_source_selected.push(data_source_select[i].value);
	     }
	 }

	//end获取被选中的[数据来源];by liuhongjian 2017-08-14
	 
	//start 获取被选中的[分配方式];by liuhongjian 2017-08-14
	 var data_allot_select = document.getElementById("data_allot_select");
	 var data_allot_selected = [];
	 for(i=0;i<data_allot_select.length;i++)
	 {
	     if(data_allot_select.options[i].selected)
	     {
	    	 data_allot_selected.push(data_allot_select[i].value);
	     }
	 }

	//end获取被选中的[分配方式];by liuhongjian 2017-08-14
	 
	//start 获取被选中的[流量中心];by liuhongjian 2017-08-14
	 var flow_legon_select = document.getElementById("flow_legon_select");
	 var flow_legon_selected = [];
	 for(i=0;i<flow_legon_select.length;i++)
	 {
	     if(flow_legon_select.options[i].selected)
	     {
	    	 flow_legon_selected.push(flow_legon_select[i].text);
	     }
	 }
	//end获取被选中的[流量中心];by liuhongjian 2017-08-14
	//start 获取被选中的[省份];by liuhongjian 2017-08-16
	 var province_select = document.getElementById("province");
	 var province_selected = [];
	 for(i=0;i<province_select.length;i++)
	 {
	     if(province_select.options[i].selected)
	     {
	    	 province_selected.push(province_select[i].text);
	     }
	 }
	//end获取被选中的[省份];by liuhongjian 2017-08-16
	//start 获取被选中的[城市];by liuhongjian 2017-08-16
	 var city_select = document.getElementById("city");
	 var city_selected = [];
	 for(i=0;i<city_select.length;i++)
	 {
	     if(city_select.options[i].selected)
	     {
	    	 city_selected.push(city_select[i].value);
	     }
	 }
	 //end获取被选中的[城市];by liuhongjian 2017-08-16
	 //start 获取预约时间|在线聊天记录|预约内容;by liuhongjian 2017-08-14
	 var book_dts=document.getElementById("book_dts").value;
	 if (book_dts == '') book_dts = '立即';
	 var book_info=document.getElementById("book_info").value;
	 var webchat_info=document.getElementById("webchat_info").value;//.replace(/\r/gim, '\\r').replace(/\n/gim, '\\n');
	 //console.log('数据录入page-被选中的分校名称是:'+campus_selected+'|被选中的项目名称是:'+items_selected+'|录入URL是:'+write_url+'|学员姓名是:'+student_name+'|学员手机号码:'+student_telphone+'学员微信是:'+student_wechat+'|学员QQ是:'+student_qq+'|被选中的省份是:'+province_selected+'|被选中的城市是:'+city_selected+'|被选中的分配方式是:'+data_allot_selected+'|被选中的流量军团是:'+flow_legon_selected+'|预约时间是:'+book_dts+'|预约内容是:'+book_info+'|在线聊天记录是:'+webchat_info);
	 //end 获取预约时间|在线聊天记录|预约内容;by liuhongjian 2017-08-14
	 var options = {
	     "student_cellphone" : student_telphone,
	     "online_account" : pmAgent.userid,
	     "student_name" : student_name,
	     "allocation_code" : data_allot_selected,
	     "org_id" : campus_selected,
	     "course_big_id" : items_selected,
	     "city_id" : city_selected,
	      "province_id" : province_selected,
	     "source_code" : data_source_selected,
	     "appointment_time" : book_dts,
	     "appointment_remark" : book_info,
	     "project_Page_Name" : write_url, 
	     "online_record" : webchat_info,
	     "student_qq" : student_qq,
	     "student_weixin" : student_wechat
	 };
	 var oppotunity_inflow = $.param(options, true);
	 //console.log(oppotunity_inflow);
	 service.oppotunity_inflow(oppotunity_inflow)
		.then(function(data) {
			oppotunity_data = data;
			var am_alert='';
			if (data[0]['rescode']==1) {
				am_alert='success'; //'am-alert-success';
			}
			else {
				am_alert='error'; //'am-alert-danger';
			}
			/*	
			var message = '<div class="am-alert '+am_alert+'" data-am-alert>'
				+ '<button type="button" class="am-close">&times;</button>'
				+ '<p>' + data[0]['resmsg'] + '</p></div>';
			$('#validation').html(message);
			*/
			service.alert(data[0]['resmsg'], am_alert, 0);
		})
		.fail(function(data) {
			console.log('data_write submit fail '+data);
		});
	}

//数据录入页面onload自动加载options项
function add_options()
{
	//录入校options
	// service.get_org_id_school()
	options={
		"account": pmAgent.userid,
	}
	var params = $.param(options, true);
	service.get_campus_big_id(params)
	.then(function(data) {
		oppotunity_data = data;
		var len=data.length;   
	    $('#campus_select').attr("length",'0');   
	    for(i=0;i<len;i++)
	    {   
	    	if(data[i].id==1)
	    		{
	    		 $("#campus_select").append($('<option value='+data[i].id+' selected>'+data[i].name+'</option>'));
	    		}
	    	else
	    		{
	    		$("#campus_select").append($('<option value='+data[i].id+'>'+data[i].name+'</option>'));
	    		}
	    		
	      
	    }
	})
	.fail(function(data) {
		console.log(data);
	});
	//项目大类options
	service.get_course_big_id()
	.then(function(data) {
		oppotunity_data = data;
		var len=data.length;   
	    $('#items_select').attr("length",'0');   
	    for(i=0;i<len;i++)
	    {   
	    	if (data[i].id==1)
	    		{
	    		 $("#items_select").append($('<option value='+data[i].id+' selected>'+data[i].name+'</option>'));
	    		}
	    	else
	    		{
	    		$("#items_select").append($('<option value='+data[i].id+'>'+data[i].name+'</option>'));
	    		}
	      
	    }
	})
	.fail(function(data) {
		console.log(data);
	});
	//数据来源options
	service.get_source_code()
	.then(function(data) {
		oppotunity_data = data;
		var len=data.length;   
	    $('#data_source_select').attr("length",'0');   
	    for(i=0;i<len;i++)
	    {   
	    	if (data[i].id=='CS_LEYU')
	    		{
	    		 $("#data_source_select").append($('<option value='+data[i].id+' selected>'+data[i].name+'</option>'));
	    		}
	    	else
	    		{
	    		 $("#data_source_select").append($('<option value='+data[i].id+'>'+data[i].name+'</option>'));
	    		}
	      
	    }
	})
	.fail(function(data) {
		console.log(data);
	});
	//分配方式options
	service.get_allocation_code()
	.then(function(data) {
		oppotunity_data = data;
		var len=data.length;   
	    $('#data_allot_select').attr("length",'0');   
	    for(i=0;i<len;i++)
	    {   
	    	if (data[i].id=='ALLOT_SYSTEM')
	    		{
	    		$("#data_allot_select").append($('<option value='+data[i].id+' selected>'+data[i].name+'</option>'));
	    		}
	    	else
	    		{
	    		$("#data_allot_select").append($('<option value='+data[i].id+'>'+data[i].name +'</option>'));
	    		}
	      
	    }
	})
	.fail(function(data) {
		console.log(data);
	});
	//流量中心options
	service.get_flow_name()
	.then(function(data) {
		oppotunity_data = data;
		var len=data.length;   
	    $('#flow_legon_select').attr("length",'0');   
	   
	    for(i=0;i<len;i++)
	    {   
	    	if (data[i].name=='wangxinying-beijing')
	    		{
	    		 $("#flow_legon_select").append($('<option value='+data[i].name+' selected>'+data[i].name+'</option>'));
	    		}
	    	else
	    		{
	    		 $("#flow_legon_select").append($('<option value='+data[i].name+'>'+data[i].name+'</option>'));
	    		}
	     
	    }
	    
	})
	.fail(function(data) {
		console.log(data);
	});
	//省份options
	service.get_province()
	.then(function(data) {
		oppotunity_data = data;
		var len=data.length;   
	    $('#province').attr("length",'0');   
	    //省份与城市联动
	    $('#province').on('change',function (){
	    	get_city($('#province').val());
	    });
	    for(i=0;i<len;i++)
	    {   
	    	if (data[i].name=='北京市')
	    		{
	    		 $("#province").append($('<option value='+data[i].id+' selected>'+data[i].name+'</option>'));
	    		}
	    	else
	    		{
	    		 $("#province").append($('<option value='+data[i].id+'>'+data[i].name+'</option>'));
	    		} 
	    }
	})
	.fail(function(data) {
		console.log(data);
    	});
	}

//根据省份获取城市
function get_city(param)
{
    $("#city").empty();
//	var province="province="+param;
    var options = {"province": param};
    var params = $.param(options, true);
    service.get_city(params)
        .then(function(data) {
//		oppotunity_data = data;
            var len=data.length;
            $('#city').attr("length",'0');
            for(i=0;i<len;i++)
            {
                if (i==0)
                {
                    $("#city").append($('<option value='+data[i].name+' selected>'+data[i].name+'</option>'));
//	    	      $("#t_student_city_name").parent('div').prev('label').text(data[i].name);
                }
                else
                {
                    $("#city").append($('<option value='+data[i].id+'>'+data[i].name+'</option>'));
                }
            }
        })
        .fail(function(data) {
            console.log(data);
        });
}

//根据省份获取城市
function get_city_show(province,city)
{
    $("#city").empty();
    var province_id="";
    $("#province");
    for(var i=0;i<$("#province")[0].length;i++)
    {
        if($("#province")[0][i].innerText==province)
        {
            province_id=$("#province")[0][i].value;
            break;
        }
    }


    var province="province="+province_id;
    service.get_city(province)
        .then(function(data) {
            oppotunity_data = data;
            var len=data.length;
            $('#city').attr("length",'0');
            for(i=0;i<len;i++)
            {
                if (data[i].name==city)
                {
                    $("#city").append($('<option value='+data[i].id+' selected>'+data[i].name+'</option>'));
                }
                else
                {
                    $("#city").append($('<option value='+data[i].id+'>'+data[i].name+'</option>'));
                }
            }
        })
        .fail(function(data) {
            console.log(data);
        });
}

//start自动识别在线聊天记录中的手机号码、url
//m-[CR][LF]=^/$
var regExpr = {
	cellphone : /\d{11}/i,
	visit_url : /^访问URL：(.*)$/im,
	offical_url : /https?:\/\/.+$/im
};

$(document).ready(function() {
	var jqTxt_webchat = $('#webchat_info');
	jqTxt_webchat.on('change', function() {
		var strLog = jqTxt_webchat.val();
		getInformation(strLog);
	});
});

function getInformation(strLog) {
	var arry_ret;
	if (regExpr.visit_url.exec(strLog) && (regExpr.visit_url.exec(strLog).length > 1)){
		arry_ret = regExpr.visit_url.exec(strLog);
		$('#write_url').val(arry_ret[1].trim());
	//start 根据url子站点获取录入校、项目大类、流量中心、省份、城市 liuhj 2017-08-17
	var project_Page_Name="project_Page_Name="+arry_ret[1].trim();
	service.get_project_info(project_Page_Name)
	.then(function(data) {
		oppotunity_data = data;
		var len=data.length;     
	    for(i=0;i<len;i++) {   
	    	//改变录入校value选中
	    	$("#campus_select").val(data[i]['t_sys_office_campus_id']);  
	        $("#campus_select").trigger('changed.selected.amui');
	        //改变项目value选中
	        $("#items_select").val(data[i]['get_course_big_id']);
	        $("#items_select").trigger('changed.selected.amui');
	        //改变流量中心text选中
	        $("#flow_legon_select").find('option:selected').removeAttr('selected'); 
	        $("#flow_legon_select option:contains('" + data[i]['flow_legion'] + "')").attr("selected", true); 
	        $("#flow_legon_select").trigger('changed.selected.amui');
	        //改变省份text选中
	        $("#province").find('option:selected').removeAttr('selected');
	        $("#province option:contains('" + data[i]['project_prov'] + "')").attr("selected", true); 
	        $("#province").trigger('changed.selected.amui');
	        get_city_show(data[i]['project_prov'],data[i]['project_city']);
	        //改变城市text选中
//	        $("#city").find('option:selected').removeAttr('selected');
//	        $("#city option:contains('" + data[i]['project_city'] + "')").attr("selected", true); 
//	        $("#city").trigger('changed.selected.amui');
	        
	        
	    }
	   
	})
	.fail(function(data) {
		console.log(data);
	});
	}
	else {
		var index = strLog.indexOf('着陆页');
		var strTemp = strLog.substring(index);
		
		arry_ret = regExpr.offical_url.exec(strTemp);
		//console.log(arry_ret);
		if (arry_ret) {
			$('#write_url').val(arry_ret[0].trim());
			console.log(arry_ret[0].trim());
			//start 根据url子站点获取录入校、项目大类、流量中心、省份、城市 liuhj 2017-08-17
			var project_Page_Name="project_Page_Name="+arry_ret[0].trim();
			service.get_project_info(project_Page_Name)
			.then(function(data) {
				oppotunity_data = data;
				var len=data.length;     
			    for(i=0;i<len;i++) {   
			    	//改变录入校value选中
			    	$("#campus_select").val(data[i]['t_sys_office_campus_id']);  
			        $("#campus_select").trigger('changed.selected.amui');
			        //改变项目value选中
			        $("#items_select").val(data[i]['get_course_big_id']);  
			        $("#items_select").trigger('changed.selected.amui');
			        //改变流量中心text选中
			        $("#flow_legon_select").find('option:selected').removeAttr('selected'); 
			        $("#flow_legon_select option:contains('" + data[i]['flow_legion'] + "')").attr("selected", true); 
			        $("#flow_legon_select").trigger('changed.selected.amui');
			        //改变省份text选中
			        $("#province").find('option:selected').removeAttr('selected');
			        $("#province option:contains('" + data[i]['project_prov'] + "')").attr("selected", true); 
			        $("#province").trigger('changed.selected.amui');
			        get_city_show(data[i]['project_prov'],data[i]['project_city']);
			        //改变城市text选中
//			        $("#city").find('option:selected').removeAttr('selected');
//			        $("#city option:contains('" + data[i]['project_city'] + "')").attr("selected", true); 
//			        $("#city").trigger('changed.selected.amui');
			    }
			})
			.fail(function(data) {
				console.log(data);
			});
		}
	}

	//end 根据url子站点获取录入校、项目大类、流量中心、省份、城市 liuhj 2017-08-17
	//var strQueryphoneIndex=strLog.indexOf('手机号');
	var strQueryphoneIndex=strLog.search(/(手机号)|(电话)|(手机)|(号码)/);
	if (strQueryphoneIndex>0)
		{
		var strQueryphone=strLog.substring(strQueryphoneIndex);
		}
		//console.log(strQueryphone);
	arry_ret = regExpr.cellphone.exec(strQueryphone);
	if (arry_ret)
		$('#student_telphone').val(arry_ret[0]);
}
//end自动识别在线聊天记录中的手机号码、url
$(document).ready(function() {
	// 登录个人信息
	pmAgent = pmAgent.load();
	if ((!pmAgent) || (pmAgent.is_login != 'Y'))
		window.location = 'login.html';
	var current_time=getNowFormatDate();
	//console.log('当前时间'+current_time);
	//$('#book_dts').val(current_time);
	/*
	$('.wdatepicker').on('click', function() {
		WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'});
	});
	*/
	/*
	$('.wdatepicker').datetimepicker({
		language : "zh-CN",
		format : "yyyy-mm-dd hh:ii:ss",
		todayBtn : true,
		todayHighlight : true,
		autoclose : true
	});
	*/
	jeDate({
		dateCell : '.wdatepicker',
		format : 'YYYY-MM-DD hh:mm:ss',
		isTime : true
	})
});

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}
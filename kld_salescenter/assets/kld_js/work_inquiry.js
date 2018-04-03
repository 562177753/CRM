const pagesize = 10;
const datatype = 6;
var inquiry_data = [];
//var selected_row = 0;

var m_query_options = {};

$(document).ready(function () {
    // 登录个人信息
    pmAgent = pmAgent.load();
    if ((!pmAgent) || (pmAgent.is_login != 'Y')) {
        window.location = 'login.html';
        return;
    }
    // 开始查询按钮
    $('#query_btn').on('click', function () {
        onTriggerEventHandler('#query_btn');
    });

    // 重置
    $('#reset_btn').on('click', function () {
        onTriggerEventHandler('#reset_btn');
    });

    // 上一页、下一页 先做分 ，参考那边做
    $('.am-pagination-prev').on('click', function () {
        onTriggerEventHandler('.am-pagination-prev');
    });
    $('.am-pagination-next').on('click', function () {
        onTriggerEventHandler('.am-pagination-next');
    });
    $("#page_enter").click(function () {
        onTriggerEventHandler('#page_enter');
    });
    //获取日志
    $(".inquirys_business").on("click", function () {
        onTriggerEventHandler('.inquirys_business');
    })
    //点击提交
    $("#inquirey_submit_btn").click("click", function () {
        onTriggerEventHandler("#inquirey_submit_btn")
    });
    //提示勾选查询事项
    $('#query_btn').click(function () {
        if ($('#campus_select_1').val() == " ") {
            swal('查询数据', '请勾选必选项!', 'warning');
        } else if ($('#items_select1').val() == " ") {
            swal('查询数据', '请勾选必选项!', 'warning');
        } else if ($('#inquiry_Consultation').val() == " ") {
            swal('查询数据', '请勾选必选项!', 'warning');
        } else {
            return;
        }
    });

    //分配状态
    $("#items_select2").on("change", function () {
        onTriggerEventHandler("#items_select2")
    })
    $("#items_select3").selected('disable');
    $("#items_select4").selected('disable');
    $("#items_invalid").selected('disable');
    //	//反馈类型
    $("#items_select3").on("change", function () {
        onTriggerEventHandler("#items_select3")
    })
    //	//反馈类型
    $("#items_select4").on("change", function () {
        onTriggerEventHandler("#items_select4")
    })
    //	//无效类型
    //	$("#items_invalid").on("change",function(){
    //		  onTriggerEventHandler("#items_invalid")
    //	})

    //  所有的下拉列表信息
    tc()

})

//所有的下拉列表信息
function tc() {
    $('.campus_select').empty();
    //获取所有的分校信息
    options={
		"account": pmAgent.userid
	}
	var params = $.param(options, true);
    service.get_campus_big_id(params)
        .then(function (data) {
            var opt = '';
            for (var i = 0; i < data.length; i++) {
                opt += '<option value="' + data[i].id + '">' +
                    data[i].name +
                    '</option>';
                // console.log(data[i].name)
            }
            var opt1 = $('<option value=" ">选择分校</option>')
            $('.campus_select').append(opt);
            $('.campus_select').append(opt1);

        });

    $('#items_select1').empty();
    //获取所有的项目大类
    options={
        "account": pmAgent.userid
    }
    var params = $.param(options, true);
    service.get_course_big_id(params)
        .then(function (data) {
            var opt2 = '';
            for (var i = 0; i < data.length; i++) {
                opt2 += '<option value="' + data[i].id + '">' +
                    data[i].name +
                    '</option>';
            }
            //		 console.log(data)
            var opt_2 = $('<option value=" ">请选择</option>')
            $('#items_select1').append(opt2);
            $('#items_select1').append(opt_2);
        });

    $('.inquiry_Consultation').empty();
    //获取所有的咨询大类
    service.get_source_code()
        .then(function (data) {
            var opt3 = '';
            for (var i = 0; i < data.length; i++) {
                opt3 += '<option value="' + data[i].id + '">' +
                    data[i].name +
                    '</option>';
            }
            //		 console.log(data)
            var opt_3 = $('<option value=" ">请选择</option>')
            $('#inquiry_Consultation').append(opt3);
            $('#inquiry_Consultation').append(opt_3);
        });

    $('#inquiry_flow').empty();
    //获取所有的流量中心大类
    service.get_flow_name()
        .then(function (data) {
            var opt4 = '';
            for (var i = 0; i < data.length; i++) {
                opt4 += '<option value="' + data[i].name + '">' + data[i].name + '</option>';
            }
            //	 console.log(data)
            $('#inquiry_flow').append(opt4);
        });
    $('#inquiry_sdate_txt_1').attr('placeholder', getDateNow('yyyy-MM-01'));
    $('#inquiry_sdate_txt_2').attr('placeholder', getDateNow('yyyy-MM-dd'));
}


//填充dataGrid，注意分页
function fill_dataGrid(data) {
    var row = '';
    var table = $('#inquirys_tbl tbody');
    table.empty();
    if (data.length > 0) {
        var page_index = parseInt(data[0].pageindex);
        var no = (page_index - 1) * pagesize + 1; //
        for (var i = 1; i < data.length; i++) {
            var bean = data[i];
            //var param = "account=" + bean.account + "&id=" + bean.student_id + "&opid=" + bean.id;
            var param = "account=" + pmAgent.userid + "&opid=" + bean.id;
            var param2 = "account=" + pmAgent.userid + "&opid=" + bean.id;
            row = '<tr>' +
                '<td class="am-text-center am-text-middle">' + no + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.course_big_id_name || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.student_name || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.student_cellphone || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.student_weixin || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.student_qq || '') + '</td>' +
                '<td class="am-text-center am-text-middle" >' + (bean.reference_code || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.source_code || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.create_time || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.account || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.creator || '') + '</td>' +
                '<td class="am-text-center am-text-middle inquiry_fp">' + (bean.fenpei_state || '') + '</td>' +
                '<td class="am-text-center am-text-middle inquiry_fk">' + (bean.fankui_state || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.effective_code || '') + '</td>' +
                '<td class="am-text-center am-text-middle" >' + (bean.flow_legion || '') + '</td>' + //流量中心
                //			'<td>' + ( bean.project_Page_Name|| '') + '</td>' +
                '<td class="td1"><button  type="button"  class="am-btn am-round am-btn-default am-btn-warning inquirys_business am-btn-xs btn1" onclick="onTriggerEventHandler(\'#get_operate_log;opid=' + bean.id + '\')" style="margin-bottom: 2px;padding:3px 10px">业务日志</button><br>' +
                '<button type="button" class="am-btn am-round am-btn-default am-btn-secondary am-btn-xs btn2" onclick="onTriggerEventHandler(\'#oppotunity;' + param + '\')"style="margin-bottom: 2px;padding:3px 10px">在线记录</button>';
            '</tr>'
            if (bean.fenpei_state == "已分配" || bean.fankui_state == "已反馈" ||bean.fenpei_state =='未分配' || bean.fankui_state =='未反馈') {
                row += '<br><button type="button" class="am-btn am-round am-btn-default am-btn-primary fp btn3 am-btn-xs" style="padding:3px 10px" onclick="onTriggerEventHandler(\'#get_role_groups_by_account;' + param2 + '\')">手动分配</button></td>';
            }
            table.append(row);
            no++;
        }
        var page_total = Math.ceil(data[0].count / pagesize);
        var page_index = parseInt(data[0].pageindex);
        if (page_total > 0) {
            $('.am-pagination-current span').text(page_index + ' / ' + page_total);
        }else{
            $('.am-pagination-current span').text(' ... ');
        }
    }
}




function onTriggerEventHandler(selector) {
    if (selector == "#query_btn") {
        var options = {};
        options["account"] = pmAgent.userid;
        var val = $('#campus_select_1').val(); //分校值
        if (val) options['campus_select'] = val;

        val = $('#items_select1').val(); //项目大类
        if (val) options['course_big_id_name'] = val;

        var val = $('#items_type').val(); //数据类型
        if (val) options['reference_code'] = val;

        var val = $('#inquiry_Consultation').val(); //咨询类型
        if (val) options['source_code'] = val;

        var val = $('#items_select2').val(); //分配状态
        if (val) options['editable_code'] = val;

        var val = $('#items_select3').val(); //是否反馈
        if (val) options['effective_count'] = val;

        var val = $('#items_select4').val(); //反馈类型
        if (val) options['effective_code'] = val;

        var val = $('#items_invalid').val(); //无效类型
        if (val) options['invalid_code'] = val;

        var val = $('#inquiry_flow').val(); //流量中心
        if (val) options['flow_legion'] = val.join(",");
        //
        // var val = $('#inquiry_flow').val(); //流量中心
        // if (val) options['flow_legion'] = val.join(",");
        var val = $('#inquiry_sdate_txt_3').val(); //手机号查询
        if (val) options['student_cellphone'] = val;

        var val = $('#inquiry_account').val(); //咨询师查询
        if (val) options['query_account'] = val;

        var val = $('#creator').val(); //创建人
        if (val) options['creator'] = val;

        var val = $('#weixin_inquire').val(); //微信查询
        if (val) options['student_weixin'] = val;

        var val = $('#qq_inquire').val(); //QQ查询
        if (val) options['student_qq'] = val;

        var val = $('#inquiry_sdate_txt_1').val(); //开始日期
        // if (val) options['create_stime'] = val;
        if (val)
            options['create_stime'] = val;
        else
            options['create_stime'] = getDateNow('yyyy-MM-01');

        var val = $('#inquiry_sdate_txt_2').val(); //结束日期
        // if (val) options['create_etime'] = val;
        if (val)
            options['create_etime'] = val;
        else
            options['create_etime'] = getDateNow('yyyy-MM-dd');


        m_query_options = options
        options['pagesize'] = pagesize;
        options['pageindex'] = 1;
        options['datatype'] = datatype;
        //上面选中 数据 放这里，



        var params = $.param(options, true); //这个 方法已做encodeURI
        service.oppotunity(params)
            .then(function (data) {
                //if($("#items_select2").val()=="已分配"){
                inquiry_data = data;
                fill_dataGrid(inquiry_data);					
            });
    } else if (selector.indexOf('#get_operate_log') > -1) {
        var params = selector.split(";");
        var param = params[1];
        service.get_operate_log(param)
            .then(function (data) {
                //				console.log(data);
                //取到数据 数据绑定窗口里 然后显示窗口
                var options = {
                    'width': '650px'
                };

                // $(function(){
                        // var modal1=$('#appoint_modal');
                        // popup(modal1.modal(options));
                    // });

                $('#appoint_modal').modal(options);
                var row = '';
                var table2 = $('#inquirey_appointment tbody');
                table2.empty();
                var init = 0;
                for (var i = 1; i < data.length; i++) {
                    init++;
                    row = '<tr>' +
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
    } else if (selector.indexOf('#oppotunity') > -1) {
        var params = selector.split(";");
        var param = params[1] + "&datatype=" + datatype;
     //   console.log('param>>',param)
        service.oppotunity(param)
            .then(function (data) {
              //  console.log(data);
                var options = {
                    'width': '600px'
                };
                $('#appoint_modal2').modal(options);
                var row = '';
                var table3 = $('#inquirey_appointment2 tbody');
                table3.empty();

                for (var i = 1; i < data.length; i++) {
                    row = '<tr>' +
                        '<td><textarea style="width:100%;height:200px">' + (data[i].online_record || '') + '</textarea></td>' +
                        '</tr>';
                }
                table3.append(row);
            })
    } else if (selector.indexOf('#get_role_groups_by_account') > -1) {
        var params = selector.split(";");
        var param = params[1]; //account登陆的人的账号 账号参数

        service.get_user_level(param)
            .then(function (data) {
                var row = '';
                var options_level = $('#inquirey_level');
                options_level.empty();
                for (var i = 0; i < data.length; i++) {
                    row += '<option value="' + data[i].id + '"' + (i == 0 ? " selected=true " : "") + '>' +
                        data[i].name +
                        '</option>';
                    // console.log(data[i].group_name)
                }
                options_level.append(row);
                options_level.on('change', function () {
                    get_role_user_in_group(param);
                });
            });

        service.get_role_groups_by_account(param)
            .then(function (data) {
                // console.log(data)
                var row = '';
                var options_group = $('#inquirey_group');
                options_group.empty();
                for (var i = 0; i < data.length; i++) {
                    row += '<option value="' + data[i].group_id + '"' + (i == 0 ? " selected=true" : "") + '>' +
                        data[i].group_name +
                        '</option>';
                    //	 console.log(data[i].group_name+"--"+data[i].group_name)
                }
                options_group.append(row);
                options_group.on('change', function () {
                    get_role_user_in_group(param);
                });

            });


            //点击弹窗提交
        $("#inquirey_submit_btn").off("click").on('click', function () {
            var _param = param.substring(param.indexOf("&") + 1, param.length); //去掉account
            //console.log(_param)
            inquiry_post(_param);
        });

        var options = {
            'width': '600px'
        };

        $('#appoint_modal3').modal(options);
    }
    //前翻页
    else if (selector == '.am-pagination-prev') {
        if (inquiry_data.length > 0) {
            var page_total = Math.ceil(inquiry_data[0].count / pagesize);
            var page_index = parseInt(inquiry_data[0].pageindex);
            if (page_index <= 1) return;

            var options = m_query_options;
            options['account'] = pmAgent.userid;
            options['pagesize'] = pagesize;
            options['pageindex'] = page_index - 1;
            options['datatype'] = datatype; //
            var params = $.param(options, true);
            service.oppotunity(params)
                .then(function (data) {
                    inquiry_data = data;
                    fill_dataGrid(inquiry_data);
                })
                .fail(function (data) {
                    inquiry_data = [];
                });
        } else {
            var table = $('#inquirys_tbl tbody');
            table.empty();
        }

    }
    //后翻页
    else if (selector == '.am-pagination-next') {
        if (inquiry_data.length > 0) {
            var page_total = Math.ceil(inquiry_data[0].count / pagesize);
            var page_index = parseInt(inquiry_data[0].pageindex);
            if (page_index >= page_total) return;

            var options = m_query_options;
            options['account'] = pmAgent.userid;
            options['pagesize'] = pagesize;
            options['pageindex'] = page_index + 1;
            options['datatype'] = datatype;
            var params = $.param(options, true);
            service.oppotunity(params)
                .then(function (data) {
                    inquiry_data = data;
                    fill_dataGrid(inquiry_data);
                })
                .fail(function (data) {
                    inquiry_data = [];
                    selected_row = 0;
                });
        } else {
            var table = $('#inquirys_tbl tbody');
            table.empty();
        }

    }
    //当输入页码时
    else if (selector == '#page_enter') {
        var page_total = Math.ceil(inquiry_data[0].count / pagesize);
        var page_index = parseInt(inquiry_data[0].pageindex);
        var options = m_query_options;
        options['pagesize'] = pagesize;
        var page_index_new = $('.page_num').val();
        if (page_index_new > page_total) {
           // options['pageindex'] = page_total;
           // $('.am-pagination-current span').text(page_index + ' / ' + page_total);
            swal("", '请输入合理数值', "warning");
        } else {
            options['pageindex'] = page_index_new;
        }
        // options['pageindex'] = page_index_new;
        options['account'] = pmAgent.userid;
        var params = $.param(options, true);
        service.oppotunity(params)
            .then(function (data) {
                inquiry_data = data;
                fill_dataGrid(inquiry_data);
            })
            .fail(function (data) {
                inquiry_data = [];
                selected_row = 0;
            });

    }
    //反馈状态
    else if (selector == "#items_select2") {
        //    	    var opt1=$("<option>请选择</option>")
        //    	    $("#items_select2").append(opt1)
        if ($("#items_select2").val() == "已分配") {
            $("#items_select3").selected('enable')
        } else {
            $("#items_select3").selected('disable')
        }
    }
 //是否反馈
    else if (selector == "#items_select3") {
        if ($("#items_select3").val() == "已反馈") {
            $("#items_select4").empty();
            $("#items_select4").selected('enable');
            var opts1 = $("<option value='反馈有效'>反馈有效</option>");
            var opts2 = $("<option value='反馈无效'>反馈无效</option>");
            var opts3 = $("<option value='反馈未接通'>反馈未接通</option>");
            var opts4 = $("<option value='线上预约'>线上预约</option>");
            var opts5 = $("<option value=''>请选择</option>")
            $("#items_select4").append(opts5)
            $("#items_select4").append(opts1)
            $("#items_select4").append(opts2)
            $("#items_select4").append(opts3)
            $("#items_select4").append(opts4)
        } else if ($("#items_select3").val() == "未反馈") {
            $("#items_select4").empty();
            $("#items_select4").selected('enable');
           /* var opts1 = $("<option value='反馈未接通'>反馈未接通</option>")
            var opts2 = $("<option value='线上预约'>线上预约</option>")*/
            var opts3 = $("<option value='未操作'>未操作</option>")
            var opts4 = $("<option value=''>请选择</option>")
            $("#items_select4").append(opts4)
            $("#items_select4").append(opts1)
            $("#items_select4").append(opts2)
            $("#items_select4").append(opts3)
        } else {
            $("#items_select4").empty();
            var opts1 = $("<option value=''>请选择</option>")
            $("#items_select4").append(opts1)
            $("#items_select4").selected('disable')
        }
    }
    //反馈类型
    else if (selector == "#items_select4") {
        if ($("#items_select4").val() == "反馈无效") {
            $("#items_invalid").empty();
            $("#items_invalid").selected('enable');
            var opts9 = $("<option >请选择</option>");
            var opts1 = $("<option value='无此人,打错了'>无此人,打错了</option>")
            var opts2 = $("<option value='当日三遍未通(暂时无法接通,无人接听,停机,关机)'>当日三遍未通(暂时无法接通,无人接听,停机,关机)</option>")
            var opts3 = $("<option value='撞单分重；学员呼入；留言回拨'>撞单分重；学员呼入；留言回拨</option>")
            var opts4 = $("<option value='客服，已报名学员'>客服，已报名学员</option>")
            var opts5 = $("<option value='空号'>空号</option>")
            var opts6 = $("<option value='咨询其他项目'>咨询其他项目</option>")
            var opts7 = $("<option value='各种限制条件,不能来北京考试'>各种限制条件,不能来北京考试</option>")
            var opts8 = $("<option value='不符合考编条件'>不符合考编条件</option>")
            $("#items_invalid").append(opts9)
            $("#items_invalid").append(opts1)
            $("#items_invalid").append(opts2)
            $("#items_invalid").append(opts3)
            $("#items_invalid").append(opts4)
            $("#items_invalid").append(opts5)
            $("#items_invalid").append(opts6)
            $("#items_invalid").append(opts7)
            $("#items_invalid").append(opts8)
            $("#items_invalid").append(opts9)
        } else {
            $("#items_invalid").empty();
            var opts1 = $("<option value=''>请选择</option>")
            $("#items_invalid").append(opts1)
            $("#items_invalid").selected('disable')
        }
    }
    //重置按钮
    else if (selector == "#reset_btn") {
        if (!$.AMUI.support.mutationobserver) {
            $selected.trigger('changed.selected.amui');
        }
        //反馈状态
        $("#items_select2 option").remove()
        var opt1 = $('<option value=" ">请选择</option>')
        var opt2 = $('<option value="已分配">已分配</option>')
        var opt3 = $('<option value="未分配">未分配</option>')
        $("#items_select2").append(opt1)
        $("#items_select2").append(opt2)
        $("#items_select2").append(opt3)
        // 首次
        $('#items_type').empty()
        var opt4 = $('<option value=" ">请选择</option>')
        var opt5 = $('<option value="CR_FIRST">首次</option>')
        var opt6 = $('<option value="CR_SECOND">二次</option>')
        $("#items_type").append(opt4)
        $("#items_type").append(opt5)
        $("#items_type").append(opt6)
        //是否反馈
        $('#items_select3').empty()
        var opt7 = $('<option value=" ">请选择</option>')
        var opt8 = $('<option value="已反馈">已反馈</option>')
        var opt9 = $('<option value="未反馈">未反馈</option>')
        $("#items_select3").append(opt7)
        $("#items_select3").append(opt8)
        $("#items_select3").append(opt9)
        //重新获取所有的下拉列表的信息
        tc()
    }
}


//提交按钮操作
function get_role_user_in_group(param) {
    var options_account = $('#inquirey_account');
    var levelValue = $('#inquirey_level').val();
    var groupValue = $('#inquirey_group').val();
    if (levelValue != '请选择' && groupValue != '请选择') {
        options_account.empty();
        var options = {
            "group_id": groupValue,
            "level": levelValue
        };
        param = param + "&" + $.param(options, true);
        service.get_role_user_in_group(param) //
            .then(function (data) {
                var row = '';
                var options_account = $('#inquirey_account');
                options_account.empty();
                for (var i = 0; i < data.length; i++) {
                    row += '<option value="' + data[i].user_id + '"' + (i == 0 ? " selected=true " : "") + '>' +
                        data[i].name +
                        '</option>';
                }
                options_account.append(row);
                //			console.log(data);
            });
    }
}

function inquiry_post(param) {
    var accountValue = $('#inquirey_account').val(); //获得手动配置导师
    if (accountValue && accountValue != '请选择') {

        var _param = "account=" + accountValue + "&" + param + "&user=" + pmAgent.userid;
        service.oppotunity_admin_allot(_param) //
            .then(function (data) {
                //					console.log(data);
                //刷新表格
                var page_total = Math.ceil(inquiry_data[0].count / pagesize);
                var page_index = parseInt(inquiry_data[0].pageindex);
                var options = m_query_options;
                options['pagesize'] = pagesize;
                options['pageindex'] = page_index;
                options['datatype'] = datatype;
                param = $.param(options, true);
                service.oppotunity(param)
                    .then(function (data) {
                        inquiry_data = data;
                        fill_dataGrid(inquiry_data);
                    })
                    .fail(function (data) {
                        inquiry_data = [];
                    });
                $('#appoint_modal3').modal("close"); //关闭 窗口
            }, function (msg) {
                alert(msg);
            });
    } else {
        alert('未选着用户信息！');
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
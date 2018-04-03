var pagesize = 10;

var oppotunity_data = [];
var selected_row = 0;

var m_query_options = {};

var nType;

var visit;
var other;
var lastcalled;

$(document).ready(function () {
    // 登录个人信息
    pmAgent = pmAgent.load();
    if ((!pmAgent) || (pmAgent.is_login != 'Y')) {
        window.location = 'login.html';
        return;
    }

        //验证登录
    if (pmAgent.is_login_cti == 'Y') {
        sock_cti = io.connect(pmAgent.cti_api, {
            'reconnection': false
        });
        sock_cti.on('disconnect', function (reason) {
            // console.log(reason);
            // alert("连接CTI服务器失败，请检查您当前的网络！");
            $('.user-box').find('.user-status').each(function (i, el) {
                $(this).toggleClass('am-hide');
            });
        });

        sock_cti.on('pop', function (data, callid) {
            //console.log(data);
            //console.log(callid);
            if (data.calltype == '外线呼出') {
                service.set_session('callid', callid);
            }
        });

        var promise = softcall.ATGetExtstatus(pmAgent.exten);
        promise.then(function (data) {
            sock_cti.emit('login', {
                "name": pmAgent.userid,
                "device": pmAgent.account,
                "exten": pmAgent.exten,
                "uidstatus": "Online",
                "extenstatus": data['msg']
            });
            $('.user-box').find('.user-status').each(function (i, el) {
                $(this).toggleClass('am-hide');
            });

            return;
        })
            .fail(function (data) {
                console.log(data);
            });
    }


    // 填充个人信息区域
    function fillProfile(agent_info) {
        // var user_job = agent_info.org_name + '|' + agent_info.corp_name + '|' +
        //     agent_info.department_name + '|' + agent_info.group_name + '|' +
        //     agent_info.role_name;

        if (agent_info.role_name == '超级管理员') {
            var user_job = agent_info.org_name + '|' + agent_info.corp_name + '|' +
                agent_info.role_name;
            $('#user_job').text(user_job);
        } else if (agent_info.role_name == '军团长') {
            user_job = agent_info.org_name + '|' + agent_info.corp_name + '|' +
                agent_info.role_name;
            $('#user_job').text(user_job);
        } else if (agent_info.role_name == '主管') {
            user_job = agent_info.org_name + '|' + agent_info.corp_name + '|' + agent_info.department_name + '|' + agent_info.group_name + '|' + agent_info.role_name;
            $('#user_job').text(user_job);
        } else {
            user_job = agent_info.org_name + '|' + agent_info.corp_name + '|' +
                agent_info.department_name + '|' + agent_info.group_name + '|' +
                agent_info.role_name;
            $('#user_job').text(user_job);
        }
        $('#user_name').text(agent_info.name);
        // $('#user_job').text(user_job);
    };
    fillProfile(pmAgent);



    //	$("#last_contact_dts").jeDate({
    //      multiPane:true,
    //      onClose:true,
    //      minDate:'2015-06-16 10:20:25',
    //      maxDate:'2025-06-16 18:30:35',
    //      format: 'YYYY-MM-DD hh:mm:ss'
    //   });

    $('.wdatepicker').each(function (i, el) {
        jeDate({
            dateCell: '#' + $(this).attr('id'),
            format: 'YYYY-MM-DD hh:mm:ss',
            isTime: true,
            multiPane: true,
            zIndex: 5000
        });
    });
    var ntype = location.search.match(/\d+/); //这获得url地址数字类型数据 /\d+/ 正则表达式
    if (ntype == 1) { //进入预约页面
        if (!$.AMUI.support.mutationobserver) {
            $selected.trigger('changed.selected.amui');
        }
        $("#reservation_cancel_btn").show() //显示预约按钮
        $('#save_case_btn').hide(); //隐藏我保存按钮
        //	 	$("#fieldset").('disable');
        document.getElementById("fieldset").disabled = true;

    } else {
        $("#save_case_btn").show();
        $('#reservation_cancel_btn').hide();
    }


    // 开始查询按钮
    $('#query_btn').on('click', function () {
        onTriggerEventHandler('#query_btn');
        $('#pullDown').addClass('am-active');
        $('#contentPull').removeClass('am-in')
    });
    $('#phone_ser').on('click', function () {
        onTriggerEventHandler('#phone_ser');

    });
    // 上一页、下一页, 数字跳转

    $('.am-pagination-prev').on('click', function () {
        onTriggerEventHandler('.am-pagination-prev');
    });
    $('.am-pagination-next').on('click', function () {
        onTriggerEventHandler('.am-pagination-next');
    });
    $('#page_enter').on('click', function () {
        onTriggerEventHandler('#page_enter');
    });

    // 呼叫按钮
    $('#student_cellphone_btn').on('click', function () {
        onTriggerEventHandler('#student_cellphone_btn');
    });
    $('#student_phone_btn').on('click', function () {
        onTriggerEventHandler('#student_phone_btn');
    });
    // 录入校 -> 分校报名点
    $('#case_campus_big_select').on('change', function () {
        onTriggerEventHandler('#case_campus_big_select');
    });
    $('#appoint_campus_big_select').on('change', function () {
        onTriggerEventHandler('#appoint_campus_big_select');
    });
    // 推荐项目 -> 推荐院校 二级关联下拉选项
    $('#case_course_type_select').on('change', function () {
        onTriggerEventHandler('#case_course_type_select');
    });
    $('#appoint_course_type_select').on('change', function () {
        onTriggerEventHandler('#appoint_course_type_select');
    });
    // 推荐院校 -> 推荐班型 二级关联下拉选项
    $('#case_course_major_select').on('change', function () {
        onTriggerEventHandler('#case_course_major_select');
    });
    $('#appoint_course_major_select').on('change', function () {
        onTriggerEventHandler('#appoint_course_major_select');
    });
    // 推荐班型 -> 班型价格
    $('#case_course_class_select').on('change', function () {
        onTriggerEventHandler('#case_course_class_select');
    });
    $('#appoint_course_class_select').on('change', function () {
        onTriggerEventHandler('#appoint_course_class_select');
    });
    // 分校报名点、班型价格：预约单联动
    $('#case_campus_select').on('change', function () {
        onTriggerEventHandler('#case_campus_select');
    });
    $('#case_price_txt').on('change', function () {
        onTriggerEventHandler('#case_price_txt');
    });
    // 保存工单按钮
    $('#save_case_btn').on('click', function () {
        onTriggerEventHandler('#save_case_btn');
    });
    // 预约报名
    $('#appoint_submit_btn').on('click', function () {
        onTriggerEventHandler('#appoint_submit_btn');
    });
    // 提交反馈结果
    $('#feedback_submit_btn').on('click', function () {
        onTriggerEventHandler('#feedback_submit_btn');
    });
    // 放弃到公海
    $('#abandon_btn').on('click', function () {
        onTriggerEventHandler('#abandon_btn');
    });
    // 反馈结果 二级关联
    $('#feedback_effective_select').on('change', function () {
        onTriggerEventHandler('#feedback_effective_select');
    });
    $('#feedback_effective_select').trigger('change');
    // 工单选项卡
    $('#ref_case_tab').on('click', function () {
        onTriggerEventHandler('#ref_case_tab');
    });
    //业务日志选项卡
    $('#ref_case_tab_2').on('click', function () {
        onTriggerEventHandler('#ref_case_tab_2');
    });
    //在线记录
    $("#ref_case_tab_0").on('click', function () {
        onTriggerEventHandler('#ref_case_tab_0');
    });
    //反馈记录
    $("#ref_case_tab_3").on('click', function () {
        onTriggerEventHandler('#ref_case_tab_3');
    });
    // 关闭录音播放
    $('#play_close_btn').on('click', function () {
        onTriggerEventHandler('#play_close_btn');
    });
    //	首页排行榜->组内
    $("#default_zn").on("click", function () {
        onTriggerEventHandler('#default_zn');
    });
    //点击本周-1
    $("#default_bz1").on("click", function () {
        onTriggerEventHandler('#default_bz1')
    })
    //点击本月-1
    $("#default_by1").on("click", function () {
        onTriggerEventHandler('#default_by1')
    })
    //军团
    $("#default_jt").on("click", function () {
        onTriggerEventHandler('#default_jt')
    })
    //点击个人
    $("#default_gr").on("click", function () {
        onTriggerEventHandler('#default_gr')
    })
    //点击本周-2
    $("#default_bz2").on("click", function () {
        onTriggerEventHandler('#default_bz2')
    })
    //点击本月-2
    $("#default_by2").on("click", function () {
        onTriggerEventHandler('#default_by2')
    }),
        //点击本周-3
        $("#default_bz6").on("click", function () {
            onTriggerEventHandler('#default_bz6')
        })
    //点击本月-3
    $("#default_by3").on("click", function () {
        onTriggerEventHandler('#default_by3')
    })
    //feedback_btn反馈
    $("#feedback_btn").on("click", function () {
        onTriggerEventHandler('#feedback_btn')
    })

    // 填充数据
    nType = window.location.search.match(/\d+/);
    var title = '';
    var list = '';

    if (nType == 0) {
        $('.feed-back').show();
        $('.call-back1').show();
        $('.call-back').show();
        $('.call-back1').hide();
        $('.last-deal').hide();
        $('.next-visit').hide();
        $('.appoint-visit').hide();
        // $('#call-back').show();
        $('#last-deal').hide();
        $('.next-visit1').hide();
        $('.prev').hide();
        $('.times').show();
    } else if (nType == 1) {
        $('.feed-back').hide();
        $('.call-back').hide();
        $('.call-back1').hide();
        $('.last-deal').show();
        $('.next-visit').hide();
        $('.appoint-visit').show();
        // $('#call-back').show();
        $('#last-deal').hide();
        $('.next-visit1').hide();
        $('.times').hide();
        $('.prev').show();
    } else if (nType == 5) {
        $('.call-back').show();
        $('.appoint-visit').hide();
        $('.next-visit').hide();
        $('.next-visit1').hide();
        $('.feed-back').hide();
        $('.times').hide();
        $('.prev').show();
    } else if (nType == 2 || nType == 3 || nType == 4) {
        $('.call-back').hide();
        $('.call-back1').hide();
        $('.appoint-visit').hide();
        $('.next-visit').show();
        $('.next-visit1').show();
        $('.feed-back').hide();
        $('.times').hide();
        $('.prev').show();

        // $('.feed-back').hide();
        // $('.last-deal').hide();
    }


    if (nType == 0) {
        // title = '首咨';
        // list = '首资列表';
        $('.title').html('首资列表');
        //判断当日回访/其他 不显示
        $('#feedback_btn').removeClass('am-hide');
        $('#abandon_btn').addClass('am-hide');

    } else if (nType == 1) {
        $('.title').html('预约列表')
        // $('#abandon_btn').addClass('am-hide');
        //		 $("#save_case_btn").val("取消按钮")
        //		var a= $("#save_case_btn").attr("id","reservation_cancel_btn")
    } else if (nType == 2) {
        $('.title').html('当周回访列表')
        // $('#abandon_btn').addClass('am-hide');
    } else if (nType == 3) {

        $('.title').html('跨期回访列表')
    } else if (nType == 4) {
        $('.title').html('即将过期列表')
    } else if (nType == 5) {
        $('.title').html('领取列表')
    }

    visit = "<a href='javascript:;' id='visit_show_today' style='margin-left: 15px;color: #fff'class='selected'>当日到访</a>";
    visit1 = "<a href='javascript:;' id='visit_show_today1' class='selected' style='margin-left: 15px;color: #fff' class='selected'>当日回访</a>";

    other = "<a href='javascript:;' id='visit_show_other' style='margin-left: 15px;color: #fff' >其它</a>";

    // $('#page_title').html(other);
    // $('#page_list').text(list);

    var ntype = location.search.match(/\d+/);
    if (ntype == 1) { //进入预约
        $('#page_title').append(visit).show();
        $('#page_title').append(other).show();
        $('#abandon_btn').hide();
        $('#visit_show_today').on('click', function () {
            $(this).addClass("selected").siblings().removeClass("selected");
            onTriggerEventHandler('#visit_show_today');
        });
        $('#visit_show_other').on('click', function () {
            $(this).addClass("selected").siblings().removeClass("selected");
            onTriggerEventHandler('#visit_show_other');
        });

    }

    var ntype = location.search.match(/\d+/);
    if (ntype == 2) { //进入当周回访页面
        $('#page_title').append(visit1).show();
        $('#page_title').append(other).show();
        $('#visit_show_today1').on('click', function () {
            $(this).addClass("selected").siblings().removeClass("selected");
            onTriggerEventHandler('#visit_show_today');
        });
        $('#visit_show_other').on('click', function () {
            $(this).addClass("selected").siblings().removeClass("selected");
            onTriggerEventHandler('#visit_show_other');
        });
    }
    var ntype = location.search.match(/\d+/);
    if (ntype == 3) {
        $('#page_title').append(visit1).show();
        $('#page_title').append(other).show();
        $('#visit_show_today1').on('click', function () {
            $(this).addClass("selected").siblings().removeClass("selected");
            onTriggerEventHandler('#visit_show_today');
        });
        $('#visit_show_other').on('click', function () {
            $(this).addClass("selected").siblings().removeClass("selected");
            onTriggerEventHandler('#visit_show_other');
        });
    }

    if (ntype == 4) {
        $('#page_title').append(visit1).show();
        $('#page_title').append(other).show();
        $('#visit_show_today1').on('click', function () {
            $(this).addClass("selected").siblings().removeClass("selected");
            onTriggerEventHandler('#visit_show_today');
        });
        $('#visit_show_other').on('click', function () {
            $(this).addClass("selected").siblings().removeClass("selected");
            onTriggerEventHandler('#visit_show_other');
        });
    }

    var options = {
        "account": pmAgent.userid,
        "pagesize": pagesize,
        "pageindex": "1",
        "datatype": window.location.search.match(/\d+/)

    };
    if (ntype == 0) { //判断如果不是首咨 排序为正
        m_query_options = {
            // "key": "next_visit_time",
            // "key":"appointment_time",
            "key": "distribution_time",
            "order": "DESC"
        };
        options = {
            "account": pmAgent.userid,
            "pagesize": pagesize,
            "pageindex": "1",
            "datatype": window.location.search.match(/\d+/),
            //"key": "next_visit_time",
            //"key":"reservation_time",
            "key": "distribution_time",
            "order": "DESC",


        }
    } else if (ntype == 1) {
        m_query_options = {
            //"key": "next_visit_time",
            "key": "reservation_time",//根据预约时间排序
            "order": "ASC"
        };
        options = {
            "account": pmAgent.userid,
            "pagesize": pagesize,
            "pageindex": "1",
            "datatype": window.location.search.match(/\d+/),
            "key": "reservation_time",
            "order": "ASC",
            // "reservation_time": "today"
            "next_visit_time": "today" //默认显示当日到访
        };
    } else if (ntype == 2) {
        m_query_options = {
            "key": "next_visit_time",
            "order": "ASC"
        };
        options = {
            "account": pmAgent.userid,
            "pagesize": pagesize,
            "pageindex": "1",
            "datatype": window.location.search.match(/\d+/),
            "key": "next_visit_time",
            // "key":"reservation_time",
            "order": "ASC",
            "next_visit_time": "today"  //显示当天
        };
    }else if (ntype == 3 ) {
        m_query_options = {
            "key": "next_visit_time",
            "order": "ASC"
        };
        options = {
            "account": pmAgent.userid,
            "pagesize": pagesize,
            "pageindex": "1",
            "datatype": window.location.search.match(/\d+/),
            "key": "next_visit_time",
            // "key":"reservation_time",
            "order": "ASC",
            "next_visit_time": "today"  //显示当天
        };
    } else if (ntype == 4) {
        m_query_options = {
            "key": "next_visit_time",
            "order": "ASC"
        };
        options = {
            "account": pmAgent.userid,
            "pagesize": pagesize,
            "pageindex": "1",
            "datatype": window.location.search.match(/\d+/),
            "key": "next_visit_time",
            // "key":"reservation_time",
            "order": "ASC",
            "next_visit_time": "today"  //显示当天
        };
    }
    else if (ntype == 5) {
        m_query_options = {
            "key": "next_visit_time",
            "order": "DESC"
        };
        options = {
            "account": pmAgent.userid,
            "pagesize": pagesize,
            "pageindex": "1",
            "datatype": window.location.search.match(/\d+/),
            "key": "next_visit_time",
            "order": "DESC",
            // "next_visit_time": "today"
        }
    }


    var params = $.param(options, true);
    service.oppotunity(params).then(function (data) {
        //console.log(data)
        oppotunity_data = data;
        selected_row = 0;
        fill_data(selected_row);
        fill_dataGrid(oppotunity_data);
    });

    var params = $.param(options, true);
    service.get_campus_big_id(params)
        .then(function (data) {
            var opts = '<option value="" selected="selected"></option>';
            for (var i = 0; i < data.length; i++) {
                opts += '<option value="' + data[i].id + '">' +
                    data[i].name +
                    '</option>';
            }

            $('.campus-big-select').html(opts);
        });
    var params = $.param(options, true);
    service.get_course_big_id(params)
        .then(function (data) {
            var opts = '<option value="" selected="selected"></option>';
            for (var i = 0; i < data.length; i++) {
                opts += '<option value="' + data[i].id + '">' +
                    data[i].name +
                    '</option>';
            }

            $('.course-type-select').html(opts);
        });
    onTriggerEventHandler('#default_zn');

    //首页显示当日通时和当日通话个数
    service.tonghua(pmAgent.userid)
        .then(function (data) {
            //		console.log(data);ritonghua

            var opt = '';
            var ritonghua = '';
            for (var i = 0; i < data.length; i++) {
                opt += '<span style="font-size:50px;">' +
                    data[i].rishichang +
                    's</span>';
                ritonghua += '<span style="font-size:50px">' +
                    data[i].ritonghua +
                    '个</span>';
                //console.log(data[i].name)
            }
            $('#rishichang').html(opt);
            $('#ritonghua').html(ritonghua);

        });

    //首页展示当日所分首咨条数
    service.shouzi_cnt(pmAgent.userid)
        .then(function (data) {
            //console.log(data);
            var opt = '';
            var ritonghua = '';
            for (var i = 0; i < data.length; i++) {
                opt += '<span style="font-size:50px">' +
                    data[i].shouzishu +
                    '条</span>';
            }
            $('#shouzishu').html(opt);

        });

    //首页回访比
    var options_2 = {
        "username": pmAgent.userid,
    };
    var params = $.param(options_2, true);
    service.huifangbi(params)
        .then(function (data) {
            //						console.log(data[0].huifangbi);
            var ospan = data[0].huifangbi;
            $("#hfb").html(ospan)
        });

    //状态
    if (ntype == 0) {
        $(".oppotunity_th_1").show();
        setInterval(function () {
            $(".oppotunity_td_1").show();
        }, 0000)

    } else {
        $(".del").remove();
        var $phone2 = '<div class="am-u-sm-11 phone1" style="float: left">' +
            '<div class="am-form-group">' +
            ' <label class="am-u-sm-3 am-form-label am-text-center ">手机</label>' +
            '<div class="am-u-sm-9 am-margin-top-xs">' +
            '<input id="" type="text" class="phone_txt tpl-form-input"placeholder="手机"/>' +
            ' </div>' +
            '</div>' +
            '</div>';
        //var phone2=$('.phone1').clone(true);
        $("#province").after($phone2);

        $(".phoneDel").remove();

    }

    // $("#phone_ser").click(function () {
    //     alert('aa');
    //     // student_cellphone
    //     var params = $("#phone_btn").val();
    //     service.oppotunity(params)
    //         .then(function (data) {
    //             oppotunity_data = data;
    //             selected_row = 0;
    //
    //             fill_dataGrid(oppotunity_data);
    //             fill_data(selected_row);
    //         })
    //         .fail(function (data) {
    //             oppotunity_data = [];
    //             selected_row = 0;
    //         });
    //
    // });



});
// upUrl: 'http://10.75.1.235:8080/kld_salescenter/file_upload?callback', //提交地址
//开始 上传图片/预览
imgUpload({
    inputId: 'file', //input框id
    imgBox: 'imgBox', //图片容器id
    buttonId: 'btn', //提交按钮id
    upUrl: 'http://10.75.1.235:8080/kld_salescenter/file_upload?callback', //提交地址
    data: 'file1', //参数名
    num: "5" //上传个数
})

var imgSrc = []; //图片路径
var imgFile = []; //文件流
var imgName = []; //图片名字
//选择图片
function imgUpload(obj) {
    var oInput = '#' + obj.inputId;
    var imgBox = '#' + obj.imgBox;
    var btn = '#' + obj.buttonId;
    $(oInput).on("change", function () {
        var fileImg = $(oInput)[0];
        var fileList = fileImg.files;
        for (var i = 0; i < fileList.length; i++) {
            var imgSrcI = getObjectURL(fileList[i]);
            imgName.push(fileList[i].name);
            imgSrc.push(imgSrcI);
            imgFile.push(fileList[i]);
        }
        addNewContent(imgBox);
    });
    $(btn).on('click', function () {
        if (!limitNum(obj.num)) {
            alert("只能上传5张");
            return false;
        }
        //用formDate对象上传
        var fd = new FormData($('#upBox')[0]);
        for (var i = 0; i < imgFile.length; i++) {
            fd.append(obj.data + "[]", imgFile[i]);
        }
        submitPicture(obj.upUrl, fd);
    })
}

//图片展示
function addNewContent(obj) {
    $(imgBox).html("");
    for (var a = 0; a < imgSrc.length; a++) {
        var oldBox = $(obj).html();
        $(obj).html(oldBox + '<div class="imgContainer"><img title=' + imgName[a] + ' alt=' + imgName[a] + ' src=' + imgSrc[a] + ' onclick="imgDisplay(this)"><p onclick="removeImg(this,' + a + ')" class="imgDelete">删除</p></div>');
    }
}

//删除
function removeImg(obj, index) {
    imgSrc.splice(index, 1);
    imgFile.splice(index, 1);
    imgName.splice(index, 1);
    var boxId = "#" + $(obj).parent('.imgContainer').parent().attr("id");
    addNewContent(boxId);
}

//限制图片个数
function limitNum(num) {
    if (!num) {
        return true;
    } else if (imgFile.length > num) {
        return false;
    } else {
        return true;
    }
}

//上传(将文件流数组传到后台)
function submitPicture(url, data) {
    for (var p in data) {
        // console.log(p);
    }
    if (url && data) {
        $.ajax({
            type: "post",
            url: url,
            async: true,
            data: data,
            processData: false,
            contentType: false,
            success: function (dat) {
                // console.log(dat);
                swal("提示!", '上传成功', "success");
                //清空上传完的图片
                removeImg(0,imgFile.length);
            }
        });
    } else {
        alert('请打开控制台查看传递参数！');

    }
}

//图片灯箱
function imgDisplay(obj) {
    var src = $(obj).attr("src");
    var imgHtml = '<div style="width: 100%;height: 100vh;overflow: auto;background: rgba(0,0,0,0.5);text-align: center;position: fixed;top: 0;left: 0;z-index: 2000;"><img src=' + src + ' style="margin-top: 100px;width: 70%;margin-bottom: 100px;"/><p style="font-size: 50px;position: fixed;top: 30px;right: 30px;color: white;cursor: pointer;" onclick="closePicture(this)">×</p></div>'
    $('body').append(imgHtml);
}


//关闭
function closePicture(obj) {
    $(obj).parent("div").remove();

}

//图片预览路径(jQuery);
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}


//end 上传图片/预览 结束




//根据省份获取城市
function get_city(prov_id) {
    $("#luru_city").empty();


    var options = {
        "province": prov_id
    };
    var params = $.param(options, true);
    service.get_city(params)
        .then(function (data) {
            //		console.log(data)
            var len = data.length;
            $('#luru_city').attr("length", '0');


            for (i = 0; i < len; i++) {
                if (i == 0) {
                    $("#luru_city").append($('<option value=' + data[i].name + ' selected>' + data[i].name + '</option>'));
                    $("#luru_city").parent('div').prev('label').text(data[i].name);
                } else {
                    $("#luru_city").append($('<option value=' + data[i].name + '>' + data[i].name + '</option>'));
                }
            }
        })
}

//手机号搜索



// 填充dataGrid，注意分页
function fill_dataGrid(data) {
    var row = '';
    var table = $('#oppotunity_tbl tbody');
    table.empty();
    for (var i = 1; i < data.length; i++) {
        var isred = false;
        // 程序计时的月从0开始取值后+1account
        if (data[i].appointment_time) {
            var nowtime = new Date();
            var itemtime = new Date(data[i].appointment_time) || new Date(data[i].next_visit_time) || new Date(data[i].reservation_time);
            var difference = itemtime.getTime() - nowtime.getTime();
            if (difference > 0) {
                var hour = difference / (1000 * 60 * 60);
                if (hour <= 1) {
                    isred = true;
                }
            }
        }

        /*row = '<tr onclick="fill_data(' + i + ');">' +
         '<td style="display:none" class="oppotunity_td_1">' + (data[i].effective_code || '') + '</td>' +
         '<td style="text-align: center">' + data[i].account + '</td>' +
         '<td style="text-align: center">' + data[i].student_cellphone + '</td>' +
         '<td style="text-align: center">' + (data[i].t_student_prov_name || '') + '</td>'
         //			+ '<td></td>'
         +
         '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
         '<td style="'+(isred?"color:red":"")+';text-align: center">' + (data[i].appointment_time || '') + '</td>' +
         '</tr>';*/


        ///////////////////////////////////////////////////////////////////////
        var nType_fill_type = window.location.search.match(/\d+/);
        // for (var i = 1; i < data.length; i++) {
        if (nType_fill_type == 0) {
            if(data[i].student_cellphone!=null && data[i].student_cellphone!= ''){

                if(data[i].effective_code=='未处理'){
                    row = '<tr onclick="fill_data(' + i + ');">'+
                        '<td style="text-align: center;;border: none;padding-left: 10px">'+ '<span style="color: #fffd33;font-size: 14px; margin:0px 5px 0px -7px">new</span>'+ (data[i].effective_code || '') + '</td>' +
                        '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].student_cellphone || '') + '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].distribution_time || '') + '</td>'
                        +
                        // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                        // '<td style="' + (isred ? "color:red" : "") + ';text-align: center">' + (data[i].appointment_time || '') + '</td>' +
                        '</tr>';
                }else {
                    row = '<tr onclick="fill_data(' + i + ');">'+
                        '<td style="text-align: center;;border: none;">' + (data[i].effective_code || '') + '</td>' +
                        '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].student_cellphone || '') + '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].distribution_time || '') + '</td>'
                        +
                        // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                        // '<td style="' + (isred ? "color:red" : "") + ';text-align: center">' + (data[i].appointment_time || '') + '</td>' +
                        '</tr>';
                }
            }
            //判断手机号是否为空
            else if(data[i].student_phone!= null  && data[i].student_phone!=''){
                if(data[i].effective_code=='未处理'){
                    row = '<tr onclick="fill_data(' + i + ');">'+
                        '<td style="text-align: center;;border: none;padding-left: 10px">'+ '<span style="color: #fffd33;font-size: 14px; margin:0px 5px 0px -7px">new</span>'+ (data[i].effective_code || '') + '</td>' +
                        '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].student_phone || '') + '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].distribution_time || '') + '</td>'
                        +
                        // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                        // '<td style="' + (isred ? "color:red" : "") + ';text-align: center">' + (data[i].appointment_time || '') + '</td>' +
                        '</tr>';
                }else {
                    row = '<tr onclick="fill_data(' + i + ');">'+
                        '<td style="text-align: center;;border: none;">' + (data[i].effective_code || '') + '</td>' +
                        '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].student_phone || '') + '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].distribution_time || '') + '</td>'
                        +
                        // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                        // '<td style="' + (isred ? "color:red" : "") + ';text-align: center">' + (data[i].appointment_time || '') + '</td>' +
                        '</tr>';
                }
                //判断手机和电话是否为空
            } else if(data[i].student_weixin!= null  && data[i].student_weixin!=''){
                if(data[i].effective_code=='未处理'){
                    row = '<tr onclick="fill_data(' + i + ');">'+
                        '<td style="text-align: center;;border: none;padding-left: 10px">'+ '<span style="color: #fffd33;font-size: 14px; margin:0px 5px 0px -7px">new</span>'+ (data[i].effective_code || '') + '</td>' +
                        '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].student_weixin || '')+ '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].distribution_time || '') + '</td>'
                        +
                        // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                        // '<td style="' + (isred ? "color:red" : "") + ';text-align: center">' + (data[i].appointment_time || '') + '</td>' +
                        '</tr>';
                }else {
                    row = '<tr onclick="fill_data(' + i + ');">'+
                        '<td style="text-align: center;;border: none;">' + (data[i].effective_code || '') + '</td>' +
                        '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].student_weixin || '') + '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].distribution_time || '') + '</td>'
                        +
                        // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                        // '<td style="' + (isred ? "color:red" : "") + ';text-align: center">' + (data[i].appointment_time || '') + '</td>' +
                        '</tr>';
                }
            } else if(data[i].student_qq!= null  && data[i].student_qq!=''){
                if(data[i].effective_code=='未处理'){
                    row = '<tr onclick="fill_data(' + i + ');">'+
                        '<td style="text-align: center;;border: none;padding-left: 10px">'+ '<span style="color: #fffd33;font-size: 14px; margin:0px 5px 0px -7px">new</span>'+ (data[i].effective_code || '') + '</td>' +
                        '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].student_qq || '') + '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].distribution_time || '') + '</td>'
                        +
                        // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                        // '<td style="' + (isred ? "color:red" : "") + ';text-align: center">' + (data[i].appointment_time || '') + '</td>' +
                        '</tr>';
                }else {
                    row = '<tr onclick="fill_data(' + i + ');">'+
                        '<td style="text-align: center;;border: none;">' + (data[i].effective_code || '') + '</td>' +
                        '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].student_qq || '') + '</td>' +
                        '<td style="text-align: center;border: none;">' + (data[i].distribution_time || '') + '</td>'
                        +
                        // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                        // '<td style="' + (isred ? "color:red" : "") + ';text-align: center">' + (data[i].appointment_time || '') + '</td>' +
                        '</tr>';
                }
            }

        } else if (nType_fill_type == 1) {
            if(data[i].student_cellphone!=null && data[i].student_cellphone!= ''){
                row = '<tr onclick="fill_data(' + i + ');">' +
                    '<td style="text-align: center;display: none;border: none;" >' + (data[i].effective_code || '') + '</td>' +
                    '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                    '<td style="text-align: center;border: none;">' + data[i].student_cellphone + '</td>' +
                    '<td style="text-align: center;border: none;">' + (data[i].luru_prov || '') + '</td>'
                    //			+ '<td></td>'
                    +
                    // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                    '<td style="text-align: center;border: none;">' + (data[i].reservation_time || '') + '</td>' +
                    '</tr>';
            }else if(data[i].student_phone!=null && data[i].student_phone!= ''){
                row = '<tr onclick="fill_data(' + i + ');">' +
                    '<td style="text-align: center;display: none;border: none;" >' + (data[i].effective_code || '') + '</td>' +
                    '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                    '<td style="text-align: center;border: none;">' + data[i].student_phone + '</td>' +
                    '<td style="text-align: center;border: none;">' + (data[i].luru_prov || '') + '</td>'
                    //			+ '<td></td>'
                    +
                    // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                    '<td style="text-align: center;border: none;">' + (data[i].reservation_time || '') + '</td>' +
                    '</tr>';
            }else if(data[i].student_weixin!=null && data[i].student_weixin!= ''){
                row = '<tr onclick="fill_data(' + i + ');">' +
                    '<td style="text-align: center;display: none;border: none;" >' + (data[i].effective_code || '') + '</td>' +
                    '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                    '<td style="text-align: center;border: none;">' + data[i].student_weixin + '</td>' +
                    '<td style="text-align: center;border: none;">' + (data[i].luru_prov || '') + '</td>'
                    //			+ '<td></td>'
                    +
                    // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                    '<td style="text-align: center;border: none;">' + (data[i].reservation_time || '') + '</td>' +
                    '</tr>';
            }else if(data[i].student_qq!=null && data[i].student_qq!= ''){
                row = '<tr onclick="fill_data(' + i + ');">' +
                    '<td style="text-align: center;display: none;border: none;" >' + (data[i].effective_code || '') + '</td>' +
                    '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                    '<td style="text-align: center;border: none;">' + data[i].student_qq + '</td>' +
                    '<td style="text-align: center;border: none;">' + (data[i].luru_prov || '') + '</td>'
                    //			+ '<td></td>'
                    +
                    // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                    '<td style="text-align: center;border: none;">' + (data[i].reservation_time || '') + '</td>' +
                    '</tr>';
            }
        } else {
            if(data[i].student_cellphone!=null && data[i].student_cellphone!= ''){
                row = '<tr onclick="fill_data(' + i + ');">' +
                    '<td style="text-align: center;display: none;border: none;" >' + (data[i].effective_code || '') + '</td>' +
                    '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                    '<td style="text-align: center;border: none;">' + data[i].student_cellphone + '</td>' +
                    '<td style="text-align: center;border: none;">' + (data[i].luru_prov || '') + '</td>'
                    //			+ '<td></td>'
                    +
                    // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                    '<td style="' + (isred ? "color:red" : "") + ';text-align: center;border: none;">' + (data[i].next_visit_time || data[i].reservation_time || data[i].appointment_time || '') + '</td>' +
                    '</tr>';
            }else if(data[i].student_phone!=null && data[i].student_phone!= ''){
                row = '<tr onclick="fill_data(' + i + ');">' +
                    '<td style="text-align: center;display: none;border: none;" >' + (data[i].effective_code || '') + '</td>' +
                    '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                    '<td style="text-align: center;border: none;">' + data[i].student_phone + '</td>' +
                    '<td style="text-align: center;border: none;">' + (data[i].luru_prov || '') + '</td>'
                    //			+ '<td></td>'
                    +
                    // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                    '<td style="' + (isred ? "color:red" : "") + ';text-align: center;border: none;">' + (data[i].next_visit_time || data[i].reservation_time || data[i].appointment_time || '') + '</td>' +
                    '</tr>';
            }else if(data[i].student_weixin!=null && data[i].student_weixin!= ''){
                row = '<tr onclick="fill_data(' + i + ');">' +
                    '<td style="text-align: center;display: none;border: none;" >' + (data[i].effective_code || '') + '</td>' +
                    '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                    '<td style="text-align: center;border: none;">' + data[i].student_weixin + '</td>' +
                    '<td style="text-align: center;border: none;">' + (data[i].luru_prov || '') + '</td>'
                    //			+ '<td></td>'
                    +
                    // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                    '<td style="' + (isred ? "color:red" : "") + ';text-align: center;border: none;">' + (data[i].next_visit_time || data[i].reservation_time || data[i].appointment_time || '') + '</td>' +
                    '</tr>';
            }else if(data[i].student_qq!=null && data[i].student_qq!= ''){
                row = '<tr onclick="fill_data(' + i + ');">' +
                    '<td style="text-align: center;display: none;border: none;" >' + (data[i].effective_code || '') + '</td>' +
                    '<td style="text-align: center">' + (data[i].student_name || '') + '</td>' +
                    '<td style="text-align: center;border: none;">' + data[i].student_qq + '</td>' +
                    '<td style="text-align: center;border: none;">' + (data[i].luru_prov || '') + '</td>'
                    //			+ '<td></td>'
                    +
                    // '<td style="text-align: center">' + (data[i].feedback_time || '') + '</td>' +
                    '<td style="' + (isred ? "color:red" : "") + ';text-align: center;border: none;">' + (data[i].next_visit_time || data[i].reservation_time || data[i].appointment_time || '') + '</td>' +
                    '</tr>';
            }

        }
        table.append(row);
    }

    var page_total = Math.ceil(data[0].count / pagesize);
    var page_index = parseInt(data[0].pageindex);
    if (page_total > 0) {
        $('.am-pagination-current span').text(page_index + ' / ' + page_total);
    }
}


// 填充数据详细信息
function fill_data(index) {
    selected_row = index;
    // 选中行特效
    var table = $('#oppotunity_tbl tbody');
    table.find('tr').each(function (i, el) {
        if (i == (index - 1)) {
            $(this).removeClass('am-primary').addClass('am-primary');

            if ($(this).children("td").eq(0).html() == "线上预约") {
                $("#feedback_invalid_select").empty();
                //		    	var opt1=$('<option class="feedback_invalid_option_1" value="YBMQTJG">无此人,打错了</option>')
                var opt2 = $('<option value="DRSBWT">当日三遍未通(暂时无法接通,无人接听,停机,关机)</option>')
                var opt3 = $('<option value="ZDFZXYHR">撞单分重、学员呼入、留言回拨</option>')
                var opt4 = $('<option value="KFYBMXY">客服，已报名学员</option>')
                var opt5 = $('<option value="TSZY">空号</option>')
                var opt6 = $('<option value="ZXQTXM">咨询其他项目</option>')
                var opt7 = $(' <option value="QDXYBNLBJKS">各种限制条件,不能来北京考试</option>')
                $("#feedback_invalid_select").append(opt2);
                $("#feedback_invalid_select").append(opt3);
                $("#feedback_invalid_select").append(opt4);
                $("#feedback_invalid_select").append(opt5);
                $("#feedback_invalid_select").append(opt6);
                $("#feedback_invalid_select").append(opt7);
                //		    	$(".feedback_invalid_option_1").css("display","none")
            } else if ($(this).children("td").eq(0).html() == "反馈呼叫未通" || $(this).children("td").eq(0).html() == "未处理") {
                $("#feedback_invalid_select").empty()
                //		    	 $(".feedback_invalid_option_1").css("display","block")
                var opt1 = $('<option class="feedback_invalid_option_1" value="YBMQTJG">无此人,打错了</option>')
                var opt2 = $('<option value="DRSBWT">当日三遍未通(暂时无法接通,无人接听,停机,关机)</option>')
                var opt3 = $('<option value="ZDFZXYHR">撞单分重、学员呼入、留言回拨</option>')
                var opt4 = $('<option value="KFYBMXY">客服，已报名学员</option>')
                var opt5 = $('<option value="TSZY">空号</option>')
                var opt6 = $('<option value="ZXQTXM">咨询其他项目</option>')
                var opt7 = $(' <option value="QDXYBNLBJKS">各种限制条件,不能来北京考试</option>')
                $("#feedback_invalid_select").append(opt1)
                $("#feedback_invalid_select").append(opt2)
                $("#feedback_invalid_select").append(opt3)
                $("#feedback_invalid_select").append(opt4)
                $("#feedback_invalid_select").append(opt5)
                $("#feedback_invalid_select").append(opt6)
                $("#feedback_invalid_select").append(opt7)
            }
        } else {
            $(this).removeClass('am-primary');
        }
    });

    // 重置操作
    $('form').each(function (i, el) {
        $(this)[0].reset();
    });

    $('select[data-am-selected]').each(function (i, el) {
        $(this).trigger('changed.selected.amui');
    });

    // 数据字段绑定
    $('.data-field-bind').each(function (i, el) {
        var bind_name = $(this).attr('data-bind');
        var bind_data = oppotunity_data[index][bind_name];
        //        console.log(oppotunity_data)
        if (index < 1) {
            $(this).empty();
            return;
        }

        if (bind_data) {
            var odiv = bind_data;
            $(this).html(odiv);
        } else {
            $(this).text('...');
        }
    });

    // 可编辑字段的触发绑定
    $('.data-field-editable').each(function (i, el) {
        var bind_name = $(this).attr('data-bind');

        $(this).off('click');

        if (index < 1) return;

        $(this).on('click', function () {
            $(this).toggle();
            $(this).next('div').removeClass('am-hide');
            $(this).next('div').find(':text').val(oppotunity_data[index][bind_name]);
            $(this).next('div').find(':text').trigger('focus');
        })
    });

    //项目信息
    if (index > 0) {
        // 推荐项目 下拉选项
        $('.data-select-bind').each(function (i, el) {
            var bind_name = $(this).attr('data-bind');
            var bind_data = oppotunity_data[index][bind_name];

            if (index < 1) {
                $(this).val('');
                $(this).trigger('changed.selected.amui');
                return;
            }

            if (bind_data) {
                $(this).val(bind_data);
                $(this).trigger('changed.selected.amui');
            } else {
                $(this).val('');
                $(this).trigger('changed.selected.amui');
            }
        });

        var _data = oppotunity_data[index];
        var opid = _data.id;
        var param = "opid=" + opid + "&distribution_id=" + _data.distribution_id;
        if (nType == 1) {
            // opts8.value='';
            // removeAttribute("checked");
            // $("input[name='radio']:checked").removeAttribute("checked");
            service.get_reservation(param)
                .then(function (data) {
                    // console.log(data)
                    if (data.length > 0) {
                        var bean = data[0];
                        // $("input[name='radio'][value='"+bean.ticket_hold_type+"'").attr("checked",false);
                        var opts1 = '<option value="' + bean.id + '">' +
                            bean.reservation_office_id +
                            '</option>';

                        var opts2 = '<option value="' + bean.id + '">' +
                            bean.reservation_school_id +
                            '</option>';

                        var opts3 = '<option value="' + bean.id + '">' +
                            bean.project_id +
                            '</option>';

                        var opts4 = '<option value="' + bean.id + '">' +
                            bean.recommend_project_id +
                            '</option>';

                        var opts5 = '<option value="' + bean.id + '">' +
                            bean.reservation_class_id +
                            '</option>';
                        //
                        var opts6 = '<input type="text" value="' + bean.reservation_price + '" style="width:245px;height: 40px;border-radius: 3px;border: none;padding-left: 7px"/>';

                        var opts8= $("input[name='radio'][value='"+bean.ticket_hold_type+"'").attr("checked",true);
                        // console.log(opts8);
                        var opts7 = bean.remark;

                        //预约到访时间
                        $('#case_next_time_txt1').val(bean.reservation_time);
                        var param = "account=" + bean.account + "&id=" + bean.id;

                        $("#reservation_cancel_btn").on("click", function () {

                            onTriggerEventHandler('#reservation_cancel_btn' + ";" + param);
                        });
                        //			$('#case_campus_big_select').html(opts1);
                        $('#case_campus_select').html(opts2);
                        //			$('#case_course_type_select').html(opts3);
                        $('#case_course_major_select').html(opts4);
                        $('.case_course_class_select-1').html(opts5);
                        $('#case_campus_big_select-6').html(opts6);
                        $("#case_remark_txt").html(opts7);
                        // $(".ticket_hold_type").html(opts8);

                    }

                });
            //预约也要联动
            // $("#luru_prov").empty();
            var defprov = oppotunity_data[index].luru_prov;
            //省市联动
            service.get_province()
                .then(function (data) {
                    // console.log(data)
                    var len = data.length;
                    $('#luru_prov').attr("length", '0');
                    //省份与城市联动
                    $('#luru_prov').off().on('change', function () {
                        get_city($('#luru_prov').find("option:selected").attr("data-provId"));
                    });
                    for (i = 0; i < len; i++) {
                        if (data[i].name == defprov) {
                            $("#luru_prov").append($('<option data-provId=' + data[i].id + ' value=' + data[i].name + ' selected>' + data[i].name + '</option>'));
                        } else {
                            $("#luru_prov").append($('<option data-provId=' + data[i].id + ' value=' + data[i].name + '>' + data[i].name + '</option>'));
                        }
                    }
                });

        }
        else {
            $("#luru_city").empty();
            $("#luru_prov").empty();
            // $("#luru_city").find("option").remove();
            var defprov = oppotunity_data[index].luru_prov;
            //省市联动
            service.get_province()
                .then(function (data) {
                    // console.log(data)
                    var len = data.length;
                    $('#luru_prov').attr("length", '0');
                    //省份与城市联动
                    $('#luru_prov').off().on('change', function () {

                        get_city($('#luru_prov').find("option:selected").attr("data-provId"));
                    });
                    $('#luru_prov').on('blur', function () {

                        get_city($('#luru_prov').find("option:selected").attr("data-provId"));
                        $("#luru_city").empty();
                    });
                    for (i = 0; i < len; i++) {
                        if (data[i].name == defprov) {
                            $("#luru_prov").append($('<option data-provId=' + data[i].id + ' value=' + data[i].name + ' selected>' + data[i].name + '</option>'));
                        } else {
                            $("#luru_prov").append($('<option data-provId=' + data[i].id + ' value=' + data[i].name + '>' + data[i].name + '</option>'));
                        }
                    }
                });


        }
    }
}
//填充排行榜数据
function fill_phbtbl(data, tblname) {
    var rows = '';
    var int = 0;
    for (var i = 0; i < data.length; i++) {
        //		console.log(data)
        int++;
        var row = '<tr class="tpl-table-uppercase">' +
            '<td class=""> <span class="user-name am-badge am-badge-warning am-round">' + [int] + '</span> ' + data[i].user_name + '</td>' +
            '<td class="">' + data[i].baoming + '</td>' +
            '<td class=""> ￥' + data[i].liushui + '</td>' +
            '</tr>';
        rows += row;

    }
    $("#" + tblname + " tbody").html(rows);
};
//个人数据填充
function fill_phbtb2(data, tblname) {
    var rows = '';
    var int = 0;
    for (var i = 0; i < data.length; i++) {
        //		console.log(data)
        // int++;
        var row = '<tr class="tpl-table-uppercase">' +
            '<td class="">' + data[i].bmd + '</td>' +
            '<td class="">' + data[i].create_time + '</td>' +
            '<td class="">' + data[i].package_name + '</td>' +
            '<td class=""> ￥' + data[i].liushui + '</td>' +
            '</tr>';
        rows += row;

    }
    $("#" + tblname + " tbody").html(rows);
}

// 编辑修改字段后的处理操作
// var opid=oppotunity_data[selected_row]['id'];
// console.log(opid);
// var stuid=oppotunity_data[selected_row]['student_id'];
// console.log(stuid);



function doDataBind(el) {
    var bind_name = $(el).attr('data-bind');
    var newVal = $(el).val();

    if (oppotunity_data[selected_row][bind_name] != newVal) {
        var options = {
            "opid": oppotunity_data[selected_row]['id'],
            "stuid": oppotunity_data[selected_row]['student_id'],
            "account": pmAgent.userid
        };
        options[bind_name] = newVal;

        var params = $.param(options, true);
        service.student_mod(params)
            .then(function (data) {
                oppotunity_data[selected_row][bind_name] = newVal;

                if (!newVal)
                    newVal = '...';

                $(el).parent('div').addClass('am-hide');
                $(el).parent('div').prev('label').text(newVal);
                $(el).parent('div').prev('label').toggle();
            })
            .fail(function (data) {
                service.alert(data, 'error', 0);

                $(el).parent('div').addClass('am-hide');
                $(el).parent('div').prev('label').toggle();
            });
        ///////////////////////////////////////////////////////////////
        // $('#phone_bind').off().on('click',function () {
        //     var new_cellphone=$('#cellphone').val();
        //     var student_cellphone='';
        //     var options = {
        //         "opid": oppotunity_data[selected_row]['id'],
        //         "stuid": oppotunity_data[selected_row]['student_id'],
        //         "account": pmAgent.userid
        //     };
        //     // student_cellphone
        //     options[student_cellphone] = new_cellphone;
        //     var params = $.param(options, true);
        //     service.student_mod(params)
        //         .then(function (data) {
        //             oppotunity_data[selected_row][student_cellphone] = new_cellphone;
        //
        //             // alert('aa')
        //         })
        //         .fail(function (data) {
        //             service.alert(data, 'error', 0);
        //
        //             $(el).parent('div').addClass('am-hide');
        //             $(el).parent('div').prev('label').toggle();
        //         });
        // })


    } else {
        if (!newVal)
            newVal = '...';

        $(el).parent('div').addClass('am-hide');
        $(el).parent('div').prev('label').text(newVal);
        $(el).parent('div').prev('label').toggle();
    }
}



function onTriggerEventHandler(selector) {
    if (selector == '.wdatepicker') {
        WdatePicker({
            "dateFmt": "yyyy-MM-dd HH:mm:ss"
        });
    } else if (selector == '#query_btn') {
        var options = {};
        var val = $('#status_select').val();
        if (val) options['effective_code'] = val;
        val = $('#area_txt').val();
        if (val) options['luru_prov'] = val;
        val = $('#name_txt').val();
        if (val) options['student_name'] = val;
        val = $('#phone_txt').val();
        if (val) options['student_cellphone'] = val;
        val = $('#wechat_txt').val();
        if (val) options['student_weixin'] = val;
        val = $('#qq_txt').val();
        // if (val) options['student_qq'] = val;
        // val = $('#weixin_state').val();  //微信状态
        // if (val) options['weixin_state'] = val;
        // val = $('#qq_state').val();    //QQ状态
        if (val) options['qq_state'] = val;
        val = $('#last_contact_dts').val();
        if (val) options['feedback_stime'] = val;
        val = $('#last_contact_dte').val();
        if (val) options['feedback_etime'] = val;
        val = $('#next_contact_dts').val();
        if (val) //options['appointment_stime'] = val;
        {
            if (window.location.search.match(/\d+/) == 0) {

                options['appointment_stime'] = val; //首咨
            } else {

                options['next_visit_stime'] = val; //回访 预约 过期
            }
        }
        val = $('#next_contact_dte').val();
        if (val) //options['appointment_etime'] = val;
        {
            if (window.location.search.match(/\d+/) == 0) {

                options['appointment_etime'] = val; //首咨
            } else {

                options['next_visit_etime'] = val; //回访 预约 过期
            }
        }
        m_query_options = options;

        options['account'] = pmAgent.userid;
        options['pagesize'] = pagesize;
        options['pageindex'] = 1;
        if (window.location.search.match(/\d+/) == 0) {

            options['key'] = "appointment_time"; //首咨
        } else if (window.location.search.match(/\d+/) == 2 || 3 || 4) {

            options['key'] = "next_visit_time"; //回访 跨期 过期
        } else if (window.location.search.match(/\d+/) == 1) {

            options['key'] = "reservation_time"; // 预约
        } else if (window.location.search.match(/\d+/) == 5) {

            options['key'] = "appointment_time"; //领取
        }
        options['order'] = "ASC"; //默认为正序

        options['datatype'] = window.location.search.match(/\d+/);

        /* m_query_options = options;

         options['account'] = pmAgent.userid;
         options['pagesize'] = pagesize;
         options['pageindex'] = 1;
         options['datatype'] = window.location.search.match(/\d+/);*/
        var params = $.param(options, true);
        service.oppotunity(params)
            .then(function (data) {
                oppotunity_data = data;
                selected_row = 0;

                fill_dataGrid(oppotunity_data);
                fill_data(selected_row);
            })
            .fail(function (data) {
                oppotunity_data = [];
                selected_row = 0;
            });
    }
    //手机搜索
    else if (selector == '#phone_ser') {
        var options = {};
        var val = $('#status_select').val();
        if (val) options['effective_code'] = val;
        val = $('#area_txt').val();
        if (val) options['province'] = val;
        val = $('#name_txt').val();
        if (val) options['student_name'] = val;
        val = $('#phone_btn').val();
        if (val) options['student_cellphone'] = val;
        val = $('#wechat_txt').val();
        if (val) options['student_weixin'] = val;
        val = $('#qq_txt').val();
        // if (val) options['student_qq'] = val;
        // val = $('#weixin_state').val();  //微信状态
        // if (val) options['weixin_state'] = val;
        // val = $('#qq_state').val();    //QQ状态
        if (val) options['qq_state'] = val;
        val = $('#last_contact_dts').val();
        if (val) options['feedback_stime'] = val;
        val = $('#last_contact_dte').val();
        if (val) options['feedback_etime'] = val;
        val = $('#next_contact_dts').val();
        if (val) //options['appointment_stime'] = val;
        {
            if (window.location.search.match(/\d+/) == 0) {

                options['appointment_stime'] = val; //首咨
            } else {

                options['next_visit_stime'] = val; //回访 预约 过期
            }
        }
        val = $('#next_contact_dte').val();
        if (val) //options['appointment_etime'] = val;
        {
            if (window.location.search.match(/\d+/) == 0) {

                options['appointment_etime'] = val; //首咨
            } else {

                options['next_visit_etime'] = val; //回访 预约 过期
            }
        }
        m_query_options = options;

        options['account'] = pmAgent.userid;
        options['pagesize'] = pagesize;
        options['pageindex'] = 1;
        if (window.location.search.match(/\d+/) == 0) {
            options['order'] = "DESC";
            options['key'] = "appointment_time"; //首咨
        } else if (window.location.search.match(/\d+/) == 2 || 3 || 4) {

            options['key'] = "next_visit_time"; //回访 跨期 过期
        } else if (window.location.search.match(/\d+/) == 1) {

            options['key'] = "reservation_time"; // 预约
        } else if (window.location.search.match(/\d+/) == 5) {

            options['key'] = "appointment_time"; //领取
        }
        options['order'] = "ASC"; //默认为正序
        options['datatype'] = window.location.search.match(/\d+/);

        /* m_query_options = options;

         options['account'] = pmAgent.userid;
         options['pagesize'] = pagesize;
         options['pageindex'] = 1;
         options['datatype'] = window.location.search.match(/\d+/);*/
        var params = $.param(options, true);
        service.oppotunity(params)
            .then(function (data) {
                oppotunity_data = data;
                selected_row = 0;

                fill_dataGrid(oppotunity_data);
                fill_data(selected_row);
            })
            .fail(function (data) {
                oppotunity_data = [];
                selected_row = 0;
            });
    } else if (selector == '.am-pagination-prev') {
        var page_total = Math.ceil(oppotunity_data[0].count / pagesize);
        var page_index = parseInt(oppotunity_data[0].pageindex);
        if (page_index <= 1) return;

        var options = m_query_options;
        options['account'] = pmAgent.userid;
        options['pagesize'] = pagesize;
        options['pageindex'] = page_index - 1;
        options['datatype'] = window.location.search.match(/\d+/);
        var params = $.param(options, true);
        service.oppotunity(params)
            .then(function (data) {
                oppotunity_data = data;
                selected_row = 0;

                fill_dataGrid(oppotunity_data);
                fill_data(selected_row);
            })
            .fail(function (data) {
                oppotunity_data = [];
                selected_row = 0;
            });

    } else if (selector == '.am-pagination-next') {
        var page_total = Math.ceil(oppotunity_data[0].count / pagesize);
        var page_index = parseInt(oppotunity_data[0].pageindex);
        if (page_index >= page_total) return;
        var options = m_query_options;
        options['account'] = pmAgent.userid;
        options['pagesize'] = pagesize;
        options['pageindex'] = page_index + 1;
        options['datatype'] = window.location.search.match(/\d+/);
        var params = $.param(options, true);
        service.oppotunity(params)
            .then(function (data) {
                oppotunity_data = data;
                selected_row = 0;

                fill_dataGrid(oppotunity_data);
                fill_data(selected_row);
            })
            .fail(function (data) {
                oppotunity_data = [];
                selected_row = 0;
            });

    } //当输入页码时
    else if (selector == '#page_enter') {

        var page_total = Math.ceil(oppotunity_data[0].count / pagesize);
        var page_index = parseInt(oppotunity_data[0].pageindex);
        /* var page_index_new = $('.page_num').val();
         if (page_index_new > page_total) {
         $('.am-pagination-current span').text( page_total + ' / ' + page_total);
         swal("", '请输入合理数值', "warning");
         }*/
        ;
        var options = m_query_options;
        options['account'] = pmAgent.userid;
        options['pagesize'] = pagesize;
        var page_index_new = $('.page_num').val();
        if (page_index_new > page_total) {
            // options['pageindex'] = page_total;
            // $('.am-pagination-current span').text( page_total + ' / ' + page_total);
            swal("", '请输入合理数值', "warning");
        } else {
            options['pageindex'] = page_index_new;
        }
        // options['pageindex'] = page_index_new;
        options['datatype'] = window.location.search.match(/\d+/);
        var params = $.param(options, true);

        service.oppotunity(params)
            .then(function (data) {
                oppotunity_data = data;
                selected_row = 0;

                fill_dataGrid(oppotunity_data);
                fill_data(selected_row);
            })
            .fail(function (data) {
                oppotunity_data = [];
                selected_row = 0;
            });

    } else if (selector == '#student_cellphone_btn') {
        if (pmAgent.is_login_cti == 'N') {
            // showMessageBox('您没有勾选“我要打电话”，不能拨打电话', 'am-alert-warning');
            swal({
                title: "自动关闭弹窗！",
                text: "您没有勾选“我要打电话”，不能拨打电话!",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        var called_num = oppotunity_data[selected_row]['student_cellphone'];
        // called_num = oppotunity_data[selected_row]['student_cellphone'] ||oppotunity_data[selected_row]['student_phone'];
        // console.log(called_num);
        lastcalled = called_num;
        if (!called_num) {
            // showMessageBox('电话号码不能为空', 'am-alert-warning');
            swal({
                title: "自动关闭弹窗！",
                text: "电话号码不能为空!",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }


        var params = $.param(called_num, true);
        service.get_finnal_called("mobile=" + called_num)
            .then(function (data) {
                //  console.log(data);
                if (data[0].rescode == "1" && data[0].prov != "北京") {
                    called_num = "0" + called_num;
                }

                softcall.ATPlacecall(pmAgent.account, pmAgent.exten, called_num)
                    .then(function (data) {
                        // showMessageBox('正在呼叫…', 'am-alert-success');
                        swal({
                            title: "自动关闭弹窗！",
                            text: "正在呼叫…",
                            timer: 1000,
                            showConfirmButton: false
                        });
                    })
                    .fail(function (data) {
                        showMessageBox(data, 'am-alert-danger');
                    });

            })
            .fail(function (data) {
                // console.log(data);
                softcall.ATPlacecall(pmAgent.account, pmAgent.exten, called_num)
                    .then(function (data) {
                        // showMessageBox('正在呼叫…', 'am-alert-success');
                        swal({
                            title: "自动关闭弹窗！",
                            text: "正在呼叫…",
                            timer: 1000,
                            showConfirmButton: false
                        });
                    })
                    .fail(function (data) {
                        showMessageBox(data, 'am-alert-danger');
                    });
            });

        // softcall.ATPlacecall(pmAgent.account, pmAgent.exten, called_num)
        //     .then(function (data) {
        //         showMessageBox('正在呼叫…', 'am-alert-success');
        //     })
        //     .fail(function (data) {
        //         showMessageBox(data, 'am-alert-danger');
        //     });
    } else if (selector == '#student_phone_btn') {
        if (pmAgent.is_login_cti == 'N') {
            swal({
                title: "自动关闭弹窗！",
                text: "您没有勾选“我要打电话”，不能拨打电话!",
                timer: 2000,
                showConfirmButton: false
            });
            // showMessageBox('您没有勾选“我要打电话”，不能拨打电话', 'am-alert-warning');
            return;
        }

        var called_num = oppotunity_data[selected_row]['student_phone'];
        // called_num = oppotunity_data[selected_row]['student_cellphone'] || oppotunity_data[selected_row]['student_phone'];
        console.log(called_num);
        lastcalled = called_num;

        if (!called_num) {
            // showMessageBox('电话号码不能为空', 'am-alert-warning');
            swal({
                title: "自动关闭弹窗！",
                text: "电话号码不能为空!",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        softcall.ATPlacecall(pmAgent.account, pmAgent.exten, called_num)
            .then(function (data) {
                // showMessageBox('正在呼叫…', 'am-alert-success');
                swal({
                    title: "自动关闭弹窗！",
                    text: "正在呼叫…",
                    timer: 1000,
                    showConfirmButton: false
                });
            })
            .fail(function (data) {
                showMessageBox(data, 'am-alert-danger');
            });
    } else if (selector == '#case_campus_big_select') {
        var val = $(selector).val();

        // 预约单联动
        $('#appoint_campus_big_select').val(val);
        $('#appoint_campus_big_select').trigger('changed.selected.amui');

        service.get_campus_id('school_id=' + val)
            .then(function (data) {
                var opts = '<option value="" selected="selected"></option>';
                for (var i = 0; i < data.length; i++) {
                    opts += '<option value="' + data[i].id + '">' +
                        data[i].name +
                        '</option>';
                }

                $('#case_campus_select').html(opts);
            })
            .fail(function (data) {
                $('#case_campus_select').empty();
            });
    } else if (selector == '#appoint_campus_big_select') {
        var val = $(selector).val();
        service.get_campus_id('school_id=' + val)
            .then(function (data) {
                var opts = '<option value="" selected="selected"></option>';
                for (var i = 0; i < data.length; i++) {
                    opts += '<option value="' + data[i].id + '">' +
                        data[i].name +
                        '</option>';
                }

                $('#appoint_campus_select').html(opts);
            })
            .fail(function (data) {
                $('#appoint_campus_select').empty();
            });
    } else if (selector == '#case_course_type_select') {
        var val = $(selector).val();

        // 预约单联动
        $('#appoint_course_type_select').val(val);
        $('#appoint_course_type_select').trigger('changed.selected.amui');

        service.get_course_major('school_id=' + val)
            .then(function (data) {
                var opts = '<option value="" selected="selected"></option>';
                for (var i = 0; i < data.length; i++) {
                    opts += '<option value="' + data[i].id + '">' +
                        data[i].name +
                        '</option>';
                }

                $('#case_course_major_select').html(opts);
            })
            .fail(function (data) {
                $('#case_course_major_select').empty();
            });
    } else if (selector == '#appoint_course_type_select') {
        var val = $(selector).val();
        service.get_course_major('school_id=' + val)
            .then(function (data) {
                var opts = '<option value="" selected="selected"></option>';
                for (var i = 0; i < data.length; i++) {
                    opts += '<option value="' + data[i].id + '">' +
                        data[i].name +
                        '</option>';
                }

                $('#appoint_course_major_select').html(opts);
            })
            .fail(function (data) {
                $('#appoint_course_major_select').empty();
            });
    } else if (selector == '#case_course_major_select') {
        var val = $(selector).val();

        // 预约单联动
        $('#appoint_course_major_select').val(val);
        $('#appoint_course_major_select').trigger('changed.selected.amui');

        var options = {
            "big_id": $('#case_course_type_select').val(),
            "major_id": val
        };
        var params = $.param(options, true);
        service.get_course_class(params)
            .then(function (data) {
                var opts = '<option value="" selected="selected"></option>';
                for (var i = 0; i < data.length; i++) {
                    opts += '<option price="' + data[i].price + '" value="' + data[i].id + '">' +
                        data[i].name +
                        '</option>';
                }

                $('#case_course_class_select').html(opts);
            })
            .fail(function (data) {
                //			$('#case_course_class_select').empty();
            });
    } else if (selector == '#appoint_course_major_select') {
        var val = $(selector).val();

        var options = {
            "big_id": $('#appoint_course_type_select').val(),
            "major_id": val
        };
        var params = $.param(options, true);
        service.get_course_class(params)
            .then(function (data) {
                var opts = '<option value="" selected="selected"></option>';
                for (var i = 0; i < data.length; i++) {
                    opts += '<option price="' + data[i].price + '" value="' + data[i].id + '">' +
                        data[i].name +
                        '</option>';
                }

                $('#appoint_course_class_select').html(opts);
            })
            .fail(function (data) {
                $('#appoint_course_class_select').empty();
            });
    } else if (selector == '#case_course_class_select') {
        var val = $(selector).val();

        // 预约单联动
        $('#appoint_course_class_select').val(val);
        $('#appoint_course_class_select').trigger('changed.selected.amui');

        var price = $(selector).find('option:selected').attr('price');
        $('#case_price_txt').val(price);
    } else if (selector == '#appoint_course_class_select') {
        var price = $(selector).find('option:selected').attr('price');
        $('#appoint_price_txt').val(price);
    } else if (selector == '#case_campus_select') {
        var val = $(selector).val();
        $('#appoint_campus_select').val(val);
        $('#appoint_campus_select').trigger('changed.selected.amui');
    } else if (selector == '#case_price_txt') {
        var val = $(selector).val();
        $('#appoint_price_txt').val(val);


        called_num = oppotunity_data[selected_row]['student_cellphone'] || oppotunity_data[selected_row]['student_phone'];
        lastcalled = called_num;
    } else if (selector == '#save_case_btn') {
        var options = {
            "opid": oppotunity_data[selected_row]['id'],
            "student_id": oppotunity_data[selected_row]['student_id'],
            "distribution_id": oppotunity_data[selected_row]['distribution_id'],
            "account": pmAgent.userid,
            "next_visit_time": $('#case_next_time_txt').val() || $('#case_next_time_txt1').val() || $('#case_next_time_txt2').val(),
            "remark": $('#case_remark_txt').val(),
            "ticket_hold_type":$("input[name='radio']:checked").val(),
            "office_big_id": $('#case_campus_big_select').val(),
            "office_id": $('#case_campus_select').val(),
            "recommend_project_id": $('#case_course_type_select').val(),
            "school_id": $('#case_course_major_select').val(),
            "class_id": $('#case_course_class_select').val(),
            "class_price": $('#case_price_txt').val(),
            "callcode": service.get_session('callid'),
            "ghid": pmAgent.account,
            "legion_id": pmAgent.corp_id,
            "group_id": pmAgent.group_name,
            'extnum': pmAgent.exten, //新增
            'called': lastcalled
        };

        var params = $.param(options, true);
        service.oppotunity_work_ticket(params)
            .then(function (data) {
                // 清空当前呼叫的callid
                service.delete_session('callid');
                // 刷新dataGrid、详细信息
                var page_index = parseInt(oppotunity_data[0].pageindex);

                var options = m_query_options;
                options['account'] = pmAgent.userid;
                options['pagesize'] = pagesize;
                options['pageindex'] = page_index;
                options['datatype'] = window.location.search.match(/\d+/);
                var params = $.param(options, true);
                service.oppotunity(params)
                    .then(function (data) {
                        oppotunity_data = data;
                        selected_row = 0;

                        fill_dataGrid(oppotunity_data);
                        fill_data(selected_row);
                    })
                    .fail(function (data) {
                        oppotunity_data = [];
                        selected_row = 0;
                    });

                service.alert(data[0]['resmsg'], 'success', 0);
                //showMessageBox('您没有勾选“我要打电话”，不能拨打电话', 'am-alert-warning');
            })
            .fail(function (data) {
                service.alert(data, 'error', 0);
            });
    } //预约点击提交
    else if (selector == '#appoint_submit_btn') {
        called_num = oppotunity_data[selected_row]['student_cellphone'] || oppotunity_data[selected_row]['student_phone'];
        lastcalled = called_num;
        var options = {
            "opid": oppotunity_data[selected_row]['id'],
            "account": pmAgent.userid,
            "remark": $('#appoint_remark_txt').val(),
            "ticket_hold_type":$("input[name='radio']:checked").val(),//保存方式
            "school_big_id": $('#appoint_campus_big_select').val(),
            "school_id": $('#appoint_campus_select').val(),
            "reservation_time": $('#appoint_time_txt').val(),
            "project_id": $('#appoint_course_type_select').val(),
            "recommend_project_id": $('#appoint_course_major_select').val(),
            "class_id": $('#appoint_course_class_select').val(),
            "reservation_price": $('#appoint_price_txt').val(),
            // :$('#coupon_bind').val(),//优惠券绑定
            "callcode": service.get_session('callid'),
            "ghid": pmAgent.account,
            "is_accord": "Y",
            'extnum': pmAgent.exten, //新增
            'called': lastcalled
        };

        var params = $.param(options, true);
        service.reservation_add(params)
            .then(function (data) {
                // 清空当前呼叫的callid
                service.delete_session('callid');
                // 刷新dataGrid、详细信息
                var page_index = parseInt(oppotunity_data[0].pageindex);
                var options = m_query_options;
                options['account'] = pmAgent.userid;
                options['pagesize'] = pagesize;
                options['pageindex'] = page_index;
                options['datatype'] = window.location.search.match(/\d+/);
                var params = $.param(options, true);
                service.oppotunity(params)
                    .then(function (data) {
                        oppotunity_data = data;
                        selected_row = 0;

                        fill_dataGrid(oppotunity_data);
                        fill_data(selected_row);
                    })
                    .fail(function (data) {
                        oppotunity_data = [];
                        selected_row = 0;
                    });

                service.alert(data[0]['resmsg'], 'success', 0);
            })
            .fail(function (data) {
                service.alert(data, 'error', 0);
            });
        //模态窗自动关闭
        // $('#appoint_modal').modal('close');
    } else if (selector == '#feedback_submit_btn') {
        called_num = oppotunity_data[selected_row]['student_cellphone'] || oppotunity_data[selected_row]['student_phone'];
        lastcalled = called_num;
        var options = {
            "opid": oppotunity_data[selected_row]['id'],
            "ischeck": "check",
            "ticket_hold_type":$("input[name='radio']:checked").val(),//保存方式
            "effective_code": $('#feedback_effective_select').val(),
            "invalid_code": $('#feedback_invalid_select').val(),
            "appointment_time": $('#feedback_appoint_txt').val(),
            "remark": $('#feedback_remark_txt').val(),
            "distribution_id": oppotunity_data[selected_row]['distribution_id'],
            "ghid": pmAgent.account,
            "account": pmAgent.userid,
            "callcode": service.get_session('callid'),
            'extnum': pmAgent.exten, //新增
            'called': lastcalled
        };

        var params = $.param(options, true);
        service.oppotunity_feedback(params)
            .then(function (data) {
                // 清空当前呼叫的callid
                service.delete_session('callid');
                // 刷新dataGrid、详细信息
                var page_index = parseInt(oppotunity_data[0].pageindex);

                var options = m_query_options;
                options['account'] = pmAgent.userid;
                options['pagesize'] = pagesize;
                options['pageindex'] = page_index;
                options['datatype'] = window.location.search.match(/\d+/);
                var params = $.param(options, true);
                service.oppotunity(params)
                    .then(function (data) {
                        oppotunity_data = data;
                        selected_row = 0;
                        fill_dataGrid(oppotunity_data);
                        fill_data(selected_row);


                    })
                    .fail(function (data) {
                        oppotunity_data = [];
                        selected_row = 0;
                    });
                service.alert(data[0]['resmsg'], 'success', 0);
            })
            .fail(function (data) {
                service.alert(data, 'error', 0);
            });
        //自动关闭模态
        $('#feedback_modal').modal('close');


        // $('.close_fk').on('click',function () {
        //     var val = $(selector).val();
        //     if (val == 'DATA_CODE_NOT_PASS') {
        //         $('#feedback_invalid_select').parents('.am-g').removeClass('am-hide').addClass('am-hide');
        //         $('#feedback_appoint_txt').parents('.am-g').removeClass('am-hide').addClass('am-hide');
        //     } else if (val == 'DATA_CODE_INVALID') {
        //         $('#feedback_invalid_select').parents('.am-g').removeClass('am-hide');
        //         $('#feedback_appoint_txt').parents('.am-g').removeClass('am-hide').addClass('am-hide');
        //     } else if (val == 'DATA_CODE_ONLINE_MARK') {
        //         $('#feedback_invalid_select').parents('.am-g').removeClass('am-hide').addClass('am-hide');
        //         $('#feedback_appoint_txt').parents('.am-g').removeClass('am-hide');
        //     }
        // });
    } else if (selector == '#abandon_btn') {
        var options = {
            "opid": oppotunity_data[selected_row]['id'],
            "distribution_id": oppotunity_data[selected_row]['distribution_id'],
            "account": pmAgent.userid
        };
        var params = $.param(options, true);
        service.oppotunity_pool_abandon(params)
            .then(function (data) {
                // 刷新dataGrid、详细信息
                var page_index = parseInt(oppotunity_data[0].pageindex);

                var options = m_query_options;
                options['account'] = pmAgent.userid;
                options['pagesize'] = pagesize;
                options['pageindex'] = page_index;
                options['datatype'] = window.location.search.match(/\d+/);
                var params = $.param(options, true);
                service.oppotunity(params)
                    .then(function (data) {
                        oppotunity_data = data;
                        selected_row = 0;

                        fill_dataGrid(oppotunity_data);
                        fill_data(selected_row);
                    })
                    .fail(function (data) {
                        oppotunity_data = [];
                        selected_row = 0;
                    });

                service.alert(data[0]['resmsg'], 'success', 0);
            })
            .fail(function (data) {
                service.alert(data, 'error', 0);
            });
    } else if (selector == '#feedback_effective_select') {   //反馈结果
        var val = $(selector).val();
        if (val == 'DATA_CODE_NOT_PASS') {
            // $('#feedback_invalid_select').parents('.am-g').removeClass('am-hide').addClass('am-hide');
            $('.reason').hide();
            $('#feedback_appoint_txt').parents('.am-g').removeClass('am-hide').addClass('am-hide');
        } else if (val == 'DATA_CODE_INVALID') {
            // $('#feedback_invalid_select').parents('.am-g').removeClass('am-hide');
            $('.reason').show();
            $('#feedback_appoint_txt').parents('.am-g').removeClass('am-hide').addClass('am-hide');
        } else if (val == 'DATA_CODE_ONLINE_MARK') {
            // $('#feedback_invalid_select').parents('.am-g').removeClass('am-hide').addClass('am-hide');
            $('.reason').hide();
            $('.next_time').removeClass('am-hide');
            // $('#feedback_appoint_txt').parents('.am-g').removeClass('am-hide');
        }
    } else if (selector == '#ref_case_tab') {

        var options = {
            "opid": oppotunity_data[selected_row]['id'],
            "distribution_id": oppotunity_data[selected_row]['distribution_id']
        };
        var params = $.param(options, true);
        service.oppotunity_work_ticket_select(params)
            .then(function (data) {
                //				console.log(data)
                var row = '';
                var table = $('#ref_case_tbl tbody');
                table.empty();
                for (var i = 0; i < data.length; i++) {
                    row = '<tr style="border-bottom:1px solid #ccc">' +
                        '<td style="position: relative;padding-right:20px;background:rgb(245,245,245);"> <h3 style="display: inline-block;float:left"><b>' + data[i].create_time + '</b></h3> <h3 style="display: inline-block;float:right"><b>工单详情</b> </h3></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><p> <b>推荐班型：</b>' + data[i].class_id + '</p></td>' +
                        '</tr>' +
                        '<tr>' +
                        // '<td><p> <b>推荐意向：</b>' + data[i].cur_intent_code + '</p></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><p> <b>下次回访时间：</b>' + data[i].next_visit_time + '</p></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><p> <b>班型价格：</b>' + data[i].class_price + '</p></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<tr>' +
                        '<td><p><b>机会归属人：</b>' + data[i].account + '</p></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<tr>' +
                        '<td><p> <b>工单创建人：</b>' + data[i].creater + '</p></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<tr>' +
                        '<td><p> <b>备注：</b>' + data[i].remark + '</p></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><p class="tpl-table-black-operation"> <b>通话录音：</b><a href="javascript:;"  onclick="onRowItemClickedEventHandler(\'' + data[i].file_address + '\')"><i class="am-icon-music"></i>播放</a></p></td>' +
                        '</tr>';
                    table.append(row);
                }
            })
            .fail(function (data) {
                var table = $('#ref_case_tbl tbody');
                table.empty();
            });
    }
    //新增----------------------------------------
    else if (selector == "#visit_show_today" || selector == "#visit_show_other") {
        var options = {};
        if (window.location.search.match(/\d+/) == 0) {
            options['key'] = "appointment_time"; //首咨
        } else {
            options['key'] = "next_visit_time"; //回访 预约 过期
            //当点击当日回访时
            $('#visit').click(function () {
                options['next_visit_time'] = "today";
                options['order'] = "ASC";
            });
            //当点击其它时
            $('#other').click(function () {
                options['next_visit_time'] = "other";
                options['order'] = "ASC";
            });
        }
        options['order'] = "ASC"; //默认为正序
        if (selector == "#visit_show_today") {
            options['next_visit_time'] = "today";
        } else {
            options['next_visit_time'] = "other";
        }

        m_query_options = options;
        options['account'] = pmAgent.userid;
        options['pagesize'] = pagesize;
        options['pageindex'] = 1;
        options['datatype'] = window.location.search.match(/\d+/);

        var params = $.param(options, true);
        service.oppotunity(params)
            .then(function (data) {
                oppotunity_data = data;
                selected_row = 0;

                fill_dataGrid(oppotunity_data);
                fill_data(selected_row);
            })
            .fail(function (data) {
                oppotunity_data = [];
                selected_row = 0;
            });
    }

    //业务日志
    else if (selector == "#ref_case_tab_2") {
        var options = {
            "opid": oppotunity_data[selected_row]['id'],
            "distribution_id": oppotunity_data[selected_row]['distribution_id']
        };
        var params = $.param(options, true);
        service.get_operate_log(params)
            .then(function (data) {
                var row = '';
                var table = $('#ref_case_tbl_2 tbody');
                table.empty();
                for (var i = 0; i < data.length; i++) {
                    //  console.log(data[i].operate_type_code)
                    row = '<tr style="border-bottom:1px solid #ccc">' +
                        '<td style="position: relative;padding-right:20px;background:rgb(245,245,245);"> <h3 style="display: inline-block;float:left"><b>' + data[i].operator_time + '</b></h3> <h3 style="display: inline-block;float:right"><b>日志详情</b> </h3></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><p> <b>归属人：</b>' + data[i].account + '</p></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><p> <b>操作人：</b>' + data[i].operator + '</p></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><p> <b>操作项1：</b>' + data[i].operate_type_code + '</p></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><p><b>操作项2：</b>' + data[i].sub_operate_type + '</p></td>' +
                        '</tr>';
                    table.append(row);
                }
            })
    }
    //在线记录
    else if (selector == "#ref_case_tab_0") {

    }
    //反馈记录
    else if (selector == "#ref_case_tab_3") {


        var options = {
            "opid": oppotunity_data[selected_row]['id'],
            // "distribution_id": oppotunity_data[selected_row]['distribution_id']
        };
        var params = $.param(options, true);
        service.get_feedback_list(params)
            .then(function (data) {
                //				console.log(data)
                var row = '';
                var table = $('#ref_case_tbl_5 tbody');
                table.empty();
                for (var i = 0; i < data.length; i++) {
                    //					console.log(data[i].operate_type_code)
                    row = '<tr style="border-bottom:1px solid #ccc">' +
                        '<td style="position: relative;padding-right:20px;background:rgb(245,245,245);"> <h3 style="display: inline-block;float:left"><b>' + data[i].feedback_time + '</b></h3> <h3 style="display: inline-block;float:right"><b>反馈记录</b> </h3></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><p> <b>归属人：</b>' + data[i].account + '</p></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><p> <b>反馈类型：</b>' + data[i].data_code + '</p></td>' +
                        '</tr>' +
                        '<td><p> <b>备注：</b>' + data[i].remark + '</p></td>' +
                        '</tr>';
                    table.append(row);
                }
            })
    } else if (selector.indexOf('#reservation_cancel_btn') > -1) {

        var params = selector.split(";");
        var param = params[1] + "&opid=" + oppotunity_data[selected_row]['id'];
        /*---------------取消预约弹窗---------------------*/
        // var msg = "您真的确定要删除吗？\n\n";
        // if (confirm(msg) == true) {

        swal({
            title: "提示!",
            text: "确定取消预约吗！",
            type: "warning",
            showCancelButton: true,
            // confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {

            service.reservation_cancel(param).then(function (data) {
                /*  oppotunity_data = data;
                 selected_row = 0;*/

                var page_total = Math.ceil(oppotunity_data[0].count / pagesize);
                var page_index = parseInt(oppotunity_data[0].pageindex);
                var options = m_query_options;
                options['account'] = pmAgent.userid;
                options['pagesize'] = pagesize;
                options['pageindex'] = page_index;
                options['datatype'] = window.location.search.match(/\d+/);
                var params = $.param(options, true);
                //刷新页面
                service.oppotunity(params)
                    .then(function (data) {
                        swal("", "取消成功。", "success");
                        oppotunity_data = data;
                        selected_row = 0;
                        fill_dataGrid(oppotunity_data);
                        fill_data(selected_row);
                        $('#case_campus_big_select').html("");
                        $('#case_campus_select').html("");
                        $('#case_course_type_select').html("");
                        $('#case_course_major_select').html("");
                        $('#case_course_class_select').html("");
                        $('#case_campus_big_select-6').html("");
                    })
                    .fail(function (data) {
                        oppotunity_data = [];
                        selected_row = 0;
                    });

                return true;
            });
        });
        // }
    }
    //  关闭音频
    else if (selector == '#play_close_btn') {
        $('#play_mediaplayer')[0].pause();
        $('#play_modal').modal('close');
    }
    //  首页排行榜->组内
    else if (selector == "#default_zn") {
        var options = m_query_options;
        options['username'] = pmAgent.userid;
        options['type'] = "week";
        options['range'] = "group";
        options['limit'] = 5;
        var params = $.param(options, true);
        service.liushui_rank(params)
            .then(function (data) {
                fill_phbtbl(data, 'default_tab1');
            })
        //	console.log(111)
    }
    //点击本周
    else if (selector == "#default_bz1") {
        //组内本周-1
        var options = m_query_options;
        options['username'] = pmAgent.userid;
        options['type'] = "week";
        options['range'] = "group";
        options['limit'] = 5;
        var params = $.param(options, true);
        service.liushui_rank(params)
            .then(function (data) {
                //				console.log(data)
                fill_phbtbl(data, 'default_tab1');
                $("#default_bz3").html("本周排行榜")
            })
    }
    //点击本月-1
    else if (selector == "#default_by1") {
        var options = m_query_options;
        options['username'] = pmAgent.userid;
        options['type'] = "month";
        options['range'] = "group";
        options['limit'] = 5;
        var params = $.param(options, true);
        service.liushui_rank(params)
            .then(function (data) {
                fill_phbtbl(data, 'default_tab1');
                $("#default_bz3").html("本月排行榜");
            })
    }
    //军团
    else if (selector == "#default_jt") {
        var options = m_query_options;
        options['username'] = pmAgent.userid;
        options['type'] = "week";
        options['range'] = "corp";
        options['limit'] = 5;
        var params = $.param(options, true);
        service.liushui_rank(params)
            .then(function (data) {
                fill_phbtbl(data, 'default_tab2');
            })
    }
    //军团-点击本周-2
    else if (selector == "#default_bz2") {
        var options = m_query_options;
        options['username'] = pmAgent.userid;
        options['type'] = "week";
        options['range'] = "corp";
        options['limit'] = 5;
        var params = $.param(options, true);
        //		console.log(params)
        service.liushui_rank(params)
            .then(function (data) {
                //				console.log(data)
                fill_phbtbl(data, 'default_tab2');
                $("#default_bz4").html("本周排行榜")
            })
    }
    //点击本月-2
    else if (selector == "#default_by2") {
        var options = m_query_options;
        options['username'] = pmAgent.userid;
        options['type'] = "month";
        options['range'] = "corp";
        options['limit'] = 5;
        var params = $.param(options, true);
        service.liushui_rank(params)
            .then(function (data) {
                //				console.log(data)
                fill_phbtbl(data, 'default_tab2');
                $("#default_bz4").html("本月排行榜")
            })
    }

    //个人流水查看
    else if (selector == "#default_gr") {
        var options = m_query_options;
        options['username'] = pmAgent.userid;
        options['type'] = "week";
        options['range'] = "self";
        options['limit'] = 5;
        var params = $.param(options, true);
        //		console.log(params)
        service.liushui_rank(params)
            .then(function (data) {
                //				console.log(data)
                fill_phbtb2(data, 'default_tab3');
                $("#default_bz4").html("本周排行榜")
            })
    }
    //点击本周
    else if (selector == "#default_bz6") {
        var options = m_query_options;
        options['username'] = pmAgent.userid;
        options['type'] = "week";
        options['range'] = "self";
        options['limit'] = 5;
        var params = $.param(options, true);
        service.liushui_rank(params)
            .then(function (data) {
                //				console.log(data)
                fill_phbtb2(data, 'default_tab3');
                // $("#default_bz4").html("本月排行榜")
            })
    }
    //点击本月3
    else if (selector == "#default_by3") {
        var options = m_query_options;
        options['username'] = pmAgent.userid;
        options['type'] = "month";
        options['range'] = "self";
        options['limit'] = 5;
        var params = $.param(options, true);
        service.liushui_rank(params)
            .then(function (data) {
                //				console.log(data)
                fill_phbtb2(data, 'default_tab3');
                // $("#default_bz4").html("本月排行榜")
            })
    }

    //反馈
    else if (selector == "#feedback_btn") {
        $('#feedback_invalid_select').parents('.am-g').removeClass('am-hide');
        // $('#feedback_appoint_txt').parents('.am-g').removeClass('am-hide').addClass('am-hide');
    }
}

//音频播放
function onRowItemClickedEventHandler(url) {
    $('#play_mediaplayer')[0].src = url;
    $('#play_mediaplayer')[0].play();
    $('#play_modal').modal();
}

// 消息提示框
function showMessageBox(msg, level_css) {
    var message = '<div class="am-text-xs am-alert ' + level_css + '" data-am-alert>' +
        '<button type="button" class="am-close">&times;</button>' +
        '<p>' + msg + '</p>' +
        '</div>';
    $('#msgbox').html(message);
    // 2秒后自动关闭
    setTimeout('$("#msgbox").empty();', 2000);
}

//微信验证
//function iswx(awx) {
//	var bValidate = RegExp(/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/).test(awx);
//	if(bValidate) {
//		return true;
//	} else
//		return false;
//}
//$(function() {
//	$("#student_weixin").on("blur", function() {
//		if(!iswx($.trim($("#student_weixin").val()))) {
//      	sweetAlert("格式不正确", "格式不正确!", "error");
//			return false;
//		}
//
//		return true;
//	});
//});

////	qq正则验证
//function isQQ(aQQ) {
//	var bValidate = RegExp(/^[1-9][0-9]{4,9}$/).test(aQQ);
//	if(bValidate) {
//		return true;
//	} else
//		return false;
//}
//$(function() {
//	$("#student_qq").on("blur", function() {
//		if(!isQQ($.trim($("#student_qq").val()))) {
//
//			sweetAlert("格式不正确", "格式不正确!", "error");
//			return false;
//		}
//
//		return true;
//	});
//});
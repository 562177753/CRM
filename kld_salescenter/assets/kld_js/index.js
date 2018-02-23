$(document).ready(function () {
    var m_oppotunity_data = [];
    var sock_cti;
    // 登录个人信息
    pmAgent = pmAgent.load();
    // console.log('pmAgent>>',pmAgent);
    if ((!pmAgent) || (pmAgent.is_login != 'Y')) {
        window.location = 'login.html';
        return;
    }

    // 退出CRM
    $('#logout_btn').on('click', function () {
        sessionStorage.clear();//清除存储
        if (pmAgent.is_login_cti == 'N') {
            window.location = 'login.html';
            return;
        }

        var promise = softcall.doQueueRemove(pmAgent.account, pmAgent.exten);
        promise.then(function (data) {
            sock_cti.emit('logout', {
                "name": pmAgent.userid,
                "device": pmAgent.account,
                "exten": pmAgent.exten
            });

            window.location = 'login.html';
            return;
        })
            .fail(function () {
                window.location = 'login.html';
            });
    });
    // 软电话挂机
    $('#softcall_hangup_btn').on('click', function () {
        if (pmAgent.is_login_cti == 'N') {
            service.alert('您没有勾选“我要打电话”，不能使用电话功能', 'error', 0);
            return;
        }

        var promise = softcall.ATHangup(pmAgent.exten);
        promise.then(function (data) {
            //
        })
            .fail(function (data) {
                service.alert(data, 'error', 0);
            });
    });

    // 登录CTI
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

    fillProfile(pmAgent);

    //当点击电话搜索时
    $('#btn_search').click(function () {
        var phone_num = $('#phone_num').val();
        service.oppotunity_search({
            phone: phone_num
        }).then(function (data) {
            //   console.log(data);
            //   var oppotunity_search1=data;
            if (data[0].rescode == '-200') {
                swal("", data[0]["resmsg"], "warning");
            } else {
                var options = {
                    'width': '900px'
                };
                //调用显示模态
                $('#search_modal').modal(options);
                var row = '';
                var table2 = $('#serach_result tbody');
                table2.empty();
                $('textarea').empty();
                for (var i = 0; i < data.length; i++) {
                    call_num = data[i].student_cellphone;
                    // console.log(call_num);
                    row = '<tr style="border: none">' +
                        // '<td  class="am-text-center am-text-middle">' + ( 1 || '') + '</td>' +
                        // '<td  class="am-text-center am-text-middle">' + (data[i].t_student_names || '') + '</td>' +    value="' + user_id + '"
                        // ' <td style="width: 30px;line-height: 45px;border: none;">' +
                         // ' <input type="text" readonly="readonly" value="' + data[i].t_student_names + '" style=" width: 60px; margin: 0px -15px;line-height: 25px;border-style:none;outline:none;text-align: center;"/>' +
                        // '</td>' +
                        '<td class="am-text-center am-text-middle" style="width: 30px;line-height: 45px;border: none;">' + (data[i].student_name || '') + '</td>' +
                        '<td style="width: 80px;line-height: 60px;border: none;">' +
                        ' <input id="cell_phone" class="write" type="text" value="' + data[i].student_cellphone + '" style="width: 120px;margin: 0px -15px;line-height: 25px;background-color: #f9f9f9;border-style:none;outline:none;text-align: center;"/>' +
                        '</td>' +
                        // '<td  class="am-text-center am-text-middle" id="weixin">' + (data[i].student_weixin || '') + '</td>' +
                        '<td style="width: 85px;line-height: 60px;border: none;">' +
                        ' <input type="text" id="weixin_stu" class="write" value="' + data[i].student_weixin + '" style="width: 105px;margin: 0px -15px;line-height: 25px;background-color: #f9f9f9;border-style:none;outline:none;text-align: center;"/>'
                        + '</td>' +
                        // '<td  class="am-text-center am-text-middle" id="qq">' + (data[i].student_qq || '') + '</td>' +
                        '<td style="width: 85px;line-height: 60px;border: none;">' +
                        ' <input type="text" id="qq_stu" class="write" value="' + data[i].student_qq + '" style="width: 105px; line-height: 25px;margin: 0px -15px;background-color: #f9f9f9;border-style:none;outline:none;text-align: center;"/>' +
                        '</td>' +
                        '<td  class="am-text-center am-text-middle" style="width: 5%;border: none;">' + (data[i].fenpei_state || '') + '</td>' +
                        '<td  class="am-text-center am-text-middle" style="width: 5%;border: none;">' + (data[i].account || '') + '</td>' +
                        '<td class="am-text-center am-text-middle" style="width: 5%;border: none;">' + (data[i].effective_code || '') + '</td>' +
                        '<td  class="am-text-center am-text-middle" style="width: 5%;border: none;">' + (data[i].feedback_time || '') + '</td>' +

                        '<td class="td1" style="width:15%;line-height: 25px;border: none"><button type="button" class="am-btn am-radius am-btn-default am-btn-success" id="call" style="width: 50px;height: 22px;text-align: center;font-size: 13px; line-height: 5px; margin:0px 2px 2px 0px">拨打</button>' + '<button  type="button" id="get" class="am-btn am-radius  am-btn-default am-btn-warning inquirys_business" style="width: 50px;height: 22px;text-align: center;font-size: 13px; line-height: 5px;">领取</button><br>' +'<button  type="button" class="am-btn am-radius  am-btn-default am-btn-danger inquirys_business" id ="edit" style="width: 50px;height: 22px;text-align: center;font-size: 13px; line-height: 5px;margin:0px 2px 2px 0px;border: none;">编辑</button>'
                        +'<button  type="button" id="submit_b" class="am-btn am-radius  am-btn-default am-btn-primary inquirys_business" id ="edit" style="width: 50px;height: 22px;text-align: center;font-size: 13px; line-height: 5px;border: none;">保存</button>' +'</td>' +
                        '</tr>';

                    table2.append(row);
                    //获取在线记录
                    $('textarea').append(data[i].online_record);
                    var id = data[i].id;
                    // console.log(id);
                    var distribution_id = data[i].distribution_id;
                    // $('#ref_case_tab_2').click(function () {
                    var options = {
                        "opid": id,
                        "distribution_id": distribution_id
                    };
                    var params = $.param(options, true);
                    //业务日志接口
                    var params = $.param(options, true);
                    service.get_operate_log(params)
                        .then(function (data) {
                            // console.log(data);
                            var row = '';
                            var table = $('#ref_case_tbl tbody');
                            table.empty();
                            var init = 0;
                            for (var i = 0; i < data.length; i++) {
                                init++;
                                row = '<tr>' +
                                    '<td  class="am-text-center am-text-middle" style="border: none;">' + ([init] || '') + '</td>' +
                                    '<td  class="am-text-center am-text-middle" style="border: none;">' + (data[i].account || '') + '</td>' +
                                    '<td  class="am-text-center am-text-middle" style="border: none;">' + (data[i].operator || '') + '</td>' +
                                    '<td  class="am-text-center am-text-middle" style="border: none;">' + (data[i].operator_time || '') + '</td>' +
                                    '<td  class="am-text-center am-text-middle" style="border: none;">' + (data[i].operate_type_code || '') + '</td>' +
                                    '<td class="am-text-center am-text-middle" style="border: none;">' + (data[i].sub_operate_type || '') + '</td>' +
                                    '<td  class="am-text-center am-text-middle" style="border: none;">' + (data[i].remark || '') + '</td>' +
                                    '</tr>';
                                table.append(row);
                            }
                        });
                    // });
                    $('#call').click(function () {
                        // alert('aa');
                        var params = $.param(phone_num, true);
                        service.get_finnal_called("mobile=" + call_num)
                            .then(function (data) {
                                //  console.log(data);
                                if (data[0].rescode == "1" && data[0].prov != "北京") {
                                    phone_num = "0" + call_num;
                                }
                                if (pmAgent.is_login_cti == 'N') {
                                    // alert('aa');
                                    alert('请在登录页勾选"我要打电话"');
                                    return;
                                }
                                else {
                                    softcall.ATPlacecall(pmAgent.account, pmAgent.exten, call_num)
                                }
                            })
                            .fail(function (data) {
                                // console.log(data);
                                softcall.ATPlacecall(pmAgent.account, pmAgent.exten, call_num)
                                    .then(function (data) {
                                        console.log(data);
                                    })
                                    .fail(function (data) {
                                        console.log(data);
                                    });
                            });
                    })

                    $('#get').click(function () {
                        var options = {
                            "opid": data[0].id,
                            "account": pmAgent.userid
                        };
                        var params = $.param(options, true);
                        service.oppotunity_pool_batch_get(params)
                            .then(function (data) {
                                // 刷新dataGrid
                                // var page_index = parseInt(m_oppotunity_data[0].pageindex);
                                // var options = m_query_options;
                                // options['pagesize'] = m_pagesize;
                                // options['pageindex'] = page_index;
                                options['account'] = pmAgent.userid;
                                var params = $.param(options, true);
                                service.oppotunity_pool_select(params)
                                    .then(function (data) {
                                        m_oppotunity_data = data;

                                        if (m_oppotunity_data.length < 2) {
                                            service.alert('没有记录', 'info', 0);
                                            return;
                                        }

                                        // fill_dataGrid(m_oppotunity_data);
                                    })
                                    .fail(function (data) {
                                        // m_oppotunity_data = [];
                                    });

                                service.alert(data[0]['resmsg'], 'info', 0);
                            })
                            .fail(function (data) {
                                service.alert(data, 'error', 0);
                            });
                        // }

                    });
                    $('#edit').on('click',function () {
                        //"background","#fff",
                        $('.write').css("background","#fff");
                        $('.write').css("border","1px solid #ccc" );

                    });
                    $('#submit_b').on('click', function (event) {
                        event.stopPropagation();
                        var student_cellphone = $('#cell_phone').val();
                        var weixin = $('#weixin_stu').val();
                        var qq = $('#qq_stu').val();
                        var options = {
                            "opid": data[0].id,
                            "stuid": data[0].student_id,
                            "account": pmAgent.userid,
                            "student_cellphone": student_cellphone,
                            "student_weixin": weixin,
                            "student_qq": qq
                        };
                        var params = $.param(options, true);
                        // console.log(params);
                        service.student_mod_1(params)
                            .then(function (data) {
                                console.log(data);
                                if (data[0].rescode == 1) {
                                    swal("Good!", data[0].resmsg, "success");
                                    $('.write').css("background","#f9f9f9");
                                    $('.write').css("border","none" );
                                } else {
                                    // console.log(data[0].rescode);
                                    swal("Good!", data[0].resmsg, "warning");
                                }
                            })
                    });

                }
            }

        });
    });
    $('body').on('keydown', function (event) {
        if (event.which == 13) {
            $('#btn_search').triggerHandler('click');
            return false;
        }

    });


    //进入页面 分别获取 首咨 和报名数
    var hint;
    var hint1;
    var options = {
        "account": pmAgent.userid,
        "type":'allot'
    };
    var params = $.param(options, true);
    service.get_message(params)
        .then(function (data) {
            // console.log(data);
            for (var i = 0; i < data.length; i++) {
                hint=data.length;
            }
        });

    var options = {
        "account": pmAgent.userid,
        "type":'baoming'
    };
    var params = $.param(options, true);
    service.get_message(params)
        .then(function (data) {
            for (var i = 0; i < data.length; i++) {
                hint1=data.length;

            }

        });


    //设置消息自动提醒
    setInterval(function () {
        // http://192.168.1.85:9090/BlastBomb/shouzi_cnt?callback=jQuery20301649059824629855_1515480557748&username=zhaochengzhi&zhaochengzhi&_=1515480557749
        //新首咨
        var options = {
            "account": pmAgent.userid,
            "type":'allot'
        };
        var params = $.param(options, true);
        service.get_message(params)
            .then(function (data) {
                var end;
                for (var i = 0; i < data.length; i++) {
                    end=data.length;
                }
                // console.log(hint);
                if(hint!=end){
                    var number= Number(end);
                    var number1= Number(hint);
                    // console.log(typeof (number));
                    var new1 = number - number1;
                    if(NaN!=new1){
                        $('#hint').show();
                        $('#hint').html('新入首咨'+new1+'条!');
                    }else {
                        return;
                    }
                    hint=end;
                }
            });
        //新报名
        var options = {
            "account": pmAgent.userid,
            "type":'baoming'
        };
        var params = $.param(options, true);
        service.get_message(params)
            .then(function (data) {
                var end1;
                for (var i = 0; i < data.length; i++) {
                    end1=data.length;

                }
                // console.log(hint1);
                if(hint1!=end1){
                    var number= Number(end1);
                    var number1= Number(hint1);
                    // console.log(typeof (number));
                    var new1 = number - number1;
                    if(NaN!=new1){
                        $('#hint').show();
                        $('#hint').html('新报名'+new1+'人!');
                    }else {
                        return;
                    }
                    hint1=end1;
                }
            });
        // },10000);
    },1200000);



//点击隐藏提醒

    $('#news').on('click',function () {
        $('#hint').hide();
    });


//查看新首咨消息提醒
    $('#new_chance').on('click', function (event) {
        // $('div').hasClass('redColor');
        var see=$('#do-not-say-1');
        if(see.hasClass('am-in')){
            $('#content1').empty();
            return;
        }else {
            new1()
        }
    });

    //查看新首咨消息提醒
    function new1() {
        var options = {
            "account": pmAgent.userid,
            "type":'allot'
        };
        var params = $.param(options, true);
        service.get_message(params)
            .then(function (data) {
                // console.log(data);
                var new_1='';
                for (var i = 0; i < data.length; i++) {
                    new_1+= '<span style="color: red">'+ '*' +'</span>'+'<span>'+data[i].msg_time+'</span>' +'<br>'+ '<span>'+data[i].content+'</span>' +'<br>'+'<hr style="margin: 0px;border-color: #fff">';
                }
                $('#content1').append(new_1);
            });
    }


//查看新报名消息
    $('#new_apply').on('click', function (event) {
        var see1=$('#do-not-say-2');
        if(see1.hasClass('am-in')){
            $('#content2').empty();
            return;
        }else {
            new2()
        }
    });

    //新报名消息提醒
    function new2() {
        var options = {
            "account": pmAgent.userid,
            "type":'baoming'
        };
        var params = $.param(options, true);
        service.get_message(params)
            .then(function (data) {
                // console.log(data);
                var new_2='';
                for (var i = 0; i < data.length; i++) {
                    new_2+= '<span style="color: red">'+ '*' +'</span>'+'<span>'+data[i].msg_time+'</span>' +'<br>'+ '<span>'+data[i].content+'</span>' +'<br>';
                }
                $('#content2').append(new_2);
            });
    }

    $('#tabGroup1 li').click(function () {
        $()
    })



});
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

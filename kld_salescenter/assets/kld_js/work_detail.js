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

    // 填充数据
    //军团
    var legion_id='';
    options={
        "username": pmAgent.userid
    }
    var params = $.param(options, true);
    service.get_legion(params)
        .then(function(data) {
            var opts = '<option value="" selected="selected"></option>';
            for (var i = 0; i < data.length; i++) {
                // legion_id=data[i].id;

                opts += '<option value="' + data[i].id + '">'
                    + data[i].name
                    + '</option>';
                ;
            }
            $('#detail_flow_2').html(opts);
            // $('#detail_group_2').empty();


            $('#detail_group_2').next().find('button').on('click',function (e) {
                var legion_id=$('#detail_flow_2').next().find('ul li[class="am-checked"]').attr("data-value");

                /*console.log()*/
                options={
                    "username": pmAgent.userid,
                    "legion":legion_id
                }
                var params = $.param(options, true);
                service.get_group(params)
                    .then(function(data) {
                        var opts = '<option value="" selected="selected"></option>';
                        for (var i = 0; i < data.length; i++) {
                            opts += '<option value="' + data[i].id + '">'
                                + data[i].name
                                + '</option>';
                        }
                        $('#detail_group_2').html(opts);
                    })
            })
        });
//小组

});


function onTriggerEventHandler(selector) {
    if(selector == "#query_btn_2") {
        var options = {};
        // options["account"] = pmAgent.userid;
        options["username"] = pmAgent.userid;
        var val = $('#detail_flow_2').val(); //军团
        if(val) options['corp'] = val;

        val = $('#detail_group_2').val(); //小组
        if(val) options['group'] = val;

        val = $('#detail_calss_2').val(); //等级
        if(val) options['level'] = val;

        // val = $('#detail_account').val(); //咨询师
        // if(val) options['name'] = val;

        val = $('#star_date').val(); //日期
        if(val) options['sdate'] = val;

        val = $('#end_date').val(); //日期
        if(val) options['edate'] = val;
        m_query_options=options;
        options['pagesize'] = pagesize;
        options['pageindex'] = 1;
        options['datatype'] = datatype;
        var params = $.param(options, true);
        service.rpt_search(params)
            .then(function(data) {
                inquiry_data = data;
                fill_dataGrid(inquiry_data);
                $('#detail_group_2').empty();
                // $('#detail_flow_2').empty();

            }).fail(function (data) {
            // swal('提示',data,'warning')
            service.alert(data, 'error', 0);
            var table = $('#inquirys_tbl_2 tbody');
            table.empty();
            $('.am-pagination-current span').text(' ... ');
            });





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
        // pageindex=1;
        // var page_index = pageindex;
        // var no = (page_index - 1) * 10 + 1;
        var num='';
        for(var i = 0; i < data.length; i++) {
            // console.log(data.length);
            num=i;
            // console.log(num);
            var bean = data[i];
            row = '<tr>' +
                '<td class="am-text-center am-text-middle">' + (bean.legion || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.group || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.level || '') + '</td>' +
                '<td class="am-text-center am-text-middle" >' + (bean.name || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.mingpian || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.fankui || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.jihui || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.youxiao || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.huifang || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.huifangweek|| '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.huifangkua || '') + '</td>' +
                '<td class="am-text-center am-text-middle" >' + (bean.baoming || '') + '</td>' + //报名人数
                '<td class="am-text-center am-text-middle" >' + (bean.liushui || '') + '</td>' + //流水
                '<td class="am-text-center am-text-middle" >' + (bean.arpu || '') + '</td>' + //ARPU值
                '<td class="am-text-center am-text-middle" >' + (bean.xiaozhuan || '') + '</td>' + //名片销转
                '<td class="am-text-center am-text-middle" >' + (bean.huchucnt || '') + '</td>' + //呼出通话个数
                '<td class="am-text-center am-text-middle" >' + (bean.huchulen || '') + '</td>' + //呼出通话时长

            '</tr>'

            table.append(row);
            // no++;
        }
        pageindex=1;

        var page_total = Math.ceil((num+1) / 10);
        var page_index = pageindex;
        if(page_total > 0) {
            $('.am-pagination-current span').text(page_index + ' / ' + page_total);
        } else {
            $('.am-pagination-current span').text(' ... ');
        }
    }
}



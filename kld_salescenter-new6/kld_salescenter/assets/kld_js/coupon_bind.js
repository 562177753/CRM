/**
 * Created by admin on 2017/11/17/0017.
 */
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
    //绑定优惠券
    $('#coupon_bind').on('click', function() {
        onTriggerEventHandler('#coupon_bind');
    });

    // 优惠券查询
    $('#serach_btn').on('click', function() {
        onTriggerEventHandler('#serach_btn');
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
    //绑定优惠券
    if(selector == "#coupon_bind") {
        var options = {};
        options["account"] = pmAgent.userid;
        var val = $('#phone_num1').val(); //电话
        if(val) options['mobile'] = val;
        val = $('#coupon_code').val(); //优惠券码
        if(val) options['coupon_code'] = val;
        //m_query_options=options;
        // options['pagesize'] = pagesize;
        // options['pageindex'] = 1;
        // options['datatype'] = datatype;
        var params = $.param(options, true);
        service.link_coupon(params)
            .then(function(data) {
                if(data[0]["rescode"]=='1'){
                   swal("Good!",data[0]["resmsg"], "success");
                }
                else{
                    swal( "Warning!",data[0]["resmsg"], "error");

                }
               // inquiry_data = data;
               // fill_dataGrid(inquiry_data);
                //console.log(data)
            });
    }

    //查询优惠券
    else if(selector == "#serach_btn") {
        var options = {};
        options["account"] = pmAgent.userid;
        var val = $('#phone_num').val(); //电话
        if(val) options['mobile'] = val;
        val = $('#start_date').val(); //开始日期
        if(val) options['sdate'] = val;
        val = $('#end_date').val(); //结束日期
        if(val) options['edate'] = val;

        var params = $.param(options, true);
        service.get_coupon_stu(params)
            .then(function(data) {
            //   console.log(data[0]);
                var row = '';
                var table = $('#inquirys_tbl_1 tbody');
                table.empty();
                for(var i = 0; i < data.length; i++) {
                    var bean = data[i] || data[0];
                    row = '<tr>' +
                        '<td class="am-text-center am-text-middle">' + (bean.project_name || '') + '</td>' +
                        '<td class="am-text-center am-text-middle">' + (bean.project_level_name || '') + '</td>' +
                        '<td class="am-text-center am-text-middle">' + (bean.package_name || '') + '</td>' +
                        '<td class="am-text-center am-text-middle">' + (bean.mobile || '') + '</td>' +
                        '<td class="am-text-center am-text-middle" >' + (bean.discount_types || '') + '</td>' +
                        '<td class="am-text-center am-text-middle">' + (bean.discount_amount || '') + '</td>' +
                        '<td class="am-text-center am-text-middle">' + (bean.coupon_code || '') + '</td>' +
                        '<td class="am-text-center am-text-middle">' + (bean.coupon_begindate || '') + "至" + (bean.coupon_enddate || '') + '</td>' +
                        '<td class="am-text-center am-text-middle">' + (bean.coupon_fix_time || '') + '</td>' +
                        '</tr>'
                    table.append(row);
                }


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
/*function fill_dataGrid(data) {
    //console.log('dayin11>>>>'+data);
    var row = '';
    var table = $('#inquirys_tbl_1 tbody');
    table.empty();
    if(data.length > 0) {
        var page_index = parseInt(data[0].pageindex);
        var no = (page_index - 1) * pagesize + 1; //
        for(var i = 1; i < data.length; i++) {
            var bean = data[i];
        //    console.log('dayin>>>>'+bean);
           /!* var param = "account=" + pmAgent.userid + "&opid=" + bean.id;
            var param2 = "account=" + pmAgent.userid + "&opid=" + bean.id;*!/
            row = '<tr>' +
                '<td class="am-text-center am-text-middle">' + (bean.project_name || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.mobile || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.family_id || '') + '</td>' +
                '<td class="am-text-center am-text-middle" >' + (bean.discount_types || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.discount_amount || '') + '</td>' +
                '<td class="am-text-center am-text-middle">' + (bean.coupon_fix_time || '') + '</td>' +
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
}*/



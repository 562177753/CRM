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
    //流量保存
    $('#flow').on('click', function() {
        onTriggerEventHandler('#flow');
    });


})



function onTriggerEventHandler(selector) {

    if(selector == "#flow") {
        var options = {};
        options["project_manager"] = pmAgent.userid;
        val = $('#money').val(); //金额
        if(val) options['spread_sum'] = val;
        var params = $.param(options, true);
        service.spread_edit(params)
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

}





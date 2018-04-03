
$(document).ready(function() {
    $('#is_login_cti').on('click',function () {
		if($('#is_login_cti').attr('class')=='checkY'){
            $('#is_login_cti').attr('class','checkN')
		}else{
            $('#is_login_cti').attr('class','checkY')
		}
    })
	$('#login_btn').on('click', function() {
		var val = $('#username').val();
		if (!val) {
			showMessageBox('用户名不能为空', 'am-alert-danger');
			return;
		}
		pmAgent.userid = val;
		
		val = $('#password').val();
		if (!val) {
			showMessageBox('密码不能为空', 'am-alert-danger');
			return;
		}
		pmAgent.password = val;
		
		val = $('#exten').val();
		if (!val) {
			showMessageBox('分机号码不能为空', 'am-alert-danger');
			return;
		}
		pmAgent.exten = val;
		
		pmAgent.is_login_cti = $('#is_login_cti').hasClass('checkN') ? 'Y' : 'N';
		// var ip='';
		// ip=$('#keleyivisitorip').text();
        // console.log(ip);
        var promise = service.login(pmAgent.userid, pmAgent.password, pmAgent.exten, pmAgent.is_login_cti);
		promise.then(function(data) {
            console.log(data);
            // 个人登录信息
			pmAgent.name = data['name'];
			pmAgent.org_id = data['org_id'];
			pmAgent.org_name = data['org_name'];
			pmAgent.corp_id = data['corpid'];
			pmAgent.corp_name = data['corp_name'];
			pmAgent.department_name = data['department_name'];
			pmAgent.group_name = data['group_name'];
			pmAgent.role_id = data['role_id'];
			pmAgent.role_name = data['role_name'];
			pmAgent.cti_api = data['cti_api'];
			pmAgent.account = data['account'];

            // service.resmsg(pmAgent.user_id)

            if (pmAgent.is_login_cti == 'Y') {
                promise = softcall.getGhidExten(pmAgent.account, pmAgent.exten); // 我要打电话
                return promise;
            }
            else {
                pmAgent.is_login = 'Y';
                pmAgent.save();

                window.location = 'index.html';
                return;
            }
		})
		.then(function(data) {
            // console.log(data);
            pmAgent.is_login = 'Y';
			pmAgent.save();
			window.location = 'index.html';


			return;
		})
		.fail(function(data) {
			showMessageBox(data, "am-alert-danger");
		});
	});
	
	$('body').on('keydown', function(event){
		if (event.which == 13)
			$('#login_btn').trigger('click');
	});
});

//登录消息提示框
function showMessageBox(msg, level_css) {
	var message = '<div class="am-text-xs am-alert ' + level_css + '" data-am-alert>'
		+ '<button type="button" class="am-close">&times;</button>'
		+ '<p>' + msg + '</p>'
		+ '</div>';
	$('#validation').html(message);
	// 2秒后自动关闭
	setTimeout('$("#validation").empty();', 2000);
}
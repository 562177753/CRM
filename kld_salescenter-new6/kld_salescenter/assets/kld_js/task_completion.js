/**
 * Created by admin on 2017/11/17/0017.
 */
$(document).ready(function () {
    pmAgent = pmAgent.load();
    service.get_user_mission({user_id: pmAgent.userid}).then(function (data) {
//填充data
        //  console.log(data);
        var row = '';
        var table = $('#oppotunity_tbl tbody');
        table.empty();
        for (var i = 0; i < data.length; i++) {
            user_id = data[i].user_id;
            var name = data[i].name;
            level_id = data[i].level_id;
            yueliushui = data[i].yueliushui;
            ritonghua = data[i].ritonghua;
            zhouhuifangbi = data[i].zhouhuifangbi;
            kuaqihuifangbi = data[i].kuaqihuifangbi;

            row = '<tr>' +
                /*' <td style="background: #FFFFFF">' +
                ' <input type="text" readonly="readonly" data-key="user_id" value="' + user_id + '" style="border-style:none;outline:none;text-align: center;background: #FFFFFF"/>' +
                '</td>' +*/
                ' <td style="background: #FFFFFF">' +
                ' <input type="text" readonly="readonly" data-key="name" value="' + name + '" style="border-style:none;outline:none;text-align: center;background: #FFFFFF"/>' +
                '</td>' +
                '<td>' +
                '<input type="text" readonly="readonly" data-key="yueliushui" value="' + yueliushui + '" style="text-align: center;border:none; background: #FFFFFF;" />' +
                ' </td>' +
                ' <td>' +
                ' <input type="number"  readonly="readonly" data-key="ritonghua" value="' + ritonghua + '" style="text-align: center;border:none; background: #FFFFFF;"/>' +
                ' </td>' +
                ' <td>' +
                ' <input type="number"  readonly="readonly" data-key="zhouhuifangbi" value="' + zhouhuifangbi + '" style="text-align: center;border:none; background: #FFFFFF;"/>' +
                ' </td>' +
                ' <td>' +
                ' <input type="number"  readonly="readonly" data-key="kuaqihuifangbi" value="' + kuaqihuifangbi + '" style="text-align: center;border-style:none; background: #FFFFFF;"/>' +
                ' </td>' +
                ' <td>' +
                ' <input type="number"  readonly="readonly" data-key="kuaqihuifangbi" value="' + kuaqihuifangbi + '" style="text-align: center;border-style:none; background: #FFFFFF;"/>' +
                ' </td>' +
                '</tr>';
            table.append(row);
        }
    });


    $('#submit_btns').click(function () {
        var param = [];
        var user_id_val = "", kuaqihuifangbi_val = "", yueliushui_val = "";
        var name_val = '',level_id_val='',ritonghua_val='',zhouhuifangbi_val='';
        $('#oppotunity_tbl').find('tbody>tr').each(function () {
            var item = {};

            $(this).find('td').each(function () {
                var key = $(this).find('input').attr('data-key');
                var val = $(this).find('input').val();
                item[key] = val;
                if (key == "user_id")
                    user_id_val += val + ",";
                if (key == "name")
                    name_val += val + ",";
                if (key == "level_id")
                    level_id_val += val + ",";
                if (key == "yueliushui")
                    yueliushui_val += val + ",";
                if (key == "ritonghua")
                    ritonghua_val += val + ",";
                if (key == "zhouhuifangbi")
                    zhouhuifangbi_val += val + ",";
                if (key == "kuaqihuifangbi")
                    kuaqihuifangbi_val += val + ",";
            });
            //param.push(item);
        });
        param = "user_id=" + user_id_val;
        param += "&name=" + name_val;
        param += "&level_id=" + level_id_val;
        param += "&yueliushui=" + yueliushui_val;
        param += "&ritonghua=" + ritonghua_val;
        param += "&zhouhuifangbi=" + zhouhuifangbi_val;
        param += "&kuaqihuifangbi=" + kuaqihuifangbi_val;
        param += "&username="+pmAgent.userid;
        // console.log(param);

        service.set_user_mission(param).then(function (data) {

            if(data[0]["rescode"]=='1'){
                // swal("Good!", data[0]["resmsg"], "success");
                swal("Good!", '设置成功', "success");
            }
            else{
                // swal("Good!", data[0]["resmsg"], "success");
                swal("Good!", '设置失败', "success");
            }

        });

    });

});


/**
 * Created by admin on 2017/9/12.
 */
$(function () {
   // console.log(pmAgent);
//请求后台数据
     $('.lqs-oul li a').hide();
    service.login(pmAgent.userid,pmAgent.password,pmAgent.exten).then(function(data){
        var AtreeShow=data.tree_show.split(",");
        for(var i=0;i<AtreeShow.length;i++){
            $('.lqs-oul li a').each(function(){
                var $name=$(this).data().name;
                // console.log('user>>>'+ $name);
                // console.log(AtreeShow[i]);
                if($name==AtreeShow[i]){
                    // alert('aa')
                    $(".lqs-oul li a[data-name='"+$name+"']").show();

                }
            });
        }
    });





});
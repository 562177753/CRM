$(function() {

    var $fullText = $('.admin-fullText');
    $('#admin-fullscreen').on('click', function() {
        $.AMUI.fullscreen.toggle();
    });

    $(document).on($.AMUI.fullscreen.raw.fullscreenchange, function() {
        $fullText.text($.AMUI.fullscreen.isFullscreen ? '退出全屏' : '开启全屏');
    });

    // 读取body data-type 判断是哪个页面然后执行相应页面方法，方法在下面。
    var dataType = $('body').attr('data-type');
    for(key in pageData) {
        if(key == dataType) {
            pageData[key]();
        }
    }

    $('.tpl-switch').find('.tpl-switch-btn-view').on('click', function() {
        $(this).prev('.tpl-switch-btn').prop("checked", function() {
            if($(this).is(':checked')) {
                return false
            } else {
                return true
            }
        })
    })


    // ==========================
    // 侧边导航下拉列表
    // ==========================
    $('.tpl-left-nav-link-list').on('click', function() {
        $(this).siblings('.tpl-left-nav-sub-menu').slideToggle(80)
            .end()
            .find('.tpl-left-nav-more-ico').toggleClass('tpl-left-nav-more-ico-rotate');
    })

    // ==========================
    // 头部导航隐藏菜单
    // ==========================
    $('.tpl-header-switch-button').on('click', function() {
        $('.left-sidebar').toggle();
        $('.tpl-content-wrapper').toggleClass('active');
    })

    // $('#content').height($(document).height());
})

// 页面数据
var pageData = {
    // ===============================================
    // 首页
    // ===============================================
    'default': function indexData() {

        var myScroll = new IScroll('#wrapper', {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            preventDefault: false,
            fadeScrollbars: true
        });

        var myScrollA = new IScroll('#wrapperA', {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            preventDefault: false,
            fadeScrollbars: true
        });

        var myScrollB = new IScroll('#wrapperB', {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            preventDefault: false,
            fadeScrollbars: true
        });

        // ==========================
        // 百度图表A http://echarts.baidu.com/
        // ==========================
        //折线图
        var options = m_query_options;
        options['username'] = pmAgent.userid;
        var params = $.param(options, true);
        //接口
        service.pie_homepage(params)
            .then(function(data) {
                var arry = [,"当日通时","当周回访","跨期回访"];
                arry[0] = data[0].yueliushui+'/'+data[0].yueliushui_mission;
                arry[1] = data[0].ritonghua+'/'+data[0].ritonghua_mission;
                arry[2] = data[0].zhouhuifangbi+'/'+data[0].zhouhuifangbi_mission;
                arry[3] = data[0].kuaqihuifangbi+'/'+data[0].kuaqihuifangbi_mission;
                arr = ['2','0.50','8','0.78']
                arr[0] = data[0].yueliushui_persent.substring(0 , data[0].yueliushui_persent.length-1);
                arr[1] = data[0].ritonghua_persent.substring(0 , data[0].ritonghua_persent.length-1);
                arr[2] = data[0].zhouhuifangbi_persent.substring(0 , data[0].zhouhuifangbi_persent.length-1);
                arr[3] = data[0].kuaqihuifangbi_persent.substring(0 , data[0].kuaqihuifangbi_persent.length-1);
                var arry2 = [data[0].yueliushui_persent,data[0].ritonghua_persent,data[0].zhouhuifangbi_persent,data[0].kuaqihuifangbi_persent];
                $('.littlePercent').each(function (index,ele) {
                    $(this).text(arry2[index])
                });
                $('.titleMessage').each(function (index,ele) {
                    $(this).text(arry[index])
                })
                var height1 = $('#containBox').css('height');
                height1 = +height1.substring(0,height1.length-2)*0.8
                $('.littleBox').each(function (index,ele) {
                    var a = arr[index]/100
                    if(a<1){
                        a = a*height1+'px'
                        $(this).css('height',a)
                    }else{
                        $(this).css('height',height1)
                    }
                })
            });
    }
};





//侧栏点击高亮
$(".lqs-oul a").click(function() {
    $(".lqs-oul a").css("background", "").children("span").css("color", "")
    $(this).css("background", "transparent").children("span").css("color", "white")
})


// ---------------------------------------------------------------------------------------------------
$(".lqs-oul a").click(function() {
    // $(this).css('display','block');
    // $(this).css("border-bottom", "2px solid #fff29c;");
    $(".lqs-oul a").css("background", "").children("span").css("color", "");


    $(this).children("span").css("color", "#fff29c");
    $(this).children("span").css("border-bottom", "2px solid #fff29c;")

    var text = $(this).children("span").text()
    if(text == '首页'){
        $('.left-message').css('display','block');
        // $('.tpl-content-wrapper').css('min-height','600px')
    }else if(text == '工作台'||text == '功能列表'||text == '数据管理'||text == '记录管理'){

    }else{
        $('.left-message').css('display','none');
    }
});

$('.lqs-oul li').on('click',function () {
    $(".lqs-oul li").css("border-bottom", "")
    $(this).css("border-bottom", "2px solid #fff29c");
    // $(this).css("background", "red");

})
$('.tpl-left-nav-sub-menu').on('click',function () {
    $(this).prev().children("span").css("color", "#fff29c")
})
$('.tpl-left-nav-sub-menu').click(function () {
    $('.tpl-left-nav-sub-menu').css('display','none')
})
$('.pullDowm-nav').mouseleave(function () {
    $('.tpl-left-nav-sub-menu').css('display','none')
})
// ------------------------------------------------------------------------------------------------------
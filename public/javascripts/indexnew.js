/**
 * Created by Administrator on 2017/4/5/005.
 */
$(function () {
    var hsg_nav = new Swiper ('#hgs_nav', {
        direction: 'horizontal',
        loop: false,
        // 如果需要分页器
        // pagination: '.swiper-pagination',
        // paginationClickable: true
    });

    var mySwiper = new Swiper ('#banner_swiper,#img_swiper,#other_swiper', {
        direction: 'horizontal',
        loop: true,
        // 如果需要分页器
        // pagination: '.swiper-pagination',
        // paginationClickable: true
    });

    var navLi = $('.fq-recommend-nav li');
    var tabsSwiper = new Swiper('#fq_swiper', {
        paginationClickable: true,
        loop : true,
        autoHeight: true,
        onSlideChangeStart: function(Swiper){
            var thisnum=$('.fq-img-list .swiper-slide-active').attr('data-swiper-slide-index');
            navLi.removeClass('on');
            navLi.eq(thisnum).addClass('on');

        }
    });

    touch.on(navLi,'tap', function () {
        if(!$(this).hasClass("on")){
            $(".fq-recommend-nav .on").removeClass('on');
            $(this).addClass('on');
            tabsSwiper.slideTo($(this).index() + 1);
        }
    });

    $("#ser-btn").click(function(){
        var Text=$("#ticket-text").val();
        var smold=$('.model-select-text').data('value');
        window.location.href="/list/"+smold+"?searchName="+Text;

    });
    //TouchSlide({
    //    slideCell:"#slideTxtBox"
    //});
    $('.qrCode').click(function () {
        $('.qrCode-box,.mask').show();
    });
    $('.mask').click(function () {
        $('.qrCode-box,.mask').hide();
    });
    //首页搜索模拟下拉js
    function selectModel() {
        var $box = $('div.model-select-box');
        var $option = $('ul.model-select-option', $box);
        var $txt = $('div.model-select-text', $box);
        var speed = 10;
        $txt.click(function (e) {
            $option.not($(this).siblings('ul.model-select-option')).slideUp(speed, function () {
                int($(this));
            });
            $(this).siblings('ul.model-select-option').slideToggle(speed, function () {
                int($(this));
            });
            return false;
        });
        //点击选择，关闭其他下拉
        $option.find('li').each(function (index, element) {
                if ($(this).hasClass('seleced')) {
                    $(this).addClass('data-selected');
                }
            })
            .mousedown(function () {
                $(this).parent().siblings('div.model-select-text').text($(this).text())
                    .attr('data-value', $(this).attr('data-option'));
                $option.slideUp(speed, function () {
                    int($(this));
                });
                $(this).addClass('seleced data-selected').siblings('li').removeClass('seleced data-selected');
                if($(this).parent().siblings('div.model-select-text').attr('data-value')=="ticket"){
                    $('#ticket-text').attr('placeholder','请输入景区名称搜索');
                }else if($(this).parent().siblings('div.model-select-text').attr('data-value')=="hotel"){
                    $('#ticket-text').attr('placeholder','请输入酒店名称搜索');
                }else if($(this).parent().siblings('div.model-select-text').attr('data-value')=="line"){
                    $('#ticket-text').attr('placeholder','请输入自由行名称搜索');
                }else if($(this).parent().siblings('div.model-select-text').attr('data-value')=="repast"){
                    $('#ticket-text').attr('placeholder','请输入美食名称搜索');
                }
                return false;
            })
            // .mouseover(function () {
            //     $(this).addClass('seleced').siblings('li').removeClass('seleced');
            // });
        //点击文档，隐藏所有下拉
        $(document).click(function (e) {
            $option.slideUp(speed, function () {
                int($(this));
            });
        });
        //初始化默认选择
        function int(obj) {
            obj.find('li.data-selected').addClass('seleced').siblings('li').removeClass('seleced');
        }
    }
    selectModel();
});

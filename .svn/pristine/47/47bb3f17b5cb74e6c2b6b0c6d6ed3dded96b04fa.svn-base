$(function (){
    var navSlide = new Swiper('.navSlide',{
        prevButton:'.swiper-button-prev',
        nextButton:'.swiper-button-next',
    });
    var hotSlide = new Swiper('.hotSlide',{
        pagination : '.swiper-pagination',
        //pagination : '#swiper-pagination1',
        autoplay: 4000,
        onSlideChangeEnd: function (sw){
            var _a = $('.hotSlide .swiper-slide-active'),
                _b = _a.data('ltit'),
                _c = _a.data('lsub');

            $('.hotDes h3').text(_b);
            $('.hotDes p').text(_c);
        }
    });
    
    $(".hot-scenic ul").width(
		($(".hot-scenic ul li").width()+1)*$(".hot-scenic ul li").length+1
	);	
	$("#hot-s-up").on("touchstart",function() {
		$(".hot-scenic").animate({scrollLeft:$(".hot-scenic").scrollLeft()-$(".hot-scenic ul li").width()*2}, 300);
                var flag = false;
                var stop;
                stop = setTimeout(function() { 
                    flag = true;
                    $(".hot-scenic").animate({scrollLeft:0}, 500)
                }, 600);
                $("#hot-s-up").on("touchend",function() { 
                    if (!flag) {
                        clearTimeout(stop);
                    }
                });
      });
	 $("#hot-s-down").on("touchstart",function(){
		$(".hot-scenic").animate({scrollLeft:$(".hot-scenic").scrollLeft()+$(".hot-scenic ul li").width()*2}, 500);
                var flag = false;
                var stop;
                stop = setTimeout(function() { 
                    flag = true;
                    $(".hot-scenic").animate({scrollLeft:($(".hot-scenic ul li").width()+1)*$(".hot-scenic ul li").length}, 300)
                }, 600);
                $("#hot-s-down").on("touchend",function() { 
                    if (!flag) {
                        clearTimeout(stop);
                    }
                });
      });
});


// $(function (){
//     $.ajax('http://192.168.2.232:8080/pay_server/wap/alipay/toAlipay.htm',{
//         transTime: '2017-02-17 16:38:34',
//         partner: 'LS_ZWY',
//         method: 'toAlipay',
//         sign: 'da7a3ec5236761151e8366333d647fca',
//         bizContent: 
//     })
// });
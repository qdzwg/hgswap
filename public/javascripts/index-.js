$(function () {
    /**
     * banner
     */
    var bannerSwiper = new Swiper('#banner_swiper', {
        loop: true,
        //autoplay: 4000,
        pagination: '.swiper-pagination'
    });

    /**
     *顶部公告 轮播
     */
    var addSwiper = new Swiper('#shuffling_ann', {
        direction: 'vertical',
        loop: true,
        autoplay: 4000
    });

    /**
     * 广告位 轮播
     */

    var advSwiper = new Swiper('#adv_swiper', {
        loop: true,
        autoplay: 4000,
        pagination: '.swiper-pagination'
    });

    /**
     * 活动轮播
     * @type {*|t}
     */
    var activeSwiper = new Swiper('#active_swiper', {
        slidesPerView: 2.2,
        paginationClickable: true,
        spaceBetween: 10,
        freeMode: true
    });

    /**
     * 分区推荐
     * @type {*|jQuery|HTMLElement}
     */
    var navLi = $('.fq-recommend-nav li');
    var listUrl = $('#listUrl');
    var tabsSwiper = new Swiper('#fq_swiper', {
        paginationClickable: true,
        loop : true,
        autoHeight: true,
        onSlideChangeStart: function(Swiper){
            var thisnum=$('.fq-img-list .swiper-slide-active').attr('data-swiper-slide-index');
            var _url = navLi.eq(thisnum).data('url');
            navLi.removeClass('on');
            navLi.eq(thisnum).addClass('on');
            listUrl.attr('href',_url);
        }
    });
    touch.on(navLi,'tap', function () {
        var _this = $(this);
        if(!_this.hasClass("on")){
            var _url = _this.data('url');
            listUrl.attr('href',_url);
            $(".fq-recommend-nav .on").removeClass('on');
            _this.addClass('on');
            tabsSwiper.slideTo($(this).index() + 1);
        }
    });

    /******************************************************************************************************************
     * 点击事件
     ******************************************************************************************************************/

    /**
     * 点击搜索门票
     */
    touch.on($('#searchBtn'),'tap', function (e) {
        e.stopPropagation();
        var searchName = $(this).siblings('input').val();
        window.location.href = '/list/ticket?searchName='+searchName;
    })

});



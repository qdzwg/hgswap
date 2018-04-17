
$(function () {  
    /**
     * 详情页banner
     */
    var detailSwiper = new Swiper('#home_swiper', {
        loop: true,
        autoplay:4000,
        pagination: '.swiper-pagination',
        autoplayDisableOnInteraction : false
    });
    var initDom = function (date) {
        console.log(date)
        var beginDate = date[0],
            numDays = date.length - 1,
            endDate = date[numDays];
        $.get('/detail/roomItems', {
                goodsCode: goodsCode,
                beginDate: beginDate,
                endDate: endDate,
                numDays: numDays
            })
            .success(function (data) {
                var datas = data[0];

                if (datas.status === 200) {
                    $('.details-list').empty().append(listDom(datas.data, beginDate, endDate));
                    $('#hotelCalendar span:eq(0)').html(beginDate);
                    $('#hotelCalendar span:eq(1)').html(endDate);
                    $('#hotelCalendar em').html(numDays);

                    $(".price-code-btn").click(function () {
                        $(this).toggleClass("down").parent().parent().nextAll().each(function () {
                            if (!$(this).hasClass("price-code")) {
                                return false;
                            }
                            $(this).toggle();
                        });
                    });

                    showDetail()

                } else {
                    window.location.href = '/error';
                }
                $("#calendar").hide();
            })
            .error(function (err) {
                window.location.href = '/error';
            })
    };

    $("#calendar").calendar({
        multipleMonth: 4,
        multipleSelect: true,
        click: function (dates) {
            initDom(dates);
        }
    });

    $('#hotelCalendar').on('click', function () {
        $("#calendar").show();
    });

    var nowDate = new Date(),
        nextDate = new Date(nowDate.getTime() + 24 * 60 * 60 * 1000),
        nowText = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate(),
        nextText = nextDate.getFullYear() + '-' + (nextDate.getMonth() + 1) + '-' + nextDate.getDate();

    var beginD = beginDate ? beginDate : nowText,
        endD = endDate ? endDate : nextText;

    if ($('#hotelCalendar').length) {
        initDom([beginD, endD]);
    }

    if($('.showDetail').length){
        showDetail()
    }

});

function listDom(list, begin, end) {
    var dom = '',
        len = list.length;

    list.reverse();
    while (len--) {
        var _url = list[len].enabled ? 'href="/order/hotel/' + list[len].rateCode + '?beginDate=' + begin + '&endDate=' + end + '"' : 'class="gray_btn"';
        var ratecode = list[len].ratecodes, ratelength = ratecode.length;
        var handle = '<a ' + _url + '>预订</a>';
        if (ratelength > 0) {
            handle = '<a href="javascript:;" class="price-code-btn down"><i class="font-icon icon-iconfont-jiantou"></i></a>';
        }
        var imgurl = list[len].linkMobileImg || "#";
        dom += '<li>' +
            '<div class="pro-info">' +
            '<div class="pro-img">' +
            '<img src="' + imgurl + '" alt=""/>' +
            '</div>' +
            '<div class="hotel-info">' +
            '<h4 class="pro-info-title">' + list[len].modelName + '</h4>' +
            '<p class="pro-info-explian"><span>' + bedType(list[len].bedType) + '</span><span>' + list[len].buildingArea + 'm²</span><span><i class="font-icon"></i><i class="font-icon"></i></span></p>' +
            '<p class="pro-info-explian"><a class="showDetail" href="javascript:;" class="c-base">房型介绍></a></p>' +
            '</div>' +
            '</div>' +
            '<div class="pro-price c-base">' +
            '<span class="price"><em>￥</em><strong>' + (+list[len].price).toFixed(2) + '</strong></span>' +
            '<span class="original-price"><em>￥' + (+list[len].priceShow).toFixed(2) + '</em></span>' +
            '</div>' +
            '<div class="pro-price">' + handle +
            '</div>' +
            '<div class="ticket-layer">'+
            '<a href="javascript:;" class="close-ticket font-icon icon-iconfont-32pxchaxian"></a>'+
            '<h3 class="notice-tit">' + list[len].modelName + '</h3>'+
            '<div class="article-info bgf">'+
            '<div class="article-main">' +
            '<ul class="order-list myorder-list">'+
            '<li><label for="" class="lab-title">床型</label><div class="order-item">' + bedType(list[len].bedType) + '</div></li>'+
            '<li> <label for="" class="lab-title">建筑面积</label> <div class="order-item"> <span>' + list[len].buildingArea + '㎡</span> </div> </li>'+
            '<li> <label for="" class="lab-title">房型描述</label><div class="order-item">'+list[len].modelDetail+'</div> </li>'+
            '</ul>'+
            '</div></div>'+
            '<div class="room-handle">'+
            '<p>价格<span class="price"><em>￥</em><strong>' + (+list[len].price).toFixed(2) + '</strong></span> </p>'+
            '</div></div>'+
            '</li>';
        if (ratelength > 0) {
            $.each(ratecode, function (i) {
                dom += '<li class="price-code" style="display: none">' +
                    '<h4>' + ratecode[i].aliasName + '</h4>' +
                    '<div class="pro-price c-base">' +
                    '<span class="price"><em>￥</em><strong>' + ratecode[i].currentPrice + '</strong></span>' +
                    '<span class="original-price"><em>￥' + ratecode[i].priceShow + '</em></span>' +
                    '</div>' +
                    '<div class="pro-price">' +
                    '<a href="/order/hotel/' + ratecode[i].rateCode + '?beginDate=' + begin + '&endDate=' + end + '">预订</a>' +
                    '</div>';
            });
        }
    }
    return dom;
}


function bedType(num) {
    var str = "";
    switch (num) {
        case '0':
            str = "大床";
            break;
        case '1':
            str = "双床";
            break;
        case '2':
            str = "三床";
            break;
    }
    return str;
}

/**
 * 查看详情
 */
function showDetail(){
    var _showDetail = $('.showDetail'),_mask = $('#mask'),_ticketLayer = $('.ticket-layer');

    _showDetail.unbind('click').click(function (e) {
        var _this = $(this);
        _this.parents('li').find('.ticket-layer').show();
        _mask.show();
        e.stopPropagation();
    });

    _mask.unbind('click').click(function () {
        _ticketLayer.hide();
        $(this).hide();
    });

    $('.close-ticket').click(function () {
        _ticketLayer.hide();
        _mask.hide();
    })
}
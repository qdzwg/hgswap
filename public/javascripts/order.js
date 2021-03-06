
$(function () {
    var smz = 1;
    var min_num = 4;

    var val = min_num;
    var idcard_html = '';

    $("#user").find("input").focus(function () {
        $(this).next("i").removeClass("icon-iconfont-xie").addClass("icon-iconfont-32pxchaxian");
    }).blur(function () {
        $(this).next("i").removeClass("icon-iconfont-32pxchaxian").addClass("icon-iconfont-xie");
    });
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        var windowHeight = document.documentElement.clientHeight;
        document.body.style.height = windowHeight + 'px';
    }

    /**
     * 绑定DOM节点；
     */
    var $ord = {
        form: $('#form'),
        formBtn: $('.formBtn'),
        beginDate: $('input[name=beginDate]'),
        endDate: $('input[name=endDate]'),
        price: $('#price'),
        infoAddress: $('#infoAddress'),
        expressPrice: $('#express_price'),
        totalPrice: $('#totalprice'),
        addressError: $('.address-error') //goods module
    };

    var validator;
    var goodsWayType = 0;
    formValidate(goodsWayType);

    if (module === 'shop') {
        var orD = {
            _user: $('.get_express'),
            _getExpress: $('#get_express'),
            _getType: $('#get_type'),
            _getSelf: $('#get_self'),
            _getSelfPlace: $('#get_self_place'),
            _mask: $('#mask'),
            _takeLayer: $('#take_layer'),
            _target: $('#target')
        };


        orD._getType.on('change', function () {

            $(this).find('option').each(function () {
                var _this = $(this);
                if (_this.prop('selected')) {
                    goodsWayType = Number(_this.attr('data-index'));
                }
            });

            formValidate(goodsWayType);
            switch (goodsWayType) {
                case 0:
                    orD._getSelf.hide();
                    orD._user.show();
                    $ord.expressPrice.show();
                    break;
                case 1:
                    orD._user.hide();
                    $ord.expressPrice.hide();
                    orD._getSelf.show();
                    break;
                default:
                    break
            }
        });

        orD._getSelfPlace.click(function () {
            orD._mask.show();
            orD._takeLayer.show();
        });
        $(".mask,.close-take").click(function () {
            orD._mask.hide();
            orD._takeLayer.hide();
        });

        var _a = $(".take-tit a");
        _a.click(function () {
            orD._mask.hide();
            orD._takeLayer.hide();
            orD._getSelfPlace.find('input').val($(this).parent().siblings(".take-add").find("p").html());
        });

    }

    touch.on("#cost", "tap", function () {
        var height = $("#cost-dialog").height();
        $("#mask").show();
        $("#cost-dialog").css("margin-top", -height * 0.5).show();
    });
    touch.on("#mask", "tap", function () {
        $("#mask,#cost-dialog").hide();
    });



    // 日历选择
    var calendarDates = $("#calendar").data('dates');
    var initDom = function (date, tag) {
        console.log(date);
        var _price = 0, _stock = 0;
        if (!date) {
            if (tag) {
                $('#calendarTogg').unbind('click');
            }
            initNumber(0);
            return;
        }

        if (module === 'hotel') {
            var _a = date[0].currDate, _b = date[date.length - 1].currDate, _c;

            date.pop();
            _c = date.length;

            for (var i = 0; i < date.length; i += 1) {
                _price += date[i].currPrice;
            }

            if (date.length > 1) {
                _stock = (date.reduce(function (prev, cur, index, array) {
                    return { stock: Math.min(prev.leftSum || prev.stock, cur.leftSum) };
                })).stock
            } else {
                _stock = date[0].leftSum
            }

            $ord.beginDate.val(_a);
            $ord.endDate.val(_b);
            $('#calendarTogg').text(_a + ' 至 ' + _b + '  ' + _c + '晚');
        } else if (module === 'traffic') {
            minNum = date.minNum;
            maxNum = date.maxNum;
            if (date.stockPriceMap.length) {
                _price = date.stockPriceMap[0].price;
                _stock = date.stockPriceMap[0].stock
            } else {
                $('.traffic-select').parent().html("暂无票型").css('color', '#f66')
            }
            $('input[name=id]').val(date.frequencyId);
        } else {
            _price = date.currPrice;
            _stock = date.leftSum;
            $('#calendarTogg span').text(date.currDate);
            $ord.beginDate.val(date.currDate);
            $ord.endDate.val(date.currDate);
        }

        if (_price) {
            $ord.price.text(_price);
            initNumber(_stock, date);
        } else {
            $ord.price.text('暂无价格');
            $ord.formBtn.addClass('background-gray').unbind('click');
        }

    };
    $("#calendar").calendar({
        multipleMonth: 3,
        settingdata: calendarDates,
        multipleSelect: module === 'hotel' ? true : false,
        click: function (dates) {
            initDom(module === 'hotel' ? dates : dates[0]);
            $("#calendar").hide();
        }
    });
    $('#calendarTogg').on('click', function () {
        $("#calendar").show();
    });

    function localTime(t) {
        var _a = t.split('-');
        return new Date(_a[0], +_a[1] - 1, _a[2]).getTime();
    }

    // 初始化订单，默认为库存第一天
    if (module === 'ticket' || module === 'combo' || module === 'repast' || module === 'qr') {
        initDom(calendarDates[0], 1);
    } else if (module === 'hotel') {
        var reAr = [], _be = localTime(beginDate), _en = localTime(endDate);
        calendarDates.map(function (item, index) {
            var _a = localTime(item.currDate.substr(0, 10));
            console.log(_a + "," + _be);
            if (_be <= _a && _a <= _en) {
                reAr.push(item);
            }
        });
        initDom(reAr);
    } else if (module === 'traffic') {
        var _a = $('.traffic-select').find("option:eq(0)").data('stock');
        initDom(_a);
    } else {
        if (!$ord.price.text()) {
            $ord.price.html('暂无价格');
            $ord.formBtn.addClass('background-gray').unbind('click');
        } else {
            initNumber(stock);
        }

    }

    // 加入购物车和立即预定
    function subForm() {
        if (module === 'shop' && !goodsWayType) {
            var _a3 = $('select[name=address3]');

            if (!_a3.val()) {
                $ord.addressError.show();
            }
        }

        if (validator.form() && ($ord.addressError.is(':hidden') || !$ord.addressError.length)) {

            var cardArr = [], carTag = false;
            $ord.formBtn.addClass('background-gray').unbind('click');

            $('.card_box')
                .map(function (index, item) {
                    cardArr.push($(item).val());
                });

            cardArr
                .map(function (item, index) {
                    if (cardArr.indexOf(item) !== cardArr.lastIndexOf(item)) {
                        carTag = true;
                    }
                });


            if (carTag) {
                $('.tips p').text('身份证不能相同');
                $('.mask,.tips').show();
                return;
            }
        
            var _b = ($(this)[0].tagName === 'A');
            var _url = _b
                ? module === 'shop'
                    ? '/order/' + module + '?' + $ord.form.serialize() + '&paramExtension=' + goodsWayType + '&promoteCode='+promoteCode
                    : '/order/' + module + '?' + $ord.form.serialize() + '&promoteCode='+promoteCode
                : '/order/addCart?' + $ord.form.serialize() + '&' + $('#cartForm').serialize();

            if (hasLogin) {
                //已经登录直接提交订单
                $.post(_url)
                    .success(function (data) {
                        console.log(data);
                        var datas = data[0];
                        if (datas.status === 200 && _b) {
                            window.location.href = '/pay/' + module + '/' + datas.data.orderNo;
                        } else {
                            $ord.formBtn.removeClass('background-gray').on('click', subForm);
                            $('.tips p').text(datas.message);
                            $('.mask,.tips').show();
                        }
                    })
                    .error(function (err) {
                        error();
                        $ord.formBtn.removeClass('background-gray').on('click', subForm);
                    });
            } else {
                //没有提交订单，先免密登录再提交
                $.get('/fastregByAccount?loginName=' + $ord.form.find('input[name=teles]').val()
                    + '&realName=' + $ord.form.find('input[name=linkMans]').val()
                    + '&idcard=' + $ord.form.find('input[name=idNos]').val())
                    .success(function (data) {
                        if (data[0].status == 200) {
                            $.post(_url)
                                .success(function (data) {
                                    console.log(data);
                                    var datas = data[0];
                                    if (datas.status === 200 && _b) {
                                        window.location.href = '/pay/' + module + '/' + datas.data.orderNo;
                                    } else {
                                        $ord.formBtn.removeClass('background-gray').on('click', subForm);
                                        $('.tips p').text(datas.message);
                                        $('.mask,.tips').show();                                        
                                    }
                                })
                                .error(function (err) {
                                    $ord.formBtn.removeClass('background-gray').on('click', subForm);
                                    error();
                                });
                        } else {
                            $('.tips p').text(datas.message);
                            $('.mask,.tips').show();
                            $ord.formBtn.removeClass('background-gray').on('click', subForm);
                        }
                    })
                    .error(function (err) {
                        error()
                        $ord.formBtn.removeClass('background-gray').on('click', subForm);
                    })

            }
        }
    }

    // 初始化加減框
    function initNumber(stock, date) {
        var _min = minNum || 1,
            _max = maxNum || false;

        if (!stock || +_min > +stock) {
            $("#numbernum").html('库存不足');
            $ord.formBtn.addClass('background-gray').unbind('click');
        } else {
            if (isRealName === 'T') {
                intiUser(+_min);
            }
            if (module === 'hotel') {
                initOrderList(date, +_min)
            }
            var _dmin = _min,
                _dmax,
                _minx = {
                    min: _dmin,
                    onChange: function (evl, value) {
                        var _value = parseInt(value);
                        if (smz == 0) {
                            return;
                        }
                        if ($("#route-list").length > 0) {
                            routetotalprice();
                        }
                        else {
                            if (isRealName === 'T') {
                                intiUser(+_value);
                            }
                            if (module === 'hotel') {
                                initOrderList(date, _value);
                            }
                            if (module === 'shop') {
                                var _areaCode = $ord.infoAddress.find('select').eq(1).val().split(',')[0];
                                getPostage(_areaCode, _value);
                                addPosttagePrice(_value);
                            }else {
                                totalprice(_value);
                            }
                            
                        }

                    }
                };

            if (_max) {
                _dmax = Math.min(+_max, +stock);
            } else {
                _dmax = stock;
            }
            if (_dmax) {
                _minx.max = _dmax;
            }
            $('input[name=num]').val(_dmin);
            totalprice(_dmin);
            $("#numbernum").html($('<input>', {
                type: 'tel',
                value: _dmin,
                name: 'amount',
                class: 'numbernum'
            })).find('.numbernum').numSpinner(_minx);

            $ord.formBtn.removeClass('background-gray').on('click', subForm);
        }
    }

    function initOrderList(date, num) {
        var _d = '';

        date.map(function (item, index) {
            _d += '<li>' + item.currDate +
                '<span class="fr price">' +
                '<em>￥</em>' +
                '<strong>' + item.currPrice + '</strong>  * ' +
                '<strong>' + num + '</strong>' +
                '</span>' +
                '</li>';
        });
        $('#cost-dialog ul').html(_d);
    }

    // 实名制
    function intiUser(num) {
        var _userDom = '';

        for (var i = 1; i < num; i += 1) {
            _userDom += '<ul class="order-list myorder-list">' +
                '<li>' +
                '<label for="" class="lab-title">游客'+(i+1)+'</label>' +
                '<div class="order-item">' +
                '<input id=linkName' + i + ' type="text" name="linkMans" value="" placeholder="请填写姓名"  class="order-text">' +
                '<i class="font-icon fr icon-iconfont-xie"></i>' +
                '</div>' +
                '</li>' +
                '<li>' +
                '<label for="" class="lab-title">身份证</label>' +
                '<div class="order-item">' +
                '<input id=linkCard' + i + ' type="text" name="idNos" value="" placeholder="请填写身份证" class="order-text card_box">' +
                '<i class="font-icon fr icon-iconfont-xie"></i>' +
                '</div>' +
                '</li>' +
                '</ul><div class="page-line"></div>';
        }
        $('#userAuth').html(_userDom);
    }

    // 交通选择票型
    $('.traffic-select').on('change', function () {
        var _a = $(this).find("option:checked").data('stock');

        initDom(_a);
    });

    // 省市区三级联动
    var _f = false;
    $ord.infoAddress.find('select').on('change', function () {
        domAddress($(this), _f);
        _f = true;
    });
    $ord.infoAddress.on('click', 'option', function () {
        $(this).parent().data('dname', $(this).text());
    });
    $ord.infoAddress.find('select').eq(0).trigger('change');
    function domAddress(th, _f) {
        var _areaCode = _f ? th.val().split(',')[0] : ''
            , _p = _f ? '?parentCode=' + _areaCode : ''
            , _d = _f ? th.next() : th
            , _name = _f ? th.attr('name') : '';


        th.nextAll().html('<option value="">选择</option>');

        $('.address-error').hide();


        $.get('/order/getAdress' + _p)
            .success(function (data) {
                data[0].data.map(function (item, index) {
                    var _o = '<option value="' + item.areaCode + ',' + item.areaName + '">' + item.areaName + '</option>';
                    if (index === 0) {
                        _d.html('<option value="">选择</option>' + _o);
                    } else {
                        _d.append(_o);
                    }
                });
            })
            .error(function (err) {

            });

        //查询邮费信息
        if (_name === 'address2') {
            var _number = $('#numbernum').find('.numbernum').val();
            getPostage(_areaCode, _number)
        }
    }

    function getPostage(areaCode, number) {
        $.get('/order/getPostage?areaCode=' + areaCode + '&modelCode=' + modelCode + '&amount=' + number)
            .success(function (data) {
                if (data[0].status == 200) {
                    console.log(data[0].data);
                    var _string = data[0].data
                        ? '邮费：<em class="c-price">￥</em><i class="c-price">' + data[0].data + '</i>'
                        : '包邮';
                    $ord.expressPrice.html(_string);
                    addPosttagePrice(number)
                }

            })
            .error(function (err) {

            });
    }

    function addPosttagePrice(num) {
        var price=$("#price").text();
        var _expressPrice = parseFloat($ord.expressPrice.find('i').text() || 0);
        var _totalPrice = parseFloat(operation.accMul(price,num).toFixed(2) || 0);
        $ord.totalPrice.html(_expressPrice + _totalPrice)
    }

    function formValidate(goodsWay) {
        validator = $ord.form.validate({
            rules: {
                linkMans: {
                    required: true,
                    maxlength: 8,
                    han: true
                },
                teles: {
                    required: true,
                    isMobile: true
                },
                idNos: {
                    required: isNeedIdcard === 'T',
                    isIdCardNo: true
                },
                street: {
                    required: !goodsWay,
                    isIllegalChar: true,
                    minlength: 2,
                    maxlength: 30,

                },
                address: {
                    required: goodsWay
                }
            }
        });

    }

});




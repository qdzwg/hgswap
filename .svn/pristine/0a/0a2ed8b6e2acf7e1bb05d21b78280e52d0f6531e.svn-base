const async = require('async');
const USERTYPE = 'C'; //用户类型c端
const WXAPPID = 'wx37b45b55a30c1726';
const WXSECRET = 'e7560178d2dcfc37e0c9d14eb8ae9a49';
const WXPAYTYPE = 32; //32:微信公众号支付 34:智游宝微信公众号支付

exports.mainRouter = function (router, common) {
    // 支付确认页面
    router.get('/pay/:module/:orderId', function (req, res, next) {
        var module = req.params.module,
            orderNo = req.params.orderId;
        common.commonRequest({
            url: [{
                urlArr: ['member', 'order', 'detail'],
                parameter: {
                    orderNo: orderNo,
                    leaguerId: req.session.member.id
                }
            }],
            req: req,
            res: res,
            page: 'pay',
            title: '支付确认页',
            callBack: function (results, reObj) {
                reObj.module = module;
                reObj.orderNo = orderNo;
                reObj.is_weixn = common.is_weixn(req);
            }
        });
    });


    // 去支付
    router.get('/pay/:module', function (req, res, next) {
        var module = req.params.module,
            orderNo = req.query.orderNo,
            paySum = req.query.paySum;

        if (common.is_weixn(req)) {
            next();
            return;
        }

        //附加参数
        let params = {
            redirectUrl: "http://" + req.headers.host + "/payPlat/result",
            operateId: req.session.member.id,
            orderInfo: "订单描述信息"
        }

        // 请求支付宝配置
        common.commonRequest({
            url: [{
                urlArr: ['main', 'pay', 'main'],
                parameter: {
                    orderNo: orderNo,
                    userType: USERTYPE,
                    payType: 22, //wap支付宝支付
                    paySum: paySum,
                    extendParamJson: JSON.stringify(params)
                }
            }],
            req: req,
            res: res,
            page: common.is_weixn(req) ? 'pay/wxpay' : 'pay/payAlipay',
            title: '支付宝支付'
        });
    }, function (req, res, next) {
        // 配置微信授权
        res.render('wxlogin', {
            codeUrl: common.getUrl({
                urlArr: ['main', 'wechat', 'Authorization'],
                parameter: {
                    appid: WXAPPID,
                    redirect_uri: encodeURIComponent('http://' + req.headers.host + '/horization/' + req.query.orderNo + '?paySum=' + req.query.paySum),
                    response_type: 'code',
                    scope: 'snsapi_userinfo'
                },
                outApi: true  //外网接口判断 {true:是}
            }) + '#wechat_redirect'
        });
    });

    // 授权access_token
    router.get('/horization/:orderNo', function (req, res, next) {
        req.session.orderNo = req.params.orderNo;
        let paySum = req.query.paySum;
        async.waterfall([
            function (cb) {
                common.commonRequest({
                    url: [{
                        urlArr: ['main', 'wechat', 'accessToken'],
                        parameter: {
                            appid: WXAPPID,
                            secret: WXSECRET,
                            code: req.query.code,
                            grant_type: 'authorization_code'
                        },
                        outApi: true, //外网接口判断 {true:是}
                        noLocal: true
                    }],
                    req: req,
                    res: res,
                    callBack: function (results, reqs, resp, handTag) {
                        handTag.tag = 0;
                        cb(null, results);
                    }
                });
            },
            function (result, cb) {

                //微信支付附加参数
                let params = {
                    openId: result[0].openid,
                    operateId: req.session.member.id,
                    orderInfo: "订单描述信息"
                }

                //发送支付请求
                common.commonRequest({
                    url: [{
                        urlArr: ['main', 'pay', 'main'],
                        parameter: {
                            orderNo: req.params.orderNo,
                            userType: userType,
                            payType: WXPAYTYPE, //微信支付类型
                            paySum: paySum,
                            extendParamJson: JSON.stringify(params)
                        }
                    }],
                    req: req,
                    res: res,
                    callBack: function (results, reqs, resp, handTag) {
                        handTag.tag = 0;
                        cb(null, results);
                    }
                });
            }
        ], function (err, results) {

            if (err) {
                res.redirect('/error');
                return;
            }

            let renderPage = ''
                , itemDatas = null;

            switch (WXPAYTYPE) {
                case 32:
                    renderPage = 'wxpay';
                    itemDatas = JSON.parse(results[0].data);
                    break;
                case 34:
                    renderPage = 'pay/wxpay';
                    itemDatas = results[0].data;
                default:
                    break;
            }
            res.render(renderPage, { item: itemDatas});
        });
    });


    // 支付宝同步回调
    router.get('/payPlat/result', function (req, res, next) {

        // //后台通知(验证)
        // res.render('payResult',{title:'支付结果',data: req.query});
        // for (var key in req.query){
        //     req.query[key] = [req.query[key]];
        // }
        common.commonRequest({
            url: [{
                urlArr: ['main', 'pay', 'result'],
                parameter: {
                    transNo: req.query.out_trade_no
                }
            }],
            req: req,
            res: res,
            page: 'payResult',
            title: '支付结果',
            callBack: function (results, reObj, resp, handTag) {
                reObj.backDetailUrl = req.session.backDetailUrl;
            }
        });
    });

    //微信智游宝支付回调
    router.post('/zybpay/result', function (req, res, next) {
        console.log(req.body)

        common.commonRequest({
            url: [{
                urlArr: ['main', 'wechat', 'wxPayResult'],
                parameter: req.body
            }],
            req: req,
            res: res,
            page: 'payResult',
            title: '支付结果'
        });
    })

    // 微信支付回调
    router.get('/payPlat/Notify/:result', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'order', 'detail'],
                parameter: {
                    orderNo: req.session.orderinfo.orderNo,
                    leaguerId: req.session.member.id
                }
            }],
            req: req,
            res: res,
            page: 'payResult',
            title: '支付结果',
            callBack: function (results, reObj, resp, handTag) {
                if (Number(req.params.result)) {
                    results[0].flag = 'success';
                } else {
                    results[0].flag = 'error';
                }
                reObj.backDetailUrl = req.session.backDetailUrl;
            }
        });
    });
};
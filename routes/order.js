var async = require('async'),
    needle = require('needle');

exports.mainRouter = function (router,common){
    // 订单页面
    router.get('/order/:module/:id',function (req,res,next){
        var module = req.params.module,
            handObj = { rateCode: req.params.id};
        if (module === 'traffic'){
            handObj.begin = req.query.begin;
        }else if (module === 'hotel'){
            handObj.beginDate = req.query.beginDate;
            handObj.endDate = req.query.endDate;
        }else if(module === 'combo'|| module === 'shop'){
            handObj.goodsCode = req.params.id;
            handObj.rateCode = req.query.rateCode;
        }
        if (module === 'ticket' || module === 'combo') {
            handObj.parkId = req.query.parkId || '';
        }
        handObj.corpCode="cgb2cfxs";
        var _o = {'content-type': 'text/html;charset=utf-8',headers: {'access-token':req.session.token||""},timeout: 100000};
        async.waterfall(
            [function(cb){
            var _u=common.gul([module,'order','main']);
            needle.request("get", _u, handObj, _o, function (err,resp,body){
                if (!err && resp.statusCode === 200){
                    var res1 = typeof body === 'string' ? JSON.parse(body) : body;
                    console.log('++++++++++++++++++++++++++++++++++获取详情+++++++++++++++++++++++++++++++++++++');
                    console.log(res1);
                    if (res1.status!=200){
                        switch (item.status) {
                            case 400:
                                _p.req.session.curUrl = _p.originalUrl;
                                _p.res.redirect('/login');
                                break;
                            case 402:
                                console.log("接口 402！");
                                _p.res.redirect('/error');
                                break;
                            case 404:
                                console.log("接口 404！");
                                _p.res.redirect('/error');
                                break;
                            default:
                                _p.res.redirect('/error');
                                break;
                        }
                    }else{
                        cb(null,res1);
                    }
                }else{
                    switch (resp.statusCode){
                        case 404:
                            console.log("接口 404");
                            res.redirect('/error');
                            break;
                        default:
                            res.redirect('/error');
                            break;
                    }
                }
            });
        },function(result,cb){
            var _u= module === 'shop' ? common.gul(['shop','order','getStock']): common.gul(['main','ratecode','stockprices'])
                ,_u1=common.gul(['main','ratecode','ruleBuy']);
            var params = module === 'shop'
                ? {modelCode:result.data.modelCode,corpCode:"cgb2cfxs"}
                : {rateCode:result.data.rateCode,corpCode:"cgb2cfxs"};
            var funArry=[function(callBack){
                needle.request("get", _u,params , _o, function (err,resp,body){
                    if (!err && resp.statusCode === 200){
                        var res2 = typeof body === 'string' ? JSON.parse(body) : body;
                        console.log('++++++++++++++++++++++++++++++++++日历库存+++++++++++++++++++++++++++++++++++++');
                        console.log(res2);
                        if (res2.status!=200){
                            res.redirect('/error');
                        }else{
                            callBack(null,res2);
                        }
                    }else{
                        res.redirect('/error');
                    }
                });
            }];


            if(result.data.ruleBuyCode){
                console.log('++++++++++++++++++++++++++++++++++进入购买规则+++++++++++++++++++++++++++++++++++++');
                console.log('_u1',_u1);
                console.log(result.data);
                funArry.push(function(callBack){
                    needle.request("get",  _u1, {ruleBuyCode:result.data.ruleBuyCode,corpCode:"cgb2cfxs"}, _o, function (err,resp,body){
                        if (!err && resp.statusCode === 200){
                            var res2 = typeof body === 'string' ? JSON.parse(body) : body;
                            console.log('++++++++++++++++++++++++++++++++++购买规则+++++++++++++++++++++++++++++++++++++');
                            console.log(res2);
                            if (res2.status!=200){
                                res.redirect('/error');
                            }else{
                                callBack(null,res2);
                            }
                        }else{
                            res.redirect('/error');
                        }
                    });
                });
            }

            if(module === 'shop'){
                var _u2 = common.gul(['shop','order','listPoint']);
                funArry.push(function(callBack){
                    needle.request("get",  _u2, {modelCode:result.data.modelCode,corpCode:"cgb2cfxs"}, _o, function (err,resp,body){
                        if (!err && resp.statusCode === 200){
                            var res2 = typeof body === 'string' ? JSON.parse(body) : body;
                            console.log('++++++++++++++++++++++++++++++++++获取自提点+++++++++++++++++++++++++++++++++++++');
                            console.log(res2);
                            if (res2.status !== 200 && res2.status !== 402){
                                res.redirect('/error');
                            }else{
                                callBack(null,res2);
                            }
                        }else{
                            res.redirect('/error');
                        }
                    });
                });
            }

            async.parallel(funArry,function(err,results){
                results.splice(0, 0, result);
                cb(null,results);
            });
        }],function(err,results){
            console.log(results);
            var reObj={},userInfo=null;
            reObj.module = module;
            userInfo = req.session.member;
            if (module === 'hotel'){
                reObj.beginDate = req.session.beginDate;
                reObj.endDate = req.session.endDate;
                reObj.numDays = req.session.numDays;
            }else if (module === 'traffic'){
                reObj.begin = req.query.begin;
            }else if (module === 'ticket' || module === 'combo') {
                reObj.parkId = req.query.parkId;
            }
            res.render("order",{title: common.pageTitle(module) + '订单',data:results,reObj:reObj,userInfo:userInfo});
        });
    });

    // 省市区获取
    router.get('/order/getAdress',function (req,res,next){
        common.commonRequest({
            url: [{
                urlArr: ['shop','order','address'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    //获取邮费信息
    router.get('/order/getPostage',function (req,res,next){
        common.commonRequest({
            url: [{
                urlArr: ['shop','order','getPostage'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    // 表单提交
    router.post('/order/:module',function (req,res,next){

        var module = req.params.module,
            parameter = req.query,
            urlArr = module === 'addCart' ? ['cart','list','add'] : ['order','saveOrder'];
        var promoteCode = req.query.promoteCode;
        parameter.promoteCode = promoteCode;
        for (var key in parameter){
            if (Array.isArray(parameter[key])){
                parameter[key] = parameter[key].join(',');
            }
        }

        if (req.query.paramExtension&&req.query.paramExtension == 0){
            var d2 = req.query.address2.split(',')[0] || '',
                d3 = req.query.address3.split(',')[0] || '';

            req.query.paramExtension = 0+',' + d2+',' + d3+',' + req.query.street;
            delete req.query.address;
            delete req.query.address1;
            delete req.query.address2;
            delete req.query.address3;
            delete req.query.street;
        } else if(req.query.paramExtension&&req.query.paramExtension == 1) {
            req.query.paramExtension = 1 +','+ req.query.address;
            delete req.query.address;
            delete req.query.address1;
            delete req.query.address2;
            delete req.query.address3;
            delete req.query.street;
        }
        if(req.session.member){
            parameter.leaguerId=req.session.member.id;
        }
        parameter.busiType = module;
        parameter.accountType = 4;
        console.log(parameter);
        common.commonRequest({
            url: [{

                urlArr: urlArr,
                parameter: parameter
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results,reqs,resp,handTag){
                req.session.orderinfo=results[0].data;
                // var loginId = req.session.member ? req.session.member.id : (req.session.loginId || results[0].datas.id);

                // handTag.tag = 0;
                // req.session.loginId = loginId;
                // res.send(results);
            }
        });
        // async.waterfall([function (cb){
        //     common.commonRequest({
        //         url: [{
        //             urlArr: ['main','login','creat'],
        //             parameter: {mobile: req.query.mobile}
        //         }],
        //         req: req,
        //         res: res,
        //         isAjax: true,
        //         callBack: function (results,reqs,resp,handTag){
        //             var loginId = req.session.member ? req.session.member.id : (req.session.loginId || results[0].datas.id);

        //             handTag.tag = 0;
        //             req.session.loginId = loginId;
        //             cb(null,loginId);
        //         }
        //     });
        // },function (result,cb){
        //     parameter.loginId = result;
        //     common.commonRequest({
        //         url: [{
        //             urlArr: urlArr,
        //             parameter: parameter
        //         }],
        //         req: req,
        //         res: res,
        //         isAjax: true,
        //         callBack: function (results,reqs,resp,handTag){
        //             handTag.tag = 0;
        //             cb(null,results);
        //         }
        //     });
        // }],function (err,results){
        //     res.send(results);
        // });
   
    });

    // 订单详细页
    router.get('/orderDetail/:page',function (req,res,next){
        var page = req.params.page;
        res.render('order/' + page,{data: req.session[page],title:'订单'});
    });
};
var async = require('async'),
    needle = require('needle'),
    querystring = require('querystring'),
    crypto = require('crypto');
    conJson = require('./config_formal.json');

// 私有属性
var private = {
    partner: 'wap',
    key: 'd332326d0b36f9cf66d290363f3b29f6',
    reMd5: function (text) {
        return crypto.createHash('md5').update(text).digest('hex');
    },
    getMethod: function (url) {
        return url.split('/').splice(-1)[0].split('.')[0];
    },
    getUrl: function (url) {
        var config = conJson,
            reUrl = config.domain;
        url.urlArr
            .map(function (item, index) {
                config = config[item];
            });
        url.outApi ? reUrl = config : reUrl += config;
        return reUrl;
    },
    gul: function (url, falg) {
        var reUrl = url;
        if (reUrl) {
            var tagUrl = '';

            for (key in falg) {
                tagUrl += key + '=' + falg[key] + '&'
            }
            return reUrl + '?' + tagUrl;
        } else {
            console.log('In config.json not found the url');
        }
    },
    nowdDate: Date.now(),
    getParam: function (item) {
        // var _t = this,
        //     _o = {
        //         transTime: _t.nowdDate,
        //         partner: _t.partner,
        //         method: item.method || _t.getMethod(_t.getUrl(item)),
        //         bizContent: JSON.stringify(item.parameter || {})
        //     };

        // _o.sign = _t.reMd5(_t.partner + _o.method + _t.nowdDate + _t.key);
        _o = item.parameter || {};
        _o.corpCode = "cgb2cfxs";
        _o.wayType = "2";
        return _o;
    }
};
// 导出属性 
var common = {
    getUrl: function (url) {
        var config = conJson,
            reUrl = null,
            tagUrl = '';

        url.urlArr
            .map(function (item, index) {
                config = reUrl = config[item];
            });
        if (url.parameter) {
            for (key in url.parameter) {
                tagUrl += key + '=' + url.parameter[key] + '&'
            }
            reUrl += '?' + tagUrl.slice(0, -1);
        }

        return reUrl;
    },
    gul: function (url) {
        var config = conJson,
            reUrl = config.domain;

        url.map(function (item, index) {
            config = config[item];
        });
        reUrl += config;
        return reUrl;
    },
    commonRequest: function (_p) {
        // 扩展对象
        var opt = {
            title: '标题',    // 页面标题
            isAjax: false,   // 是否为异步
            callBack: function () { }  // 流程处理完之后的回调
        };
        _p.__proto__ = opt;
        var _a = new Array(),
            _o = { 'content-type': 'text/html;charset=utf-8', headers: { 'access-token': _p.req.session.token || "" }, timeout: 100000 };
        _p.url
            .map(function (item, index) {
                var _u = private.getUrl(item),
                    _d = item.noLocal ? item.parameter : private.getParam(item),
                    method = item.method ? item.method : _p.req.method;
                _a.push(function (cb) {
                    needle.request(method, _u, _d, _o, function (err, resp, body) {
                        console.log(_u);
                        console.log(_d);
                        console.log(_o);
                        console.log(body);
                        if (!err && resp.statusCode === 200) {
                            body = typeof body === 'string' ? JSON.parse(body) : body;
                            if (body&&body.status != 200 && !item.noLocal) {
                                cb('error', body);
                            }
                            else {
                                cb(null, body);
                            }
                        } else {
                            var result = typeof body === 'string' ? JSON.parse(body) : body;
                            if (typeof result === 'object'&&result.status == 400) {
                                cb('error', result);
                            } else {
                                cb('error', body);
                            }
                        }
                    });
                });
            });
        async.parallel(_a, function (err, results) {
            if (err) {
                if (_p.isAjax) {
                    _p.res.send(results);
                } else {
                    if (results.length > 0) {
                        results.map(function (item, index) {
                            if (item.status !== 200) {
                                _p.req.flash('message', item.message ? item.message : '没有数据');
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
                            }
                        });
                    } else {
                        _p.req.flash('message', '没有数据');
                        _p.res.redirect('/error404');
                    }
                }
            } else {
                var reObj = {};
                var handTag = { tag: 1 };

                _p.callBack(results, reObj, _p.res, handTag);

                if (handTag.tag) {
                    if (_p.isAjax) {
                        if (results[0].data && results[0].data.token) {
                            _p.req.session.token = results[0].data.token;
                            needle.request("GET", private.getUrl({ urlArr: ['member', 'info'] }), { leaguerId: results[0].data.leaguerId }, { 'content-type': 'text/html;charset=utf-8', headers: { 'access-token': _p.req.session.token }, timeout: 100000 }, function (err, resp, body) {
                                console.log(body);
                                var result = typeof body === 'string' ? JSON.parse(body) : body;
                                if (result.status == 200) {
                                    _p.req.session.member = result.data;
                                    _p.res.send([{ status: 200 }]);
                                }
                                else {
                                    _p.res.send([result]);
                                }
                            });
                        } else {
                            _p.res.send(results);
                        }
                    } else if (_p.page) {
                        reObj.title = _p.title;
                        reObj.data = results;
                        console.log(reObj);
                        _p.res.render(_p.page, reObj);
                    } else {
                        return false;
                    }
                }
            }
        });
    },
    pageTitle: function (module) {
        var title = "";
        switch (module) {
            case "ticket":
                title = "景区";
                break;
            case "hotel":
                title = "酒店";
                break;
            case "route":
                title = "跟团游";
                break;
            case "combo":
                title = "自由行";
                break;
            case "repast":
                title = "餐饮";
                break;
            case "goods":
                title = "商品";
                break;
            case "raiders":
                title = "攻略";
                break;
            case "guide":
                title = "导游";
                break;
            case "order":
                title = "订单";
                break;
            case "qr":
                title = "门票";
                break;

        }
        return title;
    },
    getModule: function (m) {
        var _r = m;
        switch (m) {
            case 'amuse':
                _r = 'amusement';
                break;
        }
        return _r;
    },
    is_weixn: function (req) {
        var ua = req.headers["user-agent"].toLowerCase();
        return ua.match(/MicroMessenger/i) == "micromessenger";
    }
};

exports.common = common;

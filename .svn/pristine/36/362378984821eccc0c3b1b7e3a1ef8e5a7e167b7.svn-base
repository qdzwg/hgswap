var async = require('async');
var needle = require('needle');

exports.mainRouter = function (router, common) {
    // 首页
    router.get('/',function (req,res,next){
        common.commonRequest({
            url: [{
                urlArr: ['main','index','allInfo'],
                parameter: { modelCode : "wap_index"}
            }],
            req: req,
            res: res,
            page:"test",
            title:"首页",
            callBack: function (results,reqs,resp,handTag){
                indexData = results[0].data
            }
        });
    });

    // 登陆页面
    router.get('/login', function (req, res, next) {
        res.render('login', {title: '登录', redir: req.query.redir || req.session.curUrl || './member'})
    });

    //注册
    router.get('/register', function (req, res, next) {
        res.render('register', {title: '注册', redir: req.session.curUrl || './member'});
    });

    //查看用户协议
    router.get('/register/protocol', function (req, res, next) {
        res.render('member/register/registrationProtocol', {title: '注册协议'});
    });


    // 注册
    router.get('/signIn', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'register'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    //登录
    router.get('/leaguerLogin', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'main'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });
    //手机号快捷登录
    router.get('/phoneNumberLogin', function (req, res, next) {
	req.query.channel = 'LOTSWAP'
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'leaguerMobileLogin'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });


    // 发送验证码
    router.post('/checkCode', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'sendCheckCode'],
                parameter: req.body
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    // 注销用户
    router.get('/loginOut', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'logout']
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {
                req.session.destroy()
            }
        });
    });

    //忘记密码
    router.get('/forgetPassword', function (req, res, next) {
        res.render('pwd1', {title: '忘记密码'});
    });

    //核对验证码是否正确
    router.get('/checkPhoneCode', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'checkPhoneCode'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    //打开重置密码页面
    router.get('/resetPassword', function (req, res, next) {
        res.render('pwd2', {title: '忘记密码',id:req.query.id});
    });

    //设置新密码
    router.get('/setNewPassword', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'resetPwd'],
                parameter: req.query,
                method:"POST"
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    //无密登录
    router.get('/fastregByAccount', function (req, res, next) {
        req.query.channel = 'LOTSWAP';
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'fastregByAccount'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

     //错误处理
    router.get('/error', function (req, res, next) {
        res.render('error', {
            message: req.flash('message').toString()
        })
    });

    router.get('/404', function (req, res) {
        res.render('error404', {
            message: req.flash('message').toString()
        })
    });
};
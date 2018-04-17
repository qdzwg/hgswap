exports.mainRouter = function (router, common) {
    // 列表页
    router.get('/list/:module', function (req, res, next) {
        var module = req.params.module,
            title = common.pageTitle(module) + '列表';
        var businessType  =  module;
        if (module === 'strategy' || module === 'commentList') {
            res.render('list', {
                title: title,
                module: module
            });
            return;
        }
        if (module === 'order') {
            if (!req.session.member) {
                res.redirect('/login');
                return;
            }
            let orderStatus = req.query.orderStatus || '';
            res.render('list', {
                title: title,
                module: module,
                orderStatus: orderStatus
            });
            return;
        }
        common.commonRequest({
            url: [{
                urlArr: ['main', 'search'],
                parameter: { businessType: businessType }
            }, {
                urlArr: ['main', 'sort'],
                parameter: { businessType: businessType }
            }],
            req: req,
            res: res,
            page: 'list',
            title: title,
            callBack: function (results, reObj) {
                reObj.module = module;
                reObj.searchName = req.query.searchName || ''
            }
        });
    });

    // 下拉加载
    router.post('/list/:module', function (req, res, next) {

        let module = req.params.module,
            urlArrm;

        //choice url
        switch (module) {
            case 'order':
                urlArrm = ['member', 'order', 'pagelist'];
                if (req.query.orderStatue) req.session.orderStatus = req.body.orderStatus = req.query.orderStatue;
                req.body.buyerId = req.session.member.id;
                break;
            case 'commentList':
                urlArrm = ['main', 'comment', 'list'];
                break;
            default:
                urlArrm = [module, 'list', 'pagelist'];
                break;
        }

        // Operating parameters
        switch (module){
            case 'combo':
                req.body.wayType = 'wap';
                break;
            case 'hotel':
                req.session.beginDate = req.body.beginDate;
                req.session.endDate = req.body.endDate;
                break;
            case 'strategy':
                req.body.modelCode = module;
                break;
            default:
                break;
        }

        for (key in req.query) {
            req.body[key] = req.query[key];
        }

        common.commonRequest({
            url: [{
                urlArr: urlArrm,
                parameter: req.body,
                method: "get"
            }],
            isAjax: true,
            req: req,
            res: res
        });
    });
};
exports.mainRouter = function (router,common){
    // 详情页
    router.get('/detail/:module/:productCode',function (req,res,next){
        var module = req.params.module,
            productCode = req.params.productCode,
            handArr = [{
                urlArr: ['main','detailimgs'],
                parameter: { modelCode: productCode}
            },{
                urlArr: [module,'detail','main'],
                parameter: { goodsCode: productCode}
            },{
                urlArr: ['main','comment','info'],
                parameter: {
                    modelCode: productCode
                }
            }
        ];

        if(module === 'combo' || module === 'shop'){
            handArr[1].parameter.rateCode = req.query.rateCode
        }
        if(module==="ticket" || module==="repast"){
            handArr.push({
                urlArr: [module,'detail','productItems'],
                parameter: { goodsCode: productCode,corpCode:'cgb2cfxs'}
            });
        }
        if (module === 'strategy' || module === 'rentCar'){        
            handArr = handArr = [{
                urlArr: [module,'detail','main'],
                parameter: {
                    modelCode: productCode
                }
            }
        ];
        }

        if (module === 'qr'){
            req.session.backDetailUrl = req.originalUrl;
            handArr = handArr = [{
                urlArr: ['qr','detail','main'],
                parameter: {
                    currPage:1,
                    pageSize:100,
                    modelCode: productCode
                }
            }
        ];
        }
        
        common.commonRequest({
            url: handArr,
            req: req,
            res: res,
            page: 'detail',
            title: common.pageTitle(module) + '详情',
            callBack: function (results,reObj){
                reObj.module = module;
                reObj.productCode = productCode;
                if (module !== 'guide' && module !== 'strategy' && module !== 'qr' && module !== 'rentCar' ){
                    req.session.location = {
                        location: results[1].data.latitudeLongitude,
                        address: results[1].data.addr
                    };

                    req.session.content = results[1].data.content;
                    req.session.orderNotice = results[1].data.orderNotice;
                    
                    if (module === 'hotel'){
                        reObj.beginDate = req.session.beginDate;
                        reObj.endDate = req.session.endDate;
                    }

                    if (module !== 'hotel'&&module!="combo"&&module!="shop"){
                        req.session.productItems = results[2].data.productItems;
                    }
                }
                if (module === 'qr'){
                    if (results[0].data.rows.length > 0)
                        req.session.orderNotice = results[0].data.rows[0].ydxz; 
                }
            }   
        });
    });

     //房型列表
    router.get('/detail/roomItems',function (req,res,next){
        req.session.beginDate = req.query.beginDate;
        req.session.endDate = req.query.endDate;
        req.session.numDays = req.query.numDays;
        delete req.query.numDays;
        //req.query.corpCode="cgb2cfxs";
        common.commonRequest({
            url: [{
                urlArr: ['hotel','detail','productItems'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results,reObj){
                req.session.productItems = results[0].datas;
            }
        });
    });

    // 相亲详细页
    router.get('/detail/:page',function (req,res,next){
        var page = req.params.page;
        res.render('detail/' + page,{data: page === 'productItems' ? req.session.content : req.session[page],title:'详情'});
    });
};
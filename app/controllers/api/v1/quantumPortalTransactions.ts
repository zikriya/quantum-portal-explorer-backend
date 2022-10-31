module.exports = function (router: any) {

  router.get('/list', asyncMiddleware(async (req: any, res: any) => {

    var filter: any = {};

    if(req.query.sourceAddress && req.query.destinationAddress){
      filter.$or = [
        { 'sourceTransactionInfo.address': { $eq:(req.query.sourceAddress).toLowerCase() } },
        { 'destinationTransactionInfo.address': { $eq:(req.query.destinationAddress).toLowerCase() } }
      ]
    }else if(req.query.sourceAddress){
      filter.$and = [
        {'sourceTransactionInfo.address': { $eq:(req.query.sourceAddress).toLowerCase() } }
      ]
    }else if(req.query.destinationAddress){
      filter.$and = [
        {'destinationTransactionInfo.address': { $eq:(req.query.destinationAddress).toLowerCase() } }
      ]   
    }
    console.log(filter)
    let quantumPortalTransactions = await db.QuantumPortalTransactions.find(filter)
      .sort({ createdAt: -1 })
      .skip(req.query.offset ? parseInt(req.query.offset) : 0)
      .limit(req.query.limit ? parseInt(req.query.limit) : 10)

    return res.http200({
      quantumPortalTransactions: quantumPortalTransactions
    });

  }));

  router.get('/:id', asyncMiddleware(async (req: any, res: any) => {

    var filter: any = {}
    filter._id = req.params.id;

    let quantumPortalTransaction = await db.QuantumPortalTransactions.findOne(filter);

    return res.http200({
      quantumPortalTransaction: quantumPortalTransaction
    });

  }));

  router.post('/', asyncMiddleware(async (req: any, res: any) => {

    var filter: any = {}
    req.body.createdAt = new Date();
    req.body.updatedAt = new Date();
    let quantumPortalTransaction = await db.QuantumPortalTransactions.create(req.body);

    return res.http200({
      quantumPortalTransaction: quantumPortalTransaction
    });

  }));

  router.get('/', asyncMiddleware(async (req: any, res: any) => {
    return res.http200({
      message: 'success'
    });

  }));

  router.delete('/:id', asyncMiddleware(async (req: any, res: any) => {

    var filter: any = {}
    filter._id = req.params.id;

    let quantumPortalTransaction = await db.QuantumPortalTransactions.remove(filter);

    return res.http200({
      quantumPortalTransaction: quantumPortalTransaction
    });

  }));

};


const model = require('../models/model');

// post: localhost:8080/api/categories
async function create_Categories(req, res) {
   const Create = new model.Categories({
    type: 'Expense',
    color: '#C43095'
   }) 

await Create.save(function(err) {
    if(!err) return res.json(Create)
    return res.satatus(400).json({ message: `Error al crear categorias ${err}`})
   })
}

// get: localhost:8080/api/categories
async function get_Categories(req,res) {
   let data = await model.Categories.find({})
   
   let filter = await data.map(value => Object.assign({},{type: value.type, color: value.color}));
   return res.json(filter);
}

// get: localhost:8080/api/transaction
async function create_Transaction(req,res) {
    if(!req.body) return res.status(400).json('Post HTTP Data not Provided');
    let { name,type, amount } = req.body;

    const create = await new model.Transaction(
    {
        name,
        type,
        amount,
        date: new Date()
    }
  );

  create.save(function(err) {
    if(!err)return res.json(create);
    return res.status(400).json({message: `Error al crear una transaction ${err}`})
  });
    
}

// get: localhost:8080/api/transaction
async function get_Transaction(req,res) {
    let data = await model.Transaction.find({});
    return res.json(data);
}

// delete: localhost:8080/api/transaction
async function delete_Transaction(req,res) {
    if(!req.body)res.status(400).json({message: 'Cuerpo de solicitud no encontrado'})
    await model.Transaction.deleteOne(req.body,function(err){
        if(!err)res.json('Registro eliminado...')
    }).clone().catch(function(err){res.json('error al eliminar registro de transacción')})
}

// delete: localhost:8080/api/labels
async function get_Labels(req,res) {

    model.Transaction.aggregate([
        {
            $lookup : {
                from: 'categories',
                localField: 'type',
                foreignField:'type',
                as:'categories_info'
            }
        },
        {
            $unwind: '$categories_info'
        }
    ]).then(result => {
        let data = result.map(value => Object.assign({},{_id: value._id, name: value.name, type: value.type, amount: value. amount, color: value.categories_info['color']}))
        res.json(data);
    }).catch(error => {
        res.status(400).json('Looup Collection Error')
    })

}


module.exports = {
    create_Categories,
    get_Categories,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels
}
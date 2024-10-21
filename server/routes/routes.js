const { Router } = require('express')
const router = Router();
const { getConnectedClient } = require("../db/db");
const { ObjectId } = require('mongodb')

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("todosDB").collection("todos");
    return collection;
}

router.get('/todos', async function(req, res){

    const collection = getCollection();
    const todos =  await collection.find({}).toArray();
    res.status(200).json({
        todos
    })
})
router.post('/todos', async function(req, res){

    const collection = getCollection();
    let {todo} = req.body;

    if(!todo){
        return res.status(400).json({
            msg : "error no todo found"
        })
    }
    todo = (typeof todo === "string") ? todo : JSON.stringify(todo);
    const newTodo = await collection.insertOne({todo, status : false})
    res.status(201).json({
        todo, status : false, _id : newTodo.insertedId
    })
})

router.delete('/todos/:id', async function(req, res) {
    try {
        const collection = getCollection();
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const _id = new ObjectId(id);

        const deletedTodo = await collection.deleteOne({_id});
        res.status(200).json({
            deletedTodo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/todos/:id', async function(req, res) {
    try {
        const collection = getCollection();
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const _id = new ObjectId(id);
        const { status } = req.body;

        if(typeof status !== "boolean"){
            return res.status(400).json({
                msg : "invalid status"
            })
        }       
        const updatedTodo = await collection.updateOne({_id}, { $set: { status: !status } });

        res.status(200).json({
            updatedTodo 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
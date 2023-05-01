const {Router} = require('express');


const todoRouter = Router();

const {TodoModel} = require('../models/todo.model');

todoRouter.post("/add", async(req,res)=>{


    try{

        const todo = new TodoModel(req.body);

        await todo.save();
        res.status(200).send(todo)

    }
    catch(err)
    {
        res.status(400).send({
            "msg":err.message
        })
    }
})

todoRouter.get("/get", async(req,res)=>{

    const {UserID} = req.body;

    let { TaskName, isCompleted, Page, Limit } = req.query;

    try{

        TaskName = new RegExp(TaskName, 'i');

        if(isCompleted)
        {

            const todo = await TodoModel.find({UserId, TaskName, isCompleted}).skip(Limit*(Page-1)).limit(Limit);

            res.status(200).send(todo)


        }

        else
        {
            const todo = await TodoModel.find({UserID, TaskName}).skip(Limit*(Page-1)).limit(Limit);

            res.status(200).send(todo);
        }
    }

    catch(err)
    {
        res.status(400).send({
            "msg":err.message
        })
    }
})

todoRouter.get('/getone/:todoID', async(req,res)=>{

    const {todoID} = req.params

    const UserID = req.body.UserID

    try
    {
        const verifyTodo = await TodoModel.findOne({_id:todoID});

        if(verifyTodo.UserID=== UserID)
        {
            const todo = await TodoModel.findById({_id:todoID});

            res.status(200).send(todo);
        }
        else
        {
            res.status(400).send({"msg": "You can't able to get todo of other user"});
        }
    }
    catch(err)
    {
        res.status(400).send({"err":err.meassage});
    }
})

todoRouter.patch("/update/:todoID", async(req,res)=>{

    const {todoID} = req.params;

    try{
        const verifytodo = await TodoModel.findById({_id:todoID});

        if(verifytodo.UserID=== req.body.UserID)
        {
            await TodoModel.findByIDAndUpdate({_id:todoID},req.body);

            const todo1= await TodoModel.findById({_id:todoID});

            res.status(200).send({
                "msg": `todo ${todo1} has been updated.`
            }
            );
        }
        else
        {
            res.status(400).send({
                "msg":"Unauthorized acess detected. Acess Denied"
            })
        }
    }
    catch(err)
    {
        res.status(400).send({
            "msg":err.message
        })
    }
})

todoRouter.delete("/delete/:todoID", async(req,res)=>{
     const {todoId} = req.params;

     try
     {
        const todo = await TodoModel.findById({_id:todoId});

        if(todo.UserID===req.body.UserID)
        {
            await TodoModel.findByIDAndDelete({_id:todoID});

            res.status(200).send({
                "msg":"Todo has been deleted."
            });
        }
        else
        {
            res.status(400).send({
                "msg" : "Unauthorized acess detected. Acess Denied"
            })
        }
     }

     catch(err)
     {
        res.status(400).send({
            "msg":err.meassage
        })
     }
})

module.exports = {
    todoRouter
}
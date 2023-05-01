const {Router} = require('express');
const userRouter = Router();

const {userModel, UserModel} = require("../models/user.model");

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

require('dotenv').config()

const {Auth} = require('../middleware/auth.middleware')

const {TodoModel} = require('../models/todo.model');


userRouter.post("/register",async (req,res)=>{

    const {Email,Name,Password,Age,Location,Contact}= req.body;

    console.log(req.body);

    bcrypt.hash(Password,6,async(err, hash)=>{

        try{

            const user = new UserModel({Email,Name, Password:hash, Age, Location, Contact})

            await user.save()
            res.status(200).send(user)
        }
        catch(err)
        {
            res.status(400).send({"err":err.message})
        }
    });


    
})

userRouter.post("/login", async(req,res)=>{

    const {Email,Password} = req.body;

    try{
        const user = await UserModel.findOne({Email});
        console.log(user)
        if(user)
        {
            bcrypt.compare(Password, user.Password , (err, result)=>{

                if(!result)
                {
                    res.status(400).send({
                        "msg" : "Invalid Password"
                    })
                }
                else
                {
                    res.status(200).send({
                        "msg":"Login Successfull",
                        "token":jwt.sign({UserId:user._id},process.env.SecretKey, {expiresIn:'60m'})
                        
                    })
                }
            })
        }
        else
        {
            res.status(400).send({
                "msg":"Kindly Register First."
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


userRouter.get('/get',Auth,async(req,res)=>{

    const {UserID}= req.body;

    try
    {
        const user = await UserModel.findOne({_id:UserID});

        if(user)
        {
            res.status(200).send(user);

        }
        else
        {
            res.status(404).send({"msg":"User Not Found"})
        }
    }
    catch(err)
    {
        res.status(400).send(
            {"error":err.message}
        )
    }
})


userRouter.patch('/update',Auth, async(req,res)=>{

    const {UserID} = req.body;

    try
    {
        const verifyUser = await UserModel.findOne({_id:UserId});

        if(verifyUser)
        {
            await UserModel.findByIdAndUpdate({_id:UserID},req.body);

            const user = await UserModel.findOne({_id:UserID});

            res.status(200).send(user);
        }
        else
        {

            res.status(404).send('User Not Found');
        }
    }
    catch(err)
    {
        res.status(400).send({"err":err.message})
    }
})


userRouter.delete('/delete', Auth, async (req,res)=>{

    const {UserID} = req.body;

    try {

        const verifyUser = await UserModel.findOne({_id:UserID});

        if(verifyUser){

            await UserModel.findByIdAndDelete({_id:UserID});

            await TodoModel.deleteMany({UserID});

            res.status(200).send({

                "msg":`${UserID} user has been deleted successfully.`

            });

        }
        else{

            res.status(404).send({
                "msg":"User deosn't exists"
            });

        }

    } 
    
    catch (err) {

        res.status(400).send({"err": err.message})

    }
})



module.exports = {
    userRouter
}
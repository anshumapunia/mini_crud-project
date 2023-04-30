const express = require('express');

const cors = require('cors');

const { connection } = require("./db");

const { Auth } = require('./middleware/auth.middleware');

const { userRouter } = require('./routes/user.routes');

const { todoRouter } = require('./routes/todo.routes');

const app = express();

app.use(express.json());

app.use(cors())

app.use("/user",userRouter);

app.use(Auth);

app.use("/todo",todoRouter);


app.listen(3000, async ()=>{

    try {

        await connection;

        console.log("connected to DB. Server running at 3000");

    } catch (error) {

        console.log(error);

    }

})




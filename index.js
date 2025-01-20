import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors("*"));
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true}));


app.use('/api-v1', routes);

app.use('*', (req,res)=>{
    res.status(404).json({
        success: false,
        message: 'Page not found'
    })
})

try{
    app.listen(PORT, ()=>{
        console.log(`Server started at http://localhost:${PORT}`);
    });
}catch(e){
    console.log("Server error: ", e.message);
}
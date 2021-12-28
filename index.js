import express from "express";


const app = express();
const port = '8000';


app.get('/hello',(req   ,res)=>{
  res.send('Hello world!')
})


app.listen(port,()=>{
    console.log(`Server started at http://localhost:${port}`)
})



//
//
// const server = http.createServer((req, res) => {
//     switch(req.method){
//         case 'GET':
//             switch(req.url){
//                 case '/hello':
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'text/plain');
//                     res.end('hello world!')
//                     break;
//             }
//     }
//     res.statusCode = 200;
//     res.end('badRequest')
//
// });
//
//
// server.listen(port, host, () => {
//     console.log(`Server started at ${host}:${port}`)
// })
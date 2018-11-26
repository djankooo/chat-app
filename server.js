var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
};

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message',{
  name : String,
  message : String
})

var dbUrl = 'mongodb://djankooo:1qaz!QAZ@ds143893.mlab.com:43893/chatapp'

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})


app.get('/messages/:user', (req, res) => {
  var user = req.params.user
  Message.find({name: user},(err, messages)=> {
    res.send(messages);
  })
})


app.post('/messages', async (req, res) => {
  try{
    var message = new Message(req.body);

    var savedMessage = await message.save()
      console.log('saved');

    //var censored = await Message.findOne({message:'badword'});
     // if(censored)
     //   await Message.remove({_id: censored.id})
    //  else
        io.emit('message', req.body);
      res.sendStatus(200);
  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
})



io.on('connection', () =>{
  console.log('a user is connected')
})

//mongoose.connect(dbUrl ,(err) => { // stara wersja 
//  console.log('mongodb connected',err);
//})

mongoose.connect(dbUrl, options).then(                        // nowa wersja
  () => { console.log("Mongoose conected!") },
  err => { console.log("Connecting with Mongoose failed!") }
);                          

var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});
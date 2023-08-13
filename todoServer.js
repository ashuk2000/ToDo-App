/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos

  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123

  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }

  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }

  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const express = require('express');
const fs= require('fs');
const bodyParser = require('body-parser');
const {v4:uuidv4}=require('uuid')
const port = 3000;
const app = express();
const cors=require('cors');
// var taskToId=new Map();
var idToTask=new Map();
 
// loadFromFiles();
// app.use(cors());
app.use(express.static(__dirname + '/frontend'));
app.use(bodyParser.json());


//  function saveToFiles(){

//   const data2=JSON.stringify(Array.from(idToTask.entries()));

//   fs.writeFile('./files/idToTask.txt',data2,(err)=>{
//     if(err){
//     console.error("Error writing the data to the file");
//     return -1;
//     }
//     console.log("File written successfully")
//     return 0;
//   })


// }

async function saveToFiles(){
  try{
    const data=JSON.stringify(Array.from(idToTask.entries()));
    await fs.promises.writeFile('./files/idToTask.txt',data);
    console.log("File written successfully");
    return 0;
  } catch (err){
    console.error("Error writing the data to the file",err);
    return -1;
  }
}


function loadFromFiles(){

  fs.readFile("./files/idToTask.txt",'utf8',(err,filedata)=>{

    if(err){
      console.error("couldn't read the file");
      return;
    }
    if(filedata.trim().length>0){
      idToTask.clear();
      let loadedMap=new Map(JSON.parse(filedata));
      loadedMap.forEach((value,key)=>{
        idToTask.set(key,value);
      })
    }

  })



}

app.delete('/todos/:id',(req,res)=>{
  let id=req.params.id;


  if(idToTask.has(id)){
    let task=idToTask[id];
    idToTask.delete(id);
    // saveToFiles();
    res.send(`Task with id ${id} deleted successfully `);
  }
  else
  {
    res.statusCode=404;
    res.send(`Couldn't find task with id ${id} , to delete`);
  }


});




app.get('/todos/:id',(req,res)=>{
  let id=req.params.id;

  if(idToTask.has(id)){
     res.statusCode=200;
    res.send(idToTask.get(id));
  }
  else{
    res.statusCode=404;
    res.send(`Task Not found for id ${id}`);
  }

});

app.put('/todos/:id',(req,res)=>{
  const id=req.params.id;

  if(idToTask.has(id))
  {
    let task=req.body;
    // let old_task=idToTask.get(id);
    task.id=id;
    idToTask.set(id,task);  
    // saveToFiles();
    res.send('Updated successfully to \n'+JSON.stringify(task));
    console.log(`Updated the task with id ${id}`)
  }

  else{
    res.statusCode=404;
    res.send("Object not found")
  }

});

app.get('/todos',(req,res)=>{

  res.send(Array.from(idToTask.values()));
});


app.post('/todos',(req,res)=>{
  console.log("received post request")
  let todo_task=req.body;
  console.log(todo_task);

  let id=uuidv4();
  todo_task.id=id;

  idToTask.set(id,todo_task);
  res.statusCode=201;

  console.log(idToTask);
  // saveToFiles();

  res.send({
     id:id
  });

})

app.get('/clear',async (req,res)=>{
  console.log("Clearing the cahced data");
  idToTask.clear();
  try{
    // let ret=await saveToFiles();
    // console.log(ret);
    res.send();
  } catch (err){
    console.error(err);
    res.status(500).send();
  }
})


app.listen(port,()=>{
  console.log(`Todo App listening on port ${port}`)
})

module.exports = app;

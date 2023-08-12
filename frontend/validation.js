// const e = require("express");

// const e = require("express");

function validate(){
    let title=document.getElementById('title');
    let description=document.getElementById('description');

    if(title.value.trim()==''  || description.value.trim()=='')
    {
        alert("Title and description must both have values");
        return false;
    }
    return true;
}


function validateUpdate(){
    let id=document.getElementById('taskId');
    let name=document.getElementById('taskName');

    let desc=document.getElementById('taskDesc');

    if(id.value.trim()=='' || name.value.trim()=='' || desc.value.trim()=='' )
    {
        alert("Id,Title and description must both have values");
        return false;
    }
    return true;
}

const updateForm=document.getElementById('updateForm');

updateForm.addEventListener('submit',(event)=>{

    if(!validateUpdate()){
        event.preventDefault();
        return;
    }

    let id=document.getElementById('taskId').value;
    let name=document.getElementById('taskName').value;

    

    let desc=document.getElementById('taskDesc').value;

    const data={
        title: name,
        description: desc
    }

    console.log(`Sending the data ${JSON.stringify(data)}`);

    fetch(`/todos/${id}`,
    {
        method:'PUT',
        body:JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    .then(response => {
        if(response.ok){
         
         return response.text();
        }
        else{
            alert("Network response was not ok , id doesn't exist");
            throw new Error('Network response was not ok');
        }
    })
    .then(response=>{
        console.log("Printing the response");
        alert(response);
    })

    .catch(error=>{
        console.error('Error:',error);
    });

    
 
    

})
const form=document.getElementById('TitleDesc');

form.addEventListener('submit',(event)=>{

    if(!validate()){
        event.preventDefault();
        return;

    }

    event.preventDefault();
   
    // const formData=new FormData(form);
    // console.log("Form data is ")
    // console.log(formData);

    let title=document.getElementById('title').value;
    let description=document.getElementById('description').value;

    const data={
        title: title,
        description: description
    }
    console.log("data sending is")
    console.log(data);

    console.log("Stringified data is")

    console.log(JSON.stringify(data));

    fetch('/todos',
    {
        method:'POST',
        body:JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    .then(response => {
        return response.json();
    })
    .then(received=>{
        showAlert(`Task has been created with id:  ${received.id}`)
    })
    .catch(error=>alert(error))
    
});


const clearButton =document.getElementById('clearButton');

clearButton.addEventListener('click',()=>{
    console.log("Clicked the clear method");
    var xhr=new XMLHttpRequest();
    xhr.open('GET','/clear',true);
    xhr.send();

    xhr.onload=()=>{
        if(xhr.status ===200 ){
            alert("Cleared successfully");
        }
        else
            alert("some kinda error occured on backend while clearing");
    }
})

const deleteButton=document.getElementById('delete');

deleteButton.addEventListener('click',()=>{
    console.log("Clicked the delete button");

    let id=document.getElementById('deleteId').value.trim();
    if(id==='')
        {
            alert("Please enter the id for deletion and try again");
            return;
        }
    var xhr=new XMLHttpRequest();
    xhr.open('DELETE',`/todos/${id}`,true);
    xhr.send();

    xhr.onload=()=>{
        if(xhr.status===200){
            alert("deleted successfully");
        }
        else if(xhr.status==404)
            alert(`The id ${id} not found in the database`);
        else
            alert( `Some problem occured the return code is ${xhr.status}`);
            
    }
})

function printData(){
  fetch("/todos",{
    method:"GET"
  }).then((resp)=>{
    return resp.json()
  })
  .then((data)=>{
    let data_str='';
    for(const ind in data){
        task_str='Title: '+JSON.stringify(data[ind]['title'])+'  Description: '+JSON.stringify(data[ind]['description'])+' Id: '+data[ind]['id'];
        data_str+=task_str+"\n\n";
    }
    if(data_str.trim()=='')
        alert("Todo list is empty!");
    else{
        // alert(data_str);
        showAlert(data_str);
    }
  });
}



function showAlert(alertText) {
    // var alertText = "This is an example alert text.";
    alertText=alertText.replace(/\n/g, "<br>");
    document.getElementById("alertText").innerHTML = alertText;
    document.getElementById("customAlertOverlay").style.display = "block";
    document.getElementById("customAlertBox").style.display = "block";
  }
  
  function copyAlertText() {
    var alertText = document.getElementById("alertText").innerHTML;
    alertText = alertText.replaceAll('<br>', '\n');
    console.log(alertText);
    var tempTextArea = document.createElement("textarea");
    tempTextArea.value=alertText;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
    alert("Alert text copied!");
    hideAlert();
  }




  
  
  function hideAlert() {
    
    document.getElementById("customAlertOverlay").style.display = "none";
    document.getElementById("customAlertBox").style.display = "none";
  }
  
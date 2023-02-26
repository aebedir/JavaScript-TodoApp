"use strict"; 

let gorevlistesi =[];

if(localStorage.getItem("gorevlistesi") !==null){
    gorevlistesi = JSON.parse(localStorage.getItem("gorevlistesi"));
}

let editId;
let isEditTask=false;
let taskInput =document.querySelector("#txtTaskName");
const filters =document.querySelectorAll(".filters span");


displayTasks("all");

function displayTasks(filter){
    let ul=document.getElementById("task-list");
    ul.innerHTML="";

    if(gorevlistesi.length==0){
        ul.innerHTML="<p class='p-3 m-0'>Göreviniz bulunmamaktadır</p>"
    }else{
        for(let gorev of gorevlistesi){

            let completed =gorev.durum =="completed" ? "checked":"";

            if(filter==gorev.durum || filter == "all"){   

                let li =`
                    <li class="task list-group-item d-flex align-items-center justify-content-between">
                        <div class="form-check ">
                            <input type="checkbox" onclick="updateStatus(this)" id="${gorev.id}" class="form-check-input" ${completed}>
                            <label for="${gorev.id}" class="form-check-label ${completed}">${gorev.gorevadi}</label>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-ellipsis"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><button onclick="deleteTask(${gorev.id})" class="dropdown-item" type="button"><i class="fa-solid fa-trash"></i> Sil</button></li>
                                <li><button onclick='editTask(${gorev.id},"${gorev.gorevadi}")' class="dropdown-item" type="button"><i class="fa-solid fa-pen"></i> Düzenle</button></li>
                            </ul>
                        </div>                
                    </li>       
                `;
                ul.insertAdjacentHTML("beforeend",li);
            }
            
        }
    }
    
}



$("#btnAddNewTask").click(function (event) { 
    newTask(event)
});


for(let span of filters){
    $(span).click(function (e) { 
        e.preventDefault();
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active")
        displayTasks(span.id);
    });
}

function newTask(event){
    event.preventDefault(); 
    if(taskInput.value==""){
        document.querySelector(".alert").classList.remove("d-none");
    }else{  
        if(!isEditTask){
            //ekleme
            document.querySelector(".alert").classList.add("d-none");
            gorevlistesi.push({"id":gorevlistesi.length+1,"gorevadi":taskInput.value,"durum":"pending"});
        }else{   
            for(let gorev of gorevlistesi){
                if(gorev.id==editId){
                    gorev.gorevadi=taskInput.value;
                }
            }   isEditTask=false;
            
        } 
        taskInput.value="";            
        displayTasks(document.querySelector("span.active").id);
        localStorage.setItem("gorevlistesi",JSON.stringify(gorevlistesi));
    } 
    
         
}


function deleteTask(id){      
    for(let index in gorevlistesi){
        if(gorevlistesi[index].id==id){
            gorevlistesi.splice(index,1);
        }
    }    
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("gorevlistesi",JSON.stringify(gorevlistesi));
    
}


function editTask(taskId,taskName){
    editId=taskId;
    isEditTask=true;
    taskInput.value=taskName;
    taskInput.focus(); 
}

$("#btnClear").click(function (e) { 
    e.preventDefault();
    gorevlistesi.splice(0,gorevlistesi.length);    
    localStorage.setItem("gorevlistesi",JSON.stringify(gorevlistesi));
    displayTasks();

});



function updateStatus(selectedTask){
    let durum;
    if(selectedTask.checked){
        selectedTask.nextElementSibling.classList.add("checked");
        durum="completed"
    }else{
        selectedTask.nextElementSibling.classList.remove("checked");
        durum="pending"
    }
    for(let gorev of gorevlistesi){
        if(gorev.id==selectedTask.id){
            gorev.durum=durum;
        }
    }

    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("gorevlistesi",JSON.stringify(gorevlistesi));
}
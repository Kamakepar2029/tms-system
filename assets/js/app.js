var main = document.querySelector('.main');
if (localStorage.tasks){
    var tasks = JSON.parse(localStorage.tasks);
}else{
    var tasks = [];
}
var tms = new TMS(tasks);
var tmsElements = [];

const renderApp = function(){
    main.innerHTML = '';
    for (let p in tms.tasks){
        let project = tms.tasks[p];
        let projectElement = new TMSElement(project.type);
        projectElement.createObjectElement(project.name, project.description, project.status, btoa(JSON.stringify({"id": p, "type" : "project" })));
        console.log(projectElement);
        for (let t in project.tasks){
            let task = project.tasks[t];
            let taskElement = new TMSElement(task.type);
            taskElement.createObjectElement(task.name, task.description, task.status, btoa(JSON.stringify({"id": t, "projectid": p, "type": "task"})));
            projectElement.appendObjectElement(taskElement);
            tmsElements[tmsElements.length] = taskElement;
            for (let tt in task.tasks){
                let taskSecond = task.tasks[tt];
                let taskSecondElement = new TMSElement(task.type);
                taskSecondElement.createObjectElement(taskSecond.name, taskSecond.description, taskSecond.status, btoa(JSON.stringify({"id": tt, "taskid": t, "projectid": p, "type" : "task"})), 'task-disabled');
                taskElement.appendObjectElement(taskSecondElement);
                tmsElements[tmsElements.length] = taskSecondElement;
            }
        }
        console.log(projectElement);
        main.append(projectElement.htmlElement);
        tmsElements[tmsElements.length] = projectElement;
    }
    let content = document.querySelectorAll('.content');
    for (let con in content){
        try{
            let cont = content[con];
            if (cont.innerText == ''){
                cont.classList.add('nocontent');
            }
        }catch{
            let y = error;
        }
    }
}

const initializeTaskPopup = function(type, element){
    let attrs = JSON.parse(atob(element.getAttribute('attrs')));
    if (attrs.type == 'task'){
        showCreatePopup(type, attrs);
    }else{
        showCreatePopup(type, attrs);
    }
}

function checkFileAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader();
        return true; 
    } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }
}

function readText(filePath) {
    var output = "";
    if(filePath.files && filePath.files[0]) {
        let reader = new FileReader();           
        reader.onload = function (e) {
            output = e.target.result;
            displayContents(output);
        };
        reader.readAsText(filePath.files[0]);
    }
    else if(ActiveXObject && filePath) {
        try {
            let reader = new ActiveXObject("Scripting.FileSystemObject");
            var file = reader.OpenTextFile(filePath, 1);
            output = file.ReadAll();
            file.Close();
            displayContents(output);
        } catch (e) {
            if (e.number == -2146827859) {
                alert('Unable to access local files due to browser security settings. ' + 
                 'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' + 
                 'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"'); 
            }
        }       
    }
    else {
        return false;
    }       
    return true;
}   

function displayContents(txt) {
    alert('Files successfully received. Data inserted. Page is rerendering...');
    tms.importTasks(txt);
    renderApp();
}

function download(string, filename){
    let dl = document.createElement('a');
    dl.setAttribute('download', filename);
    dl.href="data:text/plain,"+encodeURIComponent(string);
    dl.click();
}

const showCreatePopup = function(type, attributes){
    let titleText = 'Project';
    let nameText = 'Enter project name';
    let descText = 'Enter description of the project';
    if (type == 'task'){
        titleText = 'Create Task';
        nameText = 'Enter task name';
        descText = 'Enter description of the task';
    }
    if (type == 'project'){
        titleText = 'Create Task';
        nameText = 'Enter project name';
        descText = 'Enter description of the project';
    }
    let template = `
        <div class="popup_box">
            <div class="popup_title">${titleText}<div class="gp"><div class="cross closePopup">+</div></div></div>
            <input class="tinput ttitle" placeholder="${nameText}">
            <textarea class="tinput tdescription" placeholder="${descText}"></textarea>
            <select class="teleselect">
                <option value="open">open</option>
                <option value="closed">closed</option>
            </select>
            <buttons>
                <a class="createT">Create</a>
            </buttons>
        </div>`;
    if (document.querySelector('.popup')){
        document.querySelector('.popup').remove();
    }
    let popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = template;
    document.body.append(popup);
    document.querySelector('.closePopup').onclick = function(){
        document.querySelector('.popup').remove();
    }
}

const openBottomBar = function(element){
    let attrs = element.getAttribute('attrs');
    let bot = document.querySelector('.'+attrs).querySelector('.bottombar');
    if (bot.classList.contains('open')){
        bot.classList.remove('open');
    }else{
        bot.classList.add('open');
    }
}

let changeStatus = function(element){
    let attr = JSON.parse(atob(element.getAttribute('attrs')));
    for (let tmEl in tmsElements){
        let tmsElement = tmsElements[tmEl];
        if (tmsElement.attrID == element.getAttribute('attrs')){
            let elm = tmsElement.htmlElement.querySelector('status').innerText;
            let elType = '';
            if (attr.type == 'project'){
                elType = 'project';
            }
            if (attr.type == 'task'){
                if (attr.taskid){
                    elType = 'subtask';
                }else{
                    elType = 'task';
                }
            }
            if (elm == 'open'){
                tmsElement.update('status', 'closed');
                if (elType == 'project'){
                    tms.tasks[attr.id].status = 'closed';
                }
                if (elType == 'task'){
                    tms.tasks[attr.projectid].tasks[attr.id].status = 'closed';
                }
                if (elType == 'subtask'){
                    tms.tasks[attr.projectid].tasks[attr.taskid].tasks[attr.id].status = 'closed';
                }
            }else{
                tmsElement.update('status', 'open');
                if (elType == 'project'){
                    tms.tasks[attr.id].status = 'open';
                }
                if (elType == 'task'){
                    tms.tasks[attr.projectid].tasks[attr.id].status = 'open';
                }
                if (elType == 'subtask'){
                    tms.tasks[attr.projectid].tasks[attr.taskid].tasks[attr.id].status = 'open';
                }
            }
        }
    }
}

const updateLocalStorage = function(){
    localStorage.tasks = JSON.stringify(tms.tasks);
}

setInterval(updateLocalStorage, 1000);

window.onload = renderApp();

document.querySelector('.exportTasks').onclick = function(){
    download(JSON.stringify(tms.tasks), 'export-tasks.json');
}

document.querySelector('.importTasks').onclick = function(){
    let input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('onchange', 'readText(this)');
    input.click();
}
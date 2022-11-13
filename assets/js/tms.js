class TMS{
    constructor(tasks){
        this.tasks = tasks;
    }

    addTask(projectid, name, description, status='open', taskid='none'){
        if (String(taskid) != 'none'){
            let newTask = {
                "name" : name,
                "description" : description,
                "status" : status,
                "tasks" : []
            };
            this.tasks[projectid].tasks[taskid].tasks[this.tasks[projectid].tasks[taskid].tasks.length] = newTask;
        }else{
            let newTask = {
                "name" : name,
                "description" : description,
                "status" : status,
                "tasks" : []
            };
            this.tasks[projectid].tasks[this.tasks[projectid].tasks.length] = newTask;
        }
    }

    deleteTask(projectid, taskdelid, taskid=false){
        if (taskid == false){
            this.task[projectid].tasks.remove(taskdelid);
        }else{
            this.task[projectid].tasks[taskid].tasks.remove()
        }
    }

    importTasks(taskInJson){
        this.tasks = JSON.parse(taskInJson);
    }
}

class TMSElement{
    constructor(type){
        this.type = type;
        this.content = [];
    }

    get createObjectElement(){
        return this.create;
    }

    create(name, description, status, attrs, disabled='non-disabled'){
        this.htmlElement = document.createElement('div'); 
        this.htmlElement.className = (this.type);
        this.htmlElement.classList.add(attrs);
        this.attrID = attrs;
        if (this.type == 'project'){
            let topBar = document.createElement('div');
            topBar.classList.add('topbar');
            topBar.innerHTML = `<div class="topbar_name">${name}</div><space></space><status onclick="changeStatus(this);" attrs="${attrs}">${status}</status><buttons><a class="openBottomBarBtn"  onclick="openBottomBar(this);" attrs="${attrs}">+</a></buttons>`;
            let bottomBar = document.createElement('div');
            bottomBar.classList.add('bottombar');
            bottomBar.innerHTML = `<div class="bottombar_description">${description}</div><div class="content"></div>`;
            this.htmlElement.append(topBar);
            this.htmlElement.append(bottomBar);
        }
        if (this.type == 'task'){
            let topBar = document.createElement('div');
            topBar.classList.add('topbar');
            this.htmlElement.classList.add(attrs.replaceAll('=', ''));
            topBar.innerHTML = `<div class="topbar_name">${name}</div><space></space><status onclick="changeStatus(this);" attrs="${attrs}">${status}</status><buttons><a class="openBottomBarBtn"  onclick="openBottomBar(this);" attrs="${attrs.replaceAll('=', '')}">+</a></buttons>`;
            let bottomBar = document.createElement('div');
            bottomBar.classList.add('bottombar');
            bottomBar.innerHTML = `<div class="bottombar_description">${description}</div><div class="content"></div>`;
            this.htmlElement.append(topBar);
            this.htmlElement.append(bottomBar);
        }
        return this.htmlElement;
    }

    get appendObjectElement(){
        return this.append;
    }

    append(element){
        this.htmlElement.querySelector('.content').append(element.htmlElement);
        this.content[this.content.length] = (element);
    }

    update(attribute, value){
        this.htmlElement.querySelector(attribute).innerHTML = value;
    }
}
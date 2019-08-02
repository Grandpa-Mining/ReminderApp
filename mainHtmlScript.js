const electron = require('electron');
const {ipcRenderer} = electron;
const ul = document.querySelector('ul');
const remote = require('electron').remote;

let isOpen = false;

//Substitute to the windows buttons
document.getElementById("closeApp").addEventListener("click", function(){
    ipcRenderer.send('closeApp:close', true)
});

document.getElementById("minimizeApp").addEventListener("click", function (e) {
    const window = remote.getCurrentWindow();
    window.minimize(); 
});

document.getElementById("maximizeApp").addEventListener("click", function (e) {
    const window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
        window.maximize();          
    } else {
        window.unmaximize();
    }
});


document.getElementById('addReminder').addEventListener('click', function(){
    if (isOpen == false) {
        // this is 'X' button
            document.getElementById('addItem').style.display='block';
            document.getElementById('addReminder').style.transform='rotate(45deg)'
            isOpen = true;
    } else {
        // this is '+' button
            document.getElementById('addItem').style.display='none';
            document.getElementById('addReminder').style.transform='rotate(0deg)'
            isOpen = false;
    }
});

//counts how many reminders are in the "Today" list
setInterval(function(){
    let todayCounter = document.getElementById("todayList").childElementCount - 1;
    document.getElementById('num').innerHTML=todayCounter;
}, 1000);


//TODO: rewrite code
//send item and add it to the main html list
const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e){
    e.preventDefault();
}

//looks if a List in the sidebar is hovered
//Not finished

//Sidebar functionality
const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')

const LOCAL_STORAGE_LIST_KEY = 'reminder.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'reminder.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

listsContainer.addEventListener('click', function(e){
    if (e.target.tagName.toLowerCase() === 'li'){
        selectedListId = e.target.dataset.listId
    }
    saveAndRender()
})

newListForm.addEventListener('submit', function(e){
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName === ''){ return }
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})

function createList(name) {
    return {id: Date.now().toString(), name: name, tasks: []}
}

function saveAndRender(){
    save()
    render()
}

function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
}

function render() {
    ClearElement(listsContainer)
    lists.forEach(list =>{
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add('list-item')
        listElement.innerText = list.name
        if (list.id === selectedListId){
            listElement.classList.add('active-list')
        }
        listsContainer.appendChild(listElement)
    })
}

function ClearElement(element){
    while (element.firstChild){
        element.removeChild(element.firstChild)
    }
}

render()
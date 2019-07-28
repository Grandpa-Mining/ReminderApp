const electron = require('electron');
const {ipcRenderer} = electron;
const ul = document.querySelector('ul');
const remote = require('electron').remote;

let isOpen = false;

ipcRenderer.on('item:add', function(e, item){
    const li = document.createElement('li');
    const itemText = document.createTextNode(item);
    li.appendChild(itemText);
    ul.appendChild(li);
});

//Remove Item
ul.addEventListener('dblclick', removeItem);

function removeItem(e){
    e.target.remove();
}

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


//TODO: rewrite code
//send item and add it to the main html list
const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e){
    e.preventDefault();
    const item = document.querySelector('#item').value;
    ipcRenderer.send('item:add', item)
}
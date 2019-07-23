const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

//SET ENVIROMENT
//process.env.NODE_ENV = 'production';

let mainWindow

// Listen for app to be ready (mainWindow)
app.on("ready", function(){
    //create new window
    mainWindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration: true
        },
        frame: false,
        icon: path.join(__dirname, 'img/icons/appIcon.png'),//change later
        width: 900
    });
    // Load HTML into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol:'file:',
        slashes: true
    }));
    //Quit app when closed
    mainWindow.on("closed", function(){
        app.quit();
    })

    //Build menu from template
    const topMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(topMenu)
});

//Add To-do window function
function createAddWindow(){
    AddWindow = new BrowserWindow({
        height: 100,
        width: 340,
        title: 'Add a To-Do',
        webPreferences: {nodeIntegration: true}
    });
    AddWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'createToDo.html'),
        protocol: 'file:',
        slashes: true
    }));
    //Window stays open in the background, to optimize I set the window to null after it gets closed
    AddWindow.on('close', function(){
        AddWindow = null;
    })
}

//catch item:add
ipcMain.on('item:add',function(e, item){
    console.log(item)
    mainWindow.webContents.send('item:add', item);
    AddWindow.close();
});

//New 'X' button on mainWindow (close)
ipcMain.on('closeApp:close', function(){
    app.quit();
});

//New minimize Button '-'
ipcMain.on('minimizeApp:minimize', function(){
    console.log('123');
});


// New top menu template (edit, view, ect.)
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                accelerator: 'Shift+Enter',
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q', //shortcut to quit, checks if the app is running on win32 or on darwin(MacOS)
                click(){
                    app.quit();
                }
            }
        ]
    }
]

//empty object if on a mac
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

//Add developer tools if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+Shift+I' : 'Ctrl+Shift+I', //shortcut to quit, checks if the app is running on win32 or on darwin(MacOS)
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}
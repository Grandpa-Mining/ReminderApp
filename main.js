const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain, remote} = electron;

//SET ENVIROMENT
//process.env.NODE_ENV = 'production';

let mainWindow

// Listen for app to be ready (mainWindow)
app.on("ready", function(){
    //create new window
    mainWindow = new BrowserWindow({
        webPreferences:{ nodeIntegration: true },
        backgroundColor: '#1f1f1f',
        frame: false,
        icon: path.join(__dirname, 'img/icons/appIconLight.png'),//change later
        width: 900,
        'minHeight': 500,
        'minWidth': 720
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

//catch item:add
ipcMain.on('item:add',function(e, item){
    console.log(item)
    mainWindow.webContents.send('item:add', item);
});
//catch addWindow:open
ipcMain.on('addWindow:open', function(){
    console.log('opened AddWindow')
    createAddWindow(); //calls the function in order to open the addWindow.
});

//New 'X' button on mainWindow (close)
ipcMain.on('closeApp:close', function(){
    app.quit();
});

//New minimize Button '-'
ipcMain.on('minimizeApp:minimize', function(){
    console.log('123');
});


// New top menu template (edit, view, ect.) (we used it for shortcuts)
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
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
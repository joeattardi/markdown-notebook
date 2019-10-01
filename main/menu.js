const path = require('path');
const { app, ipcMain, Menu } = require('electron');

const openAboutWindow = require('electron-about-window').default;

let menu;
let menuTemplate;

exports.buildApplicationMenu = function() {
  menuTemplate = [
    {
      label: app.getName(),
      submenu: [
        {
          label: 'About Markdown Notebook',
          click: showAbout
        },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'New Notebook',
          accelerator: 'CommandOrControl+Shift+N',
          click: newNotebook
        },
        {
          label: 'New Note',
          accelerator: 'CommandOrControl+N',
          click: newNote
        },
        { type: 'separator' },
        {
          label: 'Edit Note',
          accelerator: 'CommandOrControl+E',
          id: 'toggleEdit',
          click: toggleEdit
        },
        {
          label: 'Rename Notebook',
          accelerator: 'CommandOrControl+Shift+R',
          click: renameNotebook
        },
        { type: 'separator' },
        {
          label: 'Delete Notebook',
          accelerator: 'CommandOrControl+Shift+Backspace',
          click: deleteNotebook
        },
        {
          label: 'Delete Note',
          accelerator: 'CommandOrControl+Backspace',
          click: deleteNote
        }
      ],
    },
    { role: 'editMenu' },
    {
      label: 'View',
      submenu: [
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    { role: 'windowMenu' },
    {
      label: 'Help',
      submenu: [
        { role: 'toggledevtools' }
      ]
    }
  ];

  menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

function showAbout(menuItem, browserWindow, event) {
  openAboutWindow({
    icon_path: path.resolve(__dirname, '..', 'icons', 'note.png'),
    homepage: 'https://github.com/joeattardi/markdown-notebook',
    copyright: 'Copyright (c) 2019 Joe Attardi',
    use_version_info: false,
    bug_report_url: 'https://github.com/joeattardi/markdown-notebook/issues',
    bug_link_text: 'Found a bug?'
  });
}

function newNotebook(menuItem, browserWindow, event) {
  browserWindow.webContents.send('menu:createNotebook');
}

function newNote(menuItem, browserWindow, event) {
  browserWindow.webContents.send('menu:createNote');
}

function deleteNote(menuItem, browserWindow, event) {
  browserWindow.webContents.send('menu:deleteNote');
}

function deleteNotebook(menuItem, browserWindow, event) {
  browserWindow.webContents.send('menu:deleteNotebook');
}

function toggleEdit(menuItem, browserWindow, event) {
  browserWindow.webContents.send('menu:toggleEdit');
}

function renameNotebook(menuItem, browserWindow, event) {
  browserWindow.webContents.send('menu:renameNotebook');
}

ipcMain.on('isEditing', (event, isEditing) => {
  menuTemplate[1].submenu[3].label = isEditing ? 'Exit Edit Mode' : 'Edit Note';
  menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
});

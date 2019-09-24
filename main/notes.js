const fs = require('fs');
const path = require('path');

const { app, ipcMain } = require('electron');
const frontmatter = require('front-matter');
const slugify = require('slugify');

const NOTE_DIRECTORY = path.resolve(app.getPath('home'), 'markdown-notebook');

function getNotebooks() {
  return fs.readdirSync(NOTE_DIRECTORY).map(name => ({
    name,
    id: slugify(name)
  }));
};

function getNotes(notebook) {
  return fs.readdirSync(path.resolve(NOTE_DIRECTORY, notebook)).map(name => {
    const fileContent = fs.readFileSync(path.resolve(NOTE_DIRECTORY, notebook, name), 'UTF-8');
    const metadata = frontmatter(fileContent).attributes;

    return {
      id: slugify(name),
      title: metadata.title
    };
  });
}

ipcMain.on('getNotebooks', event => {
  event.sender.send('notebooks', getNotebooks());
});

ipcMain.on('getNotes', (event, notebook) => {
  event.sender.send('notes', getNotes(notebook));
});

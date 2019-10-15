const debug = require('debug')('markdown-notebook:notes');
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

const { dialog, ipcMain } = require('electron');
const fileUrl = require('file-url');
const slugify = require('slugify');
const uuid = require('uuid/v1');

const { NOTE_DIRECTORY } = require('./config');
const frontmatter = require('./frontMatter');

const NEW_NOTE_NAME = 'New Note';
const NEW_NOTEBOOK_NAME = 'New Notebook';

function deleteNote(noteFilename) {
  debug(`Deleting note: ${noteFilename}`);
  fs.unlinkSync(noteFilename);
}

function renameNotebook(notebook, newName) {
  debug(`Renaming notebook "${notebook}" to "${newName}"`);
  fs.renameSync(path.resolve(NOTE_DIRECTORY, notebook), path.resolve(NOTE_DIRECTORY, newName));
}

function deleteNotebook(notebook) {
  const notebookPath = path.resolve(NOTE_DIRECTORY, notebook);

  fs.readdirSync(notebookPath).forEach(note => fs.unlinkSync(path.resolve(notebookPath, note)));
  fs.rmdirSync(notebookPath);
}

function getNewNotebookName() {
  let counter = 1;
  let name = NEW_NOTEBOOK_NAME;

  while (fs.existsSync(path.resolve(NOTE_DIRECTORY, name))) {
    name = `${NEW_NOTEBOOK_NAME} ${counter++}`;
  }

  return name;
}

function createNotebook() {
  debug('Creating new notebook');

  const name = getNewNotebookName();
  fs.mkdirSync(path.resolve(NOTE_DIRECTORY, name));

  return {
    name,
    id: slugify(name),
    count: 0
  };
}

function getNewNoteName(notebook) {
  let counter = 1;
  let name = NEW_NOTE_NAME;
  let filename = slugify(name).toLowerCase() + '.md';

  while (fs.existsSync(path.resolve(NOTE_DIRECTORY, notebook, filename))) {
    name = `${NEW_NOTE_NAME} ${counter++}`;
    filename = slugify(name).toLowerCase() + '.md';
  }

  return name;
}

function createNote(notebook) {
  debug(`Creating new note in notebook: ${notebook}`);

  const newNoteName = getNewNoteName(notebook);
  const newNoteSlug = slugify(newNoteName).toLowerCase();
  const newNoteFilename = path.resolve(NOTE_DIRECTORY, notebook, newNoteSlug + '.md');

  const note = {
    title: newNoteName,
    filename: newNoteFilename,
    content: ''
  }

  saveNote(note);

  return {
    title: note.title,
    id: newNoteSlug,
    filename: note.filename
  };
}

function getNotebooks() {
  debug(`Getting notebooks in directory: ${NOTE_DIRECTORY}`);
  return fs.readdirSync(NOTE_DIRECTORY).map(name => ({
    name,
    id: slugify(name),
    count: getNoteCount(name)
  }));
};

function getNoteCount(notebook) {
  debug(`Getting note count for notebook: ${notebook}`);
  return fs.readdirSync(path.resolve(NOTE_DIRECTORY, notebook)).length;
}

async function getNotes(notebook) {
  debug(`Getting notes for notebook: ${notebook}`);
  const noteFiles = await fs.readdir(path.resolve(NOTE_DIRECTORY, notebook));
  const notes = await Promise.all(noteFiles.map(filename => getNoteData(notebook, filename)));
  notes.sort((a, b) => a.title.localeCompare(b.title));
  return notes;
}

function getNote(filename) {
  debug(`Loading note ${filename}`);
  const content = fs.readFileSync(filename, 'utf8');
  const noteData = frontmatter.parseFrontMatter(content);

  return {
    filename,
    ...noteData.attributes,
    content: noteData.body
  };
}

function getUniqueFilename(notebook, baseName) {
  debug(`Finding unique filename for: ${baseName}`);
  let counter = 1;
  let name = baseName;
  let filename = path.resolve(NOTE_DIRECTORY, notebook, slugify(name).toLowerCase() + '.md');

  while (fs.existsSync(filename)) {
    name = `${baseName} ${counter++}`;
    filename = path.resolve(NOTE_DIRECTORY, notebook, slugify(name).toLowerCase() + '.md');
  }

  return filename;
}

function renameNote(notebook, note, newName) {
  debug(`Renaming note "${note.title} in notebook "${notebook}" to "${newName}"`);

  const newNote = {
    title: newName,
    filename: getUniqueFilename(notebook, newName || 'Untitled'),
    content: note.content
  };
  
  fs.renameSync(note.filename, newNote.filename);
  saveNote(newNote);

  return newNote.filename;
}

function saveNote(note) {
  debug(`Saving note "${note.title}" to ${note.filename}`);
  let content = frontmatter.createFrontMatter({
    title: note.title
  });

  fs.writeFileSync(note.filename, content + note.content);
}

function getNoteData(notebook, filename) {
  debug(`Getting note data for ${notebook}/${filename}`);
  return new Promise((resolve, reject) => {
    const reader = readline.createInterface({
      input: fs.createReadStream(path.resolve(NOTE_DIRECTORY, notebook, filename))
    });

    const slug = slugify(filename.slice(0, -3));
    let foundStart = false;
    let content = '';
    let header = {
      filename: path.resolve(NOTE_DIRECTORY, notebook, filename)
    };

    reader.on('line', line => {
      content += `${line}\n`;
      if (line === '---') {
        if (!foundStart) {
          debug('Found start delimiter');
          foundStart = true;
        } else {
          debug('Found end delimiter');
          header = {
            ...header,
            ...frontmatter.parseFrontMatter(content).attributes
          };
          debug(`Got data for note: ${header.title}`);
          reader.close();
        }
      }
    });

    reader.on('close', () => {
      resolve({
        id: slug,
        ...header
      });
    });
  });
}

function insertImage(notebook, imagePath) {
  const dest = path.resolve(NOTE_DIRECTORY, notebook, uuid() + path.extname(imagePath));
  fs.copyFileSync(imagePath, dest);

  return {
    url: fileUrl(dest),
    alt: path.basename(imagePath)
  };
}

ipcMain.on('getNotebooks', event => {
  try {
    event.sender.send('notebooks', null, getNotebooks());
  } catch (error) {
    event.sender.send('notebooks', { message: error.message }, null);
  }
});

ipcMain.on('getNotes', async (event, notebook) => {
  try {
    event.sender.send('notes', null, await getNotes(notebook));
  } catch (error) {
    event.sender.send('notes', { message: error.message }, null);
  }
});

ipcMain.on('getNote', (event, filename) => {
  try {
    event.sender.send('note', null, getNote(filename));
  } catch (error) {
    event.sender.send('notes', { message: error.message }, null);
  }
});

ipcMain.on('saveNote', (event, note) => {
  try {
    saveNote(note);
    event.sender.send('noteSaved');
  } catch (error) {
    event.sender.send('noteSaved', { message: error.message });
  }
});

ipcMain.on('createNote', (event, notebook) => {
  try {
    event.sender.send('noteCreated', null, createNote(notebook));
  } catch (error) {
    event.sender.send('noteCreated', { message: error.message }, null);
  }
});

ipcMain.on('deleteNote', (event, noteFilename) => {
  try {
    deleteNote(noteFilename);
    event.sender.send('noteDeleted');
  } catch (error) {
    event.sender.send('noteDeleted', { message: error.message });
  }
});

ipcMain.on('createNotebook', event => {
  try {
    event.sender.send('notebookCreated', null, createNotebook()); 
  } catch (error) {
    event.sender.send('notebookCreated', { message: error.message }, null);
  }
});

ipcMain.on('deleteNotebook', (event, notebook) => {
  try {
    deleteNotebook(notebook);
    event.sender.send('notebookDeleted');
  } catch (error) {
    event.sender.send('notebookDeleted', { message: error.message });
  }
});

ipcMain.on('renameNotebook', (event, notebook, newName) => {
  try {
    renameNotebook(notebook, newName);
    event.sender.send('notebookRenamed');
  } catch (error) {
    event.sender.send('notebookRenamed', { message: error.message });
  }
});

ipcMain.on('renameNote', (event, notebook, note, newName) => {
  try {
    event.sender.send('noteRenamed', null, renameNote(notebook, note, newName));
  } catch (error) {
    event.sender.send('noteRenamed', { message: error.message });
  }
});

ipcMain.on('insertImage', (event, notebook, imagePath) => {
  try {
    event.sender.send('imageInserted', null, insertImage(notebook, imagePath));
  } catch (error) {
    event.sender.send('imageInserted', { message: error.message });
  }
});

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
  fs.renameSync(
    path.resolve(NOTE_DIRECTORY, notebook),
    path.resolve(NOTE_DIRECTORY, newName)
  );
}

function deleteNotebook(notebook) {
  const notebookPath = path.resolve(NOTE_DIRECTORY, notebook);

  fs.readdirSync(notebookPath).forEach(note =>
    fs.unlinkSync(path.resolve(notebookPath, note))
  );
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
  const newNoteFilename = path.resolve(
    NOTE_DIRECTORY,
    notebook,
    newNoteSlug + '.md'
  );

  const note = {
    title: newNoteName,
    filename: newNoteFilename,
    content: ''
  };

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
}

function getNoteCount(notebook) {
  debug(`Getting note count for notebook: ${notebook}`);
  return fs
    .readdirSync(path.resolve(NOTE_DIRECTORY, notebook))
    .filter(filename => path.extname(filename) === '.md').length;
}

async function getNotes(notebook) {
  debug(`Getting notes for notebook: ${notebook}`);
  const noteFiles = await fs.readdir(path.resolve(NOTE_DIRECTORY, notebook));
  const notes = await Promise.all(
    noteFiles
      .filter(filename => path.extname(filename) === '.md')
      .map(filename => getNoteData(notebook, filename))
  );
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
  let filename = path.resolve(
    NOTE_DIRECTORY,
    notebook,
    slugify(name).toLowerCase() + '.md'
  );

  while (fs.existsSync(filename)) {
    name = `${baseName} ${counter++}`;
    filename = path.resolve(
      NOTE_DIRECTORY,
      notebook,
      slugify(name).toLowerCase() + '.md'
    );
  }

  return filename;
}

function renameNote(notebook, note, newName) {
  debug(
    `Renaming note "${note.title} in notebook "${notebook}" to "${newName}"`
  );

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
      input: fs.createReadStream(
        path.resolve(NOTE_DIRECTORY, notebook, filename)
      )
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
  const dest = path.resolve(
    NOTE_DIRECTORY,
    notebook,
    uuid() + path.extname(imagePath)
  );
  fs.copyFileSync(imagePath, dest);

  return {
    url: fileUrl(dest),
    alt: path.basename(imagePath)
  };
}

ipcMain.handle('getNotebooks', () => {
  return getNotebooks();
});

ipcMain.handle('getNotes', async (event, notebook) => {
  return await getNotes(notebook);
});

ipcMain.handle('getNote', (event, filename) => {
  return getNote(filename);
});

ipcMain.handle('saveNote', (event, note) => {
  saveNote(note);
});

ipcMain.handle('createNote', (event, notebook) => {
  return createNote(notebook);
});

ipcMain.handle('deleteNote', (event, noteFilename) => {
  deleteNote(noteFilename);
});

ipcMain.handle('createNotebook', () => {
  return createNotebook();
});

ipcMain.handle('deleteNotebook', (event, notebook) => {
  deleteNotebook(notebook);
});

ipcMain.handle('renameNotebook', (event, notebook, newName) => {
  renameNotebook(notebook, newName);
});

ipcMain.handle('renameNote', (event, notebook, note, newName) => {
  return renameNote(notebook, note, newName);
});

ipcMain.handle('insertImage', (event, notebook, imagePath) => {
  return insertImage(notebook, imagePath);
});

const debug = require('debug')('markdown-notebook:notes');
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

const { app, ipcMain } = require('electron');
const frontmatter = require('front-matter');
const slugify = require('slugify');

const NOTE_DIRECTORY = path.resolve(app.getPath('home'), 'markdown-notebook');

function getNotebooks() {
  debug(`Getting notebooks in directory: ${NOTE_DIRECTORY}`);
  return fs.readdirSync(NOTE_DIRECTORY).map(name => ({
    name,
    id: slugify(name)
  }));
};

async function getNotes(notebook) {
  debug(`Getting notes for notebook: ${notebook}`);
  const noteFiles = await fs.readdir(path.resolve(NOTE_DIRECTORY, notebook));
  const notes = await Promise.all(noteFiles.map(filename => getNoteData(notebook, filename)));
  return notes;
}

function getNote(filename) {
  debug(`Loading note ${filename}`);
  const content = fs.readFileSync(filename, 'utf8');
  return frontmatter(content).body;
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
            ...frontmatter(content).attributes
          };
          debug(`Got data for note: ${header.title}`);
          reader.close();
        }
      }
    });

    reader.on('close', () => {
      if (!header) {
        debug(`Didn't find any front matter for ${filename}, using ${slug}`);
        header = {
          ...header,
          title: slug
        }
      }
      resolve({
        id: slug,
        ...header
      });
    });
  });
}

ipcMain.on('getNotebooks', event => {
  event.sender.send('notebooks', getNotebooks());
});

ipcMain.on('getNotes', async (event, notebook) => {
  event.sender.send('notes', await getNotes(notebook));
});

ipcMain.on('getNote', (event, filename) => {
  event.sender.send('note', getNote(filename));
});

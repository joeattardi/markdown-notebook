const path = require('path');

const { app } = require('electron');

const DATA_DIRECTORY = path.resolve(app.getPath('home'), 'markdown-notebook');
const NOTE_DIRECTORY = path.resolve(DATA_DIRECTORY, 'notes');

module.exports = {
  DATA_DIRECTORY,
  NOTE_DIRECTORY
};

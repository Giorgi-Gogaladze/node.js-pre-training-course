// Express.js static files serving for ToDo frontend
// TODO: implement
const express = require('express');
const path = require('path');

const staticHandler = express.static(path.join(__dirname, 'public'));

module.exports = staticHandler; 
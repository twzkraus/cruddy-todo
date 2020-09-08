const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId((err, id) => {
    if (err) {
      throw new Error();
    } else {
      items[id] = text;
      let thisPath = path.join(__dirname, '..', 'test', 'testData', `${id}.txt`);
      fs.writeFile(thisPath, items[id], (err) => {
        if (err) {
          throw new Error('error writing file');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  // need to return an array of todos to client app whenever a get request to the collection route occurs
  // items come from the target folder
  // once you get to target folder, use map:
  let thisPath = path.join(__dirname, '..', 'test', 'testData');
  fs.readdir(thisPath, (err, items) => {
    var data = _.map(items, (text, id) => {
      return { id, text };
    });
    callback(null, data);
    /* BAD RABBIT HOLE VERSION:
    fs.readFile(path.join(__dirname, '..', 'test', 'testData', text), (err, bodyText) => {
      let elementBodyText = bodyText.toString();
      data.push({ id, text: elementBodyText });
      if (items.length === 0 || id === items.length - 1) {
        callback(null, data);
      }
    });
  });
  if (!items.length) {
    callback(null, data);
  }
  */
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(__dirname, '..', 'test', 'testData', `${id}.txt`), (err, text) => {
    if (!text) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: text.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      return callback(err);
    }
    let thisPath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(thisPath, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  // need to return an array of todos to client app whenever a get request to the collection route occurs
  // items come from the target folder
  // once you get to target folder, use map:
  fs.readdir(exports.dataDir, (err, items) => {
    if (err) {
      return callback(err);
    }

    let data = [];
    items.forEach((fileName, id) => {

      fs.readFile(path.join(exports.dataDir, fileName), (err, bodyText) => {
        let elementBodyText = bodyText.toString();
        data.push({ id, text: elementBodyText });
        if (id === items.length - 1) {
          callback(null, data);
        }
      });
    });

    if (!items.length) {
      callback(null, data);
    }

  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(__dirname, '..', 'test', 'testData', `${id}.txt`), (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: text.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readdir(exports.dataDir, (err, items) => {
    if (items.indexOf(`${id}.txt`) < 0) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

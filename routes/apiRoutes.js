const fs = require('fs');
const notes = require('express').Router();
const {v4: uuidv4} = require('uuid');
const { readFromFile, readAndAppend, writeToFile, } = require('../helpers/util');


notes.get('/', (req, res) => {
    fs.readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.get('/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
        const result = json.filter((note) => note.id === noteId);
        return result.length > 0 
        ? res.json(result)
        : res.json('no note with that ID!');
    });
});

notes.delete('/:id', (req, res) => {
    console.log(req.params)
    const noteId = req.params.id;
    readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
        console.log(json)
        const result = json.filter((note) => note.id !== noteId);

    writeToFile('./db/db.json', result);
    res.json(`Item ${noteId} has been deleted`);
    });
});

notes.post('/', (req, res) => {
    console.log(req.body)
    const {title, text} = req.body;
    if(req.body) {
        const newNote = {
            title,
            text,
            id : uuidv4(),
        };
        readAndAppend(newNote, './db/db.json');
        res.json('note added succesfully');
    } else {
        res.error('error adding note');
    }
});


module.exports = notes;

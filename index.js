//Defining the constants for the use of express library
const express = require('express')
const app = express()

//Creating an array containing the data of 4 contacts.
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "0100 23569034"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345",
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
    }
]

/*Creating and displaying a json response for url 
"http://localhost:3001/api/persons" containing the data of persons array. */
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

const PORT = 3001
app.listen(PORT)

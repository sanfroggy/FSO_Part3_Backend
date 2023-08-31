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

/*Creating and displaying a json response for showing the
data of a single. Also returning a 404 "Not found" status code
if a person with the given id does not exists. */
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

/*Creating and displaying a response for url 
"http://localhost:3001/info" containing the number of entries
in the person array and the current date and time. */
app.get('/info', (req, res) => {
    let timestring = res.get('Date')
    res.send(`Phonebook contains info for ${persons.length} people. </br></br>
${Date()}`)
})

/*Defining a request url for deleting the data of a person.
Responding with a status code 204 "No content" as no data is required
to be sent with the response. */
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT)

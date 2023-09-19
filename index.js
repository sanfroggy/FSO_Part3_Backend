//Defining dotenv and the constants for the use of Express, cors, Morgan and Contact model
require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const app = express()
const Contact = require('./models/contact')

/*Creating a token to add the request body to the logged message,
if the request is of type POST. */
morgan.token('body', (req) => {
    if (req.method === "POST") {
        return JSON.stringify(req.body)
    } else {
        return null
    }
})

/*Defining the use of the express json parser, cors middleware, express static middleware
and morgan with custom log message format. */
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/*Defining a post request url: "/api/persons" 
for adding person data. Getting the required parameters from
the request body. Adding the created person to the MongoDB
database and displaying it's data in the response. */
app.post('/api/persons', (req, res) => {
    const body = req.body

    /*Checking if the request body has data for the name and number
    and returning a status code of 400 "Bad request" if data is missing. */
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Name or number is missing.'
        })
    } else {
        const person = new Contact({
            name: body.name,
            number: body.number
        })
        person.save().then(savedPerson => {
            res.json(savedPerson)
        })         
    }
})

/*Creating and displaying a json response for url "api/persons" 
containing the data stored in MongoDB. */
app.get('/api/persons', (req, res) => {
    Contact.find({}).then(contacts => {
        res.json(contacts)
    })
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

/*Creating and displaying a response containing the number of entries
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

/*Define the port for the backend. Either the one defined in enviromental
variable PORT. */
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

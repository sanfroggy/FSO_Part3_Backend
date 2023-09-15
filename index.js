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

/*Creating a function to return a random number between
0 and 10000 */
const getRandomId = () => {
    return Math.floor(Math.random() * 10000);
}

/*Defining the use of the express json parser, cors middleware, express static middleware
and morgan with custom log message format. */
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/*Defining a request url: "http://localhost:3001/api/persons" 
for adding person data. Getting the required parameters from
the request body and id from the getRandomId function.
Adding the created person object to the array and displaying it. */
app.post('/api/persons', (req, res) => {
    const body = req.body

    /*Checking if the request body has data for the name and number
    and returning a status code of 400 "Bad request" if data is missing. */
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Name or number is missing.'
        })
    } else {

        /*Checking if the name given in the request body already exists in the 
        persons array and returning a status code of 400 "Bad request" if it does. */
        if (persons.some(person => person.name === body.name)) {
            return res.status(400).json({
                error: 'Name already exists in the phonebook.'
            })
        } else {
            const person = {
                id: getRandomId(),
                name: body.name,
                number: body.number
            }
            persons = persons.concat(person)
            res.json(person)
        }
    }
})

/*Creating and displaying a json response containing the data of persons array. */
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

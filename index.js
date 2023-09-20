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

/*Defining the use of the express json parser, cors middleware, express static middleware, morgan 
with custom log message format. */
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/*Defining a post request url: "/api/persons" 
for adding person data. Getting the required parameters from
the request body. Adding the created person to the MongoDB
database and displaying it's data in the response. */
app.post('/api/persons', (req, res, next) => {
    const body = req.body

    /*Checking if the request body has data for the name and number
    and returning a status code of 400 "Bad request" through error handling
    middleware if data is missing. */
    if (!body.name || !body.number) {
        const error = new Error('Missing name or number.')
        error.name = 'RequiredPropertyError'
        next(error)
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
app.get('/api/persons/', (req, res, next) => {
    Contact.find({}).then(contacts => {
        res.json(contacts)
    }).catch(error => next(error))
})

/*Creating and displaying a json response for showing the
data of a single person. Also returning a 400 "Bad request" status code
through error handling middleware if a person with the given id does 
not exists. */
app.get('/api/persons/:id', (req, res, next) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        const error = new Error('Contacts with the given id do not exist.')
        error.name = 'CastError'
        next(error)
    }

})

/*Creating and displaying a response containing the number of entries
in the person array and the current date and time. */
app.get('/info', (req, res) => {
    let timestring = res.get('Date')
    res.send(`Phonebook contains info for ${persons.length} people. </br></br>
${Date()}`)
})

/*Defining a delete request url: "api/persons/id" for deleting the data of a 
person from the MongoDB database. Responding with a status code 204 "No content" 
as no data is required to be sent with the response. */
app.delete('/api/persons/:id', (req, res, next) => {
    Contact.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

//Defining the use of Express unknown endpoint middleware.
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

//Defining the use of Express error handler middleware.
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'MongooseError') {
        return response.status(500).send({ error: 'Unable to connect to database.' })
    }

    if (error.name === 'RequiredPropertyError') {
        return response.status(400).send({ error: 'Missing name or number.' })
    }

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformatted id.' })
    }

    next(error)
}

app.use(errorHandler)

/*Define the port for the backend. Either the one defined in enviromental
variable PORT. */
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

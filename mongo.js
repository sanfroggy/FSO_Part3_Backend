//Defining dotenv and the constants for the use of Express, cors, Morgan and Contact model
const mongoose = require('mongoose')

//If no password was given, print a message to console and exit program.
if (process.argv.length < 3) {
    console.log('Give password as argument')
    process.exit(1)
}

//Define password and use encodeURIComponent to escape possible special characters.
const password = encodeURIComponent(process.argv[2])

//Define a url to connect to MongoDB.
const url = `mongodb+srv://San:${password}@cluster0.od5jh2q.mongodb.net/phonebookApp?retryWrites=true&w=majority`

//Set up mongoose and connect to MongoDB.
mongoose.set('strictQuery', false)
mongoose.connect(url)

//Define a schema to use as a model for a Contact object to be saved to MongoDB.
const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

//Check the command line arguments include a name and a number and add a new Contact to database.
if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    //Create a new contact with the name and number given as command line arguments.
    const contact = new Contact({
        name: name,
        number: number,
    })

    //Save the new contact to MongoDB and close the connection.
    contact.save().then(result => {
        console.log(`Added "${result.name}" with number ${result.number} to phonebook.`)
        mongoose.connection.close()     
    })
}

//Check if the command line arguments contain only password
if (process.argv.length === 3) {

    console.log('Phonebook:')

    //Get and print all contacts from MongoDB.
    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(contact)
        })
        mongoose.connection.close()
    })
}



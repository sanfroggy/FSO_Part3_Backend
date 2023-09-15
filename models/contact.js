//Defining a const for mongoose
const mongoose = require('mongoose')

//Set up mongoose.
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

//Connect to MongoDB and print a message for successful and failed attempts.
console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

//Define a schema to use as a model for a Contact object to be saved to MongoDB.
const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

/*Define the properties of the object that is returned. Exclude the _id value 
as well as the MongoDB version field __v. Also using a method defined
as toJSON to transform the value of _id from object to a string*/
contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id,
        delete returnedObject.__v
    }
})

//Exporting the Contact model.
module.exports = mongoose.model('Contact', contactSchema)
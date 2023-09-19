//Defining a const for mongoose
const mongoose = require('mongoose')

//Set up mongoose.
mongoose.set('strictQuery', false)


/*Get the password and the username strings from the MONGODB_URI enviromental variable and
use EncodeURIComponent to ensure special characters will be escaped correctly. 
That those string will be then used when forming a URL to connect to. */
let splitfirst = process.env.MONGODB_URI.split(":")
let usrindex = splitfirst.indexOf(splitfirst.find(string => string.includes("cluster")))
let usrstring = ""

for (var i = 0; i < usrindex; i++) {
    if (splitfirst.length > 3) {
        if (i === 1) {
            usrstring += "://" + encodeURIComponent(splitfirst[i].substring(2) + ":")
        } else {
            if (i !== usrindex - 1 && i > 0) {
                usrstring += encodeURIComponent(splitfirst[i] + ":")
            } else {
                if (i === usrindex - 1) {
                    usrstring += encodeURIComponent(splitfirst[i]) + ":"
                } else {
                    usrstring += splitfirst[i]
                }
            }
        }
    } else {
        if (i === 1) {
            usrstring += "://" + encodeURIComponent(splitfirst[i].substring(2)) + ":"
        } else {
            if (i > 0) {
                usrstring += encodeURIComponent(splitfirst[i]) + ":"
            } else {
                usrstring += splitfirst[i]
            }
        }
    }       
}

let splitsecond = splitfirst[usrindex].split("@")

let pwdindex = splitsecond.indexOf(splitsecond.find(string => string.includes("cluster")))
let encodedstring = ""
for (var i = 0; i < pwdindex; i++) {
    if (splitsecond.length > 2) {
        if (i !== pwdindex - 1) {
            encodedstring += encodeURIComponent(splitsecond[i] + "@")
        } else {
            encodedstring += encodeURIComponent(splitsecond[i])
        }
    } else {
        encodedstring += encodeURIComponent(splitsecond[i])
    }  
}

const url = `${usrstring}${encodedstring}@${splitsecond[pwdindex]}`

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

/*Define the properties of the objects that are returned by the toJSON method. 
Exclude the _id value as well as the MongoDB version field __v. 
Also transform the value of _id from object to a string */
contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id,
        delete returnedObject.__v
    }
})

//Exporting the Contact model.
module.exports = mongoose.model('Contact', contactSchema)
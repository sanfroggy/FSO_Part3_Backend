const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Give password as argument')
    process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://San:${password}@cluster0.od5jh2q.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const contactSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    const Contact = mongoose.model('Contact', contactSchema)

    const contact = new Contact({
        name: name,
        number: number,
    })

    contact.save().then(result => {
        console.log(`Added "${result.name}" with number ${result.number} to phonebook.`)
        mongoose.connection.close()     
    })
}
 
if (process.argv.length === 3) {

    const contactSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    const Contact = mongoose.model('Contact', contactSchema)

    console.log('Phonebook:')

    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(contact)
        })
        mongoose.connection.close()
    })
}



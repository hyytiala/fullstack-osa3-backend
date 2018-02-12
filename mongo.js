const mongoose = require('mongoose')

const url = 'mongodb://admin:<password>@ds229438.mlab.com:29438/persons'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
})

if (process.argv[2]) {
    person
        .save()
        .then(response => {
            console.log('person saved')
            mongoose.connection.close()
        })
} else {
    Person
        .find({})
        .then(result => {
            console.log('puhelinluettelo:')
            result.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
}

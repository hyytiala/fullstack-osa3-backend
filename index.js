const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

app.use(bodyParser.json())
morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :json :status :res[content-length] - :response-time ms '))
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1
    },
    {
        name: 'Martti Tienari',
        number: '040-123456',
        id: 2
    },
    {
        name: 'Arto Järvinen',
        number: '040-123456',
        id: 3
    },
    {
        name: 'Lea Kutvonen',
        number: '040-123456',
        id: 4
    }
]

const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

app.get('/api/persons', (request, response) => {
    Person
        .find({}, { __v: 0 })
        .then(persons => {
            response.json(persons.map(Person.format))
        })
})

app.get('/api/info', (request, response) => {
    Person
        .find({}, { __v: 0 })
        .then(persons => {
            response.send(
                `<p>
                Puhelinluettelossa ${persons.length} henkilön tiedot
                </p>
                <p>
                ${Date()}
                </p>`)
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(Person.format(person))
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).send({ error: 'malformatted id' })
        })
})

const generateId = () => {
    const maxId = persons.length > 0 ? persons.map(n => n.id).sort().reverse()[0] : 1
    return maxId + 1
}

function getId() {
    return Math.floor(Math.random() * Math.floor(1000));
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ error: 'Ei nimeä' })
    }

    if (body.number === undefined) {
        return response.status(400).json({ error: 'Ei numeroa' })
    }

    Person
        .find({ name: body.name })
        .then(result => {
            if (result.length === 0) {
                const person = new Person({
                    name: body.name,
                    number: body.number
                })
                person
                    .save()
                    .then(savedPerson => {
                        response.json(Person.format(savedPerson))
                    })
            } else {
                response.status(400).send({ error: 'nimi on jo tietokannassa' })
            }
        })
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        number: body.number
    }

    Person
        .findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

app.use(bodyParser.json())
morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :json :status :res[content-length] - :response-time ms '))
app.use(cors())

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

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/info', (req, res) => {
    res.send(
        `<p>
        Puhelinluettelossa ${persons.length} henkilön tiedot
        </p>
        <p>
        ${Date()}
        </p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
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

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ error: 'Nimi käytössä' })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: getId()
    }

    persons = persons.concat(person)

    response.json(persons)
})

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
const express = require('express')
const morgan = require('morgan')
const app = express()

const blogRouter = require('./blogRouter')
const port = 3000

app.use(morgan('common'))

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(`${__dirname} /views/index.html`)
})

app.use('/blogs', blogRouter)

app.listen(port,() => console.log(`listening on port ${port}`))

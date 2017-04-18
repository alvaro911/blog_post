const express = require('express')
const morgan = require('morgan')
const app = express()

const blogRouter = require('./blogRouter')

app.use(morgan('common'))

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(`${__dirname} /views/index.html`)
})

app.use('/blogs', blogRouter)

let server

function runServer(){
  const port = process.env.PORT || 3000
  return new Promise((res, rej)=>{
    server = app.listen(port, () => {
      console.log(`Your app is listening in port: ${port}`)
      res(server)
    }).on('error', err => rej(err))
  })
}

function closeServer(){
  return new Promise((res, rej) => {
    console.log(`Closing server`)
    server.close(err => {
      if(err){
        rej(err)
        return
      }
      res()
    })
  })
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer}

const express = require ('express')
const router = express.Router()

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const {BlogPosts} = require('./models')

BlogPosts.create(
  'Lorem Ipsum',
  'Bacon ipsum dolor amet ham hock ribeye duis ut dolor pastrami nisi sint laboris meatloaf. Nisi ham hock spare ribs deserunt turkey kielbasa landjaeger, shankle ribeye sed in eiusmod chicken esse. Ham hock leberkas do aute ullamco nostrud boudin mollit in consequat salami. Nisi qui in, meatball ham pork belly aute cillum consectetur commodo rump officia. Pastrami voluptate aliqua cupidatat aute pig. Laboris fatback eu boudin, pariatur in duis ribeye meatloaf brisket. Pastrami pancetta tempor, landjaeger id eu sausage laboris ipsum andouille tongue velit non culpa aliqua.',
  'Jack the Ripper'
)

router.get('/', (req, res) => res.json(BlogPosts.get()))

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author']
  for(let i=0; i<requiredFields.length; i++){
    const field = requiredFields[i]
    if(!(field in req.body)){
      const message = `Missing ${field} in request body`
      console.log(message)
      return res.status(400).send(message)
    }
  }
  const blog = BlogPosts.create(req.body.title, req.body.content, req.body.author)
  res.status(201).send(blog)
})

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id)
  console.log(`Blog post with id ${req.params.id} was deleted`)
  res.status(204).end()
})

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'id']
  for(let i=0; i<requiredFields.length; i++){
    const field = requiredFields[i]
    if(!(field in req.body)){
      const message = `Missing this field: ${field}`
      console.log(message)
      return res.status(400).send(message)
    }
  }
  if(req.params.id !== req.body.id){
    const message = `Request path id ${req.params.id} and request body ${req.body.id} must match`
    console.log(message)
    return res.status(400).send(message)
  }
  const updatedBlog = BlogPosts.update({
    id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: Date.now()
  })
  res.status(201).send(updatedBlog)
})

module.exports = router

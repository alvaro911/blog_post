const chai = require('chai')
const chaiHTTP = require('chai-http')

const {app, runServer, closeServer} = require('../server')

const should = chai.should()

chai.use(chaiHTTP)

describe('Blog posts', function(){
  before(function(){
    return runServer()
  })

  after(function(){
    return closeServer()
  })

  it('Should get all blog posts on GET', function(){
    return chai.request(app)
      .get('/blogs')
      .then(function(res){
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('array')
        res.body.length.should.be.at.least(1)

        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate']
        res.body.forEach(function(blog){
          blog.should.be.a('object')
          blog.should.include.keys(expectedKeys)
        })
      })
  })

  it('Should add a new blog on POST', function(){
    const newBlog = {title: 'overwatch', content:'A first person shooter video game online only that has over 20 characters and 4 game modes', author: 'Jeff Kaplan', publishDate: 1492486260126}
    return chai.request(app)
      .post('/blogs')
      .send(newBlog)
      .then(function(res){
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate')
        res.body.id.should.not.be.null
        // res.body.should.deep.equal(Object.assign(newBlog, {id:res.body.id, publishDate:1492486260126}))
      })
    })

  it('Should update blogs on PUT', function(){
    const updateBlog = {
      title: '90 minutes',
      content: 'A blog about top football games around the world',
      author: 'Juan Mata'
    }

    return chai.request(app)
      .get(`/blogs`)
      .then(function(res){
        updateBlog.id = res.body[0].id
        return chai.request(app)
          .put(`/blogs/${updateBlog.id}`)
          .send(updateBlog)
      })
      .then(function(res){
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('object')
      })
  })

  it('Should delete a blog from the array on DELTE', function(){
    return chai.request(app)
      .get('/blogs')
      .then(function(res){
        return chai.request(app)
        .delete(`/blogs/${res.body[0].id}`)
      })
      .then(function(res){
        res.should.have.status(204)
      })
  })
})

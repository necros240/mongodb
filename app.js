const express = require('express')
const {connectToDb , getDb} = require('./db')
const { ObjectId } = require('mongodb')

const app = express()
app.use(express.json())

//db connection
let db

connectToDb((err)=>{
    if(!err) {
        app.listen(3000, ()=>{
            console.log('app listening 3000s')
        })
        db = getDb()
    }
  
})

app.get('/books', (req,res)=>{
    const page = req.query.p || 0
    const booksPerPage = 3

    let books = []
    
    db.collection('books')
      .find()
      .sort({author:1})
      .skip(page * booksPerPage)
      .limit(booksPerPage)
      .forEach(book => books.push(book))
      .then(()=>{
        res.status(200).json(books)
      })
      .catch(()=>{
        res.status(500).json({error:'could not fetch the documents'})
    })
})

app.get('/books/:id', (req,res)=>{

    if (ObjectId.isValid(req.params.id)){
        db.collection('books')
            .findOne({_id:new ObjectId(req.params.id)})
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(err => {
                res.status(500).json({error:'could not fetch the document'})
            })

    }else {
        res.status(500).json({error:'Not a valid doc id'})
    }
})

app.post('/books', (req,res)=>{
    const book = req.body

    db.collection('books')
      .insertOne(book)
      .then(result =>{
        res.status(201).json(result)
      })
      .catch(err=>{
        res.status(500).json({err:'could not create a new doc'})
      })

})

app.delete('/books/:id', (req,res)=>{

    if (ObjectId.isValid(req.params.id)){
        db.collection('books')
            .deleteOne({_id:new ObjectId(req.params.id)})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error:'could not delete the document'})
            })

    }else {
        res.status(500).json({error:'Not a valid doc id'})
    }
})

app.patch('/books/:id', (req,res)=>{
    const updates = req.body

    if (ObjectId.isValid(req.params.id)){
        db.collection('books')
            .findOne({_id:new ObjectId(req.params.id)},{$set:updates})
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(err => {
                res.status(500).json({error:'could not update the document'})
            })

    }else {
        res.status(500).json({error:'Not a valid doc id'})
    }
})


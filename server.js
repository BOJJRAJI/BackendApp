const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const dbPath = path.join(__dirname, './data.db')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')
app.use(express.json())
app.use(cors())
let db = null
const jwt = require('jsonwebtoken')
const { kMaxLength } = require('buffer')
const { takeCoverage } = require('v8')

const connectDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(9500, () => {
      console.log('Server Running........')
    })
  } catch (e) {
    console.log(`Error:${e.message}`)
  }
}

connectDBAndServer()


// add Post to the Database
app.post("/post",async(req,res)=>{
  try{
  const {title,description,tag,imageUrl}=req.body;
  console.log(req.body)
  const username=req.username;
  let cartQuery='';
      cartQuery=`INSERT INTO Post (title,description,tag,imageUrl)
      VALUES (
        '${title}','${description}',
        '${tag}',
        '${imageUrl}'
      )
      ;`;
  await db.run(cartQuery);
  res.status(200);
  res.json("Post Added!");
  }
  catch (e) {
    res.status(500)
    res.send('Server Error!')
  }
})

// Get the posts based on filters and sorting 
app.get('/getPosts/', async (req, res) => {
  try{
  const {
    keyword  = '',tag='',sort_by=''
  } = req.query

  console.log(keyword)
  
  let orderType = 'ASC'
  
  if (sort_by === 'PRICE_HIGH') {
    orderType = 'DESC'
  }
  
  const getPostsQuery=`
  SELECT * FROM Post where description like '%${keyword}%'  or title like '%${keyword}%' or tag like '${tag}' 
  order by title ${orderType}
  ;
  `;
  const postsArray = await db.all(getPostsQuery)
  res.status(200)
  res.json(postsArray)
}catch (e) {
    res.status(500)
    res.send('Server Error')
  }
})


const express = require('express')
const connection = require('./config')
var cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const path = require('path')
//app.use(cors())
app.use(express.static(path.join(__dirname, 'frontend/build')))

connection.connect()
//Get all products from the database.
app.get('/products/all', (req, res) => {
  connection.query('select * from products', (err, results) => {
    if (err) {
      throw err
    }
    res.json(results)
  })
})

//Get products with given category.
app.get('/products/:subCategory', (req, res) => {
  connection.query(
    `select * from products where Category=${connection.escape(req.params.subCategory)}`,
    (err, results) => {
      if (err) {
        throw err
      }
      res.json(results)
    }
  )
})

//Get products with given search term.
app.get('/search/:searchTerm', (req, res) => {
  let term = '%' + req.params.searchTerm + '%'
  connection.query('SELECT * FROM products WHERE Name LIKE ?', [ term ], (err, results) => {
    if (err) {
      throw err
    }
    res.json(results)
  })
})

//get a reviews with a specific product id.
app.get('/reviews/:productId', (req, res) => {
  let term = req.params.productId
  connection.query(
    'SELECT * FROM rewiews LEFT JOIN users ON rewiews.UserID = users.UserID  WHERE ProductId LIKE ?',
    [ term ],
    (err, results) => {
      if (err) {
        throw err
      }
      res.json(results)
    }
  )
})

//get a product using its name.
app.get('/singleProduct/:productName', (req, res) => {
  connection.query(`select * from products where Name=${connection.escape(req.params.productName)}`, (err, results) => {
    if (err) {
      throw err
    }
    res.json(results)
  })
})

//Add a product to the database.
app.post('/addProduct', (req, res) => {
  let Name = req.body.Name
  let Price = req.body.Price
  let Stock = req.body.Stock
  let Picture = req.body.Picture
  let Description = req.body.Description
  let Discount = req.body.Discount
  let Category = req.body.Category

  connection.query(
    `insert into products(Name, Price, Stock, Picture, Description, Discount, Category) values (${e(Name)}, ${e(
      Price
    )}, ${e(Stock)}, ${e(Picture)}, ${e(Description)}, ${e(Discount)}, ${e(Category)})`,
    (err, results) => {
      if (err) {
        throw err
      }
      res.send(results)
    }
  )
})

//Edit a given product. NOT USED
//TO-DO: Implement the editing on the frontend.
app.post('/edit', (req, res) => {
  let id = req.body.id
  let name = req.body.name
  let price = req.body.price
  let stock = req.body.stock
  let picture = req.body.picture
  let description = req.body.description
  let discount = req.body.discount
  let category = req.body.category
  connection.query(
    `update products set ID = ${connection.escape(id)}, Name = ${connection.escape(name)}, 
  Price = ${connection.escape(price)}, Stock = ${connection.escape(stock)}, Picture = ${connection.escape(picture)},
  Description = ${connection.escape(description)}, Discount = ${connection.escape(discount)}, 
  Category = ${connection.escape(category)} where ID = ${connection.escape(id)}`,
    (err, results) => {
      if (err) {
        throw err
      }
      res.send(results)
    }
  )
})

//Delete product from database.
app.delete('/deleteProductById', (req, res) => {
  let id = req.body.productId
  connection.query(`delete from products where ProductId = ${connection.escape(id)}`, (err, results) => {
    if (err) {
      throw err
    }
    results.message = 'Tuote Poistettiin!'
    res.send(results)
  })
  connection.query(`delete from rewiews where ProductId = ${connection.escape(id)}`)
})

app.delete('/deleteUserById', (req, res) => {
  let id = req.body.userId
  connection.query(`delete from users where UserID = ${connection.escape(id)}`, (err, results) => {
    if (err) {
      throw err
    }
    console.log(results)
    results.message = 'Käyttäjä Poistettiin!'
    res.send(results)
  })
  connection.query(`delete from rewiews where UserID = ${connection.escape(id)}`)
})

//register a new user to the database.
app.post('/registration', (req, res) => {
  let firstname = req.body.firstname
  let lastname = req.body.lastname
  let email = req.body.email
  let password = req.body.password
  let streetAddress = req.body.streetAddress
  let city = req.body.city
  let zip = req.body.zip
  let country = req.body.country
  let phoneNumber = req.body.phoneNumber
  let type = 'slave'
  let user = 'testi'
  connection.query(
    `insert into users 
  (UserName, Address, Zip, City, Country, Password, Email, Phone, UserType, firstname, lastname)
  values
  (${connection.escape(user)}, ${connection.escape(streetAddress)}, ${connection.escape(zip)},
  ${connection.escape(city)}, ${connection.escape(country)}, ${connection.escape(password)},
  ${connection.escape(email)}, ${connection.escape(phoneNumber)}, ${connection.escape(type)},
  ${connection.escape(firstname)}, ${connection.escape(lastname)})`,
    (err, results) => {
      if (err) {
        throw err
      } else {
        res.send(results)
      }
    }
  )
})

//register a new admin to the database.
app.post('/registerAdmin', (req, res) => {
  let firstname = req.body.firstname
  let lastname = req.body.lastname
  let email = req.body.email
  let password = req.body.password
  let streetAddress = req.body.streetAddress
  let city = req.body.city
  let zip = req.body.zip
  let country = req.body.country
  let phoneNumber = req.body.phoneNumber
  let type = 'admin'
  let user = 'admin'
  connection.query(
    `insert into users 
  (UserName, Address, Zip, City, Country, Password, Email, Phone, UserType, firstname, lastname)
  values
  (${connection.escape(user)}, ${connection.escape(streetAddress)}, ${connection.escape(zip)},
  ${connection.escape(city)}, ${connection.escape(country)}, ${connection.escape(password)},
  ${connection.escape(email)}, ${connection.escape(phoneNumber)}, ${connection.escape(type)}, ${connection.escape(
      firstname
    )}, ${connection.escape(lastname)})`,
    (err, results) => {
      if (err) {
        throw err
      } else {
        res.send(results)
      }
    }
  )
})

// hash the password.
app.post('/hash', (req, res) => {
  connection.query(
    `update users set Password = SHA(Password) where Email=${connection.escape(req.body.email)}`,
    (err, result) => {
      if (err) {
        throw err
      } else {
        res.send(result)
      }
    }
  )
})

//login function for the users.
app.post('/login', (req, res) => {
  let email = req.body.email
  let password = req.body.password
  connection.query(
    `select * from users where Email=${connection.escape(email)} && Password=SHA(${connection.escape(password)})`,
    (err, result) => {
      if (err) {
        throw err
      } else {
        res.json(result)
      }
    }
  )
})

//escapes the given value using mysql escape function.
function e(value) {
  return connection.escape(value)
}

//Adds a new order to the database
app.post('/addOrder', (req, res) => {
  let date = req.body.date
  let products = JSON.stringify(req.body.products)
  let address = req.body.address
  let postalNumber = req.body.postalNumber
  let city = req.body.city
  let country = req.body.country
  let fullPrice = req.body.fullPrice.toFixed(2)
  let phone = req.body.phone
  let name = req.body.name
  let email = req.body.email
  let deliveryMethod = req.body.deliveryMethod
  let paymentMethod = req.body.paymentMethod
  let userId = req.body.userId
  connection.query(
    `insert into orders 
  (Date, UserID, Products, Address, Zip, City, Country, TotalPrice, phone, name, email, deliveryMethod, PaymentMethod)
  values
  (${e(date)}, ${e(userId)}, ${e(products)},
  ${e(address)}, ${e(postalNumber)}, ${e(city)},
  ${e(country)}, ${e(fullPrice)}, ${e(phone)},
  ${e(name)}, ${e(email)}, ${e(deliveryMethod)},
  ${e(paymentMethod)} )`,
    (err, result) => {
      if (err) {
        throw err
      } else {
        removeProductStock(products)
        res.send(result)
      }
    }
  )
})

//Function used to remove stock from the database.
function removeProductStock(products) {
  let productList = JSON.parse(products)
  productList.forEach((product) => {
    connection.query(
      `update products set Stock = Stock - 1 where ProductId = ${e(product.ProductId)}`,
      (err, results) => {
        if (err) {
          throw err
        }
      }
    )
  })
}

//Add a new review to a product.
app.post('/addReview', (req, res) => {
  let productId = req.body.productId
  let stars = req.body.stars
  let comment = req.body.comment
  let userId = req.body.userId

  connection.query(`select * from rewiews where userId=${e(userId)} AND ProductId= ${e(productId)}`, (err, result) => {
    if (err) {
      throw err
    } else {
      if (!result.length) {
        connection.query(
          `insert into rewiews (UserId, ProductId, Rating, Comment)values(${e(userId)}, ${e(productId)},
           ${e(stars)}, ${e(comment)} )`,
          (err, result) => {
            if (err) {
              throw err
            } else {
              res.send(result)
            }
          }
        )
      } else {
        connection.query(
          `Delete from rewiews where userId=${e(userId)} AND ProductId= ${e(productId)}`,
          (err, result) => {
            if (err) {
              throw err
            } else {
              connection.query(
                `insert into rewiews (UserId, ProductId, Rating, Comment)values(${e(userId)}, ${e(productId)},
                 ${e(stars)}, ${e(comment)} )`,
                (err, result) => {
                  if (err) {
                    throw err
                  } else {
                    res.send(result)
                  }
                }
              )
            }
          }
        )
      }
    }
  })
})

//Get an order using an id.
app.get('/getOrderById/:id', (req, res) => {
  let id = req.params.id
  connection.query('SELECT * FROM orders WHERE OrderId LIKE ?', [ id ], (err, results) => {
    if (err) {
      throw err
    }
    res.json(results)
  })
})

//get all orders from a user using their userID.
app.get('/getOrderByUserId/:id', (req, res) => {
  let id = req.params.id
  connection.query('SELECT * FROM orders WHERE UserId LIKE ?', [ id ], (err, results) => {
    if (err) {
      throw err
    }
    res.json(results)
  })
})

//Compare given email to all the emails in the user database.
app.get('/compareEmail/:email', (req, res) => {
  connection.query(`select * from users where Email=${connection.escape(req.params.email)}`, (err, results) => {
    if (err) {
      throw err
    }
    res.json(results)
  })
})

// Gives all of the users.
app.get('/users', (req, res) => {
  connection.query(`select * from users`, (err, results) => {
    if (err) {
      throw err
    }
    res.json(results)
  })
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
  })
}

const port = process.env.PORT || 4000
app.listen(port)

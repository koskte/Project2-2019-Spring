import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Divider, Card, CardActionArea, CardContent, CardActions, Button, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom'
import * as firebase from 'firebase'

let firebaseConfig = {
  apiKey            : 'AIzaSyCjQ7RcstBxWDSTSNwXwQapExYjLQXGeFs',
  authDomain        : 'host-images-5a40c.firebaseapp.com',
  databaseURL       : 'https://host-images-5a40c.firebaseio.com',
  projectId         : 'host-images-5a40c',
  storageBucket     : 'host-images-5a40c.appspot.com',
  messagingSenderId : '380334876271',
  appId             : '1:380334876271:web:6b0b9a29f643d95d'
}
firebase.initializeApp(firebaseConfig)

var storage = firebase.storage()

const styles = (theme) => ({
  link         : {
    '&:hover' : {
      textDecoration : 'none'
    }
  },
  shopButton   : {
    color     : 'white',
    '&:hover' : {
      border          : '1px solid rgba(103, 128, 159, 0.5)',
      backgroundColor : '#AE5572'
    }
  },
  card         : {
    '&:hover' : {
      border : '2px solid rgba(103, 128, 159, 0.5)'
    },
    width     : '250px',
    height    : '390px',
    maxHeight : '500px',
    margin    : '15px',
    boxShadow : '0 3px 5px 2px rgba(106,98,101, .5)'
  },
  price        : {
    float : 'left',
    clear : 'both'
  },
  addtocart    : {
    float : 'left',
    clear : 'both'
  },
  grid         : {
    paddingRight : 0
  },
  image        : {
    height      : '150px',
    display     : 'block',
    marginLeft  : 'auto',
    marginRight : 'auto'
  },
  bottomButton : {
    marginBottom : '10px'
  }
})

//The main page of the whole application. Shows the products.
class MainPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount       : 1,
      imageUrlList : {},
      limitTo      : 10,
      products     : []
    }
  }

  //Fetches all of the products first.
  componentDidMount() {
    setTimeout(() => {
      let list = {}
      this.props.products.forEach((product) => {
        let pathReference = storage.ref('images/' + product.Picture)
        pathReference
          .getDownloadURL()
          .then((url) => {
            let name = product.Name
            let pair = {}
            pair[name] = url
            list = { ...list, ...pair }
          })
          .then(() => {
            this.setState({ imageUrlList: list })
          })
      })
    }, 600)
  }

  //Shortens the description text of the products.
  displayShortDescription(description) {
    let shortDesc = ''
    let counter = 0
    if (description.length > 64) {
      for (let i = 0; i < description.length; i++) {
        shortDesc = shortDesc + description.charAt(i)
        if (shortDesc.charAt(i) === ' ') {
          counter++
        }
        if (counter === 9) {
          return shortDesc + '...'
        }
      }
    } else {
      return description
    }
  }

  //Creates the product list that is shown in the page.
  makeProductList() {
    const { classes } = this.props
    let productList = []
    productList = this.state.products.slice(0, this.state.limitTo).map((product) => {
      return (
        <Grid item key={product.Name} className={classes.grid}>
          <Card className={classes.card} style={{ width: 250, margin: '15px' }}>
            <Link
              className={classes.link}
              style={{ height: '344px' }}
              to='/productDetails'
              onClick={() => {
                this.props.getProductName(product.Name, this.state.imageUrlList[product.Name])
                sessionStorage.setItem('imageUrl', this.state.imageUrlList[product.Name])
              }}
            >
              <CardActionArea style={{ height: '344px' }}>
                <img className={classes.image} src={this.state.imageUrlList[product.Name]} alt={product.Name} />
                <CardContent style={{ height: '120px' }}>
                  <Typography variant='h5' style={{ fontSize: '1.1rem' }}>
                    {product.Name}
                  </Typography>
                  <Typography component='p'>{this.displayShortDescription(product.Description)}</Typography>
                </CardContent>
              </CardActionArea>
            </Link>
            <CardActions style={{ backgroundColor: '#931C43', color: 'white' }}>
              <div className={classes.price}>{product.Price}€</div>
              <div className={classes.addtocart}>
                <Button
                  className={classes.shopButton}
                  size='small'
                  onClick={() => this.props.addToShoppingCart(product)}
                  style={{ marginLeft: 30 }}
                >
                  Lisää Ostoskoriin
                </Button>
              </div>
            </CardActions>
          </Card>
        </Grid>
      )
    })

    return productList
  }

  //Sets the products into the state.
  putItInTheState() {
    this.setState({ products: this.props.products })
  }

  //Sets the updated products to the screen.
  componentDidUpdate(prevProps) {
    if (this.props.products.length >= 1 && this.props.products !== prevProps.products) {
      this.putItInTheState()
    }
  }

  render() {
    const { classes } = this.props
    const enabled = this.state.limitTo < this.state.products.length

    let productList = this.makeProductList()

    return (
      <Grid container alignContent='center' spacing={24}>
        <Grid item>
          <Typography style={{ margin: '20px' }} variant='h3'>
            Tuotteet
          </Typography>
          <Divider />
          <Grid container justify='center'>
            {productList}
          </Grid>
        </Grid>
        <Grid container justify='center'>
          <Button
            variant='contained'
            style={{ backgroundColor: '#931C43', color: 'white' }}
            justify='center'
            disabled={!enabled}
            onClick={() => {
              this.setState({ limitTo: this.state.limitTo + 10 })
            }}
            className={classes.bottomButton}
          >
            {enabled ? <span>Näytä Lisää</span> : <span>Ei enempää tuotteita</span>}
          </Button>
        </Grid>
      </Grid>
    )
  }
}
export default withStyles(styles)(MainPage)

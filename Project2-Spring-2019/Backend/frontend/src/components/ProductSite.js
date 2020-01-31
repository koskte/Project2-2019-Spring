import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Divider, List, ListItem } from '@material-ui/core'
import Slider from '@material-ui/lab/Slider'
import Icon from '@material-ui/core/Icon'
import auth from './Auth'

const styles = (theme) => ({
  card            : {
    maxWidth : 700,
    margin   : 'auto auto'
  },
  media           : {
    width  : 300,
    height : 300
  },
  content         : {},
  details         : {},
  button          : {
    marginTop : theme.spacing.unit,
    margin    : 'auto auto'
  },
  sliderContainer : {
    width   : '125px',
    display : 'block'
  },
  slider          : {
    padding : '22px 0px'
  },
  row             : {
    marginBottom : '1px'
  },
  review          : {
    borderTop    : '2px solid rgba(103, 128, 159, 0.5)',
    borderRadius : theme.shape.borderRadius,
    paddingTop   : 2
  },
  reviewRow       : {
    padding : 0
  }
})

//Page that shows the given products information and reviews.
class ProductSite extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name     : this.props.ProductName,
      imageUrl : this.props.productImageUrl,
      product  : [],
      reviews  : [],
      amount   : 1,
      value    : 3,
      review   : [],
      comment  : ''
    }

    this.handleCommentChange = this.handleCommentChange.bind(this)
  }

  //Fetches the products information.
  componentDidMount() {
    if (this.state.imageUrl === undefined) {
      this.setState({ imageUrl: sessionStorage.getItem('imageUrl') })
    }

    let data = sessionStorage.getItem('name')
    if (data === '' || (this.props.ProductName !== '' && data !== this.props.ProductName)) {
      sessionStorage.setItem('name', this.props.ProductName)
    }
    if (this.state.name === '') {
      this.setState({ name: data })
    }
    setTimeout(() => {
      fetch(`/singleProduct/${this.state.name}`)
        .then((res) => {
          return res.json()
        })
        .then((product) => {
          this.setState({ product })
          fetch('/reviews/' + product[0].ProductId)
            .then((res) => {
              return res.json()
            })
            .then((reviews) => {
              console.log(reviews)
              this.setState({ reviews })
            })
        })
    }, 250)
    this.printStars()
  }

  //handles change in the review form.
  handleChange = (event, value) => {
    setTimeout(() => {
      this.setState({ value })
      this.printStars()
    }, 1)
  }

  //Prints out the stars of the review form.
  printStars() {
    let list = []
    for (let x = 0; x < this.state.value; x++) {
      list.push(<Icon>star</Icon>)
    }

    this.setState({ review: list })
  }

  //prints out the stars of the reviews.
  printReviewStars(stars) {
    let starList = []
    for (let i = 0; i < stars; i++) {
      starList.push(<Icon>star</Icon>)
    }
    return starList
  }

  //handles the comment input of the form.
  handleCommentChange(event) {
    this.setState({ comment: event.target.value })
    console.log(event)
  }

  //handles the submit of the review.
  handleSubmit(event) {
    console.log(this.state.product[0].ProductId)
    fetch('/addReview', {
      method  : 'post',
      headers : {
        Accept         : 'application/json',
        'Content-type' : 'application/json'
      },
      body    : JSON.stringify({
        productId : this.state.product[0].ProductId,
        stars     : this.state.value,
        comment   : this.state.comment,
        userId    : sessionStorage.getItem('userId')
      })
    })
  }

  render() {
    const { classes } = this.props
    const { value } = this.state
    let reviewList = this.state.reviews.map((review) => {
      return (
        <Fragment>
          <ListItem className={classes.review}>
            <Grid container spacing={16}>
              <Grid item xs={12} className={classes.reviewRow}>
                {review.firstname}
              </Grid>
              <Grid item xs={12} className={classes.reviewRow}>
                {this.printReviewStars(review.Rating)}
              </Grid>
              <Grid item xs={12} className={classes.reviewRow}>
                <Typography variant='body1'>{review.Comment}</Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
        </Fragment>
      )
    })

    let productCard = this.state.product.map((product) => {
      return (
        <div>
          <Grid container spacing={24} className={classes.card}>
            <Grid item lg={8}>
              <Typography gutterBottom variant='h3' component='h2'>
                {product.Name}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <CardMedia className={classes.media} image={this.state.imageUrl} />
            </Grid>
            <Grid item xs={4}>
              <Typography gutterBottom variant='h3' component='h2'>
                {product.Price}€
              </Typography>
              <Button
                size='small'
                style={{ backgroundColor: '#931C43', color: 'white' }}
                variant='contained'
                className={classes.button}
                onClick={() => {
                  this.props.addToShoppingCart(this.state.product[0])
                }}
              >
                Lisää Koriin
              </Button>
            </Grid>
            <Grid container>
              <Grid item lg={8}>
                <Typography component='p'>{product.Description}</Typography>
                <Divider />
              </Grid>
            </Grid>

            {auth.loggedIn() ? (
              <Grid container>
                <div className={classes.sliderContainer}>
                  <p style={{ margin: 0 }}>Tähtiarvostelu</p>
                  <div style={{ margin: 0 }}>{this.state.review}</div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      this.handleSubmit()
                    }}
                  >
                    <Slider
                      classes={{ container: classes.slider }}
                      value={value}
                      min={1}
                      max={5}
                      step={1}
                      onChange={this.handleChange}
                    />
                    <textarea
                      name='comment'
                      value={this.state.comment}
                      rows='4'
                      cols='50'
                      onChange={this.handleCommentChange}
                    />
                    <Button
                      type='submit'
                      size='small'
                      style={{ backgroundColor: '#931C43', color: 'white' }}
                      variant='contained'
                      className={classes.button}
                    >
                      Arvostele
                    </Button>
                  </form>
                </div>
              </Grid>
            ) : (
              ''
            )}
            <List>{reviewList}</List>
          </Grid>
        </div>
      )
    })
    return <div>{productCard}</div>
  }
}

export default withStyles(styles)(ProductSite)

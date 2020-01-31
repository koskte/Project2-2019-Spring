import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Divider, Grid } from '@material-ui/core'

const styles = (theme) => ({
  paper: {
    margin: 20,
    padding: 20,
    height: '100%'
  }
})

// Makes the user wait for 5 seconds and sends the whole order to the backend.
class Payment extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  //Sends the whole order to backend.
  waitAMinute() {
    let userId
    if (sessionStorage.getItem('userId')) {
      userId = sessionStorage.getItem('userId')
    } else {
      userId = null
    }

    fetch('/addOrder', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        date: new Date(),
        products: this.props.data.shoppingCart,
        address: this.props.data.address,
        postalNumber: this.props.data.postalNumber,
        city: this.props.data.city,
        country: 'Suomi',
        fullPrice: this.props.data.fullPrice,
        phone: this.props.data.phone,
        name: this.props.data.name,
        email: this.props.data.email,
        deliveryMethod: this.props.data.delivery,
        paymentMethod: this.props.data.payment,
        userId: userId
      })
    })
      .then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            this.props.deleteShoppingCart()
            this.props.changeTheStage(1)
          }, 5000)
          return res.json()
        } else {
          alert('Something went wrong')
          this.props.changeTheStage(1)
        }
      })
      .then((json) => {
        this.props.handleOrderId(json.insertId)
      })
  }

  //Calls the waitaminute() function.
  componentDidMount() {
    this.waitAMinute()
  }
  render() {
    const { classes } = this.props
    return (
      <Fragment>
        <Grid item xs={12}>
          <Typography variant="h3">Maksutapahtuma</Typography>
          <Divider />
        </Grid>
      </Fragment>
    )
  }
}
export default withStyles(styles)(Payment)

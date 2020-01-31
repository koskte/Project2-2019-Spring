import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'
import ShoppingCart from './ShoppingCart'
import LoginReminder from './LoginReminder'
import ShippingInformation from './ShippingInformation'
import DeliveryMethod from './DeliveryMethod'
import PaymentMethod from './PaymentMethod'
import Payment from './Payment'
import OrderConfirmation from './OrderConfirmation'

const styles = (theme) => ({
  paper : {
    margin    : 'auto',
    marginTop : 30,
    width     : 'fit-content',
    padding   : 30,
    height    : '100%'
  }
})

//handles the whole order page.
class OrderPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stage        : parseInt(sessionStorage.getItem('stage')),
      shoppingCart : props.shoppingCart,
      fullPrice    : 0,
      name         : '',
      address      : '',
      postalNumber : 0,
      city         : '',
      phone        : '',
      email        : '',
      delivery     : '',
      payment      : '',
      orderId      : '',
      shippingInfo : {
        name         : '',
        address      : '',
        postalNumber : '',
        city         : '',
        phone        : '',
        email        : ''
      }
    }
    this.changeTheStage = this.changeTheStage.bind(this)
    this.handlePrice = this.handlePrice.bind(this)
    this.handleShipping = this.handleShipping.bind(this)
    this.handleDelivery = this.handleDelivery.bind(this)
    this.handlePayment = this.handlePayment.bind(this)
    this.handleOrderId = this.handleOrderId.bind(this)
  }

  //Changes the view into the given direction.
  changeTheStage(dir) {
    if (dir === 1) {
      this.setState({ stage: this.state.stage + dir })
    } else if (dir === -1) {
      this.setState({ stage: this.state.stage + dir })
    } else if (dir === 2) {
      this.setState({ stage: this.state.stage + dir })
    } else if (dir === -2) {
      this.setState({ stage: this.state.stage + dir })
    }
    sessionStorage.setItem('stage', this.state.stage + dir)
  }

  //Returns the correct component.
  setTheStage() {
    if (this.state.stage === 1) {
      return (
        <ShoppingCart
          shoppingCart={this.state.shoppingCart}
          deleteFromShoppingCart={this.props.deleteFromShoppingCart}
          changeTheStage={this.changeTheStage}
          handlePrice={this.handlePrice}
        />
      )
    } else if (this.state.stage === 2) {
      return <LoginReminder changeTheStage={this.changeTheStage} />
    } else if (this.state.stage === 3) {
      return (
        <ShippingInformation
          changeTheStage={this.changeTheStage}
          handleShipping={this.handleShipping}
          shippingInfo={this.state.shippingInfo}
        />
      )
    } else if (this.state.stage === 4) {
      return (
        <DeliveryMethod
          changeTheStage={this.changeTheStage}
          handleDelivery={this.handleDelivery}
          method={this.state.delivery}
        />
      )
    } else if (this.state.stage === 5) {
      return (
        <PaymentMethod
          changeTheStage={this.changeTheStage}
          handlePayment={this.handlePayment}
          method={this.state.payment}
        />
      )
    } else if (this.state.stage === 6) {
      return (
        <Payment
          changeTheStage={this.changeTheStage}
          data={this.state}
          deleteShoppingCart={this.props.deleteShoppingCart}
          handleOrderId={this.handleOrderId}
        />
      )
    } else if (this.state.stage === 7) {
      return <OrderConfirmation orderId={this.state.orderId} />
    }
  }

  //Rounds the whole price so the price doesnt break anything.
  handlePrice(price) {
    price = Math.round(price * 100) / 100
    this.setState({ fullPrice: price })
  }

  //Sets the given shipping info to current state.
  handleShipping(shippingInfo) {
    this.setState({
      name         : shippingInfo.name,
      address      : shippingInfo.address,
      postalNumber : shippingInfo.postalNumber,
      city         : shippingInfo.city,
      phone        : shippingInfo.phone,
      email        : shippingInfo.email,
      shippingInfo : shippingInfo
    })
  }

  //Sets the delivery method to state.
  handleDelivery(deliveryInfo) {
    this.setState({
      delivery : deliveryInfo.method
    })
  }

  //Sets the payment method to state.
  handlePayment(paymentInfo) {
    this.setState({
      payment : paymentInfo.method
    })
  }

  //Sets the order Id to state.
  handleOrderId(id) {
    this.setState({
      orderId : id
    })
  }

  render() {
    const { classes } = this.props

    return (
      <Paper className={classes.paper}>
        <Grid container spacing={24}>
          <Grid item>{this.setTheStage()}</Grid>
        </Grid>
      </Paper>
    )
  }
}
export default withStyles(styles)(OrderPage)

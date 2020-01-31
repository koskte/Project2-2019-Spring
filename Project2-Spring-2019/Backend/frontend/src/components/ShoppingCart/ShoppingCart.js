import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Button, Divider, Grid } from '@material-ui/core'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import auth from '../Auth'
const styles = (theme) => ({
  paper : {
    margin  : 20,
    padding : 20,
    height  : '100%'
  }
})

//Shows the list of the products in the users shopping cart.
class ShoppingCart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fullPrice : 0
    }
    setTimeout(() => {
      this.countPrice()
    }, 5)
  }

  //Counts the whole price of all the products.
  countPrice() {
    this.props.shoppingCart.forEach((item) => {
      if (item.Discount < 1) {
        let discount = item.Price * item.Discount
        let finalPrice = this.state.fullPrice + (item.Price - discount)
        this.setState({ fullPrice: finalPrice })
      } else {
        let discount = item.Price * (item.Discount / 100)
        let finalPrice = this.state.fullPrice + (item.Price - discount)
        this.setState({ fullPrice: finalPrice })
      }
    })
  }

  //Deletes a product from the shoppingcart.
  deleteProduct(item) {
    this.props.deleteFromShoppingCart(item)
    setTimeout(() => {
      let discount = item.Price * (item.Discount / 100)
      let finalPrice = this.state.fullPrice - (item.Price - discount)
      this.setState({ fullPrice: finalPrice })
    }, 10)
  }

  render() {
    const { classes } = this.props
    const enabled = this.state.fullPrice > 0 || this.props.shoppingCart.length > 0

    let shoppingCart = this.props.shoppingCart.map((item) => {
      return (
        <Fragment>
          <TableRow key={item.ProductId}>
            <TableCell component='th' scope='item'>
              {item.Name}
            </TableCell>
            <TableCell align='right'>{item.Price}</TableCell>
            <TableCell align='right'>{item.Discount}</TableCell>
            <TableCell align='right'>{item.Price - item.Price * (item.Discount / 100)}</TableCell>
            <TableCell align='right'>
              <Button
                onClick={() => {
                  this.deleteProduct(item)
                }}
              >
                X
              </Button>
            </TableCell>
          </TableRow>
        </Fragment>
      )
    })

    return enabled ? (
      <Fragment>
        <Grid item xs={12}>
          <Typography variant='h3'>Ostoskori</Typography>
          <Divider />
        </Grid>

        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Tuote</TableCell>
              <TableCell align='right'>Hinta</TableCell>
              <TableCell align='right'>Alennus %</TableCell>
              <TableCell align='right'>Hinta Alennuksella</TableCell>
              <TableCell align='right'>Poista Tuote</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shoppingCart}
            <TableRow key='amo'>
              <TableCell align='right'>
                <Typography variant='h5'>Yhteensä: {this.state.fullPrice} €</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Grid item>
          <Button
            variant='contained'
            style={{ backgroundColor: '#931C43', color: 'white' }}
            disabled={!enabled}
            onClick={() => {
              this.props.handlePrice(this.state.fullPrice)
              if (auth.loggedIn()) {
                this.props.changeTheStage(2)
              } else {
                this.props.changeTheStage(1)
              }
            }}
          >
            Seuraava
          </Button>
        </Grid>
      </Fragment>
    ) : (
      <h3>Ostoskorisi on tyhjä!</h3>
    )
  }
}
export default withStyles(styles)(ShoppingCart)

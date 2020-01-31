import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Divider, Grid, Paper } from '@material-ui/core'
import { Redirect } from 'react-router-dom'
import auth from '../Auth'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const styles = (theme) => ({
  paper       : {
    margin  : 20,
    padding : 20
  },
  smallHeader : {
    marginTop : 20
  },
  bigHeader   : {
    marginBottom : 10
  },
  root        : {
    width     : '100%',
    marginTop : theme.spacing.unit * 3,
    overflowX : 'auto',
    margin    : 30
  },
  table       : {
    minWidth : 700
  }
})

//Creates a object containing all of the data.
function createData(products, date, orderId, paymentMethod, deliveryMethod, price) {
  return { products, date, orderId, paymentMethod, deliveryMethod, price }
}

class CustomerPage extends Component {
  state = {
    customerId : null,
    orders     : []
  }

  //checks if a user is logged in and fetches the users own orders.
  componentDidMount() {
    if (auth.loggedIn()) {
      const id = sessionStorage.getItem('userId')
      this.setState({ customerId: id })
    }
    setTimeout(() => {
      fetch(`/getOrderByUserId/${this.state.customerId}`)
        .then((res) => {
          return res.json()
        })
        .then((orders) => {
          this.setState({ orders })
        })
    }, 20)
  }

  render() {
    console.log(this.state.orders)
    const { classes } = this.props
    const test = this.state.orders.map((order) => {
      let orders = JSON.parse(order.Products)
      let list = orders.map((item) => <p>{item.Name}</p>)
      return createData(list, order.Date, order.OrderId, order.PaymentMethod, order.deliveryMethod, order.TotalPrice)
    })
    console.log(test)
    const rows = test
    console.log(rows)
    const orderTable = (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Tuotteet</TableCell>
              <TableCell align='right'>Päivämäärä</TableCell>
              <TableCell align='right'>Tilauksen tunnus</TableCell>
              <TableCell align='right'>Maksutapa</TableCell>
              <TableCell align='right'>Kuljetustapa</TableCell>
              <TableCell align='right'>Hinta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              let date = row.date.toString()
              date = date.slice(0, 10)
              return (
                <TableRow>
                  <TableCell align='left'>{row.products}</TableCell>
                  <TableCell align='right'>{date}</TableCell>
                  <TableCell align='right'>{row.orderId}</TableCell>
                  <TableCell align='right'>{row.paymentMethod}</TableCell>
                  <TableCell align='right'>{row.deliveryMethod}</TableCell>
                  <TableCell align='right'>{row.price}€</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>
    )

    if (auth.loggedIn() === false) {
      return <Redirect to='/' />
    }
    return (
      <Grid container spacing={24}>
        <Grid item xs>
          <Paper className={classes.paper}>
            <Typography className={classes.bigHeader} variant='h3'>
              Omat Sivut
            </Typography>
            <Divider />
            <Typography className={classes.smallHeader} variant='h5'>
              Tilaushistoria
            </Typography>
          </Paper>
        </Grid>
        {orderTable}
      </Grid>
    )
  }
}

export default withStyles(styles)(CustomerPage)

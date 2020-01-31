import React, { Component, Fragment } from 'react'
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core'
import AdminBar from './AdminBar'
import { Redirect } from 'react-router-dom'
import Auth from '../Auth'
import * as firebase from 'firebase'

let storage = firebase.storage()
let storageRef = storage.ref()

const styles = {
  root : {}
}

//Product Governing.
class GovernProducts extends Component {
  state = {
    products : []
  }

  componentDidMount() {
    fetch('/products/all').then((res) => res.json()).then((products) => this.setState({ products }))
  }

  deleteProduct(product) {
    var imageRef = storageRef.child('images/' + product.Picture)

    imageRef
      .delete()
      .then(function() {
        console.log('Kuva poistettu varastosta')
      })
      .catch(function(error) {
        console.log('Ongelma kuvan poistamisessa')
      })

    fetch('/deleteProductById', {
      method  : 'delete',
      headers : {
        Accept         : 'application/json',
        'Content-type' : 'application/json'
      },
      body    : JSON.stringify({
        productId : product.ProductId
      })
    })
      .then((res) => res.json())
      .then((res) => alert(res.message))
      .then(() => {
        fetch('/products/all').then((res) => res.json()).then((products) => this.setState({ products }))
      })
  }

  render() {
    if (Auth.isAdminAuthenticated() === false) {
      return <Redirect to='/' />
    }
    const { classes } = this.props

    let productList = this.state.products.map((product) => {
      return (
        <Fragment>
          <TableRow key={product.ProductId}>
            <TableCell component='th' scope='product'>
              {product.ProductId}
            </TableCell>
            <TableCell align='right'>{product.Name}</TableCell>
            <TableCell align='right'>{product.Price}</TableCell>
            <TableCell align='right'>{product.Stock}</TableCell>
            <TableCell align='right'>{product.Picture}</TableCell>
            <TableCell align='right'>{product.Description}</TableCell>
            <TableCell align='right'>{product.Discount}</TableCell>
            <TableCell align='right'>{product.Category}</TableCell>
            <TableCell align='right'>
              <Button
                style={{ backgroundColor: '#931C43', color: 'white' }}
                onClick={() => {
                  this.deleteProduct(product)
                }}
              >
                Poista Tuote
              </Button>
            </TableCell>
          </TableRow>
        </Fragment>
      )
    })

    return (
      <Fragment>
        <AdminBar />

        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Tuote</TableCell>
                <TableCell align='right'>Nimi</TableCell>
                <TableCell align='right'>Hinta</TableCell>
                <TableCell align='right'>Määrä</TableCell>
                <TableCell align='right'>Kuva</TableCell>
                <TableCell align='right'>Kuvaus</TableCell>
                <TableCell align='right'>Alennus</TableCell>
                <TableCell align='right'>Kategoria</TableCell>
                <TableCell align='right' />
              </TableRow>
            </TableHead>
            <TableBody>{productList}</TableBody>
          </Table>
        </Paper>
      </Fragment>
    )
  }
}

export default withStyles(styles)(GovernProducts)

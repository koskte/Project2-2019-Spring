import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Divider, Grid, ListItem, List, Button } from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'

const styles = (theme) => ({
  paper : {
    margin  : 20,
    padding : 20,
    height  : '100%'
  },
  title : {
    marginTop    : 10,
    marginBottom : 5
  }
})

//Shows the information of the order.
class OrderConfirmation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderId : this.props.orderId,
      order   : []
    }
  }

  //fetches the information of the order.
  componentDidMount() {
    fetch(`/getOrderById/${this.props.orderId}`)
      .then((res) => {
        return res.json()
      })
      .then((json) => {
        let products = JSON.parse(json[0].Products)
        this.setState({ order: json, products: products })
      })
  }

  render() {
    const { classes } = this.props

    return (
      <Fragment>
        <Grid item xs={12}>
          <Typography variant='h3'>Tilausvahvistus</Typography>
          <Divider />
        </Grid>
        <Grid item>
          {this.state.order.map((item) => {
            let x = 0
            return (
              <Grid item xs={12} md={6}>
                <Grid item>
                  <h5 className={classes.title}>Tilaaja:</h5> {'\n'} {item.name}
                </Grid>
                <Grid item>
                  <h5 className={classes.title}>Puhelin:</h5> {'\n'} {item.phone}
                </Grid>
                <Grid item>
                  <h5 className={classes.title}>Sähköposti:</h5> {'\n'} {item.email}
                </Grid>
                <Grid item>
                  <h5 className={classes.title}>Toimitustapa:</h5> {'\n'} {item.deliveryMethod}
                </Grid>
                <Grid item>
                  <h5 className={classes.title}>Valtio:</h5> {'\n'} {item.Country}
                </Grid>
                <Grid item>
                  <h5 className={classes.title}>Kaupunki:</h5> {'\n'} {item.City}
                </Grid>
                <Grid item>
                  <h5 className={classes.title}>Postinumero:</h5> {'\n'} {item.Zip}
                </Grid>
                <Grid item>
                  <h5 className={classes.title}>Osoite:</h5> {'\n'} {item.Address}
                </Grid>
                <Grid item>
                  <h5 className={classes.title}>Maksutapa:</h5> {'\n'} {item.PaymentMethod}
                </Grid>
                <h5 className={classes.title}>Tuotteet</h5>
                <List>
                  {this.state.products.map((product) => {
                    x = x + 1

                    return (
                      <ListItem key={x}>
                        {product.Name} {product.Price} €
                      </ListItem>
                    )
                  })}
                </List>
                <Grid item>
                  <h5 className={classes.title}>Hinta Alennuksilla:</h5> {'\n'} {item.TotalPrice} €
                </Grid>
              </Grid>
            )
          })}
          <Grid item>
            <Button
              variant='contained'
              style={{ backgroundColor: '#931C43', color: 'white' }}
              component={RouterLink}
              to='/'
            >
              Etusivulle
            </Button>
          </Grid>
        </Grid>
      </Fragment>
    )
  }
}

export default withStyles(styles)(OrderConfirmation)

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/IconButton'
import Fade from '@material-ui/core/Fade'
import { Link as RouterLink } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import { List, ListItem, Link } from '@material-ui/core'
const styles = (theme) => ({
  cart        : {
    textAlign : 'center'
  },
  button      : {
    color           : '#931C43',
    backgroundColor : 'white',
    '&:hover'       : {
      backgroundColor : '#d1d1d1',
      borderRadius    : theme.shape.borderRadius
    }
  },
  closeButton : {
    color : 'black'
  },
  cartItem    : {
    padding : 10
  },
  delete      : {
    paddingLeft   : 5,
    paddingRight  : 5,
    paddingTop    : 0,
    paddingBottom : 0,
    fontSize      : 'inherit',
    '&:hover'     : {
      backgroundColor : 'inherit'
    }
  },
  paper       : {
    padding      : 10,
    borderRadius : theme.shape.borderRadius
  }
})

//The small shopping cart that pops out when pressing the shopping cart icon in the navigation.
class SimplePopper extends React.Component {
  state = {
    anchorEl : null,
    open     : false
  }

  //Handles the clicks of the cart.
  handleClick = (event) => {
    const { currentTarget } = event
    if (this.props.shoppingCart.length !== 0) {
      this.setState((state) => ({
        anchorEl : currentTarget,
        open     : !state.open
      }))
    }
    if (this.props.shoppingCart.length === 0) {
      this.setState((state) => ({
        open : false
      }))
    }
  }

  render() {
    const { classes } = this.props
    const { anchorEl, open } = this.state
    const id = open ? 'simple-popper' : null
    let listKey = 0

    let totalPrice = 0
    for (let item of this.props.shoppingCart) {
      totalPrice = totalPrice + item.Price
    }

    return (
      <div style={{ color: 'blue' }}>
        <Button variant='contained' color='primary' onClick={this.handleClick} className={classes.button}>
          <AddShoppingCartIcon className={classes.typography} />
        </Button>
        <Popper style={{ backgroundColor: 'blue' }} id={id} open={open} anchorEl={anchorEl} transition placement='left'>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper className={classes.paper}>
                <Typography align='center' variant='h6'>
                  Ostoksesi
                </Typography>
                <Typography align='center'>
                  <Button onClick={this.handleClick} className={classes.closeButton}>
                    Sulje Ostoskori
                  </Button>
                </Typography>
                <List>
                  {this.props.shoppingCart.map((item) => {
                    listKey = listKey + 1
                    return (
                      <ListItem key={listKey} divider={true}>
                        <Typography>
                          {item.Name} {item.Price}€
                        </Typography>
                        <Button
                          onClick={() => {
                            this.props.deleteFromShoppingCart(item)
                          }}
                        >
                          X
                        </Button>
                      </ListItem>
                    )
                  })}
                  <ListItem key='totalPrice' divider={true}>
                    <Typography>Yhteensä: {totalPrice} €</Typography>
                  </ListItem>
                  <ListItem key='Link' divider={true}>
                    <Link component={RouterLink} to='/ShoppingCart'>
                      <Typography variant='h6' className={classes.linkText} onClick={this.handleClick}>
                        Ostoskoriin
                      </Typography>
                    </Link>
                  </ListItem>
                </List>
              </Paper>
            </Fade>
          )}
        </Popper>
      </div>
    )
  }
}

SimplePopper.propTypes = {
  classes : PropTypes.object.isRequired
}

export default withStyles(styles)(SimplePopper)

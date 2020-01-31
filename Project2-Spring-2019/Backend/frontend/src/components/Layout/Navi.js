import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { fade } from '@material-ui/core/styles/colorManipulator'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import {
  Drawer,
  List,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Divider,
  ListItem,
  ExpansionPanelActions
} from '@material-ui/core'
import { products } from '../Categories'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Link as RouterLink } from 'react-router-dom'
import ShoppingCartModal from '../shoppingCartPopper'
import Link from '@material-ui/core/Link'
import auth from '../Auth'
import { withRouter } from 'react-router-dom'

const styles = (theme) => ({
  list             : {
    width : 300
  },
  root             : {
    flexGrow        : 1,
    backgroundColor : '#931C43',
    width           : '100%',
    padding         : 0,
    margin          : 0,
    minWidth        : '100vw'
  },
  grow             : {
    flexGrow : 1
  },
  menuButton       : {
    marginLeft  : -12,
    marginRight : 20
  },
  linkText         : {
    paddingRight : 5,
    paddingLeft  : 5,
    '&:hover'    : {
      border          : '2px solid rgba(103, 128, 159, 0.5)',
      textDecoration  : 'none',
      backgroundColor : '#AE5572',
      borderRadius    : theme.shape.borderRadius
    }
  },
  search           : {
    position                     : 'relative',
    borderRadius                 : theme.shape.borderRadius,
    backgroundColor              : fade(theme.palette.common.white, 0.15),
    '&:hover'                    : {
      backgroundColor : fade(theme.palette.common.white, 0.25)
    },
    marginRight                  : theme.spacing.unit * 2,
    marginLeft                   : 0,
    width                        : '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft : theme.spacing.unit * 3,
      width      : 'auto'
    }
  },
  searchIcon       : {
    width          : theme.spacing.unit * 9,
    height         : '100%',
    position       : 'absolute',
    pointerEvents  : 'none',
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center'
  },
  inputRoot        : {
    width : '100%'
  },
  inputInput       : {
    paddingTop                   : theme.spacing.unit,
    paddingRight                 : theme.spacing.unit,
    paddingBottom                : theme.spacing.unit,
    paddingLeft                  : theme.spacing.unit * 10,
    transition                   : theme.transitions.create('width'),
    width                        : '100%',
    [theme.breakpoints.up('md')]: {
      width : 200
    }
  },
  textDivider      : {
    color        : 'white',
    paddingRight : 5,
    paddingLeft  : 5
  },
  text             : {
    color : 'white'
  },
  button           : {
    '&:hover' : {
      borderRadius : theme.shape.borderRadius
    }
  },
  sideLink         : {
    width     : 'auto',
    '&:hover' : {
      border         : '2px solid rgba(103, 128, 159, 0.5)',
      cursor         : 'pointer',
      padding        : 5,
      textDecoration : 'none',
      borderRadius   : theme.shape.borderRadius
    }
  },
  desktopMenu      : {
    backgroundColor              : '#931C43',
    display                      : 'none',
    [theme.breakpoints.up('md')]: {
      display : 'flex'
    }
  },
  mobileMenu       : {
    [theme.breakpoints.up('md')]: {
      display : 'none'
    }
  },
  mobileMenuButton : {
    marginLeft                   : -12,
    marginRight                  : 20,
    [theme.breakpoints.up('md')]: {
      display : 'none'
    }
  },
  mobileExpansion  : {
    flexGrow : 1
  },
  notice           : {
    margin          : 10,
    padding         : 10,
    borderRadius    : theme.shape.borderRadius,
    color           : 'white',
    backgroundColor : '#AE5572'
  }
})

//Navigation bar Containing all the navigation needs.
class Navi extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value    : '',
      expanded : false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  //Handles changes in the search bar.
  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  //Handles the submit of the search bar.
  //Sends the search term to parent and redirects to the front page where the search result is shown.
  handleSubmit(event) {
    this.props.searchItems(this.state.value)
    this.toggleMenu()
    this.props.history.push('/')
  }

  //Toggles the menu.
  toggleMenu() {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const { classes } = this.props
    const sideList = (
      <div className={classes.list}>
        <List>
          <ListItem
            key='all'
            onClick={() => {
              this.props.setCategory('all')
              this.props.buttonClicked()
            }}
          >
            <Link
              to={`/`}
              onClick={() => {
                this.props.history.push('/')
              }}
              className={classes.sideLink}
            >
              Kaikki Tuotteet
            </Link>
            <Divider variant='fullWidth' />
          </ListItem>
          {products.map((item) => {
            for (let category in item) {
              return (
                <ExpansionPanel key={category}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{category}</Typography>
                  </ExpansionPanelSummary>

                  <ExpansionPanelDetails>
                    <List>
                      {item[category].map((p) => {
                        return (
                          <List key={p} onClick={() => this.props.setCategory(p)}>
                            <Link
                              to={`/`}
                              onClick={() => {
                                this.props.history.push('/')
                                this.props.buttonClicked()
                              }}
                              className={classes.sideLink}
                            >
                              {p}
                            </Link>
                            <Divider variant='fullWidth' />
                          </List>
                        )
                      })}
                    </List>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              )
            }
            return null
          })}
        </List>
      </div>
    )

    const mobileMenu = (
      <div>
        <IconButton
          onClick={() => this.props.buttonClicked(true)}
          className={classes.mobileMenuButton}
          color='inherit'
          aria-label='Menu'
        >
          <MenuIcon />
        </IconButton>
        <div className={classes.mobileMenu}>
          <ExpansionPanel expanded={this.state.expanded}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} onClick={() => this.toggleMenu()}>
              <Typography>Valikko</Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelActions>
              <ShoppingCartModal
                style={{
                  backgroundColor : 'black',
                  display         : 'block',
                  marginLeft      : 'auto',
                  marginRight     : 'auto',
                  width           : '50%'
                }}
                shoppingCart={this.props.shoppingCart}
                deleteFromShoppingCart={this.props.deleteFromShoppingCart}
              />
            </ExpansionPanelActions>

            <ExpansionPanelDetails>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    this.handleSubmit()
                  }}
                >
                  <InputBase
                    type='text'
                    value={this.state.value}
                    onChange={this.handleChange}
                    classes={{
                      root  : classes.inputRoot,
                      input : classes.inputInput
                    }}
                  />
                </form>
              </div>
            </ExpansionPanelDetails>

            <ExpansionPanelDetails onClick={() => this.toggleMenu()}>
              <div className={classes.mobileExpansion} />
              <Link component={RouterLink} to='/'>
                <Typography
                  variant='h6'
                  onClick={() => {
                    this.props.setCategory('all')
                  }}
                >
                  Kauppa
                </Typography>
              </Link>
              <div className={classes.mobileExpansion} />
            </ExpansionPanelDetails>

            {auth.isAdminAuthenticated() ? (
              <ExpansionPanelDetails onClick={() => this.toggleMenu()}>
                <div className={classes.mobileExpansion} />
                <Link to='/admin' component={RouterLink} className={classes.linkText}>
                  <Typography variant='h6'>Admin Sivut</Typography>
                </Link>
                <div className={classes.mobileExpansion} />
              </ExpansionPanelDetails>
            ) : (
              ''
            )}

            {this.props.loggedIn ? (
              <ExpansionPanelDetails onClick={() => this.toggleMenu()}>
                <Fragment>
                  <div className={classes.mobileExpansion} />
                  <Link className={classes.linkText} component={RouterLink} to='/CustomerPage'>
                    <Typography variant='h6'>Omat Sivut</Typography>
                  </Link>
                  <div className={classes.mobileExpansion} />
                </Fragment>
              </ExpansionPanelDetails>
            ) : (
              ''
            )}

            <ExpansionPanelDetails onClick={() => this.toggleMenu()}>
              {this.props.loggedIn ? (
                <Fragment>
                  <div className={classes.mobileExpansion} />
                  <Link
                    className={classes.linkText}
                    component={RouterLink}
                    to='/'
                    onClick={() =>
                      auth.logout(() => {
                        this.props.updateNavi()
                      })}
                  >
                    <Typography variant='h6'>Kirjaudu ulos</Typography>
                  </Link>
                  <div className={classes.mobileExpansion} />
                </Fragment>
              ) : (
                <Fragment>
                  <div className={classes.mobileExpansion} onClick={() => this.toggleMenu()} />
                  <Link className={classes.linkText} component={RouterLink} to='/login'>
                    <Typography variant='h6'>Kirjaudu sisään</Typography>
                  </Link>
                  <div className={classes.mobileExpansion} />
                </Fragment>
              )}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </div>
    )
    return (
      <Fragment>
        <div className={classes.desktopMenu}>
          <div className={classes.root}>
            <AppBar position='static' style={{ backgroundColor: '#931C43' }}>
              <Toolbar>
                <IconButton
                  onClick={() => this.props.buttonClicked(true)}
                  className={classes.menuButton}
                  color='inherit'
                  aria-label='Menu'
                >
                  <MenuIcon />
                </IconButton>
                <Link component={RouterLink} to='/'>
                  <Typography
                    variant='h6'
                    className={classes.text}
                    onClick={() => {
                      this.props.setCategory('all')
                    }}
                  >
                    Kauppa
                  </Typography>
                </Link>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      this.handleSubmit()
                    }}
                  >
                    <InputBase
                      type='text'
                      value={this.state.value}
                      onChange={this.handleChange}
                      classes={{
                        root  : classes.inputRoot,
                        input : classes.inputInput
                      }}
                    />
                  </form>
                </div>
                {auth.isAdminAuthenticated() ? (
                  <Link to='/admin' component={RouterLink} className={classes.linkText}>
                    <Typography variant='h6' className={classes.text}>
                      Admin Sivut
                    </Typography>
                  </Link>
                ) : (
                  ''
                )}

                <div className={classes.grow} />
                {this.props.toggleAlert ? <h5 className={classes.notice}>Lisätty Ostoskoriin</h5> : ''}
                <ShoppingCartModal
                  shoppingCart={this.props.shoppingCart}
                  deleteFromShoppingCart={this.props.deleteFromShoppingCart}
                />
                {this.props.loggedIn ? (
                  <Fragment>
                    <Link className={classes.linkText} component={RouterLink} to='/CustomerPage'>
                      <Typography variant='h6' className={classes.text}>
                        Omat Sivut
                      </Typography>
                    </Link>
                    <Typography variant='h6' className={classes.textDivider}>
                      {' '}
                      |{' '}
                    </Typography>
                    <Link
                      className={classes.linkText}
                      component={RouterLink}
                      to='/'
                      onClick={() =>
                        auth.logout(() => {
                          this.props.updateNavi()
                        })}
                    >
                      <Typography variant='h6' className={classes.text}>
                        Kirjaudu ulos
                      </Typography>
                    </Link>
                  </Fragment>
                ) : (
                  <Link className={classes.linkText} component={RouterLink} to='/login'>
                    <Typography variant='h6' className={classes.text}>
                      Kirjaudu sisään
                    </Typography>
                  </Link>
                )}
              </Toolbar>
            </AppBar>
          </div>
          <div>
            <Drawer open={this.props.toggle}>
              <Button
                tabIndex={0}
                className={classes.button}
                onClick={() => this.props.buttonClicked(false)}
                onKeyDown={() => this.props.buttonClicked(false)}
              >
                close
              </Button>
              <div>{sideList}</div>
            </Drawer>
          </div>
        </div>
        {mobileMenu}
      </Fragment>
    )
  }
}

Navi.propTypes = {
  classes : PropTypes.object.isRequired
}

export default withRouter(withStyles(styles)(Navi))

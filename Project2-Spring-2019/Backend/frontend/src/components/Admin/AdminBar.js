import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import { AppBar, Toolbar, Typography } from '@material-ui/core'

const styles = {
  grow : {
    flexGrow : 1
  },
  root : {
    marginTop : 20,
    maxWidth  : 1500,
    margin    : 'auto auto'
  },
  link : {
    margin : 10
  }
}
// contains the links of admin functions.
class AdminBar extends Component {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Link to='/admin/addAdmin' className={classes.link}>
              <Typography variant='h6' className={classes.linkText}>
                Lisää Admin-käyttäjä
              </Typography>
            </Link>
            <Link to='/admin/addProduct' className={classes.link}>
              <Typography variant='h6' className={classes.linkText}>
                Lisää Tuote
              </Typography>
            </Link>
            <Link to='/admin/governUsers' className={classes.link}>
              <Typography variant='h6' className={classes.linkText}>
                Hallitse käyttäjiä
              </Typography>
            </Link>
            <Link to='/admin/governProducts' className={classes.link}>
              <Typography variant='h6' className={classes.linkText}>
                Hallitse Tuotteita
              </Typography>
            </Link>
            <div className={classes.grow} />
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(styles)(AdminBar)

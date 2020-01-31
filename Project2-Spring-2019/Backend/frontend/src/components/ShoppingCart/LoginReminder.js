import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Button, Divider, Grid, Link } from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
const styles = (theme) => ({
  paper  : {
    margin  : 20,
    padding : 20,
    height  : '100%'
  },
  button : {
    margin : 10
  }
})

//Shown if the user is not logged in. Shows links to the login and register pages.
class LoginReminder extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { classes } = this.props

    return (
      <Fragment>
        <Grid item xs={12}>
          <Typography variant='h3'>Kirjautuminen</Typography>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Button className={classes.button} variant='contained' style={{ backgroundColor: '#931C43', color: 'white' }}>
            <Link block={true} component={RouterLink} to={`/login`}>
              Kirjaudu Sisään
            </Link>
          </Button>

          <Button className={classes.button} variant='contained' style={{ backgroundColor: '#931C43', color: 'white' }}>
            <Link block={true} component={RouterLink} to='/registration'>
              Rekisteröidy
            </Link>
          </Button>
        </Grid>

        <Grid item>
          <Button
            className={classes.button}
            variant='contained'
            style={{ backgroundColor: '#931C43', color: 'white' }}
            onClick={() => {
              this.props.changeTheStage(-1)
            }}
          >
            Edellinen
          </Button>
          <Button
            className={classes.button}
            variant='contained'
            style={{ backgroundColor: '#931C43', color: 'white' }}
            onClick={() => {
              this.props.changeTheStage(1)
            }}
          >
            Seuraava
          </Button>
        </Grid>
      </Fragment>
    )
  }
}
export default withStyles(styles)(LoginReminder)

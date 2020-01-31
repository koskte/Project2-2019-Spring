import React, { Fragment, Component } from 'react'
import { Paper, InputLabel, Input, Typography, Button } from '@material-ui/core'
import { FormControl } from '@material-ui/core'
import { withStyles } from '@material-ui/core'
import { Link, Redirect } from 'react-router-dom'
import auth from './Auth'
const styles = (theme) => ({
  paper  : {
    display       : 'flex',
    flexDirection : 'column',
    alignItems    : 'center',
    paddingLeft   : 40,
    paddingRight  : 40
  },
  topDiv : {
    margin                         : 'auto auto',
    width                          : 400,
    marginTop                      : 100,
    [theme.breakpoints.down('md')]: {
      width : 350
    }
  },
  button : {
    marginTop    : 50,
    marginBottom : 20
  },
  form   : {
    marginTop : 50
  },
  signIn : {
    marginTop : 15
  }
})

//Login component that is used by both regular users and admins.
class Login extends Component {
  constructor(props) {
    super(props)
    this.login = this.login.bind(this)
  }
  state = {
    email    : '',
    password : '',
    asd      : false
  }
  //redirects to main page.
  redir() {
    return <Redirect to='/' />
  }

  //Login function.
  login() {
    auth.login(this.state.email, this.state.password, () => {
      if (auth.isAdminAuthenticated()) {
        this.props.updateNavi()
        this.props.history.push('/admin')
      } else if (auth.isAuthenticated()) {
        this.props.updateNavi()
        this.props.history.push('/')
      }
    })
  }
  render() {
    const { classes } = this.props
    return (
      <Fragment>
        <div className={classes.topDiv}>
          <Paper className={classes.paper}>
            <Typography component='h1' variant='h5' className={classes.signIn}>
              Kirjaudu sisään
            </Typography>
            <form
              className={classes.form}
              onSubmit={(event) => {
                this.login()
                event.preventDefault()
              }}
            >
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='email'>Sähköposti</InputLabel>
                <Input
                  id='email'
                  name='email'
                  autoComplete='email'
                  autoFocus
                  value={this.state.email}
                  onChange={(event) => {
                    this.setState({ email: event.target.value })
                  }}
                />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='password'>Salasana</InputLabel>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  value={this.state.password}
                  onChange={(event) => {
                    this.setState({ password: event.target.value })
                  }}
                />
              </FormControl>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                style={{ backgroundColor: '#931C43', color: 'white' }}
                className={classes.button}
                onClick={this.login}
              >
                Kirjaudu sisään
              </Button>
            </form>
            <InputLabel>Etkö omista tiliä?</InputLabel>
            <InputLabel>
              <Link to='/registration'>Rekisteröidy tästä!</Link>
            </InputLabel>
          </Paper>
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(Login)

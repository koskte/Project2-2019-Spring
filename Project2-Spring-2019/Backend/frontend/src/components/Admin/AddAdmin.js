import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core'
import { Paper, Typography, FormControl, Input, InputLabel, Button } from '@material-ui/core'
import AdminBar from './AdminBar'
import auth from '../Auth'
import { Redirect } from 'react-router-dom'
const styles = {
  paper  : {
    display       : 'flex',
    flexDirection : 'column',
    alignItems    : 'center',
    paddingLeft   : 40,
    paddingRight  : 40
  },
  topDiv : {
    margin    : 'auto auto',
    width     : 400,
    marginTop : 100
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
}

class AddAdmin extends Component {
  constructor(props) {
    super(props)
    this.checkPassword = this.checkPassword.bind(this)
    this.submit = this.submit.bind(this)
    this.checkEmailAvailability = this.checkEmailAvailability.bind(this)
  }
  state = {
    usedEmails     : [],
    emailAvailable : false,
    emailError     : false,
    firstname      : '',
    lastname       : '',
    email          : '',
    password       : '',
    streetAddress  : '',
    city           : '',
    zip            : '',
    country        : '',
    phoneNumber    : '',
    passwordAgain  : '',
    error          : false
  }

  //Checks the password against the repeated password.
  checkPassword(secondPassword) {
    if (secondPassword !== this.state.password && secondPassword !== '') {
      this.setState({ error: true })
    } else {
      this.setState({ error: false })
    }
  }

  //Checks the database for a existing duplicate of given email address.
  checkEmailAvailability(userEmail) {
    let counter = 0
    for (let email in this.state.usedEmails) {
      if (this.state.usedEmails[email] === userEmail) {
        this.setState({ emailError: true })
        counter++
      }
    }
    if (counter === 0) {
      this.setState({ emailError: false })
      this.setState({ emailAvailable: true })
    }
  }

  //if email is unique, submit a new admin to the database.
  submit() {
    if (this.state.emailAvailable) {
      fetch('/registerAdmin', {
        method  : 'post',
        headers : {
          Accept         : 'application/json',
          'Content-type' : 'application/json'
        },
        body    : JSON.stringify({
          firstname     : this.state.firstname,
          lastname      : this.state.lastname,
          email         : this.state.email,
          password      : this.state.password,
          streetAddress : this.state.streetAddress,
          city          : this.state.city,
          zip           : this.state.zip,
          country       : this.state.country,
          phoneNumber   : this.state.phoneNumber
        })
      }).then((res) => {
        if (res.status === 200) {
          fetch('/hash', {
            method  : 'post',
            headers : {
              Accept         : 'application/json',
              'Content-type' : 'application/json'
            },
            body    : JSON.stringify({
              email : this.state.email
            })
          }).then((res) => {
            if (res.status === 200) {
              alert('Rekisteröityminen onnistui!')
              this.setState({
                firstname     : '',
                lastname      : '',
                email         : '',
                password      : '',
                streetAddress : '',
                city          : '',
                zip           : '',
                country       : '',
                phoneNumber   : '',
                passwordAgain : '',
                error         : false
              })
            }
          })
          let emails = []
          fetch('/users')
            .then((res) => {
              return res.json()
            })
            .then((users) => {
              for (let user in users) {
                emails[user] = users[user].Email
              }
              this.setState({ usedEmails: emails })
            })
        }
      })
    } else if (this.state.emailAvailable === false) {
      alert('email already taken!')
    }
  }

  //after the component has loaded, fetch all emails from database.
  componentDidMount() {
    let emails = []
    fetch('/users')
      .then((res) => {
        return res.json()
      })
      .then((users) => {
        for (let user in users) {
          emails[user] = users[user].Email
        }
        this.setState({ usedEmails: emails })
      })
  }

  render() {
    //if there is no admin in the present, redirect the lurker back to the mainpage
    if (auth.isAdminAuthenticated() === false) {
      return <Redirect to='/' />
    }
    const { classes } = this.props
    return (
      <Fragment>
        <AdminBar />
        <div className={classes.topDiv}>
          <Paper className={classes.paper}>
            <Typography component='h1' variant='h5' className={classes.signIn}>
              Lisää Admin-käyttäjä
            </Typography>
            <form className={classes.form}>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='firstname'>Etunimi</InputLabel>
                <Input
                  id='firstname'
                  name='firstname'
                  autoComplete='firstname'
                  autoFocus
                  value={this.state.firstname}
                  onChange={(event) => {
                    this.setState({ firstname: event.target.value })
                  }}
                />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='lastname'>Sukunimi</InputLabel>
                <Input
                  id='lastname'
                  name='lastname'
                  autoComplete='lastname'
                  autoFocus
                  value={this.state.lastname}
                  onChange={(event) => {
                    this.setState({ lastname: event.target.value })
                  }}
                />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='email'>Sähköposti</InputLabel>
                <Input
                  id='email'
                  name='email'
                  autoComplete='email'
                  autoFocus
                  value={this.state.email}
                  error={this.state.emailError}
                  onChange={(event) => {
                    this.setState({ email: event.target.value })
                    this.checkEmailAvailability(event.target.value)
                  }}
                />
              </FormControl>
              {this.state.emailError ? <p>Sähköposti on jo käytössä</p> : ''}
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='streetAddress'>Katuosoite</InputLabel>
                <Input
                  id='streetAddress'
                  name='streetAddress'
                  autoComplete='streetAddress'
                  autoFocus
                  value={this.state.streetAddress}
                  onChange={(event) => {
                    this.setState({ streetAddress: event.target.value })
                  }}
                />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='zip'>Postinumero</InputLabel>
                <Input
                  id='zip'
                  name='zip'
                  autoComplete='zip'
                  autoFocus
                  value={this.state.zip}
                  onChange={(event) => {
                    this.setState({ zip: event.target.value })
                  }}
                />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='city'>Kaupunki</InputLabel>
                <Input
                  id='city'
                  name='city'
                  autoComplete='city'
                  autoFocus
                  value={this.state.city}
                  onChange={(event) => {
                    this.setState({ city: event.target.value })
                  }}
                />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='country'>Maa</InputLabel>
                <Input
                  id='country'
                  name='country'
                  autoComplete='country'
                  autoFocus
                  value={this.state.country}
                  onChange={(event) => {
                    this.setState({ country: event.target.value })
                  }}
                />
              </FormControl>
              <FormControl margin='normal' fullWidth>
                <InputLabel htmlFor='phoneNumber'>Puhelinnumero</InputLabel>
                <Input
                  id='phoneNumber'
                  name='phoneNumber'
                  autoComplete='phoneNumber'
                  autoFocus
                  value={this.state.phoneNumber}
                  onChange={(event) => {
                    this.setState({ phoneNumber: event.target.value })
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
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='passwordAgain'>Salasana uudelleen</InputLabel>
                <Input
                  id='passwordAgain'
                  name='passwordAgain'
                  type='password'
                  value={this.state.passwordAgain}
                  error={this.state.error}
                  onChange={(event) => {
                    this.setState({ passwordAgain: event.target.value })
                    this.checkPassword(event.target.value)
                  }}
                />
              </FormControl>
              <Button
                fullWidth
                variant='contained'
                style={{ backgroundColor: '#931C43', color: 'white' }}
                className={classes.button}
                onClick={this.submit}
              >
                Rekisteröidy
              </Button>
            </form>
          </Paper>
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(AddAdmin)

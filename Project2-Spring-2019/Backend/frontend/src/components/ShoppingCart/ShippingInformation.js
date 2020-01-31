import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Button, Divider, Grid, FormControl, InputLabel, Input } from '@material-ui/core'
import auth from '../Auth'
const styles = (theme) => ({
  textField : {
    marginLeft  : theme.spacing.unit,
    marginRight : theme.spacing.unit,
    width       : 200
  }
})

// Gets the shipping information of the user. if the user is logged in, the form is autofilled.
class ShippingInformation extends Component {
  constructor(props) {
    super(props)
    if (auth.loggedIn()) {
      this.state = {
        name         : sessionStorage.getItem('fullName'),
        address      : sessionStorage.getItem('address'),
        postalNumber : sessionStorage.getItem('zip'),
        city         : sessionStorage.getItem('city'),
        phone        : sessionStorage.getItem('phone'),
        email        : sessionStorage.getItem('email')
      }
    } else {
      this.state = {
        name         : props.shippingInfo.name,
        address      : props.shippingInfo.address,
        postalNumber : props.shippingInfo.postalNumber,
        city         : props.shippingInfo.city,
        phone        : props.shippingInfo.phone,
        email        : props.shippingInfo.email
      }
    }

    this.handleName = this.handleName.bind(this)
    this.handleAddress = this.handleAddress.bind(this)
    this.handlePostal = this.handlePostal.bind(this)
    this.handleCity = this.handleCity.bind(this)
    this.handlePhone = this.handlePhone.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
  }

  //Handles the name input in the form.
  handleName(e) {
    this.setState({ name: e.target.value })
  }

  //Handles the address input in the form.
  handleAddress(e) {
    this.setState({ address: e.target.value })
  }

  //Handles the postal input in the form.
  handlePostal(e) {
    this.setState({ postalNumber: e.target.value })
  }

  //Handles the city input in the form.
  handleCity(e) {
    this.setState({ city: e.target.value })
  }

  //Handles the phone input in the form.
  handlePhone(e) {
    this.setState({ phone: e.target.value })
  }

  //Handles the email input in the form.
  handleEmail(e) {
    this.setState({ email: e.target.value })
  }

  //Handles the submit of the form
  handleSubmit() {
    let shippingInfo = {
      name         : this.state.name,
      address      : this.state.address,
      postalNumber : this.state.postalNumber,
      city         : this.state.city,
      phone        : this.state.phone,
      email        : this.state.email
    }
    this.props.handleShipping(shippingInfo)
  }

  render() {
    console.log(sessionStorage.getItem('userId'))
    const { classes } = this.props
    const { name, address, postalNumber, city, phone, email } = this.state
    const enabled =
      name.length > 0 &&
      address.length > 0 &&
      postalNumber.length > 0 &&
      city.length > 0 &&
      phone.length > 0 &&
      email.length > 0

    return (
      <Fragment>
        <Grid item xs={12}>
          <Typography variant='h3'>Osoitetiedot</Typography>
          <Divider />
        </Grid>

        <Grid item>
          <FormControl margin='normal' required fullWidth>
            <InputLabel htmlFor='Nimi'>Nimi</InputLabel>
            <Input
              id='name'
              name='name'
              value={this.state.name}
              onChange={this.handleName}
              autoComplete='name'
              autoFocus
            />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl margin='normal' required fullWidth>
            <InputLabel htmlFor='address'>Osoite</InputLabel>
            <Input
              id='address'
              name='address'
              value={this.state.address}
              onChange={this.handleAddress}
              autoComplete='address'
            />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl margin='normal' required fullWidth>
            <InputLabel htmlFor='address'>Postinumero</InputLabel>
            <Input
              id='postalNumber'
              name='postalNumber'
              value={this.state.postalNumber}
              onChange={this.handlePostal}
              autoComplete='postalNumber'
            />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl margin='normal' required fullWidth>
            <InputLabel htmlFor='city'>Kaupunki</InputLabel>
            <Input id='city' name='city' value={this.state.city} onChange={this.handleCity} autoComplete='city' />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl margin='normal' required fullWidth>
            <InputLabel htmlFor='city'>Puhelin</InputLabel>
            <Input id='phone' name='phone' value={this.state.phone} onChange={this.handlePhone} autoComplete='phone' />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl margin='normal' required fullWidth>
            <InputLabel htmlFor='email'>Sähköposti</InputLabel>
            <Input id='email' name='email' value={this.state.email} onChange={this.handleEmail} autoComplete='email' />
          </FormControl>
        </Grid>

        <Grid item>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              this.handleSubmit()
              if (auth.loggedIn()) {
                this.props.changeTheStage(-2)
              } else {
                this.props.changeTheStage(-1)
              }
            }}
          >
            Edellinen
          </Button>
          <Button
            variant='contained'
            color='primary'
            disabled={!enabled}
            onClick={() => {
              this.handleSubmit()
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
export default withStyles(styles)(ShippingInformation)

import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core'
import { Paper, Typography, FormControl, Input, InputLabel, Button } from '@material-ui/core'
import AdminBar from './AdminBar'
import auth from '../Auth'
import { Redirect } from 'react-router-dom'
import * as firebase from 'firebase'

let storage = firebase.storage()
let storageRef = storage.ref()

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

class AddProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageFile   : [],
      Name        : '',
      Price       : '',
      Stock       : '',
      Picture     : '',
      Description : '',
      Discount    : '',
      Category    : ''
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  //After the form is valid and submitted, send the data of the new product to the backend.
  onSubmit() {
    console.log('picture: ' + this.state.Picture)
    let imageRef = storageRef.child('images/' + this.state.Picture)
    var metadata = {
      contentType : 'image/jpeg'
    }
    imageRef.put(this.state.imageFile[0], metadata).then((snapshot) => {
      fetch('/addProduct', {
        method  : 'post',
        headers : {
          Accept         : 'application/json',
          'Content-type' : 'application/json'
        },
        body    : JSON.stringify({
          Name        : this.state.Name,
          Price       : this.state.Price,
          Stock       : this.state.Stock,
          Picture     : this.state.Picture,
          Description : this.state.Description,
          Discount    : this.state.Discount,
          Category    : this.state.Category
        })
      }).then((res) => {
        if (res.status === 200) {
          alert('Tuote Lisätty')
        }
      })
    })
  }

  render() {
    //if there is no admin in the present, redirect the lurker back to the mainpage
    if (auth.isAdminAuthenticated() === false) {
      return <Redirect to='/' />
    }

    // validate the form data.
    const { Picture, Name, Price, Stock, Description, Discount, Category } = this.state
    const enabled =
      Picture.length > 0 &&
      Name.length > 0 &&
      Price.length > 0 &&
      Stock.length > 0 &&
      Description.length > 0 &&
      Discount.length > 0 &&
      Category.length > 0

    const { classes } = this.props
    return (
      <Fragment>
        <AdminBar />
        <div className={classes.topDiv}>
          <Paper className={classes.paper}>
            <Typography component='h1' variant='h5' className={classes.signIn}>
              Lisää Tuote
            </Typography>
            <form className={classes.form}>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='Name'>Tuotteen nimi</InputLabel>
                <Input
                  id='Name'
                  name='Name'
                  autoComplete='Name'
                  autoFocus
                  value={this.state.Name}
                  onChange={(event) => {
                    this.setState({ Name: event.target.value })
                  }}
                />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='Price'>Tuotteen hinta</InputLabel>
                <Input
                  id='Price'
                  name='Price'
                  autoComplete='Price'
                  autoFocus
                  value={this.state.Price}
                  onChange={(event) => {
                    this.setState({ Price: event.target.value })
                  }}
                />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='Stock'>Tuotetta varastossa</InputLabel>
                <Input
                  id='Stock'
                  name='Stock'
                  autoComplete='Stock'
                  autoFocus
                  value={this.state.Stock}
                  onChange={(event) => {
                    this.setState({ Stock: event.target.value })
                  }}
                />
              </FormControl>

              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='Description'>TuoteSeloste</InputLabel>
                <Input
                  id='Description'
                  name='Description'
                  autoComplete='Description'
                  autoFocus
                  value={this.state.Description}
                  onChange={(event) => {
                    this.setState({ Description: event.target.value })
                  }}
                />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='Discount'>Tuotteen alennus</InputLabel>
                <Input
                  id='Discount'
                  name='Discount'
                  autoComplete='Discount'
                  autoFocus
                  value={this.state.Discount}
                  onChange={(event) => {
                    this.setState({ Discount: event.target.value })
                  }}
                />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='Category'>Tuotteen kategoria</InputLabel>
                <Input
                  id='Category'
                  name='Category'
                  type='Category'
                  value={this.state.Category}
                  onChange={(event) => {
                    this.setState({ Category: event.target.value })
                  }}
                />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='Picture'>Kuva</InputLabel>
                <Input
                  type='file'
                  id='Picture'
                  name='Picture'
                  onChange={(event) => {
                    const files = Array.from(event.target.files)
                    console.log('files: ' + files[0].name)
                    this.setState({ imageFile: files, Picture: files[0].name })
                  }}
                />
              </FormControl>
              <Button
                fullWidth
                variant='contained'
                style={{ backgroundColor: '#931C43', color: 'white' }}
                className={classes.button}
                disabled={!enabled}
                onClick={this.onSubmit}
              >
                Lisää tuote
              </Button>
            </form>
          </Paper>
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(AddProduct)

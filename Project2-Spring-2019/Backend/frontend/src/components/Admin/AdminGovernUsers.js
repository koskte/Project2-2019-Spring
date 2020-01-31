import React, { Component, Fragment } from 'react'
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core'
import AdminBar from './AdminBar'
import Auth from '../Auth'
import { Redirect } from 'react-router-dom'

const styles = {
  root : {}
}

//User Governing.
class GovernUsers extends Component {
  state = {
    users : []
  }

  componentDidMount() {
    fetch('/users').then((res) => res.json()).then((users) => this.setState({ users }))
  }

  deleteUser(user) {
    let currentAdmin = sessionStorage.getItem('userId')
    console.log('current: ' + currentAdmin + ', user: ' + user.UserID)
    if (parseInt(currentAdmin) !== parseInt(user.UserID)) {
      fetch('/deleteUserById', {
        method  : 'delete',
        headers : {
          Accept         : 'application/json',
          'Content-type' : 'application/json'
        },
        body    : JSON.stringify({
          userId : user.UserID
        })
      })
        .then((res) => res.json())
        .then((res) => alert(res.message))
        .then(() => {
          fetch('/users').then((res) => res.json()).then((users) => this.setState({ users }))
        })
    } else {
      alert('Älä poista itseäsi!!!')
    }
  }

  render() {
    if (Auth.isAdminAuthenticated() === false) {
      return <Redirect to='/' />
    }
    const { classes } = this.props

    let userList = this.state.users.map((user) => {
      return (
        <Fragment>
          <TableRow key={user.UserID}>
            <TableCell component='th' scope='user'>
              {user.UserID}
            </TableCell>
            <TableCell align='right'>{user.firstname}</TableCell>
            <TableCell align='right'>{user.lastname}</TableCell>
            <TableCell align='right'>{user.Address}</TableCell>
            <TableCell align='right'>{user.City}</TableCell>
            <TableCell align='right'>{user.Email}</TableCell>
            <TableCell align='right'>{user.UserType}</TableCell>
            <TableCell align='right'>
              <Button
                style={{ backgroundColor: '#931C43', color: 'white' }}
                onClick={() => {
                  this.deleteUser(user)
                }}
              >
                Poista käyttäjä
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
                <TableCell>Käyttäjä</TableCell>
                <TableCell align='right'>Etunimi</TableCell>
                <TableCell align='right'>Sukunimi</TableCell>
                <TableCell align='right'>Osoite</TableCell>
                <TableCell align='right'>Kaupunki</TableCell>
                <TableCell align='right'>Sähköposti</TableCell>
                <TableCell align='right'>Tyyppi</TableCell>
                <TableCell align='right' />
              </TableRow>
            </TableHead>
            <TableBody>{userList}</TableBody>
          </Table>
        </Paper>
      </Fragment>
    )
  }
}

export default withStyles(styles)(GovernUsers)

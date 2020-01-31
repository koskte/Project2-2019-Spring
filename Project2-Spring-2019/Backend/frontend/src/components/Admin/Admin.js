import React, { Component } from 'react'
import AdminBar from './AdminBar'
import auth from '../Auth'
import { Redirect } from 'react-router-dom'
class Admin extends Component {

  //Admin Page containing links to the admin functions.
  render() {
    if(auth.isAdminAuthenticated() === false) {
      return <Redirect to="/" />
    }
    return (
      <div>
        <AdminBar />
      </div>
    )
  }
}

export default (Admin)

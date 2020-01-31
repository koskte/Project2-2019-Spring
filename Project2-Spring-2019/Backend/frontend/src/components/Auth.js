//Class containing all of the authorisation functions.
class Auth {

  constructor() {
    this.authenticated = false
    this.adminAuthenticated = false
  }

  //Login function.
  login(email, password, cb) {
    fetch('/login', {
      method  : 'post',
      headers : {
        Accept         : 'application/json',
        'Content-type' : 'application/json'
      },
      body    : JSON.stringify({
        email    : email,
        password : password
      })
    })
      .then((data) => {
        return data.json()
      })
      .then((user) => {
        if (user.length > 0) {
          if (user[0].UserType === 'slave') {
            this.authenticated = true
            sessionStorage.setItem('user', this.authenticated)
            sessionStorage.setItem('email', user[0].Email)
            sessionStorage.setItem('userId', user[0].UserID)
            sessionStorage.setItem('fullName', `${user[0].firstname} ${user[0].lastname}`)
            sessionStorage.setItem('address', user[0].Address)
            sessionStorage.setItem('zip', user[0].Zip)
            sessionStorage.setItem('city', user[0].City)
            sessionStorage.setItem('phone', user[0].Phone)
          } else if (user[0].UserType === 'admin') {
            this.adminAuthenticated = true
            sessionStorage.setItem('admin', this.adminAuthenticated)
            sessionStorage.setItem('email', user[0].Email)
            sessionStorage.setItem('userId', user[0].UserID)
            sessionStorage.setItem('fullName', `${user[0].firstname} ${user[0].lastname}`)
            sessionStorage.setItem('address', user[0].Address)
            sessionStorage.setItem('zip', user[0].Zip)
            sessionStorage.setItem('city', user[0].City)
            sessionStorage.setItem('phone', user[0].Phone)
          }
        } else {
          alert('Et onnistunut kirjautumisessa :(')
        }
      })
      .then(() => {
        cb()
      })
  }

  //Logout function.
  logout(cb) {
    this.authenticated = false
    this.adminAuthenticated = false
    sessionStorage.setItem('admin', this.adminAuthenticated)
    sessionStorage.setItem('user', this.authenticated)
    cb()
  }

  //Checks if the user is a regular user and logged in.
  isAuthenticated() {
    let key = sessionStorage.getItem('user')
    if (key === 'true') {
      key = true
    } else {
      key = false
    }
    return key
  }

  //Checks if the user is an admin and is logged in.
  isAdminAuthenticated() {
    let key = sessionStorage.getItem('admin')
    if (key === 'true') {
      key = true
    } else {
      key = false
    }
    return key
  }

  //Checks if an user or an admin is logged in.
  loggedIn() {
    if (this.isAuthenticated() || this.isAdminAuthenticated()) {
      return true
    } else {
      return false
    }
  }
}

export default new Auth()

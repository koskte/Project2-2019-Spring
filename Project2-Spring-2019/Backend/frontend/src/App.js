import React, { Component, Fragment } from 'react'
import './App.css'
import { Navi } from './components/Layout'
import { Route, BrowserRouter } from 'react-router-dom'
import MainPage from './components/MainPage'
import Login from './components/Login'
import ProductSite from './components/ProductSite'
import Registration from './components/Registration'
import Admin from './components/Admin/Admin'
import CustomerPage from './components/CustomerPage/Customer'
import AddAdmin from './components/Admin/AddAdmin'
import auth from './components/Auth'
import OrderPage from './components/ShoppingCart/OrderPage'
import AddProduct from './components/Admin/AddProduct'
import AdminGovernUsers from './components/Admin/AdminGovernUsers'
import productGovern from './components/Admin/productGovern'

//Contains most of the applications logic.
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      navToggle       : false,
      products        : [],
      category        : 'all',
      shoppingCart    : [],
      ProductName     : '',
      productImageUrl : '',
      addAlert        : false,
      loggedIn        : auth.loggedIn()
    }

    sessionStorage.setItem('stage', 1)
    this.getItems = this.getItems.bind(this)
    this.setCategory = this.setCategory.bind(this)
    this.addToShoppingCart = this.addToShoppingCart.bind(this)
    this.searchItems = this.searchItems.bind(this)
    this.deleteShoppingCart = this.deleteShoppingCart.bind(this)
    this.toggleAlert = this.toggleAlert.bind(this)
  }

  //Toggles the side navigation.
  toggleNavi = () => {
    this.setState({
      navToggle : !this.state.navToggle
    })
  }

  //fetches the products from backend.
  getItems() {
    let path = `/products/${this.state.category}`
    fetch(path)
      .then((res) => {
        return res.json()
      })
      .then((products) => {
        this.setState({ products: products })
      })

    if (sessionStorage.getItem('shoppingCart')) {
      let xy = sessionStorage.getItem('shoppingCart')
      xy = JSON.parse(xy)
      this.setState({ shoppingCart: xy })
    }
  }

  //Sets the shown category.
  setCategory(newCategory) {
    this.setState({ category: newCategory })
    setTimeout(() => {
      this.getItems()
    }, 250)
  }

  //uses the given search term and sends it to the backend.
  searchItems(searchTerm) {
    if (searchTerm.length > 0) {
      let path = `/search/${searchTerm}`
      fetch(path)
        .then((res) => {
          return res.json()
        })
        .then((products) => {
          this.setState({ products: products })
        })
    }
  }

  //Adds the given product to the shopping cart.
  addToShoppingCart(item) {
    let items = this.state.shoppingCart
    items.push(item)
    this.setState({ shoppingCart: items })
    setTimeout(() => {
      let jsonCart = JSON.stringify(this.state.shoppingCart)
      sessionStorage.setItem('shoppingCart', jsonCart)
    }, 10)
    this.toggleAlert()
    setTimeout(() => {
      this.toggleAlert()
    }, 2000)
  }

  //Toggles the shopping cart alerts
  toggleAlert() {
    this.setState({ addAlert: !this.state.addAlert })
  }

  //Deletes the given product from the shopping cart.
  deleteFromShoppingCart(item) {
    let items = this.state.shoppingCart
    items.splice(items.indexOf(item), 1)
    this.setState({ shoppingCart: items })
    setTimeout(() => {
      let jsonCart = JSON.stringify(this.state.shoppingCart)
      sessionStorage.setItem('shoppingCart', jsonCart)
    }, 10)
  }

  //Deletes the whole shopping cart. Used after the user has made an order.
  deleteShoppingCart() {
    const newCart = []
    this.setState({ shoppingCart: newCart })
    sessionStorage.setItem('shoppingCart', newCart)
  }

  //Sets the product name and image url to the state. used in the product page.
  getProductName(ProductName, url) {
    this.setState({ ProductName: ProductName, productImageUrl: url })
  }

  //Gives the navigation buttons for a logged in user.
  updateNavi() {
    if (auth.isAuthenticated() || auth.isAdminAuthenticated()) {
      this.setState({ loggedIn: true })
    } else {
      this.setState({ loggedIn: false })
    }
  }

  //when component is loaded, get products from backend.
  componentDidMount() {
    this.getItems()
  }

  render() {
    console.log('testi')
    return (
      <Fragment>
        <BrowserRouter>
          <Navi
            buttonClicked={this.toggleNavi.bind(this)}
            toggleAlert={this.state.addAlert}
            toggle={this.state.navToggle}
            setCategory={this.setCategory}
            shoppingCart={this.state.shoppingCart}
            searchItems={this.searchItems}
            deleteFromShoppingCart={this.deleteFromShoppingCart.bind(this)}
            loggedIn={this.state.loggedIn}
            updateNavi={this.updateNavi.bind(this)}
          />
          <Route
            exact
            path='/'
            render={(props) => (
              <MainPage
                {...props}
                products={this.state.products}
                addToShoppingCart={this.addToShoppingCart}
                getProductName={this.getProductName.bind(this)}
              />
            )}
            deleteFromShoppingCart={this.deleteFromShoppingCart.bind(this)}
            loggedIn={this.state.loggedIn}
            updateNavi={this.updateNavi.bind(this)}
          />
          <Route
            exact
            path='/productDetails'
            render={(props) => (
              <ProductSite
                {...props}
                ProductName={this.state.ProductName}
                productImageUrl={this.state.productImageUrl}
                addToShoppingCart={this.addToShoppingCart}
              />
            )}
          />
          <Route exact path='/login' render={(props) => <Login {...props} updateNavi={this.updateNavi.bind(this)} />} />
          <Route exact path='/CustomerPage' render={(props) => <CustomerPage {...props} />} />
          <Route
            exact
            path='/ShoppingCart'
            render={(props) => (
              <OrderPage
                {...props}
                shoppingCart={this.state.shoppingCart}
                deleteFromShoppingCart={this.deleteFromShoppingCart.bind(this)}
                deleteShoppingCart={this.deleteShoppingCart}
              />
            )}
          />
          <Route exact path='/registration' component={Registration} />
          <Route exact path='/admin' component={Admin} />
          <Route exact path='/admin/addAdmin' component={AddAdmin} />
          <Route exact path='/admin/governUsers' component={AdminGovernUsers} />
          <Route exact path='/admin/governProducts' component={productGovern} />
          <Route exact path='/admin/addProduct' component={AddProduct} />

        </BrowserRouter>
      </Fragment>
    )
  }
}

export default App

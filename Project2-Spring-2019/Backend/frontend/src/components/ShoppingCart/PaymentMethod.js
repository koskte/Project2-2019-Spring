import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Button, Divider, Grid, FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'

const styles = (theme) => ({
  paper: {
    margin: 20,
    padding: 20,
    height: '100%'
  }
})
// Gets the payment method that the user wants.
class PaymentMethod extends Component {
  constructor(props) {
    super(props)
    this.state = { value: props.method }
  }

  //handles change in the form.
  handleChange = (event) => {
    this.setState({ value: event.target.value })
  }

  //Handles the submit of the form.
  handleSubmit() {
    let paymentInfo = {
      method: this.state.value
    }
    this.props.handlePayment(paymentInfo)
  }

  render() {
    const { classes } = this.props
    const { value } = this.state
    const enabled = value.length > 0

    return (
      <Fragment>
        <Grid item xs={12}>
          <Typography variant="h3">Maksutapa</Typography>
          <Divider />
        </Grid>

        <Grid item>
          <FormControl component="fieldset" className={classes.formControl}>
            <RadioGroup name="payment" className={classes.group} value={this.state.value} onChange={this.handleChange}>
              <FormControlLabel value="kortti" control={<Radio />} label="Maksu kortilla" />
              <FormControlLabel value="verkkopankki" control={<Radio />} label="Verkkopankki" />
              <FormControlLabel value="lasku" control={<Radio />} label="Lasku" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            style={{ backgroundColor: '#931C43', color: 'white' }}
            onClick={() => {
              this.handleSubmit()
              this.props.changeTheStage(-1)
            }}
          >
            Edellinen
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: '#931C43', color: 'white' }}
            disabled={!enabled}
            onClick={() => {
              this.handleSubmit()
              this.props.changeTheStage(1)
            }}
          >
            Maksamaan
          </Button>
        </Grid>
      </Fragment>
    )
  }
}
export default withStyles(styles)(PaymentMethod)

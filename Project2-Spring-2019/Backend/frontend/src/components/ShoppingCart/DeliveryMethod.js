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


class DeliveryMethod extends Component {
  constructor(props) {
    super(props)
    this.state = { value: props.method }
  }

  //Handles the changes made in the form.
  handleChange = (event) => {
    this.setState({ value: event.target.value })
  }

  //Handles the submit of the form.
  handleSubmit() {
    let deliveryInfo = {
      method: this.state.value
    }
    this.props.handleDelivery(deliveryInfo)
  }

  render() {
    const { classes } = this.props
    const { value } = this.state
    const enabled = value.length > 0

    return (
      <Fragment>
        <Grid item xs={12}>
          <Typography variant="h3">Toimitus</Typography>
          <Divider />
        </Grid>

        <Grid item>
          <FormControl component="fieldset" className={classes.formControl}>
            <RadioGroup name="delivery" className={classes.group} value={this.state.value} onChange={this.handleChange}>
              <FormControlLabel value="tamk" control={<Radio />} label="Nouto Tampereen Ammattikorkeakoululta" />
              <FormControlLabel value="SmartPost" control={<Radio />} label="SmartPost" />
              <FormControlLabel value="kotiinkuljetus" control={<Radio />} label="Kotiinkuljetus" />
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
            Seuraava
          </Button>
        </Grid>
      </Fragment>
    )
  }
}
export default withStyles(styles)(DeliveryMethod)

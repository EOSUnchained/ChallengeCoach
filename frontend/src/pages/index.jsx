import React, { Component } from "react";
import { Api, JsonRpc, RpcError, JsSignatureProvider } from "eosjs"; // https://github.com/EOSIO/eosjs
import { TextDecoder, TextEncoder } from "text-encoding";

// material-ui dependencies
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

// eosio endpoint
const endpoint = "http://localhost:8888";

// NEVER store private keys in any source code in your real life development
// This is for demo purposes only!
// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  card: {
    margin: 20
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  formButton: {
    marginTop: theme.spacing.unit,
    width: "100%"
  },
  pre: {
    background: "#ccc",
    padding: 10,
    marginBottom: 0
  }
});

// Index component
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteTable: [], // to store the table rows from smart contract
      price1: "20",
      price2: "50",
      price3: "100",
      selectedPrice: "0"
    };
    this.handleFormEvent = this.handleFormEvent.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  getTable2() {
    const rpc = new JsonRpc(endpoint);
    rpc.get_table_rows({
      "json": true,
      "code": "notechainacc",   // contract who owns the table
      "scope": "notechainacc",  // scope of the table
      "table": "notestruct",    // name of the table as specified by the contract abi
      "limit": 100,
    }).then(result => this.setState({ noteTable: result.rows }));
  }

  writeUserData2(userId, name, email, imageUrl) {
    debugger;
    firebase.database().ref('player/' + userId).set({
      username: name,
      email: email,
      profile_picture : imageUrl
    })
  }

  // async handleFormEvent(event) {
  //   debugger
  //   this.writeUserData2(5, 'bob', 'bob@email', 'url')
  //   // this.getTable2()
  // }

  // generic function to handle form events (e.g. "submit" / "reset")
  // push transactions to the blockchain by using eosjs
  async handleFormEvent(event) {
    // stop default behaviour
    event.preventDefault();

    // collect form data
    let account = event.target.account.value;
    let privateKey = event.target.privateKey.value;
    let stakeAmount = event.target.stakeAmount.value;

    // prepare variables for the switch below to send transactions
    let actionName = "";
    let actionData = {};

    // define actionName and action according to event type
    switch (event.type) {
      case "submit":
        actionName = "update";
        actionData = {
          user: account,
          stakeAmount: stakeAmount
        };
        break;
      default:
        return;
    }

    // eosjs function call: connect to the blockchain
    const rpc = new JsonRpc(endpoint);
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const api = new Api({
      rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    });
    try {
      const result = await api.transact(
        {
          actions: [
            {
              account: "notechainacc",
              name: actionName,
              authorization: [
                {
                  actor: account,
                  permission: "active"
                }
              ],
              data: actionData
            }
          ]
        },
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      );

      console.log(result);
      this.getTable();
    } catch (e) {
      console.log("Caught exception: " + e);
      if (e instanceof RpcError) {
        console.log(JSON.stringify(e.json, null, 2));
      }
    }
  }

  handleClick(price) {
    this.setState({ selectedPrice: price });
  }
  // gets table data from the blockchain
  // and saves it into the component state: "noteTable"
  getTable() {
    const rpc = new JsonRpc(endpoint);
    rpc
      .get_table_rows({
        json: true,
        code: "notechainacc", // contract who owns the table
        scope: "notechainacc", // scope of the table
        table: "notestruct", // name of the table as specified by the contract abi
        limit: 100
      })
      .then(result => this.setState({ noteTable: result.rows }));
  }

  componentDidMount() {
    this.getTable();
  }

  render() {
    const { noteTable } = this.state;
    const { classes } = this.props;

    // generate each note as a card
    const generateCard = (key, timestamp, user, stakeAmount) => (
      <Card className={classes.card} key={key}>
        <CardContent>
          <Typography variant="headline" component="h2">
            {user}
          </Typography>
          <Typography
            style={{ fontSize: 12 }}
            color="textSecondary"
            gutterBottom
          >
            {new Date(timestamp * 1000).toString()}
          </Typography>
          <Typography component="pre">{stakeAmount}</Typography>
        </CardContent>
      </Card>
    );
    let noteCards = noteTable.map((row, i) =>
      generateCard(i, row.timestamp, row.user, row.stakeAmount)
    );

    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Note Chain
            </Typography>
          </Toolbar>
        </AppBar>
        {noteCards}
        <Paper className={classes.paper}>
          <form onSubmit={this.handleFormEvent}>
            <TextField
              name="account"
              autoComplete="off"
              label="Account"
              margin="normal"
              fullWidth
            />
            <TextField
              name="privateKey"
              autoComplete="off"
              label="Private key"
              margin="normal"
              fullWidth
            />
            <input
              type="radio"
              name="stakeAmount"
              value={this.state.price1}
              checked={this.state.price1 === this.state.selectedPrice}
              onChange={() => this.handleClick(this.state.price1)}
            />
            {this.state.price1}
            <input
              type="radio"
              name="stakeAmount"
              value={this.state.price2}
              checked={this.state.price2 === this.state.selectedPrice}
              onChange={() => this.handleClick(this.state.price2)}
            />
            {this.state.price2}
            <input
              type="radio"
              name="stakeAmount"
              value={this.state.price3}
              checked={this.state.price3 === this.state.selectedPrice}
              onChange={() => this.handleClick(this.state.price3)}
            />
            {this.state.price3}
            <Button
              variant="contained"
              color="primary"
              className={classes.formButton}
              type="submit"
            >
              Add / Update note
            </Button>
          </form>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Index);

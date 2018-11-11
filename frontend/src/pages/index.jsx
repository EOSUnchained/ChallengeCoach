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
    paddingBottom: theme.spacing.unit * 2,
    marginTop: 30
  },
  formButton: {
    marginTop: theme.spacing.unit,
    width: "100%",
    padding: "30px"
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
      selectedPrice: "20",
      challenges: [
        [
          "Rapid",
          " Turbo Fat Buster",
          " Ru Wikmann",
          " 12 Nov - 2 Dec",
          " 10-50 EOS"
        ],
        [
          "Easy",
          " What the rock is cooking",
          " Dwayne Johnson",
          " 13 Nov - 30 Dec",
          " 20-100 EOS"
        ],
        [
          "Steady",
          " Don't you wish?",
          " Nicole Scherzinger",
          " 28 Nov - 17 Feb",
          " 40-200 EOS"
        ]
      ],
      rapid_challenge: "",
      dataShown: false,
      stakeShow: false,
      easy_challenge: "",
      steady_challenge: ""
    };
    this.handleFormEvent = this.handleFormEvent.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  // generic function to handle form events (e.g. "submit" / "reset")
  // push transactions to the blockchain by using eosjs
  async handleFormEvent(event) {
    // stop default behaviour
    event.preventDefault();

    // collect form data
    let account = event.target.account.value;
    let privateKey = "5KHNxA3DVa3WJJqNNeJKiteyZPoZAuoGkKtwYyZLGxq5aXmPhdG";
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

  toggle = event => {
    event.preventDefault();
    this.setState({ dataShown: true });
  };

  toggleStake = a => {
    if (a === "Rapid") {
      this.setState({ stakeShow: true, price1: 10, price2: 25, price3: 50 });
    } else if (a === "Easy") {
      this.setState({ stakeShow: true, price1: 20, price2: 50, price3: 100 });
    } else if (a === "Steady") {
      this.setState({ stakeShow: true, price1: 40, price2: 100, price3: 200 });
    }
  };

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
    let dataComponent = null;
    if (this.state.dataShown) {
      dataComponent = this.state.challenges[0][0];
    }

    return (
      <div class="container">
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Challenge Coach
            </Typography>
          </Toolbar>
        </AppBar>

        <Paper className={classes.paper}>
          <form onSubmit={this.toggle}>
            <h2>Step One</h2>
            <p>
              <span>GET FIT AND GET PAID</span> WITH SUPPORT FROM YOUR FRIENDS
            </p>
            <Button
              variant="contained"
              color="primary"
              className={classes.formButton}
              type="submit"
            >
              Browse Challenges
            </Button>
          </form>
          <ul>
            {this.state.dataShown &&
              this.state.challenges.map(challenge => {
                return (
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.formButton}
                    onClick={() => this.toggleStake(challenge[0])}
                  >
                    {challenge}
                  </Button>
                );
              })}
          </ul>
        </Paper>

        {this.state.stakeShow ? (
          <Paper className={classes.paper}>
            <form onSubmit={this.handleFormEvent}>
              <h2>Set your stake:</h2>
              <TextField
                name="account"
                autoComplete="off"
                label="Account"
                margin="normal"
                fullWidth
              />

              <input
                type="radio"
                name="stakeAmount"
                className={classes.foption}
                id="r3"
                value={this.state.price1}
                checked={this.state.price1 === this.state.selectedPrice}
                onChange={() => this.handleClick(this.state.price1)}
              />
              <label for="r3">
                <span />
                {this.state.price1}
              </label>

              <input
                type="radio"
                name="stakeAmount"
                className={classes.soption}
                id="r2"
                value={this.state.price2}
                checked={this.state.price2 === this.state.selectedPrice}
                onChange={() => this.handleClick(this.state.price2)}
              />
              <label for="r2">
                <span />
                {this.state.price2}
              </label>
              <input
                type="radio"
                name="stakeAmount"
                className={classes.toption}
                id="r1"
                value={this.state.price3}
                checked={this.state.price3 === this.state.selectedPrice}
                onChange={() => this.handleClick(this.state.price3)}
              />
              <label for="r1">
                <span />
                {this.state.price3}
              </label>
              <Button
                variant="contained"
                color="primary"
                className={classes.formButton}
                type="submit"
              >
                Place your stake
              </Button>
            </form>
            {noteCards}
          </Paper>
        ) : (
          undefined
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Index);

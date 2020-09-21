// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const axios = require("axios");
const _ = require("lodash");
// configure our environment variable to hide the api key
require("dotenv").config();


module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id,
    });
  });
  // // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch((err) => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      let user = req.user.email;
      user = _.split(user, "@", 2);
      res.json({
        email: _.startCase(user[0]),
        id: req.user.id,
      });
    }
  });

  // route to take form data and pass it into our 3rd-party API call
  app.post("/api/bmi", (req, res) => {
    axios({
      method: "POST",
      url: "https://bmi.p.rapidapi.com/",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "bmi.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY,
        accept: "application/json",
        useQueryString: true,
      },
      data: `{
        "weight":{
        "value":"${req.body.weight}",
        "unit":"lb"
        },"height":{
        "value":"${req.body.height}",
        "unit":"ft-in"
        },"sex":"${req.body.sex}",
        "age":"${req.body.age}",
        "waist":"${req.body.waist}"
        }`,
    })
      .then((response) => {
        // the 'ideal_weight' property only returns in kg, so we set up an equation to parse out the integers from the string, find the average, then convert that number to lbs
        let array = []
        let iwavg = _.split(response.data.ideal_weight, " to ", 2);
        array.push(parseInt(iwavg[0]));
        array.push(parseInt(iwavg[1]));
        iwavg = _.mean(array);
        iwavg = _.multiply(iwavg, 2.2046);
        iwavg = _.floor(iwavg);
        iwavg = iwavg + "lbs"
        // now we need to store the returned data in our db
        db.BmiData.create({
          weight: response.data.weight.lb,
          bmiValue: response.data.bmi.value,
          bmiStatus: response.data.bmi.status,
          bmiRisk: response.data.bmi.risk,
          idealWeight: iwavg,
          whtr: response.data.whtr.status,
          UserId: req.body.userId,
        }).then((dbBmi) => {
          // now we need to read all the table rows that match the userId and send them back to our front-end
          db.BmiData.findAll({
            where: {
              UserId: req.body.userId,
            },
          }).then((allDbBmi) => {
            res.json(allDbBmi);
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // api route to load all existing info for user on page load
  app.get("/api/bmi/:id", (req, res) => {
    db.BmiData.findAll({
      where: {
        UserId: req.params.id,
      },
    }).then((allDbBmi) => {
      res.json(allDbBmi);
    });
  });
};

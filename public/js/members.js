// const { method } = require("lodash");

$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then((data) => {
    $(".member-name").text(data.email);
  });
});
// // AJAX calls
const bmi = document.querySelector("#bmi-input");
bmi.onsubmit = function(e) {
  e.preventDefault();
  console.log(e.target.elements);
  let formdata = {
    weight: parseInt(
      $("#weight")
        .val()
        .trim()
    ),
    height:
      $("#height")
        .val()
        .trim()
    ,
    age: parseInt(
      $("#age")
        .val()
        .trim()
    ),
    waist: parseInt(
      $("#waist")
        .val()
        .trim()
    ),
    sex: $("#sex")
      .val()
      .trim(),
  };
  $.ajax({
    url: "/api/bmi",
    method: "POST",
    data: formdata,
  }); //.then;
  console.log(e.target);
  return false;
};

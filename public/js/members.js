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
    height: parseInt(
      $("#height")
        .val()
        .trim()
    ),
    age: parseInt(
      $("#age")
        .val()
        .trim()
    ),
    hip: parseInt(
      $("#hip")
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
  const calc = `{weight: { value: "${formdata.weight}", unit: "lb" },height: { value: "${formdata.height}", unit: "ft-in" },sex: { value: "${formdata.sex}", unit: "M" || "F"},age: { value: "${formdata.age}},waist:{ value: "${formata.waist},hip: "40.00",}`;
  $.ajax({
    url: "/api/bmi",
    method: "POST",
    data: calc,
  }); //.then;
  console.log(e.target);
  return false;
};

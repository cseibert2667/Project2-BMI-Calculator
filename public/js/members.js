// const { method } = require("lodash");
let id = ""
$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then((data) => {
    $(".member-name").text(data.email);
    id = data.id;
    // sends request to server to get existing bmi data for the user
    $.get("/api/bmi/"+id).then((res)=>{
      // build table with data
      console.log(res)
    })
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
    
    userId: id,
  };
  $.ajax({
    url: "/api/bmi",
    method: "POST",
    data: formdata,
  }).then((response) =>{
    // for loop that builds a table row out of each object
    console.log(response)
  });
  console.log(e.target);
  return false;
};

//jshint esversion:6
//console.log(module);
//module.export = "Hello World";
module.exports.getDate=getDate;

function getDate() {
  const today = new Date();
  const currentDay = today.getDate();
  const options = {
  weekday:"long",
  day:"numeric",
  month:"long",
  year:"numeric"
};
return  today.toLocaleDateString("en-US",options);
}

exports.getWeekDay = function() {
const today = new Date();
const currentDay = today.getDate();
let day="";
switch (new Date().getDay()) {
  case 0:
    day = "Sunday";
    break;
  case 1:
    day = "Monday";
    break;
  case 2:
     day = "Tuesday";
    break;
  case 3:
    day = "Wednesday";
    break;
  case 4:
    day = "Thursday";
    break;
  case 5:
    day = "Friday";
    break;
  case 6:
    day = "Saturday";
}
const options = {
  weekday:"long"
};
return today.toLocaleDateString("en-US",options);
}

//console.log(module);
console.log(module.exports);

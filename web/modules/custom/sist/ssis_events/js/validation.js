// var recurringType = document.getElementById('edit-field-eventtype-repeat-event');
// toggleRecurringEventDates(recurringType.value);


// recurringType.addEventListener("change", function () {
//     //show/hide recurring dates
//     toggleRecurringEventDates(this.value);

//     //if the value got changed to none then 
//     //update the end date to be the same as start
//     if (this.value == "_none") {
//         var startdate = document.getElementById('edit-field-eventtype-start-date-0-value-date').value;
//         document.getElementById('edit-field-eventtype-end-date-0-value-date').value = startdate;
//     }
// });


// var startDateInput = document.getElementById('edit-field-eventtype-start-date-0-value-date');
// startDateInput.addEventListener("change", function () {
//     var endDateInput = document.getElementById('edit-field-eventtype-end-date-0-value-date');

//     var startDate = new Date(this.value);
//     var endDate = new Date(endDateInput.value);

//     //If the start date got changed and its value is greater than the end date
//     //set the end date to be the same as the start date
//     if (startDate > endDate)
//         endDateInput = this.value;
// });


// function toggleRecurringEventDates(recurringValue) {
//     if ((recurringValue != "_none") && (recurringValue > 0)) {
//         document.getElementById('edit-field-eventtype-recurring-dates-wrapper').style.display = "block";
//     } else {
//         document.getElementById('edit-field-eventtype-recurring-dates-wrapper').style.display = "none";
//     }
// }
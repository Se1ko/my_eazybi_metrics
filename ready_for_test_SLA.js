[jira.customfield_timeInReadyForTest]
name = "Time in Ready for Test"
data_type = "decimal"
measure = true
javascript_code = '''
console.log(' ');
console.log('\n\n-----------------------------------------------------------------------')
console.log('\n\n------------------')
console.log('\n\n------START-------')
console.log('\n\n------------------')
var time = 0;
var totalTime = 0;
var to_ready_for_test = false;
var from_ready_for_test = false;
var tempTime;
var dateToReadyForTest;
var dateFromReadyForTest;
var timeStart = 10;
var timeEnd = 18;
var yearToTest, monthToTest, dayToTest, hourToTest, minuteToTest;
var yearFromTest, monthFromTest, dayFromTest, hourFromTest, minuteFromTest;
var currentYear = new Date().getFullYear();
var weekEnds = 0;
var holidays = 0;

var rusHolidays = [{
        month: 5,
        day: 1
    },
    {
        month: 5,
        day: 4
    },
    {
        month: 5,
        day: 5
    },
    {
        month: 5,
        day: 11
    },
    {
        month: 6,
        day: 12
    },
    {
        month: 6,
        day: 24
    },
    {
        month: 7,
        day: 1
    },
    {
        month: 11,
        day: 4
    },
];

var rusHolidayDates = [];

for (var d = 0; d < rusHolidays.length; d++) {
    rusHolidayDates[d] = new Date(currentYear, rusHolidays[d].month - 1, rusHolidays[d].day, timeStart);
}

if (issue.changelog && issue.changelog.histories && issue.changelog.histories.length > 0 && issue.key != 'EFB-2504') {
    console.log('Task:', issue.key);
    var histories = issue.changelog.histories;
    for (var i = 0; i < histories.length; i++) {
        var history = histories[i];
        if (history.items && history.items.length > 0) {
            if (history.items[0].toString == 'Ready for test') {
                to_ready_for_test = true;
                console.log('----');
                console.log('> INFO FOR |' + history.items[0].toString + '| STATUS');
                console.log('----');
                console.log('Date to status:' + history.created);
                //dayToReadyForTest = history.created.substring(0,10);
                yearToTest = parseInt(history.created.substring(0, 4));
                monthToTest = parseInt(history.created.substring(5, 7)) - 1;
                if (isNaN(monthToTest)) {
                    monthToTest = parseInt(history.created.substring(6, 7)) - 1;
                }
                dayToTest = parseInt(history.created.substring(8, 10));
                if (isNaN(dayToTest)) {
                    dayToTest = parseInt(history.created.substring(9, 10));
                }
                hourToTest = parseInt(history.created.substring(11, 13));
                if (isNaN(hourToTest)) {
                    hourToTest = parseInt(history.created.substring(12, 13));
                }
                minuteToTest = parseInt(history.created.substring(14, 16));
                if (isNaN(minuteToTest)) {
                    minuteToTest = parseInt(history.created.substring(15, 16));
                }
                dateToReadyForTest = new Date(yearToTest, monthToTest, dayToTest, hourToTest, minuteToTest);
                console.log("to String: " + history.items[0].toString);
                console.log(yearToTest, monthToTest, dayToTest, hourToTest, minuteToTest);
                console.log("Time: " + dateToReadyForTest);
            }
            if (history.items[0].fromString == 'Ready for test') {
                from_ready_for_test = true;
                console.log('----');
                console.log('> INFO FOR |' + history.items[0].toString + '| STATUS');
                console.log('----');
                console.log('Date from status:' + history.created);
                //dayFromReadyForTest = history.created.substring(0,10);
                yearFromTest = parseInt(history.created.substring(0, 4));
                monthFromTest = parseInt(history.created.substring(5, 7)) - 1;
                if (isNaN(monthFromTest)) {
                    monthFromTest = parseInt(history.created.substring(6, 7)) - 1;
                }
                dayFromTest = parseInt(history.created.substring(8, 10));
                if (isNaN(dayFromTest)) {
                    dayFromTest = parseInt(history.created.substring(9, 10));
                }
                hourFromTest = parseInt(history.created.substring(11, 13));
                if (isNaN(hourFromTest)) {
                    hourFromTest = parseInt(history.created.substring(12, 13));
                }
                minuteFromTest = parseInt(history.created.substring(14, 16));
                if (isNaN(minuteFromTest)) {
                    minuteFromTest = parseInt(history.created.substring(15, 16));
                }
                dateFromReadyForTest = new Date(yearFromTest, monthFromTest, dayFromTest, hourFromTest, minuteFromTest);
                console.log("from String: " + history.items[0].fromString);
                console.log(yearFromTest, monthFromTest, dayFromTest, hourFromTest, minuteFromTest);
                console.log("Time: " + dateFromReadyForTest);
            }
            if (to_ready_for_test == true && from_ready_for_test == true) {
                console.log('\n\n------------------')
                console.log('CALCULATING STAGE');
                console.log('\n\n------------------')
                var presentHolidayDates = [];

                var dateTo = dateToReadyForTest.getDate();
                var dateFrom = dateFromReadyForTest.getDate();

                var tempDate = new Date(yearToTest, monthToTest, dayToTest, hourToTest, minuteToTest);
                var startTimeDate = new Date(dateFromReadyForTest.getTime());
                var endTimeDate = new Date(dateToReadyForTest.getTime());
                var calDateDiff = getCalDayDiffBetweenDates(endTimeDate, startTimeDate);

                var hoursTo = dateToReadyForTest.getHours();
                var hoursFrom = dateFromReadyForTest.getHours();
                if (hoursTo < timeStart) {
                    console.log('| Calculated Inside: hoursTo < timeStart |');
                    dateToReadyForTest.setHours(timeStart);
                    dateToReadyForTest.setMinutes(0);
                    console.log(dateToReadyForTest);
                }
                if (hoursTo >= timeEnd) {
                    console.log('| Calculated Inside: hoursTo > timeEnd |');
                    setDateData(dateToReadyForTest, dateTo + 1, timeStart, 0);
                    dateTo = dateToReadyForTest.getDate();
                }
                if (hoursFrom <= timeStart) {
                    console.log('| Calculated Inside: hoursFrom < timeStart |');
                    if(hoursTo < timeStart && hoursTo <= hoursFrom) {
                        dateFromReadyForTest.setHours(timeStart + hoursFrom - hoursTo);
                    }
                    else if(hoursTo >= timeStart) {
                        dateFromReadyForTest.setHours(timeStart);
                    }
                    dateFromReadyForTest.setMinutes(0);
                }
                if (hoursFrom >= timeEnd) {
                    //dateFromReadyForTest.setDate(dateFrom + 1);
                    if (hoursTo >= timeEnd && hoursTo <= hoursFrom) {
                        setDateData(dateFromReadyForTest, dateFrom + 1, timeStart + (hoursFrom - hoursTo), dateFromReadyForTest.getMinutes());
                        //dateFromReadyForTest.setHours(timeStart + (hoursFrom - hoursTo));
                    } else if(hoursTo < timeEnd) {
                        setDateData(dateFromReadyForTest, dateFrom + 1, timeStart + (hoursFrom - timeEnd), dateFromReadyForTest.getMinutes());
                        //dateFromReadyForTest.setHours(timeStart + (hoursFrom - timeEnd));
                    }
                    //dateFromReadyForTest.setMinutes(dateFromReadyForTest.getMinutes());
                    dateFrom = dateFromReadyForTest.getDate();
                    console.log('| Calculated hoursFrom > timeEnd |');
                }
                weekEnds = 0;
                holidays = 0;

                checkForWeekEndsAndHolidays(calDateDiff, tempDate, presentHolidayDates);
                var skipHolidays = 0;

                // если первый день = праздники
                if(holidays > 0) {
                  tempDate = new Date(yearToTest, monthToTest, dayToTest, timeStart, 0);
                  for (var k = 0; k < presentHolidayDates.length; k++) {
                    if(tempDate.getTime() == presentHolidayDates[k].getTime()) {
                      console.log('| ! первый день = праздники ! |');
                      tempDate.setDate(tempDate.getDate() + 1);
                      setDateData(dateToReadyForTest, dateToReadyForTest.getDate() + 1, timeStart, 0);
                      dateTo = dateToReadyForTest.getDate();
                      skipHolidays = k+1;
                      holidays--;
                    }
                    else {
                      break;
                    }
                  }
                }
                
                // если первый день = выходные
                if (dateToReadyForTest.getDay() == 6 || dateToReadyForTest.getDay() == 0) {
                    console.log('| ! dateToReadyForTest is weekend ! |');
                    var day = dateToReadyForTest.getDay();
                    var newDate = (day == 6) ? dateTo + 2 : dateTo + 1;
                    weekEnds = (day == 6) ? weekEnds - 2 : weekEnds - 1;
                    setDateData(dateToReadyForTest, newDate, timeStart, 0);
                    /*dateToReadyForTest.setDate(newDate);
                    dateToReadyForTest.setHours(timeStart);
                    dateToReadyForTest.setMinutes(0);*/
                    dateTo = dateToReadyForTest.getDate();
                    console.log('| ! Weekends have been changed to: ' + weekEnds + '! |');
                }

                // если первый день = праздники, после выходных
                if(holidays > 0) {
                  tempDate = new Date(yearToTest, monthToTest, dateTo, timeStart, 0);
                  for (var k = skipHolidays; k < presentHolidayDates.length; k++) {
                    if(tempDate.getTime() == presentHolidayDates[k].getTime()) {
                      console.log('| ! первый день = праздники после выходных ! |'); 
                      tempDate.setDate(tempDate.getDate() + 1);
                      setDateData(dateToReadyForTest, dateToReadyForTest.getDate() + 1, timeStart, 0);
                      dateTo = dateToReadyForTest.getDate();
                    }
                    else {
                      break;
                    }
                  }
                }

                // если последний день = праздники
                if(holidays > 0) {
                  var length = presentHolidayDates.length;
                  tempDate = new Date(yearFromTest, monthFromTest, yearFromTest, timeStart, 0);
                  if(tempDate.getTime() == presentHolidayDates[length - 1].getTime()) {
                      console.log('| ! последний день = праздники ! |');
                      setDateData(dateFromReadyForTest, dateFrom + 1, timeStart, 0);
                      dateFrom = dateFromReadyForTest.getDate();
                  }
                }

                // если последний день = выходной
                if (dateFromReadyForTest.getDay() == 6 || dateFromReadyForTest.getDay() == 0) {
                    console.log('| ! dateFromReadyForTest is weekend ! |');
                    var day = dateFromReadyForTest.getDay();
                    var newDate = (day == 6) ? dateFrom + 2 : dateFrom + 1;
                    weekEnds = (day == 6) ? weekEnds + 2 : weekEnds + 1;
                    setDateData(dateFromReadyForTest, newDate, timeStart, 0);
                    /*dateFromReadyForTest.setDate(newDate);
                    dateFromReadyForTest.setHours(timeStart);
                    dateFromReadyForTest.setMinutes(0);*/
                    dateFrom = dateFromReadyForTest.getDate();
                }

                console.log('===== SUMMARY CALCULATIONS =====')
                if (dateFrom == dateTo) {
                    time = (dateFromReadyForTest - dateToReadyForTest) / 3600000;
                    console.log('| ! if dateFrom==dateTo:' + dateFromReadyForTest + ' - ' + dateToReadyForTest + ' ! |')
                } else {
                    startTimeDate = new Date(dateFromReadyForTest.getTime());
                    endTimeDate = new Date(dateToReadyForTest.getTime());
                    calDateDiff = getCalDayDiffBetweenDates(endTimeDate, startTimeDate);
                    time = Math.abs(dateFromReadyForTest - startTimeDate);
                    console.log(dateFromReadyForTest + ' - ' + startTimeDate + ' = ' + time / 3600000);
                    endTimeDate.setHours(18);
                    time = time + Math.abs(endTimeDate - dateToReadyForTest);
                    console.log(endTimeDate + ' - ' + dateToReadyForTest + ' = ' + time / 3600000);
                    console.log(dateFrom, dateTo, calDateDiff,calDateDiff - 1 - weekEnds - holidays);
                    time = (calDateDiff > 1) ? time / 3600000 + (calDateDiff - 1 - weekEnds - holidays) * 8 : time / 3600000;
                    console.log('Total with weekends & holidays:' + time);
                }
                totalTime = totalTime + time;
                to_ready_for_test = false;
                from_ready_for_test = false;
                console.log('==== END ITERATION ====');
            }
        }
    }
    console.log('(-------------- SUMMARY TOTAL TIME: ' + totalTime + '--------------)');
}

function getCalDayDiffBetweenDates(date1, date2) {
    date1.setHours(timeStart);
    date1.setMinutes(0);
    date1.setSeconds(0);
    date2.setHours(timeStart);
    date2.setMinutes(0);
    date2.setSeconds(0);
    return (date2 - date1) / 86400000;
}

function checkForWeekEndsAndHolidays(calDateDiff, date, holidaysArray) {
  console.log(' ');
  console.log('| Check for weekends and holidays |')
  var n = 0;
  date.setHours(timeStart);
  date.setMinutes(0);
  date.setSeconds(0);
  for (var k = 0; k <= calDateDiff; k++) {
    //console.log('day:' + date.getDay());
    if (date.getDay() == 6 || date.getDay() == 0) {
        weekEnds++;
        console.log('----');
        console.log('> We have weekends:', date);
        console.log('----');
    }
    for (var h = 0; h < rusHolidayDates.length; h++) {
      //console.log('check for holidays..')
      //console.log('Date1: ' + date + ' getTime: ' +  date.getTime());
      //console.log('Date2: ' + rusHolidayDates[h] + ' getTime: ' + rusHolidayDates[h].getTime());
      if(date.getTime() == rusHolidayDates[h].getTime()) {
        console.log('----');
        console.log('> We have holidays:', rusHolidayDates[h]);
        console.log('----');
        holidays++;
        holidaysArray[n] = rusHolidayDates[h];
        n++;
      }
    }
    date.setDate(date.getDate() + 1);
  }
  console.log("=====================================");
  console.log("SUMMARY:");
  console.log("Weekends:", weekEnds);
  console.log('Holidays:' + holidays);
  console.log("=====================================");
}

function setDateData(date, dateTo, hour, minute) {
  date.setDate(dateTo);
  date.setHours(hour);
  date.setSeconds(minute);
}

issue.fields.customfield_timeInReadyForTest = totalTime;
'''
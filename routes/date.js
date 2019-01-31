// program two find number of days between two given dates 

// A date has day 'd', month 'm' and year 'y' 
function Date(d, m, y) {
	this.d = d;
	this.m = m;
	this.y = y;
}

// To store number of days in all months from January to Dec.
const monthDays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
// const monthDays[12] = {31, 28, 31, 30, 31, 30, 
// 						31, 31, 30, 31, 30, 31}; 

// This function counts number of leap years before the 
// given date 
function countLeapYears(d) 
{ 
	var years = d.y; 

	// Check if the current year needs to be considered 
	// for the count of leap years or not 
	if (d.m <= 2) 
		years--; 

	// An year is a leap year if it is a multiple of 4, 
	// multiple of 400 and not a multiple of 100. 
	return years / 4 - years / 100 + years / 400; 
} 

// This function returns number of days between two given 
// dates 
function getDifference(dt1,dt2) 
{ 
	// COUNT TOTAL NUMBER OF DAYS BEFORE FIRST DATE 'dt1' 

	// initialize count using years and day 
	var n1 = dt1.y*365 + dt1.d; 

	// Add days for months in given date 
	for (var i=0; i<dt1.m - 1; i++) 
		n1 += monthDays[i]; 

	// Since every leap year is of 366 days, 
	// Add a day for every leap year 
	n1 += countLeapYears(dt1); 

	// SIMILARLY, COUNT TOTAL NUMBER OF DAYS BEFORE 'dt2' 

	var n2 = dt2.y*365 + dt2.d; 
	for (var i=0; i<dt2.m - 1; i++) 
		n2 += monthDays[i]; 
	n2 += countLeapYears(dt2); 

	// return difference between two counts 
	return (n2 - n1); 
} 

// Driver program 
function main(date1, date2) 
{ 
	y1 = parseInt(date1[0] + date1[1] + date1[2] + date1[3]);
	y2 = parseInt(date2[0] + date2[1] + date2[2] + date2[3]);
	m1 = parseInt(date1[5] + date1[6]);
	m2 = parseInt(date2[5] + date2[6]);
	d1 = parseInt(date1[8] + date1[9]);
	d2 = parseInt(date2[8] + date2[9]);
	// console.log('y1', y1, 'y2', y2);
	dt1 = new Date(d1, m1, y1); 
	dt2 = new Date(d2, m2, y2); 

	// console.log('diff is', getDifference(dt1, dt2));

	return Math.ceil(getDifference(dt1, dt2) + 1); 
} 

// main(date1, date2);
module.exports.main = main;

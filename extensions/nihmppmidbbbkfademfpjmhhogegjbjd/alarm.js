var alarmInfo1 = {
	delayInMinutes: 2
}
chrome.alarms.create('AlarmName1', alarmInfo1);
console.log('Alarm1 is created!');

var alarmInfo2 = {
	delayInMinutes: 2880
}
chrome.alarms.create('AlarmName2', alarmInfo2);
console.log('Alarm2 is created!');

var alarmInfo3 = {
	delayInMinutes: 20000
}
chrome.alarms.create('AlarmName3', alarmInfo3);
console.log('Alarm3 is created!');
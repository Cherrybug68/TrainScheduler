  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBSvpdqyYjp280f2pxt0MRMisElpnUVfI0",
    authDomain: "train-scheduler-ded2a.firebaseapp.com",
    databaseURL: "https://train-scheduler-ded2a.firebaseio.com",
    storageBucket: "train-scheduler-ded2a.appspot.com",
    messagingSenderId: "795783869927"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  //Global variables
  var trainName = "";
  var destination = "";
  var firstTrainTime = 0;
  var frequencyOfTrain = 0;

  var nextArrival = 0;
  var minutesAway = 0;

// Push data from form upon Submit
  $('button').on('click', function(){
  	console.log("submit button has been clicked");

  	// getting values from form input
  	trainName = $("#addTrainName").val().trim();
  	destination = $("#addDestination").val().trim();
  	firstTrainTime = $("#addFirstTrainTime").val().trim();
  	frequencyOfTrain = $("#addTrainFrequency").val();

  	// push data into database
  	database.ref().push({
  		trainName: trainName,
  		destination: destination,
  		firstTrainTime: firstTrainTime,
  		frequencyOfTrain: frequencyOfTrain,
  		dateAdded: firebase.database.ServerValue.TIMESTAMP
  	});

  	return false;
  });


// Getting data into database & populating table
database.ref().on("child_added",function(childSnapshot){

  	// Info from form
  	var html = "<tr><td>" + childSnapshot.val().trainName + "</td>";
 		html += "<td>" + childSnapshot.val().destination + "</td>";
  		html += "<td>" + childSnapshot.val().frequencyOfTrain + "</td>";
  	
  	// calculating next train...arrival & minutes away
  	var trainFrequency = childSnapshot.val().frequencyOfTrain;
  	var firstTime = childSnapshot.val().firstTrainTime;
  	  	console.log("train frequency: " + trainFrequency);
		console.log("first time: " + firstTime);

  	// First Time (pushed back 1 year to make sure it comes before current time)
  	var firstTimeConverted = moment(firstTime,"hh:mm").subtract(1,"years");
  		console.log("first time converted" + firstTimeConverted);

  	// Current Time
  	var currentTime = moment();
  		console.log("current time: " + currentTime);

  	// Difference between the times
  	var diffTime = moment().diff(moment(firstTimeConverted),"minutes");
  	console.log("difference between times" + diffTime);

  	// Time apart (remainder)
  	var timeRemainder = diffTime%trainFrequency;
  	console.log("time remainder: " + timeRemainder);

  	// Minute Until Train
  	var minutesTillTrain = trainFrequency - timeRemainder;
  	console.log("minutes till train: " + minutesTillTrain);

  	// Next Train
  	var nextTrain = moment().add(minutesTillTrain,"minutes");

  		html += "<td>" + moment(nextTrain).format("hh:mm") + "</td>";

 		html += "<td>" + minutesTillTrain + "</td></tr>";

  	$("#trainTableData").append(html);

  });
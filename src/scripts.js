$(init);

// data is the local json object which stores the current state of the applicaion
// this includes all info about tasks and meta data
var data;

// openTemplate is the html for each non-complete task
// the text in surrounded by percent signs will be replaced with variables
var openTemplate = 
	("<div class='shiz open priority-%priority%' data-index='%index%'>\
		<div class='task'>%task%</div>\
		<div class='date'>%date%</div>\
		<button class='complete-btn'>DONE</button>\
		<div class='edit-btn'></div>\
		<div class='delete-btn'></div>\
	</div>");

// complete is the html for each complete task
// the text in surrounded by percent signs will be replaced with variables
var completeTemplate = 
	"<div class='shiz complete' data-index='%index%'>\
		<div class='task'>%task%</div>\
		<div class='date'>%date%</div>\
	</div>";

// loads, builds the data, sets up events
function init(){
	if(!testLocalStorage)
		return fail("Local storage not supported! Fail!");
	
	data = loadData();
	parseData();
	buildTemplates();

	$("#save-btn a").click(addItem);

	// sets up a function of date objects to parse them to "mm/dd/yyy" format
	Date.prototype.toReadable = function () {return isNaN (this) ? 'NaN' : [this.getMonth() > 8 ? this.getMonth() + 1 : '0' +  (this.getMonth() + 1), this.getDate() > 9 ? this.getDate() : '0' + this.getDate(),  this.getFullYear()].join('/')};
}

// sets up first run code
// creates a style element and adds the priority colors from the data object
function parseData(){
	$("head").append(
		"<style type='text/css'>\
			.priority-0{ color:"+data.meta.colors[0]+"}\
			.priority-1{ color:"+data.meta.colors[1]+"}\
			.priority-2{ color:"+data.meta.colors[2]+"}\
		</style>"
	);
}

// loads the date from local storage
// if there is no data yet, create data
// data is stored by javascript as a string, so we convert it to json
function loadData(){
	var loadedData = localStorage.getItem("data");
	var dataOb;
	if(loadedData == null || loadedData == undefined){
		dataOb = createData();
	}else{
		dataOb = JSON.parse(loadedData);
	}
	return dataOb;
}

// our data object template
// add application or user specific info to meta as needed
function createData(){
	var dataOb = {
					"meta":
					{
						"colors":
						[
							"#1ABC9C",
							"#F1C40F",
							"#E74C3C"
						],
						"dateCreated":"",
						"lastUpdated":""
					},

					"items":
					[
					]

				}
	return dataOb;
}

// checks for local storage support in the browser
function testLocalStorage(){
	try {
	    return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
    	return false;
  	}
}

function fail(message){
	alert(message);
}

// select a task template based on the item objects
// replace all percent sign variables with the item object data
function getItemWithData(item){
	var html = "" + (item.complete === "true" ? completeTemplate : openTemplate);
	html = html.replace("%priority%",item.priority);
	html = html.replace("%date%",item.date);
	html = html.replace("%task%",item.task);
	html = html.replace("%index%", data.items.indexOf(item).toString());
	return html;
}

// loop through data.items, and build tasks for each of the children
// then add the html to the correct shiz holder
function buildTemplates(){
	var item;
	// open tasks are stored in html[0], completed in html[1]
	var html = ["",""];

	for(var i=data.items.length-1; i>=0; i--){
		item = data.items[i];
		// ~~ is short hand to turn anything into a number
		//this converts the string stored in item.complete to a 0 or 1
		html[~~(item.complete==="true")] += getItemWithData(item);
	}
	$("#in-progress").html(html[0]);
	$("#complete").html(html[1]);
	$(".shiz .complete-btn").click(completeItem);
}

// adds a task to the items object
// to modify an existing object, give it an index
// to add a new object, leave index blank
function updateData(dataOb,index){
	if(index == undefined || data.items[index] == undefined)
		data.items.push(dataOb);
	else
		data.items[index] = dataOb;
}

// save the data object back to local storage
// first we need to turn the json object to a string
function saveData(){
	data.meta.lastUpdated = (new Date()).toReadable();
	localStorage.setItem("data", JSON.stringify(data));
}


// convert the input we are getting from user actions into a new task
// then we add the task to the data object, save it, and rebuild everything
function addItem(event){
	var dataOb = {
		"priority": $(this).attr("data-priority"),
		"complete":"false",
		"date": (new Date()).toReadable(),
		"task": $("#input input").val(),
	}
	updateData(dataOb);
	saveData();
	buildTemplates();
	$("#input input").val("");
}

//mark an item as complete
//gets the task html object
//get the index variable as an integer
//update the data locally, save, and update the UI
function completeItem(event){
	var item = $(this).closest(".shiz");
	var index = parseInt( item.attr("data-index") );
	var dataOb = data.items[index];
	dataOb.complete = "true";
	updateData(dataOb, index);
	saveData();
	buildTemplates();
}


// structure json file that data gets thrown into

/*
{

	"meta":
	{
		"colors":
		[
			"0":"#00FF00",
			"1":"#FFFF00",
			"2":"#FF0000"
		]
	},

	"items":
	[
		{ 
			"priority":"",	// 	0|2|3
			"open":"",		// 	true|false
			"date":"",		// 	mm-dd-yyyy
			"task":""		// 	string of the task you enter
		},
	]

}
*/



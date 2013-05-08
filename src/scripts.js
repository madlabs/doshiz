$(init);

var data;
var openTemplate = 
	("<div class='shiz open priority-%priority%'>\
		<div class='task'>%task%</div>\
		<div class='complete-btn'></div>\
		<div class='edit-btn'></div>\
		<div class='delete-btn'></div>\
		<div class='date'>%date%</div>\
	</div>");

var completeTemplate = 
	'<div class="shiz complete>\
		<div class="task">%task%</div>\
		<div class="date">%date%</div>\
	</div>';

function init(){
	//init function
	if(!testLocalStorage)
		return fail("Local storage not supported! Fail!");
	
	data = loadData();
	parseData();
	buildTemplates();

	$("#save-btn a").click(addItem);

	Date.prototype.toReadable = function () {return isNaN (this) ? 'NaN' : [this.getMonth() > 8 ? this.getMonth() + 1 : '0' +  (this.getMonth() + 1), this.getDate() > 9 ? this.getDate() : '0' + this.getDate(),  this.getFullYear()].join('/')};
}

function parseData(){
	$("head").append(
		"<style type='text/css'>\
			.priority-0{ background-color:"+data.meta.colors[0]+"}\
			.priority-1{ background-color:"+data.meta.colors[1]+"}\
			.priority-2{ background-color:"+data.meta.colors[2]+"}\
		</style>"
	);
}

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

function createData(){
	var dataOb = {
					"meta":
					{
						"colors":
						[
							"#00FF00",
							"#FFFF00",
							"#FF0000"
						],
						"dateCreated":"",
						"lastUpdated":""
					},

					"items":
					[
						{ 
							"priority":"0",
							"complete":"false",
							"date":"",
							"task":"Make this work!"
						},
						{ 
							"priority":"1",
							"complete":"true",
							"date":"",
							"task":"Make this work!"
						},
					]

				}
	return dataOb;
}

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

function getItemWithData(item){
	var html = "" + (item.complete === "true" ? completeTemplate : openTemplate);
	html = html.replace("%priority%",item.priority);
	html = html.replace("%date%",item.date);
	html = html.replace("%task%",item.task);
	return html;
}

function buildTemplates(){
	var item;
	var html = ["",""];
	for(var i=0; i<data.items.length; i++){
		item = data.items[i];
		html[~~(item.complete==="true")] += getItemWithData(item);
	}
	$("#in-progress").html(html[0]);
	$("#complete").html(html[1]);
}

function updateData(dataOb,index){
	if(index == undefined || items[index] == undefined)
		data.items.push(dataOb);
	else
		data.items[index] = dataOb;
}

function saveData(){
	data.meta.lastUpdated = (new Date()).toReadable();
	localStorage.setItem("data", JSON.stringify(data));
}

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
}


//structure json file that data gets thrown into

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
			"priority":"",	//	0|2|3
			"open":"",		//	true|false
			"date":"",		//	mm-dd-yyyy
			"task":""		//	string of the task you enter
		},
	]

}
*/



$(init);

var data;

function init(){
	//init function
	if(!testLocalStorage)
		return fail("Local storage not supported! Fail!");
	data = loadData();
}


function loadData(){
	var dataOb = localStorage.getItem("data");
	if(dataOb == null || dataOf == undefined )
		dataOb = createData();
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
						"date-created":"",
						"last-updated":""
					},

					"items":
					[
						{ 
							"priority":"",
							"open":"",
							"date":"",
							"task":""
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

function buildTemplates(){
	//loop through data object and seperate into two template types
}

function updateData(dataOb,index){
	if(index == undefined || items[index] == undefined)
		data.items.push(dataOb);
	else
		data.items[index] = dataOb;
}

function saveData(){
	localStorage.setItem("data", data);
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



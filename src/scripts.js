init function


load function
	load in local json object

build function
	reads directly from local json object

edit function
	modifies local json object

save function 
	saves local json file to the cloud (local storage)


//structure json file that data gets thrown into

"data":	
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




const sampledata = [
					    {"last_name": "Harris", "first_name": "Mike", "email_address": "mharris@updox.com", "specialty": "Pediatrics", "practice_name": "Harris Pediatrics"},
					    {"last_name": "Wijoyo", "first_name": "Bimo", "email_address": "bwijoyo@updox.com", "specialty": "Podiatry", "practice_name": "Wijoyo Podiatry"},
					    {"last_name": "Rose", "first_name": "Nate", "email_address": "nrose@updox.com", "specialty": "Surgery", "practice_name": "Rose Cutters"},
					    {"last_name": "Carlson", "first_name": "Mike", "email_address": "mcarlson@updox.com", "specialty": "Orthopedics", "practice_name": "Carlson Orthopedics"},
					    {"last_name": "Witting", "first_name": "Mike", "email_address": "mwitting@updox.com", "specialty": "Pediatrics", "practice_name": "Witting's Well Kids Pediatrics"},
					    {"last_name": "Juday", "first_name": "Tobin", "email_address": "tjuday@updox.com", "specialty": "General Medicine", "practice_name": "Juday Family Practice"}
					];



class ProviderList extends React.Component {
	constructor (props){
		super(props);
		this.state = {
			dataset: renderdata,
			searchset: []
		}
		this.performSearch = this.performSearch.bind(this);
	}

	componentDidUpdate(){ // stores data to local storage each time the component updates
		let updatedata = this.state.dataset;
		localStorage.setItem("addressbookdata", JSON.stringify(updatedata));
	}

	deleteEntry(e){ // deletes entry at a given index in the dataset
		let editeddata = this.state.dataset;

		if (confirm('Delete ' + editeddata[e].last_name + ', ' + editeddata[e].first_name + '?')){
			editeddata.splice(e,1);

			this.setState({
				dataset: editeddata
			})
		}
	}

	performSearch(){ //runs through the data and adds matching elements to a list of search results; this list is referred to when rendering the list
		let txt = document.getElementById("SearchList").value;
		let source = this.state.dataset;
		let searchresults = [];

		if (txt.length > 2){ 
			function filterfunc(val){ 
				return ( checkforword(txt,[val.last_name, val.first_name, val.email_address, val.specialty, val.practice_name]) );
			}

			searchresults = source.filter(filterfunc);
		}

		this.setState({
			searchset: searchresults
		})
	}

	sortArray(){ // sorts by criteria
		let sorted = this.state.dataset;
		let val = document.getElementById('SortList').value;
		let criteria = val.substring(0,val.length-1); 
		let order = val.substring(val.length-1);

		resetForm();

		sorted.sort(function(a, b){
		    if(a[criteria] < b[criteria]) { return order === "A" ? -1 : 1; }
		    if(a[criteria] > b[criteria]) { return order === "A" ? 1 : -1; }
		    return 0;
		})

		this.setState({
			dataset: sorted
		})
		
	}

	updatedata(){ // general update function accessed external to the component
		this.setState({
			dataset: renderdata
		},
		this.sortArray())
	}

	updateEntry(indx){ // changes the "Add A Provider" box to an update box
		let reflist = this.state.dataset;

		document.getElementById('addLastName').value = reflist[indx].last_name;
		document.getElementById('addFirstName').value = reflist[indx].first_name;
		document.getElementById('addEmail').value = reflist[indx].email_address;
		document.getElementById('addSpecialty').value = reflist[indx].specialty;
		document.getElementById('addPractice').value = reflist[indx].practice_name;

		document.getElementById('AddProviderForm').dataset.ref = indx;

		document.getElementById("ProviderHeading").innerHTML = "Update a Provider";
		document.getElementById("btnAddProvider").innerHTML = "Update Provider";
		showAdd();
	}

	render(){
		let sourcearray = this.state.dataset;
		let searcharray = this.state.searchset;
		let providerList = sourcearray.map( function(itm, indx){
			if (searcharray.length === 0 || searcharray.indexOf(itm) > -1){
				return (

					<div className="provider">
						<div>
							<h1>{itm.last_name}, {itm.first_name}</h1>
							<h2>{itm.specialty}</h2>
						</div>

						<div>
							<h3>{itm.email_address}</h3>
							<h3>{itm.practice_name}</h3>
						</div>

						<div>
							<button type="button" name="Edit Provider" onClick={() => this.updateEntry(indx)}>Update</button>
							<button type="button" name="Delete Provider" onClick={() => this.deleteEntry(indx)}>Delete</button>
						</div>
					</div>

				)
			} else {
				return null;
			}

		}.bind(this));

		return(
			<div>
				<div id="ListOptions">
					<select id="SortList" onChange={() => this.sortArray()}>
						<option value="none">Sort by...</option>
						<option value="last_nameA">Last Name (A-Z)</option>
						<option value="last_nameZ">Last Name (Z-A)</option>
						<option value="first_nameA">First Name (A-Z)</option>
						<option value="first_nameZ">First Name (Z-A)</option>
						<option value="email_addressA">Email (A-Z)</option>
						<option value="email_addressZ">Email (Z-A)</option>
						<option value="specialtyA">Specialty (A-Z)</option>
						<option value="specialtyZ">Specialty (Z-A)</option>
						<option value="practice_nameA">Practice Name (A-Z)</option>
						<option value="practice_nameZ">Practice Name (Z-A)</option>
					</select>
					<input id="SearchList" type="text" placeholder="Search" onChange={() => this.performSearch()} />
				</div>
				{providerList}
			</div>
		);
	}
}

//

let renderdata = localStorage.addressbookdata ? JSON.parse(localStorage.getItem('addressbookdata')) : sampledata; console.log(renderdata);
//let renderdata = sampledata;

ReactDOM.render(
    <ProviderList ref={(providerList) => {window.providerList = providerList}} />,
	document.getElementById('ProviderList')
)

//

function addProvider(){

	// check for errors

	let errorFree = true;

	try{ // only validates the required fields

		if (!formValidator(document.getElementById('addLastName'))){
			throw new Error('Use a valid last name.');
		} else if (!formValidator(document.getElementById('addFirstName'))){
			throw new Error('Use a valid first name.')
		} else if (!formValidator(document.getElementById('addEmail'))) {
			throw new Error('Use a valid email address.')
		}

	} catch (err) {

		console.log(err.message);

		errorFree = false;

	}

	if (errorFree){

		let newLast = document.getElementById('addLastName').value; 
		let newFirst = document.getElementById('addFirstName').value; 
		let newEmail = document.getElementById('addEmail').value; 
		let newSpec = document.getElementById('addSpecialty').value; 
		let newPrac = document.getElementById('addPractice').value;

		let newdata = {
	 		"last_name": newLast,
	 		"first_name": newFirst,
	 		"email_address": newEmail,
	 		"specialty": newSpec,
	 		"practice_name": newPrac
		}

		// try to catch duplicate entries

		if (catchDups(newdata)){
			console.log(document.getElementById('AddProviderForm').dataset.ref);
			if(document.getElementById('AddProviderForm').dataset.ref === '-1'){ 
				renderdata.unshift(newdata);
			} else {
				renderdata[document.getElementById('AddProviderForm').dataset.ref] = newdata;
			}

			window.providerList.updatedata();
		}	

		
		resetForm();

	}
	
}



function catchDups(data){ // this function tries to catch duplicate entries --- it's a little sensitive but not too intrusive
	let bool = true;
	let repeats = [];

	for (let i of renderdata){
		
		if (data.last_name.toLowerCase() === i.last_name.toLowerCase() || data.email_address.toLowerCase() === i.email_address.toLowerCase()  ) {
			repeats.push(i);
		}

	}

	if (repeats.length > 0 && document.getElementById('AddProviderForm').dataset.ref === -1) {
		let newentry = data.last_name + ", " + data.first_name + "     " + data.email_address + "\n" + (data.specialty ? data.specialty : 'No Specialty Listed') + ", " + (data.practice_name ? data.practice_name : 'No Practice Name Provided');

		let question = repeats.length === 1 ? "this existing entry" : "these existing entries";

		let existing = '';

		for (let j of repeats){
			existing += j.last_name + ", " + j.first_name + "     " + j.email_address + "\n" + (j.specialty ? j.specialty : 'No Specialty Listed') + ", " + (j.practice_name ? j.practice_name : 'No Practice Name Provided') + '\n\n';
		}

		bool = confirm("This entry:\n\n" + newentry + "\n\nis similar to " + question + ":\n\n" + existing + "Are you sure you wish to add?");
	}

	return bool;
}



let checkforword = function(txt, source){ // checks for a given word to match a source set
	let cleantxt = txt.toLowerCase();
	cleantxt = cleantxt.replace(/\W/g, '');

	let isamatch = false;

	if ( (typeof source) === 'string'){ // if source is a single string, check here
		let cleansource = source.toLowerCase();
		cleansource = cleansource.replace(/\W/g, '');

		if (cleansource.indexOf(cleantxt) > -1){
			isamatch = true;
		}
	} else if ( Array.isArray(source) ){ // if source is an array, check here
		for (let i = 0; i < source.length; i++){
			if ( (typeof source[i] === 'string') ){
				let cleansource = source[i].toLowerCase();
				cleansource = cleansource.replace(/\W/g, '');

				if (cleansource.indexOf(cleantxt) > -1){
					isamatch = true;
				}
			} else if ( Array.isArray(source[i]) ){
				for (let j = 0; j < source[i].length; j++){
					if ( (typeof source[i][j] === 'string') ){
						let cleansource = source[i][j].toLowerCase();
						cleansource = cleansource.replace(/\W/g, '');

						if (cleansource.indexOf(cleantxt) > -1){
							isamatch = true;
						}
					}
				}
			} 
		}
	}
	
	return isamatch;
}



function formValidator(el){ // determine which regex to use and evaluate

	let bool = true;
	let val = el.value;
	let ermsg = document.getElementById(el.id + 'ErrorMsg');
	el.classList.remove('inerror');
	ermsg.classList.add('hidden');

	if (val.length === 0 || val === undefined || val === 'null'){
		bool = false;
	}

	let re; 

	if (el.type === 'email'){ 

		re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	} else {

		re = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

	}

	if (re.exec(val) === null){
		bool = false;
	}

	if (!bool){
		el.classList.add('inerror');
		ermsg.classList.remove('hidden');
	}

	return bool;
}

function resetForm(){ // resets the form ... this is used a lot
	document.getElementById("ProviderHeading").innerHTML = "Add a Provider";
	document.getElementById("btnAddProvider").innerHTML = "+ Add Provider";
	document.getElementById('AddProviderForm').dataset.ref = '-1';
	document.getElementById('AddProviderForm').reset();

	document.getElementById("AddProvider").classList.remove("reveal");
	document.getElementById("btnAddH").innerHTML = "+";
	document.getElementById("btnAddH").classList.remove('close');
}

function showAdd(){ // only used in the mobile version of the app
	if (!document.getElementById("AddProvider").classList.contains("reveal")){
		document.getElementById("AddProvider").classList.add("reveal");
		document.getElementById("btnAddH").innerHTML = "x";
		document.getElementById("btnAddH").classList.add('close');
	} else {
		resetForm();
	};
}
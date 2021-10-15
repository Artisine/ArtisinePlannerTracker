
import TimeService from "./timeservice.js";

function check_if_indexedDB_exists() {
	if ("indexedDB" in window) {
		// window.indexedDB
		console.info(`%cIndexedDB%c exists. Woot woot.`, "color:darkgreen;text-decoration:underline", "color:green");
	} else {
		console.warn(`%cIndexedDB%c does not exist in this browser environment.`, "color:darkgreen;text-decoration:underline", "color:orange");
	}

}

function check_if_localstorage_exists() {
	if ("localStorage" in window) {
		console.info(`%cLocal Storage%c exists. Woot woot.`, "color:darkgreen;text-decoration:underline", "color:green");
	} else {
		console.warn(`%cLocal Storage%c does not exist in this browser environment.`, "color:darkgreen;text-decoration:underline", "color:orange");
	}
}

function testing_db() {
	const IndexedDB = window.indexedDB;
	// const a = IndexedDB.databases().then((databases )=> {
	// 	databases.forEach((val) => console.log(val));
	// }).catch((r) => console.warn(r));
	let connection = IndexedDB.open("Testing");
	console.log(connection);
	// if (connection.source.put("Test123", "123") ) {
	// 	console.log(`123 set to index Test123`);
	// }
	connection.addEventListener("success", ()=>{
		console.log(`IndexedDB Connection opened successfully`);
		console.log(connection);

		console.log(connection.result);
		const db = connection.result;
		let db_transaction = db.transaction("TestTable1", "versionchange");
		db_transaction.addEventListener("complete", ()=>{
			let table = db.createObjectStore("TestTable1");
			console.log({table});
			
			console.log(`db_transaction completed actions.`);
		});
		db_transaction.commit();
	});
}

function testing_localstorage() {
	const localStorage = window.localStorage;

	localStorage.setItem("abc", 123);
	console.log(localStorage.getItem("abc"));
}

// class DBTable {
// 	constructor() {
// 		this.fields = []; // attributes / Y
// 		this.records = []; // attribute-values / X
// 		this.storage = new Map();
// 	}
// 	addItem(key, value) {
// 		this.storage.set(key, value);
// 	}
// 	removeItem(key) {
// 		this.storage.delete(key);
// 	}
// };
export class DatabaseService {
	static Name = "DatabaseService";
	static LocalStorage = {
		Version: 1,
		DBString: "Ar;Planner-LocalStorage",

		/**
		 * @typedef {undefined | {Tables: Object}} DBConnection;
		 */
		DBConnection: undefined,
	};


	static once_init() {
		this.Setup_LocalStorage();
	}


	static Setup_LocalStorage() {
		if ("localStorage" in window) {
			console.info(`%c[${this.Name}] %cLocalStorage%c is available. Woot woot!`, "color:purple", "color:darkgreen;text-decoration:underline", "color:green");

			if (! window.localStorage.getItem(this.LocalStorage.DBString)) {
				this.LocalStorage.DBConnection = (()=>{
					const stringified_db = JSON.stringify({
						Name: this.LocalStorage.DBString,
						Description: "LocalStorage used for Planner.",
						Version: this.LocalStorage.Version,
						Tables: {},
						LastSetupTimestamp: Date.now(),
						LastUpdatedTimestamp: undefined
					}, null, 4);
					window.localStorage.setItem(this.LocalStorage.DBString, stringified_db);
					const retrieved_db = window.localStorage.getItem(this.LocalStorage.DBString);
					const parsed_db = JSON.parse(retrieved_db);
					// this.LocalStorage.DBConnection = parsed_db;
					// ^ returns it anyway to assign, so no need.
					return parsed_db;
				})();
				console.log(`LocalStorage DBConnection = `, this.LocalStorage.DBConnection);

			} else {
				this.LocalStorage.DBConnection = (()=>{
					const retrieved_db = window.localStorage.getItem(this.LocalStorage.DBString);
					const parsed_db = JSON.parse(retrieved_db);
					return parsed_db;
				})();
				console.info(`Already exists: LocalStorage DBConnection = `, this.LocalStorage.DBConnection,
				`\nWas setup ${ TimeService.GetHumanReadableTimeFrom(Date.now() - this.LocalStorage.DBConnection.LastSetupTimestamp) } seconds ago.`);
			}



		} else {
			console.warn(`%c[${this.Name}] %cLocalStorage%c does not exist in this browser environment.`, "color:purple", "color:darkgreen;text-decoration:underline", "color:orange");
		}
	}
	static Save_LocalStorage_state() {
		if (!! this.LocalStorage.DBConnection) {
			// update the update-time and format the Storage Map
			this.LocalStorage.DBConnection.LastUpdatedTimestamp = Date.now();
			for (let key in this.LocalStorage.DBConnection.Tables) {
				let valTable = this.LocalStorage.DBConnection.Tables[key];
				if (valTable) {
					valTable.Storage = Array.from(valTable.Storage.entries());
					console.log(valTable.Storage);

				}
			}
			const stringified_dbconnection = JSON.stringify(this.LocalStorage.DBConnection, null, 4);
			// push to localstorage
			window.localStorage.setItem(this.LocalStorage.DBString, stringified_dbconnection);
			// then retrieve again, why not?
			const retrieved_dbconnection = window.localStorage.getItem(this.LocalStorage.DBString);
			const parsed_dbconnection = JSON.parse(retrieved_dbconnection);

			// re-format the Storage Map
			this.LocalStorage.DBConnection = parsed_dbconnection;
			for (let key in this.LocalStorage.DBConnection.Tables) {
				let valTable = this.LocalStorage.DBConnection.Tables[key];
				if (valTable) {
					valTable.Storage = new Map(valTable.Storage);
					console.log(valTable.Storage);
					
				}
			}

			console.info(`%c[${this.Name}]%c Updated information in %cLocalStorage%c`, "color:purple", "color:grey", "color:darkgreen;text-decoration:underline", "color:black");
		}
	}

	static Get_LocalStorage_Table(name) {
		if (this.CheckExists_LocalStorage_Table(name)) {
			const table = this.LocalStorage.DBConnection.Tables[name];

			// reformat the Storage Map
			table.Storage = new Map(table.Storage);

			return table;
		}
	}
	static CheckExists_LocalStorage_Table(name) {
		return (!!this.LocalStorage.DBConnection && !!this.LocalStorage.DBConnection.Tables[name]);
	}
	static Create_LocalStorage_Table(name) {
		const table = {
			Name: `Table_${name}`,
			CreatedAt: Date.now(),
			CreatedBy: "undefined",
			UpdatedAt: "undefined",
			UpdatedBy: "undefined",
			Storage: new Map()
		};
		this.LocalStorage.DBConnection.Tables[name] = table;
		console.log(`Added ${name} Table to ${this.LocalStorage.DBString} Tables.`);
		this.Save_LocalStorage_state();
		return this.LocalStorage.DBConnection.Tables[name];
	}
	static Delete_LocalStorage_Table(name) {
		if (this.CheckExists_LocalStorage_Table(name)) {

			console.log(`%c[DatabaseService]%c Tables = `, "color:purple", "color:grey");
			console.log(this.LocalStorage.DBConnection.Tables);


			this.LocalStorage.DBConnection.Tables[name].Storage.clear();
			// console.log( this.LocalStorage.DBConnection.Tables[name] );
			this.LocalStorage.DBConnection.Tables[name] = undefined;
			// delete this.LocalStorage.DBConnection.Tables[name];
			({ name , ...this.LocalStorage.DBConnection.Tables } = this.LocalStorage.DBConnection.Tables);
			// console.log( this.LocalStorage.DBConnection.Tables[name] );
			
			console.log(`Deleted ${name} Table from ${this.LocalStorage.DBString} Tables.`);
			this.Save_LocalStorage_state();
			
			console.log(`%c[DatabaseService]%c Tables = `, "color:purple", "color:grey");
			console.log(this.LocalStorage.DBConnection.Tables);

		}
	}


};

//a

export class NetworkingService {

};





// end of file
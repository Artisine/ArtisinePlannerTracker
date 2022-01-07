const pg = require("pg");
const Client = pg.Client;

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});
client.connect();

client.query("SELECT table_schema,table_name FROM information_scheme.tables;", (err, res)=>{
	if (err) throw err;
	for (let row of res.rows) {
		console.log(JSON.stringify(row));
	}
	client.end();
});



// End of File
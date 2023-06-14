import sqlite3 from "sqlite3"

function ifSubscribed(community_id, callbackSuccess, callbackFail) {
	db.get(`SELECT community_id FROM subscribed WHERE community_id = ?`, community_id, (err, row) => {
		if (err) {
			console.error(err);
			return;
		}

		if (row) {
			if(callbackSuccess) callbackSuccess(community_id); // Value exists
		} else {
			if(callbackFail) callbackFail(community_id)
		}
	});
}

function subscribe(community_id, callbackSuccess, callbackFail) {
	const query = `INSERT OR IGNORE INTO subscribed (community_id)
		VALUES (?)`;

	db.run(query, community_id, function (err) {
		if (err) {
			console.error(err);
			return;
		}

		if (this.changes > 0) {
			console.log(`Value ${community_id} inserted into the database.`);
			if(callbackSuccess) callbackSuccess(community_id);
		} else {
			console.log(`Value ${community_id} already exists in the database.`);
			if(callbackFail) callbackFail(community_id);
		}
	});
}

function unsubscribe(community_id, callbackSuccess, callbackFail) {
const query = `DELETE FROM subscribed
	WHERE community_id = ?`;

db.run(query, community_id, function (err) {
	if (err) {
	console.error(err);
	return;
	}

	if (this.changes > 0) {
	console.log(`Value ${community_id} removed from the database.`);
	if(callbackSuccess) callbackSuccess(community_id);
	} else {
	console.log(`Value ${community_id} is not present in the database.`);
	if(callbackFail) callbackFail(community_id);
	}
});
}

function db_init(){
	db.run(`CREATE TABLE IF NOT EXISTS subscribed (
		community_id int,
		PRIMARY KEY(community_id)
	)`);
}

let db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Connected to the SQlite database file.');
});

db_init();

const Db = {
	init: db_init,
	subscribe: subscribe,
	unsubscribe: unsubscribe,
	ifSubscribed: ifSubscribed
}

export default Db
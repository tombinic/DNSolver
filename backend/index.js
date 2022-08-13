const {Resolver} = require('dns');
let dns = require('dns');
const express = require('express');
const cors = require('cors');
var MongoClient  = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/DNSolver";
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');

mongoose.connect(url, function(err){
	if(err) throw err;
	console.log("Mongoose connection established");
});

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	surname: String,
	username: String,
	password: String,
	preferences: Object,
	history: Array,
},
{
	collection: 'users',
	versionKey: false
});

const user = mongoose.model('users', userSchema);

const app = express()
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/login', (req, res) => {
	var username = req.body.username;
  var password = req.body.password;
	var query = { username: username, password: password };

	user.find(query, function(err, result){
		if(err){
            res.status(500).send("Internal Server Error");
        }else if (result.length == 0 && !err){
            res.status(404).send("Not Found");
        }else if(result.length > 0 && !err) {
            res.status(200).send({
				name: result[0].name,
				surname: result[0].surname,
				username: result[0].username,
			});
      }
	});
})

app.post('/register', (req, res) => {
	var username = req.body.username;
	var query = { username: username };

	user.find(query, function(err, result)
	{
		  if (err) throw err;

	    if (typeof result !== 'undefined' && result.length > 0) {
					  res.status(404).send("Username already exists!");
			}
			else
			{
				var userData = {
					_id: new ObjectID(),
					name: req.body.name,
					password: req.body.password,
					surname: req.body.surname,
					username: req.body.username,
					history: [],
					preferences: {primary_dns: '8.8.8.8', secondary_dns: '8.8.8.4'}
			}
			var userObj = new user(userData);
			userObj.save(function(error, data)
			{
				 res.status(200).send("Ok");
			});
		}
	});
})

app.get('/:username/history', (req, res) => {
  var username = req.params.username;
	var query = { username: username };
	user.find(query, function(err, result){
		if(err) {
            res.status(500).send("Internal Server Error");
        }else if (result.length == 0 && !err){
            res.status(404).send("Not Found");
        }else if(result.length > 0 && !err) {
            res.status(200).send({
				history: result[0].history,
			});
      }
	});
})

app.put('/:username/history', (req, res) => {
	var newEntry = req.body.entry;
	var username = req.params.username;
	user.updateOne(
		{username: username},
		{$addToSet: { history: newEntry }},
		function(err,raw){
			if(!err){
				var query = { username: username };
				user.find(query, function(err2, result){
					if(!err2) res.status(200).send(result[0].history);
					else res.status(500).send("Internal server error");
				});
			}
		}
	);
});

// da hostname a indirizzo IpV4
app.get('/:username/resolve/a/:hostname', (req, res) => {
  var username = req.params.username;
  var hostname = req.params.hostname;

	var resolver = new Resolver();
	var query = { username: username };

	user.find(query, function(err, result){
	resolver.setServers([result[0].preferences.primary_dns, result[0].preferences.secondary_dns]);
		resolver.resolve4(hostname, function (err, addresses, family) {
			var entries = [];
			if (err || addresses == undefined) {
				res.status(400).send("Error");
				return;
			}
			for(var i = 0; i < addresses.length; i++) {
				entries.push({IP: addresses[i]})
			}
			res.status(200).send(entries);
		});
	});
});

// da hostname a indirizzo IpV6
app.get('/:username/resolve/aaaa/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  var username = req.params.username;
  var resolver = new Resolver();
	var query = { username: username};
	user.find(query, function(err, result) {
		resolver.setServers([result[0].preferences.primary_dns, result[0].preferences.secondary_dns]);
		resolver.resolve6(hostname, function (err, addresses, family) {
			if (err || addresses == undefined) {
				res.status(400).send("Error");
				return;
			}
			var entries = [];

			for(var i = 0; i < addresses.length; i++){
				entries.push({IP: addresses[i]})
			}
			res.status(200).send(entries);
		});
	});
})

app.get('/:username/resolve/any/:hostname', (req, res) => {
	var hostname = req.params.hostname;
	var username = req.params.username;
	var resolver = new Resolver();
	var query = { username: username};
	user.find(query, function(err, result) {
		resolver.setServers([result[0].preferences.primary_dns, result[0].preferences.secondary_dns]);
		resolver.resolveAny(hostname, function (err, entries) {
			if (err || entries == undefined) {
				res.status(400).send("Error");
				return;
			}
			var map = {};
			entries.forEach((entry, index, array) => {
				if(map[entry['type']] !== undefined){
					map[entry['type']].push(entry);
				} else {
					map[entry['type']] = [];
					map[entry['type']].push(entry);
				}
			});
			res.status(200).send(map);
		});
	});
});

app.get('/:username/resolve/soa/:domain', (req, res) => {
  var domain = req.params.domain;
  var username = req.params.username;
  var resolver = new Resolver();
	var query = { username: username};
	user.find(query, function(err, result){
		resolver.setServers([result[0].preferences.primary_dns, result[0].preferences.secondary_dns]);
		resolver.resolveSoa(domain, function (err, entry) {
			if (err || entry == undefined) {
				res.status(400).send("Error");
				return;
			}
			res.status(200).send([entry]);
		});
	});
})

// da IpV4 o IpV6 ad hostname
app.get('/:username/resolve/ip/:ip', (req, res) => {
  var ip = req.params.ip;
  var username = req.params.username;
  var resolver = new Resolver();
	var query = { username: username};
	user.find(query, function(err, result) {
		resolver.setServers([result[0].preferences.primary_dns, result[0].preferences.secondary_dns]);
		resolver.reverse(ip, function (err, hostnames) {
			if (err || hostnames == undefined) {
				res.status(400).send("Error");
				return;
			}
			var entries = [];

			for(var i = 0; i < hostnames.length; i++){
				entries.push({Hostname: hostnames[i]})
			}
			res.status(200).send(entries);
		});
	});
})

// ritorna CA per un record dns
app.get('/:username/resolve/caa/:domain', (req, res) => {
  var domain = req.params.domain;
  var username = req.params.username;
  var resolver = new Resolver();

	var query = { username: username};
	user.find(query, function(err, result){
		resolver.setServers([result[0].preferences.primary_dns, result[0].preferences.secondary_dns]);
		resolver.resolveCaa(domain, function (err, caas) {
			if (err || caas == undefined) {
				res.status(400).send("Error");
				return;
			}
			res.status(200).send(caas);
		});
	});
})

// Risolve indirizzo IP e porta in un hostname e in un servizio attivo su una porta
app.get('/:username/lookup/service/:ip/:port', (req, res) => {
  var ip = req.params.ip;
  var port = req.params.port;

  dns.lookupService(ip, parseInt(port), function (err, hostname, service) {
	  	if(err) {
				res.status(400).send("Error");
				return;
			}
      res.status(200).send([{Host: hostname, Port: port, Service: service}]);
  });
})

app.get('/:username/resolve/cname/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  var username = req.params.username;
  var resolver = new Resolver();
	var query = { username: username};

	user.find(query, function(err, result) {
		resolver.setServers([result[0].preferences.primary_dns, result[0].preferences.secondary_dns]);
		resolver.resolveCname(hostname, function (err, addresses) {
			if (err || addresses == undefined) {
				res.status(400).send("Error");
				return;
			}
			var entries = [];

			for(var i = 0; i < addresses.length; i++){
				entries.push({Hostname: addresses[i]})
			}
			res.status(200).send(entries);
		});
	});
})

// Torna i record mx per un certo dominio
app.get('/:username/resolve/mx/:domain', (req, res) => {
  var domain = req.params.domain;
  var username = req.params.username;
  var resolver = new Resolver();
	var query = { username: username};
	user.find(query, function(err, result) {
		if (err || result == undefined) {
			res.status(400).send("Error");
			return;
		}
		resolver.setServers([result[0].preferences.primary_dns, result[0].preferences.secondary_dns]);
		resolver.resolveMx(domain, function (err, names) {
			res.status(200).send(names);
		});
	});
})

// name server disponibili per un hostname
app.get('/:username/resolve/ns/:domain', (req, res) => {
  var domain = req.params.domain;
  var username = req.params.username;
  var resolver = new Resolver();
	var query = { username: username};

	user.find(query, function(err, result) {
		resolver.setServers([result[0].preferences.primary_dns, result[0].preferences.secondary_dns]);
		resolver.resolveNs(domain, function (err, addresses) {
			if (err || result == undefined) {
				res.status(400).send("Error");
				return;
			}
			var entries = [];

			for(var i = 0; i < addresses.length; i++){
				entries.push({NameServer: addresses[i]})
			}
			res.status(200).send(entries);
		});
	});
})

// name server disponibili per un hostname
app.get('/:username/resolve/srv/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  var username = req.params.username;
  var resolver = new Resolver();
	var query = { username: username};

	user.find(query, function(err, result) {
		resolver.setServers([result[0].preferences.primary_dns, result[0].preferences.secondary_dns]);
		resolver.resolveSrv(hostname, function (err, addresses) {
			if (err || result == undefined) {
				res.status(400).send("Error");
				return;
			}
			res.status(200).send(addresses);
		});
	});
})

app.get('/:username/resolve/ptr/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  var username = req.params.username;
  var resolver = new Resolver();
	var query = { username: username};
	user.find(query, function(err, result) {
		resolver.setServers([result[0].preferences.primary_dns, result[0].preferences.secondary_dns]);
		resolver.resolvePtr(hostname, function (err, addresses) {
			if (err || result == undefined) {
				res.status(400).send("Error");
				return;
			}
			var entries = [];

			for(var i = 0; i < addresses.length; i++){
				entries.push({Hostname: addresses[i]})
			}
			res.status(200).send(entries);
		});
	});
})

// Torna alcune informazioni
app.get('/:username/resolve/txt/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  var username = req.params.username;
  var resolver = new Resolver();
	var query = { username: username};
	user.find(query, function(err, result) {
		resolver.setServers([result[0].preferences.primary_dns, result[0].preferences.secondary_dns]);
		resolver.resolveTxt(hostname, function (err, txts) {
			if (err  || txts == undefined) {
				res.status(400).send("Error");
				return;
			}
			var entries = [];

			for(var i = 0; i < txts.length; i++){
				entries.push({Value: txts[i]})
			}

			res.status(200).send(entries);
		});
	});
})

// Ritorna i server impostati per il resolver
app.get('/:username/config/servers', (req, res) => {
  var username = req.params.username;
	var query = { username: username};
	user.find(query, function(err, result) {
		if(err) {
	    res.status(500).send("Internal Server Error");
	  } else if (result.length == 0 && !err) {
	      res.status(404).send("Not Found");
	  } else if(result.length > 0 && !err) {
	      res.status(200).send({
					preferences: result[0].preferences,
				});
    }
	});
})

app.get('/:username/config/clearhistory', (req, res) => {
  var username = req.params.username;
	user.updateOne({ username: username}, { history: []}, function(err,result) {
		if(err) { res.status(400).send("Error"); return; }
	});
	res.status(200).send('Ok');
})

// Setta un name server per la risoluzione
app.post('/:username/config/servers', (req, res) => {
  var username = req.params.username;
	var dns1 = req.body.dns1;
	var dns2 = req.body.dns2;

	user.updateOne(
		{username: username},
		{$set: { preferences: {primary_dns: dns1, secondary_dns: dns2}}},
		function(err, result) {
			if(err) {
				res.status(500).send("Server error");
				return;
			}
			res.status(200).send("Ok");
		}
	);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

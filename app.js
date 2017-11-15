var express = require('express');
var sql = require('mssql');
var app = express();
var path = require('path');
var port=process.env.PORT || 3000;
app.use(express.static('Lib'));
app.use(express.static('font-awesome-4.7.0'));
app.use(express.static('Images'));
app.use(express.static('Assets'));
var data;
 
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
}); 

app.get('/connect', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
   
    // Create a configuration object for our Azure SQL connection parameters
    var dbConfig = {
        server: "pladevseasqlsvrcentral02.database.windows.net",
        database: "pla-dev-sea-sqldb-central-03",
        user: "dell", 
        password: "Infosys@123", 
        port: 1433,
        options: {
            encrypt: true
        }
    };
    // Create connection instance
    var conn = new sql.ConnectionPool(dbConfig);

    conn.connect().then(function () {

        console.log("Connected to the Database....");

        // Create request instance, passing in connection instance
        var request = new sql.Request(conn);

        // Call mssql's query method passing in params
        request.query("SELECT * FROM [Platinum].[Region]")
        .then(function (result) {
            console.log("Query Successful. Results:");
            console.log(result);
            data = result;
            res.send(JSON.stringify(data));
            conn.close();
        })
        // Handle sql statement execution errors
        .catch(function (err) {
            console.log(err);
            conn.close();
        })
    })
    // Handle connection errors
    .catch(function (err) {
        console.log(err);
        conn.close();
    });
});

app.get('/fetchCentralData', function (req, res) {

    // Create a configuration object for our Azure SQL connection parameters
    var dbConfig = {
        server: "pladevseasqlsvrcentral02.database.windows.net",
        database: "pla-dev-sea-sqldb-central-03",
        user: "dell",
        password: "Infosys@123",
        port: 1433,
        options: {
            encrypt: true
        }
    };
    // Create connection instance
    var conn = new sql.ConnectionPool(dbConfig);

    conn.connect().then(function () {

        console.log("Connected to the Central Database for central data....");

        // Create request instance, passing in connection instance
        var request = new sql.Request(conn);

        // Call mssql's query method passing in params
        request.query("EXEC [Platinum].[GetDFJobDetails] 1")
        .then(function (result) {
            console.log("Central Query Successful. Results:");
            console.log(result);
            data = result;
            res.send(JSON.stringify(data));
            conn.close();
        })
        // Handle sql statement execution errors
        .catch(function (err) {
            console.log(err);
            conn.close();
        })
    })
    // Handle connection errors
    .catch(function (err) {
        console.log(err);
        conn.close();
    });
});

app.get('/fetchAJ3Data', function (req, res) {

    // Create a configuration object for our Azure SQL connection parameters
    var dbConfig = {
        server: "pladevseasqlsvrcentral02.database.windows.net",
        database: "pla-dev-sea-sqldb-central-03",
        user: "dell",
        password: "Infosys@123",
        port: 1433,
        options: {
            encrypt: true
        }
    };
    // Create connection instance
    var conn = new sql.ConnectionPool(dbConfig);

    conn.connect().then(function () {

        console.log("Connected to the Central Database for AJ3 data....");

        // Create request instance, passing in connection instance
        var request = new sql.Request(conn);

        // Call mssql's query method passing in params
        request.query("EXEC [Platinum].[GETHLSJOBDETAILS] 1")
        .then(function (result) {
            console.log("Central Query Successful. Results:");
            console.log(result);
            data = result;
            res.send(JSON.stringify(data));
            conn.close();
        })
        // Handle sql statement execution errors
        .catch(function (err) {
            console.log(err);
            conn.close();
        })
    })
    // Handle connection errors
    .catch(function (err) {
        console.log(err);
        conn.close();
    });
});

app.get('/fetchRegionData', function (req, res) {

    // Create a configuration object for our Azure SQL connection parameters
    var dbConfig = {
        server: req.query.Server,
        database: req.query.Database,
        user: req.query.UserID,
        password: req.query.Password,
        port: 1433,
        options: {
            encrypt: true
        }
    };
    // Create connection instance
    var conn = new sql.ConnectionPool(dbConfig);

    conn.connect().then(function () {

        console.log("Connected to the Regional Database for regional data...");

        // Create request instance, passing in connection instance
        var request = new sql.Request(conn);

        // Call mssql's query method passing in params
        request.query("EXEC [Platinum].[GetAJJobDetails] 1")
        .then(function (result) {
            console.log("Region Query Successful. Results:");
            console.log(result);
            data = result;
            res.send(JSON.stringify(data));
            conn.close();
        })
        // Handle sql statement execution errors
        .catch(function (err) {
            console.log(err);
            conn.close();
        })
    })
    // Handle connection errors
    .catch(function (err) {
        console.log(err);
        conn.close();
    });
});

app.listen(port, function () {
    console.log("Server Started on 8081....");
});

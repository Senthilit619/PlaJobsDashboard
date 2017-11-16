// JavaScript source code
var app = angular.module('myApp', []);
app.controller('myCtrl', function ($rootScope, $scope, $http) {

    // Constants
    $scope.ConnectionStatus = "Connected";
    $scope.loggedEmail = "newuser@dell.com";
    $scope.loading = false;
    $scope.message = true;
    $scope.collapsed = false;
    // Variables for toggle
    $scope.showtables = false;
    $scope.showimages = true;
    $scope.showpages = false;
    $scope.showselection = false;
    $scope.showsettings = false;

    // Table Details
    $scope.selection = "";
    $scope.centraltables = ["DF Summary"];
    $scope.AJ3tables = [];
    $scope.AJ3subtables = [];
    $scope.regiontables = ["Jobs Summary", "Enrich & Compact - AJ1 ", "Egress - AJ2"];
    $scope.pageLength = 0;
    $scope.selectedData = [];
    $scope.selectedTable = [];
    $scope.regionNames = [];    //Region Names
    $scope.regiondetails = [];  //Region Details
    $scope.centraldata = [];    //Central Data
    $scope.AJ3data = [];        //AJ3 Data
    $scope.regiondata = [];     //Region Data
    $scope.settingsdata = [];   //Settings Data
    
    $scope.changeEnvironment = function () {
        $scope.loading = true;
        $scope.message = false;
        if ($scope.environment == "Dev") {
            console.log($scope.environment);
            $http.get('connect').then(function (response) {
                $scope.ConnectionStatus = "Connected";
                $scope.data = response.data;
                //console.log("databases");
                console.log(response.data);
                for (i = 0; i < response.data.recordsets[0].length; i++) {
                    $scope.regionNames.push(response.data.recordsets[0][i].RegionName);
                    var temp = [];
                    var split1 = (response.data.recordsets[0][i].ConfigDB).split(";");                    
                    for (j = 0; j < split1.length; j++) {
                        var split2 = split1[j].split("=");
                        if (split2[0] == "Server" || split2[0] == "Database" || split2[0] == "User ID" || split2[0] == "Password")
                        {
                            temp.push(split2[1]);                            
                        }                            
                    }
                    $scope.regiondetails[i] = response.data.recordset[i];
                    $scope.regionFetch(temp);
               }
            });

            $http.get('fetchCentralData').then(function (response) {
                if (response.data != null) {
                    $scope.loading = false;
                }
                $scope.centraldata.push(response.data);
                //console.log("central data:");
                $scope.centraltables.push($scope.centraldata[0].recordsets[1][0].RegionName);
                $scope.centraltables.push($scope.centraldata[0].recordsets[2][0].RegionName);
            });

            $http.get('fetchSettings').then(function (response) {
                console.log("Settings Data:");                
                $scope.settingsdata.push(response.data);
                console.log($scope.settingsdata);
            });

            $http.get('fetchAJ3Data').then(function (response) {                
                console.log("AJ3 data:");
                $scope.AJ3data.push(response.data);
                console.log($scope.AJ3data[0].recordsets);
                console.log(response.data);
                $scope.AJ3tables.push("Region Summary - AJ3");
                for(i=1;i<$scope.AJ3data[0].recordsets.length;i++){
                    if($scope.AJ3tables.indexOf($scope.AJ3data[0].recordsets[i][0].JobName) == -1){
                        $scope.AJ3tables.push($scope.AJ3data[0].recordsets[i][0].JobName);
                    }
                    if ($scope.AJ3subtables.indexOf($scope.AJ3data[0].recordsets[i][0].RegionName) == -1) {
                        $scope.AJ3subtables.push($scope.AJ3data[0].recordsets[i][0].RegionName);
                    }
                }                
            });
        }
    };

    $scope.regionFetch = function (config) {
        $http.get("fetchRegionData", { params: { "Server": config[0], "Database": config[1], "UserID": config[2], "Password": config[3] } }).then(function (response) {
            console.log("region data");
            console.log(response.data);
            $scope.regiondata.push(response.data);
        }, function (error) {
            console.log(error);
        });        
    }

    $scope.showDatabase = function ($event) {

        //Hide all the list
        $(".dblist > li > div ~ ul").addClass("hide");
        //Show the current list
        $(event.target).siblings().toggleClass("hide");
        //Remove the highlight in all the names
        $(".dblist > li > div").removeClass("clicked");
        //Highlight the clicked name
        $(event.target).toggleClass("clicked");
        //Change the arrow to right in all the names
        $(".dblist > li > div > i").removeClass("fa-chevron-down");
        $(".dblist > li > div > i").addClass("fa-chevron-right");
        //Add the down arrow to the clicked name
        $(event.target).children("i").removeClass("fa-chevron-right");
        $(event.target).children("i").addClass("fa-chevron-down");        
    }

    $scope.showTables = function ($event) {
        $(event.target).parent().siblings("li").children("ul").addClass("hide");
        $(event.target).parent().siblings("li").children("div").removeClass("clicked");
        $(event.target).toggleClass("clicked");
        $(event.target).siblings().toggleClass("hide");
    }

    $scope.showData = function (name, $index, $event) {

        $scope.showselection = true;
        $scope.showtables = true;
        $scope.showimages = false;
        $scope.showpages = false;
        $scope.showsettings = false;

        if (name == 'Data Factory') {
            $scope.selection = name+ ' - ' + $scope.centraltables[$index];
        }
        else if (name == 'Settings') {
            $scope.selection = name;
            $scope.showtables = false;
            $scope.showimages = false;
            $scope.showsettings = true;
        }
        else {
            $scope.selection = name + ' - ' + $scope.regiontables[$index];
        }        

        if (name == 'Data Factory') {
            $scope.selectedData = [];
            $scope.selectedTable = [];
            $scope.selectedTable.push($scope.centraldata[0].recordsets[$index]);
            $scope.tableLength = $scope.selectedTable[0].length;
            $scope.selectedData = $scope.selectedTable[0].slice(0, 15);            
        }
        else if (name == 'Settings') {
            $scope.selectedTable = [];
            $scope.selectedTable.push($scope.settingsdata[0].recordsets);
            console.log($scope.selectedTable[0][0]);
        }
        else
        {
            $scope.selectedData = [];
            $scope.selectedTable = [];
            $scope.selectedTable.push($scope.regiondata[0].recordsets[$index]);
            $scope.tableLength = $scope.selectedTable[0].length;
            $scope.selectedData = $scope.selectedTable[0].slice(0, 15);
        }

        if ($scope.tableLength % 15 == 0) {
            $scope.pageLength = $scope.tableLength / 15;
            $scope.showpages = true;
        }
        else if ($scope.tableLength <= 15)  {
            $scope.pageLength = 1;
        }
        else if ($scope.tableLength % 15 != 0) {
            $scope.pageLength = parseInt($scope.tableLength / 15) + 1;
            $scope.showpages = true;
        }        
    }

    $scope.showAJ3data = function (jobName, regionName, $event) {
        if (regionName != undefined)
            $scope.selection = jobName + ' - ' + regionName;
        else
            $scope.selection = jobName;

        $scope.showselection = true;
        $scope.showtables = true;
        $scope.showimages = false;
        $scope.showpages = false;
        $scope.selectedData = [];
        $scope.selectedTable = [];

        //Select the table based on the click of the user
        if (jobName == "Region Summary - AJ3") {
            $scope.selectedTable.push($scope.AJ3data[0].recordsets[0]);
            $scope.tableLength = $scope.selectedTable[0].length;
            $scope.selectedData = $scope.selectedTable[0].slice(0, 15);
        }
        else {
            for (i = 1; i < $scope.AJ3data[0].recordsets.length; i++) {
                if (($scope.AJ3data[0].recordsets[i][0].JobName == jobName) && ($scope.AJ3data[0].recordsets[i][0].RegionName == regionName)) {
                    $scope.selectedTable.push($scope.AJ3data[0].recordsets[i]);
                    $scope.tableLength = $scope.selectedTable[0].length;
                    $scope.selectedData = $scope.selectedTable[0].slice(0, 15);
                }
                    
            }
        }

        // Calculations for Pagination
        if ($scope.tableLength % 15 == 0) {
            $scope.pageLength = $scope.tableLength / 15;
            if ($scope.pageLength > 1) {
                $scope.showpages = true;
            }            
        }
        else if ($scope.tableLength <= 15) {
            $scope.pageLength = 1;
            $scope.showpages = false;
        }
        else if ($scope.tableLength % 15 != 0) {
            $scope.pageLength = parseInt($scope.tableLength / 15) + 1;
            $scope.showpages = true;
        }
    }

    // Returns an empty array of length num
    $scope.getNumber = function (num) {
        return new Array(num);
    }

    // Filters the data in the table that fall within the selected range for pagination
    $scope.pagination = function ($index,$event) {
        var start = ($index-1)*15;
        var end = ($index) * 15;
        $scope.selectedData = $scope.selectedTable[0].slice(start, end);        
    }

});

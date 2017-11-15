// JavaScript source code
var app = angular.module('myApp', []);
app.controller('myCtrl', function ($rootScope, $scope, $http) {

    // Constants
    $scope.ConnectionStatus = "Connected";
    $scope.loggedEmail = "newuser@dell.com";
    $scope.loading = false;
    $scope.collapsed = false;
    // Variables for toggle
    $scope.showtables = false;
    $scope.showimages = true;
    $scope.showpages = false;
    $scope.showselection = false;

    // Table Details
    $scope.selection = "";
    $scope.centraltables = ["DF Summary"];
    $scope.AJ3tables = [];
    $scope.AJ3subtables = [];
    $scope.regiontables = ["AJ Summary", "AJ1 Details", "AJ2 Details"];
    $scope.pageLength = 0;
    $scope.selectedData = [];
    $scope.selectedTable = [];
    $scope.regionNames = [];    //Region Names
    $scope.regiondetails = [];  //Region Details
    $scope.centraldata = [];    //Central Data
    $scope.AJ3data = [];        //AJ3 Data
    $scope.regiondata = [];     //Region Data
    
    $scope.changeEnvironment = function () {
        $scope.loading = true;
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

            $http.get('fetchAJ3Data').then(function (response) {                
                console.log("AJ3 data:");
                $scope.AJ3data.push(response.data);
                console.log($scope.AJ3data[0].recordsets);
                console.log(response.data);
                $scope.AJ3tables.push("AJ3 - Summary");
                for(i=1;i<$scope.AJ3data[0].recordsets.length;i++){
                    if($scope.AJ3tables.indexOf($scope.AJ3data[0].recordsets[i][0].JobName) == -1){
                        $scope.AJ3tables.push($scope.AJ3data[0].recordsets[i][0].JobName);
                    }
                    if ($scope.AJ3subtables.indexOf($scope.AJ3data[0].recordsets[i][0].RegionName) == -1) {
                        $scope.AJ3subtables.push($scope.AJ3data[0].recordsets[i][0].RegionName);
                    }
                }
                //$scope.AJ3tables.push($scope.AJ3data[0].recordsets[1][0].JobName);
                //$scope.AJ3tables.push($scope.AJ3data[0].recordsets[3][0].JobName);
                //$scope.AJ3tables.push($scope.AJ3data[0].recordsets[5][0].JobName);
                //$scope.AJ3subtables.push($scope.AJ3data[0].recordsets[1][0].RegionName);
                //$scope.AJ3subtables.push($scope.AJ3data[0].recordsets[2][0].RegionName);
                console.log($scope.AJ3subtables);
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

    $scope.showTables = function ($event) {              
        $("#database li div").siblings("ul").addClass("hide");
        $("#database li div").removeClass("clicked");
        $(event.target).toggleClass("clicked");
        $(event.target).siblings().toggleClass("hide");
    }

    $scope.showSubTables = function ($event) {
        $(event.target).parent().siblings("li").children("ul").addClass("hide");
        $(event.target).parent().siblings("li").children("div").removeClass("clicked");
        $(event.target).toggleClass("clicked");
        $(event.target).siblings().toggleClass("hide");
    }

    $scope.showData = function (name, $index, $event) {

        if (name == 'Data Factory') {
            $scope.selection = name+ ' - ' + $scope.centraltables[$index];
        }
        else {
            $scope.selection = name + ' - ' + $scope.regiontables[$index];
        }
        $scope.showselection = true;        
        $scope.showtables = true;
        $scope.showimages = false;
        $scope.showpages = false;

        $(event.target).siblings().removeClass("selected");
        $(event.target).toggleClass("selected");
        
        if (name == 'central') {
            $scope.selectedData = [];
            $scope.selectedTable = [];
            $scope.selectedTable.push($scope.centraldata[0].recordsets[$index]);
            $scope.tableLength = $scope.selectedTable[0].length;
            $scope.selectedData = $scope.selectedTable[0].slice(0, 15);            
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
            console
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
        console.log(jobName, regionName);

        $(event.target).siblings().removeClass("selected");
        $(event.target).toggleClass("selected");

        $scope.selectedData = [];
        $scope.selectedTable = [];

        //Select the table based on the click of the user
        if (jobName == "AJ3 - Summary") {
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

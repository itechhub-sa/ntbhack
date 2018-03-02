$(document).ready(function () {
    queue()
        .defer(d3.json, "/app/api/get_data/")
        .awaitAll(handleData);

    function handleData(error, data) {
        graphKPIDashboard(data[0]);
    }

    function graphKPIDashboard(recordsJson) {
        //Clean data
        var records = [];
        //var dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ");
        var dateFormat = d3.time.format.iso;


        recordsJson.forEach(function (d) {

            for (var i = 0; i < d['audits'].length; i++) {
                tmp = {}
                tmp['category'] = d['category']
                tmp['name'] = d['name']
                tmp['audits_fy'] = d['audits'][i]['financial_year_end']
                tmp['audit_opinion'] = d['audits'][i]['opinion']
                tmp['wasteful_fy'] = d['wasteful'][i]['financial_year_end']
                tmp['wasteful_amount'] = Number(d['wasteful'][i]['amount'])
                tmp['wasteful_name'] = d['wasteful'][i]['item_label']

                //console.log()

                records.push(tmp);
            }


            /*
            tmp["date_submitted"] = dateFormat.parse(d["date_submitted"]);
            tmp["date_created"] = new Date(d["date_created"]);
            tmp["date_submitted"].setMinutes(0);
            tmp["date_submitted"].setSeconds(0);
            tmp["category"] = d["category"];
            tmp["defect"] = d["defect"];
            tmp["location"] = d["location"];
            var user = d['reporters'][i]['user'];
            tmp["reporter"] = user['first_name'] + " " + user['last_name'];
            records.push(tmp);
            }*/
        });

        //console.log(records);

        //Create a Crossfilter instance
        var ndx = crossfilter(records);

        var categoryDim = ndx.dimension(function (d) { return d["category"]; });
        var categoryGroup = categoryDim.group();
        var charts_height = 150
        dc.pieChart("#category-chart")
            .width(200)
            .height(charts_height)
            .dimension(categoryDim)
            .group(categoryGroup)
            .legend(dc.legend().x(210).y(20))
            .innerRadius(20);

        var auditsFYDim = ndx.dimension(function (d) { return d["audits_fy"]; });
        var auditsFYGroup = auditsFYDim.group();
        dc.barChart("#audits-chart")
            .width(200)
            .height(charts_height)
            //.margins({ top: 10, right: 50, bottom: 40, left: 40 })
            .dimension(auditsFYDim)
            .group(auditsFYGroup)
            .controlsUseVisibility(true)
            .transitionDuration(500)
            .x(d3.scale.ordinal().domain(["2011", "2012", "2013", "2014", "2015", "2016"]))
            .xUnits(dc.units.ordinal)
            //.xAxisLabel("Year")
            //.yAxisLabel("Number of audits")
            .barPadding(0.1)
            .yAxis().ticks(5);

        var wastefulFYDim = ndx.dimension(function (d) { return d["wasteful_fy"]; });
        //var wastefulamountDim = ndx.dimension(function (d) { return d["wasteful_amount"]; });
        var wastefulFYGroup = wastefulFYDim.group().reduceSum(function (d) { return d.wasteful_amount });
        dc.barChart("#wasteful-chart")
            .width(170)
            .height(charts_height)
            //.margins({ top: 10, right: 50, bottom: 40, left: 40 })
            .dimension(wastefulFYDim)
            .group(wastefulFYGroup)
            .controlsUseVisibility(true)
            .transitionDuration(500)
            .x(d3.scale.ordinal().domain(["2012", "2013", "2014", "2015"]))
            .xUnits(dc.units.ordinal)
            //.yAxis()
            .barPadding(0.1)
            .yAxis().ticks(5).tickFormat(d3.format('.1s'));
        //.xAxisLabel("Year")
        //.yAxisLabel("Number of audits");


        dc.renderAll();

        print_filter(wastefulFYGroup);

        /*/Define Dimensions
        var submittedDim = ndx.dimension(function (d) { return d["date_submitted"]; });
        var createdDim = ndx.dimension(function (d) { return d["date_created"]; });
        var categoryDim = ndx.dimension(function (d) { return d["category"]; });
        var defectDim = ndx.dimension(function (d) { return d["defect"]; });
        var locationDim = ndx.dimension(function (d) { return d["location"]; });
        var reporterDim = ndx.dimension(function (d) { return d["reporter"]; });
        var allDim = ndx.dimension(function (d) { return d; });

        //Group Data
        var submittedGroup = submittedDim.group();
        var createdGroup = createdDim.group();
        var categoryGroup = categoryDim.group();
        var defectGroup = defectDim.group();
        var locationGroup = locationDim.group();
        var reporterGroup = reporterDim.group();
        var all = ndx.groupAll();

        //Charts
        var numberRecordsND = dc.numberDisplay("#number-records-nd");
        var submittedChart = dc.barChart("#submitted-chart");
        //var createdChart = dc.barChart("#created-chart");
        var categoryChart = dc.pieChart("#category-chart");
        var defectChart = dc.rowChart("#defect-chart");
        var locationChart = dc.rowChart("#location-chart");
        var reporterChart = dc.rowChart("#reporter-chart");

        var minDate = submittedDim.bottom(1)[0]["date_submitted"];
        var maxDate = submittedDim.top(1)[0]["date_submitted"];

        numberRecordsND
            .formatNumber(d3.format("d"))
            .valueAccessor(function (d) { return d; })
            .group(all);

        submittedChart
            .width(1560)
            .height(395)
            .margins({ top: 10, right: 50, bottom: 40, left: 40 })
            .dimension(submittedDim)
            .group(submittedGroup)
            .xUnits(d3.time.days)
            .controlsUseVisibility(true)
            .transitionDuration(500)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .elasticY(true)
            .xAxisLabel("Years")
            .yAxisLabel("Amount in Rands");

        categoryChart
            .width(350)
            .height(390)
            .dimension(categoryDim)
            .group(categoryGroup)
            .legend(dc.legend().x(380).y(20))
            .innerRadius(20);

        locationChart
            .data(function (group) { return group.top(10); })
            .width(300)
            .height(390)
            .dimension(locationDim)
            .group(locationGroup)
            .ordering(function (d) { return -d.value })
            //.colors(['#6baed6'])
            .elasticX(true)
            .xAxis().ticks(4);

        defectChart
            .data(function (group) { return group.top(10); })
            .width(300)
            .height(390)
            .dimension(defectDim)
            .group(defectGroup)
            .ordering(function (d) { return -d.value })
            //.colors(['#6baed6'])
            .elasticX(true)
            .xAxis().ticks(4);

        reporterChart
            .data(function (group) { return group.top(3); })
            .width(240)
            .height(180)
            .dimension(reporterDim)
            .group(reporterGroup)
            .ordering(function (d) { return -d.value })
            //.colors(['#6baed6'])
            .elasticX(true)
            .xAxis().ticks(4);

        dc.renderAll();

        // Reset plots
        d3.selectAll('a#reset-all').on('click', function () {
            dc.filterAll();
            dc.redrawAll();
        });

        d3.selectAll('a#reset-submitted').on('click', function () {
            submittedChart.filterAll();
            dc.redrawAll();
        });

        d3.selectAll('a#reset-category').on('click', function () {
            categoryChart.filterAll();
            dc.redrawAll();
        });

        d3.selectAll('a#reset-location').on('click', function () {
            locationChart.filterAll();
            dc.redrawAll();
        });

        d3.selectAll('a#reset-defect').on('click', function () {
            defectChart.filterAll();
            dc.redrawAll();
        });

        d3.selectAll('a#reset-reporter').on('click', function () {
            reporterChart.filterAll();
            dc.redrawAll();
        });
    }


    function makeCasesGraphs(recordsJson) {

        recordsJson.forEach(function (d) {
            var emp = getUser(parseInt(d["responder"]));
            d['job_title'] = emp['job_title'];
            var user = emp['user'];
            d['emp_name'] = user['first_name'] + " " + user['last_name'];
        });


        function getUser(userId) {
            var url = document.location.origin + "/app/api/get_employee/" + userId + "/";
            var result = null;

            $.ajax({
                url: url,
                async: false,
                success: function (data) {
                    result = data;
                }
            });

            return result[0];
        }

        //Create a Crossfilter instance
        var ndx = crossfilter(recordsJson);

        var reasonDim = ndx.dimension(function (d) { return d["reason"]; });
        var statusDim = ndx.dimension(function (d) { return d["status"]; });
        var nameDim = ndx.dimension(function (d) { return d["emp_name"]; });
        var titleDim = ndx.dimension(function (d) { return d["job_title"]; });
        var allDim = ndx.dimension(function (d) { return d; });

        var reasonGroup = reasonDim.group();
        var statusGroup = statusDim.group();
        var nameGroup = nameDim.group();
        var titleGroup = titleDim.group();
        var all = ndx.groupAll();

        var numberRecordsND = dc.numberDisplay("#number-records-nd1");
        var reasonChart = dc.rowChart("#reason-chart");
        var statusChart = dc.pieChart("#status-chart");
        var nameChart = dc.rowChart("#name-chart");
        var titleChart = dc.rowChart("#job-title-chart");

        numberRecordsND
            .formatNumber(d3.format("d"))
            .valueAccessor(function (d) { return d; })
            .group(all);

        statusChart
            .width(350)
            .height(390)
            .dimension(statusDim)
            .group(statusGroup)
            .legend(dc.legend().x(380).y(20))
            .innerRadius(20);

        reasonChart
            .data(function (group) { return group.top(10); })
            .width(300)
            .height(390)
            .dimension(reasonDim)
            .group(reasonGroup)
            .ordering(function (d) { return -d.value })
            .elasticX(true)
            .xAxis().ticks(4);

        nameChart
            .data(function (group) { return group.top(10); })
            .width(300)
            .height(390)
            .dimension(nameDim)
            .group(nameGroup)
            .ordering(function (d) { return -d.value })
            .elasticX(true)
            .xAxis().ticks(4);

        titleChart
            .data(function (group) { return group.top(10); })
            .width(300)
            .height(180)
            .dimension(titleDim)
            .group(titleGroup)
            .ordering(function (d) { return -d.value })
            .elasticX(true)
            .xAxis().ticks(4);

        dc.renderAll();

        // Reset plots
        d3.selectAll('a#reset-all1').on('click', function () {
            dc.filterAll();
            dc.redrawAll();
        });

        d3.selectAll('a#reset-status').on('click', function () {
            statusChart.filterAll();
            dc.redrawAll();
        });

        d3.selectAll('a#reset-name').on('click', function () {
            nameChart.filterAll();
            dc.redrawAll();
        });

        d3.selectAll('a#reset-reason').on('click', function () {
            reasonChart.filterAll();
            dc.redrawAll();
        });

        d3.selectAll('a#reset-title').on('click', function () {
            titleChart.filterAll();
            dc.redrawAll();
        });
        */
    }
});
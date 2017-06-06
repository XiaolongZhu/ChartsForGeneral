var LineChart = {};
LineChart.initGraph = function(data, parameters, div_id) {
	$.getJSON(data, function(source_data) {
		LineChart.graphRender(source_data, parameters, div_id);
	});
};

LineChart.graphRender = function(data, parameters, div_id) {

	//console.log(data);
	$(div_id).html("");
	var height = parameters["height"];
	var width = parameters["width"];
	var margin = parameters["margin"];
	var category = parameters["category"];

	var x_array = [];
	for(var i = 0; i < category.length; i++) {
		var current_cate = data[category[i]];
		//console.log(current_cate);
		for(var j = 0; j < current_cate.length; j++) {
			var x_element = Object.keys(current_cate[j])[0];
			//console.log(x_element);
			if(x_array.indexOf(x_element) == -1) {
				x_array.push(x_element);
			}
		}
	}
	//console.log(x_array);
	var padding = parameters["padding"];
	var x_scale = d3.scalePoint()
		.domain(x_array)
		.range([0, width - margin.left - margin.right])
		.padding(padding)
		.round(true);

	var y_max = 0;
	for(var i = 0; i < category.length; i++) {
		var current_cate = data[category[i]];
		//console.log(current_cate);
		for(var j = 0; j < current_cate.length; j++) {
			var y_element = Object.values(current_cate[j])[0];
			//console.log(x_element);
			if(y_element > y_max) {
				y_max = y_element;
			}
		}
	}
	//console.log(y_max);
	var category_y_max = Math.ceil(y_max / 10) * 10;
	var y_scale = d3.scaleLinear()
		.domain([0, category_y_max])
		.range([height - margin.top - margin.bottom, 0]);

	var svg = d3.select(div_id).append("svg")
		.attr("class", "line_chart")
		.attr("height", height)
		.attr("width", width);

	var svg_axes = svg.append("g").attr("class", "axes");
	var svg_xAxis = d3.axisBottom()
		.scale(x_scale);
	var svg_yAxis = d3.axisLeft()
		.scale(y_scale);
	svg_axes.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
		.call(svg_xAxis);
	svg_axes.append("g")
		.attr("class", "y_axis")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(svg_yAxis);
	var if_y_axis = parameters["y_axis"];
	if(if_y_axis != true) {
		$(div_id + " .y_axis path").hide();
		$(div_id + " .y_axis .tick line").hide();
	}
	var if_x_axis = parameters["x_axis"];
	if(if_x_axis != true) {
		$(div_id + " .x_axis path").hide();
		$(div_id + " .x_axis .tick line").hide();
	}

	var if_grid_lines = parameters["grid_lines"];
	if(if_grid_lines == true) {
		//add the Y gridlines
		svg_axes.append("g")
			.attr("class", "grid_lines")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.call(svg_yAxis
				.tickSize(-(width - margin.left - margin.right))
				.tickFormat("")
			);
		svg_axes.selectAll(".grid_lines .tick line")
			.attr("style", "stroke-width:1; stroke:#808080; opacity: 0.5;");
		$(div_id + " .grid_lines path").hide();
	}

	var colors = d3.schemeCategory10;

	var graph_line = d3.line()
		.x(function(d) {
			//console.log(x_scale(Object.keys(d)[0]));
			return x_scale(Object.keys(d)[0]) + margin.left;
		})
		.y(function(d) {
			//console.log(y_scale(Object.values(d)[0]));
			return y_scale(Object.values(d)[0]) + margin.top;
		});

	var line_width = parameters["line_width"];
	for(var i = 0; i < category.length; i++) {
		var current_cate = data[category[i]];
		svg.selectAll("path.line_" + i)
			.data([current_cate])
			.enter()
			.append("path")
			.attr("class", "line_" + i)
			.attr("fill", "none")
			.attr("style", "stroke-width:" + line_width + "; stroke:" + colors[i])
			.attr("d", graph_line);
	}

};
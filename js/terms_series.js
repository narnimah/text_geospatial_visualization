var gdata;
var data;
var relationships = [];
var top_terms_series = [];
var dts = [];
var links = [];
var dataArray = [];

var relationships = [];
var internalrelationships = [];
var tempNode=[];
var tempLinks=[];
var dataSet=[]; 
var links = [];

var datearray = [];
var colorrange = ["#3366cc", "#dc3912", "#B30000", "#109618"];

// Initialized dates 
bDate = '2004-11-01';
eDate = '2016-12-01';

// initialized term
var term = "";

function formatDate(d) {
        month = '' + (d.getMonth() + 1);
        if (month.length < 2) month = '0' + month;
        year = d.getFullYear();
        return [year, month, '01'].join('');
}

function getSortedKeys(obj) {
  //console.log(obj);
  var arr = []; 
  for(var key in obj)
    if (key != 'undefined') {
      arr.push({ 'key': key, 'freq': obj[key] });

    }
  
  return arr.sort(function(a,b){ return b.freq - a.freq });
}

d3.tsv("wikinews.tsv", function(error, data_) {
//d3.tsv("huffington.tsv", function(error, data_) {
      if (error) throw error;
    data = data_;
    ts = new Object();

    data.forEach(function(d) {
        d.date = new Date(d["time"]);
        d.date.setDate(1);

        dt = formatDate(d.date);

        if (!ts[dt]) {
          ts[dt] = new Object();
        }

        if (d["person"] != ""){
            var list = d["person"].split("|");
            for (var i=0; i<list.length;i++) {
                var term = list[i];
 
                if (!ts[dt][term]){
                    ts[dt][term] = new Object();
                    ts[dt][term].freq = 1;
                    ts[dt][term].date = d.date;
                    ts[dt][term].category = "person";
                } else {
                  ts[dt][term].freq++;
                }  
                    
            }
        }

        if (d["location"] != "" && d["location"] != 1) {
            var list = d["location"].split("|");
            for (var i=0; i<list.length;i++) {
                var term = list[i];
 
                if (!ts[dt][term]){
                    ts[dt][term] = new Object();
                    ts[dt][term].freq = 1;
                    ts[dt][term].date = d.date;
                    ts[dt][term].category = "location";
                } else {
                  ts[dt][term].freq++;
                }  
                    
            }
        }

        if (d["organization"] != "" && d["organization"] != 1) {
            var list = d["organization"].split("|");
            for (var i=0; i<list.length;i++) {
                var term = list[i];
 
                if (!ts[dt][term]){
                    ts[dt][term] = new Object();
                    ts[dt][term].freq = 1;
                    ts[dt][term].date = d.date;
                    ts[dt][term].category = "organization";
                } else {
                  ts[dt][term].freq++;
                }  
                    
            }
        }

        if (d["miscellaneous"] != "" && d["miscellaneous"] != 1) {
            var list = d["miscellaneous"].split("|");
            for (var i=0; i<list.length;i++) {
                var term = list[i];
 
                if (!ts[dt][term]){
                    ts[dt][term] = new Object();
                    ts[dt][term].freq = 1;
                    ts[dt][term].date = d.date;
                    ts[dt][term].category = "miscellaneous";
                } else {
                  ts[dt][term].freq++;
                }  
                    
            }
        }
  });

  for (var key in ts) {
    dts.push( key );
    dts[key] = [];

    for (var dt_ in ts[key]) {
      dts[key].push({ term: dt_, category: ts[key][dt_].category, 
              freq: ts[key][dt_].freq, date: ts[key][dt_].date });
    }
  }
  //console.log(dts);

  // Initialized dates 
  bDate = '2004-11-01';
  eDate = '2016-12-01';

  fbDate = formatDate(new Date(bDate));
  feDate = formatDate(new Date(eDate));

  var top_terms = getTopTermsFreq(fbDate, feDate);
  //console.log(top_terms);
  // wordCloud(top_terms);
  //Create a new instance of the word cloud visualisation.
  var myWordCloud = wordCloud('#cloud-svg');
  //Start cycling through the demo data
  showNewWords(myWordCloud, top_terms);
  
  top_terms_series = getTopTermsTimeSeries(fbDate, feDate, top_terms);

  for(var term in top_terms_series) {
      dataArray.push(top_terms_series[term]);
      //console.log(term);
  }
    
  
  //chart(d.text, "blue");

});

function getTopTermsFreq(sDate, eDate) {
  tsFreq = [];
  
  var tsF = Object.keys(dts).filter(function(dt) {
    return (dt >= sDate && dt <= eDate);
  });

  for (var t in dts) {
    if (tsF.includes(t)) {
      for (var f in dts[t]) {

        if (!tsFreq[dts[t][f]['term']])
          tsFreq[dts[t][f]['term']] = 1;
        else
          tsFreq[dts[t][f]['term']]++;
      }
    }
  }

  console.log(tsFreq);

  return getSortedKeys(tsFreq).slice(0,50);
}

function getTopTermsTimeSeries(sDate, eDate, terms) {
  terms_ts = [];
  termsArray = [];
  terms.forEach(function(d) {
    if (!terms[d.key])
      terms_ts[d.key] = [];
    termsArray.push(d.key);
  });

  var tsF = Object.keys(dts).filter(function(dt) {
    return (dt >= sDate && dt <= eDate);
  });

  for (var t in dts) {
    
    if (tsF.includes(t)) {
      for (var f in dts[t]) {

        if (termsArray.includes(dts[t][f].term))
          terms_ts[dts[t][f].term].push(dts[t][f]);

      }
    }

  }

  for (var t in terms_ts) {
    terms_ts[t].sort(function(a,b) {
      if (a.date < b.date) 
        return -1;
      else if (a.date > b.date)
        return 1;
      else
        return 0;
    });
  }

  return terms_ts;
}

var wc_width = 400;
var wc_height = 600;

/*
var fontScale = d3.scale.linear()
                    .domain(d3.extent(words, function(d) {
                        return d.freq;
                      })).range([10,35]);
*/

function getWords(words) {
    return words.map(function(d) {
                return { text: d.key, size: Math.max( Math.random() * 40, d.freq/5)};
            })
}

// Extract new words
function showNewWords(vis, words) {
    
    vis.update( getWords(words) ) 
}


function wordCloud(selector) {
    var fill = d3.scale.category20();
    d3.select("#word_cloud").remove();

    var svg = d3.select(selector).append("svg")
        .attr("id", "word_cloud")
        .attr("width", wc_width)
        .attr("height", wc_height)
        .append("g")
        .attr("transform", "translate("+ wc_width/2 +","+ wc_height/2 +")");

    function draw(words) {
        var cloud = svg.selectAll("g text")
                        .data(words, function(d) { return d.text; })
  
        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
      .attr("val",function(d){return d.text;})
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; })
      .on("mouseover", function(d) {
                d3.select("svg#word_cloud").selectAll("g text")
                  .each(function(t) {
                    var selectedText = d3.select(this);
                    if (t.text == d.text)
                      selectedText.attr("opacity", "1");
                    else
                      selectedText.attr("opacity", "0.2");
                  });
            })
            .on("mouseout", function(d) {

              d3.select("svg#word_cloud")
                .selectAll("g text")
                .attr("opacity", "1");
                
            })
            .on("click", function (d, i){

                if (!isRelationshipActive)
                  chart(d.text, "blue");
                else {
                  getRelationships(d.text);
                  generateLinks(d.text);
                }

            });
        //Entering and existing words
        cloud
            .transition()
                .duration(600)
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                //.attr("transform", "translate("+ wc_width/2 +","+ wc_height/2 +")")
                .style("fill-opacity", 1);
        //Exiting words
        cloud.exit()
            .transition()
                .duration(200)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
    }

    return {
    
        update: function(words) {
            d3.layout.cloud().size([wc_width,wc_height])
                .words(words)
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();
        }
    }
}

function chart(term, color) {

// colorrange = { "blue": }
if (color == "blue") {
  colorrange = ["#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6"];
}
else if (color == "pink") {
  colorrange = ["#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1EEF6"];
}
else if (color == "orange") {
  colorrange = ["#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9"];
}
strokecolor = colorrange[0];

var format = d3.time.format("%m/%d/%y");

var margin = {top: 20, right: 40, bottom: 30, left: 30};
var width = 650 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "remove")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("top", "30px")
    .style("left", "55px");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height-10, 0]);

//var z = d3.scale.ordinal()
//    .range(colorrange);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.years);

var yAxis = d3.svg.axis()
    .scale(y);

var yAxisr = d3.svg.axis()
    .scale(y);

var stack = d3.layout.stack()
    .offset("silhouette")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return parseInt(d.freq); });

var nest = d3.nest()
   .key(function(d) { return d.term; });

var area = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

d3.select("#ts_chart").remove();

var svg = d3.select("#chart").append("svg")
    .attr("id", "ts_chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var newarray = [];
  for (var t in dataArray)
    if (dataArray[t][0].term == term)
        newarray = dataArray[t];

  var layers = stack( nest.entries(newarray) );

  x.domain(d3.extent(newarray, function(d) { return d.date; }));
  y.domain([0, d3.max(newarray, function(d) { return d.y0 + d.y; })]);

  svg.selectAll(".layer")
      .data(layers)
    .enter().append("path")
      .attr("class", "layer")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d, i) {
        if (d.values[0].category == "person")
          return colorrange[0];
        else if (d.values[0].category == "location")
          return colorrange[1];
        else if (d.values[0].category == "organization")
          return colorrange[2];
        else if (d.values[0].category == "miscellaneous")
          return colorrange[3];
      });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ", 0)")
      .call(yAxis.orient("right"));

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis.orient("left"));

  svg.selectAll(".layer")
    .attr("opacity", 1)
    .on("mouseover", function(d, i) {
      svg.selectAll(".layer").transition()
      .duration(250)
      .attr("opacity", function(d, j) {
        return j != i ? 0.6 : 1;
    })})

    .on("mousemove", function(d, i) {
      mousex = d3.mouse(this);
      mousex = mousex[0];
      var invertedx = x.invert(mousex);
      invertedx = invertedx.getMonth() + invertedx.getDate();
      var selected = (d.values);
      for (var k = 0; k < selected.length; k++) {
        datearray[k] = selected[k].date
        datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
      }

      mousedate = datearray.indexOf(invertedx);
      console.log(d.values[mousedate]);
      pro = d.values[mousedate].freq;

      d3.select(this)
      .classed("hover", true)
      .attr("stroke", function(d) {
          if (d.values[0].category == "person")
            return colorrange[0];
          else if (d.values[0].category == "location")
            return colorrange[1];
          else if (d.values[0].category == "organization")
            return colorrange[2];
          else if (d.values[0].category == "miscellaneous")
            return colorrange[3];
      })
      .attr("stroke-width", "0.5px"), 
      tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "visible");
      
    })
    .on("mouseout", function(d, i) {
     svg.selectAll(".layer")
      .transition()
      .duration(250)
      .attr("opacity", "1");
      d3.select(this)
      .classed("hover", false)
      .attr("stroke-width", "0px"), tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "hidden");
  })
    
  var vertical = d3.select("#chart")
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "19")
        .style("width", "1px")
        .style("height", "380px")
        .style("top", "10px")
        .style("bottom", "30px")
        .style("left", "0px")
        .style("background", "#fff");

  d3.select("#chart")
      .on("mousemove", function(){  
         mousex = d3.mouse(this);
         mousex = mousex[0] + 5;
         vertical.style("left", mousex + "px" )})
      .on("mouseover", function(){  
         mousex = d3.mouse(this);
         mousex = mousex[0] + 5;
         vertical.style("left", mousex + "px")});
}
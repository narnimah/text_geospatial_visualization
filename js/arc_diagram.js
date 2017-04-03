/* GLOBALS */

var width  = 750;           // width of svg image
var height = 500;           // height of svg image
var margin = 20;            // amount of margin around plot area
var pad = margin / 2;       // actual padding amount
var radius = 4;             // fixed node radius
var yfixed = pad + radius;  // y position for all nodes

function getRelationships(search_term) {
    
    data.forEach(function(d) {
        
        var line = d["person"] + "|" + d["location"] + "|" + d["organization"] + "|" + d["miscellaneous"];
        var list = line.split("|");

        if (!line.includes(search_term)) 
            return;
        
        for (var i=0; i<list.length;i++){
            var term = list[i];
            if (!relationships[search_term]) 
                relationships[search_term] = [];

            if (!relationships[search_term][term])
                relationships[search_term][term] = 1;
            else
                relationships[search_term][term]++;
        }
             
    });

    relationships = sortRelationships(relationships[search_term]).slice(0,50);
}

function sortRelationships(obj) {
    var arr = []; 
    for(var key in obj)
      if (key != 'undefined')
        arr.push({ 'term': key, 'freq': obj[key] });
    
    return arr.sort(function(a,b){ return b.freq - a.freq });
}

function generateLinks(term) {
    //console.log(relationships[term]);
    var force = relationships;
    //console.log(force);
    var data=[];
    var i=0;
    
    force.forEach(function(f) {
        if(!data[f.term])
            data[f.term]=0;
        data[f.term]=i++;
    });
    i=0;

    tempLinks = [];
    tempNode = [];
    links = [];
    dataSet = [];
    
    force.forEach(function(f) {
        tempNode.push({name:f.term, group:i});
        links.push({ source: term, target: f.term, value: f.freq });
        tempLinks.push({source:data[f.term], target:data[term], value: f.freq});
        dataSet.push(f.term);
        i++;
    });

    generateMoreLinks(data);
    arcDiagram();
    
}

function generateMoreLinks(data1){

    data.forEach(function(d) {

        var line = d["person"] + "|" + d["location"] + "|" + d["organization"] + "|" + d["miscellaneous"];
        
        for(var i=1;i<dataSet.length;i++){
        // Return if the line does not contain the given term
            
            if (!line.includes(dataSet[i])) continue;
            
            for(var j=i+1;j<dataSet.length;j++){
            
                if (!line.includes(dataSet[j])) continue;
                
                    //console.log("term1:"+dataSet[i]+"term2:"+dataSet[j]);
                    
                if (!internalrelationships[dataSet[i]]) internalrelationships[dataSet[i]] = [];
                
                if (!internalrelationships[dataSet[i]][dataSet[j]])
                    internalrelationships[dataSet[i]][dataSet[j]] = 1;
            else
                internalrelationships[dataSet[i]][dataSet[j]]++;
            }
      }
    });
    for(i=1; i < dataSet.length; i++) {
        var force = sortRelationships(internalrelationships[dataSet[i]]).slice(0,10); //Shows only 10 words 
        //console.log(force);
            
    force.forEach(function(f) {
            //console.log("Source:"+data1[f.term]+"\ttarget"+data1[dataSet[i]]);
            if(data1[f.term]!=undefined)
            tempLinks.push({source:data1[f.term], target:data1[dataSet[i]], value: f.freq});
    });
    
    }
    //console.log(tempLinks);
}

/* HELPER FUNCTIONS */

// Generates a tooltip for a SVG circle element based on its ID
function addTooltip(circle) {
    var x = parseFloat(circle.attr("cx"));
    var y = parseFloat(circle.attr("cy"));
    var r = parseFloat(circle.attr("r"));
    var text = circle.attr("id");

    var tooltip = d3.select("#plot")
        .append("text")
        .text(text)
        .attr("x", x)
        .attr("y", y)
        .attr("dy", -r * 2)
        .attr("id", "tooltip");

    var offset = tooltip.node().getBBox().width / 2;

    if ((x - offset) < 0) {
        tooltip.attr("text-anchor", "start");
        tooltip.attr("dx", -r);
    }
    else if ((x + offset) > (width - margin)) {
        tooltip.attr("text-anchor", "end");
        tooltip.attr("dx", r);
    }
    else {
        tooltip.attr("text-anchor", "middle");
        tooltip.attr("dx", 0);
    }
}

/* MAIN DRAW METHOD */

// Draws an arc diagram for the provided undirected graph
function arcDiagram() {
    //debugger;
    d3.selectAll("svg#arc").remove();
    //d3.select("#plot").remove();
    // create svg image
    var svg  = d3.select("#relationships")
        .append("svg")
        .attr("id", "arc")
        .attr("width", width)
        .attr("height", height);

    // create plot area within svg image
    var plot = svg.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + pad + ", " + pad + ")");



    // fix graph links to map to objects instead of indices
    tempLinks.forEach(function(d, i) {
        d.source = isNaN(d.source) ? d.source : tempNode[d.source];
        d.target = isNaN(d.target) ? d.target : tempNode[d.target];
    });

    // must be done AFTER links are fixed
    linearLayout(tempNode);

    // draw links first, so nodes appear on top
    drawLinks(tempLinks);

    // draw nodes last
    drawNodes(tempNode);
}

// Layout nodes linearly, sorted by group
function linearLayout(nodes) {
    // sort nodes by group
    nodes.sort(function(a, b) {
        return a.group - b.group;
    })

    // used to scale node index to x position
    var xscale = d3.scale.linear()
        .domain([0, nodes.length - 1])
        .range([radius, width - margin - radius]);

    // calculate pixel location for each node
    nodes.forEach(function(d, i) {
        d.x = xscale(i);
        d.y = yfixed;
    });
}

// Draws nodes on plot
function drawNodes(nodes) {
    // used to assign nodes color by group
    var color = d3.scale.category20();

    d3.select("#plot").selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("id", function(d, i) { return d.name; })
        .attr("cx", function(d, i) { return d.x; })
        .attr("cy", function(d, i) { return d.y; })
        .attr("r",  function(d, i) { return radius; })
        .style("fill",   function(d, i) { return color(d.group); })
        .on("mouseover", function(d, i) { addTooltip(d3.select(this));MouseOver(d); })
        .on("mouseout",  function(d, i) { d3.select("#tooltip").remove();MouseOut(d); });
}

// Draws nice arcs for each link on plot
function drawLinks(links) {
    // scale to generate radians (just for lower-half of circle)
    var radians = d3.scale.linear()
        .range([Math.PI / 2, 3 * Math.PI / 2]);

    // path generator for arcs (uses polar coordinates)
    var arc = d3.svg.line.radial()
        .interpolate("basis")
        .tension(0)
        .angle(function(d) { return radians(d); });

    //console.log(links);

    // add links
    d3.select("#plot").selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("transform", function(d, i) {

            //console.log(d);
            var xshift = d.source.x + (d.target.x - d.source.x) / 2;
            var yshift = yfixed;    
            return "translate(" + xshift + ", " + yshift + ")";
        })
        .attr("d", function(d, i) {
            // get x distance between source and target
            var xdist = Math.abs(d.source.x - d.target.x);

            // set arc radius based on x distance
            arc.radius(xdist / 2);

            // want to generate 1/3 as many points per pixel in x direction
            var points = d3.range(0, Math.ceil(xdist / 3));

            // set radian scale domain
            radians.domain([0, points.length - 1]);

            // return path for arc
            return arc(points);
        })
        .on("mouseover", MouseOverArc)
        .on("mouseout", MouseOut );
}

function MouseOver(d){
    var list = new Object();
        list[d.name] = new Object();

        d3.selectAll("svg#arc").selectAll("path.link")
            .style("stroke-opacity" , function(l) {  
                if (l.source.name==d.name){
                    if (!list[l.target.name]){
                        list[l.target.name] = new Object();
                        list[l.target.name].count=1; 
                        list[l.target.name].year=l.m;  
                        list[l.target.name].linkcount=l.count;    
                    }    
                      
                    return 1;
                }  
                else if (l.target.name==d.name){
                    if (!list[l.source.name]){
                        list[l.source.name] = new Object();
                        list[l.source.name].count=1; 
                        list[l.source.name].year=l.m;  
                        list[l.source.name].linkcount=l.count;  
                    }    
                    
                    return 1;
                }    
                else
                  return 0.01;  
        });
    /*    nodes.style("fill-opacity" , function(n) {  
            if (list[n.name])
                return 1;
            else
              return 0.1;  
            }); */
}
function MouseOut(d){
    d3.selectAll("svg#arc").selectAll("path.link")
            .style("stroke-opacity",1);
}

function MouseOverArc(d){
    var source=d.source.name;
    var target=d.target.name;
    d3.selectAll("svg#arc").selectAll("path.link")
            .style("stroke-opacity" , function(l) {  
                if (l.source.name==source&&l.target.name==target)
                    return 1;
                else
                    return 0;
            });
}
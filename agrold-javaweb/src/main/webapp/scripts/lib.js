/* 
 * General definitions for the advanced search
 */
var url = AGROLDAPIJSONURL;
var maxAuthorsLength = 100;
var DEFAULT_PAGE_SIZE = 30; // limit number of results per page
var sparqlEndpoint = SPARQLENDPOINTURL;
var holdMessage = '<center id="holdMessage"><img src="images/wait_animated.gif" alt="Please Wait!"/></center>';

function viewAsGraph(entityUri, divId) {
    // visualize the description as a graph 
    $("#" + divId).html("Explore AgroLD From here!");
    KNETMAPS_ADAPTATOR = new KnetmapsAdaptator();
    KNETMAPS_ADAPTATOR.fetchConceptDescription(entityUri).done(function () {
       KNETMAPS_ADAPTATOR.updateNetwork("#" + divId);
    });
}

// Returns if a value is a string
function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

function isValidURI(uriStr) {
    return isString(uriStr) && (uriStr !== "") && (uriStr.includes("/"));
}

function getPrefixedFormOfURI(uriStr) {
    var prefixedUri = uriStr;
    // if not uri, return the argument
    if (isValidURI(uriStr)) {
        // else
        var registeredPrefixes = {
            "http://www.w3.org/1999/02/22-rdf-syntax-ns": "rdf",
            "http://www.w3.org/2000/01/rdf-schema": "rdfs",
            "http://www.w3.org/2002/07/owl": "owl",
            "http://www.southgreen.fr/agrold": "agrold",
            // "http://www.southgreen.fr/agrold/vocabulary": "agrold_vocabulary",
            // "http://www.southgreen.fr/agrold/resource": "agrold_resource",
            "http://purl.org/dc/terms": "dc",
            "http://purl.obolibrary.org/obo": "obo",
            "http://purl.uniprot.org/uniprot": "uniprot",
            "http://identifiers.org/ensembl.plant": "ensembl.plant"

        };
        //console.log("getPrefixedFormOfURI uri: " + uriStr);
        var uri = new URI(uriStr);
        var dirUriStr = "";
        var localname = "";
        if (uriStr.includes("#")) { // fragment
            localname = uri.fragment().toString();
            dirUriStr = uri.fragment("").toString();
        } else { // filename
            localname = uri.filename().toString();
            dirUriStr = uri.filename("").toString();
            dirUriStr = dirUriStr.slice(0, -1);
        }
        //console.log("getPrefixedFormOfURI dirUri: " + dirUriStr);
        //console.log("getPrefixedFormOfURI localname: " + localname);
        var prefix = "";
        if (dirUriStr.includes("agrold") && !dirUriStr.endsWith("agrold")) {
            var dirUri = new URI(dirUriStr);
            prefix = "agrold:" + dirUri.filename().toString() + "/";
        } else {
            prefix = registeredPrefixes[dirUriStr];
            if (prefix !== undefined) {
                prefix += ":";
            }
        }
        prefixedUri = (prefix !== undefined ? prefix + localname : uriStr);
        //console.log("getPrefixedFormOfURI prefixedUri: " + prefixedUri);        
    }
    return String(prefixedUri);
}

function getIRILocalname(iriAsString) {
    if(iriAsString === undefined){
        return iriAsString;
    }
    var uri = new URI(iriAsString);
    if (iriAsString.includes("#")) { // fragment
        localname = uri.fragment().toString();
    } else { // filename
        localname = uri.filename().toString();
    }
    return localname;
}

function descriptionAsGraph(entityIRI, data, divId) {
    // each line give the value (hasValue, or isValueOf) of a relation (property) involving the entityIRI
    // Here we use Cytoscape.js to display relations in data with the entityIRI

    //document.addEventListener("DOMContentLoaded", function() {
    entityIRI = getPrefixedFormOfURI(entityIRI);
    //console.log("descriptionAsGraph entityIRI: " + entityIRI);
    // 1. build the JSON of the elements of the graph (nodes and edges)
    // color to use:    
    var centerNodeColor = 'blue'; // entityIRI node (center of the graph)
    var otherNodesColor = '#ddd'; // other nodes
    var ingoingEdgesColor = '#61bffc'; // ingoing edges
    var outgoingEdgesColor = '#ddd'; // outgoing edges
    var graphElements = {nodes: [{data: {id: entityIRI, color: centerNodeColor}}], edges: []};
    var property = "";
    var hasValue = "";
    var isValueOf = "";
    var addedNodes = [];
    var idBase = "!$#e"; // idBase to avoid confusion with some ids of nodes that has integer values
    for (i = 0; i < data.length; i++) {
        property = getPrefixedFormOfURI(data[i]["property"]);
        hasValue = getPrefixedFormOfURI(data[i]["hasValue"]);
        isValueOf = getPrefixedFormOfURI(data[i]["isValueOf"]);
        var newNodeLabel;
        var edgeSource;
        var edgeTarget;
        var edgeColor;

        if (hasValue !== "") {
            newNodeLabel = hasValue;
            edgeSource = entityIRI;
            edgeTarget = hasValue;
            edgeColor = outgoingEdgesColor;
        } else { // if (isValueOf !== "")
            newNodeLabel = isValueOf;
            edgeSource = isValueOf;
            edgeTarget = entityIRI;
            edgeColor = ingoingEdgesColor;
        }
        if (!(addedNodes.filter(value => value === newNodeLabel).length > 0)) {
            graphElements["nodes"].push({data: {id: newNodeLabel, color: otherNodesColor}});
            addedNodes.push(newNodeLabel);
        }
        graphElements["edges"].push({data: {id: idBase + i, relation: property, source: edgeSource, target: edgeTarget, color: edgeColor}});
    }
    //console.log("descriptionAsGraph: " + JSON.stringify(graphElements));
    var cy = cytoscape({
        container: document.getElementById(divId),
        elements: graphElements,
        style: [
            {
                selector: 'node',
                style: {
                    'label': 'data(id)',
                    'color': 'blue',
                    'background-color': 'data(color)',
                    'font-size': '16px',
                    'text-halign': 'center',
                    'text-valign': 'bottom',
                    'text-background-color': 'white'
                }
            }, {
                selector: 'edge',
                style: {
                    'curve-style': 'bezier',
                    'label': 'data(relation)',
                    'line-color': 'data(color)',
                    'target-arrow-color': 'data(color)',
                    'text-background-color': 'yellow',
                    'text-background-opacity': 0.4,
                    'width': '5px',
                    'target-arrow-shape': 'triangle',
                    'control-point-step-size': '140px'
                }
            },
            {
                selector: ':selected',
                style: {
                    'line-color': 'blue',
                    'target-arrow-color': 'blue',
                    'border-width': 5,
                    'border-style': 'solid',
                    'border-color': 'black'
                }
            }
        ],
        layout: {
            name: 'random',
            fit: true,
            avoidOverlap: true,
            avoidOverlapPadding: 80,
            /*position: function(ele) {
             if (ele.data('molecule') === 'DHAP') {
             return { row: ele.id() - 1, col: 1 };
             }
             return { row: ele.id(), col: 0 };
             }*/
        }
    });
}

function displayHoldMessage(target) {
    $(target).html(holdMessage);
}
function removeHoldMessage(targetId) {
    $("#" + targetId).html("");
}
function displayResult(targetId, sparqljsonResult) {
    removeHoldMessage(targetId);
    yasr = YASR(document.getElementById(targetId), {
        //this way, the URLs in the results are prettified using the defined prefixes in the query
        //getUsedPrefixes: yasqe.getPrefixesFromQuery,
        useGoogleCharts: false,
        drawOutputSelector: false,
        //drawDownloadIcon: false,
        persistency: {
            prefix: false
        }
    });

    yasr.setResponse(sparqljsonResult);
}

function displayPublications(json, targetId) {
    removeHoldMessage("publicationResult");
    if (json.length > 0) {
        $("#" + targetId).html("<ol></ol>");
        for (var i = 0; i < json.length; i++) {
            var urlv = "http://doi.org/" + json[i]["doi"];
            var authors = json[i]["authorString"];
            if (authors.length > maxAuthorsLength) {
                authors = authors.substring(1, maxAuthorsLength) + ' ...';
            }
            $("#" + targetId + " ol").append('<li id="paper' + i + '"><span>' + authors + ', " <b>' + json[i]["title"] + '</b> ", <i>' + json[i]["journalTitle"] + '</i>, ' + json[i]["pubYear"] + '</span></li>');
            $("#" + targetId + " ol li#paper" + i).append('<br><span>Available at: <a href="' + urlv + '" target="_blank">' + urlv + '</a></span>');
        }
    } else {
        $("#" + targetId).html("No publication found.");
    }
}

function dispalyHeader(eltType, json) {
    elt = typeof json["results"]["bindings"][0] !== 'undefined' ? json["results"]["bindings"][0] : "";
    if (elt === "") {
        return false;
    }
    var htmlTitle = $('.modal-title');
    var htmlSubTitle = $('.subtitle');
    var htmlDescription = $('.desc');
    var htmlUri = $('.uri-md');

    var name = typeof elt["Name"] !== 'undefined' ? elt["Name"]["value"] : "";
    var description = typeof elt["Description"] !== 'undefined' ? elt["Description"]["value"] : "";
    //////////////////////////////////
    htmlTitle.html('<b style="text-transform: uppercase" id="id">' + eltType + ' > ' + elt["Id"]["value"] + '</b>');
    htmlSubTitle.html('<b> ' + (name !== null ? name.charAt(0).toUpperCase() + name.slice(1) : '') + '</b>');
    if (description !== "") {
        htmlDescription.html('<br><big>' + description + '</big>');
    }
    graphicalInitialisation();
    htmlUri.html('<a href="' + elt["Uri"]["value"] + '"');
    return true;
}
/**
 * 
 * @param {type} data: JSON Array
 * @param {type} tableId: existing and empty table
 * @returns {undefined}
 */
function simpleDataDisplay(data, tableId) {
    //console.log("simpleDataDisplay:" + JSON.stringify(data));
    var keys = Object.keys(data[0]);
    var table = $('#' + tableId);
    $(table).append("<thead></thead>");//<></>
    var thead = $(table).children("thead").last();
    $(thead).append("<tr></tr>");
    var row = $(thead).children("tr").last();
    for (i = 0; i < keys.length; i++) {
        $(row).append("<th>" + keys[i] + "</th>");
    }
    $(table).append("<tbody></tbody>");
    var tbody = $(table).children("tbody").last();
    for (i = 0; i < data.length; i++) {
        $(tbody).append("<tr></tr>");
        var row = $(tbody).children().last();
        var elt = data[i];
        for (j = 0; j < keys.length; j++) {
            $(row).append('<td style="word-wrap:break-word;">' + JSON.stringify(elt[keys[j]]).replace(/,/gi, " , ") + "</td>");
        }
    }
    $(table).DataTable();
}

function processHtmlResult(entitiesType) {
    var tables = $("table.resultsTable");
    var table = "";
    var currentTable = "";
    for (i = 0; i < tables.length; i++) {
        if (!$(tables[i]).hasClass("complete"))
            currentTable = $(tables[i]);
    }
    if (entitiesType !== "") {
        var ths = $(currentTable).find("th");
        var uriIdx = 0;
        for (i = 0; i < ths.length; i++) {
            if ($(ths[i]).text() === "URI") {
                uriIdx = i;
                break;
            }
        }
        table = $(currentTable).children("tbody")[0];
        var trs = $(table).children("tr");
        for (i = 0; i < trs.length; i++) {
            var tds = $(trs[i]).children("td");
            var a = $(tds[uriIdx]).find("a.uri");
            sparqlLink = 'sparqleditor.jsp?query=PREFIX uri:<' + $(a).text() + '>\nSELECT ?property ?hasValue ?isValueOf\nWHERE {\n  { uri: ?property ?hasValue }\n  UNION\n  { ?isValueOf ?property uri:}\n}';
            $(a).after('<a href="' + encodeURI(sparqlLink) + '" target="_blank" style="text-decoration: none; color:#00B5AD; font-weight:bold"> (in Sparql) </a>');
            visualExplorerLink = 'agrold_explorer.jsp?iri=' + $(a).text();
            $(a).after('<a href="' + encodeURI(visualExplorerLink) + '" target="_blank" style="text-decoration: none; color:#00B5AD; font-weight:bold"> (Visualize) </a>');
            $(a).attr("target", "_blank");
            $(tds[1]).append('<a id="' + encodeURIComponent($(a).text()) + '" name="' + entitiesType + '" class="mdpre" href="#advancedSearch.jsp?type=' + entitiesType + '&uri=' + encodeURIComponent($(a).text()) + '" style="text-decoration: none; color:#00B5AD; font-weight:bold"> (display) </a>');
            for (j = 0; j < trs.length; j++) {
                if ($(tds[j]).text().includes("<b>")) {
                    $(tds[j]).html($(tds[j]).text());
                }
            }
        }
    }
    $(currentTable).addClass("complete");
}
//'PREFIX uri:<' + $(a).text() + '>\nSELECT ?property ?hasValue ?isValueOf\nWHERE {\n  { uri: ?property ?hasValue }\n  UNION\n  { ?isValueOf ?property uri:}\n}'
/**
 * Gestion de la pagination au niveau de l'outil de recherche.
 * @param {type} nbResults
 * @param {type} currentPageo
 * @param {type} previousBtnId
 * @param {type} nextBtnId
 * @returns {undefined}
 */
function addNavButtonsADVS(nbResults, currentPageo, previousBtnId, nextBtnId) {
    var nav = "";
    if (currentPageo > 0) {
        nav = '<button class="btn btn-secondary o-secondary" id="' + previousBtnId + '"><i class="fa fa-angle-left"></i>&nbsp;&nbsp; Previous page</button>';
    }
    if (DEFAULT_PAGE_SIZE === nbResults) {
        nav += ('<button class="btn btn-secondary o-secondary" id="' + nextBtnId + '" style="position: relative;right: 0px;">Next page &nbsp;&nbsp;<i class="fa fa-angle-right"></i></button>');
    }
    $("body" + " .yasr_header").prepend(nav);
}
/**
 * Gestion de la génération des boutons de pagination à l'intérieur du modal.
 * @param {type} nbResults
 * @param {type} currentPageo
 * @param {type} divIdo
 * @param {type} previousBtnId
 * @param {type} nextBtnId
 * @param {type} functionName
 * @returns {undefined}
 */
function addNavButtons(nbResults, currentPageo, divIdo, previousBtnId, nextBtnId, functionName) {
    var pager = $("#result-modal #" + divIdo);
    if (currentPageo > 0) {
        pager.prepend('<button class="btn btn-secondary o-secondary" onclick="invoke(\'' + functionName + '\',' + (currentPageo - 1) + ')" id="' + previousBtnId + '-top"><i class="fa fa-angle-left"></i>&nbsp;&nbsp; Previous page</button>');
        pager.append('<button class="btn btn-secondary o-secondary" onclick="invoke(\'' + functionName + '\',' + (currentPageo - 1) + ')" id="' + previousBtnId + '-top' + '"><i class="fa fa-angle-left"></i>&nbsp;&nbsp; Previous page</button>');
    }
    if (DEFAULT_PAGE_SIZE === nbResults) {
        pager.prepend('<button class="btn btn-secondary o-secondary" onclick="invoke(\'' + functionName + '\',' + (currentPageo + 1) + ')" id="' + nextBtnId + '-bottom' + '" style="position: relative;right: 0px;">Next page &nbsp;&nbsp;<i class="fa fa-angle-right"></i></button>');
        pager.append('<button class="btn btn-secondary o-secondary" onclick="invoke(\'' + functionName + '\',' + (currentPageo + 1) + ')" id="' + nextBtnId + '-bottom' + '" style="position: relative;right: 0px;">Next page &nbsp;&nbsp;<i class="fa fa-angle-right"></i></button>');
    }
}
var KNETMAPS = KNETMAPS || {};

KNETMAPS.ConceptsLegend = function () {

    var stats = KNETMAPS.Stats();

    var my = function () {};

    // Dynamically populate interactive concept legend.
    my.populateConceptLegend = function () {
        var cy = $('#cy').cytoscape('get');
        var conNodes = cy.nodes();
        var conceptTypes = []; // get a unique Array with all concept Types in current network.
        conNodes.forEach(function (ele) {
            if (conceptTypes.indexOf(ele.data('conceptType')) === -1) {
                conceptTypes.push(ele.data('conceptType'));
            }
        });
//      conceptTypes.sort(); // sort alpabetically, fails as "Trait" is displayed as "GWAS"

        var conceptsHashmap = {};
        conceptTypes.forEach(function (conType, index) {
            var conCount = conNodes.filterFn(function (ele) {
                return ele.data('conceptType') === conType;
            }).size();
            // Push count of concepts of this Type to concepts hashmap
            conceptsHashmap[conType] = conCount;
        });

        // update knetLegend.
        var knetLegend = '<div class="knetInteractiveLegend"><div class="knetLegend_row">' + '<div class="knetLegend_cell"><b>Interactive Legend:</b></div>';
        // Show concept Type icons (with total count displayed alongside).
        for (var con in conceptsHashmap) {
            var conText = con;
            if (conText === "Biological_Process") {
                conText = "BioProc";
            } else if (conText === "Molecular_Function") {
                conText = "MolFunc";
            } else if (conText === "Cellular_Component") {
                conText = "CellComp";
            } else if (conText === "Trait Ontology") {
                conText = "TO";
            } else if (conText === "PlantOntologyTerm") {
                conText = "PO";
            }
            /*else if(conText === "Trait") {
             conText= "GWAS";
             }*/
            else if (conText === "Enzyme Classification") {
                conText = "EC";
            } else if (conText === "Quantitative Trait Locus") {
                conText = "QTL";
            } else if (conText === "Protein Domain") {
                conText = "Domain";
            }
            knetLegend = knetLegend + '<div class="knetLegend_cell"><input type="submit" value="" id="' + con + '" title="Show All ' + con + '(s)" class="knetCon_' + con.replace(/ /g, '_') + '" style="vertical-align:middle" onclick="KNETMAPS.ConceptsLegend().showConnectedByType(this.id);">' +
                    conceptsHashmap[con] + '<span class="icon_caption">' + conText + '</span></div>';
        }
        knetLegend = knetLegend + '</div></div>';
        $('#knetLegend').html(knetLegend); // update knetLegend
    }

    my.showConnectedByType = function (conType) {
        var cy = $('#cy').cytoscape('get');

        var hiddenNodes_ofSameType = cy.collection();
        cy.nodes().filter('node[conceptType="' + conType + '"]').forEach(function (conc) {
            if (conc.hasClass('HideEle')) {
                hiddenNodes_ofSameType = hiddenNodes_ofSameType.add(conc);
            }
        });

        var currently_visibleNodes = cy.collection();
        cy.nodes().forEach(function (conc) {
            if (conc.hasClass('ShowEle')) {
                currently_visibleNodes = currently_visibleNodes.add(conc);
            }
        });

        // Display hidden nodes of same Type which are connected to currently visible Nodes.
        hiddenNodes_ofSameType.edgesWith(currently_visibleNodes).connectedNodes().addClass('ShowEle').removeClass('HideEle');
        // Display edges between such connected Nodes too.
        hiddenNodes_ofSameType.edgesWith(currently_visibleNodes).addClass('ShowEle').removeClass('HideEle');

        stats.updateKnetStats(); // Refresh network Stats.
    }

    return my;
};

var KNETMAPS = KNETMAPS || {};

KNETMAPS.Container = function () {


    var stats = KNETMAPS.Stats();
    var iteminfo = KNETMAPS.ItemInfo();


    var my = function () {};

// tagny method
    my.fetchNewDataFromRemote = function (conceptURI) {
        console.log("my.fetchNewDataFromRemote: " + conceptURI);
        KNETMAPS_ADAPTATOR.fetchConceptDescription(conceptURI).done(function () {
        KNETMAPS_ADAPTATOR.updateNetwork("#knet-maps");
    });
    };

    my.load_reload_Network = function (network_json, network_style) {

// Initialise a cytoscape container instance on the HTML DOM using JQuery.
        var cy = cytoscape({
            container: document.getElementById('cy')/*$('#cy')*/,
            style: network_style,
            // Using the JSON data to create the nodes.
            elements: network_json,
//  layout: /*defaultNetworkLayout*/ coseNetworkLayout, // layout of the Network

            // these options hide parts of the graph during interaction such as panning, dragging, etc. to enable faster rendering for larger graphs.
//  hideLabelsOnViewport: true,
//  hideEdgesOnViewport: true,

            // this is an alternative that uses a bitmap during interaction.
            textureOnViewport: false, // true,
            /* the colour of the area outside the viewport texture when initOptions.textureOnViewport === true can
             * be set by: e.g., outside-texture-bg-color: white, */

            // interpolate on high density displays instead of increasing resolution.
            pixelRatio: 1,

            // Zoom settings
            zoomingEnabled: true, // zooming: both by user and programmatically.
//  userZoomingEnabled: true, // user-enabled zooming.
            zoom: 1, // the initial zoom level of the graph before the layout is set.
//  minZoom: 1e-50, maxZoom: 1e50,
            /* mouse wheel sensitivity settings to enable a more gradual Zooming process. A value between 0 and 1 
             * reduces the sensitivity (zooms slower) & a value greater than 1 increases the sensitivity. */
            wheelSensitivity: 0.05,

            panningEnabled: true, // panning: both by user and programmatically.
//  userPanningEnabled: true, // user-enabled panning.

            // for Touch-based gestures.
//  selectionType: (isTouchDevice ? 'additive' : 'single'),
            touchTapThreshold: 8,
            desktopTapThreshold: 4,
            autolock: false,
            autoungrabify: false,
            autounselectify: false,

            // a "motion blur" effect that increases perceived performance for little or no cost.
            motionBlur: true,

            ready: function () {
                KNETMAPS.Menu().rerunLayout(); // reset current layout.
                window.cy = this;
            }
        });

// Get the cytoscape instance as a Javascript object from JQuery.
//var cy= $('#cy').cytoscape('get'); // now we have a global reference to `cy`

// cy.boxSelectionEnabled(true); // enable box selection (highlight & select multiple elements for moving via mouse click and drag).
        cy.boxSelectionEnabled(false); // to disable box selection & hence allow Panning, i.e., dragging the entire graph.

        /** Add a Qtip message to all the nodes & edges using QTip displaying their Concept Type & value when a 
         * node/ edge is clicked.
         * Note: Specify 'node' or 'edge' to bind an event to a specific type of element.
         * e.g, cy.elements('node').qtip({ }); or cy.elements('edge').qtip({ }); */
        cy.elements().qtip({
            content: function () {
                var qtipMsg = "";
                try {
                    if (this.isNode()) {
                        qtipMsg = "<b>Concept:</b> " + this.data('value') + "<br/><b>Type:</b> " + this.data('conceptType');
                    } else if (this.isEdge()) {
                        qtipMsg = "<b>Relation:</b> " + this.data('label');
                        var fromID = this.data('source'); // relation source ('fromConcept')
                        qtipMsg = qtipMsg + "<br/><b>From:</b> " + cy.$('#' + fromID).data('value') + " (" + cy.$('#' + fromID).data('conceptType').toLowerCase() + ")";
                        var toID = this.data('target'); // relation source ('toConcept')
                        qtipMsg = qtipMsg + "<br/><b>To:</b> " + cy.$('#' + toID).data('value') + " (" + cy.$('#' + toID).data('conceptType').toLowerCase() + ")";
                    }
                } catch (err) {
                    qtipMsg = "Selected element is neither a Concept nor a Relation";
                }
                return qtipMsg;
            },
            style: {
                classes: 'qtip-bootstrap',
                tip: {
                    width: 12,
                    height: 6
                }
            }
        });

        /** Event handling: mouse 'tap' event on all the elements of the core (i.e., the cytoscape container).
         * Note: Specify 'node' or 'edge' to bind an event to a specific type of element.
         * e.g, cy.on('tap', 'node', function(e){ }); or cy.on('tap', 'edge', function(e){ }); */
        cy.on('tap', function (e) {
            var thisElement = e.cyTarget;
            var info = "";
            try {
                if (thisElement.isNode()) {
                    info = "<b>Concept:</b> " + thisElement.data('value') + "<br/><b>Type:</b> " + thisElement.data('conceptType');
                } else if (thisElement.isEdge()) {
                    info = "<b>Relation:</b> " + this.data('label');
                    var fromID = this.data('source'); // relation source ('fromConcept')
                    info = info + "<br/><b>From:</b> " + cy.$('#' + fromID).data('value') + " (" + cy.$('#' + fromID).data('conceptType').toLowerCase();
                    var toID = this.data('target'); // relation source ('toConcept')
                    info = info + "<br/><b>To:</b> " + cy.$('#' + toID).data('value') + " (" + cy.$('#' + toID).data('conceptType').toLowerCase() + ")";
                }
            } catch (err) {
                info = "Selected element is neither a Concept nor a Relation";
            }
            console.log(info);
            iteminfo.showItemInfo(thisElement);
        });
// cxttap - normalised right click or 2-finger tap event.

        /** Popup (context) menu: a circular Context Menu for each Node (concept) & Edge (relation) using the 'cxtmenu' jQuery plugin. */
        var contextMenu = {
            menuRadius: 75, // the radius of the circular menu in pixels

            // Use selector: '*' to set this circular Context Menu on all the elements of the core.
            /** Note: Specify selector: 'node' or 'edge' to restrict the context menu to a specific type of element. e.g, 
             * selector: 'node', // to have context menu only for nodes.
             * selector: 'edge', // to have context menu only for edges. */
            selector: '*',
            commands: [// an array of commands to list in the menu
                {
                    content: 'Show Info',
                    select: function () {
                        // Show Item Info Pane.
                        iteminfo.openItemInfoPane();

                        // Display Item Info.
                        iteminfo.showItemInfo(this);
                    }
                },

                {
                    content: 'Show Links',
                    select: function () {
                        if (this.isNode()) {
                            // fetch the description of the node from AgroLD
                            console.log("my.showLinks.selectedNode: " + this.data("iri"));
                            my.fetchNewDataFromRemote(this.data("iri"));

                            // show info
                            iteminfo.showLinks(this);
                            // Refresh network legend.
                            stats.updateKnetStats();
                        }
                    }
                },

                {
                    content: 'Hide',
                    select: function () {
                        //this.hide(); // hide the selected 'node' or 'edge' element.
                        this.removeClass('ShowEle');
                        this.addClass('HideEle');
                        // Refresh network legend.
                        stats.updateKnetStats();
                    }
                },

                {
                    content: 'Hide by Type',
                    select: function () { // Hide all concepts (nodes) of the same type.
                        if (this.isNode()) {
                            var thisConceptType = this.data('conceptType');
                            //        console.log("Hide Concept by Type: "+ thisConceptType);
                            cy.nodes().forEach(function (ele) {
                                if (ele.data('conceptType') === thisConceptType) {
                                    //ele.hide();
                                    ele.removeClass('ShowEle');
                                    ele.addClass('HideEle');
                                }
                            });
                            // Relayout the graph.
                            //rerunLayout();
                        } else if (this.isEdge()) { // Hide all relations (edges) of the same type.
                            var thisRelationType = this.data('label');
                            //        console.log("Hide Relation (by Label type): "+ thisRelationType);
                            cy.edges().forEach(function (ele) {
                                if (ele.data('label') === thisRelationType) {
                                    //ele.hide();
                                    ele.removeClass('ShowEle');
                                    ele.addClass('HideEle');
                                }
                            });
                            // Relayout the graph.
                            // rerunLayout();
                        }
                        // Refresh network Stats.
                        stats.updateKnetStats();
                    }
                },

                {
                    content: 'Label on/ off by Type',
                    select: function () {
                        var thisElementType, eleType, elements;
                        if (this.isNode()) {
                            thisElementType = this.data('conceptType'); // get all concept Types.
                            eleType = 'conceptType';
                            elements = cy.nodes(); // fetch all the nodes.
                        } else if (this.isEdge()) {
                            thisElementType = this.data('label'); // get all relation Labels.
                            eleType = 'label';
                            elements = cy.edges(); // fetch all the edges.
                        }

                        if (this.hasClass("LabelOff")) {  // show the concept/ relation Label.
                            elements.forEach(function (ele) {
                                if (ele.data(eleType) === thisElementType) { // for same concept or relation types
                                    if (ele.hasClass("LabelOff")) {
                                        ele.removeClass("LabelOff");
                                        ele.addClass("LabelOn");
                                    }
                                }
                            });
                        } else if (this.hasClass("LabelOn")) { // hide the concept/ relation Label.
                            elements.forEach(function (ele) {
                                if (ele.data(eleType) === thisElementType) { // for same concept or relation types
                                    if (ele.hasClass("LabelOn")) {
                                        ele.removeClass("LabelOn");
                                        ele.addClass("LabelOff");
                                    }
                                }
                            });
                        }
                    }
                },

                {
                    content: 'Label on/ off',
                    select: function () {
                        if (this.hasClass("LabelOff")) {  // show the concept/ relation Label.
                            this.removeClass("LabelOff");
                            this.addClass("LabelOn");
                        } else if (this.hasClass("LabelOn")) {  // hide the concept/ relation Label.
                            this.removeClass("LabelOn");
                            this.addClass("LabelOff");
                        }
                    }
                }
            ],
            fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
            activeFillColor: 'rgba(92, 194, 237, 0.75)', // the colour used to indicate the selected command
            activePadding: 2, // 20, // additional size in pixels for the active command
            indicatorSize: 15, // 24, // the size in pixels of the pointer to the active command
            separatorWidth: 3, // the empty spacing in pixels between successive commands
            spotlightPadding: 3, // extra spacing in pixels between the element and the spotlight
            minSpotlightRadius: 5, // 24, // the minimum radius in pixels of the spotlight
            maxSpotlightRadius: 10, // 38, // the maximum radius in pixels of the spotlight
            itemColor: 'white', // the colour of text in the command's content
            itemTextShadowColor: 'black', // the text shadow colour of the command's content
            zIndex: 9999 // the z-index of the ui div
        };

        cy.cxtmenu(contextMenu); // set Context Menu for all the core elements.

        // Show the popup Info. dialog box.
        $('#infoDialog').click(function () {
            $('#infoDialog').slideToggle(300);
        });

    }

    return my;
};

var KNETMAPS = KNETMAPS || {};
var graphJSON = graphJSON || '';
var allGraphData = allGraphData || '';

KNETMAPS.Generator = function () {

    var stats = KNETMAPS.Stats();
    var iteminfo = KNETMAPS.ItemInfo();
    var container = KNETMAPS.Container();
    var legend = KNETMAPS.ConceptsLegend();

    var my = function () {};

    // initialize and generate the network from default global vars
    my.generateNetworkGraph = function () {
        //console.log("Dataset file path: "+ json_File);
        // Initialize the cytoscapeJS container for Network View.
        // NB graphJSON and allGraphData should be declared outside this script
        my.initializeNetworkView(graphJSON, allGraphData);

        // Highlight nodes with hidden, connected nodes using Shadowing.
        my.blurNodesWithHiddenNeighborhood();

        // Set the default layout.
//     setDefaultLayout();
        // update network stats <div>.
        stats.updateKnetStats();

        // dynamically populate interactive concept legend.
        legend.populateConceptLegend();
    }

//initialize and generate the network from provided JSON blob
    my.generateNetworkGraphRaw = function (json_blob) {
        //console.log("Dataset file path: "+ json_File);
        eval(json_blob + '; my.initializeNetworkView(graphJSON, allGraphData); my.blurNodesWithHiddenNeighborhood(); stats.updateKnetStats(); legend.populateConceptLegend();');
    }

// initialize the network
    my.initializeNetworkView = function (networkJSON, metadataJSON) {
        ;
        graphJSON = networkJSON;
        allGraphData = metadataJSON;
        // modify for networkJSON to read JSON object from file and retain contents from "elements" section for nodes and edges info.
//   var metadataJSON= allGraphData; // using the dynamically included metadata JSON object directly.

        // Define the stylesheet to be used for nodes & edges in the cytoscape.js container.
        var networkStylesheet = cytoscape.stylesheet().selector('node').css({
            'content': 'data(displayValue)',
            /*function(ele) {
             var label= '';
             if(ele.data('value').indexOf('<span') > -1) { // For html content from text, use html tags.
             var txtLabel= '<html>'+ ele.data('value') +'</html>';
             label= jQuery(txtLabel).text();
             }
             else { label= ele.data('value'); }
             // Trim the label's length.
             if(label.length> 30) { label= label.substr(0,29)+'...'; }
             return label;
             },*/
            //     'text-valign': 'center', // to have 'content' displayed in the middle of the node.
            'text-background-color': 'data(conceptTextBGcolor)', //'black',
            /*function(ele) { // text background color
             var labelColor= '';
             if(ele.data('value').indexOf('<span') > -1) { labelColor= 'gold'; }
             else { labelColor= 'black'; }
             return labelColor;
             },*/
            'text-background-opacity': 'data(conceptTextBGopacity)', //'0', // default: '0' (disabled).
            /*function(ele) { // text background opacity
             var textBackgroundOpacity= '0';
             if(ele.data('value').indexOf('<span') > -1) { textBackgroundOpacity= '1'; }
             return textBackgroundOpacity;
             },*/
            'text-wrap': 'wrap', // for manual and/or autowrapping the label text.
//          'edge-text-rotation' : 'autorotate', // rotate edge labels as the angle of an edge changes: can be 'none' or 'autorotate'.
            'border-style': 'data(conceptBorderStyle)', //'solid', // node border, can be 'solid', 'dotted', 'dashed' or 'double'.
            /*function(ele) {
             var node_borderStyle= 'solid';
             try { // Check if the node was flagged or not
             if(ele.data('flagged') === "true") {
             node_borderStyle= 'double'; // can be 'solid', 'dotted', 'dashed' or 'double'.
             //                                 console.log("node Flagged= "+ ele.data('flagged') +" , node_borderStyle: "+ node_borderStyle);
             }
             }
             catch(err) { console.log(err.stack); }
             return node_borderStyle;
             },*/
            'border-width': 'data(conceptBorderWidth)', //'1px',
            /*function(ele) {
             var node_borderWidth= '1px';
             try { // Check if the node was flagged or not
             if(ele.data('flagged') === "true") {
             node_borderWidth= '3px';
             //                                 console.log("node Flagged= "+ ele.data('flagged') +" , node_borderWidth: "+ node_borderWidth);
             }
             }
             catch(err) { console.log(err.stack); }
             return node_borderWidth;
             },*/
            'border-color': 'data(conceptBorderColor)', //'black',
            /*function(ele) {
             var node_borderColor= 'black';
             try { // Check if the node was flagged or not
             if(ele.data('flagged') === "true") {
             node_borderColor= 'navy';
             //                                 console.log("node Flagged= "+ ele.data('flagged') +" , node_borderColor: "+ node_borderColor);
             }
             }
             catch(err) { console.log(err.stack); }
             return node_borderColor;
             },*/
            'font-size': '16px', // '8px',
//          'min-zoomed-font-size': '8px',
            // Set node shape, color & display (visibility) depending on settings in the JSON var.
            'shape': 'data(conceptShape)', // 'triangle'
            'width': 'data(conceptSize)', // '18px',
            'height': 'data(conceptSize)', // '18px',
            'background-color': 'data(conceptColor)', // 'gray'
            /** Using 'data(conceptColor)' leads to a "null" mapping error if that attribute is not defined 
             * in cytoscapeJS. Using 'data[conceptColor]' is hence preferred as it limits the scope of 
             * assigning a property value only if it is defined in cytoscapeJS as well. */
            'display': 'data(conceptDisplay)', // display: 'element' (show) or 'none' (hide).
            'text-opacity': '0' // to make the label invisible by default.
        })
                .selector('edge').css({
            'content': 'data(label)', // label for edges (arrows).
            'font-size': '16px',
//          'min-zoomed-font-size': '8px',
            'curve-style': 'unbundled-bezier', /* options: bezier (curved) (default), unbundled-bezier (curved with manual control points), haystack (straight edges) */
            'control-point-step-size': '10px', //'1px' // specifies the distance between successive bezier edges.
            'control-point-distance': '20px', /* overrides control-point-step-size to curves single edges as well, in addition to parallele edges */
            'control-point-weight': '50'/*'0.7'*/, // '0': curve towards source node, '1': curve towards target node.
            'width': 'data(relationSize)', // 'mapData(relationSize, 70, 100, 2, 6)', // '3px',
            'line-color': 'data(relationColor)', // 'gray',
            'line-style': 'solid', // 'solid' or 'dotted' or 'dashed'
            'target-arrow-shape': 'triangle',
            'target-arrow-color': 'gray',
            'display': 'data(relationDisplay)', // display: 'element' (show) or 'none' (hide).
            'text-opacity': '0' // to make the label invisible by default.
        })
                .selector('.highlighted').css({
            'background-color': '#61bffc',
            'line-color': '#61bffc',
            'target-arrow-color': '#61bffc',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
        })
                .selector(':selected').css({// settings for highlighting nodes in case of single click or Shift+click multi-select event.
            'border-width': '4px',
            'border-color': '#CCCC33' // '#333'
        })
                .selector('.BlurNode').css({// settings for using shadow effect on nodes when they have hidden, connected nodes.
            'shadow-blur': '25', // disable for larger network graphs, use x & y offset(s) instead.
            'shadow-color': 'black', // 'data(conceptColor)',
            'shadow-opacity': '0.9'
        })
                .selector('.HideEle').css({// settings to hide node/ edge
            'display': 'none'
        })
                .selector('.ShowEle').css({// settings to show node/ edge
            'display': 'element'
        })
                .selector('.LabelOn').css({// settings to show Label on node/ edge
            'text-opacity': '1'
        })
                .selector('.LabelOff').css({// settings to show Label on node/ edge
            'text-opacity': '0'
        });

// On startup
        $(function () { // on dom ready
            // load the cytoscapeJS network
            container.load_reload_Network(networkJSON, networkStylesheet/*, true*/);

            my.append_visibility_and_label_classes(); // to all network nodes/ edges.
        }); // on dom ready
    }

    my.append_visibility_and_label_classes = function () {
        var cy = $('#cy').cytoscape('get'); // now we have a global reference to `cy`

        cy.nodes().forEach(function (conc) { // for concepts
            // Add relevant Concept visibility class
            if (conc.data('conceptDisplay') === 'element') {
                conc.addClass('ShowEle');
            } else {
                conc.addClass('HideEle');
            }
            // Add relevant label visibility class
            if (conc.style('text-opacity') === '0') {
                conc.addClass('LabelOff');
            } else {
                conc.addClass('LabelOn');
            }
        });
        cy.edges().forEach(function (rel) { // for relations
            // Add relevant Relation visibility class
            if (rel.data('relationDisplay') === 'element') {
                rel.addClass('ShowEle');
            } else {
                rel.addClass('HideEle');
            }
            // Add relevant label visibility class
            if (rel.style('text-opacity') === '0') {
                rel.addClass('LabelOff');
            } else {
                rel.addClass('LabelOn');
            }
        });
    }

    // Show concept neighbourhood.
    /*  function showNeighbourhood() {
     console.log("Show neighborhood: Display concepts in the neighbourhood of the selected concept (node)...");
     var selectedNodes= cy.nodes(':selected');
     selectedNodes.neighborhood().nodes().show();
     selectedNodes.neighborhood().edges().show();
     
     // Remove shadow effect from the nodes that had hidden nodes in their neighborhood.
     selectedNodes.forEach(function( ele ) {
     removeNodeBlur(ele);
     });
     
     }*/

    // Show shadow effect on nodes with connected, hidden elements in their neighborhood.
    my.blurNodesWithHiddenNeighborhood = function () {
        var cy = $('#cy').cytoscape('get'); // now we have a global reference to `cy`

        cy.nodes().forEach(function (ele) {
            var thisElement = ele;
            var eleID, connected_hiddenNodesCount = 0;
            try { // Retrieve the nodes in this element's neighborhood.
//         var neighborhood_nodes= thisElement.neighborhood().nodes();

                eleID = thisElement.id(); // element ID.
                // Retrieve the directly connected nodes in this element's neighborhood.
                var connected_edges = thisElement.connectedEdges();
                // Get all the relations (edges) with this concept (node) as the source.
//         var connected_edges= thisElement.connectedEdges().filter('edge[source = '+eleID+']');

                var connected_hidden_nodes = connected_edges.connectedNodes().filter('node[conceptDisplay = "none"]');
                // Find the number of hidden, connected nodes.
                connected_hiddenNodesCount = connected_hidden_nodes.length;

                if (connected_hiddenNodesCount > 1) {
                    // Show shadow around nodes that have hidden, connected nodes.
                    thisElement.addClass('BlurNode');
                }
            } catch (err) {
                console.log("Error occurred while adding Shadow to concepts with connected, hidden elements. \n" + "Error Details: " + err.stack);
            }
        });
    }

    return my;
};

/** Item Info.: display information about the selected concept(s)/ relation(s) including attributes, 
 * co-accessions and evidences.
 */
var KNETMAPS = KNETMAPS || {};

KNETMAPS.ItemInfo = function () {

    var my = function () {};

    my.showItemInfo = function (selectedElement) {
        var itemInfo = "";
        var metadataJSON = allGraphData; // using the dynamically included metadata JSON object directly.
        var createExpressionEntries = false;
        try {
            var cy = $('#cy').cytoscape('get');
            // Display the Item Info table in its parent div.
            document.getElementById("itemInfo_Table").style.display = "inline";
            // Display item information in the itemInfo <div> in a <table>.
            var table = document.getElementById("itemInfo_Table").getElementsByTagName('tbody')[0]; // get the Item Info. table.
            // Clear the existing table body contents.
            table.innerHTML = "";
            if (selectedElement.isNode()) {
                conID = selectedElement.id(); // id
                conValue = selectedElement.data('value'); // value
                // Unselect other concepts.
                cy.$(':selected').nodes().unselect();
                // Explicity select (highlight) the concept.
                cy.$('#' + conID).select();

                var row = table.insertRow(0); // create a new, empty row.
                // Insert new cells in this row.
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                // Store the necessary data in the cells.
                cell1.innerHTML = "Concept Type:";
                cell2.innerHTML = selectedElement.data('conceptType'); // concept Type
                // Concept 'Annotation'.
                if (selectedElement.data('annotation') !== "") {
                    row = table.insertRow(1/*3*/);
                    cell1 = row.insertCell(0);
                    cell2 = row.insertCell(1);
                    cell1.innerHTML = "Annotation:";
                    cell2.innerHTML = selectedElement.data('annotation');
                }
                // Get all metadata for this concept from the metadataJSON variable.
                for (var j = 0; j < metadataJSON.ondexmetadata.concepts.length; j++) {
                    if (selectedElement.id() === metadataJSON.ondexmetadata.concepts[j].id) {
                        // Concept 'elementOf'.
                        row = table.insertRow(table.rows.length/* - 1*/); // new row.
                        cell1 = row.insertCell(0);
                        cell2 = row.insertCell(1);
                        cell1.innerHTML = "Source:";
                        cell2.innerHTML = metadataJSON.ondexmetadata.concepts[j].elementOf;

                        // Get evidence information.
                        var evidences = "";
                        row = table.insertRow(table.rows.length); // new row.
                        cell1 = row.insertCell(0);
                        cell2 = row.insertCell(1);
                        cell1.innerHTML = "Evidence:";
                        for (var k = 0; k < metadataJSON.ondexmetadata.concepts[j].evidences.length; k++) {
                            if (metadataJSON.ondexmetadata.concepts[j].evidences[k] !== "") {
                                evidences = evidences + metadataJSON.ondexmetadata.concepts[j].evidences[k] + ", ";
                            }
                        }
                        cell2.innerHTML = evidences.substring(0, evidences.length - 2);

                        // Concept 'Description'.
                        if (metadataJSON.ondexmetadata.concepts[j].description !== "") {
                            row = table.insertRow(table.rows.length);
                            cell1 = row.insertCell(0);
                            cell2 = row.insertCell(1);
                            cell1.innerHTML = "Description:";
                            cell2.innerHTML = metadataJSON.ondexmetadata.concepts[j].description;
                        }

                        // Get all Synonyms (concept names).
                        var all_concept_names = "";
                        row = table.insertRow(table.rows.length); // new row.
                        cell1 = row.insertCell(0);
                        cell2 = row.insertCell(1);
                        cell1.innerHTML = "<b>Synonyms:</b>";
                        for (var k = 0; k < metadataJSON.ondexmetadata.concepts[j].conames.length; k++) {
                            var coname_Synonym = metadataJSON.ondexmetadata.concepts[j].conames[k].name;
                            var synonymID = coname_Synonym;
                            if (coname_Synonym !== "") {
                                if (synonymID.indexOf('<span') > -1) { // For html content within text, use html tags.
                                    synonymID = '<html>' + synonymID + '</html>';
                                    synonymID = jQuery(synonymID).text(); // filter out html content from id field.
                                }
                                // Display concept synonyms along with an eye icon to use them as preferred concept name.
                                var dispSynonym = coname_Synonym +
                                        ' <input type="submit" value="" class="knetSynonym" id="' + synonymID + '" onclick="KNETMAPS.ItemInfo().useAsPreferredConceptName(this.id);" onmouseover="KNETMAPS.Menu().onHover($(this));" onmouseout="KNETMAPS.Menu().offHover($(this));" title="Use as concept Label"/>' + '<br/>';
                                all_concept_names = all_concept_names + dispSynonym;
                            }
                        }
                        cell2.innerHTML = all_concept_names; // all synonyms.

                        // Get concept attributes.
                        row = table.insertRow(table.rows.length); // new row.
                        cell1 = row.insertCell(0);
                        cell1.innerHTML = "<b>Attributes:</b>"; // sub-heading
                        for (var k = 0; k < metadataJSON.ondexmetadata.concepts[j].attributes.length; k++) {
                            if ((metadataJSON.ondexmetadata.concepts[j].attributes[k].attrname !== "size")
                                    && (metadataJSON.ondexmetadata.concepts[j].attributes[k].attrname !== "visible")
                                    && (metadataJSON.ondexmetadata.concepts[j].attributes[k].attrname !== "flagged")
                                    && (!(metadataJSON.ondexmetadata.concepts[j].attributes[k].attrname.includes("exp_")))) {
                                row = table.insertRow(table.rows.length/* - 1*/); // new row.
                                cell1 = row.insertCell(0);
                                cell2 = row.insertCell(1);
                                attrName = metadataJSON.ondexmetadata.concepts[j].attributes[k].attrname;
                                attrValue = metadataJSON.ondexmetadata.concepts[j].attributes[k].value;
                                // For Taxonomy ID, display url (created via config>> url_mappings.json).
                                if ((attrName === "TAXID") || (attrName === "TX")) {
                                    for (var u = 0; u < url_mappings.html_acc.length; u++) {
                                        if ((url_mappings.html_acc[u].cv === attrName) || (url_mappings.html_acc[u].cv === "TX")) {
                                            attrUrl = url_mappings.html_acc[u].weblink + attrValue; // Taxonomy ID url.
                                            // open attribute url in new blank tab.
//                                        attrValue= "<a href=\""+ attrUrl +"\" target=\"_blank\">"+ attrValue +"</a>";
                                            attrValue = "<a href=\"" + attrUrl + "\" onclick=\"window.open(this.href,'_blank');return false;\">" + attrValue + "</a>";
                                        }
                                    }
                                } else if (attrName === "URL") {
                                    attrName = "URL(s)";
                                    var urlAttrValue = attrValue;
                                    attrValue = "";
                                    urlAttrValue = urlAttrValue.replace(/\s/g, ''); // remove spaces, if any
                                    var urls = urlAttrValue.split(",");
                                    urls.forEach(function (entry, index) {
                                        attrValue = attrValue + "<a href=\"" + entry + "\" onclick=\"window.open(this.href,'_blank');return false;\">" + entry + "</a>,<br/>";
                                    });
                                    // attrValue= attrValue.substring(0,attrValue.length-1); // omit last comma
                                    attrValue = attrValue.substring(0, attrValue.lastIndexOf("<") - 1); // omit last break & comma
                                }
                                // For Aminoacid sequence (AA).
                                else if (attrName.includes("AA")) {
                                    attrName = "Aminoacid sequence (" + attrName + ")";
                                    aaSeq = attrValue.match(/.{1,10}/g); // split into string array of 10 characters each.
                                    counter = 0;
                                    // Have monospaced font for AA sequence.
                                    attrValue = "<span style= \"font-family: 'Courier New', Courier, monospace\">";
                                    for (var p = 0; p < aaSeq.length; p++) {
                                        attrValue = attrValue + aaSeq[p] + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                                        counter = counter + 1;
                                        if (counter % 3 === 0) {
                                            attrValue = attrValue + "<br/>";
                                        }
                                    }
                                    attrValue = attrValue + "</span>";
                                }
                                cell1.innerHTML = attrName;
                                cell2.innerHTML = attrValue;
                            }
                            if (metadataJSON.ondexmetadata.concepts[j].attributes[k].attrname.includes("exp_")) { // write gene expression data later, if exists
                                createExpressionEntries = true;
                            }
                        }

                        // Get concept accessions.
                        row = table.insertRow(table.rows.length); // new row.
                        cell1 = row.insertCell(0);
                        cell1.innerHTML = "<b>Accessions:</b>"; // sub-heading
                        for (var k = 0; k < metadataJSON.ondexmetadata.concepts[j].coaccessions.length; k++) {
                            row = table.insertRow(table.rows.length/* - 1*/); // new row.
                            cell1 = row.insertCell(0);
                            cell2 = row.insertCell(1);
                            accessionID = metadataJSON.ondexmetadata.concepts[j].coaccessions[k].elementOf;
                            co_acc = metadataJSON.ondexmetadata.concepts[j].coaccessions[k].accession;
                            accession = co_acc; // retain the original accession value for the label/eye icon
                            for (var u = 0; u < url_mappings.html_acc.length; u++) {
                                if (url_mappings.html_acc[u].cv === accessionID) {
                                    coAccUrl = url_mappings.html_acc[u].weblink + co_acc; // co-accession url.
                                    if (accessionID === "CO") {
                                        coAccUrl = coAccUrl + "/";
                                    }
                                    coAccUrl = coAccUrl.replace(/\s/g, ''); // remove spaces, if any
                                    // open attribute url in new blank tab.
                                    co_acc = "<a href=\"" + coAccUrl + "\" onclick=\"window.open(this.href,'_blank');return false;\">" + co_acc + "</a>";
                                }
                            }
                            // Display concept accessions along with an eye icon to use them as preferred concept name.
                            co_acc = co_acc + " <input type='submit' value='' class='knetSynonym' id='" + accession + "' onclick='KNETMAPS.ItemInfo().useAsPreferredConceptName(this.id);' onmouseover='KNETMAPS.Menu().onHover($(this));' onmouseout='KNETMAPS.Menu().offHover($(this));' title='Use as concept Label'/>";
                            cell1.innerHTML = accessionID;
                            cell2.innerHTML = co_acc;
                        }
                        // Add Gene Expression data, if exists.
                        if (createExpressionEntries) {
                            // Create Expression header
                            row = table.insertRow(table.rows.length); // new row.
                            cell1 = row.insertCell(0);
                            cell1.innerHTML = "<b>Gene Expression:</b>"; // sub-heading
                            for (var k = 0; k < metadataJSON.ondexmetadata.concepts[j].attributes.length; k++) {
                                if (metadataJSON.ondexmetadata.concepts[j].attributes[k].attrname.includes("exp_")) {
                                    // Insert Gene Expression Data
                                    row = table.insertRow(table.rows.length/* - 1*/); // new row.
                                    cell1 = row.insertCell(0);
                                    cell2 = row.insertCell(1);
                                    attrName = metadataJSON.ondexmetadata.concepts[j].attributes[k].attrname;
                                    attrValue = metadataJSON.ondexmetadata.concepts[j].attributes[k].value;
                                    cell1.innerHTML = attrName;
                                    cell2.innerHTML = attrValue;
                                }
                            }
                        }
                    }
                }
            } else if (selectedElement.isEdge()) {
                var row = table.insertRow(0);
                // Insert new cells in this row.
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                // Store the necessary data in the cells.
                cell1.innerHTML = "Type:";
                cell2.innerHTML = selectedElement.data('label'); // relation label
                // Relation 'source'.
                row = table.insertRow(1);
                cell1 = row.insertCell(0);
                cell2 = row.insertCell(1);
                cell1.innerHTML = "From:";
                var fromID = selectedElement.data('source'); // relation source ('fromConcept').
                cell2.innerHTML = cy.$('#' + fromID).data('value') + " (" + cy.$('#' + fromID).data('conceptType').toLowerCase() + ")"; // relation source.
                // Relation 'target'.
                row = table.insertRow(2);
                cell1 = row.insertCell(0);
                cell2 = row.insertCell(1);
                cell1.innerHTML = "To:";
                var toID = selectedElement.data('target'); // relation destination ('toConcept').
                cell2.innerHTML = cy.$('#' + toID).data('value') + " (" + cy.$('#' + toID).data('conceptType').toLowerCase() + ")"; // relation destination.
                // Get all metadata for this relation from the metadataJSON variable.
                for (var j = 0; j < metadataJSON.ondexmetadata.relations.length; j++) {
                    if (selectedElement.id() === metadataJSON.ondexmetadata.relations[j].id) {
                        // Get evidence information.
                        var relationEvidences = "";
                        row = table.insertRow(table.rows.length); // new row.
                        cell1 = row.insertCell(0);
                        cell2 = row.insertCell(1);
                        cell1.innerHTML = "Evidence:";
                        for (var k = 0; k < metadataJSON.ondexmetadata.relations[j].evidences.length; k++) {
                            if (metadataJSON.ondexmetadata.relations[j].evidences[k] !== "") {
                                var evi = metadataJSON.ondexmetadata.relations[j].evidences[k]; // evidenceType
                                if (evi.includes("ECO:")) {
                                    evi = evi.replace(/\s/g, ''); // remove spaces, if any
                                    var evi_url = "http://ols.wordvis.com/q=" + evi; // ECO evidence_type url
                                    evi = "<a href=\"" + evi_url + "\" onclick=\"window.open(this.href,'_blank');return false;\">" + evi + "</a>";
                                }
                                relationEvidences = relationEvidences + evi + ", ";
                            }
                        }
                        cell2.innerHTML = relationEvidences.substring(0, relationEvidences.length - 2);

                        // Get relation attributes.
                        row = table.insertRow(table.rows.length); // new row.
                        cell1 = row.insertCell(0);
                        cell1.innerHTML = "<b>Attributes:</b>"; // sub-heading
                        for (var k = 0; k < metadataJSON.ondexmetadata.relations[j].attributes.length; k++) {
                            if ((metadataJSON.ondexmetadata.relations[j].attributes[k].attrname !== "size")
                                    && (metadataJSON.ondexmetadata.relations[j].attributes[k].attrname !== "visible")) {
                                row = table.insertRow(table.rows.length/* - 1*/); // new row.
                                cell1 = row.insertCell(0);
                                cell2 = row.insertCell(1);
                                attrName = metadataJSON.ondexmetadata.relations[j].attributes[k].attrname;
                                attrValue = metadataJSON.ondexmetadata.relations[j].attributes[k].value;
                                // For PubMed ID's (PMID), add urls (can be multiple for same attribute name)
                                if ((attrName === "PMID") || (attrName === "PubMed")) {
                                    // get PMID url from KnetMaps/config
                                    var pmidUrl = "";
                                    for (var u = 0; u < url_mappings.html_acc.length; u++) {
                                        if (url_mappings.html_acc[u].cv === attrName) {
                                            pmidUrl = url_mappings.html_acc[u].weblink; // PMID url
                                        }
                                    }
                                    // for multiple PMID's for relation attribute
                                    var pmidAttrValue = "";
                                    var pmids = attrValue.split(",");
                                    pmids.forEach(function (entry, index) {
                                        entry = entry.replace(/\s/g, ''); // remove spaces, if any
                                        attrUrl = pmidUrl + entry;
                                        pmidAttrValue = pmidAttrValue + "<a href=\"" + attrUrl + "\" onclick=\"window.open(this.href,'_blank');return false;\">" + entry + "</a>,<br/>";
                                    });
                                    pmidAttrValue = pmidAttrValue.substring(0, pmidAttrValue.lastIndexOf("<") - 1); // omit last break & comma
                                    attrValue = pmidAttrValue; // return urls
                                }
                                cell1.innerHTML = attrName;
                                cell2.innerHTML = attrValue;
                            }
                        }
                    }
                }
            }
        } catch (err) {
            itemInfo = "Selected element is neither a Concept nor a Relation";
            itemInfo = itemInfo + "<br/>Error details:<br/>" + err.stack; // error details
            console.log(itemInfo);
        }
    }

    // Open the Item Info pane when the "Item Info" option is selected for a concept or relation.
    my.openItemInfoPane = function () {
        var effect = 'slide';
        // Set the options for the effect type chosen
        var options = {direction: 'right'};
        // Set the duration (default: 400 milliseconds)
        var duration = 500;
        if ($('#itemInfo').css("display") === "none") {
            $('#itemInfo').toggle(effect, options, duration);
            // $('#itemInfo').slideToggle(500);
        }
    }

    my.closeItemInfoPane = function () {
        $("#itemInfo").hide();
    }

    // Remove shadow effect from nodes, if it exists.
    my.removeNodeBlur = function (ele) {
        var thisElement = ele;
        try {
            if (thisElement.hasClass('BlurNode')) { // Remove any shadow created around the node.
                thisElement.removeClass('BlurNode');
            }
        } catch (err) {
            console.log("Error occurred while removing Shadow from concepts with connected, hidden elements. \n" + "Error Details: " + err.stack);
        }
    }

    // Show hidden, connected nodes connected to this node & also remove shadow effect from nodes, wheere needed.
    my.showLinks = function (ele) {
        var selectedNode = ele;
        // Show concept neighborhood.
        selectedNode.connectedEdges().connectedNodes().removeClass('HideEle');
        selectedNode.connectedEdges().connectedNodes().addClass('ShowEle');

        selectedNode.connectedEdges().removeClass('HideEle');
        selectedNode.connectedEdges().addClass('ShowEle');

        // Remove shadow effect from the nodes that had hidden nodes in their neighborhood.
        my.removeNodeBlur(selectedNode);

        // Remove shadow effect from connected nodes too, if they do not have more hidden nodes in their neighborhood.
        selectedNode.connectedEdges().connectedNodes().forEach(function (elem) {
            var its_connected_hidden_nodes = elem.connectedEdges().connectedNodes().filter('node[conceptDisplay = "none"]');
            var its_connected_hiddenNodesCount = its_connected_hidden_nodes.length;
            console.log("connectedNode: id: " + elem.id() + ", label: " + elem.data('value') + ", its_connected_hiddenNodesCount= " + its_connected_hiddenNodesCount);
            if (its_connected_hiddenNodesCount < /*<=*/ 1) {
                my.removeNodeBlur(elem);
            }
        });

        try { // Relayout the graph.
            // Set a circle layout on the neighborhood.
            var eleBBox = selectedNode.boundingBox(); // get the bounding box of thie selected concept (node) for the layout to run around it.
            // Define the neighborhood's layout.
            var mini_circleLayout = {name: 'circle', radius: 2/*0.01*/, boundingBox: eleBBox,
                avoidOverlap: true, fit: true, handleDisconnected: true, padding: 10, animate: false,
                counterclockwise: false, rStepSize: 1/*0.01*/, ready: /*undefined*/function () {
                    cy.center();
                    cy.fit();
                },
                stop: undefined/*function() { cy.center(); cy.fit(); }*/};

            // Set the layout only using the hidden concepts (nodes).
            selectedNode.neighborhood().filter('node[conceptDisplay = "none"]').layout(mini_circleLayout);
        } catch (err) {
            console.log("Error occurred while setting layout on selected element's neighborhood: " + err.stack);
        }
    }

    // Set the given name (label) for the selected concept.
    my.useAsPreferredConceptName = function (new_conceptName) {
        try {
            var cy = $('#cy').cytoscape('get'); // now we have a global reference to `cy`
            cy.nodes().forEach(function (ele) {
                if (ele.selected()) {
                    if (new_conceptName.length > 30) {
                        new_conceptName = new_conceptName.substr(0, 29) + '...';
                    }
                    ele.data('displayValue', new_conceptName);
                    if (ele.style('text-opacity') === '0') {
                        ele.style({'text-opacity': '1'}); // show the concept Label.
                    }
                }
            });
        } catch (err) {
            console.log("Error occurred while altering preferred concept name. \n" + "Error Details: " + err.stack);
        }
    }

    return my;
};


var KNETMAPS = KNETMAPS || {};

KNETMAPS.LayoutDefaults = function () {

    var animate_layout = true; // global variable for layout animation setting (default: true).

    var my = function () {};

    // CoSE layout.
    my.coseNetworkLayout = {
        name: 'cose', // cytoscapeJS CoSE layout
        // Called on `layoutready`
        ready: function () { },
        // Called on `layoutstop`
        stop: function () { },

        // Whether to animate while running the layout
        animate: animate_layout/*true*/,
        // The layout animates only after this many milliseconds
        // (prevents flashing on fast runs)
        animationThreshold: 250,
        // Number of iterations between consecutive screen positions update (0 -> only updated on the end)
        refresh: 20,

        // Whether to fit the network view after when done
        fit: true,
        // Padding on fit
        padding: 30,

        // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        boundingBox: undefined,

        // Randomize the initial positions of the nodes (true) or use existing positions (false)
        randomize: /*false*/true,

        // Extra spacing between components in non-compound graphs
        componentSpacing: 100,

        // Node repulsion (non overlapping) multiplier
        nodeRepulsion: 400000,
        // Node repulsion (overlapping) multiplier
        nodeOverlap: 10,

        // Ideal edge (non nested) length
        idealEdgeLength: 10,
        // Divisor to compute edge forces
        edgeElasticity: 100,
        // Nesting factor (multiplier) to compute ideal edge length for nested edges
        nestingFactor: 5,

        // Gravity force (constant)
        gravity: 80,

        // Maximum number of iterations to perform
        numIter: 1000,
        // For enabling tiling, to prevent stacked nodes bug
        //tile: true,

        // Initial temperature (maximum node displacement)
        initialTemp: 200,
        // Cooling factor (how the temperature is reduced between consecutive iterations
        coolingFactor: 0.95,
        // Lower temperature threshold (below this point the layout will end)
        minTemp: 1.0,

        // Whether to use threading to speed up the layout
        useMultitasking: true
    };

    my.coseNetworkLayout_old = {
        name: 'cose', // CytoscapeJS CoSE layout
        animate: animate_layout /*true*/,
        handleDisconnected: true, avoidOverlap: true,
        idealEdgeLength: 100, nodeOverlap: 20
    };

    // Force layout.
    my.ngraph_forceNetworkLayout = {
        name: 'cytoscape-ngraph.forcelayout',
        animate: animate_layout, fit: true,
        async: {
            // tell layout that we want to compute all at once:
            maxIterations: 1000,
            stepsPerCycle: 30,

            // Run it till the end:
            waitForStep: false
        },
        physics: {
            // Ideal length for links (springs in physical model).
            springLength: 130,

            // Hook's law coefficient. 1 - solid spring.
            springCoeff: 0.0008,

            // Coulomb's law coefficient. It's used to repel nodes thus should be negative
            // if you make it positive nodes start attract each other :).
            gravity: -1.2,

            // Theta coefficient from Barnes Hut simulation. Ranged between (0, 1).
            // The closer it's to 1 the more nodes algorithm will have to go through.
            // Setting it to one makes Barnes Hut simulation no different from brute-force forces calculation (each node is considered).
            theta: 0.8,

            // Drag force coefficient. Used to slow down system, thus should be less than 1.
            // The closer it is to 0 the less tight system will be.
            dragCoeff: 0.02,

            // Default time step (dt) for forces integration
            timeStep: 20,
            iterations: 10000,
            fit: true,

            // Maximum movement of the system which can be considered as stabilized
            stableThreshold: 0.000009
        },
        iterations: 10000,
        refreshInterval: 16, // in ms
        refreshIterations: 10, // iterations until thread sends an update
        stableThreshold: 2
    };

    // Circular layout.
    my.circleNetworkLayout = {
        name: 'circle', // Circle layout (Ondex Web: Circular)
        padding: 10/*30*/, avoidOverlap: true, boundingBox: undefined, handleDisconnected: true,
        animate: animate_layout, fit: true, counterclockwise: false,
        radius: 3 /*undefined*/,
//      startAngle: 3/2 * Math.PI,
        rStepSize: 2
    };

    // Concentric layout.
    my.concentricNetworkLayout = {
        name: 'concentric', fit: true, padding: 10,
        startAngle: 3 / 2 * Math.PI, // the position of the 1st node
        counterclockwise: false, // whether the layout should go anticlockwise (true) or clockwise (false)
        minNodeSpacing: 10, boundingBox: undefined, avoidOverlap: true, height: undefined, width: undefined,
        concentric: function () { // returns numeric value for each node, placing higher nodes in levels towards the centre
            return this.degree();
        },
        levelWidth: function (nodes) { // the variation of concentric values in each level
            return 0.5 /*nodes.maxDegree() / 4*/;
        },
        animate: animate_layout, animationDuration: 500, ready: undefined, stop: undefined,
        radius: 5 /*undefined*/
    };

    // CoSE-Bilkent layout.
    my.coseBilkentNetworkLayout = {
        name: 'cose-bilkent',
        ready: function () {
        },
        // Called on `layoutstop`
        stop: function () {
        },
        // Whether to fit the network view after when done
        fit: true,
        // Padding on fit
        padding: 10,
        // Whether to enable incremental mode
        randomize: true,
        // Node repulsion (non overlapping) multiplier
        nodeRepulsion: 4500,
        // Ideal edge (non nested) length
        idealEdgeLength: 50,
        // Divisor to compute edge forces
        edgeElasticity: 0.45,
        // Nesting factor (multiplier) to compute ideal edge length for nested edges
        nestingFactor: 0.1,
        // Gravity force (constant)
        gravity: 0.25,
        // Maximum number of iterations to perform
        numIter: 200,
        // For enabling tiling
        tile: true,
        // Type of layout animation. The option set is {'during', 'end', false}
        animate: false,
        // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
        tilingPaddingVertical: 10,
        // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
        tilingPaddingHorizontal: 10,
        // Gravity range (constant) for compounds
        gravityRangeCompound: 1.5,
        // Gravity force (constant) for compounds
        gravityCompound: 1.0,
        // Gravity range (constant)
        gravityRange: 3.8
    };

    my.coseBilkentNetworkLayout_old = {
        name: 'cose-bilkent', handleDisconnected: true, avoidOverlap: true
    };

    return my;
};

/**
 * @name Network layouts
 * @description using cytoscapeJS layouts & 3rd party layout algorithms.
 **/

var KNETMAPS = KNETMAPS || {};

KNETMAPS.Layouts = function () {

    var defaults = KNETMAPS.LayoutDefaults();

    var my = function () {};

    var animate_layout = true; // global variable for layout animation setting (default: true).

    my.setLayoutAnimationSetting = function () { // Toggle layout animation On/ Off.
        if (document.getElementById("animateLayout").checked) {
            animate_layout = true;
        } else {
            animate_layout = false;
        }
    }

    // Set Cose layout.
    /* Useful for larger networks with clustering. */
    my.setCoseLayout = function (eles) {
        eles.layout(defaults.coseNetworkLayout); // run the CoSE layout algorithm.
    }

    // Set Force layout.
    my.setNgraphForceLayout = function (eles) {
        eles.layout(defaults.ngraph_forceNetworkLayout); // run the Force layout.
    }

    // Set Circle layout.
    my.setCircleLayout = function (eles) {
        eles.layout(defaults.circleNetworkLayout); // run the Circle layout.
    }

    // Set Concentric layout.
    my.setConcentricLayout = function (eles) {
        eles.layout(defaults.concentricNetworkLayout); // run the Concentric layout.
    }

    // Set CoSE-Bilkent layout.
    /* with node clustering, but performance-intensive for larger networks */
    my.setCoseBilkentLayout = function (eles) {
        eles.layout(defaults.coseBilkentNetworkLayout);
    }

    // Set default (CoSE) layout for the network graph.
    my.setDefaultLayout = function () {
        //console.log("cytoscapeJS container (cy) initialized... set default layout (on visible elements)...");
        // Get the cytoscape instance as a Javascript object from JQuery.
        var cy = $('#cy').cytoscape('get');
        my.setCoseLayout(cy.$(':visible')); // run the layout only on the visible elements.
        cy.reset().fit();
    }

    return my;
};
var KNETMAPS = KNETMAPS || {};

KNETMAPS.MaskLoader = function () {

    var my = function () {};

    // Network loader (maskloader animation)
    my.showNetworkLoader = function (target) {
        // Show loader while the Network loads.
        $(target).maskLoader({
            // fade effect
            'fade': true,
            'z-index': '999',
            'background': 'white',
            'opacity': '0.6',
            // position property
            'position': 'absolute',
            // custom loading spinner
            'imgLoader': false,
            // If false, you will have to run the "create" function.
            //  Ex: $('body').maskLoader().create(); 
            'autoCreate': true,
            // displayes text alert
            'textAlert': false
        });
    }

    my.removeNetworkLoader = function (target) {
        // Remove Network loader.
        var maskloader = $(target).maskLoader();
        maskloader.destroy();
    }

    return my;
};

var KNETMAPS = KNETMAPS || {};

KNETMAPS.Menu = function () {

    var iteminfo = KNETMAPS.ItemInfo();
    var container = KNETMAPS.Container();
    var stats = KNETMAPS.Stats();

    var my = function () {};

    my.onHover = function (thisBtn) {
        $(thisBtn).removeClass('unhover').addClass('hover');
    }

    my.offHover = function (thisBtn) {
        $(thisBtn).removeClass('hover').addClass('unhover');
    }

    my.popupItemInfo = function () {
        iteminfo.openItemInfoPane();
        iteminfo.showItemInfo(this);
    }

    // Go to Help docs.
    my.openKnetHelpPage = function () {
        var helpURL = 'https://github.com/Rothamsted/knetmaps.js/wiki/KnetMaps.js';
        window.open(helpURL, '_blank');
    }

    // Reset: Re-position the network graph.
    my.resetGraph = function () {
        $('#cy').cytoscape('get').reset().fit(); // reset the graph's zooming & panning properties.
    }

    // Export the graph as a JSON object in a new Tab and allow users to save it.
    my.exportAsJson = function () {
        var cy = $('#cy').cytoscape('get'); // now we have a global reference to `cy`

        var exportJson = cy.json(); // get JSON object for the network graph.
        //console.log("Save network JSON as: kNetwork.cyjs.json");

        // use FileSaver.js to save using file downloader
        var kNet_json_Blob = new Blob([JSON.stringify(exportJson)], {type: 'application/javascript;charset=utf-8'});
        saveAs(kNet_json_Blob, "kNetwork.cyjs.json");
    }

    // Export the graph as a .png image and allow users to save it.
    my.exportAsImage = function () {
        var cy = $('#cy').cytoscape('get'); // now we have a global reference to `cy`

        // Export as .png image
        var png64 = cy.png(); // .setAttribute('crossOrigin', 'anonymous');
        //console.log("Export network PNG as: kNetwork.png");

        // Use IFrame to open png image in a new browser tab
        var cy_width = $('#cy').width();
        var cy_height = $('#cy').height();
        //var knet_iframe_style= "border:1px solid black; top:0px; left:0px; bottom:0px; right:0px; width:"+ cy_width +"; height:"+ cy_height +";";
        var knet_iframe_style = "top:0px; left:0px; bottom:0px; right:0px; width:" + cy_width + "; height:" + cy_height + ";";
        var knet_iframe = '<iframe src="' + png64 + '" frameborder="0" style="' + knet_iframe_style + '" allowfullscreen></iframe>';
        var pngTab = window.open();
        pngTab.document.open();
        pngTab.document.write(knet_iframe);
        pngTab.document.title = "kNetwork_png";
        pngTab.document.close();
    }

    // Show all concepts & relations.
    my.showAll = function () {
        var cy = $('#cy').cytoscape('get'); // now we have a global reference to `cy`
        cy.elements().removeClass('HideEle');
        cy.elements().addClass('ShowEle');

        // Relayout the graph.
        my.rerunLayout();

        // Remove shadows around nodes, if any.
        cy.nodes().forEach(function (ele) {
            iteminfo.removeNodeBlur(ele);
        });

        // Refresh network legend.
        stats.updateKnetStats();
    }

    // Re-run the entire graph's layout.
    my.rerunLayout = function () {
        // Get the cytoscape instance as a Javascript object from JQuery.
        var cy = $('#cy').cytoscape('get'); // now we have a global reference to `cy`
        var selected_elements = cy.$(':visible'); // get only the visible elements.

        // Re-run the graph's layout, but only on the visible elements.
        my.rerunGraphLayout(selected_elements);

        // Reset the graph/ viewport.
        my.resetGraph();
    }

    var layouts = KNETMAPS.Layouts();

    // Re-run the graph's layout, but only on the visible elements.
    my.rerunGraphLayout = function (eles) {
        var ld_selected = $('#layouts_dropdown').val();
        if (ld_selected === "circle_layout") {
            layouts.setCircleLayout(eles);
        } else if (ld_selected === "cose_layout") {
            layouts.setCoseLayout(eles);
        } else if (ld_selected === "coseBilkent_layout") {
            layouts.setCoseBilkentLayout(eles);
        } else if (ld_selected === "concentric_layout") {
            layouts.setConcentricLayout(eles);
        } else if (ld_selected === "ngraph_force_layout") {
            layouts.setNgraphForceLayout(eles);
        }
    }

    // Update the label font size for all the concepts and relations.
    my.changeLabelFontSize = function (new_size) {
        try {
            var cy = $('#cy').cytoscape('get'); // now we have a global reference to `cy`
            console.log("changeLabelFontSize>> new_size: " + new_size);
            cy.style().selector('node').css({'font-size': new_size}).update();
            cy.style().selector('edge').css({'font-size': new_size}).update();
        } catch (err) {
            console.log("Error occurred while altering label font size. \n" + "Error Details: " + err.stack);
        }
    }

    // Show/ Hide labels for concepts and relations.
    my.showHideLabels = function (val) {
        if (val === "Concepts") {
            my.displayConceptLabels();
        } else if (val === "Relations") {
            my.displayRelationLabels();
        } else if (val === "Both") {
            my.displayConRelLabels();
        } else if (val === "None") {
            my.hideConRelLabels();
        }
    }

    // Show node labels.
    my.displayConceptLabels = function () {
        var cy = $('#cy').cytoscape('get'); // reference to `cy`
        cy.nodes().removeClass("LabelOff").addClass("LabelOn");
        cy.edges().removeClass("LabelOn").addClass("LabelOff");
    }

    // Show edge labels.
    my.displayRelationLabels = function () {
        var cy = $('#cy').cytoscape('get'); // reference to `cy`
        cy.nodes().removeClass("LabelOn").addClass("LabelOff");
        cy.edges().removeClass("LabelOff").addClass("LabelOn");
    }

    // Show node & edge labels.
    my.displayConRelLabels = function () {
        var cy = $('#cy').cytoscape('get'); // reference to `cy`
        cy.nodes().removeClass("LabelOff").addClass("LabelOn");
        cy.edges().removeClass("LabelOff").addClass("LabelOn");
    }

    // Show node labels.
    my.hideConRelLabels = function () {
        var cy = $('#cy').cytoscape('get'); // reference to `cy`
        cy.nodes().removeClass("LabelOn").addClass("LabelOff");
        cy.edges().removeClass("LabelOn").addClass("LabelOff");
    }

    // Full screen: Maximize/ Minimize overlay
    my.OnMaximizeClick = function () {
        var cy_target = $('#cy').cytoscape('get');
        var currentEles_jsons = cy_target.elements().jsons();
        var currentStylesheet_json = cy_target.style().json(); //cy_target.style().json();
        if (!$('#knet-maps').hasClass('full_screen')) {
            $('#maximizeOverlay').removeClass('max').addClass('min'); // toggle image
            // Maximize
            $('#knet-maps').addClass('full_screen');

            // reload the network
            container.load_reload_Network(currentEles_jsons, currentStylesheet_json/*, false*/);

            // Show Item Info table
            iteminfo.openItemInfoPane();
        } else {
            $('#maximizeOverlay').removeClass('min').addClass('max'); // toggle image
            // Minimize
            $('#knet-maps').removeClass('full_screen');

            // reload the network
            container.load_reload_Network(currentEles_jsons, currentStylesheet_json/*, false*/);

            // Hide Item Info table
            iteminfo.closeItemInfoPane();
        }
    }
    return my;
};

var KNETMAPS = KNETMAPS || {};

KNETMAPS.Stats = function () {

    var my = function () {};

    // Refresh network stats, whenever nodes are hidden individually or in group or in case of "Show All" or "Show Links".
    my.updateKnetStats = function () {
        var cy = $('#cy').cytoscape('get');
        var totalNodes = cy.nodes().size();
        var nodes_shown = cy.$(':visible').nodes().size();
        var cyLegend = "Concepts: " + nodes_shown + " (" + totalNodes + ")";

        var totalEdges = cy.edges().size();
        var edges_shown = cy.$(':visible').edges().size();
        cyLegend = cyLegend + "; Relations: " + edges_shown + " (" + totalEdges + ")";

        $('#statsLegend span').text(cyLegend); // update
    }

    return my;
};

var KNETMAPS = KNETMAPS || {};

KNETMAPS.KnetMaps = function () {

    var maskloader = KNETMAPS.MaskLoader();
    var generator = KNETMAPS.Generator();

    var drawDiv = function (target) {
        $(target).html("<div id='knetmaps-menu'>"
                + "<input type='submit' id='maximizeOverlay' class='max unhover' value='' title='Toggle full screen' onclick='KNETMAPS.Menu().OnMaximizeClick();' onmouseover='KNETMAPS.Menu().onHover($(this));' onmouseout='KNETMAPS.Menu().offHover($(this));'>"
                + "<input type='submit' id='showAll' value='' class='unhover' onclick='KNETMAPS.Menu().showAll();' title='Show all the concept & relations in the Network' onmouseover='KNETMAPS.Menu().onHover($(this));' onmouseout='KNETMAPS.Menu().offHover($(this));'>"
                + "<input type='submit' id='relayoutNetwork' value='' class='unhover' onclick='KNETMAPS.Menu().rerunLayout();' title='Re-run the Layout' onmouseover='KNETMAPS.Menu().onHover($(this));' onmouseout='KNETMAPS.Menu().offHover($(this));'>"
                + "<input type='submit' id='openItemInfoBtn' value='' class='unhover' onclick='KNETMAPS.Menu().popupItemInfo();' title='Show Info box' onmouseover='KNETMAPS.Menu().onHover($(this));' onmouseout='KNETMAPS.Menu().offHover($(this));'>"
                + "<span class='knet-dropdowns'>"
                + "<select id='layouts_dropdown' class='knet-dropdowns' onChange='KNETMAPS.Menu().rerunLayout();' title='Select network layout'>"
                + "<option value='cose_layout' selected='selected' title='using CoSE layout algorithm (useful for larger networks with clustering)'>CoSE layout</option>"
                + "<option value='ngraph_force_layout' title='using ngraph_force layout (works well on planar graphs)'>Force layout</option>"
                + "<option value='circle_layout'>Circular layout</option>"
                + "<option value='concentric_layout'>Concentric layout</option>"
                + "<option value='coseBilkent_layout' title='using CoSE-Bilkent layout (with node clustering, but performance-intensive for larger networks)'>CoSE-Bilkent layout</option>"
                +
                /*
                 * "<option value='euler_layout'>Euler layout</option>"+ "<option
                 * value='random_layout'>Random layout</option>"+
                 */
                "</select>"
                + "<select id='changeLabelVisibility' class='knet-dropdowns' onChange='KNETMAPS.Menu().showHideLabels(this.value);' title='Select label visibility'>"
                + "<option value='None' selected='selected'>Labels: None</option>"
                + "<option value='Concepts'>Labels: Concepts</option>"
                + "<option value='Relations'>Labels: Relations</option>"
                + "<option value='Both'>Labels: Both</option>"
                + "</select>"
                + "<select id='changeLabelFont' class='knet-dropdowns' onChange='KNETMAPS.Menu().changeLabelFontSize(this.value);' title='Select label font size'>"
                + "<option value='8'>Label size: 8px</option>"
                + "<option value='12'>Label size: 12px</option>"
                + "<option value='16' selected='selected'>Label size: 16px</option>"
                + "<option value='20'>Label size: 20px</option>"
                + "<option value='24'>Label size: 24px</option>"
                + "<option value='28'>Label size: 28px</option>"
                + "<option value='32'>Label size: 32px</option>"
                + "<option value='36'>Label size: 36px</option>"
                + "<option value='40'>Label size: 40px</option>"
                + "</select>"
                + "</span>"
                + "<input type='submit' id='resetNetwork' value='' class='unhover' onclick='KNETMAPS.Menu().resetGraph();' title='Reposition (reset and re-fit) the graph' onmouseover='KNETMAPS.Menu().onHover($(this));' onmouseout='KNETMAPS.Menu().offHover($(this));'>"
                + "<input type='submit' id='savePNG' value='' class='unhover' onclick='KNETMAPS.Menu().exportAsImage();' title='Export the network as a .png image' onmouseover='KNETMAPS.Menu().onHover($(this));' onmouseout='KNETMAPS.Menu().offHover($(this));'>"
                + "<input type='submit' id='saveJSON' value='' class='unhover' onclick='KNETMAPS.Menu().exportAsJson();' title='Export the network in JSON format' onmouseover='KNETMAPS.Menu().onHover($(this));' onmouseout='KNETMAPS.Menu().offHover($(this));'>"
                + "<input type='submit' id='helpURL' value='' class='unhover' onclick='KNETMAPS.Menu().openKnetHelpPage();' title='Go to help documentation' onmouseover='KNETMAPS.Menu().onHover($(this));' onmouseout='KNETMAPS.Menu().offHover($(this));'>"
                + "</div> <!-- KnetMaps Menubar -->"
                + "<div id='itemInfo' class='infoDiv' style='display:none;'> <!-- Item Info pane -->"
                + "<table id='itemInfo_Table' class='infoTable' cellspacing=1>"
                + "<thead><th>Info box:</th>"
                + "<th><input type='submit' id='btnCloseItemInfoPane' value='' onclick='KNETMAPS.ItemInfo().closeItemInfoPane();'></th>"
                + "</thead><tbody></tbody></table>"
                + "</div>"
                + "<!-- The core cytoscapeJS container -->"
                + "<div id='cy'></div>"
                + "<!-- interactive, dynamic Legend to show all concept of a particular type -->"
                + "<div id='knetLegend' title='Hover over icons to see corresponding Concept type & click an icon to show all such Concepts connected to visible Concepts in this network'><span>Concepts:</span></div>"
                + "<!-- dynamically updated Legend to show number of shown/ hidden concepts -->"
                + "<div id='statsLegend' style='width: 350px; margin: auto;'><span>KnetMaps</span></div>"
                + "<div id='infoDialog'></div> <!-- popup dialog -->"
                );
    };

    var showDiv = function (target) {
        $(target).css("display", "block"); // show the KnetMaps block
    };

    var my = function () {};

    // Exposed API

    my.drawRaw = function (target, graph) {
        drawDiv(target);
        showDiv(target);
        maskloader.showNetworkLoader(target);
        generator.generateNetworkGraphRaw(graph);
        maskloader.removeNetworkLoader(target);
    };

    my.draw = function (target) {
        drawDiv(target);
        showDiv(target);
        maskloader.showNetworkLoader(target);
        generator.generateNetworkGraph();
        maskloader.removeNetworkLoader(target);
    };

    return my;
};

var url_mappings = {
    "comment": "#CV, weblink, CC_Restriction, taxidpostfix",
    "html_acc": [
        {"cv": "AC", "weblink": "http://pmn.plantcyc.org/ARA/NEW-IMAGE?type=NIL&object=", "cc_restriction": ""},
        {"cv": "AspGD", "weblink": "http://www.aspergillusgenome.org/cgi-bin/locus.pl?dbid=", "cc_restriction": ""},
        {"cv": "CHEBI", "weblink": "http://www.ebi.ac.uk/chebi/searchId.do?chebiId=", "cc_restriction": ""},
        {"cv": "CHEMBL", "weblink": "https://www.ebi.ac.uk/chembldb/compound/inspect/", "cc_restriction": ""},
        {"cv": "CHEMBLASSAY", "weblink": "https://www.ebi.ac.uk/chembldb/assay/inspect/", "cc_restriction": ""},
        {"cv": "CHEMBLTARGET", "weblink": "https://www.ebi.ac.uk/chembldb/target/inspect/", "cc_restriction": ""},
        {"cv": "CO", "weblink": "http://www.cropontology.org/terms/CO_321:", "cc_restriction": ""},
        {"cv": "DOI", "weblink": "http://dx.doi.org/", "cc_restriction": ""},
        {"cv": "DrugBank", "weblink": "https://www.drugbank.ca/drugs/", "cc_restriction": ""},
        {"cv": "EC", "weblink": "http://www.expasy.org/enzyme/", "cc_restriction": ""},
        {"cv": "EMBL", "weblink": "http://www.ebi.ac.uk/ena/data/view/", "cc_restriction": ""},
        {"cv": "ENSEMBL", "weblink": "http://plants.ensembl.org/Search/Results?q=", "cc_restriction": ""},
        {"cv": "ENSV", "weblink": "http://plants.ensembl.org/Search/Results?q=", "cc_restriction": ""},
        {"cv": "ENSEMBL-MOUSE", "weblink": "http://www.ensembl.org/Mus_musculus/Gene/Summary?db=core;g=", "cc_restriction": ""},
        {"cv": "EBI-GXA", "weblink": "https://www.ebi.ac.uk/gxa/experiments/", "cc_restriction": ""},
        {"cv": "GENB", "weblink": "http://www.ncbi.nlm.nih.gov/sites/entrez?db=nuccore&cmd=search&term=", "cc_restriction": ""},
        {"cv": "GENOSCOPE", "weblink": "http://www.genoscope.cns.fr/brassicanapus/cgi-bin/gbrowse/colza/?name=", "cc_restriction": ""},
        {"cv": "GO", "weblink": "http://www.ebi.ac.uk/QuickGO/term/", "cc_restriction": ""},
        {"cv": "INTACT", "weblink": "http://www.ebi.ac.uk/intact/pages/interactions/interactions.xhtml?query=", "cc_restriction": ""},
        {"cv": "IPRO", "weblink": "http://www.ebi.ac.uk/interpro/IEntry?ac=", "cc_restriction": ""},
        {"cv": "KEGG", "weblink": "http://www.genome.jp/dbget-bin/www_bget?cpd:", "cc_restriction": "Comp"},
        {"cv": "MC", "weblink": "http://metacyc.org/META/substring-search?type=NIL&object=", "cc_restriction": ""},
        {"cv": "NC_GE", "weblink": "http://www.ncbi.nlm.nih.gov/sites/entrez?db=gene&term=", "cc_restriction": ""},
        {"cv": "NC_NM", "weblink": "http://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?id=", "cc_restriction": ""},
        {"cv": "NC_NP", "weblink": "http://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?db=protein&id=", "cc_restriction": ""},
        {"cv": "NLM", "weblink": "http://www.ncbi.nlm.nih.gov/pubmed/", "cc_restriction": ""},
        {"cv": "OMIM", "weblink": "http://omim.org/entry/", "cc_restriction": ""},
        {"cv": "PDB", "weblink": "http://www.rcsb.org/pdb/explore/explore.do?structureId=", "cc_restriction": ""},
        {"cv": "PFAM", "weblink": "http://pfam.sanger.ac.uk/family/", "cc_restriction": ""},
        {"cv": "PlnTFDB", "weblink": "http://plntfdb.bio.uni-potsdam.de/v3.0/get_id.php?seq_id=", "cc_restriction": ""},
        {"cv": "PMID", "weblink": "http://www.ncbi.nlm.nih.gov/pubmed/", "cc_restriction": ""},
        {"cv": "PO", "weblink": "http://purl.obolibrary.org/obo/PO_", "cc_restriction": ""},
        {"cv": "Poplar-JGI", "weblink": "http://genome.jgi-psf.org/cgi-bin/dispGeneModel?db=Poptr1_1&id=", "cc_restriction": ""},
        {"cv": "PoplarCyc", "weblink": "http://pmn.plantcyc.org/POPLAR/NEW-IMAGE?object=", "cc_restriction": ""},
        {"cv": "PRINTS", "weblink": "http://www.bioinf.manchester.ac.uk/cgi-bin/dbbrowser/PRINTS/DoPRINTS.pl?cmd_a=Display&fun_a=Text&qst_a=", "cc_restriction": ""},
        {"cv": "PRODOM", "weblink": "http://prodom.prabi.fr/prodom/current/cgi-bin/request.pl?question=DBEN&query=", "cc_restriction": ""},
        {"cv": "PROSITE", "weblink": "http://www.expasy.org/prosite/", "cc_restriction": ""},
        {"cv": "PUBCHEM", "weblink": "http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=", "cc_restriction": ""},
        {"cv": "PubMed", "weblink": "http://www.ncbi.nlm.nih.gov/pubmed/", "cc_restriction": ""},
        {"cv": "REAC", "weblink": "http://www.reactome.org/entitylevelview/PathwayBrowser.html#DB=gk_current&ID=", "cc_restriction": ""},
        {"cv": "SCOP", "weblink": "http://scop.mrc-lmb.cam.ac.uk/scop/search.cgi?sid=", "cc_restriction": ""},
        {"cv": "SGD", "weblink": "http://www.yeastgenome.org/locus/", "cc_restriction": ""},
        {"cv": "SOYCYC", "weblink": "http://www.soybase.org:8082/SOY/NEW-IMAGE?type=COMPOUND&object=", "cc_restriction": "Comp"},
        {"cv": "SOYCYC", "weblink": "http://www.soybase.org:8082/SOY/NEW-IMAGE?type=PATHWAY&object=", "cc_restriction": "Path"},
        {"cv": "SOYCYC", "weblink": "http://www.soybase.org:8082/SOY/NEW-IMAGE?type=REACTION&object=", "cc_restriction": "Reaction"},
        {"cv": "TAIR", "weblink": "http://www.arabidopsis.org/servlets/TairObject?type=locus&name=", "cc_restriction": ""},
        {"cv": "TO", "weblink": "http://purl.obolibrary.org/obo/TO_", "cc_restriction": ""},
        {"cv": "TX", "weblink": "http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=", "cc_restriction": ""},
        {"cv": "UNIPROTKB", "weblink": "http://www.uniprot.org/uniprot/", "cc_restriction": ""},
        {"cv": "YeastCyc", "weblink": "https://yeast.biocyc.org/YEAST/NEW-IMAGE?type=NIL&object=", "cc_restriction": ""}
    ]
};
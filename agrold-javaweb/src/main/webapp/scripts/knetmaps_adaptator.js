/* 
 * knetmaps_adaptator.js
 * This script solves two limits of knetmaps
 */

function Dataset(_name, _allGraphData, _graph) {
    this.name = _name;
    this.allGraphData = _allGraphData;
    this.graph = _graph;
}

function GraphData(_graphName, _version) {
    this.graphName = _graphName;
    this.version = _version;
    this.concepts = [];
    this.relations = [];

    this.getNumberOfConcepts = function () {
        return this.concepts.length;
    };

    this.getNnumberOfRelations = function () {
        return this.relations.length;
    };

    this.addConcept = function (concept) {
        var foundAt = -1;
        for (var i = 0; i < this.concepts.length; i++) {
            if (this.concepts[i].id === concept.id) {
                foundAt = i;
                break;
            }
        }
        if (foundAt > -1) {
            this.concepts[foundAt].annotation = concept.annotation;
            this.concepts[foundAt].elementOf = concept.elementOf;
            this.concepts[foundAt].description = concept.description;
            this.concepts[foundAt].pid = concept.pid;
            this.concepts[foundAt].value = concept.value;
            this.concepts[foundAt].ofType = concept.ofType;
            this.concepts[foundAt].evidences = concept.evidences;
            this.concepts[foundAt].contexts = concept.contexts;
            this.concepts[foundAt].conames = concept.conames;
            this.concepts[foundAt].attributes = concept.attributes;
            this.concepts[foundAt].coaccessions = concept.coaccessions;
        } else {
            this.concepts.push(concept);
        }
    };

    this.addRelation = function (relation) {
        var foundAt = -1;
        for (var i = 0; i < this.relations.length; i++) {
            if (this.relations[i].id === relation.id) {
                foundAt = i;
                break;
            }
        }
        if (foundAt > -1) {
            this.relations[foundAt].ofType += relation.ofType;
        } else {
            this.relations.push(relation);
        }

    };
}

function ConceptType(name) {
    this.name = name;

    this.getName = function () {
        return this.name;
    };
}

function RelationTypeStyle(relationName, relationColor, relationSize) {
    this.name = relationName;
    this.color = relationColor;
    this.size = relationSize;

    this.getName = function () {
        return this.name;
    };

    this.getColor = function () {
        return this.color;
    };

    this.getSize = function () {
        return this.size;
    };
}


function RelationType(relationName, sourceConceptType, targetConceptType) {
    this.name = relationName;
    this.sourceConceptType = sourceConceptType;
    this.targetConceptType = targetConceptType;
}

function Concept(iri, id, annotation, elementOf, description, pid, value, conceptType) {
    this.iri = iri;
    this.id = id;
    this.annotation = annotation;
    this.elementOf = elementOf;
    this.description = description;
    this.pid = pid;
    this.value = value;
    this.ofType = conceptType.getName();
    this.evidences = [];
    this.contexts = [];
    this.conames = [];
    this.attributes = [];
    this.coaccessions = [];

    this.getId = function () {
        return this.id;
    };

    this.addConame = function (coname) {
        var foundAt = -1;
        for (var i = 0; i < this.conames.length; i++) {
            if (this.conames[i].name === coname.name) {
                foundAt = i;
                break;
            }
        }
        if (foundAt > -1) {
            return;
        }
        this.conames.push(coname);
    };

    this.addEvidence = function (evidence) {
        this.evidences.push(evidence);
    };

    this.addAttribute = function (attribute) {
        this.attributes.push(attribute);
    };

    this.addCoaccession = function (coaccession) {
        this.coaccessions.push(coaccession);
    };

    this.addContext = function (context) {
        this.contexts.push(context);
    };
}


function Coaccession(_elementOf, _accession) {
    this.elementOf = _elementOf;
    this.accession = _accession;
}


function Coname(name, isPreferred) {
    this.name = name;
    this.isPreferred = isPreferred;
}

function Attribute(attrname, value) {
    this.attrname = attrname;
    this.value = value;
}

function Relation(id, toConcept, fromConcept, ofType) {
    this.id = id;
    this.toConcept = toConcept.getId();
    this.fromConcept = fromConcept.getId();
    this.ofType = ofType;
    this.evidences = [];
    this.contexts = {};
    this.attributes = [];

    this.getId = function () {
        return this.id;
    };

    this.getOfType = function () {
        return this.ofType;
    };

    this.addEvidence = function (evidence) {
        this.evidences.push(evidence);
    };

    this.addAttribute = function (attribute) {
        this.attributes.push(attribute);
    };

    this.addContext = function (name, value) {
        this.contexts[name] = value;
    };
}

function Graph() {
    this.nodes = [];
    this.edges = [];

    this.addNode = function (node) {
        var foundAt = -1;
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].data.id === node.data.id) {
                foundAt = i;
                break;
            }
        }
        if (foundAt > -1) {
            this.nodes[foundAt].data.iri = node.data.iri;
            this.nodes[foundAt].data.id = node.data.id;
            this.nodes[foundAt].data.pid = node.data.pid;
            this.nodes[foundAt].data.value = node.data.value;
            this.nodes[foundAt].data.flagged = node.dataflagged;
            this.nodes[foundAt].data.annotation = node.data.annotation;
        } else {
            this.nodes.push(node);
        }
    };

    this.addEdge = function (edge) {
        var foundAt = -1;
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].id === edge.data.id) {
                foundAt = i;
                break;
            }
        }
        if (foundAt > -1) {
            this.edges[foundAt].label += ";" + edge.data.label;
        } else {
            this.edges.push(edge);
        }
    };
}


function Node(group, nodeData) {
    this.group = group;
    this.data = nodeData;
}

function ConceptTypeStyle(conceptType, conceptBorderColor, conceptSize,
        conceptTextBGopacity, conceptDisplay, conceptColor, conceptBorderStyle,
        conceptBorderWidth, conceptShape, conceptTextBGcolor) {
    this.conceptType = conceptType;
    this.conceptBorderColor = conceptBorderColor;
    this.conceptSize = conceptSize;
    this.conceptTextBGopacity = conceptTextBGopacity;
    this.conceptDisplay = conceptDisplay;
    this.conceptColor = conceptColor;
    this.conceptBorderStyle = conceptBorderStyle;
    this.conceptBorderWidth = conceptBorderWidth;
    this.conceptShape = conceptShape;
    this.conceptTextBGcolor = conceptTextBGcolor;
}

function NodeData(concept, flagged, conceptTypeStyle) {
    this.iri = concept.iri;
    this.id = concept.id;
    this.pid = concept.pid;
    this.value = concept.value;
    this.flagged = flagged;
    this.annotation = concept.annotation;
    this.displayValue = concept.value;
    this.conceptBorderColor = conceptTypeStyle.conceptBorderColor;
    this.conceptType = conceptTypeStyle.conceptType.getName();
    this.conceptSize = conceptTypeStyle.conceptSize;
    this.conceptTextBGopacity = conceptTypeStyle.conceptTextBGopacity;
    this.conceptDisplay = conceptTypeStyle.conceptDisplay;
    this.conceptColor = conceptTypeStyle.conceptColor;
    this.conceptBorderStyle = conceptTypeStyle.conceptBorderStyle;
    this.conceptBorderWidth = conceptTypeStyle.conceptBorderWidth;
    this.conceptShape = conceptTypeStyle.conceptShape;
    this.conceptTextBGcolor = conceptTypeStyle.conceptTextBGcolor;
}

//function NodeData(Concept) // ??? separate style that identifies types of concepts

function Edge(group, edgeData) {
    this.group = group;
    this.data = edgeData;
}

function EdgeData(sourceNode, targetNode, relationDisplay, relation, relationTypeStyle) {
    this.id = relation.getId();
    this.relationDisplay = relationDisplay;
    this.source = sourceNode;
    this.target = targetNode;
    this.label = relation.getOfType();
    this.relationColor = relationTypeStyle.getColor();
    this.relationSize = relationTypeStyle.getSize();
}

//function EdgeData(Concept) // ??? separate style that identifies relations

// type of concepts in AgroLD

/*
 * var CONCEPT_TYPES = ["Gene", "Protein", "QTL", "Chromosome", "Metabolic_Pathway", "Reaction", "Gene", "CDS", "Exon", "five_prime_UTR", "mRNA", "three_prime_UTR"]
 * http://www.southgreen.fr/agrold/resource/Gene
 * http://www.southgreen.fr/agrold/vocabulary/Gene
 * http://www.southgreen.fr/agrold/vocabulary/Protein	
 * http://www.southgreen.fr/agrold/resource/QTL
 * http://www.southgreen.fr/agrold/resource/Chromosome
 * http://www.southgreen.fr/agrold/vocabulary/Chromosome
 * http://www.southgreen.fr/agrold/vocabulary/Metabolic_Pathway
 * http://www.southgreen.fr/agrold/vocabulary/Reaction
 * http://www.southgreen.fr/agrold/vocabulary/CDS
 * http://www.southgreen.fr/agrold/vocabulary/Exon
 * http://www.southgreen.fr/agrold/vocabulary/five_prime_UTR
 * http://www.southgreen.fr/agrold/vocabulary/mRNA
 * http://www.southgreen.fr/agrold/vocabulary/three_prime_UTR
 * http://www.southgreen.fr/agrold/vocabulary/Taxon
 */
/////////////////////// Interaction with the knowledge base (webservice)

function KnetmapsAdaptator() {
    this.DEFAULT_RELATION_SIZE = "1px";
    this.nbMaxDeLiens = 1000;
    this.describeBaseURL = WEBAPPURL + "/api/describe4visualization.json?pageSize="+this.nbMaxDeLiens+"&uri=";
    this._graphJSON = new Graph();
    this._allGraphData = new GraphData("FilteredGraphUnconnected", "1.0");
    this.nextId = 0;
    this.entitiesUnprocessedLinks = {};
    this.mapConceptURI2Id = {};
    this.mapConceptURI2Concept = {};
    this.mapRelationId2Relation = {};
    this.completeConceptURIs = {};

    this._conceptStyles = {
        "Gene": {
            "conceptBorderColor": "black",
            "conceptSize": "22px",
            "conceptTextBGopacity": "0",
            "conceptDisplay": "element",
            "conceptColor": "lightBlue",
            "conceptBorderStyle": "solid",
            "conceptBorderWidth": "1px",
            "conceptShape": "triangle",
            "conceptTextBGcolor": "black"
        },
        "Protein": {           
            "conceptBorderColor": "black",
            "conceptSize": "18px",
            "conceptTextBGopacity": "0",
            "conceptDisplay": "element",
            "conceptColor": "red",
            "conceptBorderStyle": "solid",
            "conceptBorderWidth": "1px",
            "conceptShape": "ellipse",
            "conceptTextBGcolor": "black"
        },
        "QTL": {
            "conceptBorderColor": "black",
            "conceptSize": "18px",
            "conceptTextBGopacity": "0",
            "conceptDisplay": "element",
            "conceptColor": "red",
            "conceptBorderStyle": "solid",
            "conceptBorderWidth": "1px",
            "conceptShape": "triangle",
            "conceptTextBGcolor": "black"
        },
        "Chromosome": {
            "conceptBorderColor": "black",
            "conceptSize": "18px",
            "conceptTextBGopacity": "0",
            "conceptDisplay": "element",
            "conceptColor": "gray",
            "conceptBorderStyle": "solid",
            "conceptBorderWidth": "1px",
            "conceptShape": "ellipse",
            "conceptTextBGcolor": "black"
        },
        "Pathway": {
            "conceptBorderColor": "black",
            "conceptSize": "18px",
            "conceptTextBGopacity": "0",
            "conceptDisplay": "element",
            "conceptColor": "#06FB80",
            "conceptBorderStyle": "solid",
            "conceptBorderWidth": "1px",
            "conceptShape": "star",
            "conceptTextBGcolor": "black"
        },
        "Reaction": {
            "conceptBorderColor": "black",
            "conceptSize": "18px",
            "conceptTextBGopacity": "0",
            "conceptDisplay": "element",
            "conceptColor": "#ACFE37",
            "conceptBorderStyle": "solid",
            "conceptBorderWidth": "1px",
            "conceptShape": "star",
            "conceptTextBGcolor": "black"
        },
        "CDS": {
            "conceptBorderColor": "black",
            "conceptSize": "18px",
            "conceptTextBGopacity": "0",
            "conceptDisplay": "element",
            "conceptColor": "green",
            "conceptBorderStyle": "solid",
            "conceptBorderWidth": "1px",
            "conceptShape": "ellipse",
            "conceptTextBGcolor": "black"
        },
        "Exon": {
            "conceptBorderColor": "black",
            "conceptSize": "18px",
            "conceptTextBGopacity": "0",
            "conceptDisplay": "element",
            "conceptColor": "blue",
            "conceptBorderStyle": "solid",
            "conceptBorderWidth": "1px",
            "conceptShape": "rectangle",
            "conceptTextBGcolor": "black"
        },
        "five_prime_UTR": {
            "conceptBorderColor": "black",
            "conceptSize": "18px",
            "conceptTextBGopacity": "0",
            "conceptDisplay": "element",
            "conceptColor": "violet",
            "conceptBorderStyle": "solid",
            "conceptBorderWidth": "1px",
            "conceptShape": "vee",
            "conceptTextBGcolor": "black"
        },
        "mRNA": {
            "conceptBorderColor": "black",
            "conceptSize": "18px",
            "conceptTextBGopacity": "0",
            "conceptDisplay": "element",
            "conceptColor": "violet",
            "conceptBorderStyle": "solid",
            "conceptBorderWidth": "1px",
            "conceptShape": "rectangle",
            "conceptTextBGcolor": "black"
        },
        "three_prime_UTR": {
            "conceptBorderColor": "black",
            "conceptSize": "18px",
            "conceptTextBGopacity": "0",
            "conceptDisplay": "element",
            "conceptColor": "red",
            "conceptBorderStyle": "solid",
            "conceptBorderWidth": "1px",
            "conceptShape": "vee",
            "conceptTextBGcolor": "black"
        },
        "Taxon": {
            "conceptBorderColor": "black",
            "conceptSize": "18px",
            "conceptTextBGopacity": "0",
            "conceptDisplay": "element",
            "conceptColor": "green",
            "conceptBorderStyle": "solid",
            "conceptBorderWidth": "1px",
            "conceptShape": "vee",
            "conceptTextBGcolor": "black"
        }
    };

    this.RELATION_TYPES = {}; //label:->{label, sourceConceptType, targetConceptType}

    this.CONCEPT_TYPES = {"Gene": "", "Protein": "", "QTL": "", "Chromosome": "", "Pathway": "", "Reaction": "", "CDS": "", "Exon": "", "five_prime_UTR": "", "mRNA": "", "three_prime_UTR": "", "Taxon": ""};
    for (var type in this._conceptStyles) {
        this.CONCEPT_TYPES[type] = new ConceptType(type);
    }

    this.KNETMAPS_STYLES = {conceptStyle: {}, relationStyle: {}};
    // graph is a sample    
    for (var type in this._conceptStyles) {
        var n = this._conceptStyles[type];
        //if (n.conceptType in this.CONCEPT_TYPES) 
        {
            this.KNETMAPS_STYLES.conceptStyle[type] = new ConceptTypeStyle(this.CONCEPT_TYPES[type],
                    n.conceptBorderColor, n.conceptSize, n.conceptTextBGopacity, n.conceptDisplay, n.conceptColor,
                    n.conceptBorderStyle, n.conceptBorderWidth, n.conceptShape, n.conceptTextBGcolor);
        }
    }

    this.addConceptAndNode = function (concept, conceptURI) {
        if (conceptURI in this.completeConceptURIs) {
            return;
        }
        if (conceptURI in this.mapConceptURI2Id) {
            concept.id = this.mapConceptURI2Id[conceptURI];
        } else {
            this.mapConceptURI2Id[conceptURI] = concept.id;
        }
        // TO DO: Ajouter de nouveau ssi absent
        this._allGraphData.addConcept(concept);
        this.mapConceptURI2Concept[conceptURI] = concept;
        // concept, flagged, displayValue, conceptTypeStyle
        var nodeData = new NodeData(concept, "true", this.KNETMAPS_STYLES.conceptStyle[concept.ofType]);
        var node = new Node("nodes", nodeData); // entity node
        this._graphJSON.addNode(node);
    };

    //console.log("this.KNETMAPS_STYLES: " + JSON.stringify(this.KNETMAPS_STYLES));

    this.generateConceptId = function () {
        this.nextId++;
        return this.nextId.toString(); // les id doivent être des chaines de caractères, sinon Knetmaps n'affichent pas les infos
    };

    this.extractConceptTypeName = function (typeURI) {
        var conceptTypeName = getIRILocalname(typeURI);
        if (conceptTypeName === "Metabolic_Pathway") {
            conceptTypeName = "Pathway";
        }
        return conceptTypeName;
    };

    this.processDescribe = function (conceptURI, entityData) {
        console.log("entityData: " + JSON.stringify(entityData));
        this.entitiesUnprocessedLinks[conceptURI] = [];
        var id, annotation = "", elementOf = new Set(), description = "", pid = "",
                //value = getPrefixedFormOfURI(conceptURI),
                value = getIRIFullLocalname(conceptURI),
                conceptType, conames = [], coaccessions = [], attributes = [];
        attributes.push(new Attribute("visible", "true"));
        attributes.push(new Attribute("flagged", "true"));

        conames.push(new Coname(value, "false"));

        if (this.mapConceptURI2Id[conceptURI] === undefined) {
            id = this.generateConceptId();
            this.mapConceptURI2Id[conceptURI] = id;
        } else {
            id = this.mapConceptURI2Id[conceptURI];
        }
        attributes.push(new Attribute("IRI", conceptURI));
        for (var i = 0; i < entityData.length; i++) {
            var _graph = getIRILocalname(entityData[i].graph);
            var _property = entityData[i].property;
            var _hasValue = entityData[i].hasValue;
            var _isValueOf = entityData[i].isValueOf;
            var _type = this.extractConceptTypeName(entityData[i].type);
            
            var relationName = getIRILocalname(_property);
            switch (relationName) {
                case "type":
                    if (conceptType === undefined)
                        conceptType = this.CONCEPT_TYPES[this.extractConceptTypeName(_hasValue)];
                    break;
                case "label":
                    value = _hasValue;
                    conames.push(new Coname(_hasValue, "false"));
                    break;
                case "has_synonym":
                    //attributes.push(new Attribute(getPrefixedFormOfURI(_property), getPrefixedFormOfURI(_hasValue)));
                    conames.push(new Coname(_hasValue, "false"));
                    break;
                case "description":
                    description = _hasValue;
                case "comment":
                    annotation += _hasValue + " ";
                case "seeAlso":
                case "has_dbsref":
                    coaccessions.push(new Coaccession(_graph, _hasValue === "" ? _isValueOf : _hasValue));
                default:
                    if (_type !== null && _type !== undefined && _type !== "") {
                        if (_type in this.KNETMAPS_STYLES.conceptStyle) {
                            var linkToAnotherConcept = {};
                            linkToAnotherConcept.property = _property;
                            linkToAnotherConcept.hasValue = _hasValue;
                            linkToAnotherConcept.isValueOf = _isValueOf;
                            linkToAnotherConcept.type = _type;
                            this.entitiesUnprocessedLinks[conceptURI].push(linkToAnotherConcept);
                            // add the new concept
                            var oURI = _hasValue === "" ? _isValueOf : _hasValue;
                            var oid = this.generateConceptId();
                            var ovalue = getIRIFullLocalname(oURI);
                            var oc = new Concept(oURI, oid.toString(), "", _graph, "", "", ovalue, this.CONCEPT_TYPES[_type]);
                            oc.addEvidence("Imported from AgroLD");
                            this.addConceptAndNode(oc, oURI);
                        }
                    }
                    if (_isValueOf === "") {
                        attributes.push(new Attribute(getPrefixedFormOfURI(_property), getPrefixedFormOfURI(_hasValue)));
                    } else {
                        //attributes.push(new Attribute(getPrefixedFormOfURI(_property), getPrefixedFormOfURI(_isValueOf)));
                    }
            }
            elementOf.add(_graph);
        }
        elementOf = Array.from(elementOf).join('; ');

        if (conceptType === undefined) {
            if (getIRILocalname(conceptURI).toLowerCase().includes("taxon")) {
                conceptType = this.CONCEPT_TYPES["Taxon"];
            }
        }

        var c = new Concept(conceptURI, id.toString(), annotation, elementOf, description, pid, value, conceptType); // entityConcept
        c.addEvidence("Imported from AgroLD");

        for (var j = 0; j < conames.length; j++) {
            c.addConame(conames[j]);
        }
        for (var j = 0; j < coaccessions.length; j++) {
            c.addCoaccession(coaccessions[j]);
        }
        for (var j = 0; j < attributes.length; j++) {
            c.addAttribute(attributes[j]);
        }
        this.addConceptAndNode(c, conceptURI);

        // add relations
        for (var j = 0; j < this.entitiesUnprocessedLinks[conceptURI].length; j++) {
            this.processLink(conceptURI, this.entitiesUnprocessedLinks[conceptURI][j]);
        }

        this.completeConceptURIs[conceptURI] = true;
    };

//    this.fetchConceptDescription = function (conceptURI) {
//        var tthis = this;
//        return $.getJSON(tthis.describeBaseURL + conceptURI, function (conceptData) {
//            tthis.processDescribe(conceptURI, conceptData);
//        });
//    };

    this.fetchConceptDescription = function (conceptURI) {
        var tthis = this;
        //console.log(encodeURIComponent(conceptURI));
        return $.getJSON(tthis.describeBaseURL + encodeURIComponent(conceptURI), function (conceptData) {
            tthis.processDescribe(conceptURI, conceptData);
        });
    };

    this.processLink = function (conceptURI, link) {
        var sourceURI, targetURI;
        var linkURI = link.hasValue === "" ? link.isValueOf : link.hasValue;
        if (link.hasValue === "") {
            sourceURI = linkURI;
            targetURI = conceptURI;
        } else {
            sourceURI = conceptURI;
            targetURI = linkURI;
        }
        // add relation                            
        var rName = getIRILocalname(link.property),
                toConcept = this.mapConceptURI2Concept[targetURI],
                fromConcept = this.mapConceptURI2Concept[sourceURI],
                ofType = rName, context = "",
                rId = this.mapConceptURI2Concept[sourceURI].id + "-" + this.mapConceptURI2Concept[targetURI].id;
        //+ '-' + rName;

        if (rId in this.mapRelationId2Relation) {
            return;
        }

        var r = new Relation(rId, toConcept, fromConcept, ofType, context);
        r.addEvidence("Imported from AgroLD");

        this.mapRelationId2Relation[rId] = r;

        this._allGraphData.addRelation(r);
        // add relation type 
        var sourceType = this.mapConceptURI2Concept[sourceURI].ofType;
        var targetType = this.mapConceptURI2Concept[targetURI].ofType;
        var relationTypeId = sourceType + "-" + rName + "-" + targetType; // concat sourceTyep+relation+targetType
        if (!(relationTypeId in this.RELATION_TYPES)) {
            this.RELATION_TYPES[relationTypeId] = new RelationType(rName, sourceType, targetType);
            // on donne à l'arrête la couleur de la source, et la même taille
            this.KNETMAPS_STYLES.relationStyle[relationTypeId] = new RelationTypeStyle(rName,
                    this.KNETMAPS_STYLES.conceptStyle[sourceType].conceptColor, this.DEFAULT_RELATION_SIZE);
        }
        // add edge
        var sourceNode = fromConcept.getId(), targetNode = toConcept.getId(),
                relationDisplay = "element";
        var eData = new EdgeData(sourceNode, targetNode, relationDisplay, r, this.KNETMAPS_STYLES.relationStyle[relationTypeId]),
                e = new Edge("edges", eData);
        this._graphJSON.addEdge(e);

    };

    this.updateNetwork = function (divTarget) {
        graphJSON = JSON.parse(JSON.stringify(this._graphJSON)); // since KnetMaps.js understand only the JSON format, it necessary to convert the objet into JSON
        allGraphData = {"ondexmetadata": JSON.parse(JSON.stringify(this._allGraphData))};
        console.log("allGraphData: " + JSON.stringify(allGraphData));
        console.log("graphJSON: " + JSON.stringify(graphJSON));

        KNETMAPS.KnetMaps().draw(divTarget);
        //document.getElementById("changeLabelFont").options[0].selected = true;
        //document.getElementById("changeLabelVisibility").options[3].selected = true;
    };
}


var KNETMAPS_ADAPTATOR = new KnetmapsAdaptator();
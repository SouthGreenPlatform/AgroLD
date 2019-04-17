/* 
 * knetmaps_adaptator.js
 * This script solves two limits of knetmaps
 */

function Jsonifiable(){
    this.toJson = JSON.stringify(this);
}

function Dataset(_name, _summary, _allGraphData, _graph) {    
    this.name = _name;
    this.summary = _summary;
    this.allGraphData = _allGraphData;
    this.graph = _graph;
}

function GraphData(_graphName, _version) {
    Jsonifiable.call(this);
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
    
    this.addConcept = function(concept){
        this.concepts.push(concept);
    };
    
    this.addRelation = function(relation){
        this.relations.push(relation);
    };
}


function Concept(id, annotation, elementOf, description, pid, value, ofType, evidences, context) {
    this.id = id;
    this.annotation = annotation;
    this.elementOf = elementOf;
    this.description = description;
    this.pid = pid;
    this.value = value;
    this.ofType = ofType;
    this.evidences = evidences;
    this.context = context;
    this.conames = [];
    this.attributes = [];
    this.coaccessions = [];
    
    this.getId = function(){
        return this.id;
    };
    
    this.addConame = function(coname){
        this.conames.push(coname);
    };
    
    this.addAttribute = function(attribute){
        this.attributes.push(attribute);
    };
    
    this.addCoaccession = function(coaccession){
        this.coaccessions.push(coaccession);
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

function Relation(id, toConcept, fromConcept, ofType, evidences, context) {
    this.id = id;
    this.toConcept = toConcept.getId();
    this.fromConcept = fromConcept.getId();
    this.ofType = ofType;
    this.evidences = evidences;
    this.context = context;
    this.attributes = [];
    
    this.addAttribute = function(attribute){
        this.attributes.push(attribute);
    };
}

function Graph(){
    this.nodes = [];
    this.edges = [];
    
    this.addNode = function(node){
        this.nodes.push(node);
    };
    
    this.addEdge = function(edge){
        this.edges.push(edge);
    };
}


function Node(group, nodeData){
    this.group = group;
    this.data = nodeData;
}

//function NodeData(Concept) // ??? separate style that identifies types of concepts

function Edge(group, edgeData){
    this.group = group;
    this.data = edgeData;
}

//function EdgeData(Concept) // ??? separate style that identifies relations
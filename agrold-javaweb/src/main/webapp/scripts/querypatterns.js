/* 
 * SPARQL QUERY PATTERNS
 */
var qpatterns = new Array();
var selectedPatternIdx = 0;
var patternlabels = ['Retrieve list of graphs', 'Search terms by label', 'List relation types in a given graph',
    'Retrieve the local neighbourhood of Oryza sativa japonica protein: <b>IAA16</b> - Auxin-responsive protein IAA16 (UniProt access:P0C127)',
    'Identify Wheat proteins that are involved in root development.',
    'Retrieve genes that participate in a given pathway: <b>Galactosyl Transferase</b>', 'Retrieve Proteins associated with a given QTL: <b>DTHD</b> (days to heading)',
    'Get the ID corresponding to the ontology term "<b>homoaconitate hydratase activity</b>"', 'Get the name of the ontological element that has the ID "<b>GO:0003824</b>"',
    'Get protein ids associated with the ontological id <b>GO:0003824</b>', 'Get QTL ids associated with the ontological id <b>EO:0007403</b>',
    'Describe <b>uniprot:P0C127</b>',
    'Retrieve <b>Oryza sativa japonica genes</b> on <b>chromosome 1</b> whose <b>start position</b> is between <b>1000 and 30000</b>'];
qpatterns['PREFIX obo:<http://purl.obolibrary.org/obo/>\n' +
        'PREFIX vocab:<vocabulary/>\n\n' +
        'SELECT distinct ?graph\n' +
        'WHERE {\n' +
        ' GRAPH ?graph {\n' +
        '   ?subject ?predicate ?object.\n' +
        ' }\n filter(REGEX(?graph, "^http://www.southgreen.fr/agrold/"))\n' +
        '}'] = [];
qpatterns['PREFIX vocab:<vocabulary/>\n\n' +
        'SELECT DISTINCT ?term_id ?term_name ?graph\n' +
        'WHERE { \n' +
        ' GRAPH ?graph { \n' +
        '  ?term_id rdfs:label ?term_name . \n' +
        " FILTER regex(str(?term_name), 'plant growth') \n" +
        ' } \n' +
        '}'] = ["plant growth"];
qpatterns['PREFIX graph:<gramene.genes>\n\n' +
        'SELECT distinct ?relation\n' +
        'WHERE { \n' +
        ' GRAPH graph: { \n' +
        '  ?subject ?relation ?object . \n' +
        ' } \n' +
        '} \nORDER BY ?relation'] = [];
qpatterns['PREFIX obo:<http://purl.obolibrary.org/obo/>\n\
PREFIX uniprot:<http://purl.uniprot.org/uniprot/>\n\
PREFIX vocab:<vocabulary/>\n\
\n\
SELECT distinct ?predicate ?object ?object_label ?graph\n\
WHERE {\n\
 GRAPH ?graph {\n\
  uniprot:P0C127 ?predicate ?object.\n\
 }\n\
 OPTIONAL {\n\
    ?object rdfs:label ?object_label.\n\
  }\n\
}'] = ["uniprot:P0C127"];
qpatterns['PREFIX obo:<http://purl.obolibrary.org/obo/>\n\
PREFIX taxon:<http://purl.obolibrary.org/obo/NCBITaxon_>\n\
PREFIX uniprot:<http://purl.uniprot.org/uniprot/>\n\
PREFIX vocab:<vocabulary/>\n\
PREFIX graph:<protein.annotations>\n\
\n\
SELECT distinct ?protein ?name ?evidence ?evidence_label ?evidence_code\n\
WHERE {\n\
 GRAPH graph: {\n\
    {\n\
     ?protein vocab:taxon taxon:4565.\n\
     ?protein rdfs:label ?name.\n\
      {     \n\
       ?protein ?p obo:GO_0048364.\n\
       ?protein vocab:has_annotation ?bp.\n\
       ?bp rdf:subject ?protein.\n\
       ?bp rdf:object obo:GO_0048364.\n\
       ?bp vocab:evidence_code ?evidence_code.\n\
       ?bp vocab:evidence ?evidence.       \n\
      } UNION {\n\
       ?protein ?p obo:GO_2000280.\n\
       ?bp rdf:subject ?protein.\n\
       ?protein vocab:has_annotation ?bp. \n\
       ?bp rdf:object obo:GO_2000280.\n\
       ?bp vocab:evidence_code ?evidence_code.\n\
       ?bp vocab:evidence ?evidence.\n\
      }\n\
    } UNION {\n\
     ?protein vocab:taxon taxon:4572.\n\
     ?protein rdfs:label ?name.\n\
      {     \n\
       ?protein ?p obo:GO_0048364.\n\
       ?protein vocab:has_annotation ?bp.\n\
       ?bp rdf:subject ?protein.\n\
       ?bp rdf:object obo:GO_0048364.\n\
       ?bp vocab:evidence_code ?evidence_code.\n\
       ?bp vocab:evidence ?evidence.       \n\
      } UNION {\n\
       ?protein ?p obo:GO_2000280.\n\
       ?protein vocab:has_annotation ?bp. \n\
       ?bp rdf:subject ?protein.\n\
       ?bp rdf:object obo:GO_2000280.\n\
       ?bp vocab:evidence_code ?evidence_code.\n\
       ?bp vocab:evidence ?evidence.               \n\
      }    \n\
    }\n\
 }\n\
    GRAPH ?g {\n\
    ?evidence rdfs:label ?evidence_label.\n\
\n\
    }\n\
}'] = [];
qpatterns["PREFIX obo:<http://purl.obolibrary.org/obo/>\n\
PREFIX uniprot:<http://purl.uniprot.org/uniprot/>\n\
PREFIX vocab:<vocabulary/>\n\
PREFIX graph:<gramene.cyc>\n\
PREFIX pathway:<biocyc.pathway/PWY-5338>\n\n\
SELECT DISTINCT ?gene ?name ?taxon_name\n\
WHERE {\n\
 GRAPH graph: {\n\
  ?gene vocab:is_agent_in pathway:. \n\
  ?gene rdfs:label ?name.\n\
  ?gene vocab:taxon ?taxon_name.\n\
 }\n\
}\n\
LIMIT 100"] = [];
qpatterns['PREFIX obo:<http://purl.obolibrary.org/obo/>\n\
PREFIX uniprot:<http://purl.uniprot.org/uniprot/>\n\
PREFIX vocab:<vocabulary/>\n\
PREFIX graph1:<protein.annotations>\n\
PREFIX graph2:<qtl.annotations>\n\
PREFIX qtl: <http://www.identifiers.org/gramene.qtl/AQAT004> # DTHD \n\n\
SELECT distinct ?id ?name \n\
WHERE {\n\
 GRAPH graph1: {\n\
  ?id vocab:has_trait ?to.\n\
  ?id rdfs:label ?name.\n\
 }\n\
 GRAPH graph2: {\n\
  qtl: vocab:has_trait ?to.\n\
 }\n\
}\nORDER BY ?name'] = [];
qpatterns['PREFIX owl: <http://www.w3.org/2002/07/owl#>\n\n\
SELECT ?id\n\
WHERE { \n\
 {\n\
  SELECT ?subject\n\
  WHERE\n\
  {\n\
   ?subject rdfs:label "homoaconitate hydratase activity"^^xsd:string .\n\
   ?subject a owl:Class .\n\
  }limit 1\n\
 }\n\
 BIND(REPLACE(str(?subject), \'^.*(#|/)\', "") AS ?localname)\n\
 BIND(REPLACE(?localname, "_", ":") as ?id).\n\
} '] = ["homoaconitate hydratase activity"];
qpatterns['PREFIX owl: <http://www.w3.org/2002/07/owl#>\n\n\
SELECT distinct ?OntoTerm\n\
WHERE { \n\
 {\n\
  SELECT ?subject\n\
  WHERE\n\
  {\n\
   ?subject rdfs:subClassOf ?o.\n\
   FILTER REGEX(STR(?subject), CONCAT(REPLACE("GO:0003824", ":", "_"), "$"))\n\
  }limit 1\n\
 }\n\
 ?subject rdfs:label ?OntoTerm .\n\
 ?subject a owl:Class .\n\
}  '] = ["GO:0003824"];
qpatterns['SELECT DISTINCT ?proteinId\n\
WHERE\n\
{\n\
  { \n\
    SELECT ?ontoElt\n\
    WHERE\n\
    {\n\
    	?ontoElt rdfs:subClassOf ?ontoEltClass.\n\
  		FILTER REGEX(STR(?ontoElt), CONCAT(REPLACE("GO:0003824", ":", "_"), "$"))\n\
    } limit 1\n\
  }\n\
  ?protein ?predicate ?ontoElt .\n\
  ?protein rdfs:subClassOf <http://purl.obolibrary.org/obo/SO_0000104> .\n\
  BIND(REPLACE(str(?protein), \'^.*(#|/)\', "") AS ?proteinId) .\n\
}\n\
ORDER BY ?protein\n\
LIMIT 5 # page size > 0\n\
OFFSET 0 # page number >= 0'] = ["GO:0003824"];
qpatterns['SELECT DISTINCT ?qtlId\n\
WHERE\n\
{\n\
  { \n\
    SELECT ?ontoElt\n\
    WHERE\n\
    {\n\
    	?ontoElt rdfs:subClassOf ?ontoEltClass.\n\
  		FILTER REGEX(STR(?ontoElt), CONCAT(REPLACE("EO:0007403", ":", "_"), "$"))\n\
    } limit 1\n\
  }\n\
  GRAPH <qtl.annotations>{\n\
    ?qtl ?predicate ?ontoElt .\n\
    ?qtl rdfs:subClassOf <http://purl.obolibrary.org/obo/SO_0000771> .\n\
    BIND(REPLACE(str(?qtl), \'^.*(#|/)\', "") AS ?qtlId) .\n\
  }\n\
}\n\
ORDER BY ?qtl\n\
LIMIT 5 # page size > 0\n\
OFFSET 0 # page number >= 0'] = ["EO:0007403"];

qpatterns['PREFIX uniprot:<http://purl.uniprot.org/uniprot/>\n\
SELECT ?property ?hasValue ?isValueOf\n\
WHERE {\n\
values (?q){(uniprot:P0C127)}\n\
  { ?q ?property ?hasValue }\n\
  UNION\n\
  { ?isValueOf ?property ?q }\n\
}'] = ["uniprot:P0C127"];


qpatterns['PREFIX vocab: <vocabulary/>\n\
PREFIX obo:<http://purl.obolibrary.org/obo/>\n\
PREFIX tax:<http://purl.obolibrary.org/obo/NCBITaxon_>  \n\
PREFIX chrom: <chromosome/>\n\
SELECT DISTINCT ?gene ?start_position \n\
WHERE{\n\
?gene rdf:type <http://www.southgreen.fr/agrold/resource/Gene>.\n\
?gene vocab:is_located_on chrom:1 .\n\
?gene vocab:taxon tax:39947 .\n\
?gene vocab:has_start_position ?start_position .\n\
bind(xsd:int(?start_position) as ?start)\n\
FILTER(?start >= 1000 && ?start <= 30000)\n\
}'] = ["39947","1", "1000", "30000"];


prefixes = "BASE <http://www.southgreen.fr/agrold/>\n" +
        'PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n' +
        'PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n';


function patternChange() {
    selectPattern(selectedPatternIdx);
}

function selectPattern(patternIdx) {
    selectedPatternIdx = patternIdx;
    //console.log("icizzz");
    var selectedpattern = Object.keys(qpatterns)[patternIdx];
    document.getElementById("query").value = prefixes + selectedpattern;
    yasqe.setValue(document.getElementById("query").value);
    //console.log(document.getElementById("query").value);

    document.getElementById("parameters").innerHTML = "";
    document.getElementById("parameters").innerHTML = "";
    if (qpatterns[selectedpattern].length > 0) {
        document.getElementById("parameters").innerHTML += "<b style=\"font-size: 15px\">Set values of parameters:</b> <button class=\"yasrbtn\" onclick=\"applyReplacements("+patternIdx+");\">APPLY</button><br>"
        for (i = 0; i < qpatterns[selectedpattern].length; i++) {
            document.getElementById("parameters").innerHTML += "Replace \"" + qpatterns[selectedpattern][i] + '" by : <input class="aparameter" value="' + qpatterns[selectedpattern][i] + '" /><br>';
        }
    } else {
        document.getElementById("parameters").innerHTML = "";
    }
}

function applyReplacements(patternIdx){	
    var paraInputs = document.getElementsByClassName("aparameter");
    console.log(patternIdx);
    var selectedpattern = Object.keys(qpatterns)[patternIdx];
    //var qtext = prefixes + selectedpattern;
    var qtext = selectedpattern;
    var oldValue = "";
    var oldValue = "";
    var q = "";
    var regex = "";
    console.log(selectedpattern);
    for (i = 0; i < paraInputs.length; i++) {
            console.log(paraInputs[i].value);		
            oldValue = new RegExp(qpatterns[selectedpattern][i], 'g');
            newValue = paraInputs[i].value;
            q = qtext.replace(oldValue, newValue);		
            qtext = q;
    }
    //document.getElementById("query").value =  qtext;
    document.getElementById("query").value = prefixes + qtext;
    yasqe.setValue(document.getElementById("query").value);
}

function resetForm() {
    //var x = document.getElementById("patterns").children[0];
    //x.setAttribute("selected", "selected");
    patternChange();
}
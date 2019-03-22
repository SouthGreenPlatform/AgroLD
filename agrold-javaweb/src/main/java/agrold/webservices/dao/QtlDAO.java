/*
 * Web services on QTLs
 */
package agrold.webservices.dao;

import java.io.IOException;

/**
 *
 * @author tagny
 */
public class QtlDAO {

    public static final String QTL_TYPE_URI2 = "http://purl.obolibrary.org/obo/SO_0000771";
    public static final String QTL_TYPE_URI = "http://www.southgreen.fr/agrold/resource/QTL";
    public static final String[] TYPEURIs = new String[]{QTL_TYPE_URI, QTL_TYPE_URI2};

    // return URIs and agrold_vocabulary:description of all genes in Agrold
    public static String getQtls(int page, int pageSize, String resultFormat) throws IOException {

        String sparqlQuery = "PREFIX agrold:<http://www.southgreen.fr/agrold/vocabulary/> \n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "SELECT distinct ?qtlId ?qtlName (group_concat(distinct ?d;separator=\"; \") as ?Description) (?qtl AS ?URI)\n"
                + "WHERE {\n"
                + "    OPTIONAL {?qtl rdfs:label ?qtlName .}\n"
                + "    OPTIONAL { ?qtl agrold:has_trait ?d} \n"
                + "    ?qtl rdf:type|rdfs:subClassOf ?type.\n"
                + "    FILTER(?type IN (<"+QTL_TYPE_URI+">,<"+QTL_TYPE_URI2+">))\n"
                + "    BIND(REPLACE(str(?qtl), '^.*(#|/)', \"\") AS ?qtlId) .\n"
                + "}\n"
                + "ORDER BY DESC(?URI)";
        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }
    
    public static String getQtlsByKeyword(String keyword, int page, int pageSize, String resultFormat) throws IOException {
        return Utils.getEntitiesByKeyWord(keyword, TYPEURIs, page, pageSize, resultFormat);
    }

    public static String getQtlIdAssociatedWithOntoId(String ontoId, int page, int pageSize, String resultFormat) throws IOException {
//        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
//                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
//                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
//                + "SELECT DISTINCT ?qtlId (REPLACE(str(?predicate), '^.*(#|/)', \"\") AS ?Association) (?qtl AS ?URI)\n"
//                + "WHERE\n"
//                + "{\n"
//                + "  { \n"
//                + "    SELECT ?ontoElt\n"
//                + "    WHERE\n"
//                + "    {\n"
//                + "    	?ontoElt rdfs:subClassOf ?ontoEltClass.\n"
//                + "  		FILTER REGEX(STR(?ontoElt), CONCAT(REPLACE(\""+ontoId+"\", \":\", \"_\"), \"$\"))\n"
//                + "    } limit 1\n"
//                + "  }\n"
//                + "  GRAPH <qtl.annotations>{\n"
//                + "    ?qtl ?predicate ?ontoElt .\n"
//                + "    {?qtl rdf:type <" + QTL_TYPE_URI + ">.}\n"
//                + "    UNION\n"
//                + "    {?qtl rdfs:subClassOf <" + QTL_TYPE_URI2 + ">.}\n"
//                + "    BIND(REPLACE(str(?qtl), '^.*(#|/)', \"\") AS ?qtlId) .\n"
//                + "  }\n"
//                + "}";
        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "SELECT DISTINCT ?qtlId (?qtl AS ?URI) ?qtlLabel (REPLACE(str(?predicate), '^.*(#|/)', \"\") AS ?Association) "
                + "?ontoElt ?ontoLabel\n"
                + "WHERE\n"
                + "{\n"
                + "  {\n"
                + "    ?qtl ?predicate ?ontoElt .\n"
                + "    ?ontoElt rdfs:subClassOf ?ontoEltClass.\n"
                + "    {?qtl rdf:type <http://www.southgreen.fr/agrold/resource/QTL>.}\n"
                + "    UNION\n"
                + "    {?qtl rdfs:subClassOf <http://purl.obolibrary.org/obo/SO_0000771>.}\n"
                + "    optional {?ontoElt rdfs:label ?ontoLabel}\n"
                + "    optional {?qtl rdfs:label ?qtlLabel}\n"
                + "    BIND(REPLACE(str(?qtl), '^.*(#|/)', \"\") AS ?qtlId) .\n"
                + "    FILTER REGEX(STR(?ontoElt), CONCAT(REPLACE(\"" + ontoId + "\", \":\", \"_\"), \"$\"))\n"
                + "    FILTER (?predicate != rdf:type && ?predicate != rdfs:subClassOf)\n"
                + "  }\n"
                + "}";
        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    public static String getQtlsAssociatedWithProteinId(String proteinId, int page, int pageSize, String resultFormat) throws IOException {
        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "PREFIX vocab:<vocabulary/>\n"
                + "PREFIX graph1:<protein.annotations>\n"
                + "PREFIX graph2:<qtl.annotations>\n"
                + "PREFIX protein: <http://purl.uniprot.org/uniprot/" + proteinId + ">\n"
                + "\n"
                + "SELECT distinct ?Id ?Name (?qtl AS ?URI) \n"
                + "WHERE {\n"
                + " GRAPH graph1: {\n"
                + "  protein: vocab:has_trait ?to.    \n"
                + " }\n"
                + " GRAPH graph2: {\n"
                + "  ?qtl vocab:has_trait ?to.\n"
                + "  ?qtl rdfs:label ?Name.\n"
                + "  BIND(REPLACE(str(?qtl), '^.*(#|/)', \"\") AS ?Id) .\n"
                + " }\n"
                + "}\n"
                + "ORDER BY ?Name";

        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    public static void main(String[] args) throws IOException {
        //System.out.println(getQtlsAssociatedWithProteinId("Q9LL45", 0, 5, Utils.TSV));
        System.out.println(getQtls(0, 10, Utils.TSV));
    }
}

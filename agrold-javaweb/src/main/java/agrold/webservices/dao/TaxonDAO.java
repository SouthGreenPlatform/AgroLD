/*
 * Web services on Taxons
 */
package agrold.webservices.dao;

import java.io.IOException;

/**
 *
 * @author romane
 */
public class TaxonDAO {

    public static final String TAXON_TYPE_URI2 = "http://purl.obolibrary.org/obo/NCBITaxon_species";
    public static final String TAXON_TYPE_URI = "http://www.southgreen.fr/agrold/resource/Taxon";
    public static final String[] TYPEURIs = new String[]{TAXON_TYPE_URI, TAXON_TYPE_URI2};

    // return URIs and agrold_vocabulary:description of all genes in Agrold
    public static String getTaxons(int page, int pageSize, String resultFormat) throws IOException {

        String sparqlQuery = "PREFIX agrold:<http://www.southgreen.fr/agrold/vocabulary/> \n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "SELECT distinct ?taxonId ?taxonName (group_concat(distinct ?d;separator=\"; \") as ?Description) (?taxon AS ?URI)\n"
                + "WHERE {\n"
                + "    OPTIONAL {?taxon rdfs:label ?taxonName .}\n"
                + "    OPTIONAL { ?taxon agrold:has_trait ?d} \n"
                + "    ?taxon rdf:type|rdfs:subClassOf ?type.\n"
                + "    FILTER(?type IN (<"+TAXON_TYPE_URI+">,<"+TAXON_TYPE_URI2+">))\n"
                + "    BIND(REPLACE(str(?taxon), '^.*(#|/)', \"\") AS ?taxonId) .\n"
                + "}\n"
                + "ORDER BY DESC(?URI)";
        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }
    
    public static String getTaxonsByKeyword(String keyword, int page, int pageSize, String resultFormat) throws IOException {
        return Utils.getEntitiesByKeyWord(keyword, TYPEURIs, page, pageSize, resultFormat);
    }

    public static String getTaxonIdAssociatedWithOntoId(String ontoId, int page, int pageSize, String resultFormat) throws IOException {
//        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
//                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
//                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
//                + "SELECT DISTINCT ?taxonId (REPLACE(str(?predicate), '^.*(#|/)', \"\") AS ?Association) (?taxon AS ?URI)\n"
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
//                + "  GRAPH <taxon.annotations>{\n"
//                + "    ?taxon ?predicate ?ontoElt .\n"
//                + "    {?taxon rdf:type <" + TAXON_TYPE_URI + ">.}\n"
//                + "    UNION\n"
//                + "    {?taxon rdfs:subClassOf <" + TAXON_TYPE_URI2 + ">.}\n"
//                + "    BIND(REPLACE(str(?taxon), '^.*(#|/)', \"\") AS ?taxonId) .\n"
//                + "  }\n"
//                + "}";
        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "SELECT DISTINCT ?taxonId (?taxon AS ?URI) ?taxonLabel (REPLACE(str(?predicate), '^.*(#|/)', \"\") AS ?Association) "
                + "?ontoElt ?ontoLabel\n"
                + "WHERE\n"
                + "{\n"
                + "  {\n"
                + "    ?taxon ?predicate ?ontoElt .\n"
                + "    ?ontoElt rdfs:subClassOf ?ontoEltClass.\n"
                + "    {?taxon rdf:type <http://www.southgreen.fr/agrold/resource/Taxon>.}\n"
                + "    UNION\n"
                + "    {?taxon rdfs:subClassOf <http://purl.obolibrary.org/obo/SO_0000771>.}\n"
                + "    optional {?ontoElt rdfs:label ?ontoLabel}\n"
                + "    optional {?taxon rdfs:label ?taxonLabel}\n"
                + "    BIND(REPLACE(str(?taxon), '^.*(#|/)', \"\") AS ?taxonId) .\n"
                + "    FILTER REGEX(STR(?ontoElt), CONCAT(REPLACE(\"" + ontoId + "\", \":\", \"_\"), \"$\"))\n"
                + "    FILTER (?predicate != rdf:type && ?predicate != rdfs:subClassOf)\n"
                + "  }\n"
                + "}";
        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    public static String getTaxonsAssociatedWithProteinId(String proteinId, int page, int pageSize, String resultFormat) throws IOException {
        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "PREFIX vocab:<vocabulary/>\n"
                + "PREFIX graph1:<protein.annotations>\n"
                + "PREFIX graph2:<taxon.annotations>\n"
                + "PREFIX protein: <http://purl.uniprot.org/uniprot/" + proteinId + ">\n"
                + "\n"
                + "SELECT distinct ?Id ?Name (?taxon AS ?URI) \n"
                + "WHERE {\n"
                + " GRAPH graph1: {\n"
                + "  protein: vocab:has_trait ?to.    \n"
                + " }\n"
                + " GRAPH graph2: {\n"
                + "  ?taxon vocab:has_trait ?to.\n"
                + "  ?taxon rdfs:label ?Name.\n"
                + "  BIND(REPLACE(str(?taxon), '^.*(#|/)', \"\") AS ?Id) .\n"
                + " }\n"
                + "}\n"
                + "ORDER BY ?Name";

        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    public static void main(String[] args) throws IOException {
        //System.out.println(getTaxonsAssociatedWithProteinId("Q9LL45", 0, 5, Utils.TSV));
        System.out.println(getTaxons(0, 10, Utils.TSV));
    }
}
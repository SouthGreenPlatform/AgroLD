/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package agrold.webservices.dao;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import org.json.JSONArray;

/**
 *
 * @author tagny
 */
public class ProteinDAO {

    static public final String PROTEIN_TYPE_URI = "http://purl.obolibrary.org/obo/SO_0000104";
    //static public final String PROTEIN_TYPE_URI = "http://www.southgreen.fr/agrold/resource/Protein";
    static public final String PROTEIN_TYPE_URI2 = "http://www.southgreen.fr/agrold/vocabulary/Protein";
    public static final String[] TYPEURIs = new String[]{PROTEIN_TYPE_URI, PROTEIN_TYPE_URI2};

    // return URIs and agrold_vocabulary:description of all genes in Agrold
    public static String getProteins(int page, int pageSize, String resultFormat) throws IOException {
        String sparqlQuery = "prefix	agrold:<http://www.southgreen.fr/agrold/vocabulary/> \n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "SELECT distinct ?id as ?proteinId ?n as ?proteinName group_concat(distinct ?d;separator=\"; \") as ?Description (?s AS ?URI)\n"
                + "WHERE {\n"
                + "  ?s rdf:type|rdfs:subClassOf ?type.\n"                
                + "  ?s rdfs:label ?n . \n"
                + "  FILTER(?type IN (<"+PROTEIN_TYPE_URI+">,<"+PROTEIN_TYPE_URI2+">))\n"
                + "  optional {?s  agrold:description ?d} "
                + "  BIND(REPLACE(str(?s), '^.*(#|/)', \"\") AS ?id)   \n"
                + "}";
        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }
    
    public static String getProteinsByKeyword(String keyword, int page, int pageSize, String resultFormat) throws IOException {
        return Utils.getEntitiesByKeyWord(keyword, TYPEURIs, page, pageSize, resultFormat);
    }

    public static String getProteinsIdAssociatedWithOntoId(String ontoId, int page, int pageSize, String resultFormat) throws IOException {
        String sparqlQuery = " BASE <http://www.southgreen.fr/agrold/> \n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + " PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "SELECT DISTINCT ?proteinId (REPLACE(str(?predicate), '^.*(#|/)', \"\") AS ?Association) (?protein AS ?URI) \n"
                + " WHERE \n"
                + "{ \n"
                + "    {  \n"
                + "SELECT ?ontoElt \n"
                + " WHERE \n"
                + " { \n"
                + "    ?ontoElt rdfs:subClassOf ?ontoEltClass. \n"
                + "     FILTER REGEX(STR(?ontoElt), CONCAT(REPLACE(\"" + ontoId + "\", \":\", \"_\"), \"$\")) \n"
                + "   } limit 1 \n"
                + " }  \n"
                + " ?protein ?predicate ?ontoElt . \n"
                + " ?protein rdf:type <http://www.southgreen.fr/agrold/resource/Protein> . \n"
                + " BIND(REPLACE(str(?protein), '^.*(#|/)', \"\") AS ?proteinId) . \n"
                + " }";

        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    public static String getProteinsAssociatedWithQTL(String qtlId, int page, int pageSize, String resultFormat) throws IOException {
        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "PREFIX vocab:<vocabulary/>\n"
                + "PREFIX graph1:<protein.annotations>\n"
                + "PREFIX graph2:<qtl.annotations>\n"
                + "PREFIX qtl: <http://www.identifiers.org/gramene.qtl/" + qtlId + "> # DTHD \n"
                + "\n"
                + "SELECT distinct ?Id ?Name (?protein AS ?URI) \n"
                + "WHERE {\n"
                + " GRAPH graph1: {\n"
                + "  ?protein vocab:has_trait ?to.\n"
                + "  ?protein rdfs:label ?Name.\n"
                + "    BIND(REPLACE(str(?protein), '^.*(#|/)', \"\") AS ?Id) .\n"
                + " }\n"
                + " GRAPH graph2: {\n"
                + "  qtl: vocab:has_trait ?to.\n"
                + " }\n"
                + "}\n"
                + "ORDER BY ?Name";

        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    public static String getProteinsEncodedByGene(String geneId, int page, int pageSize, String resultFormat) throws IOException {
        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX vocab: <vocabulary/>\n"
                + "PREFIX gene: <http://identifiers.org/ensembl.plant/" + geneId + ">\n"
                + "SELECT DISTINCT ?Id ?Name group_concat(distinct ?d;separator=\"; \") as ?Description (?protein AS ?URI)\n"
                + "WHERE{\n"
                + "  gene: vocab:encodes ?protein.\n"
                + "  ?protein rdfs:label ?Name.\n"
                + "  OPTIONAL {?protein vocab:description ?d}\n"
                + "  BIND(REPLACE(str(?protein), '^.*(#|/)', \"\") AS ?Id) .\n"
                + "}";

        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    public static Set<String> getProteinLabels(String id) throws IOException {
        String sparqlQuery = "prefix	agrold:<http://www.southgreen.fr/agrold/vocabulary/> \n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "SELECT distinct ?label\n"
                + "WHERE {\n"
                + "    ?protein rdfs:label ?label.\n"
                + "    ?protein rdfs:subClassOf <" + PROTEIN_TYPE_URI + "> .\n"
                + "    BIND(REPLACE(str(?protein), '^.*(#|/)', \"\") AS ?id) .\n"
                + "    FILTER REGEX(STR(?id), CONCAT(\"" + id + "\"))\n"
                + "}";

        String labelsStr = Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, ".csv");
        Set<String> labels = new HashSet<>();
        String[] lines = labelsStr.split("\n");
        for (int i = 1; i < lines.length; i++) {
            labels.add(lines[i].replaceAll("[\"]", ""));
        }
        //System.out.println(labelsStr);
        if (!labels.isEmpty()) {
            labels.add(id);
        }
        return labels;
    }

    public static String getPublicationsOfProteinById(String id) throws IOException {
        JSONArray resultJsonArray = new JSONArray();
        // fetch the gene's labels
        for (String label : getProteinLabels(id)) {
            JSONArray pubs = ExternalServices.getPublicationsFromEBIEuropePMCByLabel(label);
            for (int i = 0; i < pubs.length(); i++) {
                resultJsonArray.put(pubs.getJSONObject(i));
            }
        }
        return Utils.sortJSONArray(resultJsonArray, "pubYear", false).toString();
    }

    public static void main(String[] args) throws IOException {
        //System.out.println(getProteinsIdAssociatedWithOntoId("GO:0003824", 1, 5, Utils.TSV));
        System.out.println(getPublicationsOfProteinById("AT3G13445.2"));
        //System.out.println(getProteinsEncodedByGene("BGIOSGA000339", 0, 1, ".html"));
    }
}

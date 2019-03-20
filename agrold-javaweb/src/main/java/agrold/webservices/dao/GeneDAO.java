/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package agrold.webservices.dao;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

/**
 *
 * @author tagny
 */
public class GeneDAO {

    public static String GENE_TYPE_URI = "http://www.southgreen.fr/agrold/resource/Gene";
    public static String GENE_TYPE_URI2 = "http://www.southgreen.fr/agrold/vocabulary/Gene";

    // return URIs and agrold_vocabulary:description of all genes in Agrold
    public static String getGenes(int page, int pageSize, String resultFormat) throws IOException {
        //return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" + "<genes> Hello Jersey" + "</genes>";
        String genes = "";
        String sparqlQuery = "prefix	agrold:<http://www.southgreen.fr/agrold/vocabulary/> \n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "SELECT distinct ?gene ?geneId ?geneName ?geneDescription\n"
                + "WHERE {\n"
                + "  ?gene rdfs:label ?geneName.\n"
                + "  ?gene agrold:description ?geneDescription.          \n"
                + "  ?gene rdf:type|rdfs:subClassOf ?type.\n"
                + "  FILTER(?type IN (<" + GENE_TYPE_URI + ">,<" + GENE_TYPE_URI2 + ">))\n"
                + "  BIND(REPLACE(str(?gene), '^.*(#|/)', \"\") AS ?geneId) .\n"
                + "}";
        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);
        //
        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    public static String getGenesByKeyword(String keyword, int page, int pageSize, String resultFormat) throws IOException {
        return Utils.getEntitiesByKeyWord(keyword, new String[]{GeneDAO.GENE_TYPE_URI, GeneDAO.GENE_TYPE_URI2}, page, pageSize, resultFormat);
    }

    // return genes participating in a pathway given its local name (Id)
    public static String getGenesByPathwaysID(String pathwayId, int page, int pageSize, String resultFormat) throws IOException {
        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "PREFIX vocab:<vocabulary/>\n"
                + "PREFIX graph:<gramene.cyc>\n"
                + "PREFIX taxonGraph:<ncbitaxon>\n"
                + "PREFIX pathway:<biocyc.pathway/" + pathwayId + ">\n"
                + "SELECT DISTINCT ?geneId ?gene_name ?taxon (str(?taxon_name) AS ?taxon_name) (?gene AS ?URI)\n"
                + "WHERE {\n"
                + "  GRAPH graph: {\n"
                + "    ?gene vocab:is_agent_in pathway:.\n"
                + "    ?gene rdfs:label ?gene_name.\n"
                + "    ?gene vocab:taxon ?taxon.\n"
                + "    BIND(REPLACE(str(?gene), '^.*(#|/)', \"\") AS ?geneId) .\n"
                + "  }\n"
                + "  GRAPH taxonGraph:{\n"
                + "    ?taxon rdfs:label ?taxon_name.\n"
                + "  }\n"
                + "}";
        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    // TO DO Methode ne marche pas "probleme"
    public static String getGenesEncodingProtein(String proteinId, int page, int pageSize, String resultFormat) throws IOException {
        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX vocab: <vocabulary/>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "PREFIX protein: <http://purl.uniprot.org/uniprot/" + proteinId + ">\n"
                + "SELECT DISTINCT ?Id group_concat(distinct ?Name;separator=\"; \") as ?Names group_concat(distinct ?d;separator=\"; \") as ?Description (?gene AS ?URI)\n"
                + "WHERE{\n"
                + "  ?gene vocab:encodes protein:.\n"
                + "  OPTIONAL{?gene rdfs:label ?Name.}\n"
                + "  OPTIONAL{?gene vocab:description ?d}\n"
                + "  BIND(REPLACE(str(?gene), '^.*(#|/)', \"\") AS ?Id) .\n"
                + "}";

        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    public static String getCDSGene(int page, int pageSize, String resultFormat) throws IOException {
        //return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" + "<genes> Hello Jersey" + "</genes>";

        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "PREFIX obo:<http://purl.obolibrary.org/obo/>\n"
                + "PREFIX uniprot:<http://purl.uniprot.org/uniprot/>\n"
                + "PREFIX vocab:<vocabulary/>\n"
                + "PREFIX graph:<protein.annotations>\n"
                + "PREFIX id:<http://identifiers.org/ensembl.plant/BGIOSGA000040>\n"
                + "PREFIX agrold_schema:<http://www.southgreen.fr/agrold/resource/>\n"
                + "SELECT COUNT distinct  ?cds #?st ?end ?chrm \n"
                + "WHERE {\n"
                + "GRAPH ?g {\n"
                + "#id: rdfs:subClassOf obo:SO_0000704 .\n"
                + "#?mrna rdfs:subClassOf obo:SO_0000234 .\n"
                + "?mrna  rdf:type  agrold_schema:mRNA .\n"
                + "?mrna ?p id: .\n"
                + "?cds ?p2 ?mrna.\n"
                + "?cds  rdf:type  agrold_schema:CDS .\n"
                + "?cds vocab:has_start_position ?st .\n"
                + "?cds vocab:has_end_position ?end .\n"
                + "?cds vocab:is_located_on ?chrm.\n"
                + "} \n"
                + "}";

        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    // 16. Give me the genes on chromosome 1 whose start position is between 1000 and 3000
    public static String getGenesByLocus(String chromosomeNum, String chromosomeStart, String chromosomeEnd, int page, int pageSize, String resultFormat) throws IOException {
        //return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" + "<genes> Hello Jersey" + "</genes>";

        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "PREFIX vocab: <vocabulary/>\n"
                + "PREFIX obo:<http://purl.obolibrary.org/obo/> \n"
                + "PREFIX chrom: <chromosome/>\n"
                + "SELECT DISTINCT ?genes ?start ?taxon_name \n"
                + "WHERE{\n"
                + "?genes rdf:type <http://www.southgreen.fr/agrold/resource/Gene>.\n"
                + "?genes vocab:is_located_on chrom:" + chromosomeNum + " .\n"
                + "?genes vocab:taxon ?taxon_name .\n"
                + "?genes vocab:has_start_position ?start_position .\n"
                + "bind(xsd:int(?start_position) as ?start)\n"
                + "FILTER(?start >= " + chromosomeStart + " && ?start <= " + chromosomeEnd + ")\n"
                + "}";

        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    public static Set<String> getGeneLabels(String geneId) throws IOException {
        String sparqlQuery = "prefix	agrold:<http://www.southgreen.fr/agrold/vocabulary/> \n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "SELECT distinct ?label\n"
                + "WHERE {\n"
                + "    ?gene rdfs:label ?label.\n"
                + "    {\n"
                + "      ?gene rdf:type <" + GENE_TYPE_URI + ">.\n"
                + "    } UNION {\n"
                + "      ?gene rdf:type <" + GENE_TYPE_URI2 + ">.\n"
                + "    }\n"
                + "    BIND(REPLACE(str(?gene), '^.*(#|/)', \"\") AS ?id) .\n"
                + "    FILTER REGEX(STR(?id), CONCAT(\"" + geneId + "\"))\n"
                + "}";

        String labelsStr = Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, ".csv");
        Set<String> labels = new HashSet<>();
        String[] lines = labelsStr.split("\n");
        for (int i = 1; i < lines.length; i++) {
            labels.add(lines[i].replaceAll("[\"]", ""));
        }
        if (!labels.isEmpty()) {
            labels.add(geneId);
        }
        return labels;
    }

//    public static String getPublicationsOfGeneById(String id) throws IOException {
//        JSONArray resultJsonArray = new JSONArray();
//        // fetch the gene's labels
//        for (String label : getGeneLabels(id)) {
//            JSONArray pubs = ExternalServices.getPublicationsFromEBIEuropePMCByLabel(label);
//            for (int i = 0; i < pubs.length(); i++) {
//                resultJsonArray.put(pubs.getJSONObject(i));
//            }
//        }
//        return Utils.sortJSONArray(resultJsonArray, "pubYear", false).toString();
//    }
    public static String getPublicationsOfGeneById(String geneId, int page, int pageSize, String resultFormat) throws IOException {
        String query = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "PREFIX graph:<rapdb>\n"
                + "PREFIX vocab:<vocabulary/>\n"
                + "PREFIX res:<resource/>\n"
                + "\n"
                + "SELECT DISTINCT ?publication\n"
                + "WHERE {\n"
                + "graph graph: {\n"
                + "    ?mRNA vocab:develops_from|res:SIO_010081 ?gene;\n"
                + "	<http://purl.org/dc/terms/references> ?publication.\n"
                + "  ?gene rdf:type|rdfs:subClassOf ?type.\n"
                + "  FILTER(?type IN (<" + GENE_TYPE_URI + ">,<" + GENE_TYPE_URI2 + ">))\n"
                + "    BIND(REPLACE(str(?gene), '^.*(#|/)', \"\") AS ?geneId) .\n"
                + "    FILTER regex(str(?geneId), '"+geneId+"') .\n"
                + "}\n"
                + "}";
        return Utils.executeSparqlQuery(query, Utils.sparqlEndpointURL, resultFormat);
    }

    public static void main(String[] args) throws IOException {
        //System.out.println(getGenesByLocus("01", "10000", "30000", 0, 10, ".json"));
        System.out.println("Result: " + getPublicationsOfGeneById("Os05g0125000", 10, 0, ".json"));
    }
}

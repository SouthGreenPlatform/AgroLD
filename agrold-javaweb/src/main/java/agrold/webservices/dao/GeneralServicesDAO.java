/*
 * API services on graphs
 */
package agrold.webservices.dao;

import java.io.IOException;

/**
 * API services on graphs
 *
 * @author tagny
 */
public class GeneralServicesDAO {

    // describe a resource
    public static String getIRIDescription(String IRI, int page, int pageSize, String resultFormat) throws IOException {
        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "SELECT ?graph ?property ?hasValue ?isValueOf ?type\n"
                + "WHERE {\n"
                + "values (?q){(<" + IRI + ">)}\n"
                + " { GRAPH ?graph { ?q ?property ?hasValue. } OPTIONAL{?hasValue a ?type}}\n"
                + "  UNION\n"
                + "  { GRAPH ?graph { ?isValueOf ?property ?q. } OPTIONAL{?isValueOf a ?type}}   \n"
                + "}";

        //String sparqlQuery = "DESCRIBE <" + IRI + ">";
        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    public static String listGraph(int page, int pageSize, String resultFormat) throws IOException {
        String sparqlQuery = "SELECT distinct ?graph\n"
                + "WHERE {\n"
                + " GRAPH ?graph {\n"
                + "   ?subject ?predicate ?object.\n"
                + " }\n"
                + " filter(REGEX(?graph, \"http://www.southgreen.fr/agrold/*\"))\n"
                + "}"
                + "ORDER BY str(?graph)";
        //+ "GROUP BY ?property";
        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    /**
     * What predicates are in AgroLD?
     *
     * @param graphLocalName
     * @param page
     * @param pageSize
     * @param resultFormat
     * @return the list of URIs of predicates
     * @throws java.io.IOException
     */
    public static String getPredicates(String graphLocalName, int page, int pageSize, String resultFormat) throws IOException {
        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + (graphLocalName == null || graphLocalName.isEmpty() ? "" : "PREFIX graph:<" + graphLocalName + ">\n")
                + "\n"
                + "SELECT distinct ?LocalName (?relation AS ?URI)\n"
                + (graphLocalName == null || graphLocalName.isEmpty() ? "" : "FROM graph:\n")
                + "WHERE { \n"
                + "  ?subject ?relation ?object . \n"
                + "  BIND(REPLACE(str(?relation), '^.*(#|/)', \"\") AS ?LocalName)\n"
                + "} \n"
                + "ORDER BY ?relation";
        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    public static void main(String[] args) throws IOException {
        System.out.println(getIRIDescription("http://www.southgreen.fr/agrold/ricecyc.pathway/FERMENTATION-PWY", 0, 0, Utils.CSV));
    }
}

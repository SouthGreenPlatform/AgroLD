/*
 * API services on graphs
 */
package agrold.webservices.dao;

import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import org.json.JSONArray;

/**
 * API services on graphs
 *
 * @author tagny
 */
public class GeneralServicesDAO {

    // describe a resource 4 vizualizaton
//    public static String getIRIDescription4visualization(String IRI, int page, int pageSize, String resultFormat) throws IOException {
//        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
//                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
//                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
//                + "SELECT ?graph ?property ?hasValue ?isValueOf (group_concat(distinct concat(?hasValueType, ?isValueOfType) ;separator=\"; \") as ?type)\n"
//                + "WHERE {\n" + "values (?q){(<" + IRI + ">)}\n"
//                + " { \n"
//                + "    GRAPH ?graph { ?q ?property ?hasValue. FILTER(?hasValue != <http://www.w3.org/2002/07/owl#Class>)} \n"
//                + "    OPTIONAL{\n"
//                + "      ?hasValue a ?hasValueType.\n"
//                + "      FILTER(?hasValueType != <http://www.w3.org/2002/07/owl#Class>)\n"
//                + "    }\n"
//                + "  }\n"
//                + "  UNION\n"
//                + "  { \n"
//                + "    GRAPH ?graph { ?isValueOf ?property ?q. FILTER(?isValueOf != <http://www.w3.org/2002/07/owl#Class>)} \n"
//                + "    OPTIONAL{\n"
//                + "      ?isValueOf a ?isValueOfType.\n"
//                + "      FILTER(?isValueOfType != <http://www.w3.org/2002/07/owl#Class>)\n"
//                + "    }\n"
//                + "  }      \n"
//                + "}";
//
//        //String sparqlQuery = "DESCRIBE <" + IRI + ">";
//        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);
//
//        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
//    }

    public static String getIRIDescription4visualization(String IRI, int page, int pageSize) throws IOException {
        String sparqlQueryHasValue = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "SELECT ?graph ?property ?hasValue ?isValueOf (group_concat(distinct concat(?hasValueType) ;separator=\"; \") as ?type)\n"
                + "WHERE {\n"
                + "values (?q){(<" + IRI + ">)}\n"
                + "    GRAPH ?graph { ?q ?property ?hasValue. FILTER(?hasValue != <http://www.w3.org/2002/07/owl#Class>)} \n"
                + "    OPTIONAL{\n"
                + "      ?hasValue a ?hasValueType.\n"
                + "      FILTER(?hasValueType != <http://www.w3.org/2002/07/owl#Class>)\n"
                + "    }\n"
                + "}";
        sparqlQueryHasValue  = Utils.addLimitAndOffset(sparqlQueryHasValue, pageSize, page);
        JSONArray resultsHasValue = new JSONArray(Utils.executeSparqlQuery(sparqlQueryHasValue, Utils.sparqlEndpointURL, Utils.JSON)); 
        String sparqlQueryIsValueOf = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "SELECT ?graph ?property ?hasValue ?isValueOf (group_concat(distinct concat(?isValueOfType) ;separator=\"; \") as ?type)\n"
                + "WHERE {\n"
                + "values (?q){(<" + IRI + ">)}\n"
                + " GRAPH ?graph { ?isValueOf ?property ?q. FILTER(?isValueOf != <http://www.w3.org/2002/07/owl#Class>)} \n"
                + "    OPTIONAL{\n"
                + "      ?isValueOf a ?isValueOfType.\n"
                + "      FILTER(?isValueOfType != <http://www.w3.org/2002/07/owl#Class>)\n"
                + "    }  \n"
                + "}" ;
        sparqlQueryIsValueOf  = Utils.addLimitAndOffset(sparqlQueryIsValueOf, pageSize, page);
        
        JSONArray resultsIsValueOf = new JSONArray(Utils.executeSparqlQuery(sparqlQueryIsValueOf, Utils.sparqlEndpointURL, Utils.JSON));
        JSONArray results = Utils.concatJONArrays(resultsHasValue, resultsIsValueOf);
        Writer fw = new FileWriter("result.json");
        fw.write(results.toString());
        fw.close();
        return results.toString();
    }

    public static String getIRIDescription(String IRI, int page, int pageSize, String resultFormat) throws IOException {
        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "SELECT ?graph ?property ?hasValue ?isValueOf (group_concat(distinct concat(?hasValueType, ?isValueOfType) ;separator=\"; \") as ?type)\n"
                + "WHERE {\n" + "values (?q){(<" + IRI + ">)}\n"
                + " { \n"
                + "    { ?q ?property ?hasValue }\n"
                + "  UNION\n"
                + "  { ?isValueOf ?property ?q } \n"
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
        System.out.println(getIRIDescription4visualization
        ("http://www.southgreen.fr/agrold/chromosome/4536:Oryza_nivara_v1.0:10:1-21549876:1", 0, 2000));
        String API_JSON_SPEC_PATH = "";
        //queryCustomizableService("sala", null, 0, 10, ".json");
        //readAPISpecification(Utils.AGROLDAPIJSONURL);
    }
}

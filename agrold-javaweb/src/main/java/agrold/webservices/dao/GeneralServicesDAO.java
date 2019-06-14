/*
 * API services on graphs
 */
package agrold.webservices.dao;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import javax.ws.rs.core.MultivaluedMap;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;

/**
 * API services on graphs
 *
 * @author tagny
 */
public class GeneralServicesDAO {

    // describe a resource
    public static String getIRIDescription(String IRI, int page, int pageSize, String resultFormat) throws IOException {
        /*String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "SELECT ?graph ?property ?hasValue ?isValueOf (group_concat(distinct concat(?hasValueType, ?isValueOfType, ?computedType) ;separator=\"; \") as ?type)\n"
                + "WHERE {\n" + "values (?q){(<" + IRI + ">)}\n"
                + " { \n"
                + "    GRAPH ?graph { ?q ?property ?hasValue. } \n"
                + "    OPTIONAL{\n"
                + "      ?hasValue a ?hasValueType.\n"
                + "      FILTER(?hasValueType != <http://www.w3.org/2002/07/owl#Class>)\n"
                + "    }\n"
                + "  }\n"
                + "  UNION\n"
                + "  { \n"
                + "    GRAPH ?graph { ?isValueOf ?property ?q. } \n"
                + "    OPTIONAL{\n"
                + "      ?isValueOf a ?isValueOfType.\n"
                + "      FILTER(?isValueOfType != <http://www.w3.org/2002/07/owl#Class>)\n"
                + "    }\n"
                + "  }   \n"
                + "     Bind(if(contains(str(?property), \"taxon\"), <http://www.southgreen.fr/vocavulary/Taxon>, \"\") as ?computedType) \n"
                + "}";*/
        String sparqlQuery = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "SELECT ?graph ?property ?hasValue ?isValueOf (group_concat(distinct concat(?hasValueType, ?isValueOfType, ?computedType) ;separator=\"; \") as ?type)\n"
                + "WHERE {\n" + "values (?q){(<" + IRI + ">)}\n"
                + " { \n"
                + "    GRAPH ?graph { ?q ?property ?hasValue. } \n"
                + "    OPTIONAL{\n"
                + "      ?hasValue a ?hasValueType.\n"
                + "      FILTER(?hasValueType != <http://www.w3.org/2002/07/owl#Class>)\n"
                + "    }\n"
                + "  }\n"
                + "  UNION\n"
                + "  { \n"
                + "    GRAPH ?graph { ?isValueOf ?property ?q. } \n"
                + "    OPTIONAL{\n"
                + "      ?isValueOf a ?isValueOfType.\n"
                + "      FILTER(?isValueOfType != <http://www.w3.org/2002/07/owl#Class>)\n"
                + "    }\n"
                + "  }   \n"
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

    public static String readAPISpecification(String specPath) {
        //JSON parser object to parse read file        
        JSONObject jsonObj = null;
        try (FileReader reader = new FileReader(Utils.AGROLDAPIJSONURL)) {
            //Read JSON file
            JSONTokener tokener = new JSONTokener(reader);
            jsonObj = new JSONObject(tokener);

            // add a new tag
            JSONObject tagObj = new JSONObject();
            /*tagObj.put("name", "customizable");
            tagObj.put("description", "customizable web services");
            tagObj.put("externalDocs", new JSONObject("{\n"
                    + "                \"description\": \"Find out more\",\n"
                    + "                \"url\": \"http://www.agrold.org\"\n"
                    + "            }"));
            ((JSONArray) jsonObj.get("tags")).put(0, tagObj);

            System.out.println(jsonObj.get("tags"));*/
            reader.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return jsonObj.toString();
    }
    
    public static void writeAPISpecification(JSONObject apiSpecObj) {
        // write
        try (FileWriter writer = new FileWriter(Utils.AGROLDAPIJSONURL)) {
            if (apiSpecObj != null) {
                writer.write(apiSpecObj.toString());
            }
            writer.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String queryCustomizableService(String serviceLocalName, MultivaluedMap<String, String> queryParams, int page, int pageSize, String resultFormat) throws IOException {
        String sparqlQuery = "";
        sparqlQuery = Utils.addLimitAndOffset(sparqlQuery, pageSize, page);
        String currentDirectory = System.getProperty("user.dir");
        System.out.println("The current working directory is " + currentDirectory);

        return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, resultFormat);
    }

    public static void main(String[] args) throws IOException {
        System.out.println(getIRIDescription("http://www.southgreen.fr/agrold/ricecyc.pathway/FERMENTATION-PWY", 0, 0, Utils.CSV));
        String API_JSON_SPEC_PATH = "";
        //queryCustomizableService("sala", null, 0, 10, ".json");
        //readAPISpecification(Utils.AGROLDAPIJSONURL);
    }
}

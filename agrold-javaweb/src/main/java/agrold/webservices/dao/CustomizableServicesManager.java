/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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
 *
 * @author Gildas
 */
public class CustomizableServicesManager {

    public static final String PATH_FIXED_PART = "/customizable/";
    public static final String CUSTOMIZABLE_SERVICES_TAG = "customizable";

    /*public static String validateName(String name) {
        
    }*/
    public static String readAPISpecification(String apiSpecificationPath) {
        //JSON parser object to parse read file        
        JSONObject jsonObj = null;
        try (FileReader reader = new FileReader(apiSpecificationPath)) {
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

    public static void writeAPISpecification(JSONObject apiSpecification, String apiSpecificationPath) {
        // write
        try (FileWriter writer = new FileWriter(apiSpecificationPath)) {
            if (apiSpecification != null) {
                writer.write(apiSpecification.toString());
            }
            writer.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     *
     * @param name
     * @param httpMethod
     * @param sparqlPattern : a variable pattern @var_name:type:
     */
    public static void addService(String name, String httpMethod, String sparqlPattern) {
        JSONObject apiSpecification = new JSONObject(readAPISpecification(Utils.AGROLDAPIJSONURL));
        JSONObject newServiceSpec = new JSONObject();
        newServiceSpec.put(httpMethod, new JSONObject());
        newServiceSpec.getJSONObject(httpMethod).put("description", sparqlPattern);
        newServiceSpec.getJSONObject(httpMethod).append("tags", CUSTOMIZABLE_SERVICES_TAG);
        newServiceSpec.getJSONObject(httpMethod).put("produces", new JSONArray());
//        newServiceSpec.getJSONObject(httpMethod).append("produces", "application/sparql-results+json");
//        newServiceSpec.getJSONObject(httpMethod).append("produces", "text/plain");
        newServiceSpec.getJSONObject(httpMethod).put("parameters", new JSONArray());
        newServiceSpec.getJSONObject(httpMethod).put("responses", new JSONObject("{\n"
                + "\"200\": {\n"
                + "\"description\": \"successful operation\"\n"
                + "},\n"
                + "\"default\": {\n"
                + "\"description\": \"Unexpected error\"\n"
                + "}\n"
                + "}"));
        //System.out.println(newServiceSpec.toString());
        String servicePath = PATH_FIXED_PART + name.replaceAll("\\s+", "");
        apiSpecification.getJSONObject("paths").put(servicePath, newServiceSpec);
        //System.out.println(apiSpecification.toString());
        writeAPISpecification(apiSpecification, Utils.AGROLDAPIJSONURL);
        writeAPISpecification(apiSpecification, Utils.AGROLDAPIJSONURL+".backup");
    }

    public static void deleteService(String name) {
        JSONObject apiSpecification = new JSONObject(readAPISpecification(Utils.AGROLDAPIJSONURL));
        String servicePath = PATH_FIXED_PART + name.replaceAll("\\s+", "");
        if (apiSpecification.getJSONObject("paths").has(servicePath)) {
            apiSpecification.getJSONObject("paths").remove(servicePath);
        }
        //System.out.println(apiSpecification.toString());
        writeAPISpecification(apiSpecification, Utils.AGROLDAPIJSONURL);
        writeAPISpecification(apiSpecification, Utils.AGROLDAPIJSONURL+".backup");
    }

    public static void updateService(String name, String sparqlPattern) {
        JSONObject apiSpecification = new JSONObject(readAPISpecification(Utils.AGROLDAPIJSONURL));
        JSONObject newServiceSpec = new JSONObject();
        newServiceSpec.put("description", sparqlPattern);
        //System.out.println(newServiceSpec.toString());
        String servicePath = PATH_FIXED_PART + name.replaceAll("\\s+", "");
        if (apiSpecification.getJSONObject("paths").has(servicePath)) {
            apiSpecification.getJSONObject("paths").put(servicePath, newServiceSpec);
        }
        //System.out.println(apiSpecification.toString());
        writeAPISpecification(apiSpecification, Utils.AGROLDAPIJSONURL);
        writeAPISpecification(apiSpecification, Utils.AGROLDAPIJSONURL+".backup");
    }

    public static String queryCustomizableService(String serviceLocalName, MultivaluedMap<String, String> queryParams) throws IOException {
        String sparqlQuery = "";
        String currentDirectory = System.getProperty("user.dir");
        System.out.println("The current working directory is " + currentDirectory);

        //return Utils.executeSparqlQuery(sparqlQuery, Utils.sparqlEndpointURL, Utils.JSON_LD);
        return "chapi chapo";
    }

    public static void main(String[] args) {
        String name = "graph_relations";
        String sparql = "BASE <http://www.southgreen.fr/agrold/>\n"
                + "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "\n"
                + "SELECT distinct ?relation\n"
                + "WHERE { \n"
                + "#  values (?graph){(<gramene.genes>)}\n"
                + " GRAPH ?graph { \n"
                + "  ?subject ?relation ?object . \n"
                + " } \n"
                + "} \n"
                + "ORDER BY ?relation";
        String httpMethod = "get";
        deleteService(name);
        addService(name, httpMethod, sparql);
    }
}

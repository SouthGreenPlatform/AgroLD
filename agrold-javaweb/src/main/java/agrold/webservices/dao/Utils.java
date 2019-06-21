/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package agrold.webservices.dao;

import static agrold.webservices.dao.PathwayDAO.METABOLIC_PATHWAY;
import static agrold.webservices.dao.PathwayDAO.PATHWAY_IDENTIFIER;
import static agrold.webservices.dao.PathwayDAO.PATHWAY_TYPE1;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.CharacterData;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

/**
 *
 * @author zadmin
 */
public class Utils {

    public final static String DEFAULT_PAGE_SIZE = "10";
    public final static String DEFAULT_PAGE = "0";
    public final static String AGROLDAPIJSONURL = "C:\\Users\\Gildas\\git\\AgroLD_webapp\\agrold-javaweb\\agrold-api.json";
    //public final static String AGROLDAPIJSONURL = "/home/tagny/Documents/agrold/resources/agrold-api.json";
    //public static final String AGROLDAPIJSONURL = "/home/virtuoso/agrold-api.json"; // en ligne i.e. sur volvestre

    public static String sparqlEndpointURL = "http://sparql.southgreen.fr";
    //public static String sparqlEndpointURL = "http://agrold.southgreen.fr/sparql";

    public final static String CSV = "text/csv"; //CSV, HTML, JSON, N3, RDF, JSON_LD, TSV, TTL, XML
    public final static String HTML = "text/html"; // "text/csv", "application/json", "text/plain","text/turtle", "application/sparql-results+xml", "application/rdf+xml","text/tab-separated-values", "application/sparql-results+json", 
    public final static String JSON = "application/json";
    public final static String N3 = "text/plain";
    public final static String RDF = "application/rdf+xml";
    public final static String JSON_LD = "application/sparql-results+json";
    public final static String TSV = "text/tab-separated-values";
    public final static String TTL = "text/turtle";
    public final static String TXT = "text/plain";
    public final static String XML = "application/sparql-results+xml";

    // HTML, JSON, JSON_LD, XML, TSV, CSV, RDF, TTL, N3
    public static String getFormatFullName(String format) {
        if(format==null){
            return JSON;
        }
        switch (format.toLowerCase()) {
            case ".json":
                return JSON;
            case ".jsonld":
                return JSON_LD;
            case ".html":
                return HTML;
            case ".tsv":
                return TSV;
            case ".csv":
                return CSV;
            case ".rdf":
                return RDF;
            case ".xml":
            case "xml":
                return XML;
            case ".ttl":
                return TTL;
            case ".n3":
                return N3;
            case HTML:
                return HTML;
            case JSON:
                return JSON;
            case JSON_LD:
                return JSON_LD;
            case TSV:
                return TSV;
            case CSV:
                return CSV;
            case RDF:
                return RDF;
            case XML:
                return XML;
            case TTL:
                return TTL;
            case N3:
                return N3;
            default:
                return null;
        }
        // return "";
    }

    public static String convertStreamToString(java.io.InputStream is) {
        java.util.Scanner s = new java.util.Scanner(is).useDelimiter("\\A");
        return s.hasNext() ? s.next() : "";
    }

    public static String executeSparqlQuery(String sparqlQuery, String sparqlEndpoint, String responseContentType) throws MalformedURLException, IOException {
        //System.out.println("BEGINNING...");
        System.out.println(sparqlQuery);
        String result = "";

        String defaultGraphURI = "";
        responseContentType = getFormatFullName(responseContentType);
        String format = responseContentType;
        if (responseContentType.equals(JSON)) {
            format = TSV;
        }
        InputStream response = null;
        String charset = "UTF-8";  // Or in Java 7 and later, use the constant: java.nio.charset.StandardCharsets.UTF_8.name()
        try {
            String httpQuery = String.format("default-graph-uri=%s&query=%s&format=%s&timeout=20000",
                    URLEncoder.encode(defaultGraphURI, charset),
                    URLEncoder.encode(sparqlQuery, charset),
                    URLEncoder.encode(format, charset));
           // System.out.println("httpQuerry: " + httpQuery);
            // Firing a HTTP GET request with (optionally) query parameters
            URLConnection connection = new URL(sparqlEndpoint + "?" + httpQuery).openConnection();
            connection.setRequestProperty("Accept-Charset", charset);
            response = connection.getInputStream();
            result = convertStreamToString(response);
        } catch (UnsupportedEncodingException ex) {
            Logger.getLogger(Utils.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(Utils.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            if (response != null) {
                try {
                    response.close();
                } catch (IOException ex) {
                    Logger.getLogger(Utils.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        if (responseContentType.equals(JSON)) {
            result = tsv2json(result);
        }
        System.out.println("Content-type: " + responseContentType);
        //System.out.println("...END");
        return result;
    }

    public static String executeHttpQuery(String url) {
        System.out.println("executeHttpQuery: " + url);
        String result = null;
        InputStream response = null;
        String charset = "UTF-8";  // Or in Java 7 and later, use the constant: java.nio.charset.StandardCharsets.UTF_8.name()
        try {
            // Firing a HTTP GET request with (optionally) query parameters
            URLConnection connection = new URL(url).openConnection();
            connection.setRequestProperty("Accept-Charset", charset);
            response = connection.getInputStream();
            result = convertStreamToString(response);
        } catch (UnsupportedEncodingException ex) {
            Logger.getLogger(Utils.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(Utils.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            if (response != null) {
                try {
                    response.close();
                } catch (IOException ex) {
                    Logger.getLogger(Utils.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        return result;
    }

    public static String tsv2json(String tsv) {
        String json = "[";
        String lines[] = tsv.split("\\r?\\n");
        String headers[] = lines[0].split("\t"); // headers so no empty field        
        for (int i = 1; i < lines.length; i++) {
            String values[] = lines[i].split("\t", -1); // consider empty fields
            json += "{";
            for (int j = 0; j < headers.length; j++) {
                json += headers[j] + ":" + (values[j].isEmpty() ? "\"\"" : values[j]);
                if (j < headers.length - 1) {
                    json += ",";
                }
            }
            json += "}";
            if (i < lines.length - 1) {
                json += ",";
            }
        }
        // first line == attribute of each object (each other line) in the json array        
        json += "]";
        return json;
    }
    /*
     public static String csv2json(String csv) {
     String json = "[";
     // csv 2 line array
     String lines[] = csv.split("\\r?\\n");
     // get headers
     String headers[] = lines[0].split("\",\""); // header so no empty field        
     for (int i = 1; i < lines.length; i++) {
     //System.out.println(i + ":" + headers[i]);
     String values[] = lines[i].split("\",\"", -1); // consider empty fields
     json += "{";
     for (int j = 0; j < headers.length; j++) {
     json += headers[j] + ":" + values[j];
     if (j < headers.length - 1) {
     json += ",";
     }
     }
     json += "}";
     if (i < lines.length - 1) {
     json += ",";
     }
     }
     // first line == attribute of each object (each other line) in the json array        
     json += "]";
     return json;
     }*/

    public static String addLimitAndOffset(String sparqlQuery, int limit, int offset) {
        if (limit > 0) {
            sparqlQuery += "\nLIMIT " + limit;
            if (offset >= 0) {
                sparqlQuery += "\nOFFSET " + (limit * offset); // to go after the previous result
            }
        }
        return sparqlQuery;
    }
    
    public static String getTypesOptionsAsSparql(String subject, String[] typeUris){
        String typesStr = "";       
        for (int i = 0; i < typeUris.length; i++) {
            typesStr += (i == 0 ? "" : "union\n") 
                    + "{"+subject+" a <" + typeUris[i] + ">}\n";                   
        }  
        /*for (int i = 0; i < typeUris.length; i++) {
            typesStr += "union\n{"+subject+" rdfs:subClassOf <" + typeUris[i] + ">}\n";
        }*/
        return typesStr;
    }

    public static String getEntitiesByKeyWord(String keyword, String[] typeUris, int page, int pageSize, String resultFormat) throws IOException {
        // format keyword
        String tokens[] = keyword.split("\\s+");
        String keywordsQuery = "'(\"" + String.join("\" AND \"", tokens).toUpperCase() + "\")'";
        String keywordsListStr = "('" + String.join("', '", tokens).toUpperCase() + "')";
             

        String sparqlQuery = "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n"
                + "select distinct ?Id ,?s1 as ?URI, ?g as ?graph, "
                + "(bif:search_excerpt (bif:vector " + keywordsListStr + ", group_concat(distinct ?o1;separator=\" ; \"))) as ?keyword_reference \n"
                //+ "(bif:search_excerpt (bif:vector " + keywordsListStr + ", ?o1)) as ?keyword_reference \n"
                + "where {{{ \n"
                + "select ?Id, ?s1, ?t, (?sc * 3e-1) as ?sc, ?o1, (sql:rnk_scale (<LONG::IRI_RANK> (?s1))) as ?rank, ?g \n"
                + "where  \n"
                + "  { \n"
                + "    quad map virtrdf:DefaultQuadMap \n"
                + "    { \n"
                + "      graph ?g \n"
                + "      { \n"
                + "         ?s1 ?s1textp ?o1 .\n"
                + "        ?o1 bif:contains  " + keywordsQuery + "  option (score ?sc)  .\n"
                + "      }\n"
                + "     }\n"
                + getTypesOptionsAsSparql("?s1", typeUris)               
                + "	BIND(REPLACE(str(?s1), '^.*(#|/)', \"\") AS ?Id)\n"
                + "  }\n"
                + " order by desc (?sc * 3e-1 + sql:rnk_scale (<LONG::IRI_RANK> (?s1)))  ";
        sparqlQuery = addLimitAndOffset(sparqlQuery, pageSize, page) + "}}}";

        return executeSparqlQuery(sparqlQuery, sparqlEndpointURL, resultFormat);
    }

    public static String getValueFromXMLDocTagName(String xmlDoc, String tagName) {
        try {
            DocumentBuilder db = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            InputSource is = new InputSource();
            is.setCharacterStream(new StringReader(xmlDoc));

            Document doc = db.parse(is);
            NodeList name = doc.getElementsByTagName(tagName);
            Element line = (Element) name.item(0);
            return getCharacterDataFromElement(line);
        } catch (ParserConfigurationException | SAXException | IOException ex) {
            Logger.getLogger(Utils.class.getName()).log(Level.SEVERE, null, ex);
        }
        return "";
    }

    public static String getCharacterDataFromElement(Element e) {
        Node child = e.getFirstChild();
        if (child instanceof CharacterData) {
            CharacterData cd = (CharacterData) child;
            return cd.getData();
        }
        return "";
    }

    public static boolean arrayListContains(ArrayList<String> array, String val) {
        for (String s : array) {
            if (s.equals(val)) {
                return true;
            }
        }
        return false;
    }

    public static JSONArray sortJSONArray(JSONArray jsonArr, String sortBy, boolean sortOrder) {
        JSONArray sortedJsonArray = new JSONArray();

        List<JSONObject> jsonValues = new ArrayList<JSONObject>();
        for (int i = 0; i < jsonArr.length(); i++) {
            jsonValues.add(jsonArr.getJSONObject(i));
        }
        final String KEY_NAME = sortBy;
        final Boolean SORT_ORDER = sortOrder;
        Collections.sort(jsonValues, new Comparator<JSONObject>() {

            @Override
            public int compare(JSONObject a, JSONObject b) {
                String valA = new String();
                String valB = new String();

                try {
                    valA = (String) a.get(KEY_NAME);
                    valB = (String) b.get(KEY_NAME);
                } catch (JSONException e) {
                    //exception
                }
                if (SORT_ORDER) {
                    return valA.compareTo(valB);
                } else {
                    return -valA.compareTo(valB);
                }
            }
        });
        for (int i = 0; i < jsonValues.size(); i++) {
            sortedJsonArray.put(jsonValues.get(i));
        }
        return sortedJsonArray;
    }

    public static int searchInJsonArray(JSONArray jsonArray, String fieldName, String fieldValue) {
        int index = -1;
        for (int i = 0; i < jsonArray.length(); i++) {
            if (jsonArray.getJSONObject(i).get(fieldName).toString().equals(fieldValue)) {
                index = i;
                break;
            }
        }
        return index;
    }

    public static void main(String[] args) throws IOException {
        //System.out.println(getEntitiesByKeyWord("coding", GeneDAO.TYPEURIs, 0, 30, TSV));
        System.out.println(getEntitiesByKeyWord("ethanol degradation", new String[] {METABOLIC_PATHWAY, PATHWAY_IDENTIFIER, PATHWAY_TYPE1}, 0, 30, TSV));
        //System.out.println(getEntitiesByKeyWord("plant height", new String[]{"http://www.w3.org/2002/07/owl#Class"}, 0, 10, TSV));
//System.out.println(executeSparqlQuery("select distinct ?Concept where {[] a ?Concept} LIMIT 5", sparqlEndpointURL, "text/html"));
    }
}

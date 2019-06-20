/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package agrold.webservices.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import org.json.JSONObject;

/**
 *
 * @author Gildas
 */
public class WebService { 
    
    public enum ParameterLocation{path, query, body};
    public enum ParameterType{string, integer};
    
    private String path;
    private String method;
    private String summary;
    private String description; // sparql query or simply how is the service run
    private List<String> produces;
    private String operationId;    
    private Map<String, Response> responses;    
    private List<Parameter> parameters;
    private List<String> tags;    
    private Map<String, List> security;    

    public WebService() {
        responses = new TreeMap();
        produces = new ArrayList();
        parameters = new ArrayList();
        tags = new ArrayList();
    }

    public String getPath() {
        return path;
    }

    public String getMethod() {
        return method;
    }

    public String getSummary() {
        return summary;
    }

    public String getDescription() {
        return description;
    }

    public List<String> getProduces() {
        return produces;
    }

    public String getOperationId() {
        return operationId;
    }

    public Map<String, Response> getResponses() {
        return responses;
    }

    public List<Parameter> getParameters() {
        return parameters;
    }

    public List<String> getTags() {
        return tags;
    }

    public Map<String, List> getSecurity() {
        return security;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setProduces(List<String> produces) {
        this.produces = produces;
    }

    public void setOperationId(String operationId) {
        this.operationId = operationId;
    }

    public void setResponses(Map<String, Response> responses) {
        this.responses = responses;
    }

    public void setParameters(List<Parameter> parameters) {
        this.parameters = parameters;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public void setSecurity(Map<String, List> security) {
        this.security = security;
    }

    public JSONObject toJSONObjet(){
        return new JSONObject(this);
    }
    
    public class Response{
        String httpResponseCode; // id
        String description;

        public Response() {
        }
        public Response(String httpResponseCode, String description) {
            this.httpResponseCode = httpResponseCode;
            this.description = description;
        }

        public void setHttpResponseCode(String httpResponseCode) {
            this.httpResponseCode = httpResponseCode;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getHttpResponseCode() {
            return httpResponseCode;
        }

        public String getDescription() {
            return description;
        }
        
    }
    
    public class Parameter{
        ParameterLocation in; 
        String name;
        String description;
        String type;
        Boolean required;
        List<String> possibleValues;

        public Parameter() {
        }
                
        public Parameter(ParameterLocation in, String name, String description, String type, Boolean required, List<String> possibleValues) {
            this.in = in;
            this.name = name;
            this.description = description;
            this.type = type;
            this.required = required;
            this.possibleValues = possibleValues;
        }   

        public void setIn(ParameterLocation in) {
            this.in = in;
        }

        public void setName(String name) {
            this.name = name;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public void setType(String type) {
            this.type = type;
        }

        public void setRequired(Boolean required) {
            this.required = required;
        }

        public void setPossibleValues(List<String> possibleValues) {
            this.possibleValues = possibleValues;
        }

        public ParameterLocation getIn() {
            return in;
        }

        public String getName() {
            return name;
        }

        public String getDescription() {
            return description;
        }

        public String getType() {
            return type;
        }

        public Boolean getRequired() {
            return required;
        }

        public List<String> getPossibleValues() {
            return possibleValues;
        }
                
    }        
}

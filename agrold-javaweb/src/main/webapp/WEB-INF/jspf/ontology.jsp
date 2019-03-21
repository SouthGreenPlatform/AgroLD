<%-- 
    Document   : gene
    Created on : Sep 7, 2015, 3:04:42 PM
    Author     : tagny
--%>
<script type="text/javascript">
    var ontology = {
    currentParentPage : 0,
    currentChildrenPage : 0,
    currentProteinPage : 0,
    currentQtlPage : 0,
    id:'',
    html:'<nav id="ontologyPage" class="nav nav-tabs flex-column flex-sm-row advs">\
            <div id="parentContainer">\
                <span id="parentPageBtns" class="pageNavBtns"><a class="flex-sm-fill text-sm-center nav-link active o-parentResult" href="javascript:void(0)" id="parent"> Parents </a></span>\
            </div>\
            <div id="childrenContainer">\
                <span id="childrenPageBtns" class="pageNavBtns"><a class="flex-sm-fill text-sm-center nav-link o-childrenResult" href="javascript:void(0)" id="children"> Children </a></span>\
            </div>\
            <div id="proteinContainer">\
                <span id="proteinPageBtns" class="pageNavBtns"><a class="flex-sm-fill text-sm-center nav-link o-proteinResult" href="javascript:void(0)" id="protein"> Proteins associated </a></span>\
            </div>\
            <div id="qtlContainer">\
                <span id="qtlPageBtns" class="pageNavBtns"><a class="flex-sm-fill text-sm-center nav-link o-qtlResult" href="javascript:void(0)" id="qtl"> QTL associated </a></span>\
            </div>\
                    <div id="graphViewContainer">\
                       <span id="graphViewPageBtns"><a class="flex-sm-fill text-sm-center nav-link o-graphViewResult" href="javascript:void(0)" id="graphView"> View as graph </a></span>\
                   </div>\
        </nav>\
        <div class="o-panel o-active" id="parentResult"><div id="zbtn"></div></div>\
        <div class="o-panel" id="childrenResult"></div>\
        <div class="o-panel" id="proteinResult"></div>\
        <div class="o-panel" id="qtlResult"></div>\
<div class="o-panel" id="graphViewResult"></div>',
        //-- var ontologyUri = <%-- out.println("'" + request.getParameter("uri") + "'"); --%>;
        //-- function getontologyDescription(uri) {
    getDescription : function(uri) {
        this.uri = uri;
        var sparql = 'PREFIX agrold:<http://www.southgreen.fr/agrold/vocabulary/> \
PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> \
PREFIX meaning:<http://purl.obolibrary.org/obo/IAO_0000115> \
SELECT distinct  ?Id ?Name ?Description (?entity AS ?Uri) \
WHERE { \
  VALUES ?entity{ \
    <' + uri + '> \
  } \
{?entity meaning: ?Description}UNION{BIND("" as ?Description)} .  \
{?entity rdfs:label ?Name}UNION{BIND("" as ?Name)} \
BIND(REPLACE(str(?entity), \'^.*(#|/)\', \"\") AS ?localname)\
BIND(REPLACE(?localname, \"_\", \":\") as ?Id).}';
        var query = sparqlEndpoint + "?query=" + encodeURIComponent(sparql) + "&format=application/json";
        var tthis = this;
        $.get(query, function (json) {
            DBG = json;
            WaitingModal(1);
            dispalyHeader("ontology", json);
            if(typeof (json["results"]["bindings"][0]) !== 'undefined')
                ModalContext.id = json["results"]["bindings"][0]["Id"]["value"];
            else
                ModalContext.notFound();
            console.log(json);
            console.log("# -- CALL OF ADDEVENT : this.id" + this.id);
            tthis.addEvents();
            console.log('Chargement Terminé');
            $('#parent').click();
        });
    },
//    $(document).ready(function () {
//        getontologyDescription(ontologyUri);
//    });
    addEvents : function() { 
        console.log("AddEvents CALL");
        $("#parent").attr("onclick", "invoke('searchParentById'," + this.currentParentPage + ")");
        $("#children").attr("onclick", "invoke('searchChildrenById'," + this.currentChildrenPage+ ")");        
        $("#protein").attr("onclick", "invoke('searchProteinIdAssociatedWithOntoId'," + this.currentChildrenPage+ ")");        
        $("#qtl").attr("onclick", "invoke('searchQtlsIdAssociatedWithOntoId'," + this.currentChildrenPage+ ")");  
        $("#graphView").attr("onclick", "invoke('callViewAsGraph')");
    },
        callViewAsGraph: function () {
            viewAsGraph(this.uri, "graphViewResult");
        },
    searchParentById : function(page) {
        console.log('SEARCH PARENTT BY ID : ');
        this.currentParentPage = page;
        var type = "parent";
        var containerId = type+"Container";
        displayHoldMessage("#" + type + "Result");        
        var idt = ModalContext.uri;
        var tthis = this;
        swagger.apis.ontologies.getParentById({format: DEFAULTAPIFORMAT, id:ModalContext.id , pageSize: pageSize, page: page},
        {responseContentType: 'application/json'}, function (data) {
            var sparqljson = data.data;
            var resultId = type + "Result";
            displayResult(resultId, sparqljson);
            $("tr.odd").ready(function () {
                pageBtnsId = "zbtn"/*type + "PageBtns"*/;
                tthis.displayInformation(data, page, resultId, pageBtnsId, "searchParentById");
                processHtmlResult("ontology");
            });
        });
    },
    searchChildrenById : function(page) {
        this.currentChildrenPage = page;
        var type = "children";
        containerId = type+"Container";
        displayHoldMessage("#" + type + "Result");  
        var tthis = this;
        swagger.apis.ontologies.getChildrenById({format: DEFAULTAPIFORMAT, id: ModalContext.id , pageSize: pageSize, page: page},
        {responseContentType: 'application/json'}, function (data) {
            sparqljson = data.data;
            resultId = type + "Result";
            displayResult(resultId, sparqljson);
            $("tr.odd").ready(function () {
                pageBtnsId = type + "PageBtns";
                tthis.displayInformation(data, page, resultId, pageBtnsId, "searchChildrenById");
                processHtmlResult("ontology");
            });
        });
    },    
    searchQtlsIdAssociatedWithOntoId : function(page) {
        this.currentChildrenPage = page;
        var type = "qtl";
        containerId = type+"Container";
        displayHoldMessage("#" + type + "Result");
        var tthis = this;
        swagger.apis.qtl.getQtlsIdAssociatedWithOntoId({format: DEFAULTAPIFORMAT, ontoId: ModalContext.id , pageSize: pageSize, page: page},
        {responseContentType: 'application/json'}, function (data) {
            sparqljson = data.data;
            resultId = type + "Result";
            displayResult(resultId, sparqljson);
            $("tr.odd").ready(function () {
                pageBtnsId = type + "PageBtns";
                tthis.displayInformation(data, page, resultId, pageBtnsId, "searchQtlsIdAssociatedWithOntoId");
                processHtmlResult(type);
            });
        });
    },
    searchProteinIdAssociatedWithOntoId: function(page) {
        this.currentChildrenPage = page;
        var type = "protein";
        containerId = type+"Container";
        displayHoldMessage("#" + type + "Result");  
        var tthis = this;
        swagger.apis.protein.getProteinIdAssociatedWithOntoId({format: DEFAULTAPIFORMAT, ontoId: ModalContext.id , pageSize: pageSize, page: page},
        {responseContentType: 'application/json'}, function (data) {
            sparqljson = data.data;
            resultId = type + "Result";
            displayResult(resultId, sparqljson);
            $("tr.odd").ready(function () {
                pageBtnsId = type + "PageBtns";
                tthis.displayInformation(data, page, resultId, pageBtnsId, "searchProteinIdAssociatedWithOntoId");
                processHtmlResult(type);
            });
        });
    }, 
    displayInformation: function(data, page, where, pageBtnsId, functionName) {
        nbResults = data.obj["results"]["bindings"].length;
        previousBtnId = "previousPage";
        nextBtnId = "nextPage";
        addNavButtons(nbResults, page, where, previousBtnId, nextBtnId, String(functionName));
//        $(".modal-pagination-top" + " #" + previousBtnId + '-top').attr("onclick", "invoke('"+ functionName + "', " + (page - 1) + ")");
//        $(".modal-pagination-top" + " #" + nextBtnId + '-top').attr("onclick", "invoke('"+ functionName + "', " + (page + 1) + ")");
//        $(".modal-pagination-bottom" + "#" + previousBtnId + '-bottom').attr("onclick", "invoke('"+ functionName + "', " + (page - 1) + ")");
//        $(".modal-pagination-bottom" + "#" + nextBtnId + '-bottom').attr("onclick", "invoke('"+ functionName + "', " + (page + 1) + ")");
    },
};

</script>
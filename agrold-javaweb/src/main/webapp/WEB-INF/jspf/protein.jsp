<%-- 
    Document   : gene
    Created on : Sep 7, 2015, 3:04:42 PM
    Author     : tagny
--%>
<!--div id="header"></div-->
<script type="text/javascript">
var protein = {
    currentGenePage : 0,
    currentNeighborPage : 0,
    currentQtlPage : 0,
    currentOntologyPage : 0,
    html:'<nav id="proteinPage" class="nav nav-tabs flex-column flex-sm-row advs">\
                <div id="geneContainer">\
                    <span id="genePageBtns" class="pageNavBtns"><a class="flex-sm-fill text-sm-center nav-link active o-geneResult" href="javascript:void(0)" id="gene"> is encoded by </a></span>\
                </div>\
                <div id="qtlContainer">\
                    <span id="qtlPageBtns" class="pageNavBtns"><a class="flex-sm-fill text-sm-center nav-link active o-qtlResult" href="javascript:void(0)" id="qtl"> QTL</a></span>\
                </div>\
                <div id="ontologyContainer">\
                    <span id="ontologyPageBtns" class="pageNavBtns"><a class="flex-sm-fill text-sm-center nav-link active o-ontologyResult" href="javascript:void(0)" id="ontology"> Ontology </a></span>\
                </div>\
                <div id="graphViewContainer">\
                       <span id="graphViewPageBtns"><a class="flex-sm-fill text-sm-center nav-link o-graphViewResult" href="javascript:void(0)" id="graphView"> View as graph </a></span>\
                   </div>\
                <!--div id="publicationContainer">\
                    <span id="publicationPageBtns" class="pageNavBtns"><a class="flex-sm-fill text-sm-center nav-link active o-publicationResult" href="javascript:void(0)" id="publication"> Publications </a></span>\
                </div-->\
            </nav>\
        <div id="geneResult" class="o-panel o-active"></div>\
        <div id="qtlResult" class="o-panel"></div>\
        <div id="ontologyResult" class="o-panel"></div>\
        <div class="o-panel" id="graphViewResult"></div>\
        <!--div id="publicationResult" class="o-panel"></div-->',
uri: "",
        getDescription: function(uri){
            this.uri = uri;
            var sparql = 'PREFIX agrold:<http://www.southgreen.fr/agrold/vocabulary/> \
PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> \
SELECT distinct  ?Id ?Name ?Description (?entity AS ?Uri) \
WHERE { \
  VALUES ?entity{ \
    <' + uri + '> \
  } \
?entity agrold:description ?Description .  \
OPTIONAL{?entity rdfs:label ?Name .} \
BIND(REPLACE(str(?entity), \'^.*(#|/)\', \"\") AS ?Id) \
}';

        var query = sparqlEndpoint + "?query=" + encodeURIComponent(sparql) + "&format=application/json";
        var tthis= this;
        $.get(query, function (json) {
            DBG = json;
            WaitingModal(1);
            dispalyHeader("protein", json);
            if(typeof (json["results"]["bindings"][0]) !== 'undefined')
                ModalContext.id = json["results"]["bindings"][0]["Id"]["value"];
            else
                ModalContext.notFound();
            console.log(json);
            console.log("# -- CALL OF ADDEVENT : this.id" + tthis.id);
            tthis.addEvents();
            console.log('Chargement Terminé');
            $('#result-modal #gene').click();
        });
    },
    addEvents :function() {
        $("#gene").attr("onclick", "invoke('searchGenesEncodingProtein'," + this.currentGenePage + ")");
        $("#qtl").attr("onclick", "invoke('searchQtlsAssociatedWithProtein'," + this.currentQtlPage + ")");
        $("#ontology").attr("onclick", "invoke('searchOntologyTermsAssociatedWithProtein'," + this.currentOntologyPage + ")");
        $("#publication").attr("onclick", "invoke('searchPublications'," + null + ")");
        $("#graphView").attr("onclick", "invoke('callViewAsGraph')");
    },
        callViewAsGraph: function () {
            viewAsGraph(this.uri, "graphViewResult");
        },
    searchGenesEncodingProtein:function(page) {
        this.currentGenePage = page;
        var type = "gene";
        var containerId = type + "Container";
        displayHoldMessage("#" + "Protein" + "Result");
        var tthis=this;
        swagger.apis.gene.getGenesEncodingProteins({format: DEFAULTAPIFORMAT, proteinId: ModalContext.id, pageSize: DEFAULT_PAGE_SIZE, page: page},
        {responseContentType: 'application/json'}, function (data) {
            var sparqljson = data.data;
            var resultId = type + "Result";
            displayResult(resultId, sparqljson);
            $("tr.odd").ready(function () {
                var pageBtnsId = type + "PageBtns";
                tthis.displayInformation(data, page, type+"result", pageBtnsId, "searchGenesEncodingProtein");
                processHtmlResult(type);
            });
        });
    },
    searchQtlsAssociatedWithProtein:function(page) {
        this.currentQtlPage = page;
        var type = "qtl";
        var containerId = type + "Container";
        displayHoldMessage("#" + type + "Result");
        var tthis=this;
        swagger.apis.qtl.getQtlsAssociatedWithProteinId({format: DEFAULTAPIFORMAT, proteinId: ModalContext.id, pageSize: DEFAULT_PAGE_SIZE, page: page},
        {responseContentType: 'application/json'}, function (data) {
            var sparqljson = data.data;
            var resultId = type + "Result";
            displayResult(resultId, sparqljson);
            $("tr.odd").ready(function () {
                var pageBtnsId = type + "PageBtns";
                tthis.displayInformation(data, page, type+"result", pageBtnsId, "searchQtlsAssociatedWithProtein");
                processHtmlResult(type);
            });
        });
    },
    searchOntologyTermsAssociatedWithProtein:function(proteinId, page) {
        currentGenePage = page;
        type = "ontology";
        containerId = "ontologyContainer";
        displayHoldMessage("#" + type + "Result");
        var tthis=this;
        swagger.apis.ontologies.getOntoTermsAssociatedWithProtein({format: DEFAULTAPIFORMAT, proteinId: ModalContext.id, pageSize: DEFAULT_PAGE_SIZE, page: page},
        {responseContentType: 'application/json'}, function (data) {
            sparqljson = data.data;
            resultId = type + "Result";
            displayResult(resultId, sparqljson);
            $("tr.odd").ready(function () {
                pageBtnsId = type + "PageBtns";
                tthis.displayInformation(data, page, type+"result", pageBtnsId, "searchOntologyTermsAssociatedWithProtein");
                processHtmlResult(type);
            });
        });
    },
    searchPublications:function(proteinId) {
        displayHoldMessage("#publicationResult");
        // get PubMed Id from G-link web service
        var tthis=this;
        swagger.apis.protein.getPublicationsOfProteinById({
            proteinId: ModalContext.id
        },{
            responseContentType: 'application/json'
        },function (data) {
            var json = data.obj;
            displayPublications(json, "publicationResult");
            /*console.log(json);
            if (json.length > 0) {
                $("#publicationResult").append("<ol></ol>");
                for (i = 0; i < json.length; i++) {
                    $("#publication").html("");
                    url = json[i]["URL"];
                    $("#publicationResult ol").append('<li id="paper'+i+'"><span>'+json[i]["Authors"]+', " <b>'+json[i]["Title"]+'</b> ", <i>'+json[i]["Journal"]+'</i>, '+json[i]["Year"]+'</span></li>');
                    $("#publicationResult ol li#paper"+i).append('<br><span>More at: <a href="' + url + '" target="_blank">' + url + '</a></span>');                    
                }
            } else {                
                $("#publicationResult").append("No publication found.")
            }*/
        });
    },
    displayInformation: function(data, page, where, functionName) {
        nbResults = data.obj["results"]["bindings"].length;
        previousBtnId = "previousPage";
        nextBtnId = "nextPage";
        addNavButtons(nbResults, page, where, previousBtnId, nextBtnId, String(functionName));
    }
}
</script>
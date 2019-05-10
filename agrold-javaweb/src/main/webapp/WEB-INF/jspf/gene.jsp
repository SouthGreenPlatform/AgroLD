<%-- 
    Document   : gene
    Created on : Sep 7, 2015, 3:04:42 PM
    Author     : tagny
--%>
<!--div id="header"></div-->
<script type="text/javascript">
    var gene = {
        currentProteinPage: 0,
        currentPathwayPage: 0,
        currentPublicationPage: 0,
        uri: "",
        getDescription: function (uri) {
            this.uri = uri;
            var sparql = 'PREFIX agrold:<http://www.southgreen.fr/agrold/vocabulary/> \
PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> \
SELECT distinct  ?Id ?Name ?Description (?entity AS ?Uri) \
WHERE { \
  VALUES ?entity{ \
    <' + uri + '> \
  } \
OPTIONAL{?entity agrold:description ?Description}   \
OPTIONAL{?entity rdfs:label ?Name .} \
BIND(REPLACE(str(?entity), \'^.*(#|/)\', "") AS ?Id) \
}';
            console.log(sparql);
            var query = sparqlEndpoint + "?query=" + encodeURIComponent(sparql) + "&format=application/json";
            var tthis = this;
            $.get(query, function (json) {
                DBG = json;
                WaitingModal(1);
                dispalyHeader("gene", json);
                if (typeof (json["results"]["bindings"][0]) !== 'undefined')
                    ModalContext.id = json["results"]["bindings"][0]["Id"]["value"];
                else
                    ModalContext.notFound();
                tthis.addEvents();
                $('#result-modal #protein').click();
            });
        },
        addEvents: function () {
            $("#protein").attr("onclick", "invoke('searchProteinsEncodedByGene'," + this.currentProteinPage + ")");
            $("#pathway").attr("onclick", "invoke('searchPathwayInWhichParticipatesGene'," + this.currentPathwayPage + ")");
            $("#publication").attr("onclick", "invoke('searchPublications'," + this.currentPublicationPage + ")");
            $("#ontology").attr("onclick", "invoke('searchOntologicalTerms'," + this.currentPublicationPage + ")");
            $("#graphView").attr("onclick", "invoke('callViewAsGraph')");
            $("#expression").attr("onclick", "invoke('viewExpression')");
            $("#moreInfos").attr("onclick", "invoke('searchMoreInformations')");
        },
        searchProteinsEncodedByGene: function (page) {
            this.currentProteinPage = page;
            var type = "protein";
            displayHoldMessage("#" + type + "Result");
            var tthis = this;
            swagger.apis.protein.getProteinsEncodedByGene({format: DEFAULTAPIFORMAT, geneId: ModalContext.id, pageSize: DEFAULT_PAGE_SIZE, page: page}, {
                responseContentType: 'application/json'
            }, function (data) {
                sparqljson = data.data;
                var resultId = type + "Result";
                displayResult(resultId, data.data);
                $("tr.odd").ready(function () {
                    pageBtnsId = type + "PageBtns";
                    tthis.displayInformation(data, page, resultId, "searchProteinsEncodedByGene");
                    processHtmlResult(type);
                });
            });
        },
        searchPathwayInWhichParticipatesGene: function (page) {
            this.currentPathwayPage = page;
            var type = "pathway";
            displayHoldMessage("#" + type + "Result");
            var tthis = this;
            swagger.apis.pathway.getPathwaysInWhichParticipatesGene(
                    {format: DEFAULTAPIFORMAT, geneId: ModalContext.id, pageSize: DEFAULT_PAGE_SIZE, page: page}, {responseContentType: 'application/json'},
            function (data) {
                sparqljson = data.data;
                var resultId = type + "Result";
                displayResult(resultId, sparqljson);
                tables = $("table.resultsTable");
                //var tableClass = type;
                $(tables[tables.length - 1]).addClass(type);
                $("tr.odd").ready(function () {
                    tthis.displayInformation(data, page, resultId, "searchPathwayInWhichParticipatesGene");
                    processHtmlResult(type);
                });
            });
        },
        viewExpression: function () {
            // URLs redirecting to remote web service displaying the expression of genes in charts
         var gene_name = ModalContext.uri.substring(ModalContext.uri.lastIndexOf('/') + 1);
         $("#expressionResult").html('<ul>\n\
         <li><a href="https://www.ebi.ac.uk/gxa/genes/' + gene_name + '" target="_blank">Expression Atlas</a></li>\n\
    <li><a href="http://expression.ic4r.org/global-search?gene=' + gene_name + '" target="_blank">IC4R Rice Expression Database</a></li>\n\
    <li><a href="http://ic4r.org/genes/IC4R-' + gene_name + '" target="_blank">IC4R  Information Commons for Rice</a></li>\n\
    </ul>');
         },
        searchPublications: function (page) {
            this.currentPathwayPage = page;
            var type = "publication";
            displayHoldMessage("#" + type + "Result");
            var tthis = this;
            swagger.apis.gene.getPublicationsOfGeneById(
                    {format: DEFAULTAPIFORMAT, geneId: ModalContext.id, pageSize: DEFAULT_PAGE_SIZE, page: page}, {responseContentType: 'application/json'},
            function (data) {
                sparqljson = data.data;
                var resultId = type + "Result";
                displayResult(resultId, sparqljson);
                tables = $("table.resultsTable");
                //var tableClass = type;
                $(tables[tables.length - 1]).addClass(type);
                $("tr.odd").ready(function () {
                    // pageBtnsId = "" + "PageBtns";
                    tthis.displayInformation(data, page, resultId, "searchPublications:");
                    //processHtmlResult(type);
                });
            });
        },
        searchOntologicalTerms: function () {
            displayHoldMessage("#ontologyResult");
            // get Gene Ontology annotations from Gramene
            var type = "ontology";
            displayHoldMessage("#" + type + "Result");
            swagger.apis.ontologies.getOntoTermsAssociatedWithGene(
                    {format: ".json", geneId: ModalContext.id},
            {responseContentType: 'application/json'},
            function (data) {
                if (data.obj.length < 2) {
                    $("#ontologyResult").html('No associated Terms have been found.');
                    return;
                }
                $("#ontologyResult").html('<table id="ontoResultTable"  class="display compact"></table>');
                for (i = 0; i < data.obj.length; i++) {
                    delete data.obj[i].subset; // suppression de la colonne "subset"
                }
                simpleDataDisplay(data.obj, "ontoResultTable");
            }
            );
        },
        callViewAsGraph: function () {
            viewAsGraph(this.uri, "graphViewResult");            
        },
        searchMoreInformations: function () {
            var uri = ModalContext.uri;
            $("#moreInfosResult").html('<ul></ul>');
            //$("#moreInfosResult ul").append('<li><a href="https://www.ebi.ac.uk/gxa/genes/' + uri.substring(uri.lastIndexOf('/') + 1) + '" target="_blank">Expression Atlas</a></li>');
            swagger.apis.gene.getSeeAlsoByURI(
                    {format: ".json", geneUri: this.uri},
            {responseContentType: 'application/json'},
            function (data) {
                var uris = data.obj;
                console.log("searchMoreInformations: " + JSON.stringify(uris));
                for (i = 0; i < uris.length; i++) {
                    $("#moreInfosResult ul").append('<li><a href="' + uris[i].link + '" target="_blank">' + uris[i].link + '</a></li>');
                }
            });
        },
        displayInformation: function (data, page, where, functionName) {
            nbResults = data.obj["results"]["bindings"].length;
            previousBtnId = "previousPage";
            nextBtnId = "nextPage";
            addNavButtons(nbResults, page, where, previousBtnId, nextBtnId, String(functionName));
        },
        html: '<nav id="genePage" class="nav nav-tabs flex-column flex-sm-row advs">\
                   <div id="proteinContainer">\
                       <span id="proteinPageBtns" class="pageNavBtns"><a class="flex-sm-fill text-sm-center nav-link active o-proteinResult" href="javascript:void(0)" id="protein"> Proteins </a></span>\
                   </div>\
                   <div id="pathwayContainer">\
                       <span id="pathwayPageBtns" class="pageNavBtns"><a class="flex-sm-fill text-sm-center nav-link o-pathwayResult" href="javascript:void(0)" id="pathway"> Pathways </a></span>\
                   </div>\
                   <div id="publicationContainer">\
                       <span id="publicationPageBtns" class="pageNavBtns"><a class="flex-sm-fill text-sm-center nav-link o-publicationResult" href="javascript:void(0)" id="publication"> Publications </a></span>\
                   </div>\
                   <div id="ontologyContainer">\
                       <span id="ontologyPageBtns"><a class="flex-sm-fill text-sm-center nav-link o-ontologyResult" href="javascript:void(0)" id="ontology"> Terms associated </a></span>\
                   </div>\
                   <div id="graphViewContainer">\
                       <span id="graphViewPageBtns"><a class="flex-sm-fill text-sm-center nav-link o-graphViewResult" href="javascript:void(0)" id="graphView"> View as graph </a></span>\
                   </div>\
                   <div id="expressionContainer">\
                       <span id="expressionPageBtns"><a class="flex-sm-fill text-sm-center nav-link o-expressionResult" href="javascript:void(0)" id="expression"> Expression </a></span>\
                   </div>\
                   <div id="moreInfosContainer">\
                       <span id="moreInfosPageBtns"><a class="flex-sm-fill text-sm-center nav-link o-moreInfosResult" href="javascript:void(0)" id="moreInfos"> See also </a></span>\
                   </div>\
               </nav>\
               <div class="o-panel o-active" id="proteinResult"></div>\
               <div class="o-panel" id="pathwayResult"></div>\
               <div class="o-panel" id="publicationResult"></div>\
               <div class="o-panel" id="ontologyResult"></div>\
               <div class="o-panel" id="graphViewResult"></div>\
               <div class="o-panel" id="expressionResult"></div>\
               <div class="o-panel" id="moreInfosResult"></div>'
    };
</script>


<%-- 
    Document   : gene
    Created on : Sep 7, 2015, 3:04:42 PM
    Author     : tagny
--%>

                    <!--div id="header"></div-->
<script type="text/javascript">
    var qtl = {
        currentProteinPage: 0,
        html: '<nav id="qtlPage" class="nav nav-tabs flex-column flex-sm-row advs">\
                    <div id="proteinContainer">\
                        <span id="proteinPageBtns" class="pageNavBtns"><a class="flex-sm-fill text-sm-center nav-link active o-parentResult" href="javascript:void(0)" id="protein">Protein associations</a></span>\
                    </div>\
                    <div id="ontologyContainer">\
                        <span id="ontologyPageBtns" class="pageNavBtns"><a class="flex-sm-fill text-sm-center nav-link o-parentResult" href="javascript:void(0)" id="ontology">Ontology associations</a></span>\
                    </div>\
                    <div id="graphViewContainer">\
                       <span id="graphViewPageBtns"><a class="flex-sm-fill text-sm-center nav-link o-graphViewResult" href="javascript:void(0)" id="graphView"> View as graph </a></span>\
                   </div>\
                </nav>\
                <div class="o-panel o-active" id="proteinResult"></div>\
                <div class="o-panel" id="ontologyResult"></div>\
                <div class="o-panel" id="graphViewResult"></div>',

        getDescription: function (uri) {
            this.uri = uri;
            var sparql = 'PREFIX agrold:<http://www.southgreen.fr/agrold/vocabulary/> \
PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> \
SELECT distinct  ?Id ?Name group_concat(distinct ?d;separator=\"; \") as ?Description (?entity AS ?Uri) \
WHERE { \
  VALUES ?entity{ \
    <' + uri + '> \
  } \
OPTIONAL{?entity agrold:has_trait ?d .}  \
OPTIONAL{?entity rdfs:label ?Name .} \
BIND(REPLACE(str(?entity), \'^.*(#|/)\', "") AS ?Id) \
}';
        console.log(sparql)

            var query = sparqlEndpoint + "?query=" + encodeURIComponent(sparql) + "&format=application/json";
            var tthis = this;
            $.get(query, function (json) {
                DBG = json;
                WaitingModal(1);
                dispalyHeader("qtl", json);
                if (typeof (json["results"]["bindings"][0]) !== 'undefined')
                    ModalContext.id = json["results"]["bindings"][0]["Id"]["value"];
                else
                    ModalContext.notFound();
                console.log(json);
                console.log("# -- CALL OF ADDEVENT : this.id" + this.id);
                tthis.addEvents();
                console.log('Chargement Terminé');
                $('#result-modal #protein').click();
            });
        },
        addEvents: function () {
            $("#protein").attr("onclick", "invoke('searchProteinsAssociatedWithQtl'," + this.currentProteinPage + ")");
            $("#ontology").attr("onclick", "invoke('searchOntologyTermsAssociatedWithQtl'," + this.currentOntologyPage + ")");
            $("#graphView").attr("onclick", "invoke('callViewAsGraph')");
        },
        callViewAsGraph: function () {
            viewAsGraph(this.uri, "graphViewResult");
        },
        searchProteinsAssociatedWithQtl: function (page) {
            this.currentGenePage = page;
            var type = "protein";
            var containerId = type + "Container";
            displayHoldMessage("#" + type + "Result");
            var tthis = this;
            swagger.apis.protein.getProteinsAssociatedWithQtl({format: DEFAULTAPIFORMAT, qtlId: ModalContext.id, pageSize: pageSize, page: page},
                    {responseContentType: 'application/json'}, function (data) {
                var sparqljson = data.data;
                var resultId = type + "Result";
                displayResult(resultId, sparqljson);
                $("tr.odd").ready(function () {
                    var pageBtnsId = type + "PageBtns";
                    tthis.displayInformation(data, page, containerId, pageBtnsId, "searchProteinsAssociatedWithQtl");
                    processHtmlResult(type);
                });
            });
        },
        searchOntologyTermsAssociatedWithQtl: function (page) {
            this.currentGenePage = page;
            var type = "ontology";
            var containerId = type + "Container";
            displayHoldMessage("#" + type + "Result");
            var tthis = this;
            swagger.apis.ontologies.getOntoTermsAssociatedWithQtl({format: DEFAULTAPIFORMAT, qtlId: ModalContext.id, pageSize: pageSize, page: page},
                    {responseContentType: 'application/json'}, function (data) {
                var sparqljson = data.data;
                var resultId = type + "Result";
                displayResult(resultId, sparqljson);
                $("tr.odd").ready(function () {
                    var pageBtnsId = type + "PageBtns";
                    tthis.displayInformation(data, page, containerId, pageBtnsId, "searchOntologyTermsAssociatedWithQtl");
                    processHtmlResult(type);
                });
            });
        },
        displayInformation: function (data, page, where, pageBtnsId, functionName) {
            var nbResults = data.obj["results"]["bindings"].length;
            var previousBtnId = "previousPage";
            var nextBtnId = "nextPage";
            addNavButtons(nbResults, page, where, previousBtnId, nextBtnId, String(functionName));
//        $("#" + type + " #" + previousBtnId).attr("onclick", functionName + '("' + pathwayId + '",' + (page - 1) + ')');
//        $("#" + type + " #" + nextBtnId).attr("onclick", functionName + '("' + pathwayId + '",' + (page + 1) + ')');
        }
    };

</script>
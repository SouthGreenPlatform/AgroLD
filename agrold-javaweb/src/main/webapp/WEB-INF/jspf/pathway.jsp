<%-- 
    Document   : gene
    Created on : Sep 7, 2015, 3:04:42 PM
    Author     : tagny
--%>
<script type="text/javascript">
    var pathway = {
        currentGenePage: 0,
        html: '<nav id="pathwayPage" class="nav nav-tabs flex-column flex-sm-row advs">\
                    <div id="geneContainer">\
                        <span id="genePageBtns" class="pageNavBtns">\
                            <a class="flex-sm-fill text-sm-center nav-link active o-geneResult"  href="javascript:void(0)" id="gene">Participating genes</a>\
                        </span>\
                    </div>\
                    <div id="graphViewContainer">\
                       <span id="graphViewPageBtns"><a class="flex-sm-fill text-sm-center nav-link o-graphViewResult" href="javascript:void(0)" id="graphView"> View as graph </a></span>\
                   </div>\
                </nav>\
                <div class="o-panel o-active" id="geneResult"></div>\
                <div class="o-panel" id="graphViewResult"></div>',
        getDescription: function (uri) {
            this.uri = uri;
            var sparql = 'PREFIX agrold:<http://www.southgreen.fr/agrold/vocabulary/> \
PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> \
PREFIX meaning:<http://purl.obolibrary.org/obo/IAO_0000115> \
SELECT distinct  ?Id ?Name (?entity AS ?Uri) \
WHERE { \
  VALUES ?entity{ \
    <' + uri + '> \
  } \
OPTIONAL{?entity rdfs:label ?Name .} \
BIND(REPLACE(str(?entity), \'^.*(#|/)\', \"\") AS ?Id)\
}';
            console.log(sparql);
            var query = sparqlEndpoint + "?query=" + encodeURIComponent(sparql) + "&format=application/json";
            var tthis = this;
            $.get(query, function (json) {
                DBG = json;
                WaitingModal(1);
                dispalyHeader("pathway", json);
                if (typeof (json["results"]["bindings"][0]) !== 'undefined')
                    ModalContext.id = json["results"]["bindings"][0]["Id"]["value"];
                else
                    ModalContext.notFound();
                tthis.addEvents();
                $('#result-modal #gene').click();
            });
        },
        addEvents: function () {
            $("#gene").attr("onclick", "invoke('searchParticipatingGenes'," + this.currentGenePage + ")");
            $("#graphView").attr("onclick", "invoke('callViewAsGraph')");
        },
        callViewAsGraph: function () {
            viewAsGraph(this.uri, "graphViewResult");
        },
        searchParticipatingGenes: function (page) {
            this.currentGenePage = page;
            var type = "gene";
            var containerId = type + "Container";
            displayHoldMessage("#" + type + "Result");
            var tthis = this;
            swagger.apis.gene.getGenesByPathways({format: DEFAULTAPIFORMAT, pathwayId: ModalContext.id, pageSize: pageSize, page: page},
                    {responseContentType: 'application/json'}, function (data) {
                var sparqljson = data.data;
                var resultId = type + "Result";
                displayResult(resultId, sparqljson);
                $("tr.odd").ready(function () {
                    var pageBtnsId = type + "PageBtns";
                    tthis.displayInformation(data, page, type + "Result", pageBtnsId, "searchParticipatingGenes");
                    processHtmlResult(type);
                });
            });
        },
        displayInformation: function (data, page, where, pageBtnsId, functionName) {
            var nbResults = data.obj["results"]["bindings"].length;
            var previousBtnId = "previousPage";
            var nextBtnId = "nextPage";
            addNavButtons(nbResults, page, where, previousBtnId, nextBtnId, String(functionName));
        }
    };
</script>
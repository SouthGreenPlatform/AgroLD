<%-- 
        Document   : documentation
        Created on : Jul 16, 2015, 9:47:05 AM
        Author     : tagny
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <!-- Script for google analytic -->
    <script>
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-88660031-1', 'auto');
        ga('send', 'pageview');

    </script>
    <head>
        <title>AgroLD:Documentation</title>
        <jsp:include page="includes.html"></jsp:include>
            <link rel="stylesheet" type="text/css" href="styles/sidebar.css">
            <style type="text/css">
                .tg  {border-collapse:collapse;border-spacing:0; border: 3px;}
                .tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
                .tg th{font-weight: bold; font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
                .tg .tg-s6z2{text-align:center}           
                div.fixed {
                    position: fixed;
                    left: inherit;
                    padding: 3px;
                    width: 15%;
                    background-color: white;
                    border-radius: 5px;
                    border: 2px solid #3cb0fd!important;
                }
                div.fixed a {
                    text-decoration: none;
                    font-size: 16px;                
                }
                div.fixed a:hover {
                    font-weight: bold;
                }
                div.fixed li:hover {
                    background-color: #DCE3DF;
                }
                div.fixed li {list-style-type: none;}
                div.fixed li:before {
                    content: "\A4\ "; /* caractère UTF-8 */
                }
                div.main {

                }
                div.main thead tr{
                    color: #ffffff;               
                    background-color: #2671A2;
                }
            </style>
        </head>
        <body>        
        <jsp:include page="header.jsp"></jsp:include>
            <div id="wrapper" class="toggled">

                <div id="sidebar-wrapper">
                    <ul class="sidebar-nav">
                        <li class="sidebar-brand user-ban">
                            <div class="col-md-12">
                                <img class="docu" src="images/docu.png">
                            </div>
                        </li>
                        <li>
                            <a href="#species" class="fkfk checkMe"> <i class="fa fa fa-circle-o"></i>&nbsp;&nbsp;Species</a>
                        </li>
                        <li>
                            <a href="#ontologies" class="checkMe"> <i class="fa fa-code-fork"></i>&nbsp;&nbsp;Ontologies</a>
                        </li>
                        <li>
                            <a href="#sources" class="checkMe"> <i class="fa fa-database"></i>&nbsp;&nbsp;Data sources</a>
                        </li>
                        <li>
                            <a href="#break-down" class="checkMe"> <i class="fa fa-crosshairs"></i>&nbsp;&nbsp;Species break-down</a>
                        </li>
                        <li>
                            <a href="#graphs" class="checkMe"> <i class="fa fa-circle-o-notch"></i>&nbsp;&nbsp;Graphs names</a>
                        </li>
                        <li>
                            <a href="#uri" class="checkMe"> <i class="fa fa-ellipsis-h"></i>&nbsp;&nbsp;URIs</a>
                        </li>
                    </ul>
                </div>
                <div class="container-fluid arian-thread">
                    <div class="info_title">
                        <div class="container pos-l">Help > <span class="active-p">Documentation</span></div>
                    </div>
                </div>
                <div class="foowrap">
                    <div class="container main">
                        <p>This page provides a summary on the species, data sources and URI patterns.</p>
                        <h4 class="dib" id="species">AgroLD includes data on the following species on: </h4>
                        <ul>
                            <li>Arabidopsis thaliana (NCBI Taxon ID: 3702)</li>
                            <li>Oryza species:
                                <ul>
                                    <li>Oryza barthii (NCBI Taxon ID: 65489)</li>
                                    <li>Oryza brachyantha (NCBI Taxon ID: 4533)</li>
                                    <li>Oryza glaberrima (NCBI Taxon ID: 4538)</li>
                                    <li>Oryza meridionalis (NCBI Taxon ID: 40149)</li>
                                    <li>Oryza sativa (NCBI Taxon ID: 4530)
                                        <ul>
                                            <li>Oryza sativa indica (NCBI Taxon ID: 39946)</li>
                                            <li>Oryza sativa japonica (NCBI Taxon ID: 39947)</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li>Sorghum bicolor (NCBI Taxon ID: 4558)</li>
                            <li>Triticum species:
                                <ul>
                                    <li>Triticum aestivum (NCBI Taxon ID: 4565)</li>
                                    <li>Triticum urartu (NCBI Taxon ID: 4572)</li>                                
                                </ul>
                            </li>
                            <li>Zea mays (NCBI Taxon ID: 4577)</li>
                        </ul>
                        <h4 class="dib" id="ontologies">Ontologies in AgroLD:</h4>
                        <p>The OWL versions of the ontologies have been loaded to AgroLD. The original namespaces and URIs 
                            have been retained.
                        </p>
                        <table border="1" class="tg">
                            <thead>
                                <tr>
                                    <th>Ontology</th>
                                    <th>Website</th>
                                    <th>Example(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Gene Ontology (GO)</td>
                                    <td><a href="http://geneontology.org/" target="_blank">http://geneontology.org/</a></td>
                                    <td><a href="http://purl.obolibrary.org/obo/GO_0008150" target="_blank">http://purl.obolibrary.org/obo/GO_0008150</a></td>
                                </tr>
                                <tr>
                                    <td>Plant Ontology (PO)</td>
                                    <td rowspan="3"><a href="http://planteome.org/" target="_blank">http://planteome.org/</a></td>
                                    <td><a href="http://purl.obolibrary.org/obo/PO_0025131" target="_blank">http://purl.obolibrary.org/obo/PO_0025131</a></td>
                                </tr>
                                <tr>
                                    <td>Plant Trait Ontology (TO)</td>
                                    <td><a href="http://purl.obolibrary.org/obo/TO_0000387" target="_blank">http://purl.obolibrary.org/obo/TO_0000387</a></td>
                                </tr>
                                <tr>
                                    <td>Plant Environment Ontology (EO)</td>
                                    <td><a href="http://purl.obolibrary.org/obo/EO_0007359" target="_blank">http://purl.obolibrary.org/obo/EO_0007359</a></td>
                                </tr>
                                <tr>
                                    <td>Sequence Ontology (SO)</td>
                                    <td rowspan="4"><a href="http://www.berkeleybop.org/ontologies/" target="_blank">http://www.berkeleybop.org/ontologies/</a></td>
                                    <td><a href="http://purl.obolibrary.org/obo/SO_0000104" target="_blank">http://purl.obolibrary.org/obo/SO_0000104</a></td>
                                </tr>
                                <tr>
                                    <td>Phenotype and Attribute Ontology (PATO)</td>
                                    <td rowspan="4"><a href="https://github.com/pato-ontology/pato/" target="_blank"></a>https://github.com/pato-ontology/pato/</td>
                                    <td><a href="http://purl.obolibrary.org/obo/PATO_0000462" target="_blank">http://purl.obolibrary.org/obo/PATO_0000462</a></td>
                                </tr>
                                <tr>
                                    <td>NCBI Taxonomy</td>
                                    <td><a href="http://purl.obolibrary.org/obo/NCBITaxon_4565" target="_blank">http://purl.obolibrary.org/obo/NCBITaxon_4565</a></td>
                                </tr>
                                <tr>
                                    <td>Evidence code Ontology</td>
                                    <td><a href="http://purl.obolibrary.org/obo/ECO_0000033" target="_blank">http://purl.obolibrary.org/obo/ECO_0000033</a></td>
                                </tr>
                                <tr>
                                    <td>FALDO: Feature Annotation Location Description Ontology</td>
                                    <td rowspan="4"><a href="http://biohackathon.org/resource/faldo" target="_blank">http://biohackathon.org/resource/faldo</a></td>
                                    <td><a href="http://biohackathon.org/resource/faldo#ExactPosition" target="_blank">http://biohackathon.org/resource/faldo#ExactPosition</a></td>
                                </tr>
                                <tr>
                                    <td>The Interaction Network Ontology (INO) </td>
                                    <td rowspan="4"><a href="https://github.com/INO-ontology/ino" target="_blank">https://github.com/INO-ontology/ino</a></td>
                                    <td><a href="http://purl.obolibrary.org/obo/INO_0000113" target="_blank">http://purl.obolibrary.org/obo/INO_0000111</a></td>
                                </tr>
                                 <tr>
                                    <td>The OBO Relations Ontology (RO) </td>
                                    <td rowspan="4"><a href="https://github.com/oborel/obo-relations" target="_blank">https://github.com/oborel/obo-relations</a></td>
                                    <td><a href="http://purl.obolibrary.org/obo/RO_0002408" target="_blank">http://purl.obolibrary.org/obo/RO_0002408</a></td>
                                </tr>
                                 <tr>
                                    <td>The Semanticscience Integrated Ontology (SIO)</td>
                                    <td rowspan="4"><a href="https://github.com/MaastrichtU-IDS/semanticscience" target="_blank">https://github.com/MaastrichtU-IDS/semanticscience</a></td>
                                    <td><a href="http://semanticscience.org/resource/SIO_000061" target="_blank">http://semanticscience.org/resource/SIO_000061</a></td>
                                </tr>
                                  <tr>
                                    <td>ORTH -  the orthology ontology </td>
                                    <td rowspan="4"><a href="https://qfo.github.io/OrthologyOntology/" target="_blank">https://qfo.github.io/OrthologyOntology</a></td>
                                    <td><a href="http://purl.org/net/orth#OrthologsCluster" target="_blank">http://purl.org/net/orth#OrthologsCluster</a></td>
                                </tr>
                                   <tr>
                                    <td> VOCAB -  the AgroLD schema </td>
                                    <td rowspan="4"><a href="https://github.com/SouthGreenPlatform/AgroLD_ETL/blob/master/model/agrold_schema.owl" target="_blank">Schema</a></td>
                                    <td><a href="http://purl.org/net/orth#OrthologsCluster" target="_blank">http://purl.org/net/orth#OrthologsCluster</a></td>
                                </tr>
                            </tbody>
                        </table>
                        <h4 class="dib" id="sources">Data sources in AgroLD:</h4>
                        <table border="1" class="tg">
                            <thead>
                                <tr>
                                    <th>Data source</th>
                                    <th>Information</th>
                                    <th>Website</th>
                                    <th>Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Gramene</td>
                                    <td>Gene, QTL, Pathways and ontology associations (PO, TO and EO)</td>
                                    <td><a href="http://www.gramene.org"  target="_blank">www.gramene.org</a></td>
                                    <td>In the future versions, ontology associations will be taken from the Planteome project (<a href="http://planteome.org/" target="_blank">http://planteome.org/</a>)</td>
                                </tr>
                                <tr>
                                    <td>GOA</td>
                                    <td>Gene Ontology associations</td>
                                    <td><a href="http://www.ebi.ac.uk/GOA" target="_blank">www.ebi.ac.uk/GOA</a></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>UniprotKB</td>
                                    <td>Protein Information</td>
                                    <td><a href="http://www.uniprot.org" target="_blank">www.uniprot.org</a></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>GreenPhylDB</td>
                                    <td>Web resource for phylogenetic-based approach to predict homologous relationships.</td>
                                    <td><a href="http://www.greenphyl.org" target="_blank">www.greenphyl.org</a></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Oryza Tag Line</td>
                                    <td>Database consists of phenotypic data resulting from the evaluation of the Génoplante rice insertion line library.</td>
                                    <td><a href="http://oryzatagline.cirad.fr" target="_blank">oryzatagline.cirad.fr</a></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>OryGenesDB</td>
                                    <td>Database for sequence information resulting from the T-DNA and Ds flanking sequence tags FSTs. Also contains information on cDNA full length, EST and Markers</td>
                                    <td><a href="http://orygenesdb.cirad.fr" target="_blank">orygenesdb.cirad.fr</a></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>TropGeneDB</td>
                                    <td>Database for genomic, genetic and phenotypic information about tropical crops.</td>
                                    <td><a href="http://tropgenedb.cirad.fr" target="_blank">tropgenedb.cirad.fr</a></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                        <h4 class="dib" id="break-down">Species specific break down of the data sources:</h4>

                        <table class="tg">
                            <thead>
                                <tr>
                                    <th colspan="2" rowspan="2">Data<br>Sources</th>
                                    <th colspan="5">Crop species</th>
                                </tr>
                                <tr>
                                    <td>Oryza species</td>
                                    <td >Triticum species</td>
                                    <td >A.thaliana</td>
                                    <td >S.bicolor</td>
                                    <td >Z.mays</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td rowspan="4">Ontology associations</td>
                                    <td>GOA</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                </tr>
                                <tr>
                                    <td>Gramene-PO</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                </tr>
                                <tr>
                                    <td>Gramene-TO</td>
                                    <td >&#10004;</td>
                                    <td >&nbsp;</td>
                                    <td >&#10004;</td>
                                    <td >&nbsp;</td>
                                    <td >&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>Gramene-EO</td>
                                    <td >&#10004;</td>
                                    <td >&nbsp;</td>
                                    <td >&nbsp;</td>
                                    <td >&nbsp;</td>
                                    <td >&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="2">Gramene-gene</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                </tr>
                                <tr>
                                    <td colspan="2">Gramene-QTL</td>
                                    <td >&#10004;</td>
                                    <td >&nbsp;</td>
                                    <td >&nbsp;</td>
                                    <td >&nbsp;</td>
                                    <td >&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="2">Gramene-Cyc,pathways</td>
                                    <td >&#10004;</td>
                                    <td >&nbsp;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                </tr>
                                <tr>
                                    <td colspan="2">UniprotKB</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                </tr>
                                <tr>
                                    <td colspan="2">OryGenesDB</td>
                                    <td >&#10004;</td>
                                    <td >&nbsp;</td>
                                    <td >&#10004;</td>
                                    <td >&nbsp;</td>
                                    <td >&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="2">Oryza Tag Line</td>
                                    <td >&#10004;</td>
                                    <td >&nbsp;</td>
                                    <td >&nbsp;</td>
                                    <td >&nbsp;</td>
                                    <td >&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="2">TropGeneDB</td>
                                    <td >&#10004;</td>
                                    <td >&nbsp;</td>
                                    <td >&nbsp;</td>
                                    <td >&nbsp;</td>
                                    <td >&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="2">GreenPhylDB</td>
                                    <td >&#10004;</td>
                                    <td >&nbsp;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                    <td >&#10004;</td>
                                </tr>
                            </tbody>
                        </table>
                        <h4 class="dib" id="graphs">Graph Names:</h4>
                        <p>The RDF graphs have a common name-space: <a href="http://www.southgreen.fr/agrold/" target="_blank">http://www.southgreen.fr/agrold/</a> </p>
                        <p>The list of graphs are follows:</p>
                    <table class="tg">                                                                                                                                                          200,33        44%
                                <li>http://www.southgreen.fr/agrold/qtaro.qtl</li>
                                <li>http://www.southgreen.fr/agrold/rap.msu</li>
                                <li>http://www.southgreen.fr/agrold/greenphyldb</li>
                                <li>http://www.southgreen.fr/agrold/uniprot.plants</li>
                                <li>http://www.southgreen.fr/agrold/gramene.qtl</li>
                                <li>http://www.southgreen.fr/agrold/tropgenedb</li>
                                <li>http://www.southgreen.fr/agrold/ensembl.plants</li>
                                <li>http://www.southgreen.fr/agrold/protein.annotations</li>
                                <li>http://www.southgreen.fr/agrold/qtl.annotations</li>
                                <li>http://www.southgreen.fr/agrold/msu.genes</li>
                                <li>http://www.southgreen.fr/agrold/gramene.cyc</li>
                                <li>http://www.southgreen.fr/agrold/sniplaydb</li>
                                <li>http://www.southgreen.fr/agrold/oryzabase.genes</li>
                                <li>http://www.southgreen.fr/agrold/ricenetdb</li>
                                <li>http://www.southgreen.fr/agrold/rapdb</li>
                                <li>http://www.southgreen.fr/agrold/genome.hub</li>
                                <li>http://www.southgreen.fr/agrold/plantftdb</li>
                                <li>http://www.southgreen.fr/agrold/interpro</li>
                                <li>http://www.southgreen.fr/agrold/cegresources</li>
                                <li>http://www.southgreen.fr/agrold/ncbitaxon</li>
                                <li>http://www.southgreen.fr/agrold/faldo</li>
                                <li>http://www.southgreen.fr/agrold/ino</li>
                                <li>http://www.southgreen.fr/agrold/ro</li>
                                <li>http://www.southgreen.fr/agrold/go</li>
                                <li>http://www.southgreen.fr/agrold/vocabulary</li>
                                <li>http://www.southgreen.fr/agrold/so</li>
                                <li>http://www.southgreen.fr/agrold/sio</li>
                                <li>http://www.southgreen.fr/agrold/eco</li>
                                <li>http://www.southgreen.fr/agrold/pato</li>
                                <li>http://www.southgreen.fr/agrold/po</li>
                                <li>http://www.southgreen.fr/agrold/to</li>
                        </ul>
                        <h4 class="dib" id="uri">URIs:</h4>
                        <p>To make AgroLD Linked Data compliant, de-referenceable stable URIs provided by Identifiers.org 
                            (<a href="http://identifiers.org/" target="_blank">http://identifiers.org/</a>), Ontobee (<a href="http://www.ontobee.org" target="_blank">www.ontobee.org</a>) 
                            and canonical stable URIs provided UniprotKB are used.
                        </p>

                        <p>Datasets that are not included in these registries, new URIs were minted the identifiers for these datasets take the 
                            form:
                        <pre>http://www.southgreen.fr/agrold/<b>[resource_namespace]</b>/<b>[identifier]</b></pre>
                        <b>Example:</b><br>
                        <i>http://www.southgreen.fr/agrold/<b>biocyc.pathway</b>/<b>CALVIN-PWY</b></i>
                        </p>
                        <p>
                            Similarly, properties, would be of the form: 
                        <pre>http://www.southgreen.fr/agrold/<b>[vocabulary]</b>/<b>[property]</b></pre>
                        <b>Example:</b><br>
                        <i>http://www.southgreen.fr/agrold/<b>vocabulary</b>/<b>expressed_in</b></i>
                        </p>
                    </div>
                    <div class="jump-bot"></div>
                <jsp:include page="footer.html"></jsp:include>

            </div>
        </div>
    </body>
    <script type="text/javascript">
        function juizScrollTo(element) {
            $(element).click(function () {
                var goscroll = false;
                var the_hash = $(this).attr("href");
                var regex = new RegExp("\#(.*)", "gi");
                var the_element = '';

                console.log(element);
                if (the_hash.match("\#(.+)")) {
                    the_hash = the_hash.replace(regex, "$1");

                    if ($("#" + the_hash).length > 0) {
                        the_element = "#" + the_hash;
                        goscroll = true;
                    } else if ($("a[name=" + the_hash + "]").length > 0) {
                        the_element = "a[name=" + the_hash + "]";
                        goscroll = true;
                    }

                    if (goscroll) {
                        $('html, body').animate({
                            scrollTop: $(the_element).offset().top - 59
                        }, 'slow');
                        return false;
                    }
                }
            });
        }
        juizScrollTo('a[href^="#"]');

        /* Dynamic scrollSpy for anchor navigations */
        /* JC-i 2017 */
        var Collect = [];
        function Div() {
            this.href = '';
            this.active = false;
            this.order = 0;
        }
        Div.prototype.refresh = function () {
            if (((this.order == Collect.length - 1) && ($(this.href).offset().top - $(window).scrollTop() <= 61)) || ($(this.href).offset().top - $(window).scrollTop() <= 61) && (this.order < Collect.length && $(Collect[this.order + 1].href).offset().top - $(window).scrollTop() > 61)) {
                this.active = true;
                $('a[href$="' + this.href + '"]').parent().addClass('fkfk');
            } else {
                $('a[href$="' + this.href + '"]').parent().removeClass('fkfk');
            }
        }
        function init() {
            var order = 0;
            $('.checkMe').each(function () {
                var DIV = new Div();
                DIV.href = $(this).attr('href');
                DIV.order = order;
                order++;
                DIV.refresh();
                Collect.push(DIV);
            });
        }
        $(window).scroll(function () {
            for (var i in Collect) {
                Collect[i].refresh();
            }
        });
        init();
    </script>
        <script>
        $(document).ready(function () {
            $.ajax({
                type: 'post',
                data: 'p={m:"setPageConsult",page:"documentation"}',
                url: 'ToolHistory',
                success: function (data) {
                    $('.success').html(data);
                }
            });
        });
    </script>
</html>
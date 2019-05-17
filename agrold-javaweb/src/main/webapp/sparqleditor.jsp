<%-- 
        Document   : sparqleditor
        Created on : Jul 15, 2015, 3:18:01 PM
        Author     : tagny
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>    
    <head>
        <!-- Script for google analytic -->
        <!--script>
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

        </script-->
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-70148286-1"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag() {
                dataLayer.push(arguments);
            }
            gtag('js', new Date());

            gtag('config', 'UA-70148286-1');
        </script>

        <!--script src="scripts/jquery-1.11.2.min.js" type="text/javascript"></script-->
        <!--link href="styles/style1.css" rel="stylesheet" type="text/css"/-->
        <!--link href="styles/menu1.css" rel="stylesheet" type="text/css"/-->
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AgroLD: SPARQL Query Editor</title>
        <jsp:include page="includes.html"></jsp:include>
            <!-- YasQUE pour la coloration syntaxique -->
            <link href="sparqleditor/yasqe.min.css" rel="stylesheet" type="text/css"/>
            <link href="sparqleditor/yasr.min.css" rel="stylesheet" type="text/css"/>
            <link href="intro.js-1.0.0/introjs.css" rel="stylesheet" type="text/css"/>
            <script src="intro.js-1.0.0/intro.js" type="text/javascript"></script>
            <!-- Les includes 
                       <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            -->
            <script src="scripts/lib.js"></script>
            <script type="text/javascript">

            /*<![CDATA[*/
            var lastformat = 0;
            function format_select(query_obg)
            {
                var query = query_obg.value;
                var format = query_obg.form.format;
                if ((query.match(/\bconstruct\b/i) || query.match(/\bdescribe\b/i)) && lastformat != 2) {
                    for (var i = format.options.length; i > 0; i--)
                        format.options[i] = null;
                    format.options[1] = new Option('Turtle', 'text/turtle');
                    format.options[2] = new Option('Pretty-printed Turtle (slow!)', 'application/x-nice-turtle');
                    format.options[3] = new Option('RDF/JSON', 'application/rdf+json');
                    format.options[4] = new Option('RDF/XML', 'application/rdf+xml');
                    format.options[5] = new Option('N-Triples', 'text/plain');
                    format.options[6] = new Option('XHTML+RDFa', 'application/xhtml+xml');
                    format.options[7] = new Option('ATOM+XML', 'application/atom+xml');
                    format.options[8] = new Option('ODATA/JSON', 'application/odata+json');
                    format.options[9] = new Option('JSON-LD', 'application/x-json+ld');
                    format.options[10] = new Option('HTML (list)', 'text/x-html+ul');
                    format.options[11] = new Option('HTML (table)', 'text/x-html+tr');
                    format.options[12] = new Option('HTML+Microdata (inconvenient)', 'text/html');
                    format.options[13] = new Option('HTML+Microdata (pretty-printed table)', 'application/x-nice-microdata');
                    format.options[14] = new Option('Turtle-style HTML (for browsing, not for export)', 'text/x-html-nice-turtle');
                    format.options[15] = new Option('Microdata/JSON', 'application/microdata+json');
                    format.options[16] = new Option('CSV', 'text/csv');
                    format.options[17] = new Option('TSV', 'text/tab-separated-values');
                    format.options[18] = new Option('TriG', 'application/x-trig');
                    format.selectedIndex = 1;
                    lastformat = 2;
                }
                if (!(query.match(/\bconstruct\b/i) || query.match(/\bdescribe\b/i)) && lastformat != 1) {
                    for (var i = format.options.length; i > 0; i--)
                        format.options[i] = null;
                    format.options[1] = new Option('HTML', 'text/html');
                    format.options[2] = new Option('Spreadsheet', 'application/vnd.ms-excel');
                    format.options[3] = new Option('XML', 'application/sparql-results+xml');
                    format.options[4] = new Option('JSON', 'application/sparql-results+json');
                    format.options[5] = new Option('Javascript', 'application/javascript');
                    format.options[6] = new Option('Turtle', 'text/turtle');
                    format.options[7] = new Option('RDF/XML', 'application/rdf+xml');
                    format.options[8] = new Option('N-Triples', 'text/plain');
                    format.options[9] = new Option('CSV', 'text/csv');
                    format.options[10] = new Option('TSV', 'text/tab-separated-values');
                    format.selectedIndex = 1;
                    lastformat = 1;
                }
            }
            function format_change(e)
            {
                var format = e.value;
                var cxml = document.getElementById("cxml");
                if (!cxml)
                    return;
                if ((format.match(/\bCXML\b/i)))
                {
                    cxml.style.display = "block";
                } else {
                    cxml.style.display = "none";
                }
            }
            function savedav_change(e)
            {
                var savefs = document.getElementById("savefs");
                if (!savefs)
                    return;
                if (e.checked)
                {
                    savefs.style.display = "block";
                } else
                {
                    savefs.style.display = "none";
                }
            }
            function sparql_endpoint_init()
            {
                var cxml = document.getElementById("cxml");
                if (cxml)
                    cxml.style.display = "none";
                var savefs = document.getElementById("savefs");
                if (savefs)
                    savefs.style.display = "none";
            }
            /*]]>*/
            </script>
            <script src="scripts/querypatterns.js"></script>        
            <style>
                #sparql{
                    width: 62%; float:left;
                    border-radius: 5px;
                    /*ackground: #DDD;*/
                    padding-top: 15px;
                    position: relative; 
                    border: 2px solid #3cb0fd!important;
                }
                #patternslist{
                    overflow-y: auto;
                    width: 34%; float:right;
                    min-height: 420px;
                    border-radius: 5px;
                    /*ackground: #ECDCCE;*/
                    padding: 5px;
                    border: 2px solid #00B5AD!important;
                }
                h4{
                    font-weight: bolder;
                }
                form{
                    /*ackground-color: #f4f4f4;*/
                    font-size: 95%;
                    width: 98%;
                    padding: 5px
                }
                input.aparameter{
                    color: #085; 
                    /*ont-family:monospace;*/
                    width: 50%;
                }
                #cmd-container{
                    background:#3cb0fd!important;
                    color: white;
                    top: 0;right:0; 
                    position: absolute;
                    width: 22%;
                    padding: 5px 5px 5px 5px;
                    z-index: 10;
                    font-size: .875rem;
                    border-radius: 5px;
                    border: 2px solid #3cb0fd!important;
                }  
            </style>            
        </head>
        <!--body onload="sparql_endpoint_init();//selectPattern(0);"-->
        <body>
        <jsp:include page="header.jsp"></jsp:include>
            <div class="container-fluid arian-thread">
                <div class="info_title">
                    <div class="container pos-l">Search > <span class="active-p">SPARQL Query Editor</span></div>
                </div>
            </div>
            <div class="foowrap">
                <!--div class="container-fluid spbg">
                    <div class="container">
                        <div id="header" class="sparqlInfo">
                            <div class="col-sm-6">
                                <p>
                                    Select a sample query and run it. The sample query could be used to modify the parameters accordingly. Alternatively, enter SPARQL code in the query box below.
                                </p>                               
                            </div>
                            <div class="col-sm-6">
                                <button href="javascript:void(0);" onclick="javascript:introJs().setOption('showProgress', true).start();" class="yasrbtn" style="background-color: #00B5AD!important; color: white; font-weight: bold">Watch how!</button>                        
                            </div>                            
                        </div>
                    </div>
                </div-->
                <div class="container-fluid">
                    <section>
                        Select a sample query and run it. The sample query could be used to modify the parameters accordingly. Alternatively, enter SPARQL code in the query box below.<button href="javascript:void(0);" onclick="javascript:introJs().setOption('showProgress', true).start();" class="yasrbtn" style="background-color: #00B5AD!important; color: white; font-weight: bold">Watch how!</button>
                        <div id="main" style="overflow:auto;">
                            <div id="sparql">
                                <div id="cmd-container" data-step="6" data-intro="Hand over to see what shortcuts are available">
                                    <b id="cmds">KEYBOARD COMMANDS</b>
                                    <ul id="cmds" style="display: none; font-weight: bold">
                                        <li><code>[Ctrl|Cmd]-Space</code>: Trigger Autocompletion</li>
                                        <li><code>[Ctrl|Cmd]-D</code> and <code>[Ctrl|Cmd]-D</code>: Delete current/selected line(s)</li>
                                        <li><code>[Ctrl|Cmd]-/</code>: Comment or uncomment current/selected line(s)</li>
                                        <li><code>[Ctrl|Cmd]-Alt-Down</code>: Copy line down</li>
                                        <li><code>[Ctrl|Cmd]-Alt-Up</code>: Copy line up</li>
                                        <li><code>[Ctrl|Cmd]-Shift-F</code>: Auto-format/indent selected lines</li>
                                        <li><code>[Ctrl|Cmd]-]</code>: Indent current/selected line(s) more</li>
                                        <li><code>[Ctrl|Cmd]-[</code>: Indent current/selected line(s) less</li>
                                        <li><code>[Ctrl|Cmd]-S</code>: Save current query in local storage</li>
                                        <li><code>[Ctrl|Cmd]-Enter</code>: Execute Query</li>
                                        <li><code>F11</code>: Set query editor full-screen (or leave full-screen)</li>
                                        <li><code>Esc</code>: Leave full-screen</li>
                                    </ul>
                                </div>
                                <div id="parameters">
                                </div>
                                <form action="http://sparql.southgreen.fr" method="get" data-step="2" data-intro="watch & edit its query here!">                                                      
                                    <label for="query"><b style="font-size: 15px">Query Text</b></label><br />
                                    <textarea rows="15" cols="76" name="query" id="query" onchange="format_select(this)" onkeyup="format_select(this)">
                                    <%
                                        if (request.getParameter("query") == null) {
                                    %>
PREFIX agrold:<http://www.southgreen.fr/agrold/>
SELECT * 
WHERE{
    GRAPH ?graph {
        ?subject ?property ?object.
    }
    filter(REGEX(?graph, CONCAT("^", str(agrold:))))
} 
LIMIT 10
                                        <%
                                            } else {
                                                out.println(request.getParameter("query"));
                                            }
                                        %>
                            </textarea>
                            <div id="showcase"></div>
                            <table width="100%"><tr>
                                    <td style="background-color: #d1d1d1">
                                        <label for="timeout" class="n">Execution timeout</label>
                                        <input name="timeout" class="yasrbtn" id="timeout" type="text" value="20000" onchange="//setTimeout(this)" style="width:70px"/> milliseconds
                                        <span class="info"><i>(values less than 1000 are ignored)</i></span>
                                    </td>
                                    <td align="right" style="background-color: #f7f7f7"  data-step="5" data-intro="or download directly your results in the format of your choice">
                                        <label for="format" class="n">Results Format</label>
                                        <select name="format" id="format"  onchange="format_change(this)">
                                            <option value="auto" >Auto</option>
                                            <option value="text/html">HTML</option>
                                            <option value="application/vnd.ms-excel" >Spreadsheet</option>
                                            <option value="application/sparql-results+xml" >XML</option>
                                            <option value="application/sparql-results+json" >JSON</option>
                                            <option value="application/javascript" >Javascript</option>
                                            <option value="text/turtle" >Turtle</option>
                                            <option value="application/rdf+xml" selected="selected">RDF/XML</option>
                                            <option value="text/plain" >N-Triples</option>
                                            <option value="text/csv" >CSV</option>
                                            <option value="text/tab-separated-values" >TSV</option>
                                        </select>                                    
                                        <input type="submit" class="yasrbtn" value="Download Results"/>
                                    </td>
                                </tr></table>
                        </form>    
                        <div>
                            <table width="100%">            
                                <tr>
                                    <td align="left" data-step="7" data-intro="You can save your query in a file and then ... " style="background-color: #f7f7f7">Filename to Save As:
                                        <input id="inputFileNameToSaveAs" value="query.sparql"></input>
                                        <button class="yasrbtn" onclick="saveTextAsFile(document.getElementById('inputFileNameToSaveAs').value);">Save Query</button>
                                    </td>                                
                                    <td align="right" data-step="8" data-intro=" Load it (or any other text file containing a sparql query) later"  style="background-color: #d1d1d1">
                                        <input  type="file" id="fileToLoad" class="yasrbtn">
                                        <button class="yasrbtn" onclick="loadFileAsText(document.getElementById('fileToLoad').files[0]);">Load Selected Query File</button>
                                    <td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div id="patternslist"  data-step="1" data-intro="Select a <b>question</b> here and then ...">
                        <b style="font-size: 15px">Query Patterns</b>
                    </div>                 
                </div>  
                <div class="container-rst" style="width: 100%">
                    <div id="yasr" data-step="4" data-intro="watch your results ... ">
                        <div class="info_title" style="font-size: 19px">Results</div>
                        <canvas id="hiddenCanvas"></canvas>
                    </div>
                    <div id="push"></div> <!--add the push div here -->
                </div>             
            </section>
        </div>

    </div>
    <div class="jump-bot"></div>
    <jsp:include page="footer.html"></jsp:include>
    <script>
        // label of the choose file button
        //$(document).ready(function(){
        //$('#fileToLoad').text('Select a query file to load:');
        document.getElementById("fileToLoad").onchange = function () {
            document.getElementById("uploadFile").value = this.value;
        };
        // Display the list of patterns            
        var divpatt = document.getElementById("patternslist");
        var ol = document.createElement("ol");
        divpatt.innerHTML += "<ol>";
        for (i = 0; i < patternlabels.length; i++) {
            var li = document.createElement("li");
            li.innerHTML = patternlabels[i] + " (<a href=\"#\" onclick=\"selectPattern(" + i + ")\">select</a>)";
            ol.appendChild(li);
            //divpatt.innerHTML += //qpatterns[selectedpattern][i] + ': <input class="aparameter" value="' + qpatterns[selectedpattern][i] + '" oninput="replaceParaValue(' + "/" + qpatterns[selectedpattern][i] + "/g" + ', this)"/><br><br>';
        }
        divpatt.appendChild(ol);
    </script>      
    <script src='sparqleditor/yasr.bundled.min.js'></script>
    <script src="sparqleditor/yasqe.bundled.min.js"></script>
    <script src="sparqleditor/d3.v3.min.js"></script>
    <script src="sparqleditor/d3sparql.js"></script>
    <script src="sparqleditor/dom-to-image.min.js"></script>
    <script src="sparqleditor/graphPlugin.js"></script>
    <script type="text/javascript">
        //var yasqe = YASQE(document.getElementById("showcase"), 
        $.fn.scrollView = function () {
            return this.each(function () {
                $('html, body').animate({
                    scrollTop: $(this).offset().top
                }, 1000);
            });
        };

        var yasqe = YASQE.fromTextArea(document.getElementById('query'),
                {
                    sparql: {
                        showQueryButton: true,
                        endpoint: SPARQLENDPOINTURL,
                        collapsePrefixesOnLoad: false,
                        //persistent: true,
                        args: [{name: 'timeout', value: document.getElementById('timeout').value}],
                        callbacks: {
                            beforeSend: function (data) {
                                yasqe.options.sparql.args[0].value = document.getElementById('timeout').value;
                                //console.log(yasqe.options.sparql.args[0].value);
                            },
                            success: function (data) {
                                //console.log("success", data);
                                $('#yasr').scrollView();
                            }, //, headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT", "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, X-Codingpedia"}
                            error: function (data) {
                                $('#yasr').scrollView();
                            }
                        }
                    }
                });
        // add a plugin to draw response as graph with d3sparql
        YASR.registerOutput("graph", GraphInYASR);

        var yasr = YASR(document.getElementById("yasr"), {
            // List of enabled output plugins. The order of these plugins specifies the order of the output buttons as well
            outputPlugins: ["error", "boolean", "table", "rawResponse", "pivot", "graph"],
            //this way, the URLs in the results are prettified using the defined prefixes in the query
            getUsedPrefixes: yasqe.getPrefixesFromQuery,
            useGoogleCharts: false,
            //output: "Graph",
            //drawDownloadIcon: false,
            persistency: {
                prefix: false
            }
        });
        //link both together (YasQUE and YASR)
        yasqe.options.sparql.callbacks.complete = yasr.setResponse;
        $(document).ready(function () {
            // Handler for .ready() called.
            // add introJs attribute
            // data-step="2" data-intro="Edit it here!"
            //$("#cmd-container").insertAfter(".yasqe");
            //$("#cmd-container").insertAfter(".yasqe_buttons");
            $(".yasqe_queryButton").attr('data-step', '3');
            $(".yasqe_queryButton").attr('data-intro', 'Run and then ...');
            // show keyboard commands
            $("#cmd-container").hover(
                    function () {
                        $("ul#cmds").css("display", "");
                        $(this).css("width", "55%");
                    }, function () {
                $("ul#cmds").css("display", "none");
                $(this).css("width", "22%");
            });
            $(".fullscreenToggleBtns").click(
                    function () {
                        /*if($(".CodeMirror").hasClass("CodeMirror-fullscreen")){
                         $("#cmd-container").
                         }*/
                        $("#cmd-container").toggle();
                        //$("#cmd-container").insertAfter(".yasqe_buttons");
                    }
            );
            yasqe.options.extraKeys.F11 = function (yasqe) {
                yasqe.setOption("fullScreen", !yasqe.getOption("fullScreen"));
                $("#cmd-container").toggle();
            };
            yasqe.options.extraKeys.Esc = function (yasqe) {
                if (yasqe.getOption("fullScreen")) {
                    yasqe.setOption("fullScreen", false);
                    $("#cmd-container").toggle();
                }
            };
        });
        //console.log(yasqe.getValue());

        function saveTextAsFile(fileNameToSaveAs)
        {
            var textToWrite = yasqe.getValue();
            var textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});

            var downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.innerHTML = "Download File";
            if (window.webkitURL != null)
            {
                // Chrome allows the link to be clicked
                // without actually adding it to the DOM.
                downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            } else
            {
                // Firefox requires the link to be added to the DOM
                // before it can be clicked.
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                downloadLink.onclick = destroyClickedElement;
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
            }

            downloadLink.click();
        }

        function destroyClickedElement(event)
        {
            document.body.removeChild(event.target);
        }

        function loadFileAsText(fileToLoad)
        {
            //var fileToLoad = document.getElementById("fileToLoad").files[0];

            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent)
            {
                var textFromFileLoaded = fileLoadedEvent.target.result;
                //textarea = document.getElementById("inputTextToSave");
                yasqe.setValue(textFromFileLoaded);
            };
            fileReader.readAsText(fileToLoad, "UTF-8");
        }
        $('.yasqe_queryButton.query_valid').click(function () {
            var request = yasqe.getValue();
            //if(request!==""){
            var encoded = String(encodeURIComponent(request));
            console.log('ENCODED : ' + encoded);
            var request_ = String('p={m:"setSparqlEditor",request:"' + encoded + '"}')
            console.log('REQUEST : ' + request_);
            saveRequest(encoded);
            //}
        });
        function saveRequest(r) {
            $.ajax({
                type: 'post',
                url: 'ToolHistory',
                data: {
                    p: '{m:"setSparqlEditor"}',
                    request: r
                },
                success: function (data) {
                    $('.success').html(data);
                }, error: function (data) {
                    $('.debugme').html(data);
                }
            });
        }
    </script>
    <div class="debugme"></div>
</body>
<script>
    $(document).ready(function () {
        $.ajax({
            type: 'post',
            data: 'p={m:"setPageConsult",page:"sparqlEditor"}',
            url: 'ToolHistory',
            success: function (data) {
                $('.success').html(data);
            }
        });
    });
</script>
</html>
<!--PREFIX agrold:<http://www.southgreen.fr/agrold/>
SELECT * 
WHERE{
    GRAPH ?graph {
        ?subject ?property ?object.
    }
    filter(REGEX(?graph, CONCAT("^", str(agrold:))))
} 
LIMIT 10-->
<!--BASE <http://www.southgreen.fr/agrold/>
PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
PREFIX uniprot:<http://purl.uniprot.org/uniprot/>
SELECT distinct ?q ?hasValue ?ql ?hl
WHERE {
values (?q){(uniprot:P0C127)}
  ?q ?property ?hasValue.
  ?q rdfs:label ?ql .
  ?hasValue rdfs:label ?hl .
}
-->
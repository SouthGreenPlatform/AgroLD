<%-- 
        Document   : quicksearch
        Created on : Jul 15, 2015, 2:47:08 PM
        Author     : tagny
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

    <!-- Script for google analytic -->
    <script>
        (function(i, s, o, g, r, a, m){i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function(){
        (i[r].q = i[r].q || []).push(arguments)}, i[r].l = 1 * new Date(); a = s.createElement(o),
                m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-88660031-1', 'auto');
        ga('send', 'pageview');
    </script>
    <head>
        <title>AgroLD: Faceted quick search - by keywords</title>
        <link href="intro.js-1.0.0/introjs.css" rel="stylesheet" type="text/css"/>
        <script src="intro.js-1.0.0/intro.js" type="text/javascript"></script>
        <link href="styles/search.css" rel="stylesheet" type="text/css"/>
        <!-- Les includes -->
        <jsp:include page="includes.html"></jsp:include>
            <script type="text/javascript" src="scripts/dots.js"></script>
        </head>
        <body>
        <jsp:include page="header.jsp"></jsp:include>
            <div class="container-fluid arian-thread">
                <div class="info_title">
                    <div class="container pos-l">Search > <span class="active-p">Quick Search</span></div>
                </div>
            </div>
            <div class="foowrap">
                <div class="canvas">
                    <canvas style="width:100%;height:100%;"></canvas>
                    <section class="centering-search">
                        <div class="container-fluid Q-search">
                            <div class="container delim">
                                <div style="text-align: center">
                                    <div class="exp">
                                        <h4><b>Search and browse AgroLD</b></h4>
                                        <p>Search examples: ontological concepts - 'plant height' or 'regulation of gene expression'; gene names -
                                            'GRP2' or 'TCP12'.</p>
                                    </div>
                                </div>
                                <div id="sform">
                                    <center>
                                    <form id="search" action="http://agrold.southgreen.fr/fct/facet.vsp?cmd=text&sid=231"" method="post" target="_blank">
                                    <!--form id="search" action="http://volvestre.cirad.fr:8890/fct/facet.vsp?cmd=text&sid=231"" method="post" target="_blank"-->
                                        <div class="col-lg-6">
                                            <div class="input-group">
                                                <!--input type="text" class="form-control" placeholder="Search for..."-->
                                                <input class="keyword form-control" name="q" type="text" placeholder="Search examples: Gene names -
                                            'GRP2' or 'TCP12' or Keywords 'plant height'" data-step="1" data-intro="Type your expression and then ..."/> 
                                                <span class="input-group-btn">
                                                    <input class="btn btn-secondary" type="submit" value="Search" data-step="2" data-intro="launch the search engine!" required/>
                                                </span>
                                            </div>
                                        </div>
                                    </form>
                                    <div class="error"></div>
                                    <div class="success"></div>
                                    <span style="margin-top:30px;color:red;display:none" class="message">Please enter a keword</span>
                                    <script>
                                        $('form#search').click(function(e){
                                            var request=$(".keyword").val();
                                            console.log('request'+request);
                                             if(request==""){
                                                $('.message').show();
                                                e.stopPropagation();
                                                e.preventDefault();
                                            }else{
                                                $('.message').hide();
                                                saveRequest(request);
                                            }
                                        });
                                       
                                        function saveRequest(keyword){
                                            $.ajax({
                                                type:'post',
                                                data:'p={m:"setQuickSearch",keyword:'+keyword+'}',
                                                url:'ToolHistory',
                                                success:function(data){
                                                    $('.success').html(data);
                                                }                                                
                                            });
                                        }
                                    </script>
                                </center>
                            </div>
                        </div>
                    </div>
                </section><br>
            </div>
        </div>
    </div>
    <jsp:include page="footer.html"></jsp:include>
</body>
    <script>
        $(document).ready(function () {
            $.ajax({
                type: 'post',
                data: 'p={m:"setPageConsult",page:"quickSearch"}',
                url: 'ToolHistory',
                success: function (data) {
                    $('.success').html(data);
                }
            });
        });
    </script>
</html>

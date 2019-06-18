<%-- 
Document   : index.jsp
Created on : Jul 15, 2015, 4:29:18 PM
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
        <jsp:include page="includes.html"></jsp:include>
            <!-- Other -->

            <script src="https://npmcdn.com/tether@1.2.4/dist/js/tether.min.js"></script>
            <link href="swagger/css/typography.css" media="screen" rel="stylesheet" type="text/css"/>
            <link href="swagger/css/reset.css" media="screen" rel="stylesheet" type="text/css"/>
            <link href="swagger/css/screen.css" media="screen" rel="stylesheet" type="text/css"/>
            <link href="swagger/css/reset.css" media="print" rel="stylesheet" type="text/css"/>
            <link href="swagger/css/print.css" media="print" rel="stylesheet" type="text/css"/>        
            <script src="swagger/lib/jquery-1.8.0.min.js" type="text/javascript"></script>
            <script src="swagger/lib/jquery.slideto.min.js" type="text/javascript"></script>
            <script src="swagger/lib/jquery.wiggle.min.js" type="text/javascript"></script>
            <script src="swagger/lib/jquery.ba-bbq.min.js" type="text/javascript"></script>
            <script src="swagger/lib/handlebars-2.0.0.js" type="text/javascript"></script>
            <script src="swagger/lib/underscore-min.js" type="text/javascript"></script>
            <script src="swagger/lib/backbone-min.js" type="text/javascript"></script>
            <script src="swagger/swagger-ui.js" type="text/javascript"></script>
            <script src="swagger/lib/highlight.7.3.pack.js" type="text/javascript"></script>
            <script src="swagger/lib/marked.js" type="text/javascript"></script>
            <script src="swagger/lib/swagger-oauth.js" type="text/javascript"></script>     


            <!--script type="text/javascript">
            $(function () {
                var url = window.location.search.match(/url=([^&]+)/);
                if (url && url.length > 1) {
                    url = decodeURIComponent(url[1]);
                } else {
                    url = AGROLDAPIJSONURL; //"../swagger/swagger1.json"
                }
                window.swaggerUi = new SwaggerUi({
                    url: url,
                    dom_id: "swagger-ui-container",
                    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
                    onComplete: function (swaggerApi, swaggerUi) {
                        /*if (typeof initOAuth == "function") {
                            initOAuth({
                                clientId: "your-client-id",
                                realm: "your-realms",
                                appName: "your-app-name"
                            });
                        }
                        $('pre code').each(function (i, e) {
                            hljs.highlightBlock(e)
                        });
                        addApiKeyAuthorization();
                        banInjector();*/
                    },
                    onFailure: function (data) {
                        log("Unable to Load SwaggerUI");
                    },
                    docExpansion: "none",
                    apisSorter: "alpha"
                });
                function addApiKeyAuthorization() {
                    var key = encodeURIComponent($('#input_apiKey')[0].value);
                    if (key && key.trim() != "") {
                        var apiKeyAuth = new SwaggerClient.ApiKeyAuthorization("api_key", key, "query");
                        window.swaggerUi.api.clientAuthorizations.add("api_key", apiKeyAuth);
                        log("added key " + key);
                    }
                }
                //$('#input_apiKey').change(addApiKeyAuthorization);
                    // if you have an apiKey you would like to pre-populate on the page for demonstration purposes...
                    /*
                     var apiKey = "myApiKeyXXXX123456789";
                     $('#input_apiKey').val(apiKey);
                     */
                window.swaggerUi.load();
                function log() {
                   if ('console' in window) {
                       console.log.apply(console, arguments);
                   }
               }
                });
    </script-->

            <title> AgroLD : API documentation </title> 
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="api-js-css/css.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="api-js-css/swagger-ui.css">
        </head>
        <body>
        <jsp:include page="header.jsp"></jsp:include>
            <div class="container-fluid arian-thread">
                <div class="info_title">
                    <div class="container pos-l">Help > <span class="active-p">AgroLD API 1.0</span></div>
                </div>
            </div>
            <div class="foowrap">
                <div id="inject-info" class="container-fluid swag-swag">
                    <div class="container">
                        <div class="centering-fix">
                            <div class="txt-i">
                                <div class="col-sm-6">
                                    <div id="pop-i">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="swagger-section">
                    
                    <section>
                        <!--div id="header" style="display: none">
                            <div class="swagger-ui-wrap">
                                <a id="logo" href="http://swagger.io">swagger</a>
                                <form id="api_selector">
                                    <div class="input"><input placeholder="http://example.com/api" id="input_baseUrl" name="baseUrl" type="text"/></div>
                                    <div class="input"><input placeholder="api_key" id="input_apiKey" name="apiKey" type="text"/></div>
                                    <div class="input"><a id="explore" href="#">Explore</a></div>
                                </form>
                            </div>
                        </div-->
                        <div id="message-bar" class="swagger-ui-wrap"  style="display: none">&nbsp;</div>
                        <div id="swagger-ui-container" class="swagger-ui-wrap"></div>
                    </section>
                </div>
                <div id="swagger-ui"><section data-reactroot="" class="swagger-ui swagger-container"></section></div>
            </div>            
        <jsp:include page="footer.html"></jsp:include>
        <script src="api-js-css/swagger-ui-bundle.js"></script>
        <script src="api-js-css/swagger-ui-standalone-preset.js"></script>
        <script>
            window.onload = function () {


                // Begin Swagger UI call region
                const ui = SwaggerUIBundle({
                    "dom_id": "#swagger-ui",
                    deepLinking: true,
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIStandalonePreset
                    ],
                    plugins: [
                        SwaggerUIBundle.plugins.DownloadUrl
                    ],
                    layout: "StandaloneLayout",
                    validatorUrl: "https://validator.swagger.io/validator",
                    url: AGROLDAPIJSONURL,
                })


                // End Swagger UI call region


                window.ui = ui
            }
        </script>
        <script type="text/javascript">
            function banInjector() {
                var clone = $('.info').clone(); // save info api from swagger autogenerated div
                $('.info').text('');            // cleaning the div
                $('#pop-i').html(clone);        // inject to swagger top banner
                $('#api_info .info_title').addClass('ban-sp-title').removeClass('info_title'); // cleaning old class info
                $('#resources_container .footer').remove();     // removing swagger footer ( cause conflicts )
                $('footer.footer').addClass('apiHelpFooter').removeClass('footer');     // Replace by relative positionning footer
            }
        </script>
        <script>
            $(document).ready(function () {
                $.ajax({
                    type: 'post',
                    data: 'p={m:"setPageConsult",page:"agroldApiDoc"}',
                    url: 'ToolHistory',
                    success: function (data) {
                        $('.success').html(data);
                    }
                });
            });
        </script>
    </body>
</html>
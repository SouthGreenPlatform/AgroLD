<%-- 
    Document   : api-doc
    Created on : Jun 18, 2019, 10:26:43 AM
    Author     : Gildas
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!-- HTML for static distribution bundle build -->
<!DOCTYPE html>
<html lang="en"><head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <!-- Google Tag Manager -->
        <script type="text/javascript" async="" src="api-js-css/analytics.js"></script><script async="" src="api-js-css/gtm.js"></script><script>(function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({'gtm.start':
                            new Date().getTime(), event: 'gtm.js'});
                var f = d.getElementsByTagName(s)[0],
                        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src =
                        'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-WFH2HTG');</script>
        <!-- End Google Tag Manager -->  

        <meta charset="UTF-8">
        <title> AgroLD : API documentation </title> 
        <!--jsp:include page="includes.html"--><!--/jsp:include-->
        <link href="api-js-css/css.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="api-js-css/swagger-ui.css">
        <!--link rel="icon" type="image/png" href="https://petstore.swagger.io/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="https://petstore.swagger.io/favicon-16x16.png" sizes="16x16"-->
        <style>
            html
            {
                box-sizing: border-box;
                overflow: -moz-scrollbars-vertical;
                overflow-y: scroll;
            }
            *,
            *:before,
            *:after
            {
                box-sizing: inherit;
            }

            body {
                margin:0;
                background: #fafafa;
            }
        </style>
    </head>

    <body>
        <!-- from https://petstore.swagger.io/#/pet/deletePet -->
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WFH2HTG"
                          height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
        <jsp:include page="header.jsp"></jsp:include>
            <div class="container-fluid arian-thread">
                <div class="info_title">
                    <div class="container pos-l">Help > <span class="active-p">AgroLD API</span></div>
                </div>
            </div>
            <div id="swagger-ui"><section data-reactroot="" class="swagger-ui swagger-container"></section></div>
        <jsp:include page="footer.html"></jsp:include>
        <script src="api-js-css/swagger-ui-bundle.js"> </script>
        <script src="api-js-css/swagger-ui-standalone-preset.js"> </script>
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

    </body></html>
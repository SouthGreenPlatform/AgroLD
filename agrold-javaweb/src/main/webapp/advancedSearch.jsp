<%-- 
    Document   : formsearch
    Created on : Jul 15, 2015, 3:40:50 PM
    Author     : tagny
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="java.lang.reflect.Field" %>
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
        <title>AgroLD: Form-based search</title>        
                
        <!--Graphic Visualization-->
        <!--script src="scripts/cytoscape.min.js"></script-->
        <link href="knetmaps/css_demo/index-style.css" rel="stylesheet" /> <!-- demo page css -->
        <link href="knetmaps/dist/css/knetmaps.css" rel="stylesheet" /> <!-- KnetMaps css -->		
        <link href="https://fonts.googleapis.com/css?family=Kanit|Play" rel="stylesheet">
        <link rel="shortcut icon" href="image/favicon.ico" > <!-- favicon added -->
        <script src="knetmaps/dist/js/knetmaps-lib.min.js"></script> <!-- KnetMaps libs (with jQuery) -->		
        <script src="knetmaps/dist/js/knetmaps.js"></script> <!-- KnetMaps -->
        
        <link rel="icon" href="images/logo_min.png" />
        <link rel="icon" type="image/png" href="images/logo_min.png" />
        <script type="text/javascript" src="config/config.js"></script>
        <!-- Les includes -->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Tether -->
        <script src="https://npmcdn.com/tether@1.2.4/dist/js/tether.min.js"></script>
        <!-- Jquery baby -->
        <!--script type="text/javascript" src="scripts/jquery-3.2.1.min.js"></script-->
        <!-- Bootstrap REBOOT -->
        <link rel="stylesheet" type="text/css" href="styles/bootstrap/css/bootstrap-reboot.min.css">

        <link href="styles/style1.css" rel="stylesheet" type="text/css"/>
        <link href="styles/sp.css" rel="stylesheet" type="text/css"/>
        <link href="styles/menu.css" rel="stylesheet" type="text/css"/>
        <link rel="stylesheet" type="text/css" href="styles/advSearch.css">
        <link rel="stylesheet" type="text/css" href="styles/css-loader.css">
        <link href="sparqleditor/yasr.min.css" rel="stylesheet" type="text/css"/>
        <script src='sparqleditor/yasr.bundled.min.js'></script>

        <!--link href="styles/menu1.css" rel="stylesheet" type="text/css"/-->
        <link rel="stylesheet" type="text/css" href="styles/bootstrap/css/bootstrap-grid.min.css">
        <link rel="stylesheet" type="text/css" href="styles/bootstrap/css/bootstrap.css">
        <link rel="stylesheet" type="text/css" href="styles/font-awesome/css/font-awesome.min.css">
        <script type="text/javascript" src="styles/bootstrap/js/bootstrap.min.js"></script>
        <!-- Les autres -->
        <link href="styles/search.css" rel="stylesheet" type="text/css">        
        <script src="swagger/lib/swagger-client.js" type="text/javascript"></script>
        <script src="scripts/lib.js" type="text/javascript"></script>
        <!--script src="scripts/adv_search_ogust.js" type="text/javascript"></script-->
        <!--include jQuery.DataTables plug-in-->
        <link href="https://cdn.datatables.net/1.10.18/css/jquery.dataTables.min.css" rel="stylesheet" type="text/css">        
        <script src="https://cdn.datatables.net/1.10.18/js/jquery.dataTables.min.js" type="text/javascript"></script>
        <script src="scripts/URI.js"></script>
        
        <style>
            #graphViewResult {
                width: inherit;
                height: 800px;
                position: relative;
                top: 0px;
                left: 0px;
            }
        </style>
    </head>
    <body>
        <div class="debug">
        </div>
        <jsp:include page="header.jsp"></jsp:include>
            <div class="container-fluid arian-thread">
                <div class="info_title">
                    <div class="container pos-l">Search > <span class="active-p">Advanced form-based search</span></div>
                </div>
            </div>

            <div class="foowrap">
                <section>
                    <div id="advanced-form" class="border-right">
                    <jsp:include page="WEB-INF/jspf/advancedForm.jsp"></jsp:include>
                    <jsp:include page="WEB-INF/jspf/advancedModal.jsp"></jsp:include>
                    </div>
                    <div id="result-container">
                        <div class="container">

                        </div>
                        <div class="container">
                            <!--div id="overlay" style="display: none;"></div-->

                            <!--script> IF KEYWORD != NULL
                                $(document).ready(function () {
                                var keyword = "<%-- out.print(keyword);--%>";
                                $('#type option[value=' + type + ']').prop('selected', true);
                                $("input.keyword").val(keyword);
                            });
                        </script-->
                        <!--span id="Search-info">Search <b><%-- out.print(type);--%></b> with keyword <%-- out.print("\"<b> " + keyword + " </b>\"<br>");--%></span><span id="pageBtns"></span-->
                        <div id="result"></div>                    
                        <script src="scripts/search.js" type="text/javascript"></script>

                    </div>


                </div>

                <!-- Les differents types dispo dans le select -->
                <jsp:include page="WEB-INF/jspf/protein.jsp"></jsp:include>                
                <jsp:include page="WEB-INF/jspf/qtl.jsp"></jsp:include>
                <jsp:include page="WEB-INF/jspf/pathway.jsp"></jsp:include>
                <jsp:include page="WEB-INF/jspf/gene.jsp"></jsp:include>
                <jsp:include page="WEB-INF/jspf/ontology.jsp"></jsp:include>

                    <!-- Appel via l'historique -->


            </div>                
        </section>
        <div id="push"></div> <!--add the push div here -->
        <div style="height:50px;width:100%;"></div>
    </div>          
<jsp:include page="footer.html"></jsp:include>
<script>
        size1 = Math.round(DEFAULT_PAGE_SIZE / 3);
        size2 = Math.round(DEFAULT_PAGE_SIZE * 2 / 3);
        YASR.plugins.table.defaults.datatable["pageLength"] = DEFAULT_PAGE_SIZE;
        YASR.plugins.table.defaults.datatable["lengthMenu"] = [[size1, size2, DEFAULT_PAGE_SIZE, -1], [size1, size2, DEFAULT_PAGE_SIZE, "All"]];
        YASR.plugins.table.defaults.fetchTitlesFromPreflabel = false;
</script>
</body>
<script>
    $(document).ready(function () {
        $.ajax({
            type: 'post',
            data: 'p={m:"setPageConsult",page:"advancedSearch"}',
            url: 'ToolHistory',
            success: function (data) {
                $('.success').html(data);
            }
        });
    });
</script>
</html>

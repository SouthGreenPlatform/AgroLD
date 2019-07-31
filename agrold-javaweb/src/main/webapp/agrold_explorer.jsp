<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
        <!--Graphic Visualization-->
        <!--script src="scripts/cytoscape.min.js"></script-->
        <link href="knetmaps/css_demo/index-style.css" rel="stylesheet" /> <!-- demo page css -->
        <link href="knetmaps/dist/css/knetmaps.css" rel="stylesheet" /> <!-- KnetMaps css -->		
        <link href="https://fonts.googleapis.com/css?family=Kanit|Play" rel="stylesheet">
        <link rel="shortcut icon" href="image/favicon.ico" > <!-- favicon added -->
        <script src="config/config.js" type="text/javascript"></script>
        <script src="knetmaps/dist/js/knetmaps-lib.min.js"></script> <!-- KnetMaps libs (with jQuery) -->		
        <script src="scripts/URI.js"></script>
        <script src="scripts/lib.js" type="text/javascript"></script>
        <script type="text/javascript" src="scripts/knetmaps_adaptator.js"></script>
        <script src="knetmaps/dist/js/knetmaps.js"></script> <!-- KnetMaps -->        
        <title>AgroLD Visual Explorer</title>
        <style>
            #knet-maps {
                width: 100%;
                height: 800px;
                position: relative;
                top: 0px;
                left: 0px;
            }
        </style>
    </head>
    <body>
            <%
                String iri = request.getParameter("iri");
                if(iri == null){
                iri = "http://www.southgreen.fr/agrold/resource/Os02t0527100-01#CDS7";
                }
                
            %>        
        <center><form action="agrold_explorer.jsp" method="post"  enctype="application/x-www-form-urlencoded" accept-charset=utf-8> 
            IRI:
            <input type="text" name="iri" value="<%=iri%>" size="75%">
            <input type="submit" value="Submit">
        </form>        
            <%out.println("iri: " + iri);%>
        </center>
            
        
        <div id="knet-maps"></div>                 

        <script type="text/javascript">
            $(window).on("load", function () {
                //var entityUri = "http://www.southgreen.fr/agrold/ricecyc.pathway/FERMENTATION-PWY";      
                //var entityUri = "http://identifiers.org/ensembl.plant/Zm00001d033472"; // Show links of protein Q6JAD5
                //var entityUri = "http://www.southgreen.fr/agrold/aracyc.pathway/PWY-1921";
                //var entityUri = "http://www.southgreen.fr/agrold/qtaro.qtl141"; // alone
                //var entityUri = "http://www.southgreen.fr/agrold/ricecyc.pathway/PWY-2881"; // exemple of exploration
                //var entityUri = "http://identifiers.org/ensembl.plant/Os01g0580500"; // duplication de noeud, un 
                //var entityUri = "http://identifiers.org/ensembl.plant/Os04g0578000";
                //var entityUri = "http://www.southgreen.fr/agrold/ricecyc.pathway/PWY-2902";
                var entityUri = "<%=iri%>";
                //var entityUri = "http://www.southgreen.fr/agrold/tigr.locus/LOC_Os05g08490.1";

                KNETMAPS_ADAPTATOR.fetchConceptDescription("<%=iri%>").done(function () {
                    KNETMAPS_ADAPTATOR.updateNetwork("#knet-maps");
                });
            });
        </script>
    </body>
</html>

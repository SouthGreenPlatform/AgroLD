<%-- 
    Document   : about
    Created on : Jun 29, 2015, 11:55:56 AM
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
        <title> About AgroLD </title> 
        <jsp:include page="includes.html"></jsp:include>
        </head>
        <body>
        <jsp:include page="header.jsp"></jsp:include>
            <div class="container-fluid arian-thread">
                <div class="info_title">
                    <div class="container pos-l">Search > <span class="active-p">Quick Search</span></div>
                </div>
            </div>
            <div class="foowrap">
                <section>
                    <div class="container jump-top">                
                        <p>
                            The Agronomic Linked Data project is supported by the <a href="https://www.southgreen.fr/" target="_blank"> 
                                SouthGreen Bioinformatics Platform</a> in collaboration with the Institut de Recherche pour le 
                                Développement (IRD) and the Centre de coopération International en 
                            Recherche Agronomique pour le Développement (CIRAD). 

                        </p>
                        <h4>Team:</h4>
                       
                        <div>               
                            <p><b>Pierre Larmande,</b><br>
                                <i>Researcher, IRD</i><br>
                                <i>Coordinator, Data science and knowledge management</i><br>
                                <em>Pierre[dot]larmande[at]ird[dot]fr</em>
                            </p>
                        </div>     
                        <div>               
                            <p><b>Manuel Ruiz</b><br>
                                <i>Researcher, CIRAD</i><br>
                                <em>manuel[dot]ruiz[at]cirad[dot]fr</em><br>
                            </p>
                        </div>
                      <div>               
                            <p><b>Gildas Tagny,</b><br>
                                <i>Engineer, INRA</i><br>
                                <em>tagnyngompe[at]gmail[dot]com</em>
                            </p>
                        </div>
                        <h4>Former members:</h4>
                          <div>               
                            <p><b>Patrick Valduriez</b><br>
                                <i>Senior Researcher, INRIA</i><br>
                                <i>Head, Data and knowledge management workpackage, IBC</i><br>
                                <em>Patrick[dot]Valduriez[at]inria[dot]fr</em><br>
                            </p>
                        </div>
                         <div>               
                            <p><b>Nordine El Hassouni,</b><br>
                                <i>Engineer, INRA</i><br>
                                
                            </p>
                        </div>
                        <div>               
                            <p><b>Imene Chentli,</b><br>
                                <i>Project intern, IBC and Open Data Group at LIRMM</i><br>   
                                </p>
                        </div>
                       <div>               
                            <p><b>Idjellidaine Jean-Christophe,</b><br>
                                <i>Project intern, IBC</i><br>
                                <i>UX developer</i><br>
                               
                            </p>
                        </div>
                         <div>               
                            <p><b>Aravind Venkatesan,</b><br>
                                <i>Post-doctoral researcher, IBC</i><br>
                            </p>
                        </div>
                        <h4>Collaborators:</h4>
                        <div>               
                            <p><b>Clément Jonquet </b><br>
                                <i>Assistant professor, University of Montpellier</i><br>
                                <i>Pi of D2KAB project</i><br>
                                
                            </p>
                        </div>
                        <div>               
                            <p><b>Konstantin Todorov</b><br>
                                <i>Assistant professor, University of Montpellier</i><br>
                                <i>Pi of Doremus project</i><br>
                                
                            </p>
                        </div>
                        <div>               
                            <p><b>Cyril Pommier </b><br>
                                <i>Engineer, INRA</i><br>
                                <i>Deputy Head of GnPIS</i><br>
                                
                            </p>
                        </div>
                        <h4>Photo Credits:</h4>
                        <p>
                        This work have been supported by Institut de Biologie Computationnelle (IBC -
                        <a href="http://www.ibc-montpellier.fr" target="_blank">http://www.ibc-montpellier.fr</a>),
                        The French Institute of Bioinformatics (IFB - <a href="https://www.france-bioinformatique.fr" target="_blank"> https://www.france-bioinformatique.fr</a>)
                        and the Agropolis Foundation (<a href="http://www.agropolis-fondation.fr" target="_blank">http://www.agropolis-fondation.fr</a>)</p>
                    </div>
                </section>
            </div>
            <div style="height:50px;width:100%;"></div>
        <jsp:include page="footer.html"></jsp:include>
    </body>
    <script>
        $(document).ready(function () {
            $.ajax({
                type: 'post',
                data: 'p={m:"setPageConsult",page:"about"}',
                url: 'ToolHistory',
                success: function (data) {
                    $('.success').html(data);
                }
            });
        });
    </script>
</html>



<%-- 
        Document   : index
        Created on : Jul 15, 2015, 1:40:56 PM
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
        <title>AgroLD:home</title>
        <!-- TEST -->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Tether -->
        <script src="https://npmcdn.com/tether@1.2.4/dist/js/tether.min.js"></script>
        <!-- Jquery baby -->
        <script type="text/javascript" src="scripts/jquery-3.2.1.min.js"></script>
        <!-- Bootstrap -->
        <link rel="stylesheet" type="text/css" href="styles/bootstrap/css/bootstrap-reboot.min.css">
        <!-- ------ -->
        <link rel="stylesheet" type="text/css" href="styles/hp.css">
        <link rel="stylesheet" type="text/css" href="styles/menu.css">
        <!-- ------ -->

        <!--link href="styles/menu1.css" rel="stylesheet" type="text/css"/-->
        <link rel="stylesheet" type="text/css" href="styles/bootstrap/css/bootstrap-grid.min.css">
        <link rel="stylesheet" type="text/css" href="styles/bootstrap/css/bootstrap.css">
        <link rel="stylesheet" type="text/css" href="styles/font-awesome/css/font-awesome.min.css">
        <script type="text/javascript" src="styles/bootstrap/js/bootstrap.min.js"></script>
        <!-- TEST -->

        <!-- slick slider -->
        <script src="scripts/slick/slick.js" type="text/javascript" charset="utf-8"></script>
        <link rel="stylesheet" type="text/css" href="scripts/slick/slick.css">
        <link rel="stylesheet" type="text/css" href="scripts/slick/slick-theme.css">
        <!-- full page -->
        <link rel="stylesheet" type="text/css" href="scripts/fullpage/jquery.fullPage.css">
        <script type="text/javascript" src="scripts/fullpage/jquery.fullPage.min.js"></script>
        <!--script type="text/javascript" src="http://polecious.at/studio/_betterscrolling/fullPageJS/vendors/jquery.slimscroll.min.js"></script-->
        <link rel="stylesheet" type="text/css" href="styles/bordelo.css">
        <link rel="icon" href="images/logo_min.png" />
        <link rel="icon" type="image/png" href="images/logo_min.png" />
    </head>
    <body>

        <jsp:include page="header.jsp"></jsp:include>

        <div id="fullPage">
            <div id="section0" class="section introIndex">
                <div class="jumbotron home">
                    <div class="static-j">
                        <div class="container">
                            <% if(session.getAttribute("sessionUtilisateur")== null){%>
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <strong>Welcome on AgroLD</strong>. It's your first time on the portal ? <strong><a href="Login" style="color:inherit">Login</a></strong> or <strong><a href="Register" style="color:inherit">create an account</a></strong> to save and share your requests on the <strong><a href="#section1" style="color:inherit">tools</a></strong>.
                            </div>
                            <% }%>
                            <div class="bug-rport-2">
                                
                                <div class="primary-a col-md-12 col-lg-12 brise">
                                    <center>
                                    <!--<div class="primary-a col-sm-12 col-lg-6">-->
                                        <h1>Agronomic Linked Data</h1>
                                        <h3>The RDF Knowledge-based Database for plant molecular networks</h3>
                                        <br>
                                    </center>

                                    </div>
                                <div id="sform">
                                    <center>
                                    <form id="search" action="http://agrold.southgreen.fr/fct/facet.vsp?cmd=text&sid=231"" method="post" target="_blank">
                                    <!--form id="search" action="http://volvestre.cirad.fr:8890/fct/facet.vsp?cmd=text&sid=231"" method="post" target="_blank"-->
                                        <div class="col-lg-6">
                                            <div class="input-group">
                                                <!--input type="text" class="form-control" placeholder="Search for..."-->
                                                <input class="keyword form-control" name="q" type="text" placeholder="examples: GRP2 or TCP12 or plant height" data-step="1" data-intro="Type your expression and then ..."/> 
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
<!--                                    <div class="primary-b col-sm-12 col-lg-6">
                                        <div class="pre primary-b">
                                            <p><b>Agronomic Linked Data (AgroLD)</b></br>This project was created to provide a portal for bioinformatics and domain experts to exploit the homogenized data models towards efficiently generating research hypotheses.
                                            </p>
                                        </div>
                                    </div>-->
                                </div>
                            </div>
                        </div>

                    </div>
<!--                    <section class="regular slider">
                        <div class="minified">
                            <div class="container">
                                <div class="slide-1">
                                    <a href="advancedSearch.jsp"><img src="images/slide1.png"></a>
                                </div>
                            </div>
                        </div>
                        <div class="minified">
                            <div class="container">
                                <div class="slide-1">
                                    <a href="relfinder.jsp"><img src="images/slide2.png"></a>
                                </div>
                            </div>
                        </div>
                        <div class="minified">
                            <div class="container">
                                <div class="slide-1">
                                    <a href="sparqleditor.jsp"><img src="images/slide3.png"></a>
                                </div>
                            </div>
                        </div>
                    </section>-->
                </div>
            </div>
            <div id="section1" class="fp-normal-scroll section sumaryService">
                <div class="titled-section t-s-1 container-fluid"><h2>Discover our services</h2></div>
                <div class="centering-fix">
                    <div class="framed-child">
                        <div class="container">
                            <div class="card-deck">
                                <div class="col-md-6 col-lg-3 col-xs-2">
                                    <div class="card card-outline-success mb-3 text-center c1">
                                        <div class="card-block">
                                            <div class="delim-tc">
                                                <h4 class="card-title">Quick Search</h4>
                                            </div>
                                            <blockquote class="card-blockquote">
                                                <p>Search with keywords and browse AgroLD Knowledge Base</p>
                                                <footer><a href="quicksearch.jsp" class="btn btn-outline-success">Use this tool</a></footer>
                                            </blockquote>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 col-lg-3 col-xs-2">
                                    <div class="card card-outline-success mb-3 text-center c2">
                                        <div class="card-block">
                                            <div class="delim-tc">
                                                <h4 class="card-title">Advanced Search</h4>
                                            </div>
                                            <blockquote class="card-blockquote">
                                                <p>Search with keywords, browse, and get answers to some biological questions</p>
                                                <footer><a href="advancedSearch.jsp" class="btn btn-outline-success">Use this tool</a></footer>
                                            </blockquote>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 col-lg-3 col-xs-2">
                                    <div class="card card-outline-success mb-3 text-center c3">
                                        <div class="card-block">
                                            <div class="delim-tc">
                                                <h4 class="card-title">Explore Relationships</h4>
                                            </div>
                                            <blockquote class="card-blockquote">
                                                <p>Search easily existing relationships between entities</p>
                                                <footer><a href="relfinder.jsp" class="btn btn-outline-success">Use this tool</a></footer>
                                            </blockquote>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 col-lg-3 col-xs-2">
                                    <div class="card card-outline-success mb-3 text-center c4">
                                        <div class="card-block">
                                            <div class="delim-tc">
                                                <h4 class="card-title">SPARQL Query Editor</h4>
                                            </div>
                                            <blockquote class="card-blockquote">
                                                <p>Edit and submit your SPARQL Queries to the sparql endpoint of AgroLD located</p>
                                                <footer><a href="sparqleditor.jsp" class="btn btn-outline-success">Use this tool</a></footer>
                                            </blockquote>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="container">
                            <div class="col-lg-12 col-md-10 col-xs-12 h-centering">
                                <footer class="home">
                                    <div class="container">
                                        <div class="col-md-12 col-lg-12 resolve-grid">
                                            <div class="col-md-2">
                                                <a href="http://www.ibc-montpellier.fr/wp/wp5"><div class="hexagone"><img src="images/IBC.png" alt="IBC"></div></a>
                                            </div>
                                            <div class="col-md-2">
                                                <a href="http://www.cirad.fr"><div class="hexagone"><img alt="CIRAD" src="images/CIRAD.png"></div></a>
                                            </div>
                                            <div class="col-md-2">
                                                <a href="http://www.ird.fr"><div class="hexagone"><img src="images/IRD.png" alt="IRD"></div></a> 
                                            </div>
                                            <div class="col-md-2">
                                                <a href="https://www.umontpellier.fr"><div class="hexagone"><img src="images/UM.png" alt="Univ Montpellier"></div></a>
                                            </div>
                                            <div class="col-md-2">
                                                <a href="https://www.france-bioinformatique.fr"><div class="hexagone"><img src="images/IFB.png" alt="INRIA"></div></a>
                                            </div>
                                            <div class="col-md-2">
                                                <a href="http://www.southgreen.fr"><div class="hexagone"><img src="images/southgreen.png" alt="southgreen"></div></a>
                                            </div>
                                        </div>
                                        <div class="copyright">&COPY; AgroLD 2019</div>
                                        
                                        
                                        
                                   
                                    
                                            
                                        
                                </footer>
                               
                            </div>
                                     
                        </div>
                           
                    </div>
                        
                </div>
                   <!-- <img class="twitter_img_icon"src="images/twitter-icon-1.png" alt="southgreen"> -->
            </div>
            
           
                            
<!--            <div id="section3" class="section introIndex">
                 <div class="titled-section t-s-1 container-fluid">
                    <img class="twitter_img" src="images/twitter_PNGsmal.png" alt="southgreen">       
                    <img class="twitter_img"src="images/twitter-icon-1.png" alt="southgreen">  
                </div>
                <div class="container">
                    <div class="tweeter">
                       <a class="twitter-timeline" href="https://twitter.com/agro_ld?ref_src=twsrc%5Etfw">Tweets by agro_ld</a> 
                       <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
                    </div>
                </div>
            </div>-->
        </div>
   

    <script type="text/javascript">
        var nos = 0;
        $(document).ready(function () {

            $(".regular").slick({
                /*scrollOverflow: true,
                 slidesNavigation: true,
                 navigation: true,
                 verticalCentered: false,
                 */
                autoplay: true,
                autoplaySpeed: 6000,
                pauseOnHover: false,
                pauseOnFocus: false,
                //scrollBar: false,
                // 				    autoScrolling: false,
                /*
                 */
            });
            if (window.innerWidth > 970) {

                $('#fullPage').fullpage({

                    /*
                     scrollOverflow: false,
                     */
                    fitToSection: false,
                    hybrid: true,
                    normalScrollElement: '#section1',
                    touchSensitivity: 20,
                    normalScrollElementTouchThreshold: 20,
                    bigSectionsDestination: null,
                    scrollOverflow: true,

                    /*
                     paddingBottom: 70,
                     slidesNavigation: true,
                     navigation: true,
                     autoScrolling: false,
                     scrollBar: false,
                     verticalCentered: false,
                     anchors:['home', 'kurse', 'news', 'agb', 'jobs', 'impressum'],
                     afterRender: function(){
                     //alert('hello - i am done!');
                     //$.fn.fullpage.setAllowScrolling(false);
                     },
                     afterLoad: function(anchorLink, index){
                     //alert(anchorLink);
                     //Tell GA where we go...
                     ga('set', 'page', '/' + anchorLink );
                     ga('send', 'pageview');
                     }*/
                    //verticalCentered: false*/*/*/*/*/*/
                });

                /* Correction d'un conflit entre le fait que fullPage.js veuille le centrer 
                 verticalement et qu'on le veuille sticky */

                $('#section1 .fp-tableCell').removeClass('fp-tableCell').addClass('bug-rport-1').attr('style', 'height: auto;');
                $('.titled-section').attr('style', 'padding-top: 70px;');
                //$('#section0 .fp-tableCell').removeClass('fp-tableCell').addClass('bug-rport-1').attr('style','height: auto;');

                /* Gestion du scroll de la partie #section1 à #section0, lorsqu'on scroll vers le
                 haut on réimplémente le comportement par défaut de fullPage.js */

                distance = 99999;
                $(window).on('scroll', function () {
                    var scrollTop = $(window).scrollTop();
                    var elementOffset = $('#section1').offset().top;
                    var headerNav = $('#header').offset().top;

                    if ((elementOffset - scrollTop) > 0 && distance <= (elementOffset - scrollTop)) {
                        $.fn.fullpage.moveSectionUp();
                    }
                    distance = (elementOffset - scrollTop);
//                    $('.static-j').attr('style', 'top:100px;');

                });
            }
            sp();
        });
    </script>
    <script type="text/javascript">
        var width = window.innerWidth;
        var height = window.innerHeight;
        var max = [[1200, 798], [1000, 900], [828, 827], [2000, 660], [768, 2000]];


        $(window).resize(function () {
            sp();
        });
        function sp() {
            width = parseInt(window.innerWidth);
            height = parseInt(window.innerHeight);
            var i;
            for (i = 0; i < max.length; i++)
                if (width <= max[i][0] && height <= max[i][1]) {
                    $('.slider').addClass("hideMe");
                    i = -1;
                    console.log('break : {' + width + ' x ' + height + '}');
                    break;
                }
            if (i == max.length)
                $('.slider').removeClass("hideMe");

        }
    </script>


</body>
<script>
    $(document).ready(function () {
        $.ajax({
            type: 'post',
            data: 'p={m:"setPageConsult",page:"index"}',
            url: 'ToolHistory',
            success: function (data) {
                $('.success').html(data);
            }
        });
    });
</script>
</html>


<%-- 
        Document   : advancedForm
        Created on : Sep 8, 2015, 2:21:47 PM
        Author     : tagny
--%>
<div style="text-align: center">
    <!--ul>
    <li>ontological concepts: 'plant height' or 'regulation of gene expression'</li>
    <li>Gene: keyword 'stachyose' or name 'TCP2'.</li>
    <li>Pathway:  keywords 'fermentation' or 'acetate' or 'cytokinins'</li>
    <li>protein:  name 'TBP1', keyword 'qtl'</li>
    <li>QTL: name 'BNL6.32' or keyword 'trait'</li>
    </ul-->
Some examples:<br/>
ontological concepts: 'plant height' or 'regulation of gene expression'.<br/>
    Gene: keywords 'stachyose', 'protein_coding', 'qtl', 'Constitutive flowering repressor', 'fungal growth'; or name 'TCP2'.<br/>
    Pathway:  keywords 'fermentation' or 'acetate' or 'cytokinins'.<br/>
    protein:  name 'TBP1', keyword 'qtl'.<br/>
    QTL: name 'BNL6.32' or keyword 'trait'.<br/>
</div>

<!--<center>
    <div class="container">
        <form id="sform">
           
                <option value="" default>--- Select a type* ---</option>
                <option value="gene">Gene</option>
                <option value="protein">Protein</option>
                <option value="qtl">QTL</option>
                <option value="pathway">Pathway</option>
                <option value="ontology">Ontology</option>
            </select>
            <input id="input" class="keyword" name="keyword" type="text" autofocus placeholder="Type here ..." style="display: inline"/>
            <input id="submit" class="yasrbtn" type="submit" value="Search" style="display: inline"/>
        </form>
    </div>
</center>-->
<!-- TEST -->
<div class="Q-Search A-Search">
    <div class="container delim">
        <div class="row">
            <div class="col-lg-12">
                <span style="color:#ff0000" id="message"></span>
                <div class="input-group">
                    <div class="input-group-btn">
                        <button type="button" id="afft" value="" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Filter by
                        </button>
                        <div class="dropdown-menu cht">
                            <a class="dropdown-item" href="#gene">Gene</a></li>
                            <a class="dropdown-item" href="#protein">Protein</a></li>
                            <a class="dropdown-item" href="#qtl">QTL</a></li>
                            <a class="dropdown-item" href="#pathway">Pathway</a></li>
                            <a class="dropdown-item" href="#ontology">Ontology</a></li>
                        </div>
                    </div>
                    <input id="keyword" class="keyword" name="keyword" type="text" autofocus placeholder="Search term...">
                    <span class="input-group-btn">
                        <button class="btn btn-primary" id="jcb" class="yasrbtn" value="Search">Search</button>
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>
<!--<script>

    var ht = '${param.ht}' ; // Set ht Value from GET request
    var hk = '${param.hk}' ; // Set hk Value from GET request
    var HISTORY = false;
    
    var SearchContext = {
        type: null,
        uri: null,
        keyword: null,
        ACTIVE: null // future CURRENT_RESULT
    };
    var ModalContext = {
        type: null,
        uri: null,
        id: null,
        keyword: null,
        ACTIVE: null,
        clean: function () {
            this.type = null;
            this.uri = null;
            this.id = null;
            this.keyword = null;
            this.ACTIVE = null;
        },
        notFound: function () {
            this.clean();
            $('.modal-result').html('<h1 class="nfound">No data found :(</h1>');
        }
    }
    var FOCUS_KEYWORD = 0;

    $('input[type=text]#keyword').on('keydown', function (e) {
        if (e.which == 13) {
            $('#jcb').click();
        }
    });
    $('#jcb').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        /* Keyword ok ? */
        if ($('#afft').attr('value') === "") {
            $("#message").html('Select a type please');
        } else {
            if (!($('#advanced-form').attr('class').includes('searched')))
                $('#advanced-form').addClass('searched');
            $("#message").html('');
            checkForm();
            if(!HISTORY)
                saveRequest();
            else
                HISTORY=false;
            search(SearchContext.type, SearchContext.keyword, 0);
        }
    });
    /* Switch pour émuler un select:option */
    $(document).ready(function (e) {
        $('.cht a').click(function (e) {
            e.preventDefault();
            var param = $(this).attr("href").replace("#", "");
            var concept = $(this).text();
            $('#afft').text(concept);
            $('#afft').val(param);
        });
        // On va regarder si l'uilisateur consulte son historique de recherche avancée
        if(hk !== '' && ht!==''){
            HISTORY = true;
            $('#keyword').attr('value',hk);
            $('#afft').text(ht);
            $('#afft').val(ht);
            $('#jcb').click();
        }
    });
    /* Récupération des éléments du formulaire de recherche */
    function checkForm() {
        SearchContext.type = $('#afft').attr('value');
        SearchContext.keyword = $('#keyword').val();
    }
    function saveRequest(){
        $.ajax({
            type:'post',
            data:'p={m:"setAdvancedSearch",type:"'+SearchContext.type+'",keyword:"'+SearchContext.keyword+'"}',
            url:'ToolHistory',
            success:function(data){
                $('.success').html(data);
            }                                                
        });
    }

</script>-->
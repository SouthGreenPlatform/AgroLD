

addAdmin:{
    call: 'getFutureAdmin';
    callback: function (data) {
        ArianT('fa fa-user-plus', 'Add admin');
        $('#dynamic-container').html(data.data);
        Page.style();
    };
    controller:function(o){
        return '"limit":"10","offset":"0"';
    };
    p: true
};
getAdminPannel:{
    call: 'getAdminPannel';
    callback: function (data) {
        ArianT('fa fa-rocket', 'Admin panel');
        $('#dynamic-container').html(data.data);
        Page.style();
    };
    p: false
};
getUserManager:{
    call: 'getUserManager';
    callback: function (data) {
        ArianT('fa fa-users', 'Users');
        $('#dynamic-container').html(data.data);
        Page.style();
    };
    controller:function(o){
        return '"limit":"10","offset":"0"';
    };
    p: true
};
userManagerPaginator:{
    call: 'getUserManager';
    controller: function (o) {
        return '"limit":"10","offset":"'+ o.attr('value') +'"';
    };
    callback: function (data) {
        var tbody = data.data.parseHTML.find('#userListManager');
        console.log(data.data);
        $('body #userListFutureAdmin').html(tbody.html);
    };
    p: true
};
adminPaginator:{
    call: 'getFutureAdmin';
    controller: function (o) {
        return '"limit":"10","offset":"'+ o.attr('value') +'"';
    };
    callback: function (data) {
        var tbody = data.data.parseHTML.find('#userListFutureAdmin');
        console.log(data.data);
        $('body #userListFutureAdmin').html(tbody.html);
    };
    p: true
};
toggleAdmin:{
    call: 'toggleAdmin';
    cache:null;
    controller: function (o) {
        var res = Util.tableChecked('userListFutureAdmin');
        if(res[0]=='null') this.cache = false; else this.cache = true;
        res = JSON.stringify(res).replace(/}|{/g,'');
        return res;
    };
    callback: function (data) {
        if(this.cache == true)
            $('#addAdmin').click();
    };
    p: true
};
getCompleteUserData:{
    call: 'getCompleteUserData';
    controller:function(o){
        return '"user":"'+o.text()+'"';
    };
    callback: function (data) {
        $('#user-modal-info').modal();
        /////////////////////////////////
        //
        /////////////////////////////////
        $('body #user-modal-info .modal-body').html(data.data);
        Page.style();
        $("body #user-modal-info").on('hidden.bs.modal',function(){
            $('body #user-modal-info .modal-body').html('');
            $('body #user-modal-info .mee').click();
        });
    };     
    p: true
};
getAgroldStat:{
    call: 'getAgroldStat';
    callback: function (data) {
        ArianT('fa fa-globe', 'AgroLD Stats');
        $('#dynamic-container').html(data.data);
        Page.style();
    };     
    p: false
};
deleteUserHistory:{
    call: 'deleteUserHistory';
    callback: function (data) {
       // VOID
    };
    controller:function(o){
        console.log('loool');
        var result = "";
        var START_DAY = String("" + $('body #getStartDate .day option:selected').attr('value'));
        var START_MONTH = String("" + $('body #getStartDate .month option:selected').attr('value'));
        var START_YEAR = String("" + $('body #getStartDate .year option:selected').attr('value'));
        var START_FULL = String("" + String(START_YEAR) + String(START_MONTH) + "-" +String(START_DAY) );

        var END_DAY = String("" + $('body #getEndDate .day option:selected').attr('value'));
        var END_MONTH = String("" + $('body #getEndDate .month option:selected').attr('value'));
        var END_YEAR = String("" + $('body #getEndDate .year option:selected').attr('value'));
        var END_FULL = String("" + String(END_YEAR) + String(END_MONTH) + "-" +String(END_DAY) );
        
        var CHOICE = 0;
        if($('body #chk-de').is(':checked'))
            CHOICE = 1;
        if($('body #chk-oi').is(':checked'))
            CHOICE = 2;
            
        result = '"start":"'+ START_FULL +'","end":"'+ END_FULL +'","choice":"'+CHOICE+'"';
        console.log(result);
        return result;
    };
    p: true
};


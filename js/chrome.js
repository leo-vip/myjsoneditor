var app = {},file ={},util={},count= 1,seq=1;
var treeEditor=null,docEditor=null
//DONE save ctrl +s | time to save
//DONE drag the bar
//DONE save ok. tips
//DONE click not worked finxed it
//DONE click to display
//DONE change title you have to chage the file list display
//DONE delete json file
//TODO changed title ,but the jsonlist is not changed.
//...

var storage=null;
if (chrome.storage){
//if (window.localStorage){
    storage=chrome.storage.local;
    storage.setItem=function(k,value){
        var o={};
        o[k]=value;
        console.warn("set "+ k +":"+value);
        storage.set(o,function(){});
    }

    storage.removeItem=function(key){
        storage.remove(key)
    }
}else{
    storage=window.localStorage;
}


var TITLE_SEQ="json.title.seq";
var CURRENT_JSON_ID="json.current.id"
var JSON_ID_LIST="json.id.list"
util.getJsonId=function(){
    var now=new Date()
    var year=now.getFullYear();
    var month=now.getMonth()+1;
    var date=now.getDate();
    var hour=now.getHours();
    var minute=now.getMinutes();
    var second=now.getSeconds();
    return "file."+year+month+date+hour+minute+second+count++;

}

util.getSeq=function(){

    return  seq++;
}

util.showTips=function(msg){
    $("#tips").text(msg)
    $("#tips").show();
    $("#tips").fadeOut(3000);
}

util.getTitleID= function (id) {
    return id+".title";
}

util.subTitleID= function (id_title) {
    //return id+".title";
    return id_title.substr(0,id_title.length-".title".length);
}

util.getContentID= function (id) {
    return id+".content";
}

util.substr20= function (str) {
    if(str.length>20) {
        return str.substr(0, 20)+"...";
    }else{
        return str;
    }
}



app.docToTree=function (){
    var json= docEditor.get()
    treeEditor.set(json)

}

app.treeToDoc=function (){
    var json= treeEditor.get()
    docEditor.set(json)

}

app.clickItem= function (){

    $("#id_json_list").find("a").removeClass("active");
    $(this).addClass("active");

    var jsonid=$(this).attr("json-id");
    app.showCurrentJson(jsonid);
}

//init list
app.addInitASpanHtml2List= function (id, title) {
    $("<a href=\"#\" class=\"list-group-item \" json-id="+id+"><span class='flag' title="+title+">"+util.substr20(title)+"</span> <span class=\"badge\" title=\"delete\" json-id="+id+">x</span>  </a>").appendTo($("#id_json_list"));
}

//add
app.addASpanHtml2List= function (id, title) {

    $("<a href=\"#\" class=\"list-group-item list-group-item-danger\" json-id="+id+"><span class='flag' title="+title+">"+util.substr20(title)+"</span><span class=\"badge\" title=\"delete\" json-id="+id+">x</span> </a>").prependTo($("#id_json_list"));
}

/**
 * fileNameList=  id;id;id
 * currentJsonId =  fileid
 *
 * file.id.title     = id
 * file.id.content =xxxxx
 * inited = false|true
 */
app.loadFileList=function(){
    if(!storage){
        alert("your web browse not support localStorage!");
        return;
    }

    //if(!storage.hasOwnProperty("inited")){
    //    file.myJsonEditorInit()
    //}


    storage.get(JSON_ID_LIST,function(ids){

        if(typeof(ids[JSON_ID_LIST])=="undefined"){
            file.myJsonEditorInit();
        }

        var idss = ids[JSON_ID_LIST].split(";");
        console.info("idss: "+ids[JSON_ID_LIST]);
        for( index in idss){
            var id = idss[index];
            storage.get(util.getTitleID(id), function (obj) {

                for(var o in obj){
                    var thisid=util.subTitleID(o);
                    var thisname=obj[o];
                    app.addInitASpanHtml2List(thisid,thisname);

                }


            })

        }
    })

    storage.get(CURRENT_JSON_ID,function(id){
        app.showCurrentJson(id[CURRENT_JSON_ID])
    })


}

//load current and save
app.showCurrentJson=function(jsonid){

    var jsonid_title=jsonid+".title";

    storage.get(jsonid_title,function(object){

        if(typeof(object[jsonid_title])=="undefined"){

            storage.get(JSON_ID_LIST,function(idslist){
                //console.debug(idslist);
                if(typeof(idslist[JSON_ID_LIST])=="undefined" || idslist[JSON_ID_LIST].length==0){

                        util.showTips("You delete All JSON File...");

                    }else{
                        app.showCurrentJson(idslist[JSON_ID_LIST].split(";")[0]);
                    }
            })

        }else{

            $("#json_title").val(object[jsonid_title]);
            storage.get(jsonid+".content",function(object){
                docEditor.set(JSON.parse(object[jsonid+".content"]));
            });

            storage.setItem(CURRENT_JSON_ID,jsonid);//set
        }
    })


}

app.save=function(){
    try{
        docEditor.get()
    }catch(e){
        util.showTips("Your json have errors. pls check..")
        return ;
    }

    storage.get(CURRENT_JSON_ID, function (id) {
        file.save(id[CURRENT_JSON_ID],$("#json_title").val(),docEditor.get());

        var list= $("#id_json_list").find("a").filter(function(a){return $(this).attr('json-id')==id[CURRENT_JSON_ID]});
        if(list.length==0){
            util.showTips("Not this Json Doc ,Not find this id .");
        }

        var alink=list[0];
        $(alink).find(".flag").text(util.substr20($("#json_title").val()));

        util.showTips("saved...");

    });



}

//init a json
file.myJsonEditorInit =function (){
    // set json
    var json = {
        "Array": [1, 2, 3],
        "Boolean": true,
        "Null": null,
        "Number": 123,
        "Object": {
            "a": "b",
            "c": "d"
        },
        "String": "Hello World"
    };

    docEditor.set(json)
    var fileid=util.getJsonId()
    storage.setItem("inited",true);
    storage.setItem(CURRENT_JSON_ID,fileid);
    storage.setItem(JSON_ID_LIST,fileid);
    storage.setItem(TITLE_SEQ,0);
    file.save(fileid,"test",json)
}


file.addJson=function(id,name,json){


    storage.get(JSON_ID_LIST, function (ids) {
        storage.setItem(JSON_ID_LIST,id+";"+ids[JSON_ID_LIST]);
        storage.setItem(CURRENT_JSON_ID,id);
        file.save(id,name,json);
    })

}

//to disk
file.save=function(id,title,json){

    storage.setItem(id+".title",title);
    storage.setItem(id+".content",JSON.stringify(json));

}

file.delete=function(id){
    //remove id from list
    storage.get(JSON_ID_LIST, function (ids) {

        var idlist = ids[JSON_ID_LIST];
        var arrIds =idlist.split(";").filter(function(e){if(e==id)return false ; else return true;})
        storage.setItem(JSON_ID_LIST,arrIds.join(";"))

        storage.removeItem(id+".title");
        storage.removeItem(id+".content");
    })

}


app.deleteJson=function(){
    var jsonid= $(this).attr("json-id");
    file.delete(jsonid);
    $(this).parent().remove();


    storage.get(CURRENT_JSON_ID, function (id) {
        app.showCurrentJson(id[CURRENT_JSON_ID]);
    })


}


app.addJson=function (){

    var json_id= util.getJsonId()
    $("#json_title").val("Title "+util.getSeq());

    file.addJson(json_id,$("#json_title").val(),{})
    app.addASpanHtml2List(json_id,$("#json_title").val());
    //

    docEditor.set();
    treeEditor.set();

    $("#json_title").focus();
}

app.bindingDrag=function(){

    var drag=$("#id_drag_button");

    x = 1;

    drag.mousedown(function(e){
        //x = e.clientX - drag[0].offsetWidth - $("#docEditor").width() -20;
        console.debug(x);
        this.setCapture ? (

            this.setCapture(),

                this.onmousemove = function(ev) {
                    mouseMove(ev || event);
                },
                this.onmouseup = mouseUp
        ) : (

            $(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp)
        );

        e.preventDefault();
    })


    function mouseMove(e) {

        console.debug("MM "+x)
        $("#docEditor").width( e.clientX - x + 'px');
        //$("#treeEditor").width( e.clientX - x + 'px');
    }

    function mouseUp() {
        this.releaseCapture ? (
            this.releaseCapture(),
                this.onmousemove = this.onmouseup = null
        ) : (
            $(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp)
        );
    }



}



app.load=function() {
    var codeDoc = document.getElementById("docEditor");
    var codeoptions = {
        "mode": 'code',
        "search": true

    };

    docEditor = new JSONEditor(codeDoc, codeoptions);

    var viewoptions = {
        "mode": "tree",
        "search": true,
        modes: ['code', 'form', 'text', 'tree', 'view'],
        error: function (err) {
            alert(err.toString());
        }
    };

    var treeDoc = document.getElementById("treeEditor");
    treeEditor = new JSONEditor(treeDoc, viewoptions);

    $("#id_to_tree").on("click", app.docToTree);
    $("#id_to_doc").on("click", app.treeToDoc);
    $("#id_json_add_btn").on("click", app.addJson);
    $("#id_json_save").on("click", app.save);
    app.loadFileList();
    $("#id_json_list").on("click", "a", app.clickItem);
    $("#id_json_list").on("click", ".badge", app.deleteJson);

    document.onkeydown =  function(e){

        var t = e.which ? e.which : e.keyCode || 0;

        if (e.ctrlKey)switch (t) {
            case 83:
                app.save();
                return false;
                break;
        }}

    app.bindingDrag()



}

app.load();


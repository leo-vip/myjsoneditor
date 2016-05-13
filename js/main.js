var app = {},file ={},util={},count= 1
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
//if (chrome.storage){
/*if (window.localStorage){
    var storage=chrome.storage.local;
    storage.setItem=function(key,value){
        storage[key]=value;
    }
    storage.getItem=function(key){
        return storage[key];
    }
    storage.removeItem=function(key){
        storage.remove(key)
    }
}else{
    var storage=window.localStorage;
}*/
var storage=window.localStorage;



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
    var seq = parseInt(storage.getItem(TITLE_SEQ))
    storage.setItem(TITLE_SEQ,seq+1)
    return seq+1

}

util.showTips=function(msg){
    $("#tips").text(msg)
    $("#tips").show();
    $("#tips").fadeOut(3000);
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

    $("<a href=\"#\" class=\"list-group-item list-group-item-success\" json-id="+id+"><span class='flag' title="+title+">"+util.substr20(title)+"</span><span class=\"badge\" title=\"delete\" json-id="+id+">x</span> </a>").prependTo($("#id_json_list"));
    $("a[json-id='"+id+"']").trigger("click");
    
    
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
        alert("your web browse not support localStorage!   Just can not save...");
        return;
    }

    if(!storage.hasOwnProperty("inited")){
        file.myJsonEditorInit()
    }

    var ids = storage.getItem(JSON_ID_LIST);
    var idss = ids.split(";");
    for( index in idss){
        var id = idss[index];

        app.addInitASpanHtml2List(id,storage.getItem(id+".title"));


    }

    app.showCurrentJson(storage.getItem(CURRENT_JSON_ID))

}

//load current and save
app.showCurrentJson=function(jsonid){


    if(storage.getItem(jsonid+".title")==null){
        var ids =storage.getItem(JSON_ID_LIST)
        if(ids.length==0){
            file.myJsonEditorInit();
            util.showTips("Don't delete All , ReInitial the env...")
            app.loadFileList();
        }else{
            jsonid=ids.split(";")[0];

        }

    }

    $("#json_title").val(storage.getItem(jsonid+".title"));
    docEditor.set(JSON.parse(storage.getItem(jsonid+".content")));

    storage.setItem(CURRENT_JSON_ID,jsonid);//set
}

app.save=function(){
    try{
        docEditor.get()
    }catch(e){
        util.showTips("Your json have errors. pls check..")
        return ;
    }

    var list= $("#id_json_list").find("a").filter(function(a){return $(this).attr('json-id')==storage.getItem(CURRENT_JSON_ID)});
    if(list.length==0){
        util.showTips("Not this Json Doc ,Not find this id .");
    }


    var alink=list[0];
    $(alink).find(".flag").text(util.substr20($("#json_title").val()));

    util.showTips("saved...");
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
    var ids =storage.getItem(JSON_ID_LIST);
    storage.setItem(JSON_ID_LIST,id+";"+ids);
    storage.setItem(CURRENT_JSON_ID,id);
    file.save(id,name,json);
}

//to disk
file.save=function(id,title,json){

    storage.setItem(id+".title",title);
    storage.setItem(id+".content",JSON.stringify(json));

}

file.delete=function(id){
    //remove id from list
    var idlist = storage.getItem(JSON_ID_LIST);
    var arrIds =idlist.split(";").filter(function(e){if(e==id)return false ; else return true;})
    storage.setItem(JSON_ID_LIST,arrIds.join(";"))

    storage.removeItem(id+".title");
    storage.removeItem(id+".content");


}

file.getCurrentid=function(){
    return storage.getItem(CURRENT_JSON_ID)
}

app.deleteJson=function(){
    var jsonid= $(this).attr("json-id");
    file.delete(jsonid);
    $(this).parent().remove();
    app.showCurrentJson(storage.getItem(CURRENT_JSON_ID))


}


app.addJson=function (){

    var json_id= util.getJsonId()
    $("#json_title").val("Title "+util.getSeq());

    file.addJson(json_id,$("#json_title").val(),{})

    //$("<a href=\"#\" class=\"list-group-item list-group-item-info\" json-id="+json_id+">"+$("#json_title").val()+"<span class=\"badge\" title=\"delete\" json-id="+json_id+">x</span> </a>").prependTo($("#id_json_list"));
    app.addASpanHtml2List(json_id,$("#json_title").val());
    docEditor.set();
    treeEditor.set();

    $("#json_title").focus();
}

app.bindingDrag=function(){

    var drag=$("#id_drag_button");

    x = 0;

    drag.mousedown(function(e){
        
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
        x = e.clientX - drag[0].offsetWidth - $("#docEditor").width() ;
        
        $("#docEditor").width( $("#docEditor").width() + x + 'px');
        $("#treeEditor").width( $("#treeEditor").width() - x + 'px');
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


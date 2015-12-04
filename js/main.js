var app = {},file ={},util={},count= 1
var treeEditor=null,docEditor=null

//DONE save ctrl +s | time to save
//DONE drag the bar
//DONE save ok. tips
//DONE click not worked finxed it
//DONE click to display
//DONE change title you have to chage the file list display
//DONE delete json file

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
    var seq = parseInt(window.localStorage.getItem(TITLE_SEQ))
    window.localStorage.setItem(TITLE_SEQ,seq+1)
    return seq+1

}

util.showTips=function(msg){
    $("#tips").text(msg)
    $("#tips").show();
    $("#tips").fadeOut(3000);
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

/**
 * fileNameList=  id;id;id
 * currentJsonId =  fileid
 *
 * file.id.title     = id
 * file.id.content =xxxxx
 * inited = false|true
 */
app.loadFileList=function(){
    if(!window.localStorage){
        alert("your web browse not support localStorage!");
        return;
    }

    if(!window.localStorage.hasOwnProperty("inited")){
        file.myJsonEditorInit()
    }

    var ids = window.localStorage.getItem(JSON_ID_LIST);
    var idss = ids.split(";");
    for( index in idss){
        var id = idss[index];
         $("<a href=\"#\" class=\"list-group-item \" json-id="+id+">"+window.localStorage.getItem(id+".title")+" <span class=\"badge\" title=\"delete\" json-id="+id+">x</span>  </a>").appendTo($("#id_json_list"));

    }

    app.showCurrentJson(window.localStorage.getItem(CURRENT_JSON_ID))

}

//load current and save
app.showCurrentJson=function(jsonid){


    if(window.localStorage.getItem(jsonid+".title")==null){
        var ids =window.localStorage.getItem(JSON_ID_LIST)
        if(ids.length==0){
            file.myJsonEditorInit();
            util.showTips("Don't delete All , ReInitial the env...")
            app.loadFileList();
        }else{
            jsonid=ids.split(";")[0];

        }

    }

    $("#json_title").val(window.localStorage.getItem(jsonid+".title"));
    docEditor.set(JSON.parse(window.localStorage.getItem(jsonid+".content")));

    window.localStorage.setItem(CURRENT_JSON_ID,jsonid);//set
}

app.save=function(){
    try{
        docEditor.get()
    }catch(e){
        util.showTips("Your json have errors. pls check..")
        return ;
    }

    file.save(file.getCurrentid(),$("#json_title").val(),docEditor.get());
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
    window.localStorage.setItem("inited",true);
    window.localStorage.setItem(CURRENT_JSON_ID,fileid);
    window.localStorage.setItem(JSON_ID_LIST,fileid);
    window.localStorage.setItem(TITLE_SEQ,0);
    file.save(fileid,"test",json)
}


file.addJson=function(id,name,json){
    var ids =window.localStorage.getItem(JSON_ID_LIST);
    window.localStorage.setItem(JSON_ID_LIST,id+";"+ids);
    window.localStorage.setItem(CURRENT_JSON_ID,id);
    file.save(id,name,json);
}

//to disk
file.save=function(id,title,json){

    window.localStorage.setItem(id+".title",title);
    window.localStorage.setItem(id+".content",JSON.stringify(json));

}

file.delete=function(id){
    //remove id from list
    var idlist = window.localStorage.getItem(JSON_ID_LIST);
    var arrIds =idlist.split(";").filter(function(e){if(e==id)return false ; else return true;})
    window.localStorage.setItem(JSON_ID_LIST,arrIds.join(";"))

    window.localStorage.removeItem(id+".title");
    window.localStorage.removeItem(id+".content");


}

file.getCurrentid=function(){
    return window.localStorage.getItem(CURRENT_JSON_ID)
}

app.deleteJson=function(){
    var jsonid= $(this).attr("json-id");
    file.delete(jsonid);
    $(this).parent().remove();
    app.showCurrentJson(window.localStorage.getItem(CURRENT_JSON_ID))


}


app.addJson=function (){

    var json_id= util.getJsonId()
    $("#json_title").val("Title "+util.getSeq());

    file.addJson(json_id,$("#json_title").val(),{})

    $("<a href=\"#\" class=\"list-group-item list-group-item-info\" json-id="+json_id+">"+$("#json_title").val()+"<span class=\"badge\" title=\"delete\" json-id="+json_id+">x</span> </a>").prependTo($("#id_json_list"));

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
    $("#id_json_list").on("click", "span", app.deleteJson);

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

app.load()

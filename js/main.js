var app = {},file ={},util={},count= 1
var treeEditor=null,docEditor=null

//TODO save ctrl +s | time to save
//TODO drag the bar
//TODO save ok. tips
//TODO click not worked finxed it

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
        file.addAInitJson()
    }

    var ids = window.localStorage.getItem("fileNameList")
    var idss = ids.split(";")
    for( index in idss){
        var id = idss[index]
        $("#id_json_list").before("<a href=\"#\" class=\"list-group-item list-group-item-info\" json-id="+id+">"+window.localStorage.getItem(id+".title")+"</a>");
    }

    //load current
    var cid = window.localStorage.getItem("currentJsonId")
    $("#json_title").val(window.localStorage.getItem(cid+".title"));
    docEditor.set(JSON.parse(window.localStorage.getItem(cid+".content")));

}

app.save=function(){
    file.save(file.getCurrentid(),$("#json_title").val(),docEditor.get())
}

//init a json
file.addAInitJson =function (){
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
    window.localStorage.setItem("currentJsonId",fileid);
    window.localStorage.setItem("fileNameList",fileid);
    file.save(fileid,"test",json)
}


file.addJson=function(id,name,json){
    var ids =window.localStorage.getItem("fileNameList");
    window.localStorage.setItem("fileNameList",ids+";"+id);
    file.save(id,name,json);
}

//to disk
file.save=function(id,title,json){

    window.localStorage.setItem(id+".title",title);
    window.localStorage.setItem(id+".content",JSON.stringify(json));

}

file.getCurrentid=function(){
    return window.localStorage.getItem("currentJsonId")
}


app.addJson=function (){

    var json_id= util.getJsonId()
    $("#json_title").val("Title");

    file.addJson(json_id,$("#json_title").val(),{})

    $("#id_json_list").before("<a href=\"#\" class=\"list-group-item list-group-item-info\" json-id="+json_id+">"+$("#json_title").val()+"</a>");

    docEditor.set();
    treeEditor.set();

    $("#json_title").focus();
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
    $("#id_json_btn").on("click", app.addJson);
    $("#id_json_save").on("click", app.save);
    app.loadFileList()
    $("#id_json_list").on("click", "a", app.clickItem);



}

app.load()

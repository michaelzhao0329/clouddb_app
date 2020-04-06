//jshint esversion:6

const express = require('express');
const bodyParser=require("body-parser");
const date=require(__dirname + "/date.js");
const app = express();
const _ = require("lodash");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use("/styles",  express.static(__dirname + '/public/stylesheets'));
app.use("/scripts", express.static(__dirname + '/public/javascripts'));
app.use("/images",  express.static(__dirname + '/public/images'));

const items=[];
const workItems=[];
var savedItems=[];

const mongoose = require('mongoose');
const url = "mongodb://localhost:27017";
//mongoose.connect("mongodb://localhost:27017/todolistDB",
  //         {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect("mongodb+srv://mizhao:Test123@cluster0-4ifyo.mongodb.net/todolistDB?retryWrites=true&w=majority",
            {useNewUrlParser: true, useUnifiedTopology: true });
const itemSchema = new mongoose.Schema (
             { name: {
               type:String,
               required:[true,"No name provided"]
             },
        });
const Item = mongoose.model('Item', itemSchema);
item1 = new Item ({name:"Welcome to your todolist! "});
item2 = new Item ({name:"Hit the + button to add a new item"});
item3 = new Item ({name:"<-- Hit this to delete a item"});

const defaultItems = [item1,item2,item3];
const listSchema = {
  name:String,
  items:[itemSchema]
};
const List = mongoose.model("List",listSchema);


//Item.insertMany(defaultItems,function(err){
//  if (err){
//    console.log(err);
//  } else {console.log("Save default items to database")}
//}


app.get('/', function (req, res) {
  day = date.getDate();
  //day = date.getWeekDay();
  Item.find(function(err,finditems){
    if ( finditems.length === 0 ){
      Item.insertMany(defaultItems,function(err){
        if (err){
          console.log(err);
        } else {console.log("Save default items to database")}
      });
      res.redirect("/");
    }
    else {
      res.render("list",{date:day,listTitle: "Today" ,newListItems: finditems});
    };
  });
});

app.post("/",function(req,res){
  const itemName = req.body.newItem
  const listName = _.capitalize(req.body.list);
  const item = new Item ({
    name :itemName
  });

  if (listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name:listName},function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listName);
  })
  }
});

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = _.capitalize(req.body.listName);
  //console.log (checkedItemId);
  if (listName === "Today"){
      Item.findByIdAndRemove(checkedItemId,function(err){
      if (!err){
        console.log("one item delete from database")
        res.redirect("/");
    }
  });
} else {
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},
  function(err){
  if (!err){
      console.log("one item in " +listName + " delete from database");
      res.redirect("/"+listName);
  }
});
}
});

app.get("/:customListname",function(req,res){
  //console.log(req.params.customListname);
  day = date.getDate();
  const customListname = _.capitalize(req.params.customListname);
  List.findOne({name:customListname},function(err,foundList){
    if (!err){
      if (!foundList) {
        const list = new List({
          name:customListname,
          items:defaultItems
        });
        list.save();
        res.redirect("/"+ customListname)
      } else {
        //show all the list
        res.render("list",{date:day,listTitle:foundList.name,newListItems:foundList.items});
      }
    }
  })

})


app.listen(process.env.PORT || 3000, () => console.log(`Example app listening on port "3000"`))

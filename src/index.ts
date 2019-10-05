const fs = require("fs");
let myDB = fs.readFileSync("../data/members.json","utf8");
let members = JSON.parse(myDB);


function compare( a, b ) {
  if ( a.id < b.id ){
    return -1;
  }
  if ( a.id > b.id ){
    return 1;
  }
  return 0;
}
members.sort(compare);

class Member {
  id:number;
  name:string;
  email:string;
  mobile:string;
  committee:string;
  constructor(id,name,email,mobile,committee){
    this.id = id;
    this.name = name;
    this.email = email;
    this.mobile = mobile;
    this.committee = committee;
  }
}

function memberExists(memberID:number){
  let exists:boolean = false;
  members.forEach((member) => {
    if(member.id == memberID){
      exists = true;
    }
  });
  return exists;
}
const express = require("express");
let app = express();

app.get('/members',(req,res)=>{
  if(members.length === 0){
    res.send("There's no members to show");
  }else{
    members.forEach((member) => {
      res.write(`ID: ${member.id}\n`);
      res.write(`Name: ${member.name}\n`);
      res.write(`Email: ${member.email}\n`);
      res.write(`Mobile: ${member.mobile}\n`);
      res.write(`Committee: ${member.committee}\n\n`);
    });
    res.end();
  }
});

app.get('/members/member/:ID',(req,res)=>{
  if(memberExists(req.params.ID)){
    let targetMember = members[req.params.ID-1];
    res.write(`ID: ${targetMember.id}\n`);
    res.write(`Name: ${targetMember.name}\n`);
    res.write(`Email: ${targetMember.email}\n`);
    res.write(`Mobile: ${targetMember.mobile}\n`);
    res.write(`Committee: ${targetMember.committee}\n`);
    res.end();
  }else{
    res.send("Wrong member ID!");
  }
});

app.use(express.json());
app.post('/members/new',(req,res) => {
  let body = req.body;
  let newMember = new Member(body.id,body.name,body.email,body.mobile,body.committee);
  if(memberExists(newMember.id)){
    res.send("ID taken, Please choose another ID");
  }else{
    members.push(newMember);
    res.send("Member added successfully!");
  }
});

app.put('/members/modify',(req,res) => {
  let targetMember = members[req.body.id - 1];
  if(req.body.name !== undefined){
    targetMember.name = req.body.name;
  }
  if(req.body.email !== undefined){
    targetMember.email = req.body.email;
  }
  if(req.body.mobile !== undefined){
    targetMember.mobile = req.body.mobile;
  }
  if(req.body.committee !== undefined){
    targetMember.committee = req.body.committee;
  }
  res.send("Member Updated successfully!");
});
app.delete("/members/delete",(req,res) => {
  if(memberExists(req.body.id)){
    let targetMember = members[req.body.id];
    members.pop(targetMember);
    res.send("Member Deleted successfully!");
  }else{
    res.send("This member doesn't exist!");
  }
});
app.listen(4444);

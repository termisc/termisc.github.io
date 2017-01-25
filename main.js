"use strict";

var setting;
var fs = require("fs");
var wsMessage;
var Cylon = require("cylon");

Cylon.robot({
  
  connections: {
    sphero: { adaptor: 'sphero', port: '/dev/tty.Sphero-GBR-AMP-SPP' },
    keyboard: { adaptor: "keyboard" }
  },
  devices: {
    sphero: { driver: 'sphero' },
    keyboard: { driver: "keyboard", connection: "keyboard" }
  },
  
  work: function(me) {

    var ws;  
    var WebSocketServer = require('ws').Server
    var wss = new WebSocketServer({
    	host : '0.0.0.0',
    	port : 10000
    });

    var connections = [];

    wss.on('connection', function(ws) {
      console.log("CONNECTED");
      connections.push(ws);
      if(connections.length>1){
        console.log("multiple connects. ");
        connections.forEach(function (con, i) {
          var str = "disconnect";
          var message = JSON.stringify({feedback:str});
          con.send(message);
          console.log('DISCONNECT ALL');      
          con.close();
          connections = [];
        });
        
      }
      ws.on('message', function(message) {
        console.log('received: %s', message);
        processWSMessage(message);
        });
  });
  
  
  
  function processWSMessage(msg) {
    var obj = null;
    try {
      obj = JSON.parse(msg);
    } catch (O_o) {
      console.log("JSON parse failed");
      obj = null;
    }
    
    if(obj){
      var action = obj.action;
      switch(action){
        case 'roll':
        console.log("accel=" + obj.accel + " direction=" + obj.direction );
        me.sphero.roll(obj.accel, obj.direction);
        break;
        
        case 'color':
        console.log("color=" + obj.colorVal);
        console.log(obj.colorval);
        me.sphero.color(parseInt(obj.colorVal));
        break;
        
        case 'chat':
        console.log("chat: "+ obj.chatmsg);
        break;
        
        case 'startCalib':
        console.log('start caliblation');
        me.sphero.startCalibration();
        break;
        
        case 'finishCalib':
        console.log('finish caliblation');
        me.sphero.finishCalibration();
        break;
        
        case 'stop':
        console.log('stop');
        me.sphero.stop();
        break;
        
        case 'boost':
        console.log('start boost');
        isBoost = 1;
        me.sphero.boost(1);
        break;
        
        case 'unBoost':
        console.log('stop boost');
        isBoost = 0;
        me.sphero.boost(0);
        break;
        
        case 'toggleBoost':
        if(isBoost == 0){
          me.sphero.boost(1);
          isBoost = 1;
          console.log('start boost');
        }else{
          me.sphero.boost(0);
          isBoost = 0;
          console.log('stop boost'); 
        }
        break;
      }
    }
  }

  var head = 0;
  var isBoost = 0;
  
  //setColor,setRandomColor ともにこの環境では利用できない Cylonバージョンとかあるのだろうか。
  //setRgbは正しい使い方がわからない　動くとLEDが消えるんだけど setHeading 機能の効果が確認できない
  //me.sphero.color(0x00FF00); が使用可能、この場合は
  after((1).seconds(), function() {
      console.log("Setting up Collision Detection...");
      me.sphero.detectCollisions(); //collisionを使うよ！
      me.sphero.setAccelRange(3);
      me.sphero.color(0xFF0000);
            
  });
  
  
  
  
  
  me.sphero.on("collision", function() {
    console.log("Collision:");
    connections.forEach(function (con, i) {

      var str = "collison";
      var message = JSON.stringify({feedback:str});
      con.send(message);
      //send JSON object should be nice. 
      console.log('COLLISON');
    });


    
  });
  
  
  me.keyboard.on("up", function () {
    me.sphero.roll(30, 0);
    //me.sphero.setColor("white");
  });
  
  me.keyboard.on("right", function () {
    me.sphero.roll(0, 90);
  });
  
  me.keyboard.on("left", function () {
    me.sphero.roll(0, 270);
  });
  
  me.keyboard.on("down", function () {
    me.sphero.stop();    
  });
  
  
  me.keyboard.on("o", function () {
    me.sphero.startCalibration();
    console.log("startCalibration:");

  });
  
  me.keyboard.on("p", function () {
    me.sphero.finishCalibration();
    console.log("finishCalibration:");
    
  });
  
  me.keyboard.on("q", function () {
    console.log("Good night...");
    process.exit(0);
    
  });

  me.keyboard.on("c", function () {
    console.log("send Q");
    connections.forEach(function (con, i) {
      con.send("COLLISIONS");
      console.log('COLLISON');
    });
  });

  
  
  
  
  
  
  }
  
}).start();










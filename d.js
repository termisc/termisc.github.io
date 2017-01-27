(function(ext) {

  var ws;

  // Extension が終了するときに呼ばれる
  // 今は特に何もしない
  ext._shutdown = function() {};

  // Extension の状態を返す
  // デバイスが繋がっていないときにはエラーを返したりする
  // ---
  // 返す値, 表示される色, 意味
  //      0,          red, error
  //      1,       yellow, not ready
  //      2,        green, ready
  // ---
  // 今回はデバイスなどは使用しないので常に準備完了
  // ということで 2 を返します。
  ext._getStatus = function() {
    return {status: 2, msg: 'Ready'};
  };

  // この関数がブロック処理になります。
  ext.log = function(str) {
  };
  
  var alarm_went_off = false;
  ext.init = function(str) {
    ws = new WebSocket("ws://localhost:10000");
    ws.onmessage = function (event) {
      if (event && event.data) {
        //alert(event.data);
      } 
  
      var obj = null;
      try {
        obj = JSON.parse(event.data);
      } catch (O_o) {
        console.log("JSON parse failed");
        obj = null;
      }
      if(obj){
        var feedback = obj.feedback;
        switch(feedback){
          case 'collison':
          alarm_went_off =true;
          break;

          case 'disconnect':
          alert('disconnect')
        }

      }

     //alarm_went_off = true;
    };

  };

  ext.chat = function(str) {
        var action = "chat";
        var message = JSON.stringify({message:str,action:action});
        ws.send(message);
  };

  ext.color = function(str) {
        var action = "color";
        var message = JSON.stringify({colorVal:str,action:action});
        ws.send(message);
  };


  ext.roll = function(accel, direction) {
        var action = "roll";
        var message = JSON.stringify({accel:accel, direction:direction,action:action});
        ws.send(message);
  };

  ext.stop = function() {
        var action = "stop";
        var message = JSON.stringify({action:action});
        ws.send(message);
  };


  ext.startCalib = function() {
        var action = "startCalib";
        var message = JSON.stringify({action:action});
        ws.send(message);
  };

  ext.finishCalib = function() {
        var action = "finishCalib";
        var message = JSON.stringify({action:action});
        ws.send(message);
  };

  ext.boost = function() {
        var action = "boost";
        var message = JSON.stringify({action:action});
        ws.send(message);
  };

  ext.unBoost = function() {
        var action = "unBoost";
        var message = JSON.stringify({action:action});
        ws.send(message);
  }; 

  ext.toggleBoost = function() {
        var action = "toggleBoost";
        var message = JSON.stringify({action:action});
        ws.send(message);
  }; 


   //var alarm_went_off = false;
   ext.when_collision = function() {
       // Reset alarm_went_off if it is true, and return true
       // otherwise, return false.
       if (alarm_went_off === true) {
           alarm_went_off = false;
           return true;     
       }
       return false;
    };

    ext.set_alarm = function(time) {
       window.setTimeout(function() {
           alarm_went_off = true;
       }, time*1000);
    };
  

  // ブロックをどういう風に表示するかを書きます
  // ここの書き方は結構難しいので今は説明しません
  var descriptor = {
    blocks: [
      [' ', 'Init', 'init', ''],
      [' ', 'Chat %s', 'chat',''],
      [' ', 'Roll speed: %n  direction: %n ','roll',50,0],
      ['h', '!collision', 'when_collision'],
      ['', 'run alarm after %n seconds', 'set_alarm', '2'],
      [' ', 'Stop', 'stop', ''],
      [' ', 'Color %s', 'color',''],
      [' ', 'Boost', 'boost', ''],
      [' ', 'UnBoost', 'unBoost', ''],
      [' ', 'Toggle Boost', 'toggleBoost', ''],
      [' ', 'Start Caliblation', 'startCalib', ''],
      [' ', 'Finish Caliblation', 'finishCalib', '']
    ]

   };

  // Scratch に作ったブロックを登録します
  ScratchExtensions.register('Log Extension', descriptor, ext);
})({});


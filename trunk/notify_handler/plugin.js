(function() {
  return {
    notify_timer: null,
    notify_list: {},
    remaining: ['','а','ы','ы','ы','','','','',''],
    toString: function() {
      return "Уведомление о приближающихся событиях";
    },
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","notify_handler\\settings.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","notify_handler\\settings.ini",top.getCookie('battle'),key,val);
    },
    getProperties: function() {
      var notifications=[];
      var now = parseInt((new Date()).getTime()/60000);
      for (var group in this.notify_list) {
//        notifications += group+':\n';
        for (var notification in this.notify_list[group]) {
          var newNotification=notification+': ';
          var minutes = this.notify_list[group][notification].estimation-now;
          var hours = Math.floor(minutes/60);
          minutes %= 60;
          if (hours) {
            var days = Math.floor(hours/24);
            hours %= 24;
            newNotification += (days ? days+' дн. ' : '')+hours+' ч. '+minutes+' мин.';
          } else
            newNotification += minutes+' мин.';
          notifications.push([newNotification,this.notify_list[group][notification].estimation]);
        }
      }
      notificationsStr = '';
      notifications.sort(function(a,b){return a[1]-b[1];});
      for(var i=0;i<notifications.length;i++){
        notificationsStr += notifications[i][0]+'\n';
      }
      return [
        { name:''/*"Уведомления"*/, value: notificationsStr, type: 'textarea', readonly:true, style: 'height:100%;' }
      ];
    },
    load_notifications: function() {
      var notifications = this.load('notifications','');
      notifications = notifications.split(';');
      this.notify_list = {};
      for(var i=0; i<notifications.length; i++) {
        var notification = notifications[i].split(',');
        if (notification.length>1) {
          notification[0] = notification[0].split('.');
          if (!(notification[0][0] in this.notify_list))
            this.notify_list[notification[0][0]] = {};
          this.notify_list[notification[0][0]][notification[0][1]] = {
            estimation:parseInt(notification[1]),
            action:null
          };
        }
      }
    },
    save_notifications: function() {
      var notifications = [];
//      alert('save_notifications');
      for (var group in this.notify_list) {
//        alert(group);
        for (var notification in this.notify_list[group]) {
//          alert(notification+','+this.notify_list[group][notification].estimation);
          notifications.push(group+'.'+notification+','+this.notify_list[group][notification].estimation);
        }
      }
      notifications = notifications.join(';');
      this.save('notifications',notifications);
    },
    timerFirstHandler: function() {
      var cnt=0;
      var now = parseInt((new Date()).getTime()/60000);
      var save_notifications = false;
      for(var group in this.notify_list) {
        for(var i in this.notify_list[group]) {
          var timespan = this.notify_list[group][i].estimation-now;
          if (timespan<=0) {
            top.combats_plugins_manager.add_chat('<font class=sysdate>Внимание!</font> '+i+' - Время пришло!');
            delete this.notify_list[group][i]
            save_notifications = true;
          } else if (timespan<=1440) {
            top.combats_plugins_manager.add_chat('<font class=sysdate>Внимание!</font> '+i+' - '+timespan+' минут'+(this.remaining[timespan%10]));
            cnt=1;
          }
        }
      }
      save_notifications && this.save_notifications();
      if(cnt) {
        this.notify_timer=setTimeout(top.combats_plugins_manager.get_binded_method(this,this.timerHandler),60*1000);
      } else
        this.notify_timer=null;
    },
    timerHandler: function() {
      var cnt=0;
      var now = parseInt((new Date()).getTime()/60000);
      for(var group in this.notify_list) {
        for(var i in this.notify_list[group]) {
          var timespan = this.notify_list[group][i].estimation-now;
          if (timespan<=0) {
            top.combats_plugins_manager.add_chat('<font class=sysdate>Внимание!</font> '+i+' - Время пришло!');
            delete this.notify_list[group][i]
            this.save_notifications();
          } else {
            switch(timespan) {
            case 1:
            case 5:
            case 15:
              top.combats_plugins_manager.add_chat('<font class=sysdate>Внимание!</font> '+i+' - '+timespan+' минут'+(this.remaining[timespan%10]));
            }
            cnt=1;
          }
        }
      }
      if(cnt) {
        this.notify_timer=setTimeout(top.combats_plugins_manager.get_binded_method(this,this.timerHandler),60*1000);
      } else
        this.notify_timer=null;
    },

    clear_notifications: function(group) {
      if (group in this.notify_list)
        delete this.notify_list[group];
    },
    add_notification: function(group, name, estimation, action) {
      if (!(group in this.notify_list))
        this.notify_list[group] = {};
      this.notify_list[group][name] = {estimation:estimation, action:action};
      this.save_notifications();
      if (!this.notify_timer)
        this.timerHandler();
    },
    Init: function() {
      this.load_notifications();
      this.timerFirstHandler();
      return this;
    }
  }.Init();
})()

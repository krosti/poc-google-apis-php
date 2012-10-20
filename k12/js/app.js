$(function(){
  $('.dateBox').datepicker({
      showOn: "button",
      buttonText: '<a href="#" id="add_reminder">(add reminder)</a>'
  });

  /*$('.compose_online').on('click',function(){
    $('.composing_dialog').dialog({
      width:800,
      height:650
    });
  });*/
});

Ext.define('K12.controller.Drive', {
    extend: 'Ext.app.Controller',

    init: function() {
        console.log('Initialized Users! This happens before the Application launch function is called');
    }
});

Ext.onReady(function () {

  var composingButton = Ext.get('compose_online');
  composingButton.on('click', 
    function(e,t){
      dialog.show();
    }, this);

  var dialog = Ext.create('Ext.window.Window', {
    //title: 'Hello',
    contentEl: Ext.get('composing_dialog'),
    height: 650,
    width: 800,
    modal: true,
    closeAction: 'hide',
    items: {

    },
    buttons: [
    {
        text     : 'Save',
        handler  : function() {
            dialog.close();
        }
    },
    {
        text     : 'Close',
        handler  : function() {
            dialog.close();
        }
    }]
  });

 });
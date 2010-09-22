/*
 * @author: Erik A. Ortiz
 * Aug 20th, 2010 
 */

var main = function(){
  Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
  
  items = Array();
  
  for(i=0; i<tabItems.length; i++){
    items[i] = new Ext.tree.TreePanel({
      title: tabItems[i].title,
      id: tabItems[i].id,
      animate:true,
      autoScroll:true,
      loader: new Ext.tree.TreeLoader({
        dataUrl:'mainAjax?request=loadMenu&menu='+tabItems[i].id+'&r='+Math.random()
      }),
      enableDD:true,
      containerScroll: true,
      border: false,
      width: 250,
      height: 120,
      dropConfig: {appendOnly:true},
      margins: '0 2 2 2',
      cmargins: '2 2 2 2',
      rootVisible: false,
      root: new Ext.tree.AsyncTreeNode(),
      listeners: {
        'click': function(tp) {
          if( tp.attributes.url ){
            document.getElementById('setup-frame').src = tp.attributes.url;
          }
        }
      }
    });
  }

  var viewport = new Ext.Viewport({
    layout: 'border',
    items: [
      new Ext.TabPanel({
        region: 'west',
        id: 'west-panel', // see Ext.getCmp() below
        title: 'West',
        split: true,
        width: 240,
        minSize: 175,
        maxSize: 400,
        collapsible: true,
        animCollapse: true,
        
        margins: '0 0 0 5',
        activeTab: 0,
        enableTabScroll: true,
        stateId:'admin-tabpanel',
        stateEvents:['tabchange'],
        getState:function() {
          return {
            activeTab:this.items.indexOf(this.getActiveTab())
          };
        },
        items: items
      }),
      {
        region: 'center', // a center region is ALWAYS required for border
        contentEl: 'setup-frame'
      }
    ]
  });
  //oClientWinSize = parent.getClientWindowSize();
  //parent.document.getElementById('adminFrame').style.height = oClientWinSize.height-105;  
}

Ext.onReady(main);



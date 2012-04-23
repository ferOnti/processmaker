/*
 * @author: Erik A. Ortiz
 * Aug 20th, 2010 
 */
var processesGrid;
var store;
var comboCategory;

new Ext.KeyMap(document, {
  key: Ext.EventObject.F5,
  fn: function(keycode, e) {
      if (! e.ctrlKey) {
        if (Ext.isIE)
            e.browserEvent.keyCode = 8;
        e.stopEvent();
        document.location = document.location;
      }
      else
        Ext.Msg.alert('Refresh', 'You clicked: CTRL-F5');
  }
});


Ext.onReady(function(){
  Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
  Ext.QuickTips.init();

  store = new Ext.data.GroupingStore( {
  //var store = new Ext.data.Store( {
    proxy : new Ext.data.HttpProxy({
      url: 'processesList'
    }),

    reader : new Ext.data.JsonReader( {
      totalProperty: 'totalCount',
      root: 'data',
      fields : [
        {name : 'PRO_DESCRIPTION'},
        {name : 'PRO_UID'},
        {name : 'PRO_CATEGORY_LABEL'},
        {name : 'PRO_TITLE'},
        {name : 'PRO_STATUS'},
        {name : 'PRO_STATUS_LABEL'},
        {name : 'PRO_CREATE_DATE'},
        {name : 'PRO_DEBUG'},
        {name : 'PRO_DEBUG_LABEL'},
        {name : 'PRO_CREATE_USER_LABEL'},
        {name : 'CASES_COUNT', type:'float'},
        {name : 'CASES_COUNT_DRAFT', type:'float'},
        {name : 'CASES_COUNT_TO_DO', type:'float'},
        {name : 'CASES_COUNT_COMPLETED', type:'float'},
        {name : 'CASES_COUNT_CANCELLED', type:'float'}
      ]
    })//,
    //sortInfo:{field: 'PRO_TITLE', direction: "ASC"}
    //groupField:'PRO_CATEGORY_LABEL'
  });
  
  var expander = new Ext.ux.grid.RowExpander({
    tpl : new Ext.Template(
        '<p><b>' + _('ID_PRO_DESCRIPTION') + ':</b> {PRO_DESCRIPTION}</p><br>'
    )
  });

  comboCategory = new Ext.form.ComboBox({
      fieldLabel : 'Categoty',
      hiddenName : 'category',
      store : new Ext.data.Store( {
        proxy : new Ext.data.HttpProxy( {
          url : '../processProxy/categoriesList',
          method : 'POST'
        }),
        reader : new Ext.data.JsonReader( {
          fields : [ {
            name : 'CATEGORY_UID'
          }, {
            name : 'CATEGORY_NAME'
          } ]
        })
      }),
      valueField : 'CATEGORY_UID',
      displayField : 'CATEGORY_NAME',
      triggerAction : 'all',
      emptyText : _('ID_SELECT'),
      selectOnFocus : true,
      editable : true,
      width: 180,
      allowBlank : true,
      autocomplete: true,
      typeAhead: true,
      allowBlankText : _('ID_SHOULD_SELECT_LANGUAGE_FROM_LIST'),
      listeners:{
      scope: this,
      'select': function() {
        filter = comboCategory.value;
        store.setBaseParam( 'category', filter);
        var searchTxt = Ext.util.Format.trim(Ext.getCmp('searchTxt').getValue());
        
        if( searchTxt == '' ){
          store.setBaseParam( 'processName', '');
        }
        store.load({params:{category: filter, start : 0 , limit : 25 }});
      }}
    })
/*  storePageSize = new Ext.data.SimpleStore({
    fields: ['size'],
    data: [['20'],['30'],['40'],['50'],['100']],
    autoLoad: true
  });
    
  var comboPageSize = new Ext.form.ComboBox({
    typeAhead     : false,
    mode          : 'local',
    triggerAction : 'all',
    store: storePageSize,
    valueField: 'size',
    displayField: 'size',
    width: 50,
    editable: false,
    listeners:{
      select: function(c,d,i){
        //UpdatePageConfig(d.data['size']);
        bbar.pageSize = parseInt(d.data['size']);
        bbar.moveFirst();
        
        //Ext.getCmp('bbar').setPageSize(comboPageSize.getValue());
      }
    }
  });

  comboPageSize.setValue(pageSize);


  var bbar = new Ext.PagingToolbar({
    id: 'bbar',
    pageSize: '15',
    store: store,
    displayInfo: true,
    displayMsg: 'Displaying Processes {0} - {1} of {2}',
    emptyMsg: "",
    items:[_('ID_PAGE_SIZE')+':',comboPageSize]
  })  */  
  processesGrid = new Ext.grid.GridPanel( {
    region: 'center',
    layout: 'fit',
    id: 'processesGrid',
    height:500,
    //autoWidth : true,
    width:'',
    title : '',
    stateful : true,
    stateId : 'grid',
    enableColumnResize: true,
    enableHdMenu: true,
    frame:false,
    plugins: expander,
    cls : 'grid_with_checkbox',
    columnLines: true,

    
    /*view: new Ext.grid.GroupingView({
        //forceFit:true,
        //groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
        groupTextTpl: '{text}'
    }),*/
    viewConfig: {
      forceFit:true,
      cls:"x-grid-empty",
      emptyText: _('ID_NO_RECORDS_FOUND')
    },
    cm: new Ext.grid.ColumnModel({
      defaults: {
          width: 200,
          sortable: true
      },    
      columns: [
        expander,
        {id:'PRO_UID', dataIndex: 'PRO_UID', hidden:true, hideable:false},
        {header: "", dataIndex: 'PRO_STATUS', width: 50, hidden:true, hideable:false},
        {header: _('ID_PRO_DESCRIPTION'), dataIndex: 'PRO_DESCRIPTION',hidden:true, hideable:false},
        {header: _('ID_PRO_TITLE'), dataIndex: 'PRO_TITLE', width: 300},
        {header: _('ID_CATEGORY'), dataIndex: 'PRO_CATEGORY_LABEL', width: 100, hidden:false},
        {header: _('ID_STATUS'), dataIndex: 'PRO_STATUS_LABEL', width: 50, renderer:function(v,p,r){
          color = r.get('PRO_STATUS') == 'ACTIVE'? 'green': 'red';
          return String.format("<font color='{0}'>{1}</font>", color, v);
        }},
        {header: _('ID_PRO_USER'), dataIndex: 'PRO_CREATE_USER_LABEL', width: 150},
        {header: _('ID_PRO_CREATE_DATE'), dataIndex: 'PRO_CREATE_DATE', width: 90}, 
        {header: _('ID_INBOX'), dataIndex: 'CASES_COUNT_TO_DO', width: 50, align:'right'},
        {header: _('ID_DRAFT'), dataIndex: 'CASES_COUNT_DRAFT', width: 50, align:'right'},
        {header: _('ID_COMPLETED'), dataIndex: 'CASES_COUNT_COMPLETED', width: 70, align:'right'},
        {header: _('ID_CANCELLED'), dataIndex: 'CASES_COUNT_CANCELLED', width: 70, align:'right'},
        {header: _('ID_TOTAL_CASES'), dataIndex: 'CASES_COUNT', width: 80,renderer:function(v){return "<b>"+v+"</b>";}, align:'right'},
        {header: _('ID_PRO_DEBUG'), dataIndex: 'PRO_DEBUG_LABEL', width: 50, align:'center'}
      ]
    }),                  
    store: store,
    tbar:[
      {
        text: _('ID_NEW'),
        iconCls: 'button_menu_ext ss_sprite ss_add',
        //icon: '/images/addc.png',
        handler: newProcess
      },
    	'-'  
      ,{
        text: _('ID_EDIT'),
        iconCls: 'button_menu_ext ss_sprite  ss_pencil',
        //icon: '/images/edit.gif',
        handler: editProcess
      },/*{
        text:TRANSLATIONS.ID_EDIT_BPMN,
        iconCls: 'button_menu_ext',
        icon: '/images/pencil_beta.png',
        handler: editNewProcess
      },*/{
        text: _('ID_STATUS'),
        id:'activator',
        icon: '',
        iconCls: 'silk-add',
        handler: activeDeactive,
        disabled:true
      },{
        text: _('ID_DELETE'),
        iconCls: 'button_menu_ext ss_sprite  ss_delete',
        //icon: '/images/delete-16x16.gif',
        handler:deleteProcess
      },{
        xtype: 'tbseparator'
      },{
        text: _('ID_IMPORT'),
        iconCls: 'silk-add',
        icon: '/images/import.gif',
        handler:importProcess
      },{
        text: _('ID_XPDL_IMPORT'),
        iconCls: 'silk-add',
        icon: '/images/import.gif',
        handler:importXPDLProcess
      },/*{
        text:'Export',
        iconCls: 'silk-add',
        icon: '/images/export.png',
      },*/{
        text: _('ID_BROWSE_LIBRARY'),
        iconCls: 'button_menu_ext ss_sprite  ss_world',
        //icon: '/images/icon-pmwebservices.png',
        handler: browseLibrary
      },
      {
        xtype: 'tbfill'
      },{
        xtype: 'tbseparator'
      },
      _('ID_CATEGORY'),
      comboCategory,{
        xtype: 'tbseparator'
      },new Ext.form.TextField ({
        id: 'searchTxt',
        ctCls:'pm_search_text_field',
        allowBlank: true,
        width: 150,
        emptyText: _('ID_ENTER_SEARCH_TERM'),//'enter search term',
        listeners: {
          specialkey: function(f,e){
            if (e.getKey() == e.ENTER) {
              doSearch();
            }
          }
        }
      }),{
        text:'X',
        ctCls:'pm_search_x_button',
        handler: function(){
          //store.setBaseParam( 'category', '<reset>');
          store.setBaseParam( 'processName', '');
          store.load({params:{start : 0 , limit : '' }});
          Ext.getCmp('searchTxt').setValue('');
          //comboCategory.setValue('');
          //store.reload();
        }
      },{
        text: _('ID_SEARCH'),
        handler: doSearch
      }
    ],
    // paging bar on the bottom
    bbar: new Ext.PagingToolbar({
        pageSize: 15,
        store: store,
        displayInfo: true,
        displayMsg: 'Displaying Processes {0} - {1} of {2}',
        emptyMsg: "",
        items:[]
    }),
    listeners: {
      rowdblclick: editProcess,
      render: function(){
        this.loadMask = new Ext.LoadMask(this.body, {msg:'Loading...'});
        processesGrid.getSelectionModel().on('rowselect', function(){
          var rowSelected = processesGrid.getSelectionModel().getSelected();
          var activator = Ext.getCmp('activator');
          activator.setDisabled(false);
          if( rowSelected.data.PRO_STATUS == 'ACTIVE' ){
            activator.setIcon('/images/deactivate.png');
            activator.setText( _('ID_DEACTIVATE') );
          } else {
            activator.setIcon('/images/activate.png');
            activator.setText( _('ID_ACTIVATE') );
          }
        });
      }
    }
  });

  processesGrid.store.load({params: {"function":"languagesList"}});
  processesGrid.addListener('rowcontextmenu', onMessageContextMenu,this);
  processesGrid.on('rowcontextmenu', function (grid, rowIndex, evt) {
    var sm = grid.getSelectionModel();
    sm.selectRow(rowIndex, sm.isSelected(rowIndex));
    
    var rowSelected = Ext.getCmp('processesGrid').getSelectionModel().getSelected();
    var activator = Ext.getCmp('activator2');
    var debug = Ext.getCmp('debug');
    
    if( rowSelected.data.PRO_STATUS == 'ACTIVE' ){
      activator.setIconClass('icon-deactivate');
      activator.setText( _('ID_DEACTIVATE') );
    } else {
      activator.setIconClass('icon-activate');
      activator.setText( _('ID_ACTIVATE') );
    }

    if( rowSelected.data.PRO_DEBUG == 1){
      debug.setIconClass('icon-debug-disabled');
      debug.setText(_('ID_DISABLE_DEBUG'));
    } else {
      debug.setIconClass('icon-debug');
      debug.setText(_('ID_ENABLE_DEBUG'));
    }
  }, this);
  processesGrid.on('contextmenu', function (evt) {
      evt.preventDefault();
  }, this);

  function onMessageContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    messageContextMenu.showAt([coords[0], coords[1]]);
  }
      
  var messageContextMenu = new Ext.menu.Menu({
    id: 'messageContextMenu',
    items: [{
        text: _('ID_EDIT'),
        iconCls: 'button_menu_ext ss_sprite  ss_pencil',
        handler: editProcess
      },/*{
        text: _('ID_EDIT_BPMN'),
        icon: '/images/pencil_beta.png',
        handler: editNewProcess
      },*/ {
        id: 'activator2',
        text: '',
        icon: '',
        handler: activeDeactive
      }, {
        id: 'debug',
        text: '',
        handler: enableDisableDebug
      }, {
        text: _('ID_DELETE'),
        icon: '/images/delete.png',
        handler: deleteProcess
      }
    ]
  });

  var viewport = new Ext.Viewport({
    layout: 'border',
    autoScroll: true,
    items: [
      processesGrid
    ]
  });
});


function newProcess(){
  //  window.location = 'processes_New';
  var ProcessCategories = new Ext.form.ComboBox({
    fieldLabel : 'Category',
    hiddenName : 'PRO_CATEGORY',
    valueField : 'CATEGORY_UID',
    displayField : 'CATEGORY_NAME',
    triggerAction : 'all',
    selectOnFocus : true,
    editable : false,
    width: 180,
    allowBlank : true,
    value: '',
    store : new Ext.data.Store( {
      autoLoad: true,  //autoload the data
      proxy : new Ext.data.HttpProxy( {
        url : '../processProxy/getCategoriesList',
        method : 'POST'
      }),
      
      reader : new Ext.data.JsonReader( {
        fields : [ {
          name : 'CATEGORY_UID'
        }, {
          name : 'CATEGORY_NAME'
        } ]
      })
    })
  });
  ProcessCategories.store.on('load',function(store) {
    ProcessCategories.setValue(store.getAt(0).get('CATEGORY_UID'));
  });


  var frm = new Ext.FormPanel( {
    id: 'newProcessForm',
    labelAlign : 'right',
    bodyStyle : 'padding:5px 5px 0',
    width : 400,
    items : [ {
        id: 'PRO_TITLE',
        fieldLabel: _('ID_TITLE'), 
        xtype:'textfield',
        width: 260,
        maskRe: /^(?!^(PRN|AUX|CLOCK\$|NUL|CON|COM\d|LPT\d|\..*)(\..+)?$)[^\x00-\x1f\\?*:\";|/]+$/i,
        allowBlank: false
      },  {
        id: 'PRO_DESCRIPTION',
        fieldLabel: _('ID_DESCRIPTION'),
        xtype:'textarea',
        width: 260 
      },
      ProcessCategories/*,
      {
        id: 'editor',
        xtype: 'radiogroup',
        fieldLabel: _('ID_OPEN_WITH'),
        items: [  
          {boxLabel: _('ID_CLASSIC_EDITOR'), name: 'editor', inputValue: 'classic', checked: true},
          {boxLabel: _('ID_BPMN_EDITOR'), name: 'editor', inputValue: 'bpmn'}
        ]
      }*/
    ],
    buttons : [{
      text : _('ID_CREATE'),
      handler : saveProcess
    },{
      text : _('ID_CANCEL'),
      handler : function() {
        win.close();
      }
    }]   
  });

  var win = new Ext.Window({
    title: _('ID_CREATE_PROCESS'),
    width: 470,
    height: 220,
    layout:'fit',
    autoScroll:true,
    modal: true,
    maximizable: false,
    items: [frm]
  });
  win.show();
}

function saveProcess()
{
  Ext.getCmp('newProcessForm').getForm().submit( {
    url : '../processProxy/saveProcess',
    waitMsg : _('ID_SAVING_PROCESS'),
    timeout : 36000,
    success : function(obj, resp) {
      location.href = 'processes_Map?PRO_UID='+resp.result.PRO_UID;
    },
    failure: function(obj, resp) {
      PMExt.error( _('ID_ERROR'), resp.result.msg);
    }
  });
}

function doSearch(){
  if(comboCategory.getValue() == '')
    store.setBaseParam( 'category', '<reset>');
  filter = Ext.getCmp('searchTxt').getValue();
  
  store.setBaseParam('processName', filter);
  store.load({params:{processName: filter, start : 0 , limit : 25 }});
}

editProcess = function(){
  var rowSelected = processesGrid.getSelectionModel().getSelected();
  if( rowSelected ) {
    location.href = 'processes_Map?PRO_UID='+rowSelected.data.PRO_UID+'&rand='+Math.random()
  } else {
     Ext.Msg.show({
      title:'',
      msg: _('ID_NO_SELECTION_WARNING'),
      buttons: Ext.Msg.INFO,
      fn: function(){},
      animEl: 'elId',
      icon: Ext.MessageBox.INFO,
      buttons: Ext.MessageBox.OK
    });
  }
}

editNewProcess = function(){
  var rowSelected = processesGrid.getSelectionModel().getSelected();
  if( rowSelected ) {
    location.href = '../bpmnDesigner?id='+rowSelected.data.PRO_UID
  } else {
     Ext.Msg.show({
      title:'',
      msg: _('ID_NO_SELECTION_WARNING'),
      buttons: Ext.Msg.INFO,
      fn: function(){},
      animEl: 'elId',
      icon: Ext.MessageBox.INFO,
      buttons: Ext.MessageBox.OK
    });
  }
}

deleteProcess = function(){
  var rows = processesGrid.getSelectionModel().getSelections();
  if( rows.length > 0 ) {
    isValid = true;
    errLog = Array();
    
    //verify if the selected rows have not any started or delegated cases
    for(i=0; i<rows.length; i++){
      if( rows[i].get('CASES_COUNT') != 0 ){
        errLog.push(i);
        isValid = false;
      }
    }
    
    if( isValid ){
      ids = Array();
      for(i=0; i<rows.length; i++)
        ids[i] = rows[i].get('PRO_UID');

      PRO_UIDS = ids.join(',');

      Ext.Msg.confirm(
        _('ID_CONFIRM'),
        (rows.length == 1) ? _('ID_PROCESS_DELETE_LABEL') : _('ID_PROCESS_DELETE_ALL_LABEL'),
        function(btn, text){
          if ( btn == 'yes' ){
            Ext.MessageBox.show({ msg: _('ID_DELETING_ELEMENTS'), wait:true,waitConfig: {interval:200} });
            Ext.Ajax.request({
              url: 'processes_Delete',
              success: function(response) {
                Ext.MessageBox.hide();
                processesGrid.store.reload();
                result = Ext.util.JSON.decode(response.responseText);
                
                if(result){
                  if(result.status != 0){
                    Ext.MessageBox.show({
                      title: _('ID_ERROR'),
                      msg: result.msg,
                      buttons: Ext.MessageBox.OK,
                      icon: Ext.MessageBox.ERROR
                    });
                  }
                } else
                  Ext.MessageBox.show({
                    title: _('ID_ERROR'),
                    msg: response.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                  });
              },
              params: {PRO_UIDS:PRO_UIDS}
            });
          }
        }
      );
    } else {
      errMsg = '';
      for(i=0; i<errLog.length; i++){
        e = _('ID_PROCESS_CANT_DELETE');
        e = e.replace('{0}', rows[errLog[i]].get('PRO_TITLE'));
        e = e.replace('{1}', rows[errLog[i]].get('CASES_COUNT'));
        errMsg += e + '<br/>';
      }
      Ext.MessageBox.show({
        title: 'Error',
        msg: errMsg,
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.ERROR
      });
    }
  } else {
    Ext.Msg.show({
      title:'',
      msg: _('ID_NO_SELECTION_WARNING'),
      buttons: Ext.Msg.INFO,
      fn: function(){},
      animEl: 'elId',
      icon: Ext.MessageBox.INFO,
      buttons: Ext.MessageBox.OK
    });
  }
}

importProcess = function(){
  window.location = 'processes_Import';
}

importXPDLProcess = function(){
  window.location = 'processes_ImportXpdl';
}

browseLibrary = function(){
  window.location = 'processes_Library';
}

function activeDeactive(){
  var rows = processesGrid.getSelectionModel().getSelections();
  
  if( rows.length > 0 ) {
    var ids = '';
    for(i=0; i<rows.length; i++) {
      if(i != 0 ) ids += ',';
      ids += rows[i].get('PRO_UID');
    }

    Ext.Ajax.request({
      url : '../processProxy/changeStatus',
      params : { UIDS : ids },
      success: function ( result, request ) {
        store.reload();
        var activator = Ext.getCmp('activator');
        activator.setDisabled(true);
        activator.setText('Status');
        activator.setIcon('');
      },
      failure: function ( result, request) {
        Ext.MessageBox.alert(_('ID_FAILED'), result.responseText);
      }
    });
  } else {
     Ext.Msg.show({
      title:'',
      msg: _('ID_NO_SELECTION_WARNING'),
      buttons: Ext.Msg.INFO,
      fn: function(){},
      animEl: 'elId',
      icon: Ext.MessageBox.INFO,
      buttons: Ext.MessageBox.OK
    });
  }
}

function enableDisableDebug()
{
  var rows = processesGrid.getSelectionModel().getSelections();
  
  if( rows.length > 0 ) {
    var ids = '';
    for(i=0; i<rows.length; i++)
      ids += (i != 0 ? ',': '') + rows[i].get('PRO_UID');

    Ext.Ajax.request({
      url : '../processProxy/changeDebugMode' ,
      params : {UIDS: ids},
      success: function ( result, request ) {
        store.reload();
        var activator = Ext.getCmp('activator');
        activator.setDisabled(true);
        activator.setText('Status');
        activator.setIcon('');
      },
      failure: function ( result, request) {
        Ext.MessageBox.alert(_('ID_FAILED'), result.responseText);
      }
    });
  } else {
    Ext.Msg.show({
      title:'',
      msg: _('ID_NO_SELECTION_WARNING'),
      buttons: Ext.Msg.INFO,
      fn: function(){},
      animEl: 'elId',
      icon: Ext.MessageBox.INFO,
      buttons: Ext.MessageBox.OK
    });
  }

}

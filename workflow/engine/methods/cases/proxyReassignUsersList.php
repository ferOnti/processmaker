<?php
  $callback = isset($_POST['callback']) ? $_POST['callback'] : 'stcCallback1001';
  $dir      = isset($_POST['dir'])      ? $_POST['dir']    : 'DESC';
  $sort     = isset($_POST['sort'])     ? $_POST['sort']   : '';
  $start    = isset($_POST['start'])    ? $_POST['start']  : '0';
  $limit    = isset($_POST['limit'])    ? $_POST['limit']  : '25';
  $filter   = isset($_POST['filter'])   ? $_POST['filter'] : '';
  $search   = isset($_POST['search'])   ? $_POST['search'] : '';
  $process  = isset($_POST['process'])  ? $_POST['process'] : '';
  $user     = isset($_POST['user'])     ? $_POST['user']    : '';
  $status   = isset($_POST['status'])   ? strtoupper($_POST['status']) : '';
  $action   = isset($_GET['action'])    ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : 'todo');
  $type     = isset($_GET['type'])      ? $_GET['type'] : (isset($_POST['type']) ? $_POST['type'] : 'extjs');
  $user     = isset($_POST['user'])     ? $_POST['user'] : '';

//  $APP_UIDS          = explode(',', $_POST['APP_UID']);
  
  $appUid = isset($_POST['application']) ? $_POST['application'] : '';
//  $processUid = isset($_POST['process'])     ? $_POST['process'] : '';
//  $TaskUid    = isset($_POST['task'])        ? $_POST['task'] : '';
	$sReassignFromUser = isset($_POST['user']) ? $_POST['user'] : '';

        G::LoadClass('tasks');
        G::LoadClass('groups');
        G::LoadClass('case');
        G::LoadClass('users');

        $oTasks  = new Tasks();
        $oGroups = new Groups();
        $oUser   = new Users();
        $oCases  = new Cases();

        $aCasesList = Array();

//        foreach ( $APP_UIDS as $APP_UID ) {
        	  $aCase  = $oCases->loadCaseInCurrentDelegation($appUid);
            
            $aUsersInvolved = Array();
            $aCaseGroups = $oTasks->getGroupsOfTask($aCase['TAS_UID'], 1);

            G::loadClass('configuration');
            $oConfig = new Configuration();
            try {
              $aConfig = $oConfig->load('ENVIRONMENT_SETTINGS');
              $aConfig = unserialize($aConfig['CFG_VALUE']);
            } catch (Exception $e){
              // if there is no configuration record then.
              $aConfig['format'] = '@userName';
            }
            
//            var_dump($aConfig);
            foreach ( $aCaseGroups as $aCaseGroup ) {
              $aCaseUsers = $oGroups->getUsersOfGroup($aCaseGroup['GRP_UID']);
              foreach ( $aCaseUsers as $aCaseUser ) {
                if ( $aCaseUser['USR_UID'] != $sReassignFromUser ) {
                  $aCaseUserRecord = $oUser->load($aCaseUser['USR_UID']);
                  $sCaseUser = G::getFormatUserList ($aConfig['format'],$aCaseUserRecord);
//                        $aUsersInvolved[] = array ( 'userUid' => $aCaseUser['USR_UID'] , 'userFullname' => $aCaseUserRecord['USR_FIRSTNAME'] . ' ' . $aCaseUserRecord['USR_LASTNAME']); // . ' (' . $aCaseUserRecord['USR_USERNAME'] . ')';
                  $aUsersInvolved[] = array ( 'userUid' => $aCaseUser['USR_UID'] , 'userFullname' => $sCaseUser); // . ' (' . $aCaseUserRecord['USR_USERNAME'] . ')';
                }
              }
            }

            $aCaseUsers = $oTasks->getUsersOfTask($aCase['TAS_UID'], 1);
            foreach ( $aCaseUsers as $aCaseUser ) {
                if ( $aCaseUser['USR_UID'] != $sReassignFromUser ) {
                    $aCaseUserRecord = $oUser->load($aCaseUser['USR_UID']);
                    $sCaseUser = G::getFormatUserList ($aConfig['format'],$aCaseUserRecord);
//                    $aUsersInvolved[] = array ( 'userUid' => $aCaseUser['USR_UID'] , 'userFullname' => $aCaseUserRecord['USR_FIRSTNAME'] . ' ' . $aCaseUserRecord['USR_LASTNAME']); // . ' (' . $aCaseUserRecord['USR_USERNAME'] . ')';
                    $aUsersInvolved[] = array ( 'userUid' => $aCaseUser['USR_UID'] , 'userFullname' => $sCaseUser); // . ' (' . $aCaseUserRecord['USR_USERNAME'] . ')';
                }
            }
//            $oTmp = new stdClass();
//            $oTmp->items = $aUsersInvolved;
        $result = array();
        $result['data'] = $aUsersInvolved;
        print G::json_encode( $result ) ;

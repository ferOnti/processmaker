<?php
/**
 * showLogoFile.php
 *
 * ProcessMaker Open Source Edition
 * Copyright (C) 2004 - 2008 Colosa Inc.23
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * For more information, contact Colosa Inc, 2566 Le Jeune Rd.,
 * Coral Gables, FL, 33134, USA, or email info@colosa.com.
 *
 */
  if (($RBAC_Response = $RBAC->userCanAccess("PM_CASES"))!=1) return $RBAC_Response;

	$ainfoSite = explode("/",$_SERVER["REQUEST_URI"]);
	$dir=PATH_DATA."sites".PATH_SEP.str_replace("sys","",$ainfoSite[1]).PATH_SEP."files/logos";
	$imagen = $dir .PATH_SEP.G::decrypt($_GET['id'],'imagen');

  if (is_file($imagen))
	{
    showLogo($imagen);

	}else{

  $newDir = PATH_DATA."sites".PATH_SEP.str_replace("sys","",$ainfoSite[1]).PATH_SEP."files/logos"; 
  $dir = PATH_HOME . "public_html/files/logos";
  
  if(!is_dir($newDir)){
   G::mk_dir($newDir);
  }
  cpyMoreLogos($dir,$newDir);
  $newDir .= PATH_SEP.G::decrypt($_GET['id'],'imagen');
  showLogo($newDir);
  die;

  }


  function showLogo($imagen){
    $ext = substr($imagen, strrpos($imagen, '.') + 1); // extension
	
	  header('content-type: image/'.$ext);
	  readfile($imagen);
	  exit;
  }

  function cpyMoreLogos($dir,$newDir){
    if (file_exists($dir)) {
        if ($handle = opendir($dir)) {
          while (false !== ($file = readdir($handle))) {
            if(($file!=".")&&($file!="..")) {
              $extention=explode(".", $file);
              $aImageProp=getimagesize($dir.'/'.$file, $info);
              $sfileExtention = strtoupper($extention[count($extention)-1]);
              if( in_array($sfileExtention, array('JPG','JPEG','PNG','GIF') ) ) {

                $dir1 = $dir.PATH_SEP.$file;
                $dir2 = $newDir.PATH_SEP.$file;
                //print $dir1 ."  *** ".$dir2."<br><br>";
                copy($dir1,$dir2);


              }
            }
          }
          closedir($handle);
        }
      }
  }

die;
	

?>
<script>
 
</script>

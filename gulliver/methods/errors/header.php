<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>Server Error :: </title>
<link href="style.css" rel="stylesheet" type="text/css">
</head>

<body>
<table width="100%" height="75" border="0" cellpadding="0" cellspacing="0" bgcolor="#fff">
  <tr>
    <td width="20%" align="center">&nbsp;</td>
    <td width="100px" align="center" scope="col"><img src="/js/common/core/images/default_logo.gif"></td>
    <td width="45%" scope="col">&nbsp;</td>
    <td width="35%" class="mxbOnlineText" scope="col"><?= $ERROR_TEXT ?></td>
  </tr>
  <tr>
    <td height="12" colspan="4" align="center" bgcolor="#336699" scope="col"></td>
  </tr>
</table>
<br />
<br />
<table width="70%" border="0" align="center" cellpadding="0" cellspacing="0" class="mainCopy">
  <tr>
    <td width="15%" align="left" scope="col"><span class="mxbOnlineTextBlue"><?= $ERROR_TEXT ?> </span><br />
    <?= $ERROR_DESCRIPTION ?>
  </tr>
</table>
</body>
</html>

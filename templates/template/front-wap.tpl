<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
    <meta content="telephone=no" name="format-detection" />
    <title>{block name="title"}{/block}</title>
    <link rel="stylesheet" href="{#static_path#}/css/mobile/weui.css">
    <link rel="stylesheet" href="{#static_path#}/css/mobile/example.css">
    <link rel="stylesheet" href="{#static_path#}/css/mobile/appv2.0.css"/>
    <link rel="stylesheet" href="{#static_path#}/css/mobile/iconfont.css">

    {block name="css"}{/block}
</head>
<body ontouchstart>

{block name="container"}{/block}


<script src="{#static_path#}/js/mobile/zepto.min.js"></script>
{*<script src="{#static_path#}/js/mobile/zepto.touch.js"></script>*}
<script src="{#static_path#}/js/mobile/router.min.js"></script>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>

{block name="js"}{/block}

</body>
</html>
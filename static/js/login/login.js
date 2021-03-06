$(document).ready(function(){
    var dragPerson=$('#drag-person');
    var dragCompany=$('#drag-company');
    dragPerson.drag();
    dragCompany.drag();
    $('.bind-enter').keydown(function(){
        if(event.keyCode == 13){
            $('.login-btn').click();
        }
    });

    var errorMsgObj=$('#errorMsgIDLogin');
    //var root = "__WWW__";
    var errorMsgGroupObj=errorMsgObj.parent();
    errorMsgGroupObj.hide();
    /*检查用户名*/
    $('#userID').on('blur',function()
    {
        var parent=$(this).parent();
        parent.removeClass('has-error');
        errorMsgGroupObj.hide();
        var user=$.trim($(this).val());
        if(user.length==0)
        {
            parent.addClass('has-error');
        }
    });


    /*检查用户密码*/
    $('#passwordID').on('blur',function()
    {
        var parent=$(this).parent();
        parent.removeClass('has-error');
        var password=$(this).val();
        var result=check_password_format(password);
        if(result==0)
        {
            parent.addClass('has-error');
        }
    });

    function check_all_inputs()
    {
        if(!dragPerson.isOk()) {
            return showUserError('请拖动滑块进行验证');
        }
        var userID=$('#userID');
        var passwordID=$('#passwordID');
        var user=$.trim(userID.val());
        var userParent=userID.parent();
        var password=passwordID.val();
        var passwordParent=passwordID.parent();
        userParent.removeClass('has-error');
        passwordParent.removeClass('has-error');
        errorMsgGroupObj.hide();
        var account_flag=true;
        var password_flag=true;
        var user_examine_flag = '';
        // var verify_empty_flag=true;
        var password_empty_flag = true;
        callAjax({'user': user},0,function (response){
            user_examine_flag = response;
        },root + "/check/getGroupUserListData/");
        if (user.length==0) {
            account_flag=false;
        }
//            /****************用户名错误时候的验证*********************/

        else if (check_password_format(password)==0) {
            password_empty_flag=false;
        }

        else if(!check_user_password_match_ajax(user,password,root)) {
            password_flag=false;
        }
        /*用户名错误时候的验证*/
        if(!account_flag) {
            dragPerson.reset();
            userParent.addClass('has-error');
            return showUserError('用户名格式错误，请使用用户名/手机号/身份证进行登录');
        }else if(!password_empty_flag) {
            dragPerson.reset();
            passwordParent.addClass('has-error');
            return showUserError('密码不能为空');
        }else if(user_examine_flag ==0){
            dragPerson.reset();
            userParent.addClass('has-error');
            passwordParent.addClass('has-error');
            return showUserError('您申请的保障方案正在审核中，请联系贵公司HR或服务提供商');
        }else if(!password_flag) {
            dragPerson.reset();
            userParent.addClass('has-error');
            passwordParent.addClass('has-error');
            return showUserError('用户名或密码错误');
        }
        return true;
    }
    
    function showUserError(msg){
        errorMsgObj.html(msg).show();
        errorMsgGroupObj.show();
        return false;
    }
    
    $('#verifyID').on('focus',function()
    {
        $(this).parent().parent().removeClass('has-error');
    });


    /*提交登录表单*/
    function userClick(){
        if(check_all_inputs())
        {
            $('#form_password').submit();
        }
    }
    $('#form_password_submit').on('click',userClick);


    /*******************************企业登录相关*******************************/
    var companyErrorMsgObj=$('#companyErrorMsgIDLogin');
    var companyErrorParentObj=companyErrorMsgObj.parent();
    var companyUserObj=$('#company_userID');
    var companyUserObjParent=companyUserObj.parent();
    var companyPwdObj=$('#company_pwdID');
    var companyPwdObjParent=companyPwdObj.parent();
    var companyVerifyObj=$('#company_verifyID');
    var companyVerifyObjParent=companyVerifyObj.parent();
    var companySubmitID=$('#company_login_submit');
    companyErrorMsgObj.html('');
    companyErrorParentObj.hide();
    companyUserObj.on('blur',function(){
        var account=$.trim($(this).val());
        if(!checkUserFormat(account))
        {
            companyUserObjParent.addClass("has-error");
        }else if(companyUserObjParent.attr("class").indexOf("has-error")!=-1){
            companyUserObjParent.removeClass("has-error");
        }
    });

    companyPwdObj.on('blur',function(){
        var password=$(this).val();
        if (!checkPasswordFormat(password))
        {
            companyPwdObjParent.addClass("has-error");
        }else  if(companyPwdObjParent.attr("class").indexOf("has-error")!=-1){
            companyPwdObjParent.removeClass("has-error");
        }
    });


    function checkUserFormat(user)
    {
        var flag=true;
        if(user.length==0)
        {
            flag=false;
        }
        return flag;
    }

    function checkPasswordFormat(password)
    {
        return password.length!=0;
    }

    function checkCompanyAllInputs()
    {
        var flag=false;
        var account=$.trim(companyUserObj.val());
        var password=companyPwdObj.val();
        companyErrorMsgObj.html('');
        if(!dragCompany.isOk()){
            showCompanyError('请拖动滑块进行验证',false);
        }else if (!checkUserFormat(account))
        {
            dragCompany.reset();
            companyUserObjParent.addClass("has-error");
            showCompanyError('请输入公司账号',false);
        } else if (!checkPasswordFormat(password))
        {
            dragCompany.reset();
            companyPwdObjParent.addClass("has-error");
            showCompanyError('账户或密码错误',true);
        }else if(!checkPassword(account,password))
        {
            dragCompany.reset();
            companyPwdObjParent.addClass("has-error");
            companyUserObjParent.addClass("has-error");
            showCompanyError('账户或密码错误',true);
        }
        else
        {
            flag=true;
        }
        return flag;

    }
    function showCompanyError(msg,isRefreshVerify){
        if(isRefreshVerify){
            companyVerifyObj.next().find('img').click();
        }
        companyErrorMsgObj.html(msg);
        companyErrorParentObj.show();
    }
    
    function checkGroupUserExists(account)
    {
        var flag=false;
        callAjax( { "user": account }, 0, function ( response ) {
            if ( response ) {
                flag=true;
            }
        }, root + "/check/checkGroupUserExistsAjax/" );
        return flag;
    }
    function checkPassword(account,password)
    {
        var flag=false;
        var option='group';
        callAjax( { 'option' : option, 'password' : password, 'user' : account }, 0, function ( response ) {
            if ( response == 1 ) {
                flag= true;/*密码正确*/
            }
        }, root + "/check/check_password_ajax/" );
        return flag;
    }
    function companyClick(){
        if(companyPwdObjParent.attr("class").indexOf("has-error")!=-1){
            companyPwdObjParent.removeClass("has-error");
        }else if(companyUserObjParent.attr("class").indexOf("has-error")!=-1){
            companyUserObjParent.removeClass("has-error");
        }
        if(checkCompanyAllInputs())
        {
            $('#companyFormID').submit();
        }
    }
    companySubmitID.on('click',companyClick);
    /*点击enter键实现同样的点击效果*/
    var insTabs=$("#ins_tabs");
    $(document).on("keydown", function (event) {
        var e=event||window.event;
        if(e&& e.keyCode==13){
            var num=insTabs.find("li.active").index();
            if(num==0){
                companyClick();
            }else if(num==1){
                userClick();
            }
        }
    });
});
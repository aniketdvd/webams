function checkpassword(form)
{
    password=form.password.value;
    confirmPassword=form.confirmPassword.value;
    if (password!=confirmPassword){
        alert("Password and ConfirmPassword must be the same");
        return false;
    }
    else
        return true;
}
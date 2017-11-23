$(document).foundation();


const login_button = document.querySelector("input[type='submit']");
const other_user_button = document.querySelector(".other_user");
const password = document.getElementById("password");
const error = document.getElementsByClassName("error");
const delete_user_id = document.querySelector(".delete_user_id");
const user_id = document.querySelector(".user_id");
const fieldset = document.querySelector("fieldset");
const user_new_id = document.getElementById("user_new_id");
const keyboard = document.querySelector(".keyboard");

login_button.addEventListener("click", function(event) {
    event.preventDefault();
    if (password.value === "") {
        if (document.querySelector(".error_info")){
            document.querySelector(".error_info").remove();
        }
        let error = document.createElement('div');
       	error.textContent = "To pole jest wymagane";
        error.className += "error_info";
        fieldset.insertBefore(error, keyboard);
        password.className += "error";
    } else {
        $.ajax({
            type: "post",
            data: {
                login: user_new_id.value,
                password: password.value},
            url: "https://efigence-camp.herokuapp.com/api/login",
            error: function(response) {
                    if (document.querySelector(".error_info")){
                    document.querySelector(".error_info").remove();
        	       }
        	   let error = document.createElement("div");
       		   error.textContent = JSON.parse(response.responseText)["message"];
        	   error.className += "error_info";
        	   fieldset.insertBefore(error, keyboard);
        	   password.className = "error";
        	   user_new_id.className = "error";
            },
            success: function(response) {
                    window.location.replace("dashboard.html");
                }
            }); //end of ajax
    } //end of conditional
}); //end of eventlistener


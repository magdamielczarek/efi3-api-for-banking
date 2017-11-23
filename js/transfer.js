$(document).foundation();
$(document).ready(function(){

/************* displaying tooltip with message *************/

const messages= document.querySelector(".profile_features .flaticon-note");
const messages_tooltip = document.querySelector(".tooltip_message");

//displaying tooltip message window
messages_tooltip.addEventListener("mouseover", function(event) {messages_tooltip.style.display="block";});
messages_tooltip.addEventListener("mouseleave", function(event) {messages_tooltip.style.display="none";});

//window staying visible
messages.addEventListener("mouseover", function(event) {messages_tooltip.style.display="block";});
messages.addEventListener("mouseleave", function(event) {messages_tooltip.style.display="none";});



/************* log out *************/

const log_out = document.getElementById("log_out_button");
log_out.addEventListener("click", function(event) {
    window.location.replace("login.html");
});


/************* displaying searching input *************/

const search_input = document.querySelector("input[type='search']");
const search_button = document.querySelector(".flaticon-search");
search_button.addEventListener("click", function(){
    search_input.style.animation = "input_show 1s both";
    search_input.focus();
});

search_input.addEventListener("blur", function(){
    search_input.style.animation = "input_hide 1s both";
});



/************* change fieldset if input is active *************/

const recipient = document.getElementById("recipient");
const recipient_input = document.querySelector("#recipient>input");
const book_icon = document.querySelector(".flaticon-open-book");
recipient_input.addEventListener("focus", function(event) {
	recipient.style.backgroundColor="#DADBDB";
	book_icon.style.color="white";
});
recipient_input.addEventListener("blur", function(event) {
	recipient.style.backgroundColor="white";
	book_icon.style.color="#0BBED3";
});


/************* select account from list *************/

const select_account_button = document.querySelector(".flaticon-chevron-arrow-down");
const accounts_list = document.querySelector(".select_account");
const accounts_list_items = document.querySelectorAll(".select_account>li");
select_account_button.addEventListener("click", function(event) {
	event.preventDefault();
	if(accounts_list.style.height !== "auto") {
	accounts_list.style.height = "auto";
	} else {
		accounts_list.style.height = "100px";
	};
});
accounts_list_items.forEach(function(element) {
	element.addEventListener("mouseover",function(event){
		element.style.cursor="pointer";
	});
	element.addEventListener("mouseleave",function(event){
		element.style.cursor="auto";
	});
	element.addEventListener("click", function(event) {
		accounts_list.insertBefore(element, accounts_list.firstChild);
		let account_id = element.childNodes[3].getAttribute("for"); //pobierz atr for, czyli numer konta przypisany do tego labela z li
		let accounts_inputs = document.querySelectorAll(".choose_account_hidden>input"); //tablica z inputami dla kont
		for(i=0;i<accounts_inputs.length;i++){
			if(accounts_inputs[i].getAttribute("id")===account_id){
				accounts_inputs[i].checked ="checked";//ustaw wybranie dla tego inputa
				break;
			};
		};
		accounts_list.style.height ="100px";
	});
});


/************* radio if-checked *************/


// type

const type_button = document.getElementsByClassName("type_wrapper");

const country_radio = document.getElementById("country");
type_button[0].addEventListener("click", function(){
	country_radio.checked = "checked";
});

const own_radio = document.getElementById("own");
type_button[1].addEventListener("click", function(){
	own_radio.checked = "checked";
});

const currencies_radio = document.getElementById("currencies");
type_button[2].addEventListener("click", function(){
	currencies_radio.checked = "checked";
});

const zus_radio = document.getElementById("zus");
type_button[3].addEventListener("click", function(){
	zus_radio.checked = "checked";
});

const tax_radio = document.getElementById("tax");
type_button[4].addEventListener("click", function(){
	tax_radio.checked = "checked";
});

const gsm_radio = document.getElementById("gsm");
type_button[5].addEventListener("click", function(){
	gsm_radio.checked = "checked";
});


// where

const account_button = document.querySelectorAll("#where>.radio_patch")[0];
const account_radio = document.getElementById("account");
account_button.addEventListener("click", function(){
	account_radio.checked = "checked";
});

const facebook_button = document.querySelectorAll("#where>.radio_patch")[1];
const facebook_radio = document.getElementById("facebook");
facebook_button.addEventListener("click", function(){
	facebook_radio.checked = "checked";
});

const phone_button = document.querySelectorAll("#where>.radio_patch")[2];
const phone_radio = document.getElementById("phone");
phone_button.addEventListener("click", function(){
	phone_radio.checked = "checked";
});

const email_button = document.querySelectorAll("#where>.radio_patch")[3];
const email_radio = document.getElementById("email");
email_button.addEventListener("click", function(){
	email_radio.checked = "checked";
});

const byphone_button = document.querySelectorAll("#where>.radio_patch")[4];
const byphone_radio = document.getElementById("byphone");
byphone_button.addEventListener("click", function(){
	byphone_radio.checked = "checked";
});


// type of transfer

const normaly_button = document.querySelectorAll("#speed_transfer>.radio_patch")[0];
const normaly_radio = document.getElementById("normaly");
normaly_button.addEventListener("click", function(){
	normaly_radio.checked = "checked";
});

const express_button = document.querySelectorAll("#speed_transfer>.radio_patch")[1];
const express_radio = document.getElementById("express");
express_button.addEventListener("click", function(){
	express_radio.checked = "checked";
});

const sorbnet_button = document.querySelectorAll("#speed_transfer>.radio_patch")[2];
const sorbnet_radio = document.getElementById("sorbnet");
sorbnet_button.addEventListener("click", function(){
	sorbnet_radio.checked = "checked";
});



/************* recipient section *************/

//life searching 

const recipients_page_list = document.querySelector("#recipient>ul");
let recipients = document.querySelectorAll("#rec_book>ul>li");
const listitems= document.querySelectorAll("#recipient>ul>li");
const number_input = document.getElementById("number");

const check_recipient = function() {
	recipient.style.backgroundColor = "white";
	book_icon.style.color = "#0BBED3";
	let regex = recipient_input.value;
	let search_regexp = new RegExp(regex, "gi");
	if(recipients_page_list.innerHTML!=="") {
		recipients_page_list.innerHTML=("");
	};

	recipients.forEach(function(element) {
		if(element.textContent.search(search_regexp)!==-1)
			{let list_item = document.createElement("li");
			list_item.innerHTML = element.innerHTML;
			recipients_page_list.appendChild(list_item);
		};
	});
};

recipient_input.addEventListener("keyup",check_recipient);


//choose recipient from list and add number and recipient values 

recipients_page_list.addEventListener("click", function(event) {
	recipient_input.value = event.target.querySelector(".name").textContent;
	number_input.value = event.target.querySelector(".number").textContent;
	recipients_page_list.innerHTML = "";
});

document.body.addEventListener("click", function(event) {
		recipients_page_list.innerHTML="";
	});

//choose recipient from book, add number and recipient values

let rec_book = document.querySelector("#rec_book>ul");
rec_book.addEventListener("click", function(event) {
	recipient_input.value = event.target.querySelector(".name").textContent;
	number_input.value = event.target.querySelector(".number").textContent;	
	
	const overlay = document.getElementsByClassName("reveal-overlay")[0];
	overlay.style.display= "none";
	document.body.style.overflow = "auto";
});

//add new recipient

const add_recipient = document.querySelector("#rec_book>button");
const new_recipient_form = document.querySelector("#rec_book form");
const cancel = document.querySelector("#rec_book>form button:last-of-type");
const add_recipient_name = document.getElementById("new_recipient_name");
const add_recipient_number = document.getElementById("new_recipient_account_number");
const add_recipient_submit = document.getElementById("new_recipient_button");

add_recipient.addEventListener("click", function(event) {
	new_recipient_form.style.display = "block";
	add_recipient.style.display = "none";
});

cancel.addEventListener("click", function(event){
	new_recipient_form.style.display = "none";
	add_recipient.style.display = "inline-block";
	add_recipient_name.value = "";
	add_recipient_number.value = "";
});


/************* date picker *************/

$("#date").datepicker();
$("#date").datepicker('setDate', new Date());

}); //end of document.ready
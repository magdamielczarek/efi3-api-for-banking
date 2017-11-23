$(document).ready(function() {

	const validate_type = {
		required: function(element){
			const validate_info = element.previousElementSibling;
			validate_info.innerHTML="";
			if(/^\s*$/.test(element.value)==true){
				validate_info.insertAdjacentHTML("afterbegin","<p>This field is required</p>");
				element.style.borderBottom = "3px solid red";
			} else {
				element.style.borderBottom = "1px solid #DADBDB";
			} 
		},
		account_pattern: function(element){
			const validate_info = element.previousElementSibling;
			if(element.value.search(/^[0-9]{26,26}$/)==-1){
				validate_info.insertAdjacentHTML("afterbegin","<p>Number must contain 26 digits</p>");
				element.style.borderBottom = "3px solid red";
			} else {
				element.style.borderBottom = "1px solid #DADBDB";
			} 
		},
		amount_pattern: function(element){
			const validate_info = element.previousElementSibling;
			if(element.value.search(/^\d{0,10}(\,\d{1,2})?$/)==-1||element.value==0){
				validate_info.insertAdjacentHTML("afterbegin","<p>Sum must contain only digits and comma</p>");
				element.style.borderBottom = "3px solid red";
			} else {
				element.style.borderBottom = "1px solid #DADBDB";
			} 
		},
		no_special_char: function(element){
			const validate_info = element.previousElementSibling;
			if(/[\-\[\]\/\\\{\}\(\)\*\+\?\.\^\$\|]/.test(element.value)==true){
				validate_info.insertAdjacentHTML("afterbegin","<p>This field should not contain any special characters or symbols</p>");
				element.style.borderBottom = "3px solid red";
			} else {
				element.style.borderBottom = "1px solid #DADBDB";
			} 
		},
		future_date_only: function(element){
			const validate_info = element.previousElementSibling;
			if(Date.parse(element.value)<=(Date.now()-1000*60*60*24)){
				validate_info.insertAdjacentHTML("afterbegin","<p>Date should not be older than current date</p>");
				element.style.borderBottom = "3px solid red";
			} else {
				element.style.borderBottom = "1px solid #DADBDB";
			} 
		},
		date_future_boundry: function(element){
			const validate_info = element.previousElementSibling;
			if(Date.parse(element.value)>(Date.now()+1000*60*60*24*365)){
				validate_info.insertAdjacentHTML("afterbegin","<p>Not later than one year after current date</p>");
				element.style.borderBottom = "3px solid red";
			} else {
				element.style.borderBottom = "1px solid #DADBDB";
			} 
		},
		max_length: function(element){
			const validate_info = element.previousElementSibling;
			if(element.value.length>40){
				validate_info.insertAdjacentHTML("afterbegin","<p>This field should not contain more than 40 characters</p>");
				element.style.borderBottom = "3px solid red";
			} else {
				element.style.borderBottom = "1px solid #DADBDB";
			}
		}
	};

// validation on blur for each input (with data validate rules)
const validated_inputs = document.querySelectorAll("form[data-validate] input[data-validate-rules]");

validated_inputs.forEach(function(element){element.insertAdjacentHTML('beforebegin','<div class="validation_info"></div>')});

for(let i=0;i<validated_inputs.length;i++){
	validated_inputs[i].addEventListener("blur", function(){
		const attributes = validated_inputs[i].getAttribute("data-validate-rules").split(",");
		for(let index=0;index<attributes.length;index++){
			if(typeof validate_type[attributes[index]]==="function"){
				validate_type[attributes[index]](validated_inputs[i]);
			};
		};
	});
};

// validation on submit

const forms = document.querySelectorAll("form[data-validate]");

forms.forEach(function(element){
	const inputs_to_final_validation = element.querySelectorAll("input[data-validate-rules]");
	const submit_button = element.querySelector("input[type=submit]");
	submit_button.addEventListener("click",function(event){
		event.preventDefault();
		for(let i=0;i<inputs_to_final_validation.length;i++){
			const attributes = inputs_to_final_validation[i].getAttribute("data-validate-rules").split(",");
			for(let index=0;index<attributes.length;index++){
				if(typeof validate_type[attributes[index]]==="function"){
				validate_type[attributes[index]](inputs_to_final_validation[i]);
				};
			};
		};
		let is_valid;
		document.querySelectorAll(".validation_info").forEach(function(element){
			if(element.textContent!=""){
				is_valid = false;
			};
		});
		if(is_valid == false){
			console.log("błędnie wypełniony formularz");
		} else {console.log("poprawnie wypełniony formularz");
		//miejsce na kod z funkcją wysyłającą formularz na serwer
		};
	});
});

});

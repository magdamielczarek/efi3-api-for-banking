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


/************* mobile menu *************/
const mobile_menu_button = document.getElementsByClassName("mobile_menu_button")[0];
const mobile_menu = document.querySelector(".mobile>ul");
mobile_menu_button.addEventListener("click",function(){
    if(mobile_menu.style.display === "none"){
        mobile_menu.style.display ="block";
        mobile_menu_button.style.transform = "rotate(90deg)";
    } else {
        mobile_menu.style.display ="none";
        mobile_menu_button.style.transform = "rotate(0deg)";
    }
});

/************* loading history *************/

const no_results = document.getElementsByClassName("no_results_info")[0]; //no-result information
let filtering_base = []; //array - filtering
const descriptions = []; //array - searching

const load_history_data = () => {
    $.get("https://efigence-camp.herokuapp.com/api/data/history", (data) => {
            const history_container = document.querySelector(".history_extended");
            const history_list = data.content;
            const history_item_template = (historyData) => {
            const operation_date = new Date(historyData.date); 
                return `
                    <li>
                        <div>
                            <time>${operation_date.getDate()+ "." + (operation_date.getMonth()+1)}</time>
                            <label>${historyData.description}</label>
                            <select>
                                <option>Cash</option>
                                <option>Food</option>
                                <option>Gas</option>
                                <option>Health</option>
                                <option>Fun</option>
                                <option>Education</option>
                            </select>
                            <span class="income_or_outcome">${historyData.amount} ${historyData.currency}</span>
                        </div>
                    </li>`;
            }


            history_list.forEach((element, index) => {
                const template = history_item_template(element);
                history_container.insertAdjacentHTML("beforeend", template);
                
                //array for future filtering
                filtering_base.push({
                    operation:element,
                    row:history_container.lastChild});

                //array for future searching
                descriptions.push(element.description);

                //change color if income, add minus if outcome
                const income_or_outcome = document.getElementsByClassName("income_or_outcome")[index];
                if(data.content[index].status==="outcome"){income_or_outcome.insertAdjacentHTML("afterbegin", "<span>-</span>");
                } else {income_or_outcome.style.color="#139f37";};

                //set outcome or income category as selected
                const list_item=document.querySelectorAll(".history_extended li");
                for(index=0;index<list_item.length;index++){
                    for(i=0;i<list_item[index].querySelectorAll("option").length;i++){
                        if(list_item[index].querySelectorAll("option")[i].innerText===data.content[index].category)
                            {list_item[index].querySelectorAll("option")[i].setAttribute("selected","selected");
                            break;};
                    }
                };
            });        
    });
};

load_history_data();


// reset results and no-results situation

const reset_results = function(){
    document.querySelectorAll(".history_extended>li").forEach(function(element){element.style.display="none"});
};

const default_results = function(){
    document.querySelectorAll(".history_extended>li").forEach(function(element){element.style.display="block"});
    no_results.style.display="none";
};

const show_no_results = function(){
    let visible_results = [];
    document.querySelectorAll('.history_extended li[style="display: block;"]').forEach(function(element){
        if(element.style.display="block"){
            visible_results.push(element);
        };
    });
    if(visible_results.length>0){
        no_results.style.display="none";
    } else {no_results.style.display="block";};
};


// searching

const history_searching_input = document.getElementById("search_history");
const history_searching = function(){
    reset_results();
    for(let i=0;i<descriptions.length;i++){
        if(descriptions[i].indexOf(history_searching_input.value)>=0){
            filtering_base[i].row.style.display = "block";
        } else {
            filtering_base[i].row.style.display = "none";
        };
    };
    show_no_results();
};

history_searching_input.addEventListener("keyup",history_searching);

// filtering by date

$(function() {
        const dateFormat = "mm/dd/yy",
            from = $("#from")
                .datepicker({
                    defaultDate: "+1w",
                    changeMonth: true,
                    numberOfMonths: 1
                })
                .on("change", function() {
                    to.datepicker( "option", "minDate", getDate( this ) );
                }),
            to = $("#to").datepicker({
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 1
            })
            .on("change", function() {
                from.datepicker( "option", "maxDate", getDate( this ) );
            });

        function getDate(element) {
            let date;
            try {
                date = $.datepicker.parseDate( dateFormat, element.value );
            } catch( error ) {
                date = null;
            }

            return date;
        }
    } );


const week_button = document.querySelectorAll(".date_expanded_options button")[0];
const month_button = document.querySelectorAll(".date_expanded_options button")[1];
const year_button = document.querySelectorAll(".date_expanded_options button")[2];
const from_date_input = document.getElementById("from");
const to_date_input = document.getElementById("to");
const filter_by_date_button = document.querySelectorAll(".date_expanded_options button")[3];

const filter_by_date = function(){
    reset_results();
    filtering_base.forEach(function(element){
        if(to_date_input.value===""){
            if(Date.parse(element.operation.date)>=Date.parse(from_date_input.value)&&Date.parse(element.operation.date)<=Date.now()){
               element.row.style.display="block"; 
            }
        } else if(from_date_input.value===""){
            if(Date.parse(element.operation.date)>=0&&Date.parse(element.operation.date)<=Date.now()){
               element.row.style.display="block"; 
            }
        } else {
            if(Date.parse(element.operation.date)>=Date.parse(from_date_input.value)&&Date.parse(element.operation.date)<=Date.parse(to_date_input.value)){
                element.row.style.display="block";
            };
        }
    });
    show_no_results();
};

const filter_by_last_week = function(){
    reset_results();
    filtering_base.forEach(function(element){
        if(Date.parse(element.operation.date)>=(Date.now()-1000*60*60*24*7)){
            element.row.style.display="block";
        };
    });
    show_no_results();
};

const filter_by_last_month = function(){
    reset_results();
    filtering_base.forEach(function(element){
        if(Date.parse(element.operation.date)>=(Date.now()-1000*60*60*24*30)){
            element.row.style.display="block";
        };
    });
    show_no_results();
};

const filter_by_last_year = function(){
    reset_results();
    filtering_base.forEach(function(element){
        if(Date.parse(element.operation.date)>=(Date.now()-1000*60*60*24*365)){
            element.row.style.display="block";
        };
    });
    show_no_results();
};

filter_by_date_button.addEventListener("click",filter_by_date);
week_button.addEventListener("click",filter_by_last_week);
month_button.addEventListener("click",filter_by_last_month);
year_button.addEventListener("click",filter_by_last_year);

// filtering by category
const cash_category = document.getElementById("cash_category");
const food_category = document.getElementById("food_category");
const gas_category = document.getElementById("gas_category");
const education_category = document.getElementById("education_category");
const fun_category = document.getElementById("fun_category");
const expences_categories = document.querySelectorAll(".checkbox_patch");

const filter_by_category = function(){
    reset_results();
    filtering_base.forEach(function(element){
        if(element.operation.category==="Cash"&&cash_category.getAttribute("checked")){
                element.row.style.display="block";
        } else if (element.operation.category==="Food"&&food_category.getAttribute("checked")){
                element.row.style.display="block";
        } else if (element.operation.category==="Gas"&&gas_category.getAttribute("checked")){
                element.row.style.display="block";            
        } else if (element.operation.category==="Education"&&education_category.getAttribute("checked")){
                element.row.style.display="block";
        } else if (element.operation.category==="Fun"&&fun_category.getAttribute("checked")){
                element.row.style.display="block";
        };
    });
    show_no_results();
};

expences_categories.forEach(function(element){
    element.addEventListener("click", function(event){
        if(element.firstElementChild.getAttribute("checked")){
            element.firstElementChild.removeAttribute("checked","checked");
            element.style.backgroundColor="#aeaeae";
        } else {
            element.firstElementChild.setAttribute("checked","checked");
            element.style.backgroundColor="#0BBED3";
        };
        filter_by_category();
    });
});


// filtering by amount

const min_amount = document.getElementById("min");
const max_amount = document.getElementById("max");
const incomes_button = document.getElementsByClassName("incomes_button")[0];
const outcomes_button = document.getElementsByClassName("outcomes_button")[0];
const filter_amount_range_button = document.querySelector(".amount_expanded_options .filter_button");

const filter_by_incomes = function(){
    reset_results();
    filtering_base.forEach(function(element){
        if(element.operation.status==="income"){
            element.row.style.display="block";
        };
    });
    show_no_results();
};

const filter_by_outcomes = function(){
    reset_results();
    filtering_base.forEach(function(element){
        if(element.operation.status==="outcome"){
            element.row.style.display="block";
        };
    });
    show_no_results();
};

const filter_by_amount_range = function(){
    reset_results();
    filtering_base.forEach(function(element){
        if(max_amount.value===""){
            if(element.operation.amount>=min_amount.value){
                element.row.style.display="block";
            };
        };
        if(element.operation.amount>=min_amount.value&&element.operation.amount<=max_amount.value){
            element.row.style.display="block";
        };
        if(min_amount===""&&max_amount===""){
            filtering_base.forEach(function(element){
                element.style.display="block";
            });
        };
    });
    show_no_results();
};

incomes_button.addEventListener("click", filter_by_incomes);
outcomes_button.addEventListener("click", filter_by_outcomes);
filter_amount_range_button.addEventListener("click", filter_by_amount_range);


// selecting filters from list

const date_panel= document.getElementsByClassName("date_expanded_options")[0];
const category_panel= document.getElementsByClassName("category_expanded_options")[0];
const amount_panel= document.getElementsByClassName("amount_expanded_options")[0];
const filters = document.querySelector(".filters select");

filters.addEventListener("change", function(element){
    switch (filters.value) {
        case "NONE":
            date_panel.style.display= "none";
            category_panel.style.display= "none";
            amount_panel.style.display= "none";
            default_results();
            break;
        case "DATE":
            date_panel.style.display= "block";
            category_panel.style.display= "none";
            amount_panel.style.display= "none";
            default_results();
            break;
        case "CATEGORY":
            date_panel.style.display= "none";
            category_panel.style.display= "block";
            amount_panel.style.display= "none";
            default_results();
            break;
        case "AMOUNT":
            date_panel.style.display= "none";
            category_panel.style.display= "none";
            amount_panel.style.display= "block";
            default_results();
            break;
    }
});

}); //end of document.ready function
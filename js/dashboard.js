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

/************* loading summary *************/

const load_summary = () => {
    $.get("https://efigence-camp.herokuapp.com/api/data/summary", (data) => {
        const balance_new = document.querySelector(".balance");
        const funds_new = document.querySelector(".funds");
        const payments_new = document.querySelector(".payments");
        const summary_data = data.content[0];
        balance_new.textContent = summary_data.balance + " PLN";
        funds_new.textContent = summary_data.funds + " PLN";
        payments_new.textContent = summary_data.payments + " PLN";
        payments_new.insertAdjacentHTML("beforeend", "<button>FAST PAY</button>");
    });
}

load_summary();


/************* loading products *************/

const load_product_data = (endpoint,containerClassName) => {
 $.get("https://efigence-camp.herokuapp.com/api/data/products", (data) => {

            const product_container = document.querySelector(".products");
            const productsList = data.content;
            const productTemplate = (productData) => {

                let icon = '';

                switch(productData.type) {
                    case "Wallet":
                        icon = "flaticon-wallet-filled-money-tool";
                        break;
                    case "Deposits":
                        icon = "flaticon-piggy-bank-and-a-dollar-coin";
                        break;
                    case "Accounts":
                        icon = "flaticon-money";
                        break;
                    case "Funds":
                        icon = "flaticon-graphic";
                        break; 
                    default:
                        icon = "flaticon-right-direction-filled-hand-gesture";
                    }

                return `
                    <li>
                        <a>
                        <span class="${icon}"></span>
                        <span>${productData.type}<span/>
                        <span>${productData.amount} ${productData.currency}</span>
                        </a>
                    </li>`; 
            }
            

            productsList.forEach((element, index) => {
            const template = productTemplate(element);
            product_container.insertAdjacentHTML("beforeend", template);
            });
    });
}

load_product_data();



/************* loading history *************/

const load_history_data = (endpoint,containerClassName) => {
    $.get("https://efigence-camp.herokuapp.com/api/data/history", (data) => {
            
        const history_container = document.querySelector(".history_dashboard");
        const history_list = data.content;

        //making template for history item
        const history_item_template = (historyData) => {
        const operation_date = new Date(historyData.date);          
        return `
            <li>
                <time>${operation_date.getDate() + "." + 0 + (operation_date.getMonth()+1)}</time>
                <form>
                    <label>${historyData.description}
                        <select>
                            <option>Cash</option>
                            <option>Food</option>
                            <option>Gas</option>
                            <option>Health</option>
                            <option>Fun</option>
                            <option>Education</option>
                        </select>
                    </label>
                </form>
                <span class="income_or_outcome_amount">${historyData.amount} ${historyData.currency}</span>
            </li>`;
        } //end of history item template

        //adding history items with template and data
        history_list.forEach((element, index) => {
            const template = history_item_template(element);
            history_container.insertAdjacentHTML("beforeend", template);
            
            //change color for item if income and add minus before amount if outcome
            const income_or_outcome_amount = document.getElementsByClassName("income_or_outcome_amount")[index];
            if(data.content[index].status==="outcome"){income_or_outcome_amount.insertAdjacentHTML("afterbegin", "<span>-</span>");
                } else {income_or_outcome_amount.style.color="#139f37";
            };

            //
            let list_item = document.querySelectorAll(".history_dashboard li")[index];
            let options = list_item.querySelectorAll('option');
            for(let i=0;i<options.length;i++){
                if(options[i].value===data.content[index].category){
                    options[i].setAttribute("selected","selected");
                    return;
                };
            }
        }); //end of making history list
    }); //end of ajax request
} //end of function declaration

load_history_data();


/************* showing analyses *************/

//switch for analyses
const checkbox = document.getElementById("checkbox_input");
const analysis_panel = document.querySelector(".analysis_container");
const switch_button = document.querySelector(".checkbox_options"); 
const switch_after = switch_button.nextSibling;
const analysis_container = document.querySelector(".analysis_container");
const default_chart_wrapper= document.querySelector(".default_chart_wrapper");

switch_button.addEventListener("click", function(event){
    if(checkbox.value === "0") {
        event.preventDefault();
        switch_button.className="checkbox_options_on";
        checkbox.value = "1";
        main_chart_wrapper.style.display = "none";
        analysis_container.style.display = "block";
    } else {
        event.preventDefault();
        switch_button.className = "checkbox_options";
        checkbox.value = "0";
        main_chart_wrapper.style.display = "block";
        analysis_container.style.display = "none";
    }
});


//charts - default chart

const colours = ["#0088d5","#00a8e2","#e21a61","#fdb400","#fec500","#80c801","#409d00","#207b00"];
let balance = 8000;
let default_chart_objects = [];


const default_chart=()=>{
    $.get("https://efigence-camp.herokuapp.com/api/data/chart", (data) => {
        //preparing data
        for(i = 0;i<data.content.length;i++){
            if(data.content[i].status === "outcome"){
                balance -= data.content[i].amount;
            }
            else {
                balance += data.content[i].amount;
            };
            let temporary_object = {
                date: data.content[i].date,
                amount: balance,
                colour: colours[Math.floor(Math.random()*(colours.length-1))],
            };
            default_chart_objects.push(temporary_object);
        };

        //drawing
        const main_chart_wrapper = document.getElementById('main_chart_wrapper');
        AmCharts.makeChart("main_chart_wrapper", {
            "type": "serial",
            //"theme": "light",
            "dataProvider": default_chart_objects,
            "categoryField": "date",
            "fontFamily": "Roboto Condensed",
            "fontSize": 18,
            "valueAxes":
            [{
                "baseValue": 0,
                "axisAlpha": 0,
            }],
            "graphs": 
            [{
                "valueField": "amount",
                //"type": "smoothedLine",
                "lineColorField": "colour",
                "fillColorsField": "colour",
                "fillAlphas": 1,
                "bullet": "none",
                "balloonText": "[[title]] of [[category]]:[[value]]",
                "noStepRisers": true
            }],
            "chartCursor": {
            "categoryBalloonDateFormat": "YYYY MMM DD",
            "cursorAlpha": 0,
            "fullWidth": true
            },
            "dataDateFormat": "YYYY-MM-DD",
            "categoryField": "date",
            "categoryAxis": {
                "startOnAxis": true,
                "dateFormats": [{
                    "period": "DD",
                    "format": "DD"}, 
                    {
                    "period": "WW",
                    "format": "MMM DD"}, 
                    {
                    "period": "MM",
                    "format": "MMM"},
                    {
                    "period": "YYYY",
                    "format": "YYYY"
                }],
                "parseDates": true,
                "gridAlpha": 0,
                "gridCount": 50
            },
            "export": {
                "enabled": true
            },
            "startEffect": "easeOutSine",
            "startDuration": 1,
            "responsive": {
                "enabled": true
            }
        });

    }) //end of ajax request
}; //end of function declaration

default_chart();


//income chart

let income = [];
let income_summary = 0;

const incomes_chart=()=>{
    $.get("https://efigence-camp.herokuapp.com/api/data/chart", (data) => {
        //preparing data
        for(i=0;i<data.content.length;i++){
            if(data.content[i].status=="income"){
                let temporary_object = {
                description: data.content[i].description,
                amount: data.content[i].amount,
                };
                income.push(temporary_object);
                income_summary+=data.content[i].amount;
            }
        };

        //drawing
        const income_chart_wrapper = document.getElementById('income_chart_wrapper');

        AmCharts.makeChart("income_chart_wrapper", {
            "type": "pie",
            "startDuration": 0,
            "addClassNames": true,
            "innerRadius": "50%",
            "radius": "37%",
            "dataProvider": income,
            "valueField": "amount",
            "titleField": "description",
            "labelRadius": 30,
            "colors": colours,
            //"pullOutRadius": "5%",
            "fontFamily": "Roboto Condensed",
            "fontSize": 16,
            "allLabels": [{
                "fontSize": 20,
                "text": "Income summary",
                "align": "center",
                "bold": false,
                "y": 260
                }, {
                "text": income_summary + " PLN",
                "align": "center",
                "bold": true,
                "y": 280
            }],
            "startEffect": "easeInSine",
            "startDuration": 1,
            "export": {
                "enabled": true
            },
            "responsive": {
                "enabled": true
            }
        });
    }) //end of ajax request
}; //end of function declaration

incomes_chart();



//expences chart

let expences_objects = [];
let expences_cinema = 0;
let expences_car = 0;
let expences_food = 0; 
let expences_home = 0; 
let expences_studies = 0;
let summary_expences = 0;


const expences_chart = (months_number) => {
    $.get("https://efigence-camp.herokuapp.com/api/data/budget", (data)=> {
        for(let i = 0; i<months_number; i++){
            for(let index = 0; index < data.content.months[i].elements.length; index++){
                let temporary_object = data.content.months[i].elements[index];
                expences_objects.push(temporary_object);
            };
            for(let index = 0; index<expences_objects.length; index++){
                expences_cinema += expences_objects[index].cinema.amount;
                expences_car += expences_objects[index].car.amount;
                expences_food += expences_objects[index].food.amount;
                expences_home += expences_objects[index].home.amount;
                expences_studies += expences_objects[index].studies.amount;

                summary_expences += expences_cinema + expences_car + expences_food + expences_home + expences_studies;
            };
        };

        let expences_data = [{"category":"cinema","amount":expences_cinema},{"category":"food","amount":expences_food},{"category":"home","amount":expences_home},{"category":"car","amount":expences_car},{"category":"studies","amount":expences_studies}];

        //drawing
        const expences_chart_wrapper = document.getElementById('expences_chart_wrapper');

        AmCharts.makeChart("expences_chart_wrapper", {
            "type": "pie",
            "startDuration": 0,
            "addClassNames": true,
            "innerRadius": "50%",
            "radius": "37%",
            "dataProvider": expences_data,
            "valueField": "amount",
            "titleField": "category",
            "labelRadius": 30,
            "colors": colours,
            //"pullOutRadius": "5%",
            "fontFamily": "Roboto Condensed",
            "fontSize": 16,
            "allLabels": [{
                "fontSize": 20,
                "text": "Expences summary",
                "align": "center",
                "bold": false,
                "y": 260
                }, {
                "text": summary_expences + " PLN",
                "align": "center",
                "bold": true,
                "y": 280
            }],
            "startEffect": "easeInSine",
            "startDuration": 1,
            "export": {
                "enabled": true
            },
            "responsive": {
                "enabled": true
            }
        });
    }) //end of ajax request
}; //end of function declaration

expences_chart(3); //loading last 3 months by default


}); //end of document.ready


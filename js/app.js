$(document).foundation();
$.ajaxSetup({
async: false
});

/*tooltip*/

const messages= document.getElementsByClassName("flaticon-note")[0];
const messages_tooltip= document.getElementsByClassName("tooltip_message")[0];

messages.addEventListener("mouseover", function(event) {messages_tooltip.style.display="block";});
messages.addEventListener("mouseleave", function(event) {messages_tooltip.style.display="none";});
messages_tooltip.addEventListener("mouseover", function(event) {messages_tooltip.style.display="block";});
messages_tooltip.addEventListener("mouseleave", function(event) {messages_tooltip.style.display="none";});



/* loading summary */

const load_summary = () => {
    $.get("https://efigence-camp.herokuapp.com/api/data/summary", (data) => {
        const balance_new = document.querySelector(".balance");
        const funds_new = document.querySelector(".funds");
        const payments_new = document.querySelector(".payments");
        const summary_data = data.content[0];
        balance_new.textContent = summary_data.balance+" PLN";
        funds_new.textContent = summary_data.funds+" PLN";
        payments_new.textContent = summary_data.payments+" PLN";
        payments_new.insertAdjacentHTML("beforeend", "<button>FAST PAY</button>");
    });
}
load_summary();

/*products api*/

const load_product_data = (endpoint,containerClassName) => {
 $.get("https://efigence-camp.herokuapp.com/api/data/products", (data) => {
            
            const product_container = document.getElementsByClassName("products")[0];
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
                        break; }
                    //default:
                      //  icon = "icon-default";

                return `
                    <li>
                        <a>
                        <span class="${icon}"></span>
                        <span>${productData.type}<span/></br>
                        <span>${productData.amount}</span>
                        <span>${productData.currency}</span></p>
                        </a>
                    </li>`; 
            }
            

            productsList.forEach((element, index) => {
                //console.log(`Iteracja ${index}:`,element);
            
            const template = productTemplate(element);
                

            product_container.insertAdjacentHTML("beforeend", template);
            });
    });
}
load_product_data();



/* loading history */

const load_history_data = (endpoint,containerClassName) => {
 $.get("https://efigence-camp.herokuapp.com/api/data/history", (data) => {
            
            const history_container = document.querySelector(".history");
            const history_list = data.content;
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
            }

            history_list.forEach((element, index) => {
            const template = history_item_template(element);
            history_container.insertAdjacentHTML("beforeend", template);
            
            //change color if income, add minus if outcome
            const income_or_outcome_amount = document.getElementsByClassName("income_or_outcome_amount")[index];
            if(data.content[index].status==="outcome"){income_or_outcome_amount.insertAdjacentHTML("afterbegin", "<span>-</span>");
            } else {income_or_outcome_amount.style.color="#139f37";};
            
            //set outcome or income category as selected
            const list_item=document.querySelectorAll(".history li");
            for(index=0;index<list_item.length;index++){
                for(i=0;i<list_item[index].querySelectorAll("option").length;i++){
                    if(list_item[index].querySelectorAll("option")[i].innerText===data.content[index].category)
                        {list_item[index].querySelectorAll("option")[i].setAttribute("selected","selected"); break;};
                }
            }
            
            });
    });
}

load_history_data();


/*analysis section - hide or show*/

const checkbox= document.getElementById("checkbox_input");
const analysis_panel= document.getElementsByClassName("analysis_container");
const switch_button= document.getElementsByClassName("checkbox_options")[0]; 
const switch_after= document.getElementsByClassName("checkbox_options")[0].nextSibling;
const analysis_container= document.getElementsByClassName("analysis_container")[0];
const default_chart_wrapper= document.getElementsByClassName("default_chart_wrapper")[0];
switch_button.addEventListener("click",function(event){
    if(checkbox.value==="0") {
        event.preventDefault();
        switch_button.className="checkbox_options_on";
        checkbox.value="1";
        default_chart_wrapper.style.display="none";
        analysis_container.style.display="block";

    } else {
        event.preventDefault();
        switch_button.className="checkbox_options";
        checkbox.value="0";
        default_chart_wrapper.style.display="block";
        analysis_container.style.display="none";
    }
});


// C H A R T S //

/* default chart */

//a) get data



const colours = ["#0088d5","#00a8e2","#e21a61","#fdb400","#fec500","#80c801","#409d00","#207b00"];
let balance = 8000;
let time_axis = [];
let default_chart_objects = [];


const default_chart_data=()=>{
    $.get("https://efigence-camp.herokuapp.com/api/data/chart", (data)=> {
        for(i=0;i<data.content.length;i++){
            time_axis.push(data.content[i].date);
            //console.log(data.content[i].date);
            if(data.content[i].status==="outcome"){
                balance-=data.content[i].amount;
            }
            else {
                balance+=data.content[i].amount;
            };
            let temporary_object={
                labels: data.content[i].date,
                fill: true,
                showLine: true,
                borderWidth:1,
                backgroundColor: colours[Math.floor(Math.random()*(colours.length-1))],
                data: [{x: data.content[i].date,
                    y: balance}],
            };
            default_chart_objects.push(temporary_object);
        };
    })};
    default_chart_data();


//b) drawing chart

const default_chart_ctx = document.getElementById("default_chart").getContext('2d');
let default_chart = new Chart(default_chart_ctx, {
    type: 'line',
    data: { 
        labels: time_axis,       
      datasets: default_chart_objects
    },
    options: {
        showLine: true,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: true
        },
        scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                stepSize : 2500,
            },
        }],
        xAxes: [{
            padding: 0,
            //maxTicksLimit: 11,
            type: 'time',
            unit: 'day',
            unitStepSize: 1,
            time: {
                displayFormats: {
                'millisecond': 'DD',
                'second': 'DD',
                'minute': 'DD',
                'hour': 'DD',
                'day': 'DD',
                'week': 'DD',
                'month': 'DD',
                'quarter': 'DD',
                'year': 'DD',
                }
            },
        }]
        }
    }
});



/* income chart*/

//loading income data
let income = [];
let income_labels = [];
let income_summary = 0;

const income_chart_data=()=>{
    $.get("https://efigence-camp.herokuapp.com/api/data/chart", (data)=> {
        //let last_month = data.content.months[data.content.months.length-1].elements[0];
        for(i=0;i<data.content.length;i++){
            if(data.content[i].status=="income"){
                income.push(data.content[i].amount);
                income_labels.push(data.content[i].description);
                income_summary+=data.content[i].amount;

            }
        }
        //console.log(data.content);
        //console.log(income);
    })
};
income_chart_data();

//drawing income chart 

Chart.pluginService.register({
        beforeDraw: function (chart) {
            if (chart.config.options.elements.center) {
        //Get ctx from string
        var ctx = chart.chart.ctx;
        
                //Get options from the center object in options
        var centerConfig = chart.config.options.elements.center;
        var fontStyle = centerConfig.fontStyle || 'Arial';
                var txt = centerConfig.text;
        var color = centerConfig.color || '#000';
        var sidePadding = centerConfig.sidePadding || 20;
        var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
        //Start with a base font of 30px
        ctx.font = "30px " + fontStyle;
        
                //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        var stringWidth = ctx.measureText(txt).width;
        var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

        // Find out how much the font can grow in width.
        var widthRatio = elementWidth / stringWidth;
        var newFontSize = Math.floor(30 * widthRatio);
        var elementHeight = (chart.innerRadius * 2);

        // Pick a new font size so it will not be larger than the height of label.
        var fontSizeToUse = Math.min(newFontSize, elementHeight);

                //Set font settings to draw it correctly.
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
        ctx.font = /*fontSizeToUse*/30+"px " + fontStyle;
        ctx.fillStyle = color;
        
        //Draw text in center
        ctx.fillText(txt, centerX, centerY);
            }
        }
    });


        var config_income = {
            type: 'doughnut',
            data: {
                labels: income_labels,
                datasets: [{
                    data: income,
                    borderColor: 'transparent',
                    backgroundColor:
                    ['#409d00','#00a8e2','#207b00','#fec500','#fc8b00','#13bdd2','#018cad',"#e21a61"],
                    hoverBackgroundColor:
                    ['#409d00','#00a8e2','#207b00','#fec500','#fc8b00','#13bdd2','#018cad',"#e21a61"],
                }]
            },
        options: {
            elements: {
                center: {
                text: ['Summary ' + income_summary],
                color: '#000000',
                fontStyle: ['Roboto Condensed', 'sans-serif'], 
                sidePadding: 20 
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true,
                labels: {
                fontColor: 'rgb(0, 0, 0)'
                }
            },
        }
    };

        var income_chart_context = document.getElementById('income_canvas').getContext('2d');
        var income_chart = new Chart(income_chart_context, config_income);



/* expences chart*/

var monthly_expences = [];
var monthly_summary_expences = [];

//loading expences data (last month)
const expences_chart_data=()=>{
    $.get("https://efigence-camp.herokuapp.com/api/data/budget", (data)=> {
        let last_month = data.content.months[data.content.months.length-1].elements[0];
        monthly_expences.push(last_month.car.amount,last_month.cinema.amount,last_month.food.amount,last_month.home.amount,last_month.studies.amount);
        monthly_summary_expences.push(data.content.months[data.content.months.length-1].summary.total);
    })
};
expences_chart_data();

//drawing expences chart

    Chart.pluginService.register({
        beforeDraw: function (chart) {
            if (chart.config.options.elements.center) {
        //Get ctx from string
        var ctx = chart.chart.ctx;
        
                //Get options from the center object in options
        var centerConfig = chart.config.options.elements.center;
        var fontStyle = centerConfig.fontStyle || 'Arial';
                var txt = centerConfig.text;
        var color = centerConfig.color || '#000';
        var sidePadding = centerConfig.sidePadding || 20;
        var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
        //Start with a base font of 30px
        ctx.font = "30px " + fontStyle;
        
                //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        var stringWidth = ctx.measureText(txt).width;
        var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

        // Find out how much the font can grow in width.
        var widthRatio = elementWidth / stringWidth;
        var newFontSize = Math.floor(30 * widthRatio);
        var elementHeight = (chart.innerRadius * 2);

        // Pick a new font size so it will not be larger than the height of label.
        var fontSizeToUse = Math.min(newFontSize, elementHeight);

                //Set font settings to draw it correctly.
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
        ctx.font = /*fontSizeToUse*/30+"px " + fontStyle;
        ctx.fillStyle = color;
        
        //Draw text in center
        ctx.fillText(txt, centerX, centerY);
            }
        }
    });


        var config = {
            type: 'doughnut',
            data: {
                labels: ["car","cinema","food","home","studies"],
                datasets: [{
                    data: monthly_expences,
                    borderColor: 'transparent',
                    backgroundColor:
                    ['#fec500','#fc8b00','#13bdd2','#018cad','#409d00'],
                    hoverBackgroundColor:
                    ['#fec500','#fc8b00','#13bdd2','#018cad','#409d00']
                }]
            },
        options: {
            elements: {
                center: {
                text: ['Summary ' + monthly_summary_expences],
                color: '#000000',
                fontStyle: ['Roboto Condensed', 'sans-serif'], 
                sidePadding: 20 
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
                labels: {
                fontColor: 'rgb(0, 0, 0)'
                }
            },
        }
    };

        const expences_chart_context = document.getElementById('expences_canvas').getContext('2d');
        var expences_chart = new Chart(expences_chart_context, config);




/* balance chart*/


var balance_ctx = document.getElementById('balance_canvas').getContext('2d');
var balance_chart = new Chart(balance_ctx, {
    type: 'doughnut',
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    },
    options: {}
}); 


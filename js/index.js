
const go_login = document.querySelector('.go_login');
const go_dashboard = document.querySelector('.go_dashboard');
const go_history = document.querySelector('.go_history');
const go_transfer = document.querySelector('.go_transfer');

const login_page = document.querySelector('.login_page');
const dashboard_page = document.querySelector('.dashboard_page');
const history_page = document.querySelector('.history_page');
const transfer_page = document.querySelector('.transfer_page');

go_login.addEventListener("mouseover",function(event){
	login_page.style.display = "block";
	login_page.style.animation = "show_screens 1s forwards";
});
go_login.addEventListener("mouseleave",function(event){
	login_page.style.display = "none";
	login_page.style.animation = "hide_screens 1s forwards";
});

go_dashboard.addEventListener("mouseover",function(event){
	dashboard_page.style.display = "block";
	dashboard_page.style.animation = "show_screens 1s forwards";
});
go_dashboard.addEventListener("mouseleave",function(event){
	dashboard_page.style.display = "none";
	dashboard_page.style.animation = "hide_screens 1s forwards";
});

go_history.addEventListener("mouseover",function(event){
	history_page.style.display = "block";
	history_page.style.animation = "show_screens 1s forwards";
});
go_history.addEventListener("mouseleave",function(event){
	history_page.style.display = "none";
	history_page.style.animation = "hide_screens 1s forwards";
});

go_transfer.addEventListener("mouseover",function(event){
	transfer_page.style.display = "block";
	transfer_page.style.animation = "show_screens 1s forwards";
});
go_transfer.addEventListener("mouseleave",function(event){
	transfer_page.style.display = "none";
	transfer_page.style.animation = "hide_screens 1s forwards";
});
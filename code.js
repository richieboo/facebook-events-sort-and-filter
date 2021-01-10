setInterval(processReactEventList, 1500);	

const myBody = document.querySelector('body');
myBody.addEventListener('dblclick', function (e) {
  SortEvents();
});

var finishedPage = false;

function processReactEventList(){
	if(!finishedPage){
		addDatesAsEventName();
		hideFacebookEvents();
		hidePastEvents();
		hideAdvertisements()
		if(hideEndOfResultsLabel()){
			SortEvents();
			window.scrollTo(0,0);
			document.querySelector("div[aria-label='Search Results']").style.backgroundColor='rgba(87,130,73,.43)';
			finishedPage=true;
		}
		else{
			window.scrollTo(0,document.body.scrollHeight);
		}
	}
}

function hideEndOfResultsLabel(){
	retval=false;
	const divs = document.querySelectorAll("#EventList > div");
	[...divs].forEach(d => {
		var x = d.querySelectorAll("span");
		x.forEach(y =>{
			if(y.innerText=="End of Results"){
				d.remove();
				retval=true;
				SortEvents();
			}
		});
	});	
	return retval;
}

function hideAdvertisements(){
	
	const divs = document.querySelectorAll("#EventList > div");
	[...divs].forEach(d => {
		var label = d.getAttribute("data-name");
		if(!label){
			d.style.height="0px";
			d.style.overflow="hidden";
		}
	});	
	
}

function hidePastEvents(){
	const divs = document.querySelectorAll("div[role*='article']");
	[...divs].forEach(d => {
		var title=d.querySelector('h2>span');
		if(title){
			if(title.classList.contains('erlsw9ld')){ // FBs class for disabled/past event.
				d.remove();
			}
		}
	});	
}

function addDatesAsEventName(){
	
	if(!document.getElementById("EventList")){
		const parentDiv = document.querySelector("div[role='feed'] > div");
		parentDiv.setAttribute("id", "EventList");
	}
	
	const divs = document.querySelectorAll("div[role*='article']");
	
	[...divs].forEach(d => {
		
		var divDates = d.getElementsByTagName("div");
		[...divDates].forEach(dd => {
			var s = dd.innerText;
			
			if(s.substring(3,4)=="," && ('SUN,MON,TUE,WED,THU,FRI,SAT').indexOf(s.substring(0,3))>-1 ){
				var dayOfWk = s.substring(0,3);
				var monthDay = s.substring(5,11).replace(",","").trim();
				var mnth = monthDay.substring(0,3);
				var mnthNo = getMonthNo(mnth);
				var dy = parseInt(monthDay.substring(4,6).trim());
				var dtNow = new Date();
				var yr = dtNow.getFullYear();
				var evtDate = new Date(yr,mnthNo,dy);
				if(evtDate<dtNow){
					evtDate.setFullYear(evtDate.getFullYear()+1);
				}
				var links = d.getElementsByTagName("a");
				var linkLabel = '';
				[...links].forEach(link => {
					var label = link.getAttribute('aria-label');
					if(label){
						linkLabel += label;
					}
				});
				var dataName = formatDate(evtDate)+'-'+linkLabel;
				d.parentElement.setAttribute('data-name',dataName);
			}
		});
	});
}

function hideFacebookEvents(){
	
	var codes = [];
	//codes.push("ads"); //this hides advertisements.
	
	//enter codes of events I don't want to see.
	codes.push("430009901343679");
	codes.push("675831546460193");
	codes.push("649863482202738");
	codes.push("1354392701575515");
	
	var blocks = [];
	blocks.push("Night at the Movies");
	blocks.push("Watch and React");
	blocks.push("TWITCH TONY");
	blocks.push("REACT PP GUA");
	blocks.push("SSI react Right");
	blocks.push("AAHAM");
	blocks.push("Urodzinowy koncert");
	blocks.push("FCA REACT");
	blocks.push("BRACU IEEE");
	blocks.push("Seedorf");
	blocks.push("🄺🄰🄽🄶");
	blocks.push("Reacting to Lincoln's Assassination");
	blocks.push("Diving at the rocks GmbH");
	blocks.push("Mulberry Divers")
	
	if(!document.getElementById("EventList")){
		const parentDiv = document.querySelector("div[role='feed'] > div");
		parentDiv.setAttribute("id", "EventList");
	}
	
	const divs = document.querySelectorAll("div[role*='article']");
	
	[...divs].forEach(d => {
		var divAboveArticle = d.parentNode;
		var links = d.getElementsByTagName("a");
		if(links){
			[...links].forEach(link => {
				if(link){
					codes.forEach(c=>{
						if(link.href.indexOf(c)>-1){
							divAboveArticle.remove();
						}
					});
					
				}
			});
			blocks.forEach(block => {
				var spanTitles = d.getElementsByTagName("span");
				[...spanTitles].forEach(spanTitle => {
					if(spanTitle){
						spanTitleText=spanTitle.innerText;
						if(spanTitleText.indexOf(block)>-1){
							divAboveArticle.remove();		
						}
					}
				});
			});
		}
		
		
		
	});
	
	//clean up empty divs
	var divEvents = document.querySelectorAll("#EventList > div");
	divEvents.forEach(e => {
		if(e.children.length===0){
			e.remove();
		}
	});
}


function SortEvents(){
	const eventList = document.querySelector('#EventList');
	const reactEvents = [...eventList.children];
	reactEvents.sort((a, b) => a.getAttribute('data-name') > b.getAttribute('data-name') ? 1 : -1);
	reactEvents.forEach(div => eventList.appendChild(div));
	var ids = [];
	reactEvents.forEach(myevt => {
		ids.push(myevt.getAttribute('data-name'));
	});
}



function getMonthNo(s){
	switch(s){
		case 'JAN':m=1;break;
		case 'FEB':m=2;break;
		case 'MAR':m=3;break;
		case 'APR':m=4;break;
		case 'MAY':m=5;break;
		case 'JUN':m=6;break;
		case 'JUL':m=7;break;
		case 'AUG':m=8;break;
		case 'SEP':m=9;break;
		case 'OCT':m=10;break;
		case 'NOV':m=11;break;
		case 'DEC':m=12;break;
	}
	return m;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return year.toString()+month.toString()+day.toString();
}

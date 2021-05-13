import Vue from 'vue'
// import dayjs from 'dayjs';
// import currency from 'currency.js';


Vue.filter("formatDateMS",function(timestamp,geshi){
	var d = timestamp?dayjs(timestamp).format(geshi?geshi:"YYYY/MM/DD HH:mm"):'';
	if(d=='Invalid date'){
		return timestamp;
	}else{
		return d;
	}
});
Vue.filter("formatDate",function(timestamp,geshi){
	var d = timestamp?dayjs(timestamp*1000).format(geshi?geshi:"YYYY/MM/DD HH:mm"):'';
	if(d=='Invalid date'){
		return timestamp;
	}else{
		return d;
	}
});


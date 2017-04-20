const T_SPEED = 1.5; // 速度の閾値（m/s）
const T_TIME = 20; //累積移動時間の閾値(s)


// 2点間の距離を計算
function calcDistance(latLng1, latLng2) {
	var r = 6378.137; // 地球の半径
	
	var lat1 = latLng1.lat();
	var lng1 = latLng1.lng();
	var lat2 = latLng2.lat();
	var lng2 = latLng2.lng();

	// 緯度差と経度差をラジアンに変換
	var latRad = Math.abs(lat1 - lat2) * Math.PI / 180;
	var lngRad = Math.abs(lng1 - lng2) * Math.PI / 180;

	// 南北と東西の距離を計算
	var distNs = r * latRad;
	var distEw = r * lngRad * Math.cos(lat1 * Math.PI / 180);

	// 2点間の距離を求めてKmで返す
	return Math.sqrt(Math.pow(distNs, 2) + Math.pow(distEw, 2));
}

// 2点間の移動時間を計算
function calcInterval(t1, t2) {
	// 時間を1970年1月1日0時0分0秒からのミリ秒数に変換
	var et1 = Date.parse(t1);
	var et2 = Date.parse(t2);

	// 結果を秒で返す
	return Math.abs(et1 - et2) / 1000;
}

// 速度（m/s）を計算
function calcSpeed(km, sec) {
	return km * 1000 / sec;
}

// 重心を計算
function calcBalance(latLngs) {
	var latTotal = 0;
	var lngTotal = 0;
	
	// 緯度経度の合計を計算
	for (var i = 0; i < latLngs.length; i++) {
		latTotal += latLngs[i].lat();
		lngTotal += latLngs[i].lng();
	}

	// 緯度経度の平均をそれぞれ計算
	var glat = latTotal / latLngs.length;
	var glng = lngTotal / latLngs.length;

	// LatLngクラスにして返す
	return new google.maps.LatLng(glat, glng);
}

$(function() {
	
	var latlng = new google.maps.LatLng(35.90, 132.92);
	
	var mapOptions = {
		zoom: 14, 
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	var map;

	$.ajax({
		url: "http://www.nakl.t.u-tokyo.ac.jp/tmp/GPS/kashiwanoha.xml",
		type: "GET",
		success: function(res) {
			map = new google.maps.Map(document.getElementById('map'), mapOptions);
			xml = $.parseXML(res.responseText);
			var infoList = xml.documentElement.getElementsByTagName("trkpt");
			for (var i = 0; i+1<infoList.length; i=i+1){
				var attributeLat1 = infoList[i].getAttribute("lat");
				var attributeLon1 = infoList[i].getAttribute("lon");
				var attributeLat2 = infoList[i+1].getAttribute("lat");
				var attributeLon2 = infoList[i+1].getAttribute("lon");
				var flightPlanCoordinates = [
					new google.maps.LatLng(attributeLat1,attributeLon1),
    				new google.maps.LatLng(attributeLat2,attributeLon2)
    			];
    			var flightPath = new google.maps.Polyline({
				    path: flightPlanCoordinates,
				    strokeColor: "#FF0000",
				    strokeOpacity: 1.0,
				    strokeWeight: 2
				});
				flightPath.setMap(map);
			}
			var latLngArray = new Array();
			var timeArray = new Array();

			for(var i = 0; i < infoList.length; i++){
				var info = infoList[i];
				var time = $(info).find('time').text();
				var lat = $(info).attr('lat');
				var lng = $(info).attr('lon');

				latLngArray[i] = new google.maps.LatLng(lat, lng);
				timeArray[i] = time;
			}

			//各点間の時間と速度を格納する配列を準備する
			var intervalArray = new Array(); // 移動時間を格納する配列
			var speedArray = new Array(); // 速度を格納する配列
			speedArray[0] = 0; // 速度の初期値を代入

			/**
				TODO:ここで用意された関数を使って、各点間の速度をそれぞれ計算してください。
			**/
			for (i=0; i < infoList.length-1; i++){
				intervalArray[i] = calcInterval(timeArray[i],timeArray[i+1]);
				speedArray[i] = calcSpeed(calcDistance(latLngArray[i],latLngArray[i+1]),intervalArray[i]);
			}



			/**
				TODO:滞留点を求め、地図上にマーカーをプロットしてください。
			**/
			var marker = new Array();
			var infoWindow = new Array();
			var time_sum = 0;
			var stop = 0;
			for (i=0; i+1< infoList.length; i++){
				if (speedArray[i]<T_SPEED){
					time_sum += intervalArray[i];
					if(speedArray[i+1]<T_SPEED){
						continue;
					}
					if(time_sum > T_TIME){
						marker.push(new google.maps.Marker({position: latLngArray[i],map:map}));
						time_sum = 0;
						infoWindow.push(new google.maps.InfoWindow({
							content:'<div class="sample">滞留</div>'
						}));
						markerEvent(stop);
						stop++;
					}
					continue;
				}
				time_sum = 0;
			}
			console.log(marker);
			console.log(infoWindow);
			// for (i=0; i<marker.length; i++){
			// 	marker[i].addListener('click',function(){
			// 		infoWindow[i].open(map,marker[i]);
			// 	});
			// }

			
			//ここでは、ダミーとしてすべての点をプロットした場合を記載する（すべて消して書き換えること）

			// 重心を求めて、地図の中心にする
			var center = calcBalance(latLngArray);
			map.setCenter(center);

			function markerEvent(i){
				marker[i].addListener('click',function(){
					infoWindow[i].open(map,marker[i]);
				});
			}
		}
	});
});
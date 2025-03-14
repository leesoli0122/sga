const _LIMIT = 5000;
var selectedTab = "CLUSTER_TOTAL";
var tabValue = "cluster";

var alertSocket = null;


var clusterTotalCnt = 0;
var hostTotalCnt = 0;
var deviceCnt = new Map();
var ipCnt = new Map();

var firewallTotalCnt = 0;
var ipsTotalCnt = 0;
var malwareTotalCnt = 0;
var appctlTotalCnt = 0;
var fileTotalCnt = 0;
var pamaclTotalCnt = 0;
var imageSecurityTotalCnt = 0; //이미지 시큐리티 추가
var containerWorkloadTotalCnt = 0; // 컨테이너 워크로드 추가
var imageRunningControlTotalCnt = 0; // 컨테이너 이미지 실행 제어 추가
var containerSecurityTotalCnt = 0; // 컨테이너 이벤트 추가

var firewallEventCnt = 0;
var ipsEventCnt = 0;
var malwareEventCnt = 0;
var appctlEventCnt = 0;
var fileEventCnt = 0;
var pamaclEventCnt = 0;
var imageSecurityEventCnt = 0; //이미지 시큐리티 추가
var containerWorkloadEventCnt = 0; // 컨테이너 워크로드 추가
var imageRunningControlEventCnt = 0; // 컨테이너 이미지 실행 제어 추가
var containerSecurityEventCnt = 0; // 컨테이너 이벤트 추가

var body = { 'isActive': true };

var lvar_json = {};

var lvar_eventFileIntTypeObj = {
	1: 'CREATE',
	2: 'PERM',
	4: 'UID',
	8: 'GID',
	16: 'FILE SIZE',
	32: 'HASH',
	64: 'DELETE',
}

const refreshTimer = 10000;

const tabName = {
	CLUSTER: "cluster",
	HOST: "host"
}

$(function() {
	//doConnect();
});

function doConnect() {
	if (alertSocket != null) {
		// 웹소켓이 연결되어 있는 상태에서 connect시 close 후 다시 connect
		if (alertSocket.readyState === WebSocket.OPEN) {
			alertSocket.close();
		} else {
			return;
		}
	}

	alertSocket = new WebSocket(
		(window.location.protocol == "http:" ? "ws" : "wss") +
		"://" + window.location.host + "/event.ws"
	);

	alertSocket.onopen = function() {
		console.log("연결");

		alertSocket.onmessage = onMessage;
		alertSocket.onclose = onClose;
		alertSocket.onerror = onError;

		registTopic(); // topic 

		body.isActive = true;
		cf_requestServer(_TR_EVENT_IMAGESECURIY_SEARCH, body, function(data) {
			console.log(data);
		});
	};
}

function doDisconnect() {
	switch (tabValue) { // 활성화 되어있는 탭의 종류에 따라 cnt 초기화
		case tabName.CLUSTER:
			clusterTotalCnt = 0;

			imageSecurityTotalCnt = 0; //이미지 시큐리티 추가
			containerWorkloadTotalCnt = 0; // 컨테이너 워크로드 추가
			imageRunningControlTotalCnt = 0; // 컨테이너 이미지 실행 제어 추가
			containerSecurityTotalCnt = 0; // 컨테이너 이벤트 추가

			imageSecurityEventCnt = 0; //이미지 시큐리티 추가
			containerWorkloadEventCnt = 0; // 컨테이너 워크로드 추가
			imageRunningControlEventCnt = 0; // 컨테이너 이미지 실행 제어 추가
			containerSecurityEventCnt = 0; // 컨테이너 이벤트 추가
			break;
		case tabName.HOST:
			hostTotalCnt = 0;

			firewallTotalCnt = 0;
			ipsTotalCnt = 0;
			malwareTotalCnt = 0;
			appctlTotalCnt = 0;
			fileTotalCnt = 0;
			pamaclTotalCnt = 0;

			firewallEventCnt = 0;
			ipsEventCnt = 0;
			malwareEventCnt = 0;
			appctlEventCnt = 0;
			fileEventCnt = 0;
			pamaclEventCnt = 0;
			break;
	}

	// 클러스트, 호스트 두개의 탭에 모두 정지버튼이 눌려 있을 경우에만 disconnect
	if (alertSocket != null && $("#clusterStopBtn").hasClass('on') && $("#hostStopBtn").hasClass('on')) {
		alertSocket.close();
		alertSocket = null;
	} else {
		registTopic();
	}

	deviceCnt = new Map();
	ipCnt = new Map();


	body.isActive = false;
	cf_requestServer(_TR_EVENT_IMAGESECURIY_SEARCH, body, function(data) {
		console.log(data);
	});
}

function registTopic() {
	var topicList = new Array();

	if ($("#imageSecurityBtn").hasClass("on")) topicList.push(_TOPIC_IMAGESECURITY); //이미지 시큐리티
	if ($("#containerWorkloadBtn").hasClass("on")) topicList.push(_TOPIC_CONTAINER_WORKLOAD); // 컨테이너 워크로드
	if ($("#imageRunningControlBtn").hasClass("on")) topicList.push(_TOPIC_IMAGE_RUNNING_CONTROL_EVENT); // 컨테이너 이미지 실행 제어
	if ($("#containerSecurityBtn").hasClass("on")) topicList.push(_TOPIC_CONTAINER_SECURITY_EVENT); // 컨테이너 이벤트

	// 침입방지시스템
	if ($("#ipsBtn").hasClass("on")) {
		topicList.push(_TOPIC_IPS); //IPS
		topicList.push(_TOPIC_AV);
	}
	if ($("#firewallBtn").hasClass("on")) topicList.push(_TOPIC_FIREWALL); // 방화벽
	if ($("#malwareBtn").hasClass("on")) topicList.push(_TOPIC_MALWARE); // 멀웨어
	if ($("#fileBtn").hasClass("on")) topicList.push(_TOPIC_FILE); // 파일 무결성
	if ($("#appctlBtn").hasClass("on")) topicList.push(_TOPIC_APPCTL); // 실행파일통제
	if ($("#pamaclBtn").hasClass("on")) topicList.push(_TOPIC_PAMACL); // 서비스제어

	var headerJson = new Object();
	headerJson.wsId = _WS_SET; // SET:100001, ADD:100002, DEL:100003, GET:100004

	var bodyJson = new Object();
	bodyJson.topicList = topicList;

	var json = new Object();
	json.header = headerJson;
	json.body = bodyJson;
	console.log(json);

	if (alertSocket != null) alertSocket.send(JSON.stringify(json));
}


function onMessage(evt) {
	console.log("event: ", evt);
	console.log("event timeStamp: ", evt.timeStamp);
	console.log("event timeStamp: ", ccf_timeStempToDate(evt.timeStamp));
	var jsonData = JSON.parse(evt.data);
	if (Array.isArray(jsonData)) viewLog(jsonData);
}

function onClose(evt) {
	console.log("연결 끊김");
}

function onError(evt) {
	console.log("Error : " + evt);
}

// log에 대한 null 체크, 데이터 변환
function transformViewLog(item) {
	var transformData = typeof item !== 'undefined' && item !== null && item !== 'null' ? item : "-";

	if (transformData.includes("ACCEPT")) {
		transformData = transformData.replace("ACCEPT", "ALLOW");
	}
	if (transformData.includes("REJECT")) {
		transformData = transformData.replace("REJECT", "DENY");
	}
	if (transformData.includes("NO_PASS")) {
		transformData = transformData.replace("NO_PASS", "FAIL");
	}
	if (transformData.includes("PASS")) {
		transformData = transformData.replace("PASS", "SUCCESS");
	}
	if (transformData.includes("DEFAULT_ALLOW")) {
		transformData = transformData.replace("DEFAULT_ALLOW", "DEFAULT ALLOW");
	}
	return transformData;
}

function viewLog(jsonArray) {
	// console.log("-----list------------------");
	//console.log('event.data: ', jsonArray[0]);
	
	firewallEventCnt = 0;
	ipsEventCnt = 0;
	malwareEventCnt = 0;
	fileEventCnt = 0;
	appctlEventCnt = 0;
	pamaclEventCnt = 0;
	imageSecurityEventCnt = 0; // 이미지 시큐리티 cnt 추가
	containerWorkloadEventCnt = 0; // 컨테이너 워크로드 추가
	imageRunningControlEventCnt = 0; // 컨테이너 이미지 실행 제어 추가
	containerSecurityEventCnt = 0; // 컨테이너 이벤트 추가

/*	console.log("json: ",  jsonArray);
	console.log("json date: ",  jsonArray[0].date);
	console.log("json timeStemp: ",  jsonArray[0].date);*/
	
	$.each(jsonArray, function(idx, item) {
		deviceCnt.set(item.equip_id, item.equip_id);
		ipCnt.set(item.src_ip, item.src_ip);
		ipCnt.set(item.dest_ip, item.dest_ip);

		var log;
		if (item['class'] == _TOPIC_IPS && item['event_type'] == 'alert') {
			var event = new SolipsEvent(item);

			log = $("<p id='IPS' data='" + transformViewLog(JSON.stringify(item)) + "' onclick='ipsAlertListClick(this);' style='display: " + (selectedTab == "HOST_TOTAL" || selectedTab == "IPS" ? "block" : "none") + ";'>");
			log.append(" " + "<span>" + transformViewLog(event.getTime()) + "</span>");
			log.append(" " + "<span style='color: #47c104;'>" + transformViewLog(event.getAgentName()) + "</span>");
			log.append(" " + "<span style='color: yellow;'> 분류=[" + transformViewLog(event.getCategory()) + "]</span>");
			log.append(" " + "<span> 탐지명=[" + transformViewLog(event.getSignature()) + "]</span>");
			log.append(" " + "<span style='color: red;'> 위험도=[" + transformViewLog(event.getSeverityName()) + "]</span>");

			if ($("#ipsBtn").hasClass("on")) {
				ipsEventCnt++;
				$("#hostLogList").prepend(log);
			}
		} else if (item['class'] == _TOPIC_AV && item['event_type'] == 'alert') {
			var event = new SolipsEvent(item);

			log = $("<p id='IPS' data='" + transformViewLog(JSON.stringify(item)) + "' onclick='ipsAlertListClick(this);' style='display: " + (selectedTab == "HOST_TOTAL" || selectedTab == "IPS" ? "block" : "none") + ";'>");
			log.append(" " + "<span>" + transformViewLog(event.getTime()) + "</span>");
			log.append(" " + "<span style='color: #47c104;'>" + transformViewLog(event.getAgentName()) + "</span>");
			log.append(" " + "<span style='color: yellow;'> 분류=[" + transformViewLog(event.getCategory()) + "]</span>");
			log.append(" " + "<span> 탐지명=[" + transformViewLog(event.getSignature()) + "]</span>");
			log.append(" " + "<span style='color: red;'> 위험도=[" + transformViewLog(event.getSeverityName()) + "]</span>");

			if ($("#ipsBtn").hasClass("on")) {
				ipsEventCnt++;
				$("#hostLogList").prepend(log);
			}
		} else if (item['class'] == _TOPIC_FIREWALL) {
			var event = new SolipsEvent(item);

			log = $("<p id='FIREWALL' data='" + transformViewLog(JSON.stringify(item)) + "' onclick='fwAlertListClick(this);' style='display: " + (selectedTab == "HOST_TOTAL" || selectedTab == "FIREWALL" ? "block" : "none") + ";'>");
			log.append(" " + "<span>" + transformViewLog(event.getTime()) + "</span>");
			log.append(" " + "<span style='color: #47c104;'>" + transformViewLog(event.getAgentName()) + "</span>");
			log.append(" " + "<span style='color: #73a3ef;'> 출발지=[" + transformViewLog(event.getSrc()) + "]</span>");
			log.append(" " + "<span style='color: yellow;'> 목적지=[" + transformViewLog(event.getDest()) + "]</span>");
			log.append(" " + "<span> 프로토콜=[" + transformViewLog(event.getProtocol()) + "]</span>");
			log.append(" " + "<span style='color: red;'> 액션=[" + transformViewLog(event.getAction()) + "]</span>");

			if ($("#firewallBtn").hasClass("on")) {
				firewallEventCnt++;
				$("#hostLogList").prepend(log);
			}
		} else if (item['class'] == _TOPIC_MALWARE) {
			var type = item.type;

			if (type == 1) type = "예약 검사";
			else if (type == 2) type = "수동 검사";
			else if (type == 3) type = "실시간 검사";
			else type = "Unknown";

			log = $("<p id='MALWARE' data='" + transformViewLog(JSON.stringify(item)) + "' onclick='malwareAlertListClick(this);' style='display: " + (selectedTab == "HOST_TOTAL" || selectedTab == "MALWARE" ? "block" : "none") + ";'>");
			log.append(" " + "<span>" + transformViewLog(item.revisetime) + "</span>");
			log.append(" " + "<span style='color: #47c104;'>" + transformViewLog(item['dn']) + "(" + transformViewLog(item['equip_id']) + ")" + "</span>");
			log.append(" " + "<span style='color: yellow;'> 스캔 유형=[" + transformViewLog(type) + "]</span>");
			log.append(" " + "<span style='color: red;'> 바이러스=[" + transformViewLog(item.virusname) + "]</span>");
			log.append(" " + "<span> 파일명=[" + transformViewLog(item.filename) + "]</span>");

			if ($("#malwareBtn").hasClass("on")) {
				malwareEventCnt++;
				$("#hostLogList").prepend(log);
			}
		} else if (item['class'] == _TOPIC_FILE) {
			var type = "";

			if (item['type'] == 1) type = "Create";
			else if (item['type'] == 2) type = "Permission";
			else if (item['type'] == 4) type = "User";
			else if (item['type'] == 8) type = "Group";
			else if (item['type'] == 16) type = "Size";
			else if (item['type'] == 32) type = "Hash";
			else if (item['type'] == 64) type = "Delete";
			else type = "?";

			log = $("<p id='FILE' data='" + transformViewLog(JSON.stringify(item)) + "' onclick='fileIntAlertListClick(this);' style='display: " + (selectedTab == "HOST_TOTAL" || selectedTab == "FILE" ? "block" : "none") + ";'>");
			log.append(" " + "<span>" + transformViewLog(item.revisetime) !== "-" ? (transformViewLog(item.revisetime)).replaceAll("-", "/") : transformViewLog(item.revisetime) + "</span>");
			log.append(" " + "<span style='color: #47c104;'>" + transformViewLog(item['dn']) + "(" + transformViewLog(item['devIP']) + ")" + "</span>");
			log.append(" " + "<span style='color: yellow;'> 탐지종류=[" + transformViewLog(type) + "]</span>");
			log.append(" " + "<span style='color: red;'> 파일경로=[" + transformViewLog(item.path) + "]</span>");
			log.append(" " + "<span> 메시지=[" + transformViewLog(item.message) + "]</span>");

			if ($("#fileBtn").hasClass("on")) {
				fileEventCnt++;
				$("#hostLogList").prepend(log);
			}
		} else if (item['class'] == _TOPIC_APPCTL) {
			log = $("<p id='APPCTL' data='" + transformViewLog(JSON.stringify(item)) + "' onclick='fileCtlAlertListClick(this);' style='display: " + (selectedTab == "HOST_TOTAL" || selectedTab == "APPCTL" ? "block" : "none") + ";'>");
			log.append(" " + "<span>" + transformViewLog(item.revisetime) !== "-" ? (transformViewLog(item.revisetime)).replaceAll("-", "/") : transformViewLog(item.revisetime) + "</span>");
			log.append(" " + "<span style='color: #47c104;'>" + transformViewLog(item['dn']) + "(" + transformViewLog(item['devIP']) + ")" + "</span>");
			log.append(" " + "<span style='color: yellow;'> 파일경로=[" + transformViewLog(item.path) + "]</span>");
			log.append(" " + "<span> 메시지=[" + transformViewLog(item.message) + "]</span>");

			if ($("#appctlBtn").hasClass("on")) {
				appctlEventCnt++;
				$("#hostLogList").prepend(log);
			}
		} else if (item['class'] == _TOPIC_PAMACL) {
			log = $("<p id='PAMACL' data='" + transformViewLog(JSON.stringify(item)) + "' onclick='pamAclAlertListClick(this);' style='display: " + (selectedTab == "HOST_TOTAL" || selectedTab == "PAMACL" ? "block" : "none") + ";'>");
			log.append(" " + "<span>" + transformViewLog(item.revisetime) !== "-" ? (transformViewLog(item.revisetime)).replaceAll("-", "/") : transformViewLog(item.revisetime) + "</span>");
			log.append(" " + "<span style='color: #47c104;'>" + transformViewLog(item['dn']) + "(" + transformViewLog(item['equip_id']) + ")" + "</span>");
			log.append(" " + "<span style='color: yellow;'> 허용 여부=[" + transformViewLog(item.permit) + "]</span>");
			log.append(" " + "<span style='color: red;'> 서비스=[" + transformViewLog(item.service) + "]</span>");
			log.append(" " + "<span> 이벤트 내용=[" + transformViewLog(item.message) + "]</span>");

			if ($("#pamaclBtn").hasClass("on")) {
				pamaclTotalCnt;
				$("#hostLogList").prepend(log);
			}
		} else if (item['class'] == _TOPIC_IMAGESECURITY && item['imageScanId']) {
			log = $("<p id='IMAGESECURITY' data='" + transformViewLog(JSON.stringify(item)) + "' onclick='imageSecurityAlertListClick(this);' style='display: " + (selectedTab == "CLUSTER_TOTAL" || selectedTab == "IMAGESECURITY" ? "block" : "none") + ";'>");
			log.append(" " + "<span>" + transformViewLog(item.updatedAt) + "</span>");
			log.append(" " + "<span style='color: #2e6fd4;'>[" + transformViewLog(item.scanType) + "]</span>");
			log.append(" " + "<span style='color: red;'> Scan Result=[" + transformViewLog(item.scanResult) + "]</span>");
			log.append(" " + "<span style='color: yellow;'>Scan Status=[" + transformViewLog(item.scanStatus) + "]</span>");
			log.append(" " + "<span style='color: #47c104;'> Registry=[" + transformViewLog(item.registryName) + "]</span>");
			log.append(" " + "<span style='color: #47c104;'> Image Tag=[" + transformViewLog(item.imageTag) + "]</span>");
			if (item.isRescanned == "YES") {
				log.append(" " + "Rescan,");
			}
			log.append(" " + "<span>Message=[" + transformViewLog(item.message) + "]</span>");
			log.append(" " + "</p>");

			if ($("#imageSecurityBtn").hasClass("on")) {
				imageSecurityEventCnt++;
				$("#clusterLogList").prepend(log);
			}
		} else if (item['class'] == _TOPIC_CONTAINER_WORKLOAD) {
			// 컨테이너 워크로드 실시간 로그 조회 구현
			log = $("<p id='CONTAINER_WORKLOAD' data='" + transformViewLog(JSON.stringify(item)) + "' onclick='containerWorkloadAlertListClick(this);' style='display: " + (selectedTab == "CLUSTER_TOTAL" || selectedTab == "CONTAINER_WORKLOAD" ? "block" : "none") + ";'>");
			log.append(" " + "<span>" + transformViewLog(item.date) + "</span>");
			log.append(" " + "<span style='color: red;'> result=[" + transformViewLog(item.result) + "]</span>");
			if (item.result !== "ACCEPT" && item.result !== "accept") log.append(" " + "<span style='color: yellow;'> rule_name=[" + transformViewLog(item.ruleName) + "]</span>");
			log.append(" " + "<span style='color: #47c104;'> cluster=[" + transformViewLog(item.cluster) + "]</span>");
			log.append(" " + "<span style='color: #47c104;'> namespace=[" + transformViewLog(item.namespace) + "]</span>");
			log.append(" " + "<span style='color: #47c104;'> kind=[" + transformViewLog(item.kind) + "]</span>");
			log.append(" " + "<span style='color: #47c104;'> operation=[" + transformViewLog(item.operation) + "]</span>");
			log.append(" " + "<span>message=[" + transformViewLog(item.message) + "]</span>");

			if ($("#containerWorkloadBtn").hasClass("on")) {
				containerWorkloadEventCnt++;
				$("#clusterLogList").prepend(log);
			}
		} else if (item['class'] == _TOPIC_IMAGE_RUNNING_CONTROL_EVENT) {
			// 컨테이너 이미지 실행 제어 실시간 로그 조회 구현
			log = $("<p id='IMAGE_RUNNING_CONTROL' data='" + transformViewLog(JSON.stringify(item)) + "' onclick='imageRunningControlAlertListClick(this);' style='display: " + (selectedTab == "CLUSTER_TOTAL" || selectedTab == "IMAGE_RUNNING_CONTROL" ? "block" : "none") + ";'>");
			log.append(" " + "<span>" + transformViewLog(item.date) + "</span>");
			log.append(" " + "<span style='color: red;'> result=[" + transformViewLog(item.result) + "]</span>");
			log.append(" " + "<span style='color: yellow;'> cluster=[" + transformViewLog(item.clusterName) + "]</span>");
			log.append(" " + "<span style='color: yellow;'> namespace=[" + transformViewLog(item.namespace) + "]</span>");
			log.append(" " + "<span style='color: yellow;'> kind=[" + transformViewLog(item.kind) + "]</span>");
			log.append(" " + "<span style='color: yellow;'> operation=[" + transformViewLog(item.operation) + "]</span>");
			log.append(" " + "<span style='color: #47c104;'> registry=[" + transformViewLog(item.registryName) + "]</span>");
			log.append(" " + "<span style='color: #47c104;'> repository=[" + transformViewLog(item.repository) + "]</span>");
			log.append(" " + "<span style='color: #47c104;'> image_tag=[" + transformViewLog(item.imageFullTag) + "]</span>");
			log.append(" " + "<span style='color: #47c104;'> request_user=[" + transformViewLog(item.requestUser) + "]</span>");
			log.append(" " + "<span>message=[" + transformViewLog(item.message) + "]</span>");

			if ($("#imageRunningControlBtn").hasClass("on")) {
				imageRunningControlEventCnt++;
				$("#clusterLogList").prepend(log);
			}
		} else if (item['class'] == _TOPIC_CONTAINER_SECURITY_EVENT) {
			// 컨테이너 이벤트 실시간 로그 조회 구현
			log = $("<p id='CONTAINER_SECURITY' data='" + transformViewLog(JSON.stringify(item)) + "' onclick='containerSecurityAlertListClick(this);' style='display: " + (selectedTab == "CLUSTER_TOTAL" || selectedTab == "CONTAINER_SECURITY" ? "block" : "none") + ";'>");
			log.append(" " + "<span>" + transformViewLog(item.date) + "</span>");
			log.append(" " + "<span style='color: red;'> cluster=[" + transformViewLog(item.clusterName) + "]</span>");
			log.append(" " + "<span style='color: yellow;'> rule_name=[" + transformViewLog(item.ruleName) + "]</span>");
			log.append(" " + "<span style='color: #47c104;'> severity=[" + transformViewLog(item.ruleSeverity) + "]</span>");
			log.append("<span>message=[" + transformViewLog(item.message) + "]</span>");

			if ($("#containerSecurityBtn").hasClass("on")) {
				containerSecurityEventCnt++;
				$("#clusterLogList").prepend(log);
			}
		} else {
			return;
		}

		((selectedTab == "CLUSTER_TOTAL" || selectedTab == "HOST_TOTAL" || selectedTab == log.attr("id")) && (!$("#keywordFilter").is(":checked") || ($("#keywordFilter").is(":checked") && log.html().indexOf($("#keyword").val()) > -1))) ? log.show() : log.hide();
	});
	if ($("#logList p").length > _LIMIT) $("#logList p:last").remove();

	//var ipsArray = _filter(jsonArray, _TOPIC_IPS);
	//var avArray = _filter(jsonArray, _TOPIC_AV);
	//var fwArray = _filter(jsonArray, _TOPIC_FIREWALL);
	//var malwareArray = _filter(jsonArray, _TOPIC_MALWARE);
	//var fileArray = _filter(jsonArray, _TOPIC_FILE);
	//var appArray = _filter(jsonArray, _TOPIC_APPCTL);
	//var pamArray = _filter(jsonArray, _TOPIC_PAMACL);

	firewallTotalCnt += ($("#firewallBtn").hasClass("on") ? firewallEventCnt : 0);
	ipsTotalCnt += ($("#ipsBtn").hasClass("on") ? ipsEventCnt : 0);
	malwareTotalCnt += ($("#malwareBtn").hasClass("on") ? malwareEventCnt : 0);
	fileTotalCnt += ($("#fileBtn").hasClass("on") ? fileEventCnt : 0);
	appctlTotalCnt += ($("#appctlBtn").hasClass("on") ? appctlEventCnt : 0);
	pamaclTotalCnt += ($("#pamaclBtn").hasClass("on") ? pamaclEventCnt : 0);
	imageSecurityTotalCnt += ($("#imageSecurityBtn").hasClass("on") ? imageSecurityEventCnt : 0); // 이미지 시큐리티 추가
	containerWorkloadTotalCnt += ($("#containerWorkloadBtn").hasClass("on") ? containerWorkloadEventCnt : 0); // 컨테이너 워크로드 추가
	imageRunningControlTotalCnt += ($("#imageRunningControlBtn").hasClass("on") ? imageRunningControlEventCnt : 0); // 컨테이너 이미지 실행 제어 추가
	containerSecurityTotalCnt += ($("#containerSecurityBtn").hasClass("on") ? containerSecurityEventCnt : 0); // 컨테이너 이벤트 추가

	// totalCnt = firewallTotalCnt + ipsTotalCnt + malwareEventCnt + fileEventCnt + appctlTotalCnt + pamaclTotalCnt + imageSecurityTotalCnt + containerWorkloadTotalCnt + imageRunningControlTotalCnt + containerSecurityTotalCnt;
	clusterTotalCnt = imageSecurityTotalCnt + containerWorkloadTotalCnt + imageRunningControlTotalCnt + containerSecurityTotalCnt;
	hostTotalCnt = firewallTotalCnt + ipsTotalCnt + malwareTotalCnt + fileTotalCnt + appctlTotalCnt + pamaclTotalCnt;

	$("#firewallEventCnt").html(comma(firewallEventCnt));
	$("#ipsEventCnt").html(comma(ipsEventCnt));
	$("#malwareEventCnt").html(comma(malwareEventCnt));
	$("#appctlEventCnt").html(comma(appctlEventCnt));
	$("#fileEventCnt").html(comma(fileEventCnt));
	$("#pamaclEventCnt").html(comma(pamaclEventCnt));
	$("#imageSecurityEventCnt").html(comma(imageSecurityEventCnt));  // 이미지 시큐리티 추가
	$("#containerWorkloadEventCnt").html(comma(containerWorkloadEventCnt));  // 컨테이너 워크로드 추가
	$("#imageRunningControlEventCnt").html(comma(imageRunningControlEventCnt));  // 컨테이너 이미지 실행 제어 추가
	$("#containerSecurityEventCnt").html(comma(containerSecurityEventCnt));  // 컨테이너 이벤트 추가


	$("#firewallTotalCnt").html(comma(firewallTotalCnt));
	$("#ipsTotalCnt").html(comma(ipsTotalCnt));
	$("#malwareTotalCnt").html(comma(malwareTotalCnt));
	$("#appctlTotalCnt").html(comma(appctlTotalCnt));
	$("#fileTotalCnt").html(comma(fileTotalCnt));
	$("#pamaclTotalCnt").html(comma(pamaclTotalCnt));
	$("#imageSecurityTotalCnt").html(comma(imageSecurityTotalCnt));  // 이미지 시큐리티 추가
	$("#containerWorkloadTotalCnt").html(comma(containerWorkloadTotalCnt));  // 컨테이너 워크로드 추가
	$("#imageRunningControlTotalCnt").html(comma(imageRunningControlTotalCnt));  // 컨테이너 이미지 실행 제어 추가
	$("#containerSecurityTotalCnt").html(comma(containerSecurityTotalCnt));  // 컨테이너 이벤트 추가

	// $("#totalCnt").html(comma(totalCnt));
	$("#clusterTotalCnt").html(comma(clusterTotalCnt));
	$("#hostTotalCnt").html(comma(hostTotalCnt));
	$("#deviceCnt").html(comma(deviceCnt.size));
	$("#ipCnt").html(comma(ipCnt.size));

	(firewallEventCnt > 0 ? $("#firewallEventCnt").addClass("up") : $("#firewallEventCnt").removeClass("up"));
	(ipsEventCnt > 0 ? $("#ipsEventCnt").addClass("up") : $("#ipsEventCnt").removeClass("up"));
	(malwareEventCnt > 0 ? $("#malwareEventCnt").addClass("up") : $("#malwareEventCnt").removeClass("up"));
	(appctlEventCnt > 0 ? $("#appctlEventCnt").addClass("up") : $("#appctlEventCnt").removeClass("up"));
	(fileEventCnt > 0 ? $("#fileEventCnt").addClass("up") : $("#fileEventCnt").removeClass("up"));
	(pamaclEventCnt > 0 ? $("#pamaclEventCnt").addClass("up") : $("#pamaclEventCnt").removeClass("up"));
	(imageSecurityEventCnt > 0 ? $("#imageSecurityEventCnt").addClass("up") : $("#imageSecurityEventCnt").removeClass("up"));  // 이미지 시큐리티 추가
	(containerWorkloadEventCnt > 0 ? $("#containerWorkloadEventCnt").addClass("up") : $("#containerWorkloadEventCnt").removeClass("up"));  // 컨테이너 워크로드 추가
	(imageRunningControlEventCnt > 0 ? $("#imageRunningControlEventCnt").addClass("up") : $("#imageRunningControlEventCnt").removeClass("up"));  // 컨테이너 이미지 실행 제어 추가
	(containerSecurityEventCnt > 0 ? $("#containerSecurityEventCnt").addClass("up") : $("#containerSecurityEventCnt").removeClass("up"));  // 컨테이너 이벤트 추가

	// updateRealtimeChart(firewallEventCnt, ipsEventCnt, malwareEventCnt, fileEventCnt, appctlEventCnt, pamaclEventCnt, imageSecurityEventCnt, containerWorkloadEventCnt, imageRunningControlEventCnt, containerSecurityEventCnt);
	updateClusterRealtimeChart(imageSecurityEventCnt, containerWorkloadEventCnt, imageRunningControlEventCnt, containerSecurityEventCnt);  // 이미지 시큐리티 추가, 컨테이너 워크로드 추가, 컨테이너 이미지 실행 제어 추가
	updateHostRealtimeChart(firewallEventCnt, ipsEventCnt, malwareEventCnt, fileEventCnt, appctlEventCnt, pamaclEventCnt);  // 이미지 시큐리티 추가, 컨테이너 워크로드 추가, 컨테이너 이미지 실행 제어 추가
}

// 차트에 사용되는 변수들.
//var hostRealtimeChart;
var chartSize = 100;
var firewallChartData = new Array();
var ipsChartData = new Array();
var malwareChartData = new Array();
var fileChartData = new Array();
var appctlChartData = new Array();
var pamaclChartData = new Array();
var imageSecurityChartData = new Array(); // 이미지 시큐리티 추가
var containerWorkloadChartData = new Array(); // 컨테이너 워크로드 추가
var imageRunningControlChartData = new Array(); // 컨테이너 이미지 실행 제어 추가
var containerSecurityChartData = new Array(); // 컨테이너 이벤트 추가

// var realtimeChart;

/*function loadRealtimeChart() {
	var width = $("#realtimeChart").width();
	var height = $("#realtimeChart").height();
	
	for(var i = 0; i < chartSize; i++) {
		firewallChartData.push({x: i, y: 0});
		ipsChartData.push({x: i, y: 0});
		malwareChartData.push({x: i, y: 0});
		fileChartData.push({x: i, y: 0});
		appctlChartData.push({x: i, y: 0});
		pamaclChartData.push({x: i, y: 0});
		imageSecurityChartData.push({x: i, y: 0}); // 이미지 시큐리티 추가
		containerWorkloadChartData.push({x: i, y: 0}); // 컨테이너 워크로드 추가
		imageRunningControlChartData.push({x: i, y: 0}); // 컨테이너 이미지 실행 제어 추가
		containerSecurityChartData.push({x: i, y: 0}); // 컨테이너 이벤트 추가

	}
	
	realtimeChart = new Rickshaw.Graph({
		element : document.getElementById("realtimeChart"),
		width : width,
		height : height,
		renderer : 'bar',
		//renderer : "area",
		//renderer : "line",
		//interpolation: "step-after",
		//interpolation: "linear",
		offset: "value",
		stroke : true,
		preserve : true,
		series : [
			{
				color : "#3faeb8",
				data : firewallChartData,
				name : '방화벽'
			},
			{
				color : "#4d67cc",
				data : ipsChartData,
				name : '침입방지시스템'
			},
			{
				color : "#da9527",
				data : malwareChartData,
				name : '멀웨어 탐지'
			},
			{
				color : "#9f9e9e",
				data : fileChartData,
				name : '파일 무결성'
			},
			{
				color : "#55a559",
				data : appctlChartData,
				name : '실행 파일 통제'
			},
			{
				color : "#d2dc00",
				data : pamaclChartData,
				name : '서비스 제어'
			},
			{
				color : "#d2dc00",
				data : imageSecurityChartData, // 이미지 시큐리티 추가
				name : '이미지 시큐리티'
			},
			{
				color : "#d26400",
				data : containerWorkloadChartData, // 컨테이너 워크로드 추가
				name : '컨테이너 워크로드 실행 제어'
			},
			{
				color : "#00CED1",
				data : imageRunningControlChartData, // 컨테이너 이미지 실행 제어 추가
				name : '컨테이너 이미지 실행 제어'
			},
			{
				color : "#00CED1",
				data : containerSecurityChartData, // 컨테이너 이미지 실행 제어 추가
				name : '컨테이너 이미지 실행 제어'
			},
		]
	});
	realtimeChart.render();
	
	var yAxis = new Rickshaw.Graph.Axis.Y({
		graph : realtimeChart,
		tickFormat : Rickshaw.Fixtures.Number.formatKMBT,
		ticksTreatment : "glow"
	});
	yAxis.render();
}

var chartIndex = 0;
function updateRealtimeChart(firewallEventCnt, ipsEventCnt, malwareEventCnt, fileEventCnt, appctlEventCnt, pamaclEventCnt , imageSecurityEventCnt, containerWorkloadEventCnt, imageRunningControlEventCnt, containerSecurityEventCnt) {
	if(chartIndex < chartSize) {
		firewallChartData[chartIndex] = {x: chartIndex, y: firewallEventCnt};
		ipsChartData[chartIndex] = {x: chartIndex, y: ipsEventCnt};
		malwareChartData[chartIndex] = {x: chartIndex, y: malwareEventCnt};
		fileChartData[chartIndex] = {x: chartIndex, y: fileEventCnt};
		appctlChartData[chartIndex] = {x: chartIndex, y: appctlEventCnt};
		pamaclChartData[chartIndex] = {x: chartIndex, y: pamaclEventCnt};
		imageSecurityChartData[chartIndex] = {x: chartIndex, y: imageSecurityEventCnt};
		containerWorkloadChartData[chartIndex] = {x: chartIndex, y: containerWorkloadEventCnt};
		imageRunningControlChartData[chartIndex] = {x: chartIndex, y: imageRunningControlEventCnt};
		containerSecurityChartData[chartIndex] = {x: chartIndex, y: containerSecurityEventCnt};
		
	} else {
		firewallChartData.shift();
		ipsChartData.shift();
		malwareChartData.shift();
		fileChartData.shift();
		appctlChartData.shift();
		pamaclChartData.shift();
		imageSecurityChartData.shift();
		containerWorkloadChartData.shift();
		imageRunningControlChartData.shift();
		containerSecurityChartData.shift();
		
		firewallChartData.push({x: chartIndex, y: firewallEventCnt});
		ipsChartData.push({x: chartIndex, y: ipsEventCnt});
		malwareChartData.push({x: chartIndex, y: malwareEventCnt});
		fileChartData.push({x: chartIndex, y: fileEventCnt});
		appctlChartData.push({x: chartIndex, y: appctlEventCnt});
		pamaclChartData.push({x: chartIndex, y: pamaclEventCnt});
		imageSecurityChartData.push({x: chartIndex, y: imageSecurityEventCnt});
		containerWorkloadChartData.push({x: chartIndex, y: containerWorkloadEventCnt});
		imageRunningControlChartData.push({x: chartIndex, y: imageRunningControlEventCnt});
		containerSecurityChartData.push({x: chartIndex, y: containerSecurityEventCnt});
	}
	
	realtimeChart.update();
	chartIndex++;
}*/
function loadClusterRealtimeChart() {
	//var width = $("#clusterRealtimeChart").width();
	//var height = $("#clusterRealtimeChart").height();

	for (var i = 0; i < chartSize; i++) {
		imageSecurityChartData.push(0); // 이미지 시큐리티 추가
		containerWorkloadChartData.push(0); // 컨테이너 워크로드 추가
		imageRunningControlChartData.push(0); // 컨테이너 이미지 실행 제어 추가
		containerSecurityChartData.push(0); // 컨테이너 이미지 실행 제어 추가
	}

	/*	clusterRealtimeChart = new Rickshaw.Graph({
			element : document.getElementById("clusterRealtimeChart"),
			width : width,
			height : height,
			renderer : 'bar',
			//renderer : "area",
			//renderer : "line",
			//interpolation: "step-after",
			//interpolation: "linear",
			offset: "value",
			stroke : true,
			preserve : true,
			series : [
				{
					color : "#3faeb8",
					data : imageSecurityChartData, // 이미지 시큐리티 추가
					name : '이미지 시큐리티'
				},
				{
					color : "#4d67cc",
					data : containerWorkloadChartData, // 컨테이너 워크로드 추가
					name : '컨테이너 워크로드 실행 제어'
				},
				{
					color : "#da9527",
					data : imageRunningControlChartData, // 컨테이너 이미지 실행 제어 추가
					name : '컨테이너 이미지 실행 제어'
				},
				{
					color : "#9f9e9e",
					data : containerSecurityChartData, // 컨테이너 이벤트 추가
					name : '컨테이너 이벤트'
				},
			]
		});
		clusterRealtimeChart.render();
		
		var yAxis = new Rickshaw.Graph.Axis.Y({
			graph : clusterRealtimeChart,
			tickFormat : Rickshaw.Fixtures.Number.formatKMBT,
			ticksTreatment : "glow"
		});
		yAxis.render();
		
	//	updateClusterRealtimeChart(imageSecurityEventCnt, containerWorkloadEventCnt, imageRunningControlEventCnt, containerSecurityEventCnt);  // 이미지 시큐리티 추가, 컨테이너 워크로드 추가, 컨테이너 이미지 실행 제어 추가
	//	updateHostRealtimeChart(firewallEventCnt, ipsEventCnt, malwareEventCnt, fileEventCnt, appctlEventCnt, pamaclEventCnt);  // 이미지 시큐리티 추가, 컨테이너 워크로드 추가, 컨테이너 이미지 실행 제어 추가
		
		
		//그래프 툴팁 추가
		var tooltip = d3.select(".monitoring_tooltip");
		var timer;
		clusterRealtimeChart.onUpdate(function(){
			d3.selectAll("#clusterRealtimeChart svg rect")
				.on("mousemove", function(){
					clearTimeout(timer);
					var rect = d3.select(this);
					var dataCnt = d3.select(this).data()[0].y;
					var fillColor = rect.attr("fill");
					var innerHtml = "";
					
					switch(fillColor) {
						case "#3faeb8": 
							innerHtml = '컨테이너 이미지 스캔' + " [" + dataCnt + "]";
							break;
						case "#4d67cc": 
							innerHtml = '컨테이너 워크로드 실행 제어' + " [" + dataCnt + "]";
							break;
						case "#da9527": 
							innerHtml = '컨테이너 이미지 실행 제어' + " [" + dataCnt + "]";
							break;
						case "#9f9e9e": 
							innerHtml = '컨테이너 이벤트' + " [" + dataCnt + "]";
							break;
					}
					
					tooltip
						.style("opacity", 0.9)
						.html(innerHtml)
						.style("left", d3.event.pageX + "px")
						.style("top", d3.event.pageY + 20 + "px");
					
					// 일정 시간 움직이지 않을경우 툴팁 숨김
					timer = setTimeout(function() {
						tooltip
							.style("opacity", 0);
					}, 4000); 
				})
				.on("mouseout", function(){
					tooltip
						.style("opacity", 0);
				})
		});*/
	clusterRealtimeChartDrow();
}

function loadHostRealtimeChart() {
	//var width = $("#clusterRealtimeChart").width();
	//var height = $("#clusterRealtimeChart").height();

	for (var i = 0; i < chartSize; i++) {
		firewallChartData.push(0);
		ipsChartData.push(0);
		malwareChartData.push(0);
		fileChartData.push(0);
		appctlChartData.push(0);
		pamaclChartData.push(0);
	}

/*	hostRealtimeChart = new Rickshaw.Graph({
		element: document.getElementById("hostRealtimeChart"),
		width: width,
		height: height,
		renderer: 'bar',
		//renderer : "area",
		//renderer : "line",
		//interpolation: "step-after",
		//interpolation: "linear",
		offset: "value",
		stroke: true,
		preserve: true,
		series: [
			{
				color: "#3faeb8",
				data: firewallChartData,
				name: '방화벽'
			},
			{
				color: "#4d67cc",
				data: ipsChartData,
				name: '침입방지시스템'
			},
			{
				color: "#da9527",
				data: malwareChartData,
				name: '안티 멀웨어'
			},
			{
				color: "#9f9e9e",
				data: fileChartData,
				name: '파일 무결성'
			},
			{
				color: "#55a559",
				data: appctlChartData,
				name: '실행 파일 통제'
			},
			{
				color: "#d2dc00",
				data: pamaclChartData,
				name: '서비스 제어'
			}
		]
	});
	hostRealtimeChart.render();

	var yAxis = new Rickshaw.Graph.Axis.Y({
		graph: hostRealtimeChart,
		tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
		ticksTreatment: "glow"
	});
	yAxis.render();

	//그래프 툴팁 추가
	var tooltip = d3.select(".monitoring_tooltip");
	var timer;
	hostRealtimeChart.onUpdate(function() {
		d3.selectAll("#hostRealtimeChart svg rect")
			.on("mousemove", function() {
				clearTimeout(timer);
				var rect = d3.select(this);
				var dataCnt = d3.select(this).data()[0].y;
				var fillColor = rect.attr("fill");
				var innerHtml = "";

				switch (fillColor) {
					case "#3faeb8":
						innerHtml = '방화벽' + " [" + dataCnt + "]";
						break;
					case "#4d67cc":
						innerHtml = '침입방지시스템' + " [" + dataCnt + "]";
						break;
					case "#da9527":
						innerHtml = '안티 멀웨어' + " [" + dataCnt + "]";
						break;
					case "#9f9e9e":
						innerHtml = '파일 무결성' + " [" + dataCnt + "]";
						break;
					case "#55a559":
						innerHtml = '실행 파일 통제' + " [" + dataCnt + "]";
						break;
					case "#d2dc00":
						innerHtml = '서비스 제어' + " [" + dataCnt + "]";
						break;
				}

				tooltip
					.style("opacity", 0.9)
					.html(innerHtml)
					.style("left", d3.event.pageX + "px")
					.style("top", d3.event.pageY + 20 + "px");

				// 일정 시간 움직이지 않을경우 툴팁 숨김
				timer = setTimeout(function() {
					tooltip
						.style("opacity", 0);
				}, 4000);
			})
			.on("mouseout", function() {
				tooltip
					.style("opacity", 0);
			})
	});*/
	hostRealtimeChartDrow();
}

// 이미지 시큐리티 추가
// 컨테이너 워크로드 추가
// 컨테이너 이미지 실행 제어 추가
// 컨테이너 이벤트 추가
//var clusterChartIndex = 100;
function updateClusterRealtimeChart(imageSecurityEventCnt, containerWorkloadEventCnt, imageRunningControlEventCnt, containerSecurityEventCnt) {
	//2024-01-26 디자인 변경으로 인한 주석처리 및 함수 재정의
	/*	if (clusterChartIndex < chartSize) {
			imageSecurityChartData[clusterChartIndex] = { x: clusterChartIndex, y: imageSecurityEventCnt };
			containerWorkloadChartData[clusterChartIndex] = { x: clusterChartIndex, y: containerWorkloadEventCnt };
			imageRunningControlChartData[clusterChartIndex] = { x: clusterChartIndex, y: imageRunningControlEventCnt };
			containerSecurityChartData[clusterChartIndex] = { x: clusterChartIndex, y: containerSecurityEventCnt };
		} else {
			imageSecurityChartData.shift();
			containerWorkloadChartData.shift();
			imageRunningControlChartData.shift();
			containerSecurityChartData.shift();
			imageSecurityChartData.push({ x: clusterChartIndex, y: imageSecurityEventCnt });
			containerWorkloadChartData.push({ x: clusterChartIndex, y: containerWorkloadEventCnt });
			imageRunningControlChartData.push({ x: clusterChartIndex, y: imageRunningControlEventCnt });
			containerSecurityChartData.push({ x: clusterChartIndex, y: containerSecurityEventCnt });
	
		}*/
	//clusterRealtimeChart.update();
	//clusterChartIndex++;

	imageSecurityChartData.pop();
	containerWorkloadChartData.pop();
	imageRunningControlChartData.pop();
	containerSecurityChartData.pop();

	imageSecurityChartData.unshift(imageSecurityEventCnt);
	containerWorkloadChartData.unshift(containerWorkloadEventCnt);
	imageRunningControlChartData.unshift(imageRunningControlEventCnt);
	containerSecurityChartData.unshift(containerSecurityEventCnt);

	clusterRealtimeChartDrow();

}

//var hostChartIndex = 0;
function updateHostRealtimeChart(firewallEventCnt, ipsEventCnt, malwareEventCnt, fileEventCnt, appctlEventCnt, pamaclEventCnt) {
/*	if (hostChartIndex < chartSize) {
		firewallChartData[hostChartIndex] = { x: hostChartIndex, y: firewallEventCnt };
		ipsChartData[hostChartIndex] = { x: hostChartIndex, y: ipsEventCnt };
		malwareChartData[hostChartIndex] = { x: hostChartIndex, y: malwareEventCnt };
		fileChartData[hostChartIndex] = { x: hostChartIndex, y: fileEventCnt };
		appctlChartData[hostChartIndex] = { x: hostChartIndex, y: appctlEventCnt };
		pamaclChartData[hostChartIndex] = { x: hostChartIndex, y: pamaclEventCnt };
	} else {
		firewallChartData.shift();
		ipsChartData.shift();
		malwareChartData.shift();
		fileChartData.shift();
		appctlChartData.shift();
		pamaclChartData.shift();

		firewallChartData.push({ x: hostChartIndex, y: firewallEventCnt });
		ipsChartData.push({ x: hostChartIndex, y: ipsEventCnt });
		malwareChartData.push({ x: hostChartIndex, y: malwareEventCnt });
		fileChartData.push({ x: hostChartIndex, y: fileEventCnt });
		appctlChartData.push({ x: hostChartIndex, y: appctlEventCnt });
		pamaclChartData.push({ x: hostChartIndex, y: pamaclEventCnt });
	}

	hostRealtimeChart.update();
	hostChartIndex++;*/
	
	
	firewallChartData.pop();
	ipsChartData.pop();
	malwareChartData.pop();
	fileChartData.pop();
	appctlChartData.pop();
	pamaclChartData.pop();
	
	firewallChartData.unshift(firewallEventCnt);
	ipsChartData.unshift(ipsEventCnt);
	malwareChartData.unshift(malwareEventCnt);
	fileChartData.unshift(fileEventCnt);
	appctlChartData.unshift(appctlEventCnt);
	pamaclChartData.unshift(pamaclEventCnt);

	hostRealtimeChartDrow();
}

function _filter(jsonArray, TOPIC) {
	var rArray = new Array();
	for (var i = 0; i < jsonArray.length; i++) {//for (var jsonObj of jsonArray) {
		var jsonObj = jsonArray[i];
		var className = jsonObj['class'];

		if (className == TOPIC) {
			rArray.push(jsonObj);
		}
	}

	return rArray;
}

/**
 * 클릭 이벤트 정의
 */

function ipsAlertListClick(thiz) {
	var rowData = JSON.parse($(thiz).attr("data"));
	var number = 0;

	var detailData;
	var event = new SolipsEvent(rowData);
	var eve = (rowData['eve']['alert'] ? rowData['eve']['alert'] : rowData['eve']['http']);

	if (lvar_json[number]) {
		$('#detailJson').val(JSON.stringify(lvar_json[number], null, 4));
	}

	if (rowData['event_type'] == 'http') {
		$('#detailNum').val("http_" + number);
		detailData = number + '¥' + rowData['dn'] + " / " + rowData['revisetime'] + '¥'
			+ event.getHttpHostname() + '¥' + event.getHttpUrl() + '¥' + event.getHttpPort() + '¥'
			+ event.getHttpUserAgent() + '¥' + event.getHttpContentType() + '¥' + event.getHttpMethod() + '¥'
			+ event.getHttpProtocol() + '¥' + event.getHttpStatus() + '¥' + event.getHttpLength() + '¥'
			+ rowData['collecttime'] + '¥' + event.getTimestamp() + '¥' + rowData['flow_id'] + '¥'
			+ (rowData['src_ip'] + ':' + rowData['src_port']) + '¥' + (rowData['dest_ip'] + ':' + rowData['dest_port']) + '¥' + rowData['flow_id'];
	} else {
		$('#detailNum').val("ips_" + number);
		detailData = number + '¥' + rowData['dn'] + ' (' + rowData['devIP'] + ") / " + rowData['revisetime'] + '¥'
			+ rowData['src_port'] + '¥' + rowData['revisetime'] + '¥' + event.getSignatureId() + '¥'
			+ rowData['dest_port'] + '¥' + event.getSeverityName() + '¥' + event.getFlowBytesToClient() + '¥'
			+ rowData['collecttime'] + '¥' + event.getTimestamp() + '¥' + event.getFlowStart() + '¥'
			+ event.getRev() + '¥' + rowData['proto'] + '¥' + event.getFlowPktsToClient() + '¥'
			+ rowData['equip_ip'] + '¥' + rowData['equip_id'] + '¥' + rowData['flow_id'] + '¥'
			+ rowData['event_type'] + '¥' + event.getGid() + '¥' + event.getFlowPktsToServer() + '¥'
			+ event.getSignature() + '¥' + event.getCategory() + '¥' + event.getFlowBytesToServer()
			+ '¥' + (rowData['src_ip'] + ':' + rowData['src_port']) + '¥' + (rowData['dest_ip'] + ':' + rowData['dest_port']);
	}
	detailData = detailData.replace(/null/g, "-");

	$('#detailData').val(detailData);
	window.open('/eventPacket.do', '', 'width=869,height=719,location=no,status=no,scrollbars=yes');
}

function fwAlertListClick(thiz) {
	var rowData = JSON.parse($(thiz).attr("data"));
	var number = 0;
	var event = new SolipsEvent(rowData);
	var eve = (rowData['eve']['alert'] ? rowData['eve']['alert'] : rowData['eve']['http']);

	console.log(rowData);
	var flow;
	if (rowData['eve']['flow']) flow = rowData['eve']['flow'];
	else flow = {};

	var detailData = number + '¥' + rowData['dn'] + " / " + rowData['revisetime'] + '¥'
		+ rowData['src_port'] + '¥' + rowData['revisetime'] + '¥' + eve['signature_id'] + '¥'
		+ rowData['dest_port'] + '¥' + event.getSeverityName() + '¥' + flow['bytes_toclient'] + '¥'
		+ rowData['collecttime'] + '¥' + rowData['eve']['timestamp'] + '¥' + flow['start'] + '¥'
		+ eve['rev'] + '¥' + rowData['proto'] + '¥' + flow['pkts_toclient'] + '¥'
		+ rowData['devIP'] + '¥' + rowData['equip_id'] + '¥' + rowData['flow_id'] + '¥'
		+ rowData['event_type'] + '¥' + eve['gid'] + '¥' + flow['pkts_toserver'] + '¥'
		+ event.getSignature() + '¥' + event.getCategory() + '¥' + flow['bytes_toserver']
		+ '¥' + (rowData['src_ip'] + ':' + rowData['src_port']) + '¥' + (rowData['dest_ip'] + ':' + rowData['dest_port']);
	detailData = detailData.replace(/null/g, "-");

	$('#detailData').val(detailData);
	$('#detailNum').val("fw_" + number);
	window.open('/eventPacket.do', '', 'width=869,height=719,location=no,status=no,scrollbars=yes');
}

function malwareAlertListClick(thiz) {
	var num = 0;
	var rowData = JSON.parse($(thiz).attr("data"));
	var detailData = JSON.stringify(rowData);
	detailData = detailData.replace(/null/g, '"-"');

	$('#detailNum').val("");
	$('#detailNum').val("malwareEvent_" + num);

	$('#detailData').val("");
	$('#detailData').val(detailData);

	window.open('/eventMalwareInfo.do', '', 'width=869,height=719,location=no,status=no,scrollbars=yes');
	/*
	var rowData = JSON.parse($(thiz).attr("data"));
	var number = 0;		
	var event = new SolipsEvent(rowData);
	var eve = (rowData['eve']['alert'] ? rowData['eve']['alert'] : rowData['eve']['http']);
	
	console.log(rowData);
	
	var detailData = number+'¥'+rowData['dn'] + ' ('+rowData['devIP']+") / "+rowData['createtime']+'¥'
		+rowData['id']+'¥'+rowData['type']+'¥'+eve['action']+'¥'
		+rowData['filename']+'¥'+rowData['virusname']+'¥'+rowData['collecttime']+'¥'
		+rowData['revisetime']+'¥'+rowData['pid']+'¥'+rowData['ppid'];
		
	$('#detailData').val(detailData);
	$('#detailNum').val("malware_" + number);
	window.open('/eventPacket.do','','width=869,height=719,location=no,status=no,scrollbars=yes');
	*/
}

function fileIntAlertListClick(thiz) {
	var rowData = JSON.parse($(thiz).attr("data"));
	var number = 0;
	var detailData = number + '¥' + rowData['dn'] + " / " + rowData['revisetime'] + '¥'
		+ lvar_eventFileIntTypeObj[(rowData['type'])] + '¥' + rowData['path'] + '¥' + rowData['perm_old'] + '¥'
		+ rowData['perm_new'] + '¥' + rowData['gid_old'] + '¥' + rowData['gid_new'] + '¥'
		+ rowData['createtime'] + '¥' + rowData['size_old'] + '¥' + rowData['size_new'] + '¥'
		+ rowData['uid_old'] + '¥' + rowData['uid_new'] + '¥' + rowData['message'] + '¥'
		+ rowData['hash_old'] + '¥' + rowData['hash_new'] + '¥' + rowData['collecttime'] + '¥'
		+ rowData['revisetime'];
	detailData = detailData.replace(/null/g, "-");

	$('#detailData').val(detailData);
	$('#detailNum').val("fileInt_" + number);
	window.open('/eventPacket.do', '', 'width=869,height=719,location=no,status=no,scrollbars=yes');
}

function fileCtlAlertListClick(thiz) {
	var rowData = JSON.parse($(thiz).attr("data"));
	var number = 0;
	var detailData = number + '¥' + rowData['dn'] + " / " + rowData['revisetime'] + '¥'
		+ rowData['path'] + '¥' + rowData['equip_id'] + '¥' + rowData['devIP'] + '¥'
		+ rowData['pid'] + '¥' + rowData['ppid'] + '¥'
		+ rowData['message'] + '¥'
		+ rowData['collecttime'] + '¥' + rowData['revisetime'];
	detailData = detailData.replace(/null/g, "-");

	$('#detailData').val(detailData);
	$('#detailNum').val("fileCtl_" + number);
	window.open('/eventPacket.do', '', 'width=869,height=719,location=no,status=no,scrollbars=yes');
}

function pamAclAlertListClick(thiz) {
	var rowData = JSON.parse($(thiz).attr("data"));
	var number = 0;
	var detailData = number + '¥' + rowData['dn'] + " / " + rowData['revisetime'] + '¥'
		+ (rowData['permit'] == 1 ? '+' : '-') + '¥' + rowData['equip_id'] + '¥' + rowData['equip_ip'] + '¥'
		+ rowData['pid'] + '¥' + rowData['ppid'] + '¥' + rowData['service'] + '¥'
		+ rowData['user'] + '¥' + rowData['ip'] + '¥' + rowData['message'] + '¥'
		+ rowData['collecttime'] + '¥' + rowData['revisetime'];
	detailData = detailData.replace(/null/g, "-");

	$('#detailData').val(detailData);
	$('#detailNum').val("pamAcl_" + number);
	window.open('/eventPacket.do', '', 'width=869,height=719,location=no,status=no,scrollbars=yes');
}

// 이미지 시큐리티 상세 팝업 추가 
function imageSecurityAlertListClick(thiz) {
	var rowData = JSON.parse($(thiz).attr("data"));
	var number = 0;
	var detailData = number + '¥' + rowData['registryName'] + " / " + rowData['updatedAt'] + '¥'
		+ rowData['scanType'] + '¥' + rowData['scanResult'] + '¥' + rowData['scanStatus'] + '¥'
		+ rowData['registryName'] + '¥' + rowData['imageTag'] + '¥' + rowData['digest'] + '¥'
		+ rowData['isRescanned'] + '¥'
		+ rowData['message'];
	detailData = detailData.replace(/null/g, "-"); // null 데이터의 경우 '-' 로 치환

	$('#detailData').val(detailData);
	$('#detailNum').val("imageSecurity_" + number);
	window.open('/eventPacket.do', '', 'width=869,height=719,location=no,status=no,scrollbars=yes');
}

//컨테이너 워크로드 실행제어 상세 팝업 추가
function containerWorkloadAlertListClick(thiz) {
	var rowData = JSON.parse($(thiz).attr("data"));
	var number = 0;
	var detailData = number + '¥' + rowData['cluster'] + " / " + rowData['date'] + '¥'
		+ rowData['result'] + '¥' + rowData['ruleName'] + '¥' + rowData['cluster'] + '¥' + rowData['namespace'] + '¥'
		+ rowData['kind'] + '¥' + rowData['operation'] + '¥' + rowData['action'] + '¥' + rowData['message'];
	detailData = detailData.replace(/null/g, "-");

	$('#detailData').val(detailData);
	$('#detailNum').val("containerWorkload_" + number);
	window.open('/eventPacket.do', '', 'width=869,height=719,location=no,status=no,scrollbars=yes');
}

//컨테이너 이미지 실행제어 상세 팝업 추가
function imageRunningControlAlertListClick(thiz) {
	var rowData = JSON.parse($(thiz).attr("data"));
	var number = 0;
	var detailData = number + '¥' + rowData['clusterName'] + " / " + rowData['date'] + '¥'
		+ rowData['result'] + '¥' + rowData['clusterName'] + '¥' + rowData['namespace'] + '¥' + rowData['kind'] + '¥'
		+ rowData['operation'] + '¥' + rowData['registryName'] + '¥' + rowData['repository'] + '¥' + rowData['imageFullTag'] + '¥'
		+ rowData['requestUser'] + '¥' + rowData['message'];
	detailData = detailData.replace(/null/g, "-");

	$('#detailData').val(detailData);
	$('#detailNum').val("imageRunningControl_" + number);
	window.open('/eventPacket.do', '', 'width=869,height=719,location=no,status=no,scrollbars=yes');
}

//컨테이너 이벤트 상세 팝업 추가
function containerSecurityAlertListClick(thiz) {
	console.log("change")
	var rowData = JSON.parse($(thiz).attr("data"));
	var number = 0;
	var detailData = number + '¥' + rowData['clusterName'] + " / " + rowData['date'] + '¥'
		+ rowData['clusterName'] + '¥' + rowData['ruleName'] + '¥' + rowData['ruleSeverity'] + '¥' + rowData['message'];
	detailData = detailData.replace(/null/g, "-");

	$('#detailData').val(detailData);
	$('#detailNum').val("containerSecurity_" + number);
	window.open('/eventPacket.do', '', 'width=869,height=719,location=no,status=no,scrollbars=yes');
}

function comma(str) {
	str = String(str);
	return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}
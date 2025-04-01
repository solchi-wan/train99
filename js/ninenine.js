const workCls = {hover:"hover-cell", cross: "cross-cell", sel: "sel-cell", menu: "menu-cell", voice: "selectedvoice"};
const cellType = {top: "top-cell", left: "left-cell", main: "main-cell"};
var selectFlg = false;
const APP_MODE_PLAY = 1;
const APP_MODE_TEST = 2;
var appMode = APP_MODE_PLAY;
var voiceDir = "zunda";
var dialogPos = "";

window.onload = setupStage;

function setupStage () {
	let mainRow = document.getElementById("topstage");
	// 左上セル
	let lefttop = document.createElement("div");
	lefttop.setAttribute("class", "cell-base");
	mainRow.append(lefttop);

	// 上メニュー
	setupTopmenu(mainRow);

	// 	メインセル + 左メニュー
	setupMainStage(mainRow);

	let charSel = document.querySelectorAll(".voiceselect");
	charSel.forEach(element => {
		element.addEventListener("click", function(){
			let soundObj = this.getElementsByTagName("audio");
			soundObj[0].play();
			setVoiceMenuSelect(this);
			voiceDir = this.dataset.char;
		});
	});
}

function setVoiceMenuSelect(element) {
	let charSel = document.querySelectorAll(".voiceselect");
	charSel.forEach(element => {
		removeAllClass(element);
	});
	addEventClass(element, workCls.voice);
}

function setupTopmenu(mainRow) {
	for (i = 1; i < 10; i++) {
		let topCell = document.createElement("div");
		topCell.setAttribute("class", "cell-base top-cell");
		topCell.dataset.topIndex = i;
		topCell.innerHTML = i;
		mainRow.append(topCell);
	}
}

function setupMainStage(mainRow) {
	for (i = 1; i < 10; i++) {
		for (j = 0; j < 10; j++) {
			let mainCell = document.createElement("div");
			if (j == 0) {
				mainCell.setAttribute("class", "cell-base left-cell");
				mainCell.dataset.leftIndex = i;
				mainCell.innerHTML = i;
			} else {
				mainCell.setAttribute("class", "cell-base main-cell");
				mainCell.dataset.topIndex = j;
				mainCell.dataset.leftIndex = i;
				mainCell.innerHTML = jsondata["dt"+j+i].fig;
				addEvent(mainCell);
			}
			mainRow.append(mainCell);
		}
	}
}

function addEvent(element) {
	element.addEventListener("mouseenter", function (){
		if (!selectFlg) {
			removeAllClass(element);
			addEventClass(element, workCls.hover);
		}
	});

	element.addEventListener("mouseleave", function (){
		if (!selectFlg) {
			removeAllClass(element);
		}
	});

	element.addEventListener("click", function (){
		addClickEvent(element);
	});
}

function addClickEvent(element) {
	removeAppDialog();
	if (hasClass(element, workCls.sel)) {
		resetStage();
		addEventClass(element, workCls.hover);
		selectFlg = false;
	} else {
		resetStage();
		addEventClass(element, workCls.sel);
		selectFlg = true;
		let paramStr = "dt" + element.dataset.topIndex + element.dataset.leftIndex;
		let dataObj = jsondata[paramStr];

		dialogPos = "tpos" + element.dataset.topIndex + " lpos" + element.dataset.leftIndex;
		openAppDialog(dataObj);
	}
}

function hasClass(element, className) {
	let classStr = element.getAttribute("class");
	return classStr.indexOf(className) > -1;
}

function addEventClass(element, className) {
	let classStr = element.getAttribute("class");
	element.setAttribute("class", classStr + " " + className);
}

function resetStage() {
	for (key in cellType) {
		let cells = document.querySelectorAll("." + cellType[key]);
		cells.forEach(element => {
			removeAllClass(element);
		});
	}
}

function removeAllClass(element) {
	let classStr = element.getAttribute("class");
	for (key in workCls) {
		classStr = classStr.replace(" " + workCls[key], "");
	}
	element.setAttribute("class", classStr);
}

function openAppDialog(dataObj) {
	// ダイアログ
	let appDialog = document.createElement("div");
	appDialog.setAttribute("id", "appDialog");
	appDialog.setAttribute("class", dialogPos);
	document.body.append(appDialog);

	// メニューバー
	let appMenubar = document.createElement("div");
	appMenubar.setAttribute("id", "appMenubar");
	appDialog.append(appMenubar);

	// メニュータイトル
	let appTitle = document.createElement("p");
	appTitle.setAttribute("id", "appTitle");
	appMenubar.append(appTitle);

	// クローズボタン
	let closeBtn = document.createElement("button");
	closeBtn.innerHTML = "×";
	closeBtn.setAttribute("id", "closeBtn");
	closeBtn.addEventListener("click", removeAppDialog);
	appMenubar.append(closeBtn);

	// ダイアログBODY
	let appBody = document.createElement("div");
	appBody.setAttribute("id", "appBody");
	appDialog.append(appBody);

	switch (appMode) {
		case APP_MODE_PLAY:
			setupAppPlayDialog(appTitle, appBody, dataObj);
			break;
		case APP_MODE_TEST:
			setupAppTestDialog(appTitle, appBody, dataObj);
			break;
	}
}

function removeAppDialog() {
	let dialog = document.getElementById("appDialog");
	if (dialog) {
		dialog.remove();
	}
}

function setupAppPlayDialog(appTitle, appBody, dataObj) {
	appTitle.innerHTML = "九九の練習";
	let yomiDiv = document.createElement("p");
	yomiDiv.setAttribute("id", "yomiDiv");
	let figDiv = document.createElement("p");
	figDiv.setAttribute("id", "figDiv");
	let btnArea = document.createElement("p");
	btnArea.setAttribute("id", "btnArea");
	let playBtn = document.createElement("button");
	playBtn.setAttribute("id", "playBtn");
	playBtn.innerHTML = "▶︎";
	
	appBody.append(yomiDiv);
	appBody.append(figDiv);
	appBody.append(btnArea);
	btnArea.append(playBtn);

	yomiDiv.innerHTML = dataObj.vofig + " " + dataObj.voans;
	figDiv.innerHTML = dataObj.fig + " = " + dataObj.ans;

	let soundFig = document.createElement("audio");
	let soundAns = document.createElement("audio");
	soundFig.controls = true;
	soundAns.controls = true;
	soundFig.volume = 1;
	soundAns.volume = 1;
	appBody.append(soundFig);
	appBody.append(soundAns);
	soundFig.src = "sound/" + voiceDir + "/" + dataObj.sofig;
	soundAns.src = "sound/" + voiceDir + "/" + dataObj.soans;
	soundFig.addEventListener("ended", function(){
		soundAns.play();
	})

	playBtn.addEventListener("click", function(){
		soundFig.play();
	});

	soundFig.play();
}

function setupAppTestDialog(appTitle, appBody, dataObj) {

}
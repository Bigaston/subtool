// TODO faire un compteur à la mano en ML secondes. A chercher si pas autre manière

let sub_tab_raw = [];
let sub_tab = [];
let current_sub = 0;

let sub_element = document.getElementById("currentSub")
let player;
let last_sec = 0;
let started_timestamp;

function startSync() {
	let subtitle = document.getElementById("subtitle");
	sub_tab_raw = subtitle.value.split("\n");

	var file = document.getElementById("file").files[0];
	console.log(file)

	if (file.type === "audio/mpeg") {
		player = document.getElementById("audio");
	} else {
		player = document.getElementById("video")
	}

	player.style.display = "block";

	var url = URL.createObjectURL(file);
	var reader = new FileReader();
	reader.onload = function() {
		player.src = url;
	}
	reader.readAsDataURL(file);

	sub_element.innerHTML = sub_tab_raw[0];
	document.getElementById("buttons").style.display = "block";
}

function sync() {
	let time = Date.now() - started_timestamp

	let added_obj = {
		start: toHMS(last_sec),
		end: toHMS(time),
		text: sub_tab_raw[current_sub],
		id: current_sub + 1
	}

	sub_tab.push(added_obj);

	// Mise en place du prochain
	if (sub_tab_raw[current_sub+1] != undefined) {
		current_sub++;
		last_sec = time;
		sub_element.innerHTML = sub_tab_raw[current_sub];
	} else {
		download();
	}
}

function download() {
	console.log(sub_tab)
	let srt_string = "";
	
	sub_tab.forEach(s => {
		srt_string = srt_string + s.id + "\n"
		srt_string = srt_string + s.start + " --> " + s.end + "\n"
		srt_string = srt_string + s.text + "\n\n";
	})

	var file = document.getElementById("file").files[0];
	downloadFile("sub_" + file.name.split(".")[0] + ".srt", srt_string);
}

function downloadFile(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
  
	element.style.display = 'none';
	document.body.appendChild(element);
  
	element.click();
  
	document.body.removeChild(element);
  }

function startIn5() {
	setTimeout(() => {
		player.play();
		started_timestamp = Date.now();
	}, 5000	)
}

function toHMS(nbMs) {
	nbSec = Math.trunc(nbMs/1000)

	let sortie = {};
	sortie.heure = Math.trunc(nbSec/3600);
	if (sortie.heure < 10) {sortie.heure = "0"+sortie.heure}

	nbSec = nbSec%3600;
	sortie.minute = Math.trunc(nbSec/60);
	if (sortie.minute < 10) {sortie.minute = "0"+sortie.minute}

	nbSec = nbSec%60;
	sortie.seconde = Math.trunc(nbSec);
	if (sortie.seconde < 10) {sortie.seconde = "0"+sortie.seconde}

	sortie.milliseconde = nbMs-(Math.trunc(nbMs/1000)*1000)
	if (sortie.milliseconde < 10) {sortie.milliseconde = "00"+sortie.milliseconde}
	else if (sortie.milliseconde < 100) {sortie.milliseconde = "0"+sortie.milliseconde}

	let sortie_chaine = sortie.heure + ":" + sortie.minute + ":" + sortie.seconde + "," + sortie.milliseconde;
	return sortie_chaine
}
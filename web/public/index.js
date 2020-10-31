let sub_tab_raw = [];
let sub_tab = [];
let current_sub = 0;

let sub_element = document.getElementById("currentSub")
let video = document.getElementById("video");
let last_sec = 0;

function startSync() {
	let subtitle = document.getElementById("subtitle");
	sub_tab_raw = subtitle.value.split("\n");

	var file = document.getElementById("file").files[0];
	var url = URL.createObjectURL(file);
	console.log(url);
	var reader = new FileReader();
	reader.onload = function() {
		video.src = url;
	}
	reader.readAsDataURL(file);

	sub_element.innerHTML = sub_tab_raw[0];
}

function sync() {
	let added_obj = {
		start: toHMS(last_sec),
		end: toHMS(video.currentTime),
		text: sub_tab_raw[current_sub],
		id: current_sub + 1
	}

	sub_tab.push(added_obj);

	// Mise en place du prochain
	if (sub_tab_raw[current_sub+1] != undefined) {
		current_sub++;
		last_sec = video.currentTime;
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

	downloadFile("sub_" + Date.now() + ".srt", srt_string);
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
		video.play();
	}, 5000	)
}

function toHMS(nbSec) {
	let sortie = {};
	sortie.heure = Math.trunc(nbSec/3600);
	if (sortie.heure < 10) {sortie.heure = "0"+sortie.heure}

	nbSec = nbSec%3600;
	sortie.minute = Math.trunc(nbSec/60);
	if (sortie.minute < 10) {sortie.minute = "0"+sortie.minute}

	nbSec = nbSec%60;
	sortie.seconde = Math.trunc(nbSec);
	if (sortie.seconde < 10) {sortie.seconde = "0"+sortie.seconde}

	let sortie_chaine = sortie.heure + ":" + sortie.minute + ":" + sortie.seconde + ",000";
	return sortie_chaine
}
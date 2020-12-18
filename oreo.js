// keep track of the "top" of each O or RE
// ("top" as in imagine the physical object)
let counter = 0;

let initial_x = 100;
let initial_y = 40;

// thickness of the pieces
let thickness_o = 16;
let thickness_re = 8;

// y value of the top of the last piece
let last_y = initial_y;

// make cream visible under an O piece
let last_cream = false;

// array of audio elements
let ore = [];

//let shift_y_debug = 0;

function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	//this.sound.setAttribute("onended", "alert('ended');");
	//this.sound.setAttribute("controls", false);
	//this.sound.style.display = "none";
	//this.sound.onended = function() {
	// alert('ended');
	// this.sound.remove();
	//};
	document.body.appendChild(this.sound);
	this.play = function () {
		this.sound.play();
	}
	this.stop = function () {
		this.sound.pause();
		this.sound.currentTime = 0;
	}
}

add_o.onclick = function() {
	let img = document.createElement("img");
	let div = document.getElementById("mydiv");
	img.src = "oreo_o.png";
	img.alt = "oreo_o.png";
	let shift_x = initial_x - img.naturalWidth/2;
	if (last_cream) last_y -= 4;
	let shift_y = last_y - img.naturalHeight/2 - thickness_o/2;
	img.style = `position:absolute; left:${shift_x}px; top:${shift_y}px; z-index:${counter}`;
	div.append(img);
	counter++;
	last_y -= thickness_o;
	last_cream = false;
	shift_y_debug = shift_y;
	let diff_y = - last_y + initial_y;
	div.style.top = `${diff_y}px`;
	// play audio
	let audio = new sound('oreo-audio-o.mp3');
	audio.play();
	//audio.sound.addEventListener('pause', ()=>{
	//	alert(audio.sound.duration);
	//});
	ore.push(audio.sound);
};

add_re.onclick = function() {
	let img = document.createElement("img");
	let div = document.getElementById("mydiv");
	img.src = "oreo_re.png";
	img.alt = "oreo_re.png";
	let shift_x = initial_x - img.naturalWidth/2;
	let shift_y = last_y - img.naturalHeight/2 - thickness_re/2;
	img.style = `position:absolute; left:${shift_x}px; top:${shift_y}px; z-index:${counter}`;
	div.append(img);
	counter++;
	last_y -= thickness_re;
	last_cream = true;
	shift_y_debug = shift_y;
	let diff_y = - last_y + initial_y;
	div.style.top = `${diff_y}px`;
	// play audio
	let audio = new sound('oreo-audio-re.mp3');
	audio.play();
	ore.push(audio.sound);
};

playall.onclick = function() {
	let prev_duration = 0;
	for (let index = ore.length - 1; index >= 0; index--) {
		window.setTimeout(function() { ore[index].play(); }, prev_duration * 1000);
		prev_duration += ore[index].duration - 0.04;
	}
};

let body = document.body;
let o_button = document.getElementById('add_o');
let re_button = document.getElementById('add_re');
let play_button = document.getElementById('playall');
body.addEventListener('keydown', (event) => {
	switch (event.key) {
		case 'o':
			o_button.click();
			break;
		case 'r':
			re_button.click();
			break;
		case ' ':
			play_button.click();
	}
	console.log(`key=${event.key},code=${event.code}`);
});


/*
let index = 0;

playall.onclick = function() {
	index = ore.length - 1;
	for (let i = 0; i < ore.length; i++) {
		ore[i].addEventListener('pause', ()=>{
			if (index >= 0) {
				index--;
				ore[index].play();
			}
		});
	}
	ore[index].play();
	console.log(ore.length);
};
*/
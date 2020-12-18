// keep track of the "top" of each O or RE
// ("top" as in imagine the physical 3D object,
// so it's not the top border of the last image,
// but rather somewhere in the middle

// number of pieces already present
// used to add z-index to the pieces
// (strictly speaking not necessary as new pieces
// should appear above old ones anyway
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

// image heights, widths
let o_height = 0, o_width = 0, re_height = 0, re_width = 0;

//let shift_y_debug = 0;


// constructor for a sound object;
// creates an audio element
function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	document.body.appendChild(this.sound);
	this.play = function () {
		this.sound.play();
	}
	this.stop = function () {
		this.sound.pause();
		this.sound.currentTime = 0;
	}
}

// initializes the height and width of the images
window.onload = function() {
	// get the image height, widths
	let img_o = document.createElement("img");
	img_o.src = "oreo_o.png";
	img_o.onload = function() {
		o_height = img_o.naturalHeight;
		o_width = img_o.naturalWidth;
	};
	let img_re = document.createElement("img");
	img_re.src = "oreo_re.png";
	img_re.onload = function() {
		re_height = img_re.naturalHeight;
		re_width = img_re.naturalWidth;
	};
};

	
// adds an 'O' pieces on top when button 'add_o' is clicked
// adds the image element to inner div which is contained in outer div
// want to keep the top of the oreo stack constant,
// so shift the inner div relative to outer div
// as mentioned before, we keep track of things based on where
// the imagined physical "top" of the O or RE is,
// but since position of image is given in terms of the top-left corner,
// the left and top style attributes need to be adjusted by
// half of the image widths and heights respectively
add_o.onclick = function() {
	let img = document.createElement("img");
	let div = document.getElementById("mydiv");
	img.src = "oreo_o.png";
	img.alt = "oreo_o.png";
	let shift_x = initial_x - o_width/2;
	if (last_cream) last_y -= 4; // otherwise O will cover too much of RE
	let shift_y = last_y - o_height/2 - thickness_o/2;
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
	let shift_x = initial_x - re_width/2;
	let shift_y = last_y - re_height/2 - thickness_re/2;
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

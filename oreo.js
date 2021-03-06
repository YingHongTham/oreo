// keep track of the "top" of each O or RE
// ("top" as in imagine the physical 3D object,
// so it's not the top border of the last image,
// but rather somewhere in the middle

// number of pieces already present
// used to add z-index to the pieces
// (strictly speaking not necessary as new pieces
// should appear above old ones anyway
let counter = 0;

// initialize position of the top of the stack
let initial_stack_top = {
	x : 200,
	y : 40,
};
let stack_top = {
	x : initial_stack_top.x,
	y : initial_stack_top.y,
};

let data = [];
data['o'] = {
	img : "oreo_o.png",
	height : 0,
	width : 0,
	thickness : 16, //TODO make this a percentage of image
	audio : "oreo-audio-o.mp3",
	duration : 0,
};
data['re'] = {
	img : "oreo_re.png",
	height : 0,
	width : 0,
	thickness : 8,
	audio : "oreo-audio-re.mp3",
	duration : 0,
};
let delete_audio_src = "crunch.mp3";

let stack_audio = [];
let stack_oreo = [];

// O piece is too thick, would cover too much cream
// if adding O on top of RE, we place it slightly higher
// this bool tells if previous piece added was RE
// (alternatively just look at the audio stack)
let last_cream = false;
let last_cream_adjust = 4;


// initializes the height and width of the images
window.onload = function() {
	// get the image height, widths
	let images = [];
	let audios = [];
	for (let key in data) {
		images[key] = document.createElement("img");
		images[key].src = data[key].img;
		images[key].onload = function() {
			data[key].height = images[key].naturalHeight;
			data[key].width = images[key].naturalWidth;
		};
		audios[key] = document.createElement("audio");
		audios[key].src = data[key].audio;
		audios[key].setAttribute("preload", "auto");
		audios[key].onloadedmetadata = function() {
			data[key].duration = audios[key].duration;
		};
	}
};


function OreoPiece (oreo) {
	this.oreo = oreo;
	this.thickness = data[oreo].thickness;
	this.img = document.createElement("img");
	this.img.src = data[oreo].img;
	this.img.alt = data[oreo].img;
	this.audio = new sound(data[oreo].audio);
	this.duration = data[oreo].duration;
	this.styleStr = `position:absolute; z-index:${counter};`;
	//this.img.style = this.styleStr + `left:${shift.x}px; top:${shift.y}px;`;
	counter++;
	this.point = {
		x : data[oreo].width/2,
		y : data[oreo].height/2 + data[oreo].thickness/2,
	};
	// the following functions should only be used after
	// this.img has loaded, e.g. called from inside
	// this.img.onload = function() { ... }
	// further data to add when the image is fully initialized
	this.secondInit = function() {
		// point is the "bottom" of the oreo piece
		this.point.x = this.img.naturalWidth/2;
		this.point.y = this.img.naturalHeight/2 + this.thickness/2;
	};
	this.addShift = function(pos) {
		let shift = {
			x : pos.x - this.point.x,
			y : pos.y - this.point.y,
		};
		console.log('shift ', shift.x, shift.y);
		//this.img.style.left = `${shift.x}px`;
		//this.img.style.top = `${shift.y}px;`
		this.img.style = this.styleStr + `left:${shift.x}px; top:${shift.y}px;`;
	};
	this.addToMydiv = function(pos) {
		let shift = {
			x : pos.x - this.point.x,
			y : pos.y - this.point.y,
		};
		this.img.style = this.styleStr + `left:${shift.x}px; top:${shift.y}px;`;
		let div = document.getElementById("mydiv");
		div.append(this.img);
		stack_oreo.push(this);
	}
}

function updateOreoName() {
	let p = document.getElementById("oreo_name");
	let string = "";
	for (let i = stack_oreo.length - 1; i >= 0; i--) {
		switch(stack_oreo[i].oreo) {
			case 'o':
				string += 'O';
				break;
			case 're':
				string += 'RE';
				break;
		}
	}
	p.innerHTML = string;
}



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

function addOreoPiece(oreo, play_audio) {
	let oreoPiece = new OreoPiece(oreo);

	if (last_cream && oreo == 'o') stack_top.y -= last_cream_adjust;

	oreoPiece.addToMydiv(stack_top);

	stack_top.y -= data[oreo].thickness;
	last_cream = (oreo == 're');

	// move mydiv down to accommodate
	let diff_y = initial_stack_top.y - stack_top.y;
	let div = document.getElementById("mydiv");
	div.style.top = `${diff_y}px`;

	if (play_audio) oreoPiece.audio.play();
}


add_o.onclick = function() {
	addOreoPiece('o', true);
	updateOreoName();
};

add_re.onclick = function() {
	addOreoPiece('re', true);
	updateOreoName();
};


playall.onclick = function() {
	let prev_duration = 0;
	for (let index = stack_oreo.length - 1; index >= 0; index--) {
		window.setTimeout(function() { stack_oreo[index].audio.play(); }, prev_duration * 1000);
		prev_duration += stack_oreo[index].duration - 0.08;
	}
};

deleteoreo.onclick = function() {
	if (stack_oreo.length == 0) return;

	let ind = stack_oreo.length - 1;
	stack_top.y += stack_oreo[ind].thickness;
	if (ind > 0 && stack_oreo[ind].oreo == 'o' && stack_oreo[ind-1].oreo == 're')
		stack_top.y += last_cream_adjust;
	stack_oreo.pop();
	let div = document.getElementById("mydiv");
	div.removeChild(div.lastElementChild);
	let diff_y = initial_stack_top.y - stack_top.y;
	div.style.top = `${diff_y}px`;

	audio = new sound(delete_audio_src);
	audio.play()

	updateOreoName();
};

//TODO implement typing in typeinput.on??
//
//TODO add chomping sound when delete
//TODO make button flash when button is clicked

let body = document.body;
let o_button = document.getElementById('add_o');
let re_button = document.getElementById('add_re');
let play_button = document.getElementById('playall');
let del_button = document.getElementById('deleteoreo');
body.addEventListener('keydown', (event) => {
	switch (event.key) {
		case 'o':
			o_button.click();
			break;
		case 'r':
			re_button.click();
			break;
		case 'p':
			play_button.click();
			break;
		case 'd':
			del_button.click();
			break;
	}
	//console.log(`key=${event.key},code=${event.code}`);
});


function inputSequence(seq) {
	for (let i = 0; i < seq.length; i++) {
		console.log(seq[i]);
		switch (seq[i]) {
		case 'o':
			o_button.click();
			break;
		case 'r':
			re_button.click();
			break;
		}
	}
}

// TODO: fix inputSequence;
// want to be able to input a word like "OREREREOOOREREOREREOO"
// now problem is the for loop is too fast,
// so javascript goes on to add the next piece
// before the html element for the previous one loads
// makes them appear in funny orders
// easiest solution is to initialize once like before
// also might want to separate audio from the adding process
//inputSequence(['o', 'r', 'o', 'o', 'o', 'o', 'r', 'r', 'r', 'r']);
//

// TODO add deleter



//======================================================================================
//old code

// 
//let initial_x = 100;
//let initial_y = 40;

// thickness of the pieces
//let thickness_o = 16;
//let thickness_re = 8;

// y value of the top of the last piece
//let last_y = initial_y;
//
// array of audio elements
//let ore = [];

// image heights, widths
//let o_height = 0, o_width = 0, re_height = 0, re_width = 0;

//let shift_y_debug = 0;

//let img_o;

// initializes the height and width of the images
/*
window.onload = function() {
	// get the image height, widths
	//let img_o = document.createElement("img");
	img_o = document.createElement("img");
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
*/


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

	
// adds an 'O' pieces on top when button 'add_o' is clicked
// adds the image element to inner div which is contained in outer div
// want to keep the top of the oreo stack constant,
// so shift the inner div relative to outer div
// as mentioned before, we keep track of things based on where
// the imagined physical "top" of the O or RE is,
// but since position of image is given in terms of the top-left corner,
// the left and top style attributes need to be adjusted by
// half of the image widths and heights respectively
/*
add_o.onclick = function() {
	// create image element
	let img = document.createElement("img");
	img.src = "oreo_o.png";
	img.alt = "oreo_o.png";
	//let shift_x = initial_x - o_width/2;
	//img.onload = function() {
	let shift_x = initial_x - img.naturalWidth/2;
	if (last_cream) last_y -= 4; // otherwise O will cover too much of RE
	let shift_y = last_y - o_height/2 - thickness_o/2;
	//img.style = `position:absolute; left:${shift_x}px; top:${shift_y}px; z-index:${counter}`;
	img.style = `position:absolute; left:0px; top:${shift_y}px; z-index:${counter}`;

	// add image element to div
	let div = document.getElementById("mydiv");
	div.append(img);
	counter++;
	last_y -= thickness_o;
	last_cream = false;
	shift_y_debug = shift_y;

	// div should move down to accommodate new piece
	let diff_y = - last_y + initial_y;
	div.style.top = `${diff_y}px`;
	// play audio
	let audio = new sound('oreo-audio-o.mp3');
	audio.play();
	//audio.sound.addEventListener('pause', ()=>{
	//	alert(audio.sound.duration);
	//});
	ore.push(audio.sound);

	img.onload = function() {
		img.style = `position:absolute; left:${shift_x}px; top:${shift_y}px; z-index:${counter}`;
	};
	
	//};
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
*/

//playall.onclick = function() {
	//let prev_duration = 0;
	//for (let index = ore.length - 1; index >= 0; index--) {
		//window.setTimeout(function() { ore[index].play(); }, prev_duration * 1000);
		//prev_duration += ore[index].duration - 0.04;
	//}
//};


//function addOreoPiece(oreo, play_audio) {
//	console.log('before stack_top: ', stack_top);
//	let oreoPiece = new OreoPiece(data[oreo].img, data[oreo].thickness);
//
//	if (last_cream && oreo == 'o') stack_top.y -= last_cream_adjust;
//
//	oreoPiece.img.onload = function() {
//		oreoPiece.secondInit();
//		oreoPiece.addShift(stack_top);
//
//		let div = document.getElementById("mydiv");
//		div.append(oreoPiece.img);
//
//		stack_top.y -= data[oreo].thickness;
//		last_cream = (oreo == 're');
//
//		// move mydiv down to accommodate
//		let diff_y = initial_stack_top.y - stack_top.y;
//		div.style.top = `${diff_y}px`;
//
//		let audio = new sound(data[oreo].audio);
//		if (play_audio) audio.play();
//		//stack_audio.push(audio.sound);
//	};
//}

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

// the two types of oreo pieces, and the information needed to display
// furhter initialization is performed in window.onload
// (height, width, duration)
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
// when want to use a sound, should create and then delete it,
// otherwise there will be big delay
//const deleteAudioObj = new sound(delete_audio_src);

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

// class for each copy of oreo piece
function OreoPiece(oreo) {
	this.oreo = oreo; // 'o' or 're'
	this.thickness = data[oreo].thickness;
	this.img = document.createElement("img");
	this.img.src = data[oreo].img;
	this.img.alt = data[oreo].img;
	this.audio = new sound(data[oreo].audio);
	this.duration = data[oreo].duration;

	this.styleStr = `position:absolute; z-index:${counter};`;
	counter++;
	this.point = {
		x : data[oreo].width/2,
		y : data[oreo].height/2 + data[oreo].thickness/2,
	};
	// the following functions should only be used after
	// this.img has loaded, e.g. called from inside
	// this.img.onload = function() { ... }
	// further data to add when the image is fully initialized
	//this.secondInit = function() {
	//	// point is the "bottom" of the oreo piece
	//	this.point.x = this.img.naturalWidth/2;
	//	this.point.y = this.img.naturalHeight/2 + this.thickness/2;
	//};
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
	//document.body.appendChild(this.sound);
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

//=====================================================================
// button functionalities

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
		window.setTimeout(function() {
      stack_oreo[index].audio.play();
    }, prev_duration * 1000);
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
	audio.play();
  delete audio;

	updateOreoName();
};

enterTypeOreo.onclick = function() {
  const t = document.getElementById('typeOreo');
  let str = t.value.toUpperCase();
  let prevTime = 0;
  for (let i = str.length - 1; i >= 0; --i) {
    if (str[i] === 'O') {
      window.setTimeout(() =>  {
        add_o.onclick();
      }, prevTime * 1000);
      prevTime += data['o'].duration - 0.08;
    }
    if (str[i] === 'R') {
      window.setTimeout(() =>  {
        add_re.onclick();
      }, prevTime * 1000);
      prevTime += data['re'].duration - 0.08;
    }
  }
}

//============================
// keyboard shortcuts

//TODO add deepfry button

let body = document.body;
let o_button = document.getElementById('add_o');
let re_button = document.getElementById('add_re');
let play_button = document.getElementById('playall');
let del_button = document.getElementById('deleteoreo');
body.addEventListener('keydown', (event) => {
  // don't do anything if text field is active
  const t = document.activeElement;
  if (t.id === 'typeOreo') {
    if (event.key === 'Enter') {
      enterTypeOreo.onclick();
    }
    return;
  }

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
		case 'n':
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

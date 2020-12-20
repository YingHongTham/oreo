


function loadImg (src) {
	let img = document.createElement("img");
	img.src = "oreo_o.png";
	img.onload = function() {
		o_height = img_o.naturalHeight;
		o_width = img_o.naturalWidth;
	};
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
	
	let ora = [];
	let img = img_o;
	let div = document.getElementById("mydiv");
	
	img.src = "new1.png";
	div.append(img);
	img.src = "new2.png";
	div.append(img);
	div.append(img_o);
	div.append(img_re);

	console.log(div.childElementCount);


};


const overlayFiles = ["frame1.png", "hearts.png", "rainbow.png", "sparkles.png"]
const mouseTrailCord = [] 
const mouseTrailImages = [] 

function addCustomStyle(css) {
	document.head.appendChild(document.createElement("style")).innerHTML = css
}

addCustomStyle(`
* {
	font-family: "Comic Sans", "Comic Sans MS", "Chalkboard", "ChalkboardSE-Regular", "Marker Felt", "Purisa", "URW Chancery L", cursive, sans-serif !important;
	color: #0000ff !important;
}

span, p, h1, h2, h3, a {
	font-family: "Comic Sans", "Comic Sans MS", "Chalkboard", "ChalkboardSE-Regular", "Marker Felt", "Purisa", "URW Chancery L", cursive, sans-serif !important;
}

.mouseTrail1 {
	position: absolute;
	height: 16px; width: 16px;
	background-image: url('${chrome.runtime.getURL("cursor/pink_star_1.png")}');
	background-size: contain;
	background-repeat: no-repeat;
	
}
.mouseTrail2 {
	position: absolute;
	height: 64px; width: 64px;
	background-image: url('${chrome.runtime.getURL("cursor/pink_star_2.png")}');
	background-size: contain;
	background-repeat: no-repeat;
	
}
.mouseTrail3 {
	position: absolute;
	height: 32px; width: 16px;
	background-image: url('${chrome.runtime.getURL("cursor/pink_star_3.png")}');
	background-size: contain;
	background-repeat: no-repeat;
	
}
`)

function addOverlay(imgEl, overlayFile) {
	const canvas = document.createElement("canvas")
	canvas.width = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;

	const ctx = canvas.getContext("2d");

	const img1 = loadImage(imgEl.src, myFunction);
    const img2 = loadImage(chrome.runtime.getURL(overlayFile), myFunction);

    let numberOfImages = 0;
    function myFunction() {
        numberOfImages += 1;

        if(numberOfImages == 2) {
            ctx.drawImage(img1, 0, 0);
            ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);

			const newUrl =  canvas.toDataURL()
			imgEl.src = newUrl
			imgEl.setAttribute("srcset", "")
        }
    }

    function loadImage(src, onload) {
        const img = new Image();
		img.crossOrigin="anonymous"
        img.onload = onload;
        img.src = src;
        return img;
    }
}

function changeImages(){
	const imageEls = document.getElementsByTagName("img")
	let count = 0 
	for (const imgEl of imageEls) {
		const choosenOverlay = overlayFiles[count % overlayFiles.length]
		addOverlay(imgEl, "overlays/"+choosenOverlay)
		// console.log(imgEl.src)

		count++
	}
}

function createTrailDivs(){
	for (let i = 0; i <= 12; i++) {
		const newDiv = document.createElement("div")
		const classnr = (i%3) + 1
		newDiv.setAttribute("class", "mouseTrail"+(i%3))

		document.body.appendChild(newDiv)
		mouseTrailImages.push(newDiv)
		mouseTrailCord.push({x: i, y: i})
	}
}

function updateTrailDivs() {
	for (let i = 0; i < mouseTrailImages.length; i++) {
		mouseTrailImages[i].style.left = mouseTrailCord[i].x + "px"
		mouseTrailImages[i].style.top = mouseTrailCord[i].y + "px"
		
	}
}
window.addEventListener("load", (event) => {
console.log("Chrome extension go")

	setTimeout(() => {
		console.log("StartImg")

		changeImages()
		createTrailDivs()
		console.log("Finished img")
	  }, 1000);

  });

window.addEventListener("mousemove", (event) =>{
	mouseTrailCord.unshift({
		x: event.pageX+32, 
		y: event.pageY +32
	})

	mouseTrailCord.pop()
	updateTrailDivs()
})

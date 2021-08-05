let okashis;
let itemImage;
let selectImage;

let results;

let okashiName;
let okashiPrice;


const okashiData = [
	{
		image: "image/haichu_100.png",
		name: "ハイチュウ",
		price: 100,
	},
	{
		image: "image/jagariko_150.png",
		name: "じゃがりこ",
		price: 150,
	},
	{
		image: "image/koara_80.png",
		name: "コアラのマーチ",
		price: 80,
	},
	{
		image: "image/potechi_84.png",
		name: "ポテトチップス",
		price: 84,
	},
	{
		image: "image/takenokoha_160.png",
		name: "たけのこの里",
		price: 160,
	},
	{
		image: "image/umaibou_10.png",
		name: "うまい棒",
		price: 10,
	},
	{
		image: "image/wasabinori_12.png",
		name: "わさびのり",
		price: 12,
	}
];


onload = () => {
	okashis = document.getElementById("okashis");
	selectImage = document.getElementById("selectImage");
	okashiName = document.getElementById("itemName");
	okashiPrice = document.getElementById("itemPrice");
	itemImage = document.getElementById("itemImage");
	results = document.getElementById("results");

	selectImage.onchange = (e) => {
		let reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);
		reader.onload = (e) => {
			itemImage.setAttribute('src',e.target.result);
		}
	};

	document.getElementById("add").onclick = addOkashi;

	const searchButton = document.getElementById("searchButton");
	searchButton.onclick = () => {
		const maxPrice = parseInt(document.getElementById("maxPrice").value);
		if(isNaN(maxPrice) || maxPrice == 0){
			alert("最大の金額は1以上で入力してください。")
			return;
		}
		if(okashiData.length === 0){
			alert("お菓子を最低1つ登録してください。");
			return;
		}
		search(okashiData,maxPrice);
	};

	redrawOkashis();
};

function addOkashi(){
	const oImage = itemImage.getAttribute("src") == "camera.png" ? "noimage.png" : itemImage.getAttribute("src");
	const oName = okashiName.value || "NoName";
	if(!okashiPrice.value || isNaN(okashiPrice.value)){
		alert("値段は半角数字で入力してください。")
		return false;
	}
	const oPrice = parseInt(okashiPrice.value);

	okashiData.push({
		image: oImage,
		name:  oName,
		price: oPrice,
	})
	clearInput();
	redrawOkashis();
}

function removeOkashi(n){
	okashiData.splice(n,1);

	redrawOkashis();
}

function clearInput(){
	itemImage.src = "camera.png";
	selectImage.value = "";
	okashiName.value = "";
	okashiPrice.value = "";
}

function redrawOkashis(){
	okashis.innerHTML = "";
	for(let j = 0;j < okashiData.length;j++){
		const o = document.createElement("div");	//一番外側のdiv
		o.setAttribute("class","okashiCard");
	
		const i = document.createElement("img");	//画像
		const dwrap = document.createElement("div");//データ部分
		dwrap.setAttribute("class","data");
	
		const n = document.createElement("h3");		//おかしの名前
		const price = document.createElement("p");		//値段
	
		const buttonWrap = document.createElement("div");//消すボタン部分
		buttonWrap.setAttribute("class","btnwrp");
		buttonWrap.innerHTML = `
				<a href="#" class="removeButton" onclick="removeOkashi(${j})">×</a>
		`;
		i.src = okashiData[j].image;
		n.innerText = okashiData[j].name;
		price.innerHTML = `<span class='price'>${okashiData[j].price}</span>円`;
		dwrap.appendChild(n);
		dwrap.appendChild(price);
		
		o.appendChild(i);
		o.appendChild(dwrap);
		o.appendChild(buttonWrap);
		
		okashis.appendChild(o);
	}
}

function search(data,price){
	data.sort((a,b) => {
		const ap = a.price;
		const bp = b.price;
		return bp - ap;
	})
	let checking = [0];
	let niceSelects = [];
	let lastNice = [];
	let keisankaisuu = 0;
	const e = (checking,data) => {
		console.log(keisankaisuu++);
		if(checking[checking.length - 1] === data.length){
			if(checking.length <= 1) return;
			checking.pop();
			niceSelects.push(lastNice);
			checking[checking.length - 1] += 1;
			return e(checking,data);
		}
		let sum = 0;
		for(let i = 0;i < checking.length;i++){
			sum += data[checking[i]].price;
		}
		if(sum > price){
			checking[checking.length - 1] += 1;
			
			return e(checking,data);
		}
		lastNice = [...checking];
		checking.push(checking[checking.length - 1]);
		return e(checking,data);
	};
	e(checking,data);
	niceSelects = [...new Set(niceSelects)];
	niceSelects.sort((a,b) => {
		let sumA = 0;
		let sumB = 0;
		for(let i = 0;i < a.length;i++){
			sumA += data[a[i]].price;
		}
		for(let i = 0;i < b.length;i++){
			sumB += data[b[i]].price;
		}
		const dA = Math.abs(300 - sumA);
		const dB = Math.abs(300 - sumB);
		if(dA < dB){
			return -1;
		}
		if(dA > dB){
			return 1;
		}
		return 0;
	});


	drawResult(niceSelects,price);
}

function drawResult(r,price){
	results.innerHTML = ""
	console.log(r);
	const p = document.createElement("p");
	p.innerHTML = `<span class="price">${price}</span>円 で購入できるお菓子は...`
	results.appendChild(p);
	if(r.length === 0){
		const no = document.createElement("p")
		no.innerHTML = `<span id="not-exist">ありません！</span>`;
		results.appendChild(no);
		return;
	}
	for(let i of r){
		const resultCard = document.createElement("div");
		resultCard.setAttribute("id","resultCard")

		let items = document.createElement("div");

		let tweetText = `%23遠足お菓子セレクター+でお菓子を選びました！%0D%0A`

		for(let j of i){
			tweetText += `%0D%0A${okashiData[j].name}+${okashiData[j].price}円`



			let item = document.createElement("div");
			item.setAttribute("class","resultItems");

			let itemImage = document.createElement("img");

			let itemDescription = document.createElement("div");
			itemDescription.setAttribute("class","description");

			let itemName  = document.createElement("h3");
			let itemPrice = document.createElement("p");

			itemImage.setAttribute("src",okashiData[j].image);

			itemName.setAttribute("class","itemName")
			itemName.innerText = okashiData[j].name;
			
			itemPrice.innerHTML = `<span class="price">${okashiData[j].price}</span>円`;

			item.appendChild(itemImage);
			itemDescription.appendChild(itemName);
			itemDescription.appendChild(itemPrice);
			item.appendChild(itemDescription);

			items.appendChild(item);
		}

		let sum = 0;
		let d = 0;
		for(let s = 0;s < i.length;s++){
			sum += okashiData[i[s]].price;
		}
		d = price - sum;
		console.log(d);
		let dp = document.createElement("p");
		dp.setAttribute("class","difference")
		
		tweetText += `%0D%0A%0D%0A合計${sum}円%0D%0Ahttps%3A%2F%2Fcapgame.github.io%2FTripSnackSelector`
		
		dp.innerHTML = `合計：<span class="price">${sum}</span>円　誤差：<span class="price">${d}</span>円　<a href="https://twitter.com/intent/tweet?text=${tweetText}" class="tweet">🐤ツイート</a>`

		resultCard.appendChild(items);
		resultCard.appendChild(dp);

		results.appendChild(resultCard);
	}
}
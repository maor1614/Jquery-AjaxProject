let coinsFromServer = new Array();
let coinsArray = new Array();
let toggleArray = new Array();
let chosenTempArrayToggle = new Array();
var SameSite = 'None';
let chartsGlobalArray=new Array()
let refreshCharts;

(function () {
    $(function () {

        loader("#main");

        // Checks if there is a lastArray in storage.
        toggleArray = getFromLocalStorage();

        // ajax request to get the coins from server
        $.ajax({
            url: "https://api.coingecko.com/api/v3/coins",
            type: 'GET',
            success: function (result) {
                coinsFromServer = result;
                console.log("Successfull Get from server");
                renderCoins(coinsFromServer);
                console.log(coinsArray);
            }, error: function () {
                failFunc();
            }
        })

        // Navigation Bar Search Btns functions
        $("#searchCoinsBtn").click(function () {
            let coinName = $("#coinSearchInput").val().toLowerCase();

            initSearch();

            if (coinName == "") {
                renderCoins(coinsArray);
                return;
            }
            for (let index = 0; index < coinsFromServer.length; index++) {

                if (coinName == coinsFromServer[index].name) {
                    findOneCoin(coinsFromServer[index]);
                    return;
                }
            };
        });
    });
})();

function aboutPage() {
    loader("#main");
    $("#main").empty();
    $("#main").css({ 'padding': '0' });
    $("#navBarAbout").attr("class", "active");
    $("#navBarLiveR").removeClass("active");
    $("#navBarHome").removeClass("active");
    clearInterval(refreshCharts);

    let aboutMainDiv = $("<div>");
    aboutMainDiv.css("width","100%");
    // aboutMainDiv.css("height","95%");
    $("#main").append(aboutMainDiv);

    let aboutImg = $("<img id='myPicture' src='./Assets/MaorShiri.jpg'>");
    aboutImg.css("float","right");
    // aboutImg.css("height","40%");
    aboutImg.css("width","30%");
    aboutImg.css("margin","30px");

    let aboutMeDiv = $(`<div id='aboutMeDiv'>
        <h2 id='aboutHeader'>About Me</h2>
        <p> My Name Is Maor Shiri.</br> 
        I'm 27 years old from Petah-tikva.</br>
       .</br>
     .</br>
        .</br>
        .</p>
    </div>`);

    aboutMainDiv.append(aboutMeDiv);
    
    aboutMainDiv.append(aboutImg);


}

//
function loader(component) {
    let gif = '<img  src="./Assets/762.gif"></img>';
    let loaderDiv = `<div class="loader" col-12">${gif}</div>`;
    $(loaderDiv).append(gif);
    $(component).append(loaderDiv);
};

// these are the functions for the topPage feature.
$(window).scroll(function () {
    var height = $(window).scrollTop();
    if (height > 100) {
        $('#back2Top').fadeIn();
    } else {
        $('#back2Top').fadeOut();
    }
});
$(document).ready(function () {
    $("#back2Top").click(function (event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

});
// // // // // // // // // // // // // // // // // 

// homePage Navigate Function.
function homePage() {
    loader("#main");
    $("#main").empty();
    $("#main").css({ 'padding': '40px' });
    $("#main").css({ 'height': '' });
    $("#navBarHome").attr("class", "active");
    $("#navBarAbout").removeClass("active");
    $("#navBarLiveR").removeClass("active");
    clearInterval(refreshCharts);

    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins",
        type: 'GET',
        success: function (result) {
            coinsFromServer = result;
            console.log("Successfull Get from server");

            renderCoins(coinsFromServer);
            console.log(coinsArray);
        }, error: function () {
            failFunc();
        }
    })
}

//  LiveReports Navigate Function.
function liveReportsChart() {
    loader($("#main"));
    loader(`#chartContainer`);
    $("#main").empty();

    let chartContainer = $("<div>");
    $("#main").append(chartContainer);
    $(chartContainer).css("width","100%");
    $(chartContainer).css("height","100%");
    $(chartContainer).attr("id","chartContainer");
    $("#main").css({ 'padding': 'initial' });
    $("#main").css({ 'padding-top': '80px' });
    $("#main").css({ 'height': '75%' });
    $("#navBarHome").removeClass("active");
    $("#navBarAbout").removeClass("active");
    $("#navBarLiveR").attr("class", "active");

    if (toggleArray =="") {
        alert("You must choose coins to display charts !");
         console.log("No coins were chosen");
         return homePage();
    }
    for (let index=0; index<toggleArray.length;index++){
        chartsGlobalArray.push([])
    }
    refreshCharts = setInterval(drowChart, 2000);
}

function drowChart() {
    loader(`#chartContainer`);
    $.ajax({
        url: "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + toggleArray + "," + "&tsyms=USD",
        type: 'GET',
        success: function (result) {
            console.log("Successfull Get Data and pushed into dataPoints Array");
           
            for (let index = 0; index < toggleArray.length; index++) {
                let coin = {
                    x: new Date(),
                    y: result[toggleArray[index].toUpperCase()].USD
                }
                chartsGlobalArray[index].push(coin);
            }
           
            var options = {
                exportEnabled: true,
                animationEnabled: false,
                title: {
                    text:  "Value OF Coins In USD$"
                },
                subtitles: [{
                    text: "Here you can see the coins you choose and their current value in charts "
                }],
                axisX: {
                    title: "COINS"
                },
                axisY: {
                    title: "Value $",
                    titleFontColor: "#4F81BC",
                    lineColor: "#4F81BC",
                    labelFontColor: "#4F81BC",
                    tickColor: "#4F81BC",
                    includeZero: false
                },
                axisY2: {
                    title: "Profit in USD",
                    titleFontColor: "#C0504E",
                    lineColor: "#C0504E",
                    labelFontColor: "#C0504E",
                    tickColor: "#C0504E",
                    includeZero: false
                },
                toolTip: {
                    shared: true
                },
                legend: {
                    cursor: "pointer",
                    // itemclick: toggleDataSeries
                },
                data: []};
                for (let index = 0; index < toggleArray.length; index++) {
                    let drawObject = {type: "spline",
                    name: toggleArray[index],
                    showInLegend: true,
                    xValueFormatString: "MMM YYYY",
                    yValueFormatString: chartsGlobalArray[index].x,
                    dataPoints: chartsGlobalArray[index]};

                    options.data.push(drawObject);
                }
            $("#chartContainer").CanvasJSChart(options);

            function toggleDataSeries(e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }
        }, error: function () {
            failFunc();
        }
    })
}

// checks If there is a lastSession choices that saved in the LocalSrorage.
function getFromLocalStorage() {
    let lastToogleArray = JSON.parse(localStorage.getItem("toggleChosen"));
    if (lastToogleArray == null) {
        return [];
    }
    return lastToogleArray;
}

// Func that render the coins from coinsFromServer visually
function renderCoins() {
    // put the values of the tempArray in coinsArray 
    coinsArray = creatArray(coinsFromServer)
    console.log("Array Created succesfully")
    createCoins(coinsArray);
}

// make a 100 coins array    
function creatArray(result) {
    let tempArray = new Array();
    $.each(result, function (index, item) {
        if (index < 100) {
            tempArray.push(item);
        }
    })
    return tempArray;
}

// inserting the data to a uniqe array dedicated to OneCoinSearch. not mixing the Arrays.
function findOneCoin(coinName) {
    let oneCoinArray = creatOneCoinArray(coinName);
    createCoins(oneCoinArray);
    console.log("Coin Created succesfully")
}

// The Fail func writing in the console for Devs and Alert to the Users.
function failFunc() {
    initSearch();
    console.log("Failure to get Coins from the server");
    alert("Somthing went wrong getting the details. Please check your spelling or coin not exists")
}
function creatOneCoinArray(result) {
    tempCoinArray = [];
    tempCoinArray.push(result);
    return tempCoinArray;
}

// The Func that Creates Visually The Coins.
function createCoins(data) {
    loader($("#main"));
    $("#main").empty();
    for (let index = 0; index < data.length; index++) {
        // setting some veriables the will be comfortable to use by name.
        let coinId = (data[index].id);
        let coinName = (data[index].name);
        let coinsymbol = (data[index].symbol);

        // Creating the Main Coin Div.
        let coinDiv = $("<div>");
        coinDiv.attr("class", "coinDivClass");
        coinDiv.addClass("col-xs-11 col-sm-6 col-md-4 col-lg-3");
        coinDiv.css("height", "320px")
        coinDiv.css("border", "solid");
        coinDiv.css("background-image", "./3418100.jpg");
        $("#main").append(coinDiv);

        // SwitchBtn 
        let switchButton = $("<label>");
        switchButton.attr("class", "switch");
        switchButton.attr("id", index);
        let switchInput = $("<input>");
        switchInput.attr("class", "switchinput");
        switchInput.attr("type", "checkbox");
        switchInput.attr("value", data[index].symbol);
        switchInput.attr("id", `input${index}`);

        $(coinDiv).append(switchButton);
        $(switchButton).append(switchInput);
        switchButton.append("<span class='slider round'></span>");
        $(switchInput).change(maxToggle);

        // A check if the Div is supposed to be checked from the Array that is saved in the storage.
        $.each(toggleArray, function (i, item) {
            if (coinsymbol == item) {
                return $(`#input${index}`).attr("checked", "checked");
            }

        });

        // creating the main coin body div with text.
        let detailsCoinDiv = $("<div>");
        detailsCoinDiv.attr("class", "card-body");
        $(detailsCoinDiv).attr("id", "text" + coinId);
        $(detailsCoinDiv).append("<h5><b>" + coinName + "</b></h5>");
        $(detailsCoinDiv).append("<p><b>Coin Symbol : " + coinsymbol + "</b></br> Coin id : " + coinId + "</p>");
        $(coinDiv).append(detailsCoinDiv);

        // more info Btn Div
        let infoBtnDiv = $("<div class='infoBtnDiv'>");
        let infoBtn = $("<button>");
        $(infoBtn).attr("id", coinId);
        $(infoBtn).attr("class", "btn btn-info");
        $(infoBtn).text("More Info");
        infoBtn.click(moreInfo)
        infoBtnDiv.append(infoBtn);
        $(coinDiv).append(infoBtnDiv)

        // div the will contain the future More Info text
        let newInfoDiv = $("<div>");
        newInfoDiv.attr("id", "newInfoDiv" + coinId);
        newInfoDiv.css("display", "none");
        newInfoDiv.addClass("fa");
        detailsCoinDiv.append(newInfoDiv);
    }
    initSearch();
};
function initSearch() {
    $("#coinSearchInput").val("");
};

// function that validate the amount of user toggle choices.
function maxToggle() {
    let value = this.value;
    if (toggleArray.length <= 5) {
        for (let index = 0; index < toggleArray.length; index++) {
            if (value == toggleArray[index]) {
                toggleArray.splice(index, 1);
                return localStorage.setItem("toggleChosen", JSON.stringify(toggleArray));
            }
        }
        if (toggleArray.length < 5) {
            toggleArray.push(value);
            return localStorage.setItem("toggleChosen", JSON.stringify(toggleArray));
        }
        chosenTempArrayToggle.push(value);
        showModal(value);
    };
};
// func the calls the Modal.
function showModal(value) {
    $(".modal-body").empty();
    $.each(toggleArray, function (index, item) {
        
        let modalInput = $("<input type=checkbox class=custom-control-input>");
        modalInput.val(item);
        modalInput.addClass("modalInpt")
        modalInput.attr("id", "modalInput" + index);
        modalInput.attr("checked", "checked");
        modalInput.css("float","right");
        // modalChoseDiv.append(modalInput);

        let modallabel = $("<label>");
        // modallabel.attr("for", "modalInput" + index);
      
        modallabel.attr("class", "switch");
        modallabel.addClass("modal-switch");
        modallabel.append(modalInput);
        modallabel.append("<span class='slider round'</span>");
        modallabel.css("margin-top", "3px");
        modallabel.css("float", "left");

        let modalDivName = $("<div>");
       
        modalDivName.css("float","left");
        modalDivName.css("height","fit-content");
        

        let modalChoseDiv = $("<div>");
        modalChoseDiv.html(item);
        modalChoseDiv.attr("class", "custom-control");
        modalChoseDiv.css("display", "inline-block");
        modalChoseDiv.css("height", "100%");
        modalChoseDiv.css("width", "100%");
        modalChoseDiv.css("margin-bottom", "5px");
        modalChoseDiv.css("padding", "20");
        modalChoseDiv.css("text-align", "left");
        modalChoseDiv.css("border-radius", "2px");
        modalChoseDiv.css("border", "solid black 2px");

        modalChoseDiv.append(modallabel);
        modalChoseDiv.append(modalDivName);
        $(".modal-body").append(modalChoseDiv);
        chosenTempArrayToggle.push(item);
    })
    $('#exampleModalCenter').modal('show');
}

$(document).on("click", ".modalInpt", function () {

    if ((this).checked == false) {
        for (let k = 0; k < chosenTempArrayToggle.length; k++) {
            if (this.value == chosenTempArrayToggle[k]) {
                chosenTempArrayToggle.splice(k, 1);
                return;
            }
        }
    }
    if ((this).checked == true) {
        chosenTempArrayToggle.push(this.value);
    }

});

$(document).on("click", "#saveChangModal", function () {
    if (chosenTempArrayToggle.length <= 5) {
        toggleArray = chosenTempArrayToggle;
        createCoins(coinsArray);
       return chosenTempArrayToggle = [];
    }
    createCoins(coinsArray);
    chosenTempArrayToggle = [];
});

$(document).on("click", "#closeModal", function () {
    chosenTempArrayToggle = [];
    createCoins(coinsArray);
});

// function that toggles the info div, filling with data from the server about the coin.
function moreInfo() {
    let coinId = this.id
    loader(`#newInfoDiv${coinId}`);
    $(`#newInfoDiv${coinId}`).slideToggle('slow', getFromServer(coinId));
}

function getFromServer(coinId) {
    
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/" + coinId,
        type: "get",
        success: function (oneCoinFromServer) {
            let moreInfoCoin = oneCoinFromServer;
            $(`#newInfoDiv${coinId}`).html("USD &#xf155; : " + moreInfoCoin.market_data.current_price.usd + "$</br></br> Euro &#xf153; : " + moreInfoCoin.market_data.current_price.eur + "</br></br> NIS &#xf20b; : " + moreInfoCoin.market_data.current_price.ils + "</br></br>");
            let coinImg = $("<img>");
            coinImg.attr("src", moreInfoCoin.image.small);
            coinImg.css("display", "inline-block");
            coinImg.attr("href", `${moreInfoCoin.links.homepage}`);
            coinImg.css("height", "70px");
            coinImg.css("width", "70px");
            $(`#newInfoDiv${coinId}`)
            $(`#newInfoDiv${coinId}`).append(coinImg);
            console.log("Connected successfuly");
        },
        error: function () {
            console.log("connection to server failed");
        }

    });

}

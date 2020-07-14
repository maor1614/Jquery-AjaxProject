let infoBtnDiv = $("<div class='infoBtnDiv'>");
let infoBtn =$("<a>");
$(infoBtn).attr("id",index);
$(infoBtn).attr("class","btn btn-flat blue-text");
$(infoBtn).addclass("p-1 my-1 mr-0 mml-1");
$(infoBtn).addclass("collapsed");
$(infoBtn).attr("data-toggle","collapse");
$(infoBtn).attr("href","collapseContent"+index);
$(infoBtn).attr("aria-expanded","false");
$(infoBtn).attr("aria-controls","collapseContent");
// $(infoBtn).addClass("infoBtn");
$(infoBtn).text("More Info");
infoBtn.click(moreInfo)
infoBtnDiv.append(infoBtn);

$(coinDiv).append(infoBtnDiv)

infoBtn.append("<a class='btn btn-flat red-text p-1 my-1 mr-0 mml-1 collapsed' data-toggle='collapse' href='#collapseContent"+this.id+"' aria-expanded='false' aria-controls='collapseContent'></a>")











let newInfoDiv = $("<div>");
                        newInfoDiv.attr("id","newInfoDiv"+this.id);
                        newInfoDiv.attr("claass","colapsingdiv")
                        newInfoDiv.html("USD value :"+oneCoinFromServer.market_data.current_price.usd)
                        $(`#text${i}`).append(newInfoDiv);
                        newInfoDiv.slideToggle('slow');
                    //     newInfoDiv.attr("class","collapse-content");
                    //     $(`#text${i}`).append(newInfoDiv);
                    //     let infocollapsPara = $("<p>");
                    //     infocollapsPara.attr("class","card-text collapse");
                    //     infocollapsPara.attr("id","collapseContent"+this.id);
                    //     infocollapsPara.html("USD value :"+oneCoinFromServer.market_data.current_price.usd);
                    //    newInfoDiv.append(infocollapsPara);
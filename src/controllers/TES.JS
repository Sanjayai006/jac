socket.on("data-server", function (msg) {
    if (msg.data[0].game != 'wingo') return;
    $(".Loading").fadeIn(0);
    setTimeout(() => {
        let data1 = msg.data[0]; // Get the latest data
        let data2 = []; // Get older data
        data2.push(msg.data[1]);

        $(".time-box .info .number").text(data1.period);
        showListOrder3(data2, 0);

        pageno = 0;
        limit = 10;
        page = 1;

        // Navigation button states
        $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").addClass("block-click");
        $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").removeClass("action");
        $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-left").css("color", "#7f7f7f");
        $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").removeClass("block-click");
        $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").addClass("action");
        $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-right").css("color", "#fff");

        $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").addClass("block-click");
        $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").removeClass("action");
        $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-left").css("color", "#7f7f7f");
        $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").removeClass("block-click");
        $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").addClass("action");
        $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-right").css("color", "#fff");

        var firstGame;

        $.ajax({
            type: "POST",
            url: "/api/webapi/GetMyEmerdList",
            data: {
                typeid: "1",
                pageno: "0",
                pageto: "10",
                language: "vi",
            },
            dataType: "json",
            success: function (response) {
                console.log("API Response:", response);

                if (response && response.data && response.data.gameslist) {
                    let data = response.data.gameslist;
                    $(".game-list .con-box:eq(1) .page-nav .number").text(
                        "1/" + (response.page ? response.page : '1')
                    );

                    firstGame = data[0];
                    var lastGame = data[data.length - 1];

                    console.log("First Game:", firstGame);
                    console.log("Last Game:", lastGame);

                    showListOrder2(data, 1);

                    $.ajax({
                        type: "POST",
                        url: "/api/webapi/GetNoaverageEmerdList",
                        data: {
                            typeid: "1",
                            pageno: "0",
                            pageto: "10",
                            language: "vi",
                        },
                        dataType: "json",
                        success: function (response) {
                            if (response && response.data && response.data.gameslist) {
                                let list_orders = response.data.gameslist;
                                $(".time-box .info .number").text(response.period);
                                $(".game-list .con-box:eq(0) .page-nav .number").text("1/" + response.page);

                                if (firstGame && firstGame.stage === list_orders[0].period) {
                                    var modal = document.getElementById("myModal");
                                    modal.style.display = "block";

                                    var myModalheader = document.getElementById("myModal_header");
                                    var myModal_result = document.getElementById("myModal_result");
                                    var myModal_result_Period = document.getElementById("myModal_result_Period");
                                    var winImage = document.getElementById("winImage");
                                    var lossImage = document.getElementById("lossImage");

                                    if (firstGame.get == 0) {
                                        myModalheader.innerHTML = "Try Again 🥺";
                                        myModal_result.innerHTML = "LOSS : " + firstGame.money;
                                        winImage.style.display = "none";
                                        lossImage.style.display = "block";
                                    } else {
                                        myModalheader.innerHTML = "Winning 🥇";
                                        myModal_result.innerHTML = "WIN : " + firstGame.get;
                                        winImage.style.display = "block";
                                        lossImage.style.display = "none";
                                    }

                                    myModal_result_Period.innerHTML = "Period : 1min " + firstGame.stage;

                                    let color;
                                    let type;

                                    if (firstGame.result >= 0 && firstGame.result <= 4) {
                                        type = "Small";
                                    } else if (firstGame.result >= 5 && firstGame.result <= 9) {
                                        type = "Big";
                                    }

                                    if (firstGame.result == 0) {
                                        color = "Red + Violet";
                                    } else if (firstGame.result == 5) {
                                        color = "Green + Violet";
                                    } else if (firstGame.result % 2 == 0) {
                                        color = "Red";
                                    } else {
                                        color = "Green";
                                    }

                                    lottery_result.innerHTML = "Lottery Result:<span class='btn-boox'>" + color + "</span><span class='btn-boox'>" + firstGame.result + "</span><span class='btn-boox'>" + type + "</span>";
                                }
                                showListOrder(list_orders, 0);
                                showListOrder_t(list_orders, 2);
                            } else {
                                console.error(response);
                                alert("Error: Unable to fetch additional game data.");
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error("AJAX Error:", status, error);
                            alert("An error occurred while fetching additional game data.");
                        }
                    });
                } else {
                    console.error("gameslist is undefined or does not exist in the response data.");
                    alert("Error: gameslist data is unavailable. Please try again later.");
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
                alert("An error occurred while processing your request. Please try again.");
            }
        });

        fetch("/api/webapi/GetUserInfo")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === false) {
                    unsetCookie();
                    return false;
                }
                $(".num span").text(`₹ ${data.data.money_user}. `);
            });
        $(".Loading").fadeOut(0);
    }, 1000);
});
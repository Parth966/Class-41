class Game {
  constructor() {
    this.resetTitle = createElement("h2")
    this.resetButton = createButton("")
    this.leaderBoardTitle = createElement("h2");
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")
    this.playerMoving = false
  }

  start() {
    player = new Player();
    playerCount = player.getCount();
    form = new Form();
    form.display();
    car1 = createSprite(width / 2 - 50, height - 100)
    car1.addImage("c1", car1Img)
    car1.scale = 0.07
    car2 = createSprite(width / 2 + 50, height - 100)
    car2.addImage("c2", car2Img)
    car2.scale = 0.07
    cars = [car1, car2]
    fuels = new Group();
    this.addSprites(fuels, 4, fuelImg, 0.02);
    coins = new Group();
    this.addSprites(coins, 18, coinImg, 0.09);
    obs = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];
    this.addSprites(obs, obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions);
  }



  addSprites(spritesGroup, numOfSprites, spriteImg, scale, positions = []) {
    for (var i = 0; i < numOfSprites; i++) {
      var x, y
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImg = positions[i].image;
      } else {
        x = random(width / 2 + 150, width / 2 - 150)
        y = random(-height * 4.5, height - 400)
      }

      var sprite = createSprite(x, y)
      sprite.addImage("img", spriteImg)
      sprite.scale = scale
      spritesGroup.add(sprite)

    }

  }

  updateState(state) {
    database.ref("/").update({
      gameState: state
    })
  }

  getState() {
    var stateRef = database.ref("gameState")
    stateRef.on("value", data => {
      gameState = data.val();
    })
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50)
    form.titleImg.class("gameTitleAfterEffect")

    this.resetTitle.html("resetGame");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40)
    this.resetButton.class("resetButton")
    this.resetButton.position(width / 2 + 230, 100)
    this.leaderBoardTitle.html("leaderBoardTitle")
    this.leaderBoardTitle.class("LBtitle")
    this.leaderBoardTitle.position(width / 3 - 60, 40)
    this.leader1.class("leadersText")
    this.leader1.position(width / 3 - 50, 80)
    this.leader2.class("leadersText")
    this.leader2.position(width / 3 - 50, 130)
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }




  handleResetButton() {
    this.resetButton.mousePressed(() => {
      console.log("reset");
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {}
      })
      window.location.reload();
    })
  }



  play() {
    this.handleElements();
    Player.getPlayersInfo();
    this.handleResetButton();
    player.getCarsAtEnd();
    const finishLine = height * 6 - 100
    if (player.positionY > finishLine) {
      gameState - 2
      player.rank += 1
      Player.updateCarsAtEnd(player.rank)
      player.update()

    }
    if (allPlayers != undefined) {
      image(trackImg, 0, -height * 5, width, height * 6)
      this.showLeaderboard();
      var index = 0
      for (var p in allPlayers) {
        index += 1
        var x = allPlayers[p].positionX;
        var y = height - allPlayers[p].positionY;
        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;
        if (index == player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          this.handleFuel(index);
          this.handleCoin(index);
          camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;
        }

      }

      this.handlePlayerControls();




      drawSprites();
    }



  }
  handlePlayerControls() {
    
    if (keyDown(UP_ARROW)) {
      this.playerMoving = true
      player.positionY += 10
      player.update();
    }
    if (keyDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      this.playerMoving = true
      player.positionX -= 10
      player.update();
    }
    if (keyDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      this.playerMoving = true
      player.positionX += 10
      player.update();
    }
  }

  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 400, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
    noStroke();
    pop();
  }

  showFuelBar() {
    push();
    image(fuelImage, width / 2 - 130, height - player.positionY - 350, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 350, player.fuel, 20);
    noStroke();
    pop();
  }

  handleFuel(index) {
    cars[index - 1].overlap(fuels, function (collector, collected) {
      player.fuel = 185;
      collected.remove();
    })
    if (player.fuel > 0 && this.playerMoving) {
      player.fuel -= 0.3
    }
    if (player.fuel <= 0) {
      gameState = 2
      this.gameOver();
    }
    
  }



  handleCoin(index) {
    cars[index - 1].overlap(coins, function (collector, collected) {
      player.score += 21;
      collected.remove();
      player.update();
    })
  }

  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Game Over`,
      text: "Oops you lost the race....!!!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing"
    });
  }


}


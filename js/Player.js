class Player {
  constructor() {
    this.name = null
    this.index = null
    this.positionX = 0
    this.positionY = 0
    this.rank = 0
  }

  getCarsAtEnd(){
    database.ref("carsAtEnd").on("value",data=>{
       this.rank = data.val();
    }) 
  }

  static updateCarsAtEnd(rank){
    databse.ref("/").update({
      carsAtEnd:rank
    })
  }

  addPlayer() {
    console.log(player.index)
    var playerIndex = "players/player" + this.index
    console.log(playerIndex)
    console.log(this.name)
    if (this.index == 1) {
      this.positionX = width / 2 - 100
    } else {
      this.positionX = width / 2 + 100
    }
    database.ref(playerIndex).set({

      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY
    })

  }

  

  update() {
    console.log(this.index)
    database.ref("players/player" + this.index).update({
      positionX: this.positionX,
      positionY: this.positionY,
      rank:this.rank,
      score:this.score,
      life:this.life,
    
    });
  }

  getDistance() {
    var playerDistanceRef = database.ref("players/player" + this.index)
    playerDistanceRef.on("value", data => {
      var data = data.val();
      this.positionX = data.positionX;
      this.positionY = data.positionY;
    })

  }

  updateCount(count) {
    database.ref("/").update({
      playerCount: count
    })
  }

  getCount() {
    var countRef = database.ref("playerCount")
    countRef.on("value", data => {
      playerCount = data.val();
    })

  }

  static getPlayersInfo() {
    var playersInfoRef = database.ref("players")
    playersInfoRef.on("value", data => {
      allPlayers = data.val();
    })
  }

}

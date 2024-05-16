// Show dropdown menu
function dropDown() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close dropdown menu
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
            }
        }
    }
}

function disableButtons(state) {
    document.getElementById("attack-button").disabled = state;
    document.getElementById("block-button").disabled = state;
    document.getElementById("stun-button").disabled = state;
}

// -- Game Functions --


// init
var player;
var enemy;
var chooseClass = false;
var winCounter = 0;

class Player {
    constructor(max_hp, hp, damage, block, name) {
        this.max_hp = max_hp;
        this.hp = hp;
        this.damage = damage;
        this.block = block;
        this.name = name;
    }
    // Update HP and Action on UI
    update(playerAction = "Action") {
        var getPlayerAction = document.getElementById("player-action");
        var getPlayerHp = document.getElementById("player-hp");
        var getPlayerName = document.getElementById("player-name");
        
        getPlayerAction.innerHTML = playerAction;
        getPlayerHp.innerHTML = this.hp;
        getPlayerName = this.name;
    }
    attack(enemyHp) {
        return enemyHp -= this.damage; // returns new enemy hp value
    }
}

class Enemy {
    constructor(hp, damage, name) {
        this.hp = hp;
        this.damage = damage;
        this.name = name;
    }
    // Update HP and Action on UI
    update(enemyAction = "Action") {
        var getEnemyAction = document.getElementById("enemy-action");
        var getEnemyHp = document.getElementById("enemy-hp");
        var getEnemyName = document.getElementById("enemy-name");
        
        getEnemyAction.innerHTML = enemyAction;
        getEnemyHp.innerHTML = this.hp;
        getEnemyName.innerHTML = this.name;
    }
    attack(playerHp){
        return playerHp -= this.damage; // returns new player hp value
    }
}

// generate random number between 1 and x
function dice(max) {
    return Math.floor(Math.random() * max);
}

// generate random enemy
// TODO: Add variety for different levels and different names
// idea: use winCounter to adjust "difficulty"
function genEnemy() {
    var HP = dice(10) + 4
    var DAM = dice(4) + 2
    var NAME = "Goblin"
    enemy = new Enemy(HP, DAM, NAME)
}

// choose class based on button clicked and generates first enemy
function setClass(clicked_id) {
    var MAX_HP = [12, 10, 8]
    var DAMAGE = [2, 3, 4]
    var BLOCK = [4, 3, 2]
    var NAME = ["Fighter", "Ranger", "Mage"]
    
    if (chooseClass == false) {
        if (clicked_id == "fight-button") {
            chooseClass = true;
            player = new Player(MAX_HP[0], MAX_HP[0], DAMAGE[0], BLOCK[0], NAME[0]); // Player(HP, Damage, Block, Dice, Name)
            genEnemy();
            disableButtons(false);
            updateCharacters("Ready", "Ready");
        }
        if (clicked_id == "range-button") {
            chooseClass = true;
            player = new Player(MAX_HP[1], MAX_HP[1], DAMAGE[1], BLOCK[1], NAME[1]); // Player(HP, Damage, Block, Dice, Name)
            genEnemy();
            disableButtons(false);
            updateCharacters("Ready", "Ready");
        }
        if (clicked_id == "mage-button") {
            chooseClass = true;
            player = new Player(MAX_HP[2], MAX_HP[2], DAMAGE[2], BLOCK[2], NAME[2]); // Player(HP, Damage, Block, Dice, Name)
            genEnemy();
            disableButtons(false);
            updateCharacters("Ready", "Ready");
        }
    } else {
        return console.log("Already picked a class")
    }
}

// general update player/enemy UI, takes actions as str. "Attacking", "Defending"
function updateCharacters(p_action, e_action) {
    player.update(p_action);
    enemy.update(e_action);
}

// for testing; set on new game button in drop down
function checkPlayer() {
    console.log(player)
    console.log(enemy)
}

// attack button; increments winCounter each win
// win condition for testing is getting 10 wins
// TODO: add reset function? 
function attackEnemy() {
    if (enemy.hp > 0) {
        enemy.hp = player.attack(enemy.hp);
        updateCharacters("Slashes", "Stumbles");
        if (player.hp > 0 && enemy.hp > 0) {
            player.hp = enemy.attack(player.hp);
            updateCharacters("Bites", "Flinches in pain");
        } 
        if (player.hp <= 0) {
            updateCharacters("Piles of bones", "Victory laugh");
            console.log("The player has vanquished...");
            winCounter = 0;
            disableButtons(true);
        }

    }
    if (enemy.hp <= 0) {
        updateCharacters("Victory Dance", "Pile of bones");
        console.log("The enemy has vanquished...");
        if (winCounter < 10) {
            winCounter ++;
            console.log(winCounter);
            genEnemy();
            disableButtons(false);
        }
        else {
            console.log("You beat the game!");
            console.log(winCounter);
            disableButtons(false);
        }
    }
}

/* TODO:
    Add newGame function
*\





// // reset player to default
// function newGame() {
//     // var defPlayer = new Player(10, 10, 2, 2, "Player")
//     var defEnemy = new Enemy(10, 2, "Monster")
//     defPlayer.update("Choose Class")
//     defEnemy.update("Awaiting Player Choice")
// }

// var player = new Player(10, 10, 10, 10, "PLayer")
// // create player object based on class picked





// function fight() {
//     enemy.hp = player.attack(enemy.hp)
//     updateCharacters("Slashing", "Grunts")
//     if (enemy.hp <= 0) {
//     console.log("You win!")
//     } else 
//     {
//         player.hp = enemy.attack(player.hp)
//         updateCharacters("Stumbles", "Bites")
//         if (player.hp <= 0) {
//             console.log("You died!")
//         }
//     }
// }

  
// gameStart = false
// var enemy = new Enemy(10, 5, 9, "Goblin"); // Enemy(HP, Damage, Dice, Name)
// enemy.update("Ready")

// // TODO: Use classes for gameStart = true
// // Add randomization to starting stats?





// function block () {
//     updateCharacters("Blocking", "Biting")
//     var blocked = player.block - enemy.damage
//     if(blocked >= 0) {
//         console.log("Fully Blocked\n Damage Blocked: " + enemy.damage)
//     }
//     if(blocked < 0 && player.hp > 0) {
//         console.log("Partially Blocked\n Damage Taken: " + blocked)
//         player.hp = enemy.attack(player.hp + player.block)
//     } else
//     {
//         console.log("You're dead")
//     }

// }

// function stun () {
//     console.log("Stunned ya!")
// }


// function gameStart(clicked_id) {
//     var clicked_id = clicked_id
//     var MAX_HP = [12, 10, 8]
//     var DAMAGE = [2, 3, 4]
//     var BLOCK = [4, 3, 2]
//     var NAME = ["Fighter", "Ranger", "Mage"]
//     var player = new Player(10, 10, 0, 0, 'Null')

//     function printClass(player) {
//         console.log(player)

//     }
//     printClass(setClass(clicked_id))

// }
// main loop
// async function gameStart() {
//     var gameStart = true;

//     function sleep(ms) {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     }






    // while (gameStart == true) {
    //     // time in ms
    //     const waitTime = 500;
    
    //     player.update("Ready");
    //     enemy.update("Ready");
    //     gameStart = false;
        // if (player.hp > 0) {
        //     if (enemy.hp > 0) {
        //         player.update();
        //         enemy.update();
        //         playerDice = dice(player.dice);
        //         enemyDice = dice(enemy.dice);

        //         if (playerDice > enemyDice) {
        //             player.update("Attacking");
        //             enemy.update("Defending");
        //             enemy.hp = player.attack(enemy.hp);
        //             await sleep(waitTime);
                    
        //         }
        //         if (playerDice < enemyDice) {
        //             player.update("Defending");
        //             enemy.update("Attacking");
        //             player.hp = enemy.attack(player.hp);
        //             await sleep(waitTime);
        //         } 
        //         if (playerDice == enemyDice) {
        //             player.update("Missing");
        //             enemy.update("Missing");
        //             await sleep(waitTime);
        //         }
        //     } else 
        //     {
        //         player.update("Victorious");
        //         enemy.update("Dead");
        //         sleep(1500);
        //         return gameOver = true;
        //     }
        // } else 
        // {
        //     player.update("Dead");
        //     enemy.update("Victorious");
        //     sleep(1500);
        //     return gameOver = true;
        // }
    // }
// }

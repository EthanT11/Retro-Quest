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

// switches active buttons between class and fight menu; boolean
function buttonState(classState, actionState, chooseClass) {
    document.getElementById("fight-button").disabled = classState;
    document.getElementById("range-button").disabled = classState;
    document.getElementById("mage-button").disabled = classState;

    document.getElementById("attack-button").disabled = actionState;
    document.getElementById("block-button").disabled = actionState;
    document.getElementById("stun-button").disabled = actionState;

    chooseClass = chooseClass;
}

// -- Game Functions --


// init
var player;
var enemy;
var chooseClass = false;

var winCounter = 0;
var winsNeeded = 3;

var stunCounter = 0;
var stunned = false;

class Player {
    constructor(max_hp, hp, damage, block, name) {
        this.max_hp = max_hp;
        this.hp = hp;
        this.damage = damage;
        this.block = block;
        this.name = name;
    }

    // Update HP and Action on UI
    update(playerAction) {
        var getPlayerAction = document.getElementById("player-action");
        var getPlayerHp = document.getElementById("player-hp");
        var getPlayerName = document.getElementById("player-name");

        var getPlayerSClass = document.getElementById("s-class");
        var getPlayerSHp = document.getElementById("s-hp");
        var getPlayerSDamage = document.getElementById("s-dam");
        var getPlayerSBlock = document.getElementById("s-block");
        var getPlayerSWins = document.getElementById("s-wins");
        
        getPlayerAction.innerHTML = playerAction;
        getPlayerHp.innerHTML = this.hp;
        getPlayerName.innerHTML = this.name;

        getPlayerSClass.innerHTML = `Class: ${this.name}`;
        getPlayerSHp.innerHTML = `Max HP: ${this.max_hp}`;
        getPlayerSDamage.innerHTML = `Damage: ${this.damage}`;
        getPlayerSBlock.innerHTML = `Block: ${this.block}`;
        getPlayerSWins.innerHTML = `Wins: ${winCounter}`;

    }
    attack(enemyHp) {
        return enemyHp -= this.damage; // returns enemy hp value
    }
    blockAttack(enemyDam) {
        return this.block - enemyDam;
    }

}

class Enemy {
    constructor(max_hp, hp, damage, name) {
        this.max_hp = max_hp;
        this.hp = hp;
        this.damage = damage;
        this.name = name;
    }
    // Update HP and Action on UI
    update(enemyAction = "Action") {
        var getEnemyAction = document.getElementById("enemy-action");
        var getEnemyHp = document.getElementById("enemy-hp");
        var getEnemyName = document.getElementById("enemy-name");

        var getEnemySName = document.getElementById("e-class");
        var getEnemySHp = document.getElementById("e-hp")
        var getEmemySDam = document.getElementById("e-dam")
        
        getEnemyAction.innerHTML = enemyAction;
        getEnemyHp.innerHTML = this.hp;
        getEnemyName.innerHTML = this.name;

        getEnemySName.innerHTML = `Class: ${this.name}`;
        getEnemySHp.innerHTML = `Max HP: ${this.max_hp}`;
        getEmemySDam.innerHTML = `Damage: ${this.damage}`;

    }
    attack(playerHp) {
        return playerHp -= this.damage; // returns player hp value
    }
}

// add randomness to amounts dependent on difficulty?
// amounts dependent on class?
async function levelUp(clicked_id) {
    var getLevelUp = document.getElementById("levelContainer");
    console.log("Level Up!");
    getLevelUp.hidden = true;

    if (clicked_id == "firstChoice") {
        player.max_hp += 2;
        player.damage += 2;
        player.block += 2;
        player.update("I'm feeling strong!")
    } else if (clicked_id == "secondChoice") {
        player.hp = player.max_hp;
        player.update("I'm feeling healthy!")
    }
    await sleep(2000)
    player.update("Ready")
}

// generate random number between 1 and x
function dice(max) {
    return Math.floor(Math.random() * max) + 1;
}

// adds delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// generate random enemy
// TODO: Add variety for different levels and different names
// idea: use winCounter to adjust "difficulty"
async function genEnemy() {
    var MAX_HP = dice(10) + 4;
    var HP = MAX_HP;
    // var DAM = dice(2) + dice(2) + 1;
    var DAM = 2; // randomized for testing
    var NAME = "Goblin";

    buttonState(true, true, true)
    updateCharacters("Ready", "Searching for foes...")
    await sleep(5000);
    enemy = new Enemy(MAX_HP, HP, DAM, NAME);
    updateCharacters("Ready", "Ready");
    buttonState(true, false, true)
}

// choose class based on button clicked and generates first enemy
function setClass(clicked_id) {
    var MAX_HP = [12, 10, 8];
    var DAMAGE = [2, 3, 4];
    var BLOCK = [4, 3, 2];
    var NAME = ["Fighter", "Ranger", "Mage"];
    
    if (!chooseClass) {
        if (clicked_id == "fight-button") {
            player = new Player(MAX_HP[0], MAX_HP[0], DAMAGE[0], BLOCK[0], NAME[0]); // Player(MAX-HP, HP, Damage, Block, Name)
        }
        if (clicked_id == "range-button") {
            player = new Player(MAX_HP[1], MAX_HP[1], DAMAGE[1], BLOCK[1], NAME[1]); // Player(MAX-HP, HP, Damage, Block, Name)
        }
        if (clicked_id == "mage-button") {
            player = new Player(MAX_HP[2], MAX_HP[2], DAMAGE[2], BLOCK[2], NAME[2]); // Player(MAX-HP, HP, Damage, Block, Name)
        }
        genEnemy();
    } else {
        return console.log("Already picked a class");
    }
}

// general update player/enemy UI, takes actions as str. "Attacking", "Defending"
function updateCharacters(p_action, e_action) {
    player.update(p_action);
    enemy.update(e_action);
}


// attack button; increments winCounter each win
// win condition for testing is getting 10 wins
async function attackEnemy() {
    var getLevelUp = document.getElementById("levelContainer");
    if (enemy.hp > 0) {
        enemy.hp = player.attack(enemy.hp);
        checkStun(); // check if stunned, change text depending
        
        if (player.hp > 0 && enemy.hp > 0 && !stunned) { // enemy attack
            player.hp = enemy.attack(player.hp);
            updateCharacters("Flinches in pain", "Bites");
        } 
        if (player.hp <= 0) { // player death
            getLevelUp.hidden = true;
            updateCharacters("Piles of bones", "Victory laugh");
            buttonState(true, true, false);
            await sleep(4000);
            newGame();
        }
        
    }
    if (enemy.hp <= 0) { // check if enemyhp is 0. Level up & load next enemy
        buttonState(true, true, true)
        updateCharacters("Victory Dance", "Pile of bones");
        console.log("The enemy has vanquished...");
        if (winCounter < winsNeeded) {
            getLevelUp.hidden = false;
            
            winCounter ++;
            console.log(winCounter);
            await sleep(3000)
            genEnemy();
        } else { // victory condition
            console.log("You beat the game!");
            buttonState(true, true, false);
            await sleep(6000);
            newGame();
        }
    }
}

// heal off extra blocked dam * probably change
// TODO: Stop healing at max hp
function blockEnemy() {
    var blocked = player.blockAttack(enemy.damage);
    
    if (blocked >= 0) {
        console.log("Fully Blocked\n Damage Blocked: " + enemy.damage)
        console.log("blockedvar: " + blocked)
        player.hp += blocked
        player.update("Blocked " + enemy.damage + " Damage")
        
    }
    if (blocked < 0 && player.hp > 0) {
        console.log("Partially Blocked\n Damage Taken: " + blocked)
        player.hp += blocked
        player.update("Blocked " + enemy.damage + " Damage")
        player.update("Took " + blocked * - 1 + " Damage")
        if (player.hp <= 0) {
            updateCharacters("Piles of bones", "Victory laugh");
            console.log("The player has vanquished...");
            winCounter = 0;
            buttonState(false, true, false);
        }
    }
}

// TODO: hit enemy for half damage on success & 1.5 of gob damage to player on fail?
function stunEnemy() {
    var check = dice(4);
    var getStunButton = document.getElementById("stun-button");
    
    if (check >= 3) { // pass check
        stunned = true;
        stunCounter = 3;
        getStunButton.disabled = true;
        getStunButton.innerHTML = `Stun (${stunCounter - 1})`
        updateCharacters("*Shield bashes*", `*Stunned* (${stunCounter - 1})`)
    } else if (check <= 2) { // fail check
        player.hp = enemy.attack(player.hp);
        updateCharacters("Miss!", "Bites")
    }
}

function checkStun() {
    var getStunButton = document.getElementById("stun-button");
    if (!stunned) {
        updateCharacters("Slashes", "Stumbles");
    } else {
        stunCounter --;
        getStunButton.innerHTML = `Stun (${stunCounter - 1})`
        updateCharacters("Slashes", `*Stunned* (${stunCounter - 1})`);
        if (stunCounter == 0) {
            stunned = false;
            getStunButton.disabled = false;
            getStunButton.innerHTML = "Stun"
        }
    }
}
function newGame() { // reset game state
    winCounter = 0;
    stunCounter = 0;
    player = new Player(10, 10, 10, 10, "...");
    enemy = new Enemy(10, 10, 10, "...");
    updateCharacters("Choose Class", "Awaiting player choice");
    buttonState(false, true, false);
}

// starts new game on page load
newGame();

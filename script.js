import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Define the standard global variables
let container,
	scene, 
	camera,
	renderer,
  shipStart,
  shipSkin,
  shipScar,
  shipStripe,
  shipwipeout,
  posShot;

  let topLight,
      ambientLight;

  const loader = new GLTFLoader();
  
  let objToRender = 'ship';
// Custom global variables
let mouse = {x: 0, y: 0};
let gameScore = 0,
    moneyRewardInGame = 0;
    posShot = {}

let arrBul = [];
let arrEn = [];
let AsteroidArr = [
  './img/meteor1.png',
  './img/meteor2.png',
  './img/meteor3.png',
  './img/meteor4.png'
]

const LS = localStorage;

init();
animate();


let speedOfShoot = 800;
let speedOfAddScore = 1000;

let GameSound,
    MenuSound,
    addScoreInterval,
    CheckLoseIntr,
    gameplayStart;

    GameSound = new Audio("./sounds/background-sound.mp3");
    MenuSound = new Audio("./sounds/background-menu.mp3");

function init() {

	// Scene
	scene = new THREE.Scene();

	// Camera
	let screenWidth = window.innerWidth,
			screenHeight = window.innerHeight,
			viewAngle = 75,
			nearDistance = 0.1,
			farDistance = 1000;
	camera = new THREE.PerspectiveCamera(viewAngle, screenWidth / 	screenHeight, nearDistance, farDistance);
	scene.add(camera);
	camera.position.set(0, 0, 5);
	camera.lookAt(scene.position);

	// Renderer engine together with the background
	renderer = new THREE.WebGLRenderer({
			antialias: true,
    	alpha: true
  });
	renderer.setSize(screenWidth, screenHeight);
	container = document.getElementById('Gamer');
	container.appendChild(renderer.domElement); 

	// Create a circle around the mouse and move it
	// The sphere has opacity 0

const startBtn = document.querySelector(".start-game-btn")
  startBtn.addEventListener("click", () => {

    document.querySelector(".start-screen").classList.add("started")
    setTimeout(() => {
      document.querySelector(".start-screen").remove();
    }, 500)
    document.querySelector(".text-in-game").classList.add("hide")
    loadMenuContent()

  })
}

function loadMenuContent() {

  // collision check   
  function isCollide(a, b) {
    return !(
      ((a.y + a.height) < (b.y)) ||
      (a.y > (b.y + b.height)) ||
      ((a.x + a.width) < b.x) ||
      (a.x > (b.x + b.width))
  );
}


document.getElementById("ShowSkinChange").addEventListener("click", () => {

  // classes toggle
  document.getElementById("ShowSkinChange").classList.toggle("active-skin-setting")
  document.querySelector(".info-how-to-play").classList.toggle("hide-y")
  document.querySelector(".score-board").classList.toggle("hide-y")
  document.querySelector(".play-btn").classList.toggle("played")
  document.querySelector(".choose-skin-block").classList.toggle("show-skins")

})

// LocalStorage and Settings

const slideValue = document.querySelector(".field .right")
const inputSlider = document.getElementById("volume-setting")
  if (!LS.getItem("volume"))inputSlider.value = 10;
  else inputSlider.value = LS.getItem("volume") * 100;
  if (!LS.getItem("volume")) LS.setItem("volume", inputSlider.value / 100);
    MenuSound.volume = LS.getItem("volume");
    GameSound.volume = LS.getItem("volume");
  
  MenuSound.loop = true;
  MenuSound.currentTime=0;

  const offMenuMusic = document.getElementById("offMenuMusic");
  const GetLocalMusic = LS.getItem("MenuMusic");

  TemplateToCheckLSSettings(offMenuMusic, MenuSound, GetLocalMusic, "MenuMusic")

  const offGameMusic = document.getElementById("offGameMusic");
  const GetLocalGameMusic = LS.getItem("GameMusic");

  if (!GetLocalGameMusic) LS.setItem("GameMusic", false);

  if (GetLocalGameMusic == "true") offGameMusic.checked = true;
  if (GetLocalGameMusic == "false") offGameMusic.checked = false;

  offGameMusic.addEventListener("click", () => {
    if(offGameMusic.checked) LS.setItem("GameMusic", true);
    else LS.setItem("GameMusic", false);
  })

  function TemplateToCheckLSSettings(itemDom, sound, itemLS, itemLSName) {
    if (!itemLS) {
      LS.setItem(itemLSName, false)
      sound.play()
    }
    if (itemLS == "true") {
      sound.pause();
      itemDom.checked = true
    }
    if (itemLS == "false") {
      sound.play();
      itemDom.checked = false
    }
    itemDom.addEventListener("click", () => {
      if(itemDom.checked) {
        sound.pause();
        LS.setItem(itemLSName, true)
      }
      else {
        sound.play();
        LS.setItem(itemLSName, false);
      }
    })
  }

// volume regulation

  

  inputSlider.addEventListener("input", () => {
    let valueVolum = inputSlider.value;
    slideValue.textContent = valueVolum;
    MenuSound.volume = valueVolum / 100;
    GameSound.volume = valueVolum / 100;
    LS.setItem("volume", valueVolum / 100)
  })


  // settings

  document.querySelector(".settings-game").addEventListener("click", () => {
    document.querySelector(".modal-settings-block").classList.toggle("open-sett")
    document.querySelector(".settings-game i").classList.toggle("fa-gear")
    document.querySelector(".settings-game i").classList.toggle("fa-xmark")
  })


  if(!LS.getItem("kindOfShip")) LS.setItem("kindOfShip", objToRender)

  document.getElementById("redBee").addEventListener("click", () => {
    objToRender = "vip ship1";
    LS.setItem("kindOfShip", objToRender)
    fullLoadAndChangeModel();
  })

  document.getElementById("Crusader").addEventListener("click", () => {
    objToRender = "ship";
    LS.setItem("kindOfShip", objToRender)
    fullLoadAndChangeModel();
  })

  document.getElementById("Scarlet").addEventListener("click", () => {
    objToRender = "scarlet";
    LS.setItem("kindOfShip", objToRender)
    fullLoadAndChangeModel();
  })

  document.getElementById("Stripe").addEventListener("click", () => {
    objToRender = "stripe";
    LS.setItem("kindOfShip", objToRender)
    fullLoadAndChangeModel();
  })

  document.getElementById("Wipeout").addEventListener("click", () => {
    objToRender = "wipeout";
    LS.setItem("kindOfShip", objToRender)
    fullLoadAndChangeModel();
  })




  //Load the file
  function fullLoadAndChangeModel() {
  if (objToRender == "ship") {
    loader.load(
      `models/${objToRender}/scene.gltf`,
        function (gltf) {
              shipStart = gltf.scene;
              scene.remove(shipSkin)
              scene.remove(shipScar)
              scene.remove(shipwipeout)
              scene.remove(shipStripe)
              scene.add(shipStart);
              
              document.querySelectorAll(".skin-block").forEach(elem => elem.classList.remove("choosen-skin"))
              document.getElementById("Crusader").classList.add("choosen-skin")
               TemplateSkinChangeAndGamePlay(shipStart)
          }
    )
  }

  if (objToRender == "vip ship1") {
    loader.load(
      `models/${objToRender}/scene.gltf`,
        function (gltf) {
              shipSkin = gltf.scene;
              scene.remove(shipStart)
              scene.remove(shipScar)
              scene.remove(shipwipeout)
              scene.remove(shipStripe)
              scene.add(shipSkin);
              
              document.querySelectorAll(".skin-block").forEach(elem => elem.classList.remove("choosen-skin"))
              document.getElementById("redBee").classList.add("choosen-skin")
              TemplateSkinChangeAndGamePlay(shipSkin)
          }
    )
  }

  if (objToRender == "scarlet") {
    loader.load(
      `models/${objToRender}/scene.gltf`,
        function (gltf) {
              shipScar = gltf.scene;
              scene.remove(shipSkin)
              scene.remove(shipStart)
              scene.remove(shipwipeout)
              scene.remove(shipStripe)
              scene.add(shipScar);
              
              document.querySelectorAll(".skin-block").forEach(elem => elem.classList.remove("choosen-skin"))
              document.getElementById("Scarlet").classList.add("choosen-skin")
               TemplateSkinChangeAndGamePlay(shipScar)
          }
    )
  }

  if (objToRender == "stripe") {
    loader.load(
      `models/${objToRender}/scene.gltf`,
        function (gltf) {
              shipStripe = gltf.scene;
              scene.remove(shipSkin)
              scene.remove(shipStart)
              scene.remove(shipwipeout)
              scene.remove(shipScar)
              scene.add(shipStripe);
              
              document.querySelectorAll(".skin-block").forEach(elem => elem.classList.remove("choosen-skin"))
              document.getElementById("Stripe").classList.add("choosen-skin")
              TemplateSkinChangeAndGamePlay(shipStripe)
          }
    )
  }

  if (objToRender == "wipeout") {
    loader.load(
      `models/${objToRender}/scene.gltf`,
        function (gltf) {
              shipwipeout = gltf.scene;
              scene.remove(shipSkin)
              scene.remove(shipStart)
              scene.remove(shipStripe)
              scene.remove(shipScar)
              scene.add(shipwipeout);
              
              document.querySelectorAll(".skin-block").forEach(elem => elem.classList.remove("choosen-skin"))
              document.getElementById("Wipeout").classList.add("choosen-skin")
              TemplateSkinChangeAndGamePlay(shipwipeout)
          }
    )
  }

}
  fullLoadAndChangeModel()


function addLight() {
  scene.remove(topLight);
  topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
  topLight.position.set(500, 500, 500) //top-left-ish
  topLight.castShadow = true;
  scene.add(topLight);

  scene.remove(ambientLight);
  ambientLight = new THREE.AmbientLight(0x333333, 5);
  scene.add(ambientLight);
}
        
      function TemplateSkinChangeAndGamePlay(obj) {
        let mS = (new THREE.Matrix4()).identity();
        menuStart()

      // rotating ship after time
      const TargetLobbyRotY = -500
      let reqIdk;
      function animateTimeWaitingLobby() {
        if (obj.rotation.y >= TargetLobbyRotY) obj.rotation.y -= 0.002
        if(!document.querySelector(".settings-game").classList.contains("hide")) reqIdk = requestAnimationFrame(animateTimeWaitingLobby);
        else cancelAnimationFrame(reqIdk)
      }


      function menuStart() {
        addLight()
        obj.position.z = objToRender === "scarlet" ? 0.5 : objToRender === "stripe" ? -3 : objToRender == "wipeout" ? -230 : -4;
        obj.position.y = objToRender === "ship" ? -1 : objToRender === "scarlet" ? 0.4 : objToRender === "stripe" ? 1 : 0.8 ;
    
        obj.rotation.x = 0.4
        obj.rotation.y = objToRender === "stripe" ? 2.3 : -1;

        setTimeout(() => animateTimeWaitingLobby(), 1500)

        if(!LS.getItem("546321")) LS.setItem("546321", 0)
        document.querySelector(".text-in-menu").innerHTML = `Balance: <p class="idk-54678">${LS.getItem("546321")}</p><span>$</span>`
      }

      const TargetZSec = -4,
      TargetYSec = objToRender === "ship" ? -1.1 : 1;

      document.querySelector(".back-menu").addEventListener("click", () => {

        gameScore = 0

        // return position

        obj.position.x = 0;
        obj.rotation.y =  -2.1;
        obj.rotation.x = 3.55;

        // animation of comeback

        animateBackToMenu()
        function animateBackToMenu() {
          if (obj.position.z <= TargetZSec) obj.position.z += 0.1;
          if (obj.position.y <= TargetYSec) obj.position.y += 0.1;

          if (obj.position.z <= TargetZSec & obj.position.y <= TargetYSec) requestAnimationFrame(animateBackToMenu);
        }

        // rotating after lose

        const TargetLobbyRotY2 = 500;
        let reqidk2;
        setTimeout(() => animateTimeWaitingLobby2(), 2500)
        function animateTimeWaitingLobby2() {
          if (obj.rotation.y <= TargetLobbyRotY2) obj.rotation.y += 0.002
          if(!document.querySelector(".settings-game").classList.contains("hide")) reqidk2 = requestAnimationFrame(animateTimeWaitingLobby2);
          else cancelAnimationFrame(reqidk2)
        }

        if (GetLocalMusic == "true") MenuSound.pause();
        if (GetLocalMusic == "false") MenuSound.play();


        // flip

        mS.elements[0] += 2;
        mS.elements[10] += 2;
        obj.applyMatrix4(mS);

        // return elements of menu

        document.getElementById("lose").classList.remove("shown")
        document.querySelector(".text-in-menu").classList.remove("hide")
        document.querySelector(".settings-game").classList.remove("hide")
        document.querySelector(".skin-settings-block").classList.remove("hide")
        document.querySelector(".info-how-to-play").classList.remove("hide-y")
        document.querySelector(".score-board").classList.remove("hide-y")
        document.querySelector(".play-btn").style.display = "block"
        setTimeout(() => document.querySelector(".play-btn").classList.remove("played"), 1000)
        
      })


  
      // flip
            
      const TargetZ = -15,
      TargetY =  -12,
      TargetXrot = objToRender === "stripe" ? 1.85 : -1.45;

      // play one more time after lose




      
      document.querySelector(".more-play").addEventListener("click", () => {
        gameScore = 0
        moneyRewardInGame = 0
        document.querySelector(".text-in-game").innerHTML = `Score: ${0}`
        playAnimation()
        document.getElementById("lose").classList.remove("shown")
        document.querySelector(".text-in-menu").classList.remove("hide")
      })

      document.querySelector(".play-btn").addEventListener("click", () => {
        playAnimation()
        mS.elements[0] = objToRender === "stripe" ? 1 : -1;
        mS.elements[10] = objToRender === "stripe" ? 1 : -1;
        obj.applyMatrix4(mS);
        setTimeout(() => document.querySelector(".play-btn").style.display = "none", 500)
      })

      GameSound.volume = 0.2;
      GameSound.loop = true;

      function playAnimation() {

        document.querySelector(".text-in-game").classList.remove("hide")
        document.querySelector(".skin-settings-block").classList.add("hide")
        document.querySelector(".settings-game").classList.add("hide")
        document.querySelector(".info-how-to-play").classList.add("hide-y")
        document.querySelector(".score-board").classList.add("hide-y")

          document.querySelector(".play-btn").classList.add("played")
          MenuSound.pause();
          GameSound.currentTime=0;

          if (GetLocalGameMusic == "true") GameSound.pause();
          
          if (GetLocalGameMusic == "false") GameSound.play();

          // here classes
            if(addScoreInterval) clearInterval(addScoreInterval)
            addScoreInterval = setInterval(() => {
              document.querySelector(".text-in-game").innerHTML = `Score: ${gameScore = gameScore + 1}`
              if (gameScore % 10 == 0) {
                moneyRewardInGame = moneyRewardInGame + 5;
                document.querySelector(".text-in-menu").innerHTML = `Balance: <p class="idk-54678">${parseFloat(LS.getItem("546321")) + 5}</p><span>$</span>`
                LS.setItem("546321", parseFloat(document.querySelector(".idk-54678").textContent))
              }
            }, speedOfAddScore)

            function checkForLoseRemoveScore() {
              if (document.getElementById("lose").classList.contains("shown")) {
                clearInterval(addScoreInterval);
                clearInterval(CheckLoseIntr)  // Check for ending of game, and remove adding score.
              }
            }
            

            if(CheckLoseIntr) clearInterval(CheckLoseIntr)
            CheckLoseIntr = setInterval(() => checkForLoseRemoveScore(), 1000)


  
          animateStart()
          if (gameplayStart)clearTimeout(gameplayStart)
          gameplayStart = setTimeout(() => Gaming(), 1100)
        
      }
  
      function animateStart() {
        if (obj.position.z >= TargetZ) obj.position.z -= 0.1
        if (obj.position.y >= TargetY) obj.position.y -= 0.1
        if (obj.rotation.x >= TargetXrot) obj.rotation.x -= 0.1
        obj.rotation.y = 0

        if (obj.position.z >= TargetZ & obj.position.y >= TargetY & obj.rotation.x >= TargetXrot) requestAnimationFrame(animateStart);
      };
  
      function Gaming() {
        document.body.addEventListener("keyup", shootingKilling)
        const LoseSound = new Audio("./sounds/lose.mp3");
        LoseSound.volume = 0.2;
        LoseSound.loop = false;
  
        function shootingKilling(e) {
            if (e.key == " " ||
                e.code == "Space" ||      
                e.keyCode == 32      
            ) {
              if (arrEn.length) {
                const shootSound = new Audio("./sounds/shoot.wav");
                shootSound.volume = 0.1;
                shootSound.currentTime=0;
                shootSound.play();
                const bullet = document.createElement("div")
                let moving = false;
                bullet.classList.add("bullet")
                arrBul.push(bullet)
                bullet.style.left = posShot.x + 'px'
                document.getElementById("Bullets").appendChild(bullet)
      
                    const BullShoot = [
                      { top: "74%" },
                      { top: "-15%" }
                    ];
                    
                    const BullTiming = {
                      duration: 1000,
                      iterations: 1,
                    };
                    bullet.animate(BullShoot, BullTiming)
                    bullet.addEventListener('transitionend',() => moving = true);
                    function KillingDetect() {
                      let findTryEnemCord = arrEn.map(enem => enem.getBoundingClientRect())
                          for(let i = 0; i < findTryEnemCord.length; i++) {
                            if (isCollide(bullet.getBoundingClientRect(), findTryEnemCord[i])) {
                              arrEn[i].remove()
                              bullet.remove()
                            }
                          }
                      if (!moving) window.requestAnimationFrame(KillingDetect);
                    }
                  KillingDetect();

                  // if (deathDetectEnemy) {
                  //   const enemyDeathSound = new Audio("./sounds/enemy-death.mp3");
                  //   enemyDeathSound.volume = 0.1;
                  //   enemyDeathSound.loop = false;
                  //   enemyDeathSound.play();
                  // }
                      
                  if (bullet.style.top = "-15%") {
                    setTimeout(() => {
                      window.cancelAnimationFrame(KillingDetect);
                      const index = arrBul.indexOf(bullet)
                      arrBul.splice(index, 1)
                      bullet.remove()
                    }, 1100)
                  }
              }
            }
          }
    
        document.addEventListener('mousemove',onMouseMove, false);
    
        // random for enemy    
        
        setTimeout(() => {
          let EnemySpawner = setInterval(() => {
            const randomSpawn = Math.floor(Math.random() * window.innerWidth / 1.1)
            const randomAsteroid = Math.floor(Math.random() * AsteroidArr.length)
            const enemy = document.createElement("div")
            enemy.classList.add("enemy")
            enemy.style.background = `url(${AsteroidArr[randomAsteroid]})`;
            enemy.style.backgroundSize = "cover";
            enemy.style.backgroundPosition = "center"
            arrEn.push(enemy)
            enemy.style.left = randomSpawn + 'px'
            document.getElementById("Enemy").appendChild(enemy)
            enemy.addEventListener("animationend", () => dieOrNo(GameSound))
      
              function dieOrNo(music) {
                music.pause()
                LoseSound.load();
                LoseSound.play();
                arrEn.length = 0;
                arrBul.length = 0;
                enemy.remove()
                document.getElementById("Enemy").innerHTML = '';
                document.body.removeEventListener("keyup", shootingKilling)
                document.removeEventListener('mousemove',onMouseMove, false);
                document.getElementById("lose").classList.add("shown")
                clearInterval(EnemySpawner)

                document.getElementById("score-game").innerHTML = `<span>Score: </span> ${gameScore}`
                document.getElementById("reward-game").innerHTML = `<span>Money Rewarded: </span> + ${moneyRewardInGame}$`
                document.querySelector(".text-in-game").classList.add("hide")
                document.querySelector(".text-in-menu").classList.add("hide")
              }
      
          }, speedOfShoot)
        }, 1000)
       
      }
      function onMouseMove(event) {
        // Update the mouse variable
        event.preventDefault();
        posShot = {
          x: event.clientX,
          y: event.clientY
        }
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      
      // Make the sphere follow the mouse
        let vector = new THREE.Vector3(mouse.x, -0.8, 0);
        vector.unproject( camera );
        let dir = vector.sub( camera.position ).normalize();
        let distance = - 22 / dir.z;
        let pos = camera.position.clone().add(dir.multiplyScalar(distance));
        obj.position.copy(pos);
      };
      }
}


    // Animate the elements
    function animate() {
      requestAnimationFrame(animate);
      render();	
  }
      // Rendering function
      function render() {
    
        // For rendering
        renderer.autoClear = false;
        renderer.clear();
        renderer.render(scene, camera);
      };


  // ls Check on load

  window.addEventListener("load", () => {

    if (LS.getItem("volume")) {
      MenuSound.volume = LS.getItem("volume");
      GameSound.volume = LS.getItem("volume");

      const slideValueLS = document.querySelector(".field .right")
      slideValueLS.textContent = LS.getItem("volume") * 100;
    }
  })

  // loader

  document.addEventListener("DOMContentLoaded", document.querySelector(".loader").classList.add("page-loaded"))
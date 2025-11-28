//TODO - Your ES6 JavaScript code (if any) goes here
import "bootstrap"
let clears = 0
let time = 60
let spawntime = 15
let imgurl = ""
let abletoclick = false

let indiv_timers = []
let initial_scores = [70, 65, 60, 55, 50, 45, 40, 35, 30]

let default_pics = ["https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1457296898342-cdd24585d095?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]

let buttons = document.getElementById("buttons")
let timerDisplay = document.getElementById('time')

function clearCurrentColor(ele) {
    ele.classList.remove('bg-danger');
    ele.classList.remove('bg-success');
    ele.classList.remove('bg-dark');
    ele.classList.remove('bg-warning');
    ele.classList.remove('bg-secondary');
    ele.classList.remove('bg-info');
}

function clickAttempt(btn) {
    if (abletoclick) {
        if (!(btn.classList.contains("opacity-0"))) {
            if (btn.classList.contains("bg-warning")) {
                clears+= 2
            }
            else if (btn.classList.contains("bg-danger")) {
                clears--
            }
            else {
                clears++  
            }
            indiv_timers[(Number(btn.id.split('bt').pop()))-1] = false
            btn.classList.add("opacity-0")
            document.getElementById('score').innerHTML="Score: " + clears;
        }
    }
}

function useDefault(event) {
    imgurl = default_pics[Math.floor(Math.random() * default_pics.length)]
    startGame(event)
}

function startGame(event) {
    event.preventDefault()
    if (imgurl == "") {
        if (document.querySelector("#img").value != "") {
            imgurl = document.querySelector("#img").value
        }
        else {
            alert("Please enter an image URL.")
            return
        }
    }
    document.getElementById('score').innerHTML="Score: " + clears;
    let buttonHTML = ``
    for (let i = 1; i <= 36; i++) {
        buttonHTML += `
        <div class="bg-dark rounded py-2 bg-cover overflow-hidden opacity-0 bt" draggable="true" id="c${i}">
            <img src="${imgurl}" alt="your image here" class="rounded" id="i${i}">
        </div>`
        indiv_timers.push(0)
    }
    buttons.innerHTML = buttonHTML
    document.querySelector('#myForm').classList.add("d-none")
    document.querySelectorAll(".bt").forEach(function(btn) {
        btn.onclick = function() {
            clickAttempt(btn)
        }
        btn.addEventListener("dragstart", () =>
            clickAttempt(btn)
          )
    })
    abletoclick = true
    alert("Click on the images to get points. Gold-tinted ones are worth double, while red-tinted ones remove a point.")
    timer()
    blockSpawn(500)
}

function stopGame() {
    abletoclick = false
    buttons.classList.remove("row-cols-" + 6)
    buttons.classList.add("row-cols-" + 1)
    buttons.innerHTML = `<div class="text-center fs-1">Game Over</div>`
    alert("time is up. You got a score of " + clears + ".")
    addScore()
}

function addScore() {
    let scores = getScores()
    scores.sort(function(a, b){return a - b})
    scores.reverse()

    for (let n of scores) {
        if (clears >= n) {
            scores.push(clears)
            scores.sort(function(a, b){return a - b})
            scores.reverse()
            if (scores.length > 9) {
                while (scores.length > 9) {
                    scores.pop()
                }
            }
            localStorage.setItem('ImageScores', JSON.stringify(scores))
            break;
        }
    }

    displayScores()
}


function getScores() {
    if (localStorage.getItem('ImageScores') && localStorage.getItem('ImageScores') != "[]") {
        return JSON.parse(localStorage.getItem('ImageScores'))
    }
    else {
        return initial_scores
    }
}

function displayScores() {
    let scores = getScores()
    let scores_html = `
    <div class="fs-1">Game Over</div>
    <button type="button" class="w-75 w-lg-50 mx-auto fs-1 btn bg-danger text-light" id="reload">
        Play Again
    </button>
    <h3 class="mt-3">High Scores:</h3>
    <div class="card p-0 mx-auto" style="width: 18rem;">
        <div class="card-header bg-warning text-light">
            Whack-A-Image
        </div>
        <ul class="list-group list-group-flush">`
    let index = 1

    for (let n of scores) {
        if (n == clears) {
            scores_html += `<li class="list-group-item text-success">${index}. ${n}</li>`
        }
        else {
            scores_html += `<li class="list-group-item">${index}. ${n}</li>`
        }
        index++
    }
    scores_html += `</ul></div><br><a href="./index.html" class="btn btn-primary my-3">Return to home page</a>`
    buttons.innerHTML = scores_html

    document.getElementById("reload").onclick = function() {
        location.reload()
    }
}

function timer(){
    var tim = setInterval(function(){
        timerDisplay.innerHTML="Time left: " + time;
        time--
        spawntime--
        if (time < 0) {
            clearInterval(tim);
            if (abletoclick == true) {
                stopGame()
                return;
            }
        }
    }, 1000);
}

function blockSpawn(interval) {
    var spawn = setInterval(function(){
        if (Math.floor(Math.random() * 2)) {
            let turnOn = Math.floor(Math.random() * 36) + 1
            let inde = document.querySelector('#c'+turnOn.toString())
            if (inde.classList.contains("opacity-0")) {
                inde.classList.remove("opacity-0")
                if (time < 50) {
                    clearCurrentColor(inde)
                    let ig = document.querySelector('#i'+turnOn.toString())
                    switch (Math.floor(Math.random() * 5)) {
                        case 0:
                            indiv_timers[turnOn.toString()-1] = 4
                            inde.classList.add("bg-warning")
                            ig.classList.add("opacity-50")
                            break;
                        case 1:
                            indiv_timers[turnOn.toString()-1] = 5
                            inde.classList.add("bg-danger")
                            ig.classList.add("opacity-50")
                            break;
                        default:
                            indiv_timers[turnOn.toString()-1] = 5
                            inde.classList.add("bg-dark")
                            ig.classList.remove("opacity-50")
                    }
                }
                else {
                    indiv_timers[turnOn.toString()-1] = 5
                }
            }
        }
        if (time <= 0) {
            clearInterval(spawn);
            return;
        }
        if (spawntime <= 0) {
            clearInterval(spawn);
            spawntime = 15
            blockSpawn(interval - 100)
        }
        for (let i = 0; i < indiv_timers.length; i++) {
            if (indiv_timers[i] > 0) {
                indiv_timers[i]--
            }
            if (indiv_timers[i] <= 0) {
                let ele = document.querySelector('#c'+(i+1))
                if (!(ele.classList.contains("opacity-0"))) {
                    ele.classList.add("opacity-0")
                }
            }
        }
    }, interval)
}

document.querySelector('#myForm').onsubmit = startGame
document.querySelector('.to-default').onclick = useDefault
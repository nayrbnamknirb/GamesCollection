//TODO - Your ES6 JavaScript code (if any) goes here
import "bootstrap"
let time = 150
let gameGoing = true

//0=red (danger), 1=yellow (warning), 2=green (success), 3=cyan (info), 4=blue (primary), 5-black (dark)
let colorList = {0: "bg-danger", 1: "bg-warning", 2: "bg-success", 3: "bg-info", 4: "bg-primary", 5: "bg-dark"}
let canClick = false

let matchData = []
let colorData = []

let initial_scores = [100, 95, 90, 85, 80, 75, 70, 65, 60]

let match = document.getElementById("match")
let buttons = document.getElementById("buttons")
let timerDisplay = document.getElementById('time')

function clickAttempt(button) {
    if (canClick == true) {
        canClick = false
        var num = Number(button.id.split('bt').pop());
        colorData[num - 1] += 1
        if (colorData[num - 1] > 5) {
            colorData[num - 1] = 0
        }
        clearCurrentColor(button)
        button.classList.add(colorList[colorData[num - 1]])
        canClick = true
        for (let i = 0; i < matchData.length; i++) {
            if (matchData[i] != colorData[i]) {
                return
            }
        }
        setTimeout(() => {
            alert("Success! You got a time score of " + time + ".")
            gameGoing = false
            stopGame()
        }, 250);
    }
}

function clearCurrentColor(ele) {
    ele.classList.remove('bg-danger');
    ele.classList.remove('bg-success');
    ele.classList.remove('bg-primary');
    ele.classList.remove('bg-warning');
    ele.classList.remove('bg-dark');
    ele.classList.remove('bg-info');
}

function clearColCount(ele) {
    ele.classList.remove('row-cols-1')
    ele.classList.remove('row-cols-2')
    ele.classList.remove('row-cols-3')
    ele.classList.remove('row-cols-4')
    ele.classList.remove('row-cols-5')
    ele.classList.remove('row-cols-6')
}

function createButtons() {
    let loopTime = 36
    let yPad = 4
   
    buttons.innerHTML = ""
    match.innerHTML = ""
    var htm = ""
    for (var i = 1; i <= loopTime; i++) {
        matchData[i-1] = Math.floor(Math.random() * 6);
        match.innerHTML += `<div class="${colorList[matchData[i-1]]} px-3 py-3 rounded" id="m${i}"></div>`
        let pickedColor = Math.floor(Math.random() * 6);
        colorData[i-1] = pickedColor
        htm = `<button type="button" class="btn ${colorList[pickedColor]} py-${yPad} bt" id="bt${i}"></button>`
        buttons.insertAdjacentHTML("beforeend", htm);
    }
    document.querySelectorAll(".bt").forEach(function(btn) {
        btn.onclick = function() {
            clickAttempt(btn)
        }
    })
    canClick = true
}

createButtons()

function stopGame() {
    canClick = false
    clearColCount(buttons)
    buttons.classList.add("row-cols-" + 1)
    buttons.innerHTML = `<div class="text-center fs-1">Game Over</div>`
    match.innerHTML = ``
    addScore()
}

function addScore() {    
    let scores = getScores()
    scores.sort(function(a, b){return a - b})
    scores.reverse()

    if (time > 140) {
        displayScores()
        return;
    }
    for (let n of scores) {
        if (time >= n) {
            scores.push(time)
            scores.sort(function(a, b){return a - b})
            scores.reverse()
            if (scores.length > 9) {
                while (scores.length > 9) {
                    scores.pop()
                }
            }
            localStorage.setItem('PictureScores', JSON.stringify(scores))
            break;
        }
    }

    displayScores()
}


function getScores() {
    if (localStorage.getItem('PictureScores') && localStorage.getItem('PictureScores') != "[]") {
        return JSON.parse(localStorage.getItem('PictureScores'))
    }
    else {
        return initial_scores
    }
}

function displayScores() {
    let scores = getScores()
    let scores_html = `
    <div class="fs-1">Game Over</div>
    <button type="button" class="w-75 w-lg-50 mx-auto fs-1 btn bg-info text-dark" id="reload">
        Play Again
    </button>
    <h3 class="mt-3">High Scores:</h3>
    <div class="card p-0 mx-auto" style="width: 18rem;">
        <div class="card-header bg-success text-light">
            Picture Match
        </div>
        <ul class="list-group list-group-flush">`
    let index = 1

    for (let n of scores) {
        if (n == time) {
            scores_html += `<li class="list-group-item text-warning">${index}. ${n}</li>`
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
        time--;
        if (gameGoing == false) {
            clearInterval(tim);
        }
        if (time < 0) {
            clearInterval(tim);
            alert("Time up! You did not match the picture in time.")
            stopGame()
            return;
        }
    }, 1000);
}
alert("Match the bottom picture with the top one. Click on colors to cycle through them.")
window.onload = timer
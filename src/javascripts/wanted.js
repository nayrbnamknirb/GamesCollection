//TODO - Your ES6 JavaScript code (if any) goes here
import "bootstrap"
let clears = 0
let time = 60

//0=red (danger), 1=blue (primary), 2=green (success), 3=yellow (warning), 4=grey (secondary), 5-cyan (info)
let colorList = {0: "bg-danger", 1: "bg-primary", 2: "bg-success", 3: "bg-warning", 4: "bg-secondary", 5: "bg-info"}
let currentColor = 0
let canClick = false

let buttonToClick = "bt1"

let initial_scores = [42, 39, 37, 33, 29, 0, 0, 0, 0]

let colorInfo = document.getElementById("color")
let buttons = document.getElementById("buttons")
let timerDisplay = document.getElementById('time')

function clickAttempt(button) {
    if (canClick == true) {
        canClick = false
        if (button == buttonToClick) {
            //time += 2
            timerDisplay.classList.add("text-success")
            clears++
            timerDisplay.classList.remove("text-success")
            clearCurrentColor(colorInfo)
            createButtons()    
        }
        else {
            alert("Wrong square. -5 seconds to timer")
            time -= 5
            if (time < -1) {time = -1}
            createButtons()
        }
    }
}

function clearCurrentColor(ele) {
    ele.classList.remove('bg-danger');
    ele.classList.remove('bg-success');
    ele.classList.remove('bg-primary');
    ele.classList.remove('bg-warning');
    ele.classList.remove('bg-secondary');
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
    document.getElementById('score').innerHTML="Score: " + clears;
    let loopTime = 9
    let yPad = 5
    let cols = 3
    if (clears >= 40) {
        loopTime = 48
        cols = 6
        yPad = 4
    }
    else if (clears >= 32) {
        loopTime = 42
        cols = 6
        yPad = 4
    }
    else if (clears >= 24) {
        loopTime = 36
        cols = 6
        yPad = 4
    }
    else if (clears >= 16) {
        loopTime = 25
        cols = 5
    }
    else if (clears >= 8) {
        loopTime = 16
        cols = 4
    }
    currentColor = Math.floor(Math.random() * 6);
    buttonToClick = "bt" + (Math.floor(Math.random() * loopTime) +1)
    clearCurrentColor(colorInfo)
    colorInfo.classList.add(colorList[currentColor])
    buttons.innerHTML = ""
    var htm = ""
    clearColCount(buttons)
    buttons.classList.add("row-cols-" + cols)
    for (var i = 1; i <= loopTime; i++) {
        if (buttonToClick == "bt" + (i)) {
            htm = `<button type="button" class="btn ${colorList[currentColor]} py-${yPad} bt" id="bt${i}"></button>`
        }
        else {
            let pickedColor = Math.floor(Math.random() * 5);
            if (pickedColor >= currentColor) {
                pickedColor++
            }
            htm = `<button type="button" class="btn ${colorList[pickedColor]} py-${yPad} bt" id="bt${i}"></button>`
        }
        buttons.insertAdjacentHTML("beforeend", htm);
    }
    document.querySelectorAll(".bt").forEach(function(btn) {
        btn.onclick = function() {
            clickAttempt(btn.id)
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
            localStorage.setItem('WantedScores', JSON.stringify(scores))
            break;
        }
    }

    displayScores()
}


function getScores() {
    if (localStorage.getItem('WantedScores') && localStorage.getItem('WantedScores') != "[]") {
        return JSON.parse(localStorage.getItem('WantedScores'))
    }
    else {
        return initial_scores
    }
}

function displayScores() {
    let scores = getScores()
    let scores_html = `
    <div class="fs-1">Game Over</div>
    <button type="button" class="w-75 w-lg-50 mx-auto fs-1 btn bg-light text-dark" id="reload">
        Play Again
    </button>
    <h3 class="mt-3">High Scores:</h3>
    <div class="card p-0 mx-auto" style="width: 18rem;">
        <div class="card-header bg-danger text-light">
            Wanted Color
        </div>
        <ul class="list-group list-group-flush">`
    let index = 1

    for (let n of scores) {
        if (n == clears) {
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
        if (time < 0) {
            clearInterval(tim);
            if (canClick == true) {
                stopGame()
            }
        }
    }, 1000);
}
alert("Catch as many wanted colors as possible in 1 minute. Click on the color button to catch it. More squares are added as time continues.")
window.onload = timer
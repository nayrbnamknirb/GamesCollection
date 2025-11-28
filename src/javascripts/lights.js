//TODO - Your ES6 JavaScript code (if any) goes here
import "bootstrap"
let clears = 0
let attempts = 1
let lives = 3
let abletoclick = false

let colorList = {0: "bg-primary", 1: "bg-info"}
let matchData = []
let lightData = []
let listOfClicks = []
let xDim = 5
let yDim = 5

let initial_scores = [10, 9, 7, 5, 4, 0, 0, 0, 0]

let buttons = document.getElementById("buttons")
let match = document.getElementById("match")

function clearColors(element) {
    element.classList.remove("bg-primary")
    element.classList.remove("bg-info")
}

function clearColCount(ele) {
    ele.classList.remove('row-cols-1')
    ele.classList.remove('row-cols-2')
    ele.classList.remove('row-cols-3')
    ele.classList.remove('row-cols-4')
    ele.classList.remove('row-cols-5')
    ele.classList.remove('row-cols-6')
}

function toggleButton(element, num) {
    clearColors(element)
    lightData[num-1] = (lightData[num-1] == 0 && 1 || 0)
    element.classList.add(colorList[lightData[num-1]])
    element.innerHTML = (lightData[num-1] == 0 && "X" || "O")
}

function clickAttempt(id) {
    document.getElementById('lives').innerHTML="Lives: " + lives
    var num = Number(id.split('bt').pop());
    toggleButton(document.getElementById(`bt` + (num).toString()), num)
    if (num-1 > 0 && (num-1) % xDim != 0) {
        toggleButton(document.getElementById(`bt` + (num-1).toString()), num-1)
    }
    if (num+1 <= lightData.length && num % xDim != 0) {
        toggleButton(document.getElementById(`bt` + (num+1).toString()), num+1)
    }
    if (num-yDim > 0) {
        toggleButton(document.getElementById(`bt` + (num-yDim).toString()), num-yDim)
    }
    if (num+yDim <= lightData.length) {
        toggleButton(document.getElementById(`bt` + (num+yDim).toString()), num+yDim)
    }
    if (abletoclick == true) {
        listOfClicks.push(num)
        attempts--
        document.getElementById('attempts').innerHTML = attempts.toString()
        var count = 0
        for (var i = 0; i < xDim * yDim; i++) {
            if (matchData[i] == lightData[i]) {
                count++
            }
        }
        if (count >= xDim * yDim) {
            setTimeout(() => {
                alert("Correct!")
                clears++
                listOfClicks = []
                lives = 3
                createButtons()
            }, 400);
            return;
        }
        if (attempts <= 0) {
            abletoclick = false
            for (var j = 0; j < xDim * yDim; j++) {
                if (matchData[j] != lightData[j]) {
                    setTimeout(() => {
                        alert("Incorrect actions made. Re-starting the lights.")
                        abletoclick = false
                        while (listOfClicks.length > 0) {
                            var d = "bt" + listOfClicks[listOfClicks.length - 1]
                            clickAttempt(d)
                            listOfClicks.pop()
                            attempts++
                        }
                        document.getElementById('attempts').innerHTML = attempts.toString()
                        lives--
                        document.getElementById('lives').innerHTML="Lives: " + lives
                        if (lives <= 0) {
                            stopGame()
                            return
                        }
                        abletoclick = true
                    }, 400);
                    return;
                }
            }
            alert("Correct!")
        }
    }
}

function createButtons() {
    document.getElementById('score').innerHTML="Score: " + clears;
    let loopTime = 25
    let yPad = 4
    let rows = 5
    let cols = 5
    let tries = 1

    if (clears >= 20) {
        loopTime = 36
        rows = 6
        cols = 6
        tries = 4
    }
    else if (clears >= 15) {
        loopTime = 36
        rows = 6
        cols = 6
        tries = 3
    }
    else if (clears >= 10) {
        tries = 3
    }
    else if (clears >= 5) {
        tries = 2
    }

    buttons.innerHTML = ""
    match.innerHTML = ""
    var htm = ""
    clearColCount(buttons)

    for (var i = 0; i < loopTime; i++) {
        lightData[i] = Math.floor(Math.random() * 2);
        matchData[i] = lightData[i]
    }    

    xDim = rows
    yDim = cols

    buttons.classList.add("row-cols-" + cols)
    match.classList.add("row-cols-" + cols)
    for (var j = 1; j <= loopTime; j++) {
        htm = `<button type="button" class="fs-1 btn ${colorList[lightData[j-1]]} py-${yPad} bt" id="bt${j}">${lightData[j-1] == 0 && "X" || "O"}</button>`
        buttons.insertAdjacentHTML("beforeend", htm);
        match.innerHTML += `<div class="${colorList[lightData[j-1]]} px-3 py-3 rounded" id="m${j}"></div>`
    }
    document.querySelectorAll(".bt").forEach(function(btn) {
        btn.onclick = function() {
            clickAttempt(btn.id)
        }
    })
    abletoclick = false
    for (var k = 1; k <= tries; k++) {
        clickAttempt("bt" + (Math.floor(Math.random() * loopTime)+1))
    }
    attempts = tries
    document.getElementById('attempts').innerHTML = attempts.toString()
    lives = 3
    abletoclick = true
}

function stopGame() {
    abletoclick = false
    clearColCount(buttons)
    buttons.classList.add("row-cols-" + 1)
    buttons.innerHTML = `<div class="text-center fs-1">Game Over</div>`
    match.innerHTML = ""
    alert("All lives have been used up. You got a score of " + clears + ".")
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
            localStorage.setItem('LightScores', JSON.stringify(scores))
            break;
        }
    }

    displayScores()
}


function getScores() {
    if (localStorage.getItem('LightScores') && localStorage.getItem('LightScores') != "[]") {
        return JSON.parse(localStorage.getItem('LightScores'))
    }
    else {
        return initial_scores
    }
}

function displayScores() {
    let scores = getScores()
    let scores_html = `
    <div class="fs-1">Game Over</div>
    <button type="button" class="w-75 w-lg-50 mx-auto fs-1 btn bg-dark text-light" id="reload">
        Play Again
    </button>
    <h3 class="mt-3">High Scores:</h3>
    <div class="card p-0 mx-auto" style="width: 18rem;">
        <div class="card-header bg-primary text-light">
            Light Switch
        </div>
        <ul class="list-group list-group-flush">`
    let index = 1

    for (let n of scores) {
        if (n == clears) {
            scores_html += `<li class="list-group-item text-primary">${index}. ${n}</li>`
        }
        else {
            scores_html += `<li class="list-group-item">${index}. ${n}</li>`
        }
        index++
    }
    scores_html += `</ul></div><br><a href="./index.html" class="btn btn-info my-3">Return to home page</a>`
    buttons.innerHTML = scores_html

    document.getElementById("reload").onclick = function() {
        location.reload()
    }
}

alert("Set the lights on the bottom to match the top. Every square clicked also toggles the 4 surrounding squares.")
createButtons()
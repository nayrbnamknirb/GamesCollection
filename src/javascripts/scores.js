//TODO - Your ES6 JavaScript code (if any) goes here
import "bootstrap"

let colorList = {0: "bg-danger", 1: "bg-primary", 2: "bg-warning", 3: "bg-success"}

let wanted_initial_scores = [42, 39, 37, 33, 29, 0, 0, 0, 0]
let lights_initial_scores = [10, 9, 7, 5, 4, 0, 0, 0, 0]
let image_initial_scores = [70, 65, 60, 55, 50, 45, 40, 35, 30]
let picture_initial_scores = [100, 95, 90, 85, 80, 75, 70, 65, 60]

let scoreNames = {0: "WantedScores", 1: "LightScores", 2: "ImageScores", 3: "PictureScores"}
let gameNames = {0: "Wanted Color", 1: "Light Switch", 2: "Whack-A-Image", 3: "Picture Match"}

function resetScore(id) {
    var scoreIndex = Number(id.split('bt').pop());
    if (confirm("WARNING: Are you sure you want to reset your scores for " + gameNames[scoreIndex] + "? This cannot be undone.")) {
        localStorage.removeItem(scoreNames[scoreIndex])
        location.reload()
    }
}

function displayScores(scoreIndex) {
    let scores = []
    if (localStorage.getItem(scoreNames[scoreIndex]) && localStorage.getItem(scoreNames[scoreIndex]) != "[]") {
        scores = JSON.parse(localStorage.getItem(scoreNames[scoreIndex]))
    }
    else {
        switch (scoreIndex) {
            case 0:
                scores = wanted_initial_scores
                break;
            case 1:
                scores = lights_initial_scores
                break;
            case 2:
                scores = image_initial_scores
                break;
            case 3:
                scores = picture_initial_scores
                break;
        }
    }
    let scores_html = `
        <div class="card mx-auto" style="width: 18rem;">
        <div class="card-header text-white ${colorList[scoreIndex]}">
            ${gameNames[scoreIndex]} High scores
        </div>
        <ul class="list-group list-group-flush">
            `
    let index = 1

    for (let n of scores) {
        scores_html += `<li class="list-group-item">${index}. ${n}</li>`
        index++
    }
    scores_html += `</ul></div><button class="btn bt bg-dark text-light reset mb-3" id="bt${scoreIndex}">Reset scores for ${gameNames[scoreIndex]}</button>`
    document.getElementById(scoreNames[scoreIndex]).innerHTML = scores_html
    document.querySelectorAll(".reset").forEach(function(btn) {
        btn.onclick = function() {
            resetScore(btn.id)
        }
    })
}

for (let i = 0; i < 4; i++) {
    displayScores(i)
}
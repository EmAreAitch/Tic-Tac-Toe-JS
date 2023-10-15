let Game
const x_mark_class = "fa-xmark"
const o_mark_class = 'fa-circle'
const x_animate_class = "fa-shake"
const o_animate_class = "fa-bounce"
const main_game = document.querySelector(".main-game")
const board = main_game.querySelector("table")
const cells = Array.from(board.querySelectorAll("td"))
const cellIcons = board.querySelectorAll("i")
const defaultIconClassList = cellIcons[0].classList.value
const Players = Array.from(main_game.querySelectorAll(".playerName"))
const notification = main_game.querySelector(".notification")
const boxes = Array.from(main_game.querySelectorAll(".box"))
const scores = main_game.querySelectorAll(".score")
const name_pattern = RegExp(/^[0-9A-Za-z]+( [0-9A-Za-z]+)*$/)

if(window.innerWidth >= 768) {
    Players.forEach((player) => {
        player.classList.remove("is-small")
        player.classList.add("is-large")
    })
}

let winner = undefined
let notReadyNotice = false

function readyPlayer(e) {
    element = e.currentTarget
    validateName = Players.every(player => name_pattern.test(player.value))
    if (!notReadyNotice) {
        if (validateName) {
            notification.removeEventListener('click', readyPlayer)
            element.classList.toggle("is-danger")
            element.classList.toggle("is-primary")
            board.removeEventListener('click', notReadyAlert)
            beginGame()
        } else {
            notification.textContent = "INVALID PLAYER NAME"
            notReadyNotice = true
            setTimeout(() => {
                notification.textContent = `READY`
                notReadyNotice = false
            }, 2000)
        }
    }
}

function beginGame() {
    Players.forEach((player) => player.disabled = true)
    notification.textContent = "GAME BEGINS!!!"
    Player1 = {
        name: Players[0].value,
        markerClass: x_mark_class,
        animateClass: x_animate_class
    }
    Player2 = {
        name: Players[1].value,
        markerClass: o_mark_class,
        animateClass: o_animate_class
    }
    Game = GameBoard(Player1, Player2)
    boxes[0].classList.toggle("has-border-golden")
    board.addEventListener('click', mark)
}


function mark(e) {
    let cell = e.target.closest("td")
    let board_index = cells.indexOf(cell)
    let icon = cellIcons[board_index]
    let player = Game.playerAtIndex(board_index)
    if (player == undefined) {
        let class_to_add = Game.getCurrentPlayer().getMarkerClass()
        Game.mark(board_index)
        icon.classList.add(class_to_add)
        checkWin()
        checkDraw()
        boxes.forEach(box => box.classList.toggle("has-border-golden"))
    } else {
        let class_to_add = player.getAnimateClass()
        icon.classList.add(class_to_add)
        setTimeout(() => {
            icon.classList.remove(class_to_add)
        }, 500)
    }

}

function checkDraw() {
    if (Game.isDraw()) {
        board.removeEventListener('click', mark)
        boxes.forEach(box => box.classList.remove("has-border-golden"))
        notification.classList.toggle("is-primary")
        notification.classList.toggle("is-info")
        notification.textContent = `GAME IS DRAW!!! Click to restart`
        notification.addEventListener('click', restartGame)
    }
}


function checkWin() {
    winner = Game.getWinner()
    if (winner) {
        board.removeEventListener('click', mark)
        index = boxes.findIndex(box => box.classList.contains("has-border-golden"))
        scores[index].textContent = +(scores[index].textContent) + 1
        boxes.forEach(box => box.classList.toggle("has-border-golden"))
        notification.textContent = `${winner.getName()} WON!!! Click to restart`
        celebrate_class = winner.getAnimateClass()
        winner.winningPath.forEach(index => {
            cellIcons[index].classList.add(celebrate_class)
        })
        notification.addEventListener('click', restartGame)
    }
}

function restartGame() {
    if (winner) {
    celebrate_class = winner.getAnimateClass()
    winner.winningPath.forEach(index => {
        cellIcons[index].classList.remove(celebrate_class)
    })
}
    Players.forEach((player) => player.disabled = false)
    notification.classList.remove("is-info")
    notification.classList.remove("is-primary")
    notification.classList.add("is-danger")
    notification.textContent = "READY"
    notification.removeEventListener('click', restartGame)
    notification.addEventListener('click', readyPlayer)

    cellIcons.forEach(icon => icon.className = defaultIconClassList)
    board.addEventListener('click', notReadyAlert)
    boxes.forEach(box => box.classList.remove("has-border-golden"))
}

function notReadyAlert() {
    if (notReadyNotice == false) {
        notification.textContent = `BOTH PLAYER MUST GET READY`
        notReadyNotice = true
        setTimeout(() => {
            notReadyNotice = false
            notification.textContent = `READY`
        }, 2000)

    }
}

notification.addEventListener('click', readyPlayer)

board.addEventListener('click', notReadyAlert)



function Player(name, marker, markerClass, animateClass) {
    const name_pattern = RegExp(/^[0-9A-Za-z]+( [0-9A-Za-z]+)*$/)
    name = name.trim()
    if (!(name && name_pattern.test(name))) return false
    let playerName = name
    let playerMarker = marker
    let playerMarkerClass = markerClass
    let playerAnimateClass = animateClass
    function getName() {
        return playerName
    }
    function getMarker() {
        return playerMarker
    }
    function setName(name) {
        if (name && name_pattern.test(name)) {
            playerName = name
            return true
        } else {
            return false
        }
    }
    function getMarkerClass() {
        return playerMarkerClass
    }
    function getAnimateClass() {
        return playerAnimateClass
    }
    return {
        getName, getMarker, setName, getMarkerClass, getAnimateClass
    };
}

function GameBoard(Player1, Player2) {
    const PlayerX = Player(Player1.name, "X", Player1.markerClass, Player1.animateClass)
    const PlayerO = Player(Player2.name, "O", Player2.markerClass, Player2.animateClass)
    if (PlayerX && PlayerO) {
        let winner = undefined
        const Players = [PlayerX, PlayerO]
        let board_pos = Array(9).fill()
        let currentPlayer = 0
        let turnsCount = 0
        let jump_index, isMarked, leftDiagonal, rightDiagonal
        let winning_path = undefined
        function mark(index) {
            if (board_pos[index] != undefined) return false
            board_pos[index] = Players[currentPlayer]
            turnsCount++
            if (turnsCount >= 5) {
                checkWinner(index)
            }
            currentPlayer = (currentPlayer + 1) % 2
            return true
        }

        function checkWinner(index) {   
            if (checkHorizontal(index) || checkVertical(index) || checkDiagonal(index)) {
                winner = Players[currentPlayer]
                winner.winningPath = winning_path
            }

        }

        function checkHorizontal(index) {
            index = ((index / 3) | 0) * 3
            isMarked = board_pos[index] === board_pos[index + 1] && board_pos[index + 1] === board_pos[index + 2]
            if (isMarked) 
                winning_path = [index, index+1, index + 2]
            return isMarked
        }
        function checkVertical(index) {
            index %= 3
            isMarked = board_pos[index] === board_pos[index + 3] && board_pos[index + 3] === board_pos[index + 6]
            if (isMarked) 
                winning_path = [index, index+3, index + 6]
            return isMarked
        }

        function checkDiagonal(index) {
            if (index % 2 === 0) {
                if (index === 4) {
                    leftDiagonal = (board_pos[0] === board_pos[4] && board_pos[4] === board_pos[8])
                    rightDiagonal = (board_pos[2] === board_pos[4] && board_pos[4] === board_pos[6])
                    if (leftDiagonal) 
                        winning_path = [0,4,8]
                    else if (rightDiagonal)
                        winning_path = [2,4,6]
                    return  leftDiagonal || rightDiagonal
                }
                jump_index = index % 8 === 0 ? 4 : 2
                isMarked = board_pos[4 - jump_index] === board_pos[4] && board_pos[4] === board_pos[4 + jump_index]
                if (isMarked) 
                    winning_path = [4- jump_index, 4 , 4+jump_index]
                return isMarked

            }
            return false
        }

        function getWinner() {
            return winner
        }
        function playerAtIndex(index) {
            return board_pos[index]
        }
        function isDraw() {
            if (!getWinner()) 
                return board_pos.every(index => index != undefined)
            else return false
        }
        function getCurrentPlayer() {
            return Players[currentPlayer]
        }
        return { mark, getWinner, getCurrentPlayer, playerAtIndex, isDraw}
    }
    return false
}
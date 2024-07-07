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
                winning_path = [index, index + 1, index + 2]
            return isMarked
        }

        function checkVertical(index) {
            index %= 3
            isMarked = board_pos[index] === board_pos[index + 3] && board_pos[index + 3] === board_pos[index + 6]
            if (isMarked)
                winning_path = [index, index + 3, index + 6]
            return isMarked
        }

        function checkDiagonal(index) {
            if (index % 2 === 0) {
                if (index === 4) {
                    leftDiagonal = (board_pos[0] === board_pos[4] && board_pos[4] === board_pos[8])
                    rightDiagonal = (board_pos[2] === board_pos[4] && board_pos[4] === board_pos[6])
                    if (leftDiagonal)
                        winning_path = [0, 4, 8]
                    else if (rightDiagonal)
                        winning_path = [2, 4, 6]
                    return leftDiagonal || rightDiagonal
                }
                jump_index = index % 8 === 0 ? 4 : 2
                isMarked = board_pos[4 - jump_index] === board_pos[4] && board_pos[4] === board_pos[4 + jump_index]
                if (isMarked)
                    winning_path = [4 - jump_index, 4, 4 + jump_index]
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

        function findBestMove() {
            let bestVal = -Infinity;
            let bestMove = -1;

            for (let i = 0; i < board_pos.length; i++) {
                if (board_pos[i] === undefined) {
                    board_pos[i] = Players[currentPlayer];
                    let moveVal = minimax(0, false);
                    board_pos[i] = undefined;

                    if (moveVal > bestVal) {
                        bestMove = i;
                        bestVal = moveVal;
                    }
                }
            }
            return bestMove;
        }

        function minimax(depth, isMaximizing) {
            let score = evaluate();

            if (score === 10) return score - depth;
            if (score === -10) return score + depth;
            if (isDraw()) return 0;

            if (isMaximizing) {
                let best = -Infinity;

                for (let i = 0; i < board_pos.length; i++) {
                    if (board_pos[i] === undefined) {
                        board_pos[i] = Players[currentPlayer];
                        best = Math.max(best, minimax(depth + 1, false));
                        board_pos[i] = undefined;
                    }
                }
                return best;
            } else {
                let best = Infinity;
                let opponent = (currentPlayer + 1) % 2;

                for (let i = 0; i < board_pos.length; i++) {
                    if (board_pos[i] === undefined) {
                        board_pos[i] = Players[opponent];
                        best = Math.min(best, minimax(depth + 1, true));
                        board_pos[i] = undefined;
                    }
                }
                return best;
            }
        }

        function evaluate() {
            for (let row = 0; row < 3; row++) {
                if (board_pos[row * 3] === board_pos[row * 3 + 1] && board_pos[row * 3 + 1] === board_pos[row * 3 + 2]) {
                    if (board_pos[row * 3] === Players[currentPlayer]) return 10;
                    else if (board_pos[row * 3] === Players[(currentPlayer + 1) % 2]) return -10;
                }
            }

            for (let col = 0; col < 3; col++) {
                if (board_pos[col] === board_pos[col + 3] && board_pos[col + 3] === board_pos[col + 6]) {
                    if (board_pos[col] === Players[currentPlayer]) return 10;
                    else if (board_pos[col] === Players[(currentPlayer + 1) % 2]) return -10;
                }
            }

            if (board_pos[0] === board_pos[4] && board_pos[4] === board_pos[8]) {
                if (board_pos[0] === Players[currentPlayer]) return 10;
                else if (board_pos[0] === Players[(currentPlayer + 1) % 2]) return -10;
            }

            if (board_pos[2] === board_pos[4] && board_pos[4] === board_pos[6]) {
                if (board_pos[2] === Players[currentPlayer]) return 10;
                else if (board_pos[2] === Players[(currentPlayer + 1) % 2]) return -10;
            }

            return 0;
        }

        return { mark, getWinner, getCurrentPlayer, playerAtIndex, isDraw, findBestMove }
    }
    throw new Error("Failed to create new player")
}

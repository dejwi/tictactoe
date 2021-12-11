const randomSel = (function(){
    const getPos = ()=>{
        const ids = gameUtils.gameboard.getEmptyIDs();
        const randIndex = Math.floor(Math.random() * ids.length);
        return ids[randIndex];
    };
    return {getPos};
})();
const aiPlayer = (player,ai) =>{
    let scores = {
        [ai.symbol]: 10,
        [player.symbol]: -10,
        tie: 0
      };
    let counter = 0;
    const board = [...gameUtils.gameboard.get()];
    function bestMove() {
        //if empty select left up corner (minimax chooses it as well)
        // to save 3seconds!!!! of calculation time
        if(gameUtils.gameboard.getEmptyIDs().length === 9)
            return '00';
        // AI to make its turn
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            // Is the spot available?
            if (board[i][j] == '') {
              board[i][j] = ai.symbol;
              let score = minimax(board, 0, false);
              board[i][j] = '';
              if (score > bestScore) {
                bestScore = score;
                move = { i, j };
              }
            }
          }
        }
        return `${move.i}`+`${move.j}`;
        //board[move.i][move.j] = ai;
      }
      
      
      
      function minimax(board, depth, isMaximizing) {
        let result = gameUtils.checkWinnerOrTie(player,ai,board);
        if (result !== 'none') {
            if(result.symbol) return scores[result.symbol];
            return 0;
        }
      
        if (isMaximizing) {
          let bestScore = -Infinity;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                
              // Is the spot available?
              if (board[i][j] == '') {
                board[i][j] = ai.symbol;
                let score = minimax(board, depth + 1, false);
                board[i][j] = '';
                if(score>bestScore) bestScore=score;
              }
            }
          }
          return bestScore;
        } else {
          let bestScore = Infinity;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              // Is the spot available?
              if (board[i][j] == '') {
                board[i][j] = player.symbol;
                let score = minimax(board, depth + 1, true);
                board[i][j] = '';
                if(bestScore>score) bestScore=score;
              }
            }
          }
          return bestScore;
        }
      }
    return {bestMove};
};

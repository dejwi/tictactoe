const gameUtils = (function(){
    const gameboard = (function(){
        let board = [
            ['X','X',''],
            ['','X',''],
            ['','','X']
        ];
        const get = () => board;
        const clear = () =>{
            board = [
                ['','',''],
                ['','',''],
                ['','','']
            ];
        };
        const update = (pos,val) =>{
            const posArray = pos.split('');
            board[posArray[0]][posArray[1]] = val;
        };
        return {get, clear,update};
    })();
    const draw = () => {
        const board = gameboard.get();
        const boardCont = document.querySelector('.boardContainer');
        boardCont.innerHTML = '';
        for (const row in board) {
            let rowdiv = document.createElement('div');
            rowdiv.classList.add('boardRow');

            for(const square in board[row]){
                let sqrdiv = document.createElement('div');
                sqrdiv.classList.add('boardCell');
                sqrdiv.dataset.pos = `${row}`+`${square}`;
                let content = document.createElement('span');
                content.textContent = board[row][square];

                sqrdiv.appendChild(content);
                rowdiv.appendChild(sqrdiv);
            }
            boardCont.appendChild(rowdiv);
        }
    };
    const update = (pos,val) =>{
        const board = gameboard.get();
        gameboard.update(pos,val);

        document.querySelectorAll('.boardCell').forEach(e =>{
            const posArray = e.dataset.pos.split('');
            e.textContent = board[posArray[0]][posArray[1]];
        });
    };
    const resetBoard = () =>{
        gameboard.clear();
        draw();
    };
    const checkWinnerOrTie = (player1,player2) =>{
        const board = gameboard.get();
        const size = board.length;

        //ex XXX === XXX
        const checkWin = data => {
            if(data === player1.symbol.repeat(size))
                return player1;
            else if(data === player2.symbol.repeat(size))
                return player2;
            return null;
        };
        let checkString = '';

        //rows & columns
        for(const row in board){

            //horizontal check
            checkString = '';
            for(const cell in board){
                checkString += board[row][cell];
            }
            if(x = checkWin(checkString)) return x;
            
            //vertical check
            checkString = '';
            for(const cell in board){
                checkString += board[cell][row];
            }
            if(x = checkWin(checkString)) return x;
        }
        //diagnal1
        checkString = '';
        for(const x in board){
            checkString += board[(size-x)-1][x];
        }
        if(x = checkWin(checkString)) return x;

        //diagnal2
        checkString = '';
        for(const x in board){
            checkString += board[x][x];
        }
        if(x = checkWin(checkString)) return x;

        //check if board is full could be in better place but sorry
        let count = 0;
        for(const xx in board){
            for(const x in board){
                if(board[xx][x])
                    count++;
            }
        }
        if(count === (size*size))
            return 'tie';


        return 'none';
    };
    return {draw, checkWinnerOrTie,resetBoard,gameboard, update};
})();
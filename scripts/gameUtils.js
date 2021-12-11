const gameUtils = (function(){
    const gameboard = (function(){
        let currSize = 3;
        let board = [
            ['','',''],
            ['','',''],
            ['','','']
        ];
        const get = () => [...board];
        const clear = () =>{
            board = [];
            let row = [];
            for (let i = 0; i < currSize ;i++) {
                row.push('');
            }
            for (let i = 0; i < currSize ;i++) {
                board.push(Array.from(row));
            }
        };
        const update = (pos,val) =>{
            const posArray = pos.split('');
            board[posArray[0]][posArray[1]] = val;
        };
        const customSize = (n) =>{
            currSize = n;
        };
        const getEmptyIDs = ()=>{
            let array = [];
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board.length; j++) {
                    if(!board[i][j])
                        array.push(`${i}`+`${j}`);
                }
            }
            return array;
        };
        return {get, clear,update,customSize,getEmptyIDs};
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
        gameboard.update(pos,val);
        const board = gameboard.get();

        document.querySelectorAll('.boardCell').forEach(e =>{
            const posArray = e.dataset.pos.split('');
            e.textContent = board[posArray[0]][posArray[1]];
        });
    };
    const resetBoard = () =>{
        gameboard.clear();
        draw();
    };
    //return player that won or 'none','tie'
    const checkWinnerOrTie = (player1,player2, board = gameboard.get()) =>{
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
const gameboard = (function(){
    let board = [
        ['X','X',''],
        ['','X',''],
        ['','','X']
    ];
    const getBoard = () => board;
    return {getBoard};
})();
const gamehandler = (function(){
    const draw = board => {
        for (const row in board) {
            let rowdiv = document.createElement('div');
            rowdiv.classList.add('boardRow');

            for(const square in board[row]){
                let sqrdiv = document.createElement('div');
                sqrdiv.classList.add('boardCell');

                let content = document.createElement('span');
                content.textContent = board[row][square];

                sqrdiv.appendChild(content);
                rowdiv.appendChild(sqrdiv);
            }
            document.querySelector('.boardContainer').appendChild(rowdiv);
        }
    };
    const checkWinner = (player1,player2,board) =>{
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

        return null;
    };
    return {draw, checkWinner};
})();

const playerFactory = (name,symbol) => {
    let wins = 0;
    return {wins,symbol,name};
};
const player1 = playerFactory('player1','X');
const player2 = playerFactory('player2','O');

gamehandler.draw(gameboard.getBoard());

const logTxt = ()=>{
    const x = gamehandler.checkWinner(player1,player2,gameboard.getBoard());
    console.log((x) ? x.name : 'none');
};
logTxt();

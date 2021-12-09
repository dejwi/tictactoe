document.querySelector('.clearBtn').addEventListener('click',() => {gameHandler.startBoard()});

const playerFactory = (name,symbol) => {
    let wins = 0;
    return {wins,symbol,name};
};


/*const logTxt = ()=>{
    const x = gameUtils.checkWinner(player1,player2);
    console.log((x) ? x.name : 'none');
};
logTxt();*/

const gameHandler = (function(){
    const boardContainer = document.querySelector('.boardContainer');
    const gameState = document.querySelector('.gameState');
    const player1 = playerFactory('player1','X');
    const player2 = playerFactory('player2','O');
    const turn = (function(){
        let turn = player1;
        const get = () => turn;
        const change = () =>{
            turn = (turn===player1) ? player2 : player1;
        };
        return {get,change};
    })();
    //activate game event
    function boardStartClick(e){
        console.log(e);
        console.log('start click');
        gameState.textContent = `Turn: ${turn.get().name}`;
        document.querySelectorAll('.boardCell').forEach(x => {
            x.addEventListener('click',cellClick);
            //change to active color
            x.classList.remove('boardCellStart');
        });

        boardContainer.removeEventListener('click',boardStartClick);
    }
    function cellClick(e){
        if(!e.target.textContent){
            console.log('jd');
            //cell content
            e.target.textContent = turn.get().symbol;

            gameUtils.update(e.target.dataset.pos,turn.get().symbol);

            turn.change();
            gameState.textContent = `Turn: ${turn.get().name}`;

            
            const x = gameUtils.checkWinnerOrTie(player1,player2);
            console.log(x);
            if(x==='tie'){
                startBoard();
            }
            else if(x !== 'none'){
                x.wins++;
                alert(`${x.name} wins!!! win count: ${x.wins}`);
                startBoard();
            }

        }
    }
    const startBoard = () =>{
        gameUtils.resetBoard();
        gameState.textContent = 'Click on board to start';
        document.querySelectorAll('.boardCell').forEach(x =>x.classList.add('boardCellStart'));

        //timeout becouse it clicks itself after reset???
        setTimeout(()=>{
            boardContainer.addEventListener('click',boardStartClick);
        },100);
        
    };

    return{startBoard};
})();
gameHandler.startBoard();


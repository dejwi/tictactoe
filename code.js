document.querySelector('.clearBtn').addEventListener('click'
,() => {gameHandler.startBoard(); gameHandler.resetWinCount();});

const playerFactory = (name,symbol) => {
    let wins = 0;
    return {wins,symbol,name};
};

const gameHandler = (function(){
    const boardContainer = document.querySelector('.boardContainer');
    const player1 = playerFactory('player1','⨉');
    const player2 = playerFactory('player2','◯');
    const turn = (function(){
        let turn = player1;
        const get = () => turn;
        const change = () =>{
            turn = (turn===player1) ? player2 : player1;
        };
        const setDef =()=>{
            turn=player1;
        }
        return {get,change,setDef};
    })();
    //activate game event
    function boardStartClick(e){
        highlightCurrName(turn.get().name);
        document.querySelectorAll('.boardCell').forEach(x => {
            x.addEventListener('click',cellClick);
            //change to active color
            x.classList.remove('boardCellStart');
        });

        boardContainer.removeEventListener('click',boardStartClick);
    }
    function cellClick(e){
        if(e.target.textContent)
            return;
        
        //cell content
        e.target.textContent = turn.get().symbol;

        gameUtils.update(e.target.dataset.pos, turn.get().symbol);


        turn.change();
        highlightCurrName(turn.get().name);

        
        const x = gameUtils.checkWinnerOrTie(player1,player2);
        console.log(x);
        if(x==='tie'){
            startBoard();
        }
        else if(x !== 'none'){
            x.wins++;
            higlightWin(x.name);
            startBoard();
        }
    }
    const updateWinDisplay = () =>{
        document.querySelector(`span[data-id='player1']`).textContent = `wins: ${player1.wins}`;
        document.querySelector(`span[data-id='player2']`).textContent = `wins: ${player2.wins}`;
    };
    const resetWinCount = () =>{
        player1.wins = 0;
        player2.wins = 0;
        updateWinDisplay();
    };
    const higlightWin = (pname) =>{
        function resetClass(e){
            e.target.classList.remove('playerWin');
            e.target.removeEventListener('transitionend',resetClass);
        }
        const x = document.querySelector(`p[data-id='${pname}']`);
        x.classList.remove('playerTurn');
        x.classList.add('playerWin');
        x.addEventListener('transitionend',resetClass);
    };
    const highlightCurrName = (pname) =>{
        document.querySelectorAll('.playerTurn').forEach(e=>e.classList.remove('playerTurn'));
        document.querySelector(`p[data-id='${pname}']`).classList.add('playerTurn');
    };
    const startBoard = () =>{
        turn.setDef();
        updateWinDisplay();
        gameUtils.resetBoard();

        document.querySelectorAll('.playerTurn').forEach(e=>e.classList.remove('playerTurn'));
        
        document.querySelectorAll('.boardCell').forEach(x =>x.classList.add('boardCellStart'));

        //timeout becouse it clicks itself after reset???
        setTimeout(()=>{
            boardContainer.addEventListener('click',boardStartClick);
        },100);
        
    };

    return{startBoard,resetWinCount};
})();
gameHandler.startBoard();


const playerFactory = (name,symbol = null) => {
    let wins = 0;
    return {wins,symbol,name};
};
const gameHandler = (function(){
    const boardContainer = document.querySelector('.boardContainer');
    const player1 = playerFactory('player1','⨉');
    const player2 = playerFactory('player2','◯');

    const turn = (function(){
        let defTurn = player1;
        let turn = defTurn;
        const get = () => Object.assign({},turn);
        const change = () =>{
            turn = (turn===player1) ? player2 : player1;
        };
        const setDef =(player = null)=>{
            if(player)
                defTurn = player;
            
            if(defTurn==player1){
                player1.symbol = '⨉';
                player2.symbol = '◯';
            }
            else if(defTurn==player2){
                player2.symbol = '⨉';
                player1.symbol = '◯';
            }
            turn=defTurn;
        };
        const getNext = () =>{
            return (turn===player1) ? player2 : player1;
        };
        return {get,change,setDef,getNext,defTurn};
    })();

    const reset =()=>{
        gameHandler.startBoard(); 
        gameHandler.resetWinCount();
    };
    //activate game event
    function boardStartClick(e){
        boardContainer.removeEventListener('click',boardStartClick);
        highlightCurrName(turn.get().name);
        document.querySelectorAll('.boardCell').forEach(x => {
            x.addEventListener('click',cellClick);
            //change to active color
            x.classList.remove('boardCellStart');
        });
        
        // && enemyOptions.current == enemyOptions.types[2]
        if(turn.get().name === player2.name){
            console.log('jd');
            cellClick();
            highlightCurrName(turn.get().name);
        }
    }
    function cellClick(e = null){
        if(e){
            //if already has symbol cancel
            if(e.target.textContent)
                return;
    
            //update player selection
            gameUtils.update(e.target.dataset.pos, turn.get().symbol);
            turn.change();
        }
        

        
        if(!checkWin()){
            switch(enemyOptions.current){
                // NOTE: using strings from array in case I want to change enemy names
                //player
                case enemyOptions.types[0]:
                    highlightCurrName(turn.get().name);
                    break;
                //Easy bot
                case enemyOptions.types[1]:
                    gameUtils.update(randomSel.getPos(), turn.get().symbol);
                    turn.change();
                    checkWin();
                    break;
                //ai
                case enemyOptions.types[2]:
                    gameUtils.update(aiPlayer(turn.getNext(),turn.get()).bestMove(), turn.get().symbol);
                    turn.change();
                    checkWin();
                    break;
            }
        }
        
    }
    const checkWin = () =>{
        const x = gameUtils.checkWinnerOrTie(player1,player2);
        if(x==='tie'){
            startBoard();
            return true;
        }
        else if(x !== 'none'){
            x.wins++;
            higlightWin(x.name);
            startBoard();
            return true;
        }
    };
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

    return{startBoard,resetWinCount,reset,turn};
})();
const playerFactory = (name,symbol) => {
    let wins = 0;
    return {wins,symbol,name};
};

document.querySelector('.clearBtn').addEventListener('click',() => gameHandler.reset());

document.querySelector('.sizeBtn').addEventListener('click',() =>{
    do{
        var n = prompt('Enter size in range 3-7');
    }while(n<3 || n>7)
    gameUtils.gameboard.customSize(n);
    gameHandler.reset();
});


const enemyOptions = ['Player','Easy bot'];
let currentEnemy = 'Player';
//switch enemies
document.querySelector('.enemySel').addEventListener('click',(e)=>{
    const index = enemyOptions.findIndex(e => e===currentEnemy);
    //check if last element is selected
    if(index === enemyOptions.length-1)
        currentEnemy = enemyOptions[0];
    else
        currentEnemy = enemyOptions[index+1];
    e.target.textContent = currentEnemy;
    gameHandler.reset()
});

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

    const reset =()=>{
        gameHandler.startBoard(); 
        gameHandler.resetWinCount();
    };
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
        //if already has symbol cancel
        if(e.target.textContent)
            return;
        
        
        //update player selection
        gameUtils.update(e.target.dataset.pos, turn.get().symbol);

        turn.change();
        if(!checkWin()){
            switch(currentEnemy){
                // NOTE: using strings from array in case I want to change enemy names
                //player
                case enemyOptions[0]:
                    highlightCurrName(turn.get().name);
                    break;
                //Easy bot
                case enemyOptions[1]:
                    gameUtils.update(randomSel.getPos(), turn.get().symbol);
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

    return{startBoard,resetWinCount,reset};
})();
gameHandler.startBoard();


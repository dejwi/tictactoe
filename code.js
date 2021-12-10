const playerFactory = (name,symbol) => {
    let wins = 0;
    return {wins,symbol,name};
};

document.querySelector('.clearBtn').addEventListener('click',() => gameHandler.reset());

document.querySelector('.sizeBtn').addEventListener('click',() =>{
    do{
        var n = prompt('Enter size in range 3-7');
    }while(n<3 && n>7)
    gameUtils.gameboard.customSize(n);

    enemyOptions.setDef();
        
    gameHandler.reset();
});


const enemyOptions = {
    btn: document.querySelector('.enemySel'),
    types: ['Player','EasyAi','UnbeatableAi'],
    current: 'Player',
    setDef: function(){
        this.current = this.types[0];
        this.btn.textContent = this.current;
        gameHandler.reset();
    },
    setNext: function(){
        const index = this.types.findIndex(e => e===this.current);
        if(index === this.types.length-1)
            this.current = this.types[0];
        else{
            //cant select ai if size larger than 3
            if(gameUtils.gameboard.get().length > 3 && index+1 === this.types.length-1){
                this.current = this.types[0];
            }
            else
                this.current = this.types[index+1];
        }
        this.btn.textContent = this.current;
        gameHandler.reset();
        this.changeColor();
    },
    changeColor: function(){
        if(this.btn.classList != 'enemySel') this.btn.classList = 'enemySel';
        switch(this.current){
            //player
            case this.types[0]:
                this.btn.classList.add('player');
                break;
            //easyai
            case this.types[1]:
                this.btn.classList.add('easyai');
                break;
            //hardai
            case this.types[2]:
                this.btn.classList.add('hardai');
                break;
        }
    }
}
//switch enemies
document.querySelector('.enemySel').addEventListener('click',(e)=>enemyOptions.setNext());

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
                    gameUtils.update(aiPlayer(player1,player2).bestMove(), turn.get().symbol);
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
enemyOptions.changeColor();
gameHandler.startBoard();


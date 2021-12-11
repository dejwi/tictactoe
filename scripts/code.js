const enemyOptions = {
    btn: document.querySelector('.enemySel'),
    types: ['Player','EasyAi','UnbeatableAi'],
    current: 'Player'
};
const btnFunc = (function(){
    function changeSize(){
        do{
            var n = prompt('Enter size in range 3-7');
        }while(n<3 && n>7)
        gameUtils.gameboard.customSize(n);
    
        enemyOptions.setDef();
        gameHandler.reset();
    };
    function switchWhoStart(e){
        const x = gameHandler.turn.getNext();
        gameHandler.turn.setDef(x);
        e.target.textContent = x.name;
        gameHandler.startBoard();
    };
    const enemySel = (function(){
        function changeColor(){
            const btn = document.querySelector('.enemySel');
            if(btn.classList != 'enemySel') btn.classList = 'enemySel';
            switch(enemyOptions.current){
                //player
                case enemyOptions.types[0]:
                    btn.classList.add('player');
                    break;
                //easyai
                case enemyOptions.types[1]:
                    btn.classList.add('easyai');
                    break;
                //hardai
                case enemyOptions.types[2]:
                    btn.classList.add('hardai');
                    break;
            }
        };
        function setNext(){
            const btn = document.querySelector('.enemySel');
            const index = enemyOptions.types.findIndex(e => e===enemyOptions.current);
            if(index === enemyOptions.types.length-1)
                enemyOptions.current = enemyOptions.types[0];
            else{
                //cant select ai if size larger than 3
                if(gameUtils.gameboard.get().length > 3 && index+1 === enemyOptions.types.length-1){
                    enemyOptions.current = enemyOptions.types[0];
                }
                else
                    enemyOptions.current = enemyOptions.types[index+1];
            }
            btn.textContent = enemyOptions.current;
            gameHandler.reset();
            changeColor();
        };
        return {changeColor, setNext}
    })();
    
    return {changeSize,switchWhoStart,enemySel};
})();

document.querySelector('.clearBtn').addEventListener('click',() => gameHandler.reset());
document.querySelector('.sizeBtn').addEventListener('click',() => btnFunc.changeSize());
document.querySelector('.whoStart').addEventListener('click',(e)=>btnFunc.switchWhoStart(e));
document.querySelector('.enemySel').addEventListener('click',()=>btnFunc.enemySel.setNext());


btnFunc.enemySel.changeColor();
gameHandler.startBoard();


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
    return {changeSize,switchWhoStart};
})();

document.querySelector('.clearBtn').addEventListener('click',() => gameHandler.reset());
document.querySelector('.sizeBtn').addEventListener('click',() => btnFunc.changeSize());
document.querySelector('.whoStart').addEventListener('click',(e)=>btnFunc.switchWhoStart(e));
document.querySelector('.enemySel').addEventListener('click',()=>enemyOptions.setNext());


enemyOptions.changeColor();
gameHandler.startBoard();


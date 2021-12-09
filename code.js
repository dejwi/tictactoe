let gameboard = (function(){
    let board = [
        ['X','',''],
        ['','X',''],
        ['','','X']
    ];
    const getBoard = () => board;
    return {getBoard};
})();
let gamehandler = (function(){
    const draw = board => {
        let maindiv = document.createElement('div');
        for (const row in board) {
            let rowdiv = document.createElement('div');
            rowdiv.classList.add('boardRow');
            for(const square in board[row]){
                let sqrdiv = document.createElement('div');
                sqrdiv.classList.add('boardCell');
                let content = document.createElement('span');
                content.textContent =board[row][square];
                sqrdiv.appendChild(content);
                rowdiv.appendChild(sqrdiv);
            }
            document.querySelector('.boardContainer').appendChild(rowdiv);
        }
    };
    return {draw};
})();
gamehandler.draw(gameboard.getBoard());
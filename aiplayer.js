const randomSel = (function(){
    const getPos = ()=>{
        const ids = gameUtils.gameboard.getEmptyIDs();
        const randIndex = Math.floor(Math.random() * ids.length);
        return ids[randIndex];
    };
    return {getPos};
})();
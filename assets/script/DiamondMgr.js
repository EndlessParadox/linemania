(function(window){

    let DiamondMgr = function() {
        this.instance = null;
        this.diamondArr = new Array();
        this.diamondCount = 0;
    };

    DiamondMgr.getInstance = function() {
        if (!this.instance) {
            this.instance = new DiamondMgr();
        }

        return this.instance;
    };

    DiamondMgr.prototype.addDiamond = function(item){
        this.diamondArr.push(item);
    };

    DiamondMgr.prototype.updateDiamond = function(x,y,lineSizeX,lineSizeY)
    {
        for(let i = 0; i < this.diamondArr.length; i ++)
        {
            if(cc.isValid(this.diamondArr[i])) {
                let check = this.diamondArr[i].getComponent("DiamondCheck");
                if (check != null) {
                    check.onLineUpdate(x, y, lineSizeX, lineSizeY);
                }
            }
        }
    };

    DiamondMgr.prototype.addDiamondCount = function()
    {
        this.diamondCount ++;
    };

    DiamondMgr.prototype.getDiamondCount = function()
    {
        return this.diamondCount;
    };

    window.DiamondMgr = DiamondMgr;
})(window);

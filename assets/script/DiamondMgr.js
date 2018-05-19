let DiamondMgr = cc.Class({
    ctor:function()
    {
        this.diamondArr = new Array();
        this.diamondCount = 0;
    },

    addDiamond:function(item)
    {
        this.diamondArr.push(item);
    },

    updateDiamond:function(x,y,lineSizeX,lineSizeY,diamondMgr)
    {
        for(let i = 0; i < this.diamondArr.length; i ++)
        {
            if(cc.isValid(this.diamondArr[i])) {
                let check = this.diamondArr[i].getComponent("DiamondCheck");
                if (check != null) {
                    check.onLineUpdate(x, y, lineSizeX, lineSizeY,diamondMgr);
                }
            }
        }
    },

    addDiamondCount:function()
    {
        this.diamondCount ++;
    },

    getDiamondCount : function()
    {
        return this.diamondCount;
    },

    setDiamondCount:function(count)
    {
        this.diamondCount = count;
    }
});

module.exports = DiamondMgr;
(function(window){
    let CheckPointMgr = function() {
        this.instance = null;
        this.checkPoint = - 1;
        this.cpPosArr = new Array();
    };

    CheckPointMgr.getInstance = function() {
        if (!this.instance) {
            this.instance = new CheckPointMgr();
        }

        return this.instance;
    };

    CheckPointMgr.prototype.addCheckPoint = function(x,y,idx,direction,terrainIdx,buildSumX,buildSumY)
    {
        let pos = {
            x:x,
            y:y,
            idx:idx,
            direction:direction,
            terrainIdx:terrainIdx,
            buildSumX:buildSumX,
            buildSumY:buildSumY,
        };
        this.cpPosArr.push(pos);
    };

    CheckPointMgr.prototype.updateCheck = function(x,y,size)
    {
        if(this.cpPosArr.length !== 0 && this.checkPoint < this.cpPosArr.length - 1){
            if((Math.abs(x - this.cpPosArr[this.checkPoint + 1].x )<= size) && ( Math.abs(y - this.cpPosArr[this.checkPoint + 1].y) <= size))
            {
                console.log("Pass CheckPoint : " + this.checkPoint + 1 + ",Song : " + this.cpPosArr[this.checkPoint + 1].idx * 0.4);
                if(this.checkPoint < this.cpPosArr.length)
                {
                    this.checkPoint ++;
                }
            }
        }
    };

    CheckPointMgr.prototype.getCurCp = function()
    {
        if(this.checkPoint >= 0) {
            return this.cpPosArr[this.checkPoint];
        }
        else return null;
    };

    window.CheckPointMgr = CheckPointMgr;
})(window);
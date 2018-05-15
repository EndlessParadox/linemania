(function(window){
    let LineMgr = function() {
        this.instance = null;
        this.lineArr = new Array();
        this.length = 100;
        this.pool = new Array();
    };

    LineMgr.getInstance = function() {
        if (!this.instance) {
            this.instance = new LineMgr();
        }

        return this.instance;
    };

    LineMgr.prototype.addLine = function(item,pool)
    {
        //this.pool = pool;
        this.lineArr.push(item);
        if(this.lineArr.length > this.length)
        {
            let line = this.lineArr.shift();
            if(line != null)
            {
                line.opacity = 0;
                line.active = false;
                this.pool.push(line);
            }
        }
    };

    LineMgr.prototype.removeAllLine = function()
    {
        for(let i = 0; i < this.lineArr.length ; i ++)
        {
            this.lineArr[i].opacity = 0;
            this.pool.push(this.lineArr[i]);
        }
        this.lineArr = new Array();
    };

    LineMgr.prototype.addInPool = function(line)
    {
        this.pool.push(line);
    };

    LineMgr.prototype.getLine = function()
    {
        let line = null;
        line = this.pool.shift();
        if(line != null) {
            line.opacity = 255;
            line.active = true;
        }
        return line;
    };

    LineMgr.prototype.getLineSize = function()
    {
        return this.pool.length;
    };

    window.LineMgr = LineMgr;
})(window);
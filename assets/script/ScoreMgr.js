(function(window){
    let ScoreMgr = function() {
        this.instance = null;
        this.score = 0;
        this.combo = 0;
    };

    ScoreMgr.getInstance = function() {
        if (!this.instance) {
            this.instance = new ScoreMgr();
        }

        return this.instance;
    };

    ScoreMgr.prototype.addScore = function(score)
    {
        this.score += score;
    };

    ScoreMgr.prototype.getScore = function()
    {
        return this.score;
    };

    ScoreMgr.prototype.addCombo = function()
    {
        this.combo ++;
    };

    ScoreMgr.prototype.getCombo = function()
    {
        return this.combo;
    };

    ScoreMgr.prototype.clearCombo = function()
    {
        this.combo = 0;
    };

    window.ScoreMgr = ScoreMgr;
})(window);
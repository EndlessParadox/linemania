(function(window){
    let ScoreMgr = function() {
        this.instance = null;
        this.score = 0;
        this.combo = 0;
        this.comboCount = 0;
        this.maxCombo = 0;
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
        this.comboCount ++;
        if(this.combo > this.maxCombo)
        {
            this.maxCombo = this.combo;
        }
    };

    ScoreMgr.prototype.getCombo = function()
    {
        return this.combo;
    };

    ScoreMgr.prototype.clearCombo = function()
    {
        this.combo = 0;
    };

    ScoreMgr.prototype.getMaxCombo = function()
    {
        return this.maxCombo;
    };

    ScoreMgr.prototype.getComboCount = function()
    {
        return this.comboCount;
    };

    window.ScoreMgr = ScoreMgr;
})(window);
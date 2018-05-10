// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        build:"",
        baseTerrian:cc.Prefab,
        baseLineX:cc.Prefab,
        baseLineY:cc.Prefab,
        bg:cc.Node,
        halfSize:0,
        directionArr:[cc.Vec2],
        basePostion:cc.Vec2,
        baseDirection:0,
        lineSumX:0,
        lineSumY:0,
        lineDirection:0,
        lineMaxSize:0,
        lineMinSize:0,
        baseLinePostion:cc.Vec2,
        lineNum:0,
        time:0,
        bgm:cc.AudioSource,
        deltaTime:0,
        diamondBase:cc.Prefab,
        scoreLabel:cc.Label,
        perfectArea:0,
        diamondArea:0,
        perfectBase:cc.Prefab,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //this.build = '0000000000|10|20|30|20|30000000|20|10|00|10|20000000|10|00|10|00|10000000|00|10|00|10|00000000|10|0|1|00|10|00|10|0000|10|0|1|00|10|00|10|0000|10|0|1|00|10|000|1|0000|1|0|1|0|10|00|100000000';
        this.baseDirection = parseInt(this.build.slice(0,1));
        this.terrianArr = this.build.split('|');
        this.terrianIdx = 0;
        let direction = this.baseDirection;
        //let sumX = -1 * this.directionArr[this.baseDirection].x;
        //let sumY = -1 * this.directionArr[this.baseDirection].y;
        //锁定从右边开始
        let sumX = -1;
        let sumY = 0;

        this.terrianPerfectArr = new Array();
        for(let i = 0; i < this.terrianArr.length; i ++)
        {
            let note = this.terrianArr[i].substr(0,1);
            switch (note) {
                case '0' :
                    direction = 0;
                    this.terrianPerfectArr.push(this.basePostion.y + (2 * sumY + 1) * this.halfSize);
                    break;
                case '1':
                    direction = 1;
                    this.terrianPerfectArr.push(this.basePostion.x + (2 * sumX + 1) * this.halfSize);
                    break;
                case '2':
                    direction = 2;
                    this.terrianPerfectArr.push(this.basePostion.y + (2 * sumY + 1) * this.halfSize);
                    break;
                case '3':
                    direction = 3;
                    this.terrianPerfectArr.push(this.basePostion.x + (2 * sumX + 1) * this.halfSize);
                    break;
            }
            for(let j = 0; j < this.terrianArr[i].length; j ++) {
                let terrian = cc.instantiate(this.baseTerrian);
                sumX += this.directionArr[direction].x;
                sumY += this.directionArr[direction].y;
                terrian.position = new cc.Vec2(this.basePostion.x + (2 * sumX + 1) * this.halfSize, this.basePostion.y + (2 * sumY + 1) * this.halfSize);
                terrian.parent = this.bg;
                if(parseInt(this.terrianArr[i].substr(j,1)) === 5)
                {
                    let diamond = cc.instantiate(this.diamondBase);
                    diamond.position = new cc.Vec2(terrian.position.x + ( 2 * Math.random()  - 1)* this.halfSize * this.diamondArea, terrian.position.y + ( 2 * Math.random()  - 1)* this.halfSize * this.diamondArea);
                    DiamondMgr.getInstance().addDiamond(diamond);
                    diamond.parent = this.bg;
                }
            }
        }

        this.linePool = new cc.NodePool();
        for(let o = 0; o < 200; o ++)
        {
            let line = cc.instantiate(this.baseLineX);
            this.linePool.put(line);
        }

        this.lineDirection = 0;

        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            if(this.bOver)
            {
                this.bOver = false;
                this.bgm.play();
            }
            else {
                if(this.terrianIdx < this.terrianArr.length) {
                    //console.log((this.lineSumX + this.baseLinePostion.x) + "----" + this.terrianPerfectArr[this.terrianIdx]);
                    if (this.lineDirection === parseInt(this.terrianArr[this.terrianIdx].slice(0, 1))) {
                        this.lineDirection = parseInt(this.terrianArr[this.terrianIdx + 1].slice(0, 1));
                    }
                    else {
                        this.lineDirection = parseInt(this.terrianArr[this.terrianIdx].slice(0, 1));
                    }

                    if(this.lineDirection === 0 || this.lineDirection === 2)
                    {
                        if(Math.abs(this.lineSumY + this.baseLinePostion.y -  this.terrianPerfectArr[this.terrianIdx]) <= this.halfSize * this.perfectArea)
                        {
                            ScoreMgr.getInstance().addCombo();
                            ScoreMgr.getInstance().addScore(100 * ScoreMgr.getInstance().getCombo());
                            let perfectShow = cc.instantiate(this.perfectBase);
                            if(perfectShow != null)
                            {
                                let perfectDes = perfectShow.getComponent('PerfectDestroy');
                                if(perfectDes != null) {
                                    perfectDes.setPerfectCombo(ScoreMgr.getInstance().getCombo());
                                    perfectShow.position = new cc.Vec2(this.lineSumX + this.baseLinePostion.x, this.lineSumY + this.baseLinePostion.y);
                                    perfectShow.zIndex = 999;
                                    perfectShow.parent = this.bg;
                                }
                            }
                        }
                        else
                        {
                            ScoreMgr.getInstance().clearCombo();
                        }
                    }
                    else
                    {
                        if(Math.abs(this.lineSumX + this.baseLinePostion.x -  this.terrianPerfectArr[this.terrianIdx]) <= this.halfSize * this.perfectArea)
                        {
                            ScoreMgr.getInstance().addCombo();
                            ScoreMgr.getInstance().addScore(100 * ScoreMgr.getInstance().getCombo());
                            let perfectShow = cc.instantiate(this.perfectBase);
                            if(perfectShow != null)
                            {
                                let perfectDes = perfectShow.getComponent('PerfectDestroy');
                                if(perfectDes != null) {
                                    perfectDes.setPerfectCombo(ScoreMgr.getInstance().getCombo());
                                    perfectShow.position = new cc.Vec2(this.lineSumX + this.baseLinePostion.x, this.lineSumY + this.baseLinePostion.y);
                                    perfectShow.zIndex = 999;
                                    perfectShow.parent = this.bg;
                                }
                            }
                        }
                        else
                        {
                            ScoreMgr.getInstance().clearCombo();
                        }
                    }
                }
                // if (this.lineDirection === 0) {
                //     this.lineSumX += this.lineMaxSize - this.lineMinSize;
                // }
                // else {
                //     this.lineSumY += this.lineMaxSize - this.lineMinSize;
                // }
            }
        }, this);

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
    },

    start () {
        this.lineDirection = this.baseDirection;
        this.time = 0;
        if(this.baseDirection === 0 || this.baseDirection === 2) {
            this.lineSumX = this.lineMaxSize * this.directionArr[this.baseDirection].x;
            this.lineSumY = 0;
            this.terrianSumX = (this.terrianArr[this.terrianIdx].length - 1)* this.halfSize * 2 * this.directionArr[this.baseDirection].x;
            this.terrianSumY = 0;
        }
        else {
            this.lineSumX = 0;
            this.lineSumY = this.lineMaxSize * this.directionArr[this.baseDirection].y;
            this.terrianSumX = 0;
            this.terrianSumY = (this.terrianArr[this.terrianIdx].length - 1)* this.halfSize * 2 * this.directionArr[this.baseDirection].y;
        }

        let line;
        if(this.linePool.size() > 0)
        {
            line = this.linePool.get();
        }
        else {
            line = cc.instantiate(this.baseLineX);
        }
        line.getComponent('SelfDestroy').setPool(this.linePool);
        line.position = new cc.Vec2(this.baseLinePostion.x + this.lineSumX, this.baseLinePostion.y + this.lineSumY);
        if (line != null) {
            line.parent = this.bg;
        }
        // this.lineNum = 4;
        // for(let i = 0; i < this.lineNum; i ++)
        // {
        //     let line = cc.instantiate(this.baseLine);
        //     this.lineSumX += this.directionArr[this.lineDirection].x;
        //     this.lineSumY += this.directionArr[this.lineDirection].y;
        //     line.position =  new cc.Vec2(this.baseLinePostion.x +  (2 * this.lineSumX + 1) * this.lineSize,this.baseLinePostion.y + (2 * this.lineSumY + 1) * this.lineSize);
        //     line.parent = this.bg;
        // }
        this.nowDirecion = this.baseDirection;

        this.bOver = true;
    },

    update (dt) {
        if (!this.bOver) {

            // this.lineSumX += this.directionArr[this.lineDirection].x;
            // this.lineSumY += this.directionArr[this.lineDirection].y;
            let line;
            if (this.lineDirection === 0 || this.lineDirection === 2) {
                if(this.linePool.size() > 0)
                {
                    line = this.linePool.get();
                }
                else {
                    line = cc.instantiate(this.baseLineX);
                }
                line.getComponent('SelfDestroy').setPool(this.linePool);
                line.position = new cc.Vec2(this.baseLinePostion.x + this.lineSumX + this.lineMinSize * this.directionArr[this.lineDirection].x * dt / this.deltaTime, this.baseLinePostion.y + this.lineSumY + this.lineMaxSize* this.directionArr[this.lineDirection].y);
                DiamondMgr.getInstance().updateDiamond(line.position.x,line.position.y,this.lineMinSize,this.lineMaxSize);
                //console.log(line.position.y + "-----" + this.terrianPerfectArr[this.terrianIdx]);
                // if(line.position.y === this.terrianPerfectArr[this.terrianIdx])
                // {
                //     console.log("perfect");
                // }
                // else
                // {
                //     console.log("good");
                // }
                this.lineSumX += this.lineMinSize * this.directionArr[this.lineDirection].x *  2 * dt /this.deltaTime;
                this.lineSumY += this.lineMaxSize * this.directionArr[this.lineDirection].y;
            }
            else {
                if(this.linePool.size() > 0)
                {
                    line = this.linePool.get();
                }
                else {
                    line = cc.instantiate(this.baseLineY);
                }
                line.getComponent('SelfDestroy').setPool(this.linePool);
                line.position = new cc.Vec2(this.baseLinePostion.x + this.lineSumX + this.lineMaxSize* this.directionArr[this.lineDirection].x, this.baseLinePostion.y + this.lineSumY + this.lineMinSize* this.directionArr[this.lineDirection].y * dt /this.deltaTime);
                DiamondMgr.getInstance().updateDiamond(line.position.x,line.position.y,this.lineMaxSize,this.lineMinSize);
                //console.log(line.position.x + " ---- " + (this.terrianSumX + this.baseLinePostion.x + this.lineMinSize));
                //console.log(line.position.x + "-----" + this.terrianPerfectArr[this.terrianIdx]);
                // if(line.position.x === this.terrianPerfectArr[this.terrianIdx])
                // {
                //     console.log("perfect");
                // }
                // else
                // {
                //     console.log("good");
                // }
                this.lineSumX += this.lineMaxSize * this.directionArr[this.lineDirection].x;
                this.lineSumY +=  this.lineMinSize * this.directionArr[this.lineDirection].y * 2 * dt /this.deltaTime;
            }
            if (line != null) {
                line.parent = this.bg;
            }

            if (this.nowDirecion === 0 || this.nowDirecion === 2) {
                //console.log(this.lineSumX + "!" + this.terrianSumX);
                if (((this.lineSumX >= this.terrianSumX + this.lineMaxSize) && (this.nowDirecion === 0)) || ((this.lineSumX <= this.terrianSumX - this.lineMaxSize) && (this.nowDirecion === 2))) {
                    this.terrianIdx++;
                    if(this.terrianIdx >= this.terrianArr.length)
                    {
                        alert("发出胜利的声音");
                        this.bOver = true;
                        return;
                    }
                    this.nowDirecion = parseInt(this.terrianArr[this.terrianIdx].slice(0, 1));
                    this.terrianSumY += ((this.terrianArr[this.terrianIdx].length - 1) * this.halfSize * 2 + this.halfSize) * this.directionArr[this.nowDirecion].y;
                    this.terrianSumX += this.halfSize * this.directionArr[parseInt(this.terrianArr[this.terrianIdx - 1].slice(0, 1))].x;
                }
                else {
                    //console.log(this.lineSumY + "---" + this.terrianSumY + "----Y");
                    if (this.lineSumY >= this.terrianSumY + this.halfSize - this.lineMaxSize || this.lineSumY <= this.terrianSumY - this.halfSize + this.lineMaxSize) {
                        console.log('die1');
                        alert("发出GG的声音");
                        this.bOver = true;
                    }
                }
            }
            else {
                //console.log(this.lineSumY + "!" + this.terrianSumY);
                if (((this.lineSumY >= this.terrianSumY + this.lineMaxSize) && (this.nowDirecion === 1)) || ((this.lineSumY <= this.terrianSumY - this.lineMaxSize) && (this.nowDirecion === 3))) {
                    this.terrianIdx++;
                    if(this.terrianIdx >= this.terrianArr.length)
                    {
                        alert("发出胜利的声音");
                        this.bOver = true;
                        return;
                    }
                    this.nowDirecion = parseInt(this.terrianArr[this.terrianIdx].slice(0, 1));
                    this.terrianSumX += ((this.terrianArr[this.terrianIdx].length - 1) * this.halfSize * 2 + this.halfSize)* this.directionArr[this.nowDirecion].x;
                    this.terrianSumY += this.halfSize * this.directionArr[parseInt(this.terrianArr[this.terrianIdx - 1].slice(0, 1))].y;
                }
                else {
                    //console.log(this.lineSumX + "---" + this.terrianSumX + "----X");
                    if (this.lineSumX >= this.terrianSumX + this.halfSize - this.lineMaxSize || this.lineSumX <= this.terrianSumX - this.halfSize + this.lineMaxSize ) {
                        console.log('die2');
                        alert("发出GG的声音");
                        this.bOver = true;
                    }
                }
            }

            let newX = this.bg.position.x - (this.directionArr[this.nowDirecion].x === 0 ? this.directionArr[this.nowDirecion].y * 0.5 : this.directionArr[this.nowDirecion].x * 0.5) * this.lineMinSize * 2;
            let newY = this.bg.position.y - (this.directionArr[this.nowDirecion].y === 0 ? this.directionArr[this.nowDirecion].x * 0.5 : this.directionArr[this.nowDirecion].y * 0.5) * this.lineMinSize * 2;
            this.bg.position = new cc.Vec2(newX, newY);

            this.scoreLabel.string = "Score:" + ScoreMgr.getInstance().getScore();
        }
    },
});

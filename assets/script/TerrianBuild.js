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
        bgm:cc.AudioSource
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
        this.terrianArr = this.build.split('1');
        this.terrianIdx = 0;
        let direction = this.baseDirection;
        let sumX = -1;
        let sumY = 0;
        for(let i = 0; i < this.build.length; i ++)
        {
            let note = this.build.substr(i,1);
            let terrian = cc.instantiate(this.baseTerrian);
            switch (note)
            {
                case '0' :
                    break;
                case '1':
                    direction = 1 - direction;
                    break;
            }
            sumX += this.directionArr[direction].x;
            sumY += this.directionArr[direction].y;
            terrian.position =  new cc.Vec2(this.basePostion.x +  (2 * sumX + 1) * this.halfSize,this.basePostion.y + (2 * sumY + 1) * this.halfSize);
            terrian.parent = this.bg;
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
                this.lineDirection = 1 - this.lineDirection;
                if (this.lineDirection === 0) {
                    this.lineSumX += this.lineMaxSize - this.lineMinSize;
                }
                else {
                    this.lineSumY += this.lineMaxSize - this.lineMinSize;
                }
            }
        }, this);
    },

    start () {
        this.lineDirection = this.baseDirection;
        this.lineSumX = this.lineMaxSize;
        this.lineSumY = this.lineMinSize;
        this.time = 0;
        if(this.baseDirection === 0) {
            this.terrianSumX = (this.terrianArr[this.terrianIdx].length - 1)* this.halfSize * 2;
            this.terrianSumY = 0;
        }
        else {
            this.terrianSumX = 0;
            this.terrianSumY = (this.terrianArr[this.terrianIdx].length - 1)* this.halfSize * 2;
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
            if (this.lineDirection === 0) {
                if(this.linePool.size() > 0)
                {
                    line = this.linePool.get();
                }
                else {
                    line = cc.instantiate(this.baseLineX);
                }
                line.getComponent('SelfDestroy').setPool(this.linePool);
                line.position = new cc.Vec2(this.baseLinePostion.x + this.lineSumX + this.lineMinSize, this.baseLinePostion.y + this.lineSumY + this.lineMaxSize);
                this.lineSumX += 2 * this.lineMinSize * this.directionArr[this.lineDirection].x;
                this.lineSumY += 2 * this.lineMaxSize * this.directionArr[this.lineDirection].y;
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
                line.position = new cc.Vec2(this.baseLinePostion.x + this.lineSumX + this.lineMaxSize, this.baseLinePostion.y + this.lineSumY + this.lineMinSize);
                this.lineSumX += 2 * this.lineMaxSize * this.directionArr[this.lineDirection].x;
                this.lineSumY += 2 * this.lineMinSize * this.directionArr[this.lineDirection].y;
            }
            if (line != null) {
                line.parent = this.bg;
            }

            if (this.nowDirecion === 0) {
                if (this.lineSumX >= this.terrianSumX) {
                    this.terrianIdx++;
                    if(this.terrianIdx >= this.terrianArr.length)
                    {
                        alert("发出胜利的声音");
                        this.bOver = true;
                        return;
                    }
                    this.nowDirecion = 1 - this.nowDirecion;
                    this.terrianSumY += (this.terrianArr[this.terrianIdx].length) * this.halfSize * 2 + this.halfSize;
                    this.terrianSumX += this.halfSize;
                }
                else {
//                    console.log(this.lineSumY + "---" + this.terrianSumY + "----Y");
                    if (this.lineSumY >= this.terrianSumY + this.halfSize - this.lineMaxSize || this.lineSumY <= this.terrianSumY - this.halfSize) {
                        console.log('die');
                        alert("发出GG的声音");
                        this.bOver = true;
                    }
                }
            }
            else {
                if (this.lineSumY >= this.terrianSumY) {
                    this.terrianIdx++;
                    if(this.terrianIdx >= this.terrianArr.length)
                    {
                        alert("发出胜利的声音");
                        this.bOver = true;
                        return;
                    }
                    this.nowDirecion = 1 - this.nowDirecion;
                    this.terrianSumX += (this.terrianArr[this.terrianIdx].length) * this.halfSize * 2 + this.halfSize;
                    this.terrianSumY += this.halfSize;
                }
                else {
                    //                  console.log(this.lineSumX + "---" + this.terrianSumX + "----X");
                    if (this.lineSumX >= this.terrianSumX + this.halfSize - this.lineMaxSize * 2 || this.lineSumX <= this.terrianSumX - this.halfSize) {
                        console.log('die');
                        alert("发出GG的声音");
                        this.bOver = true;
                    }
                }
            }

            let newX = this.bg.position.x - this.directionArr[this.nowDirecion].x * this.lineMinSize * 2;
            let newY = this.bg.position.y - this.directionArr[this.nowDirecion].y * this.lineMinSize * 2;
            this.bg.position = new cc.Vec2(newX, newY);
        }
    },
});

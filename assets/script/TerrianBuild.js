// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let DiamondMgr = require("DiamondMgr");

let CheckPointMgr = require("CheckPointMgr");

let ScoreMgr = require("ScoreMgr");

cc.Class({
    extends: cc.Component,

    properties: {
        build:"",
        baseterrain:cc.Prefab,
        baseCPterrain:cc.Prefab,
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
        offsetX:0,
        offsetY:0,
        baseOffset:0,
        offset:0,
        cam:cc.Camera,
        constBG:cc.Node,
        preBuildCount:0,
        itemArr:[cc.Prefab],
        itemPosArr:[cc.Vec2],
        itemRotateArr:[cc.Float],
        itemScaleArr:[cc.Vec2],
        uiDie:cc.Node,
        bgmName:'',
        sceneName:'',
        resumeChance:1,
        fullLength:0,
        recordIdx:0,
        minBeat:0,
        standardBeat:0,
        perfectShow:cc.Prefab,
        // baseBgTerrain:cc.Prefab,
        gp:cc.Graphics,
        help:cc.Node,
        restart:cc.Node,
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
        this.gp.node.zIndex = 990;
        this.multi =  this.minBeat / this.standardBeat;
        this.DiamondMgr = new DiamondMgr();
        this.CheckPointMgr = new CheckPointMgr();
        this.ScoreMgr = new ScoreMgr();
        //this.build = '0000000000|10|20|30|20|30000000|20|10|00|10|20000000|10|00|10|00|10000000|00|10|00|10|00000000|10|0|1|00|10|00|10|0000|10|0|1|00|10|00|10|0000|10|0|1|00|10|000|1|0000|1|0|1|0|10|00|100000000';
        this.baseDirection = parseInt(this.build.slice(0,1));
        this.terrainArr = this.build.split('|');
        this.terrainIdx = 0;
        //this.standardterrainIdx = 0;
        this.direction = this.baseDirection;
        //let sumX = -1 * this.directionArr[this.baseDirection].x;
        //let sumY = -1 * this.directionArr[this.baseDirection].y;

        this.help.active = true;

        //锁定从右边开始
        this.sumX = -1;
        this.sumY = 0;

        this.idx = 0;

        this.buildSumX = - this.halfSize * 2;
        this.buildSumY = 0;

        this.terrainPerfectArr = new Array();

        this.terrainBuildArr = new Array();

        this.terrainBGBuildArr = new Array();

        this.terrainPool = new cc.NodePool();
        // this.terrainBGPool = new cc.NodePool();
        for(let i = 0; i < 15; i ++)
        {
            let terrain = cc.instantiate(this.baseterrain);
            //terrain.parent = this.bg;
            //line.opacity = 0;
            //line.active = false;
            //LineMgr.getInstance().addInPool(line);
            this.terrainPool.put(terrain);

            // let terrainBG = cc.instantiate(this.baseBgTerrain);
            // terrainBG.parent = this.constBG;
            // this.terrainBGPool.put(terrainBG);
        }


        this.buildTerrainIdx = 0;
        this.buildTerrain(this.buildTerrainIdx);


        this.linePool = new cc.NodePool();
        for(let o = 0; o < 1; o ++)
        {
            let line = cc.instantiate(this.baseLineX);
            line.parent = this.bg;
            //line.opacity = 0;
            //line.active = false;
            //LineMgr.getInstance().addInPool(line);
            this.linePool.put(line);
        }

        let itemBuildSumX = -this.halfSize * 2;
        let itemBuildSumY = 0;
        let itemSumX = -1;
        let itemSumY = 0;
        //load时直接生成物体
        this.itemIdx = 0;
        for (let i = 0; i < this.terrainArr.length; i++) {
            let note = this.terrainArr[i].substr(0, 1);
            let direction;
            switch (note) {
                case '0' :
                    direction = 0;
                    break;
                case '1':
                    direction = 1;
                    break;
                case '2':
                    direction = 2;
                    break;
                case '3':
                    direction = 3;
                    break;
            }
            if (i > 0) {
                //console.log(this.terrainArr[i - 1]);
                itemBuildSumX += ((this.terrainArr[i].length - 1) * this.halfSize * 2 + this.halfSize) * this.directionArr[direction].x + this.halfSize * this.directionArr[parseInt(this.terrainArr[i - 1].slice(0, 1))].x;
                itemBuildSumY += ((this.terrainArr[i].length - 1) * this.halfSize * 2 + this.halfSize) * this.directionArr[direction].y + this.halfSize * this.directionArr[parseInt(this.terrainArr[i - 1].slice(0, 1))].y;
            }
            else {
                itemBuildSumX += ((this.terrainArr[i].length - 1) * this.halfSize * 2 + this.halfSize) * this.directionArr[direction].x;
                itemBuildSumY += ((this.terrainArr[i].length - 1) * this.halfSize * 2 + this.halfSize) * this.directionArr[direction].y;
            }
           //  for (let j = 0; j < this.terrainArr[i].length; j++) {
           //      let location = new cc.Vec2(0, 0);
           //      itemSumX += this.directionArr[direction].x;
           //      itemSumY += this.directionArr[direction].y;
           //      location = new cc.Vec2(this.basePostion.x + (2 * itemSumX) * this.halfSize, this.basePostion.y + (2 * itemSumY + 1) * this.halfSize);
           //
           //      switch (parseInt(this.terrainArr[i].substr(j, 1))) {
           //          case 4:
           //              if (this.itemArr.length > 0 ) {
           //                  let item = cc.instantiate(this.itemArr[0]);
           //                  item.position = new cc.Vec2(location.x + this.itemPosArr[itemIdx < this.itemPosArr.length ? itemIdx : 0].x, location.y + this.itemPosArr[itemIdx < this.itemPosArr.length ? itemIdx : 0].y);
           //                  item.rotation = this.itemRotateArr[itemIdx < this.itemRotateArr.length ? itemIdx : 0];
           //                  item.setScale(new cc.Vec2(this.itemScaleArr[itemIdx < this.itemScaleArr.length ? itemIdx : 0]));
           //                  item.parent = this.constBG;
           //                  itemIdx++;
           //              }
           //              break;
           //          case 5:
           //              if (this.itemArr.length > 1 ) {
           //                  let item = cc.instantiate(this.itemArr[1]);
           //                  item.position = new cc.Vec2(location.x + this.itemPosArr[itemIdx < this.itemPosArr.length ? itemIdx : 0].x, location.y + this.itemPosArr[itemIdx < this.itemPosArr.length ? itemIdx : 0].y);
           //                  item.rotation = this.itemRotateArr[itemIdx < this.itemRotateArr.length ? itemIdx : 0];
           //                  item.setScale(new cc.Vec2(this.itemScaleArr[itemIdx < this.itemScaleArr.length ? itemIdx : 0]));
           //                  item.parent = this.constBG;
           //                  itemIdx++;
           //              }
           //              break;
           //          case 6:
           //              if (this.itemArr.length > 2 ) {
           //                  let item = cc.instantiate(this.itemArr[2]);
           //                  item.position = new cc.Vec2(location.x + this.itemPosArr[itemIdx < this.itemPosArr.length ? itemIdx : 0].x, location.y + this.itemPosArr[itemIdx < this.itemPosArr.length ? itemIdx : 0].y);
           //                  item.rotation = this.itemRotateArr[itemIdx < this.itemRotateArr.length ? itemIdx : 0];
           //                  item.setScale(new cc.Vec2(this.itemScaleArr[itemIdx < this.itemScaleArr.length ? itemIdx : 0]));
           //                  item.parent = this.constBG;
           //                  itemIdx++;
           //              }
           //              break;
           //          case 7:
           //              if (this.itemArr.length > 3 ) {
           //                  let item = cc.instantiate(this.itemArr[3]);
           //                  item.position = new cc.Vec2(location.x + this.itemPosArr[itemIdx < this.itemPosArr.length ? itemIdx : 0].x, location.y + this.itemPosArr[itemIdx < this.itemPosArr.length ? itemIdx : 0].y);
           //                  item.rotation = this.itemRotateArr[itemIdx < this.itemRotateArr.length ? itemIdx : 0];
           //                  item.setScale(new cc.Vec2(this.itemScaleArr[itemIdx < this.itemScaleArr.length ? itemIdx : 0]));
           //                  item.parent = this.constBG;
           //                  itemIdx++;
           //              }
           //              break;
           //          case 8:
           //              if (this.itemArr.length > 4 ) {
           //                  let item = cc.instantiate(this.itemArr[4]);
           //                  item.position = new cc.Vec2(location.x + this.itemPosArr[itemIdx < this.itemPosArr.length ? itemIdx : 0].x, location.y + this.itemPosArr[itemIdx < this.itemPosArr.length ? itemIdx : 0].y);
           //                  item.rotation = this.itemRotateArr[itemIdx < this.itemRotateArr.length ? itemIdx : 0];
           //                  item.setScale(new cc.Vec2(this.itemScaleArr[itemIdx < this.itemScaleArr.length ? itemIdx : 0]));
           //                  item.parent = this.constBG;
           //                  itemIdx++;
           //              }
           //              break;
           //          case 9:
           //              if (this.itemArr.length > 5) {
           //                  let item = cc.instantiate(this.itemArr[5]);
           //                  item.position = new cc.Vec2(location.x + this.itemPosArr[itemIdx < this.itemPosArr.length ? itemIdx : 0].x, location.y + this.itemPosArr[itemIdx < this.itemPosArr.length ? itemIdx : 0].y);
           //                  item.rotation = this.itemRotateArr[itemIdx < this.itemRotateArr.length ? itemIdx : 0];
           //                  item.setScale(new cc.Vec2(this.itemScaleArr[itemIdx < this.itemScaleArr.length ? itemIdx : 0]));
           //                  item.parent = this.constBG;
           //                  itemIdx++;
           //              }
           //              break;
           //      }
           // }
        }


        this.lineDirection = 0;

        this.stop = false;
        this.waitTime = 0;
        this.stopTime = 3;

        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            if(this.stop) return;
            if(this.bOver)
            {
                if(!this.bBack) {
                    this.help.active = false;
                    this.bOver = false;
                    this.bgm.play();
                }
                else
                {
                }
            }
            else {
                if(this.terrainIdx < this.terrainArr.length) {
                    //console.log((this.lineSumX + this.baseLinePostion.x) + "----" + this.terrainPerfectArr[this.terrainIdx]);

                    if(this.lineDirection === 1 || this.lineDirection === 3)
                    {
                            if (Math.abs(this.lineSumY + this.baseLinePostion.y - this.terrainPerfectArr[this.terrainIdx]) <= this.halfSize * this.perfectArea) {
                                this.ScoreMgr.addCombo();
                                this.ScoreMgr.addScore(100 * this.ScoreMgr.getCombo());
                                let perfectShow = cc.instantiate(this.perfectBase);
                                if (perfectShow != null) {
                                    let perfectDes = perfectShow.getComponent('PerfectDestroy');
                                    if (perfectDes != null) {
                                        perfectDes.setPerfectCombo(this.ScoreMgr.getCombo());
                                        perfectShow.position = new cc.Vec2(this.lineSumX + this.baseLinePostion.x, this.lineSumY + this.baseLinePostion.y);
                                        perfectShow.zIndex = 999;
                                        perfectShow.parent = this.bg;
                                    }
                                }
                            }
                            else {
                                // console.log(this.lineSumY + " ---" + this.terrainStandardSumY + "____________Y");
                                //this.offset += (this.lineSumY + this.baseLinePostion.y -  this.terrainPerfectArr[this.terrainIdx]) * this.directionArr[this.lineDirection].y;
                                //this.offsetY = (this.lineSumY - this.terrainStandardSumY) * this.directionArr[this.lineDirection].y;
                                //console.log(this.lineSumY + this.baseLinePostion.y -  this.terrainPerfectArr[this.terrainIdx]);
                                // console.log(this.offsetY + "YYYY");
                                if (Math.abs(this.lineSumY + this.baseLinePostion.y - this.terrainPerfectArr[this.terrainIdx]) <= this.halfSize) {
                                    this.ScoreMgr.clearCombo();
                                }
                            }
                    }
                    else
                    {
                            if (Math.abs(this.lineSumX + this.baseLinePostion.x - this.terrainPerfectArr[this.terrainIdx]) <= this.halfSize * this.perfectArea) {
                                this.ScoreMgr.addCombo();
                                this.ScoreMgr.addScore(100 * this.ScoreMgr.getCombo());
                                let perfectShow = cc.instantiate(this.perfectBase);
                                if (perfectShow != null) {
                                    let perfectDes = perfectShow.getComponent('PerfectDestroy');
                                    if (perfectDes != null) {
                                        perfectDes.setPerfectCombo(this.ScoreMgr.getCombo());
                                        perfectShow.position = new cc.Vec2(this.lineSumX + this.baseLinePostion.x, this.lineSumY + this.baseLinePostion.y);
                                        perfectShow.zIndex = 999;
                                        perfectShow.parent = this.bg;
                                    }
                                }
                            }
                            else {
                                //this.offset += (this.lineSumX + this.baseLinePostion.x -  this.terrainPerfectArr[this.terrainIdx]) * this.directionArr[this.lineDirection].x;
                                // console.log(this.lineSumX + " ---" + this.terrainStandardSumX + "____________X");
                                //this.offsetX = (this.lineSumX - this.terrainStandardSumX) * this.directionArr[this.lineDirection].x;
                                if(Math.abs(this.lineSumX +  this.halfSize + this.baseLinePostion.x - this.terrainPerfectArr[this.terrainIdx]) <= this.halfSize) {
                                    // console.log( this.offsetX + "XXXX");
                                    this.ScoreMgr.clearCombo();
                                }
                            }
                    }

                    if (this.lineDirection === parseInt(this.terrainArr[this.terrainIdx].slice(0, 1))) {
                        this.lineDirection = parseInt(this.terrainArr[this.terrainIdx + 1].slice(0, 1));
                    }
                    else {
                        this.lineDirection = parseInt(this.terrainArr[this.terrainIdx].slice(0, 1));
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
    },

    resumeGame()
    {
        for(let o = 0; o < this.terrainBuildArr.length; o ++)
        {
            for (let p = 0; p < this.terrainBuildArr[0].length; p ++)
            {
                this.terrainPool.put(this.terrainBuildArr[0][p]);
            }
            this.terrainBuildArr.shift();
        }

        this.bg.destroyAllChildren();
        // let restart = cc.instantiate(this.restart);
        // if(restart != null)
        // {
        //     restart.zIndex = 999;
        //     restart.parent = this.bg;
        // }
        this.restart.active = true;
        // for(let m = 0; m < this.terrainBGBuildArr.length; m ++)
        // {
        //     for (let n = 0; n < this.terrainBGBuildArr[0].length; n ++)
        //     {
        //         this.terrainPool.put(this.terrainBGBuildArr[0][n]);
        //     }
        //     this.terrainBGBuildArr.shift();
        // }
        if(this.linePool.size() > 0)
        //if(LineMgr.getInstance().getLineSize() > 0)
        {
            //line = LineMgr.getInstance().getLine();
            this.line = this.linePool.get();
        }
        else {
            this.line = cc.instantiate(this.baseLineX);
        }
        this.line.position = new cc.Vec2(this.baseLinePostion.x, this.baseLinePostion.y);
        if (this.line != null) {
            this.line.zIndex = 998;
            this.line.parent = this.bg;
        }
        let camCtrl = this.cam.getComponent("CameraControl");
        if(camCtrl != null)
        {
            camCtrl.target = this.line;
        }


        let curCp = this.CheckPointMgr.getCurCp();
        if(curCp != null) {
            // this.bgm.setCurrentTime(curCp.idx * 0.4);
            // this.bgm.resume();
            this.idx = curCp.baseIdx;
            this.lineSumX = curCp.x - this.baseLinePostion.x;
            this.lineSumY = curCp.y - this.baseLinePostion.y;
            this.terrainSumX = curCp.buildSumX;
            this.terrainSumY = curCp.buildSumY;
            this.lineDirection = curCp.direction;
            if(this.lineDirection === 0)
            {
                this.line.rotation = 180;
            }
            else
            {
                this.line.rotation = 90;
            }
            this.nowDirecion = curCp.direction;
            this.terrainIdx = curCp.terrainIdx;
            this.buildTerrainIdx = curCp.buildTerrainIdx;
            this.sumX = curCp.baseSumX;
            this.sumY = curCp.baseSumY;
            this.buildSumX = curCp.baseBuildSumX;
            this.buildSumY = curCp.baseBuildSumY;
            this.nowTime = curCp.time;
            this.ScoreMgr.revertData(curCp.data);
            this.DiamondMgr.setDiamondCount(curCp.diamondCount);

            //this.buildTerrainIdx = Math.max(0,this.terrainIdx - this.preBuildCount);
            //console.log(this.buildTerrainIdx);
            this.CheckPointMgr.clear();
            this.buildTerrain(this.buildTerrainIdx, true);
        }
        else {
            // this.bgm.setCurrentTime(0);
            // this.bgm.play();
            this.idx = 0;
            this.lineSumX = 0;
            this.lineSumY = 0;
            this.terrainIdx = 0;
            this.terrainSumX = ((this.terrainArr[this.terrainIdx].length - 2)* this.halfSize * 2 + this.halfSize) * this.directionArr[this.baseDirection].x;
            this.terrainSumY = 0;
            this.lineDirection = this.baseDirection;
            this.nowDirecion = this.baseDirection;
            this.buildTerrainIdx = 0;
            this.sumX = -1;
            this.sumY = 0;
            this.buildSumX = - this.halfSize * 2;
            this.buildSumY = 0;
            this.nowTime = 0;
            this.ScoreMgr.revertData(null);
            this.DiamondMgr.setDiamondCount(0);

            // this.buildTerrainIdx = 0;
            this.CheckPointMgr.clear();
            this.buildTerrain(this.buildTerrainIdx,true);
        }

        // let line;
        // if(LineMgr.getInstance().getLineSize() > 0)
        // {
        //     line = LineMgr.getInstance().getLine();
        // }
        // else {
        //     line = cc.instantiate(this.baseLineX);
        // }
        // LineMgr.getInstance().addLine(line,this.linePool);
        this.line.position = new cc.Vec2(this.baseLinePostion.x + this.lineSumX, this.baseLinePostion.y + this.lineSumY);

        //let newX = -((line.position.x - this.baseLinePostion.x) * Math.cos(this.bg.rotation * Math.PI / 180) + (line.position.y - this.baseLinePostion.y) * Math.sin(this.bg.rotation * Math.PI / 180));
        //let newY = -(-(line.position.y - this.baseLinePostion.y) * Math.sin(this.bg.rotation * Math.PI / 180) + (line.position.x - this.baseLinePostion.x) * Math.cos(this.bg.rotation * Math.PI / 180));
        //let newX = this.bg.position.x - this.directionArr[this.nowDirecion].x * this.lineMinSize * 2;
        //let newY = this.bg.position.y - this.directionArr[this.nowDirecion].y * this.lineMinSize * 2;
        //this.bg.position = new cc.Vec2(newX, newY);

        this.stop = true;

        setTimeout(function(){
            if(curCp != null) {
                this.bgm.setCurrentTime(curCp.idx * this.minBeat);
                this.bgm.resume();
            }
            else {
                this.bgm.setCurrentTime(0);
                this.bgm.play();
            }
            this.bBack = false;
            this.bOver = false;
            this.stop = false;
        }.bind(this),3000);
    },

    start () {
        this.lineDirection = this.baseDirection;
        this.time = 0;
        if(this.baseDirection === 0 || this.baseDirection === 2) {
            //this.lineSumX = this.lineMaxSize * this.directionArr[this.baseDirection].x;
            this.lineSumX = 0;
            this.lineSumY = 0;
            this.terrainSumX = ((this.terrainArr[this.terrainIdx].length - 2)* this.halfSize * 2 + this.halfSize) * this.directionArr[this.baseDirection].x;
            this.terrainSumY = 0;
        }
        else {
            this.lineSumX = 0;
            this.lineSumY = 0;
            //this.lineSumY = this.lineMaxSize * this.directionArr[this.baseDirection].y;
            this.terrainSumX = 0;
            this.terrainSumY = (this.terrainArr[this.terrainIdx].length - 1)* this.halfSize * 2 * this.directionArr[this.baseDirection].y;
        }

        //基准线
        //this.standardSumX = this.lineSumX;
        //this.standardSumY = this.lineSumY;
        //this.terrainStandardSumX = this.terrainSumX;
        //this.terrainStandardSumY = this.terrainSumY;

        this.line = null;
        if(this.linePool.size() > 0)
        //if(LineMgr.getInstance().getLineSize() > 0)
        {
            //line = LineMgr.getInstance().getLine();
            this.line = this.linePool.get();
        }
        else {
            this.line = cc.instantiate(this.baseLineX);
        }
        //LineMgr.getInstance().addLine(this.line,this.linePool);
        //line.getComponent('SelfDestroy').setPool(this.linePool);
        this.line.position = new cc.Vec2(this.baseLinePostion.x, this.baseLinePostion.y);
        //this.line.active = true;
        if (this.line != null) {
            this.line.zIndex = 998;
            this.line.parent = this.bg;
        }
//        this.cam.addTarget(this.line);
        let camCtrl = this.cam.getComponent("CameraControl");
        if(camCtrl != null)
        {
            camCtrl.target = this.line;
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

        //this.standardDirecion = this.baseDirection;

        this.bOver = true;
        this.bBack = false;

        this.nowTime = 0;
    },

    update (dt) {
        if (!this.bOver) {
            this.nowTime += dt;
            //console.log(this.offset);
            // this.lineSumX += this.directionArr[this.lineDirection].x;
            // this.lineSumY += this.directionArr[this.lineDirection].y;
            if (this.lineDirection === 0 || this.lineDirection === 2) {
                this.line.rotation = 180;
                //  if(this.linePool.size() > 0)
                // // {
                // //if(LineMgr.getInstance().getLineSize() > 0)
                // {
                //     //line = LineMgr.getInstance().getLine();
                //     line = this.linePool.get();
                // }
                // else {
                //     line = cc.instantiate(this.baseLineX);
                // }
                //console.log(this.offsetX + "---- X");
                //if(this.offsetY !== 0)
                //{
                //    if(Math.abs(this.offsetY) < this.baseOffset )
                //    {
                //        this.lineSumX += this.offsetY * this.directionArr[this.lineDirection].x;
                //        this.offsetY -= this.offsetY;
                //    }
                //    else
                //    {
                //        //this.lineSumX -= this.offset > 0 ? this.baseOffset : this.baseOffset * -1;
                //        this.lineSumX += (this.offsetY > 0 ? this.baseOffset : this.baseOffset * -1) * this.directionArr[this.lineDirection].x;
                //        this.offsetY -= this.offsetY > 0 ? this.baseOffset: this.baseOffset * -1;
                //    }
                //}
                //line.getComponent('SelfDestroy').setPool(this.linePool);
                //console.log(this.line);
                this.line.position = new cc.Vec2(this.baseLinePostion.x + this.lineSumX + this.lineMinSize * this.directionArr[this.lineDirection].x * dt / this.deltaTime, this.baseLinePostion.y + this.lineSumY + this.lineMaxSize* this.directionArr[this.lineDirection].y);
                this.DiamondMgr.updateDiamond(this.line.position.x,this.line.position.y,this.lineMinSize,this.lineMaxSize,this.DiamondMgr,this.ScoreMgr);
                let data = {
                    score : this.ScoreMgr.getScore(),
                    comboCount:this.ScoreMgr.getComboCount(),
                    maxCombo : this.ScoreMgr.getMaxCombo(),
                };
                this.CheckPointMgr.updateCheck(this.line.position.x,this.line.position.y,this.halfSize,this.time,data,this.DiamondMgr.getDiamondCount());
                // LineMgr.getInstance().addLine(line,this.linePool);
                //console.log(line.position.y + "-----" + this.terrainPerfectArr[this.terrainIdx]);
                // if(line.position.y === this.terrainPerfectArr[this.terrainIdx])
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
                this.line.rotation = 90;
                //  if(this.linePool.size() > 0)
                // // {
                // //if(LineMgr.getInstance().getLineSize() > 0)
                // {
                //     //line = LineMgr.getInstance().getLine();
                //     line = this.linePool.get();
                // }
                // else {
                //     line = cc.instantiate(this.baseLineY);
                //     console.log("????");
                // }
                //console.log(this.offsetY + "---- Y");
                //if(this.offsetX !== 0)
                //{
                //    if(Math.abs(this.offsetX) <= this.baseOffset)
                //    {
                //        this.lineSumY += this.offsetX *  this.directionArr[this.lineDirection].y;
                //        this.offsetX -= this.offsetX;
                //    }
                //    else
                //    {
                //        this.lineSumY += (this.offsetX > 0 ? this.baseOffset : this.baseOffset * -1) * this.directionArr[this.lineDirection].y;
                //        this.offsetX -= this.offsetX > 0 ? this.baseOffset: this.baseOffset * -1 ;
                //    }
                //}

                //line.getComponent('SelfDestroy').setPool(this.linePool);
                this.line.position = new cc.Vec2(this.baseLinePostion.x + this.lineSumX + this.lineMaxSize* this.directionArr[this.lineDirection].x, this.baseLinePostion.y + this.lineSumY + this.lineMinSize* this.directionArr[this.lineDirection].y * dt /this.deltaTime);
                this.DiamondMgr.updateDiamond(this.line.position.x,this.line.position.y,this.lineMaxSize,this.lineMinSize,this.DiamondMgr,this.ScoreMgr);
                let data = {
                    score : this.ScoreMgr.getScore(),
                    comboCount:this.ScoreMgr.getComboCount(),
                    maxCombo : this.ScoreMgr.getMaxCombo(),
                };
                this.CheckPointMgr.updateCheck(this.line.position.x,this.line.position.y,this.halfSize,this.nowTime,data,this.DiamondMgr.getDiamondCount());
                //LineMgr.getInstance().addLine(this.line,this.linePool);
                //console.log(line.position.x + " ---- " + (this.terrainSumX + this.baseLinePostion.x + this.lineMinSize));
                //console.log(line.position.x + "-----" + this.terrainPerfectArr[this.terrainIdx]);
                // if(line.position.x === this.terrainPerfectArr[this.terrainIdx])
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
            // if (line != null) {
            //     line.parent = this.bg;
            // }

            if (this.nowDirecion === 0 || this.nowDirecion === 2) {
                //console.log(this.lineSumX + "!" + this.terrainSumX);
                if (((this.lineSumX >= this.terrainSumX + this.lineMaxSize) && (this.nowDirecion === 0)) || ((this.lineSumX <= this.terrainSumX - this.lineMaxSize) && (this.nowDirecion === 2))) {
                    this.terrainIdx++;
                    if(this.terrainIdx >= this.terrainArr.length)
                    {
                        //alert("发出胜利的声音");
                        this.bOver = true;
                        this.bgm.stop();
                        if(this.uiDie != null) {
                            let die = this.uiDie.getComponent('UIDie');
                            if (die != null) {
                                let data = {
                                    bgmName: this.bgmName,
                                    progress: ((this.nowTime / this.fullLength) * 100).toFixed(0),
                                    diamond: this.DiamondMgr.getDiamondCount(),
                                    maxCombo: this.ScoreMgr.getMaxCombo(),
                                    sumCombo: this.ScoreMgr.getComboCount(),
                                    point: this.ScoreMgr.getScore(),
                                    sceneName: this.sceneName,
                                    resumeChance: this.resumeChance,
                                    recordIdx: this.recordIdx,
                                    finish: true,
                                };
                                this.resumeChance -= 1;
                                die.setData(data);
                            }
                            this.uiDie.active = true;
                        }
                        return;
                    }
                    this.nowDirecion = parseInt(this.terrainArr[this.terrainIdx].slice(0, 1));
                    this.terrainSumY += ((this.terrainArr[this.terrainIdx].length - 1) * this.halfSize * 2 + this.halfSize) * this.directionArr[this.nowDirecion].y;
                    this.terrainSumX += this.halfSize * this.directionArr[parseInt(this.terrainArr[this.terrainIdx - 1].slice(0, 1))].x;
                }
                else {
                    //console.log(this.lineSumY + "---" + this.terrainSumY + "----Y");
                    if (this.lineSumY >= this.terrainSumY + this.halfSize - this.lineMaxSize || this.lineSumY <= this.terrainSumY - this.halfSize + this.lineMaxSize) {
                        console.log('die1');
                        this.bOver = true;
                        this.bBack = true;
                        this.bgm.pause();
                        if(this.uiDie != null)
                        {
                            let die = this.uiDie.getComponent('UIDie');
                            if(die != null)
                            {
                                let data = {
                                    bgmName: this.bgmName,
                                    progress: ((this.nowTime/this.fullLength) * 100).toFixed(0),
                                    diamond: this.DiamondMgr.getDiamondCount(),
                                    maxCombo: this.ScoreMgr.getMaxCombo(),
                                    sumCombo:this.ScoreMgr.getComboCount(),
                                    point:this.ScoreMgr.getScore(),
                                    sceneName:this.sceneName,
                                    resumeChance : this.resumeChance,
                                    recordIdx:this.recordIdx,
                                };
                                this.resumeChance -= 1;
                                die.setData(data);
                            }
                            this.uiDie.active = true;
                        }
//                        alert("发出GG的声音");
                    }
                }
            }
            else {
                //console.log(this.lineSumY + "!" + this.terrainSumY);
                if (((this.lineSumY >= this.terrainSumY + this.lineMaxSize) && (this.nowDirecion === 1)) || ((this.lineSumY <= this.terrainSumY - this.lineMaxSize) && (this.nowDirecion === 3))) {
                    this.terrainIdx++;
                    if(this.terrainIdx >= this.terrainArr.length)
                    {
                        //alert("发出胜利的声音");
                        this.bOver = true;
                        this.bgm.stop();
                        if(this.uiDie != null) {
                            let die = this.uiDie.getComponent('UIDie');
                            if (die != null) {
                                let data = {
                                    bgmName: this.bgmName,
                                    progress: ((this.nowTime / this.fullLength) * 100).toFixed(0),
                                    diamond: this.DiamondMgr.getDiamondCount(),
                                    maxCombo: this.ScoreMgr.getMaxCombo(),
                                    sumCombo: this.ScoreMgr.getComboCount(),
                                    point: this.ScoreMgr.getScore(),
                                    sceneName: this.sceneName,
                                    resumeChance: this.resumeChance,
                                    recordIdx: this.recordIdx,
                                    finish: true,
                                };
                                this.resumeChance -= 1;
                                die.setData(data);
                            }
                            this.uiDie.active = true;
                        }
                        return;
                    }
                    this.nowDirecion = parseInt(this.terrainArr[this.terrainIdx].slice(0, 1));
                    this.terrainSumX += ((this.terrainArr[this.terrainIdx].length - 1) * this.halfSize * 2 + this.halfSize)* this.directionArr[this.nowDirecion].x;
                    this.terrainSumY += this.halfSize * this.directionArr[parseInt(this.terrainArr[this.terrainIdx - 1].slice(0, 1))].y;
                }
                else {
                    //console.log(this.lineSumX + "---" + this.terrainSumX + "----X");
                    if (this.lineSumX >= this.terrainSumX + this.halfSize - this.lineMaxSize|| this.lineSumX <= this.terrainSumX - this.halfSize + this.lineMaxSize) {
                        console.log('die2');
                        this.bOver = true;
                        this.bBack = true;
                        this.bgm.pause();
                        if(this.uiDie != null)
                        {
                            let die = this.uiDie.getComponent('UIDie');
                            if(die != null)
                            {
                                let data = {
                                    bgmName: this.bgmName,
                                    progress: ((this.nowTime/this.fullLength) * 100).toFixed(0),
                                    diamond: this.DiamondMgr.getDiamondCount(),
                                    maxCombo: this.ScoreMgr.getMaxCombo(),
                                    sumCombo:this.ScoreMgr.getComboCount(),
                                    point:this.ScoreMgr.getScore(),
                                    sceneName:this.sceneName,
                                    resumeChance : this.resumeChance,
                                    recordIdx:this.recordIdx,
                                    finish:false,
                                };
                                this.resumeChance -= 1;
                                die.setData(data);
                            }
                            this.uiDie.active = true;
                        }
                        //alert("发出GG的声音");
                    }
                }
            }

            // let newX = -((this.line.position.x - this.baseLinePostion.x) * Math.cos(this.bg.rotation * Math.PI / 180) + (this.line.position.y - this.baseLinePostion.y) * Math.sin(this.bg.rotation * Math.PI / 180));
            // let newY = -(-(this.line.position.y - this.baseLinePostion.y) * Math.sin(this.bg.rotation * Math.PI / 180) + (this.line.position.x - this.baseLinePostion.x) * Math.cos(this.bg.rotation * Math.PI / 180));
            // //             // //let newX = this.bg.position.x - this.directionArr[this.nowDirecion].x * this.lineMinSize * 2;
            // //             // //let newY = this.bg.position.y - this.directionArr[this.nowDirecion].y * this.lineMinSize * 2;
            // this.constBG.position = new cc.Vec2(newX, newY);
            // this.bg.position = new cc.Vec2(newX,newY);
            // this.gp.node.position = new cc.Vec2(newX, newY);
//            console.log(this.bg.position);
//             console.log(new cc.Vec2(newX,newY));
        }
        if(this.stop)
        {
            this.waitTime += dt;
            // this.scoreLabel.string = this.stopTime +"";
            if(this.waitTime > 1) {
                this.waitTime = 0;
                this.stopTime -= 1;
            }
            this.scoreLabel.string = "得分：" + this.ScoreMgr.getScore();
        }
        else
        {
            this.stopTime = 3;
            this.scoreLabel.string = "得分：" + this.ScoreMgr.getScore();
        }

        if(this.terrainIdx >= this.buildTerrainIdx - this.preBuildCount * 2)
        {
            this.buildTerrain(this.buildTerrainIdx, false);
        }
    },

    buildTerrain(terrainIdx, revive)
    {
        if(this.preBuildCount === 0) return;

        // if(revive && terrainIdx > this.preBuildCount)
        // {
        //     terrainIdx -= this.preBuildCount;
        //
        //     console.log(terrainIdx);
        // }
        //console.log(terrainIdx);
        //删除一半旧的
        if(!revive) {
            if (terrainIdx > this.preBuildCount && terrainIdx < this.terrainArr.length - this.preBuildCount) {
                for (let o = 0; o < this.preBuildCount; o++) {
                    if (o < this.terrainBuildArr.length) {
                        for (let p = 0; p < this.terrainBuildArr[0].length; p++) {
                            this.terrainPool.put(this.terrainBuildArr[0][p]);
                        }
                        this.terrainBuildArr.shift();
                    }
                }
            }
        }

        let baseSumX = this.sumX;
        let baseSumY = this.sumY;

        let baseBuildSumX = this.buildSumX;
        let baseBuildSumY = this.buildSumY;

        let baseIdx = this.idx;

        //创建
        let count = this.preBuildCount;
        if(terrainIdx + count > this.terrainArr.length) {
            count = this.terrainArr.length - terrainIdx;
        }
        if(terrainIdx === 0 || revive)
        {
            count = this.preBuildCount * 3;
        }
        for (let i = terrainIdx; i < terrainIdx + count; i++) {
            let note = this.terrainArr[i].substr(0, 1);
            let perfectShow = null;
            switch (note) {
                case '0' :
                    this.direction = 0;
                    this.terrainPerfectArr.push(this.basePostion.y + (2 * this.sumY) * this.halfSize);
                    if(i !== 0) {
                        perfectShow = cc.instantiate(this.perfectShow);
                        if (perfectShow != null) {
                            perfectShow.position = new cc.Vec2(this.basePostion.x + (2 * this.sumX) * this.halfSize, this.basePostion.y + (2 * this.sumY) * this.halfSize);
                            perfectShow.zIndex = 996;
                            perfectShow.parent = this.bg;
                        }
                    }
                    break;
                case '1':
                    this.direction = 1;
                    this.terrainPerfectArr.push(this.basePostion.x + (2 * this.sumX) * this.halfSize);
                    if(i !== 0) {
                        perfectShow = cc.instantiate(this.perfectShow);
                        if (perfectShow != null) {
                            perfectShow.position = new cc.Vec2(this.basePostion.x + (2 * this.sumX) * this.halfSize, this.basePostion.y + (2 * this.sumY) * this.halfSize);
                            perfectShow.zIndex = 996;
                            perfectShow.parent = this.bg;
                        }
                    }
                    break;
                case '2':
                    this.direction = 2;
                    this.terrainPerfectArr.push(this.basePostion.y + (2 * this.sumY ) * this.halfSize);
                    if( i !== 0) {
                        perfectShow = cc.instantiate(this.perfectShow);
                        if (perfectShow != null) {
                            perfectShow.position = new cc.Vec2(this.basePostion.x + (2 * this.sumX) * this.halfSize, this.basePostion.y + (2 * this.sumY) * this.halfSize);
                            perfectShow.zIndex = 996;
                            perfectShow.parent = this.bg;
                        }
                    }
                    break;
                case '3':
                    this.direction = 3;
                    this.terrainPerfectArr.push(this.basePostion.x + (2 * this.sumX) * this.halfSize);
                    if( i !== 0) {
                        perfectShow = cc.instantiate(this.perfectShow);
                        if (perfectShow != null) {
                            perfectShow.position = new cc.Vec2(this.basePostion.x + (2 * this.sumX) * this.halfSize, this.basePostion.y + (2 * this.sumY) * this.halfSize);
                            perfectShow.zIndex = 996;
                            perfectShow.parent = this.bg;
                        }
                    }
                    break;
            }
            if (i > 0) {
                //console.log(this.terrainArr[i - 1]);
                this.buildSumX += ((this.terrainArr[i].length - 1) * this.halfSize * 2 + this.halfSize) * this.directionArr[this.direction].x + this.halfSize * this.directionArr[parseInt(this.terrainArr[i - 1].slice(0, 1))].x;
                this.buildSumY += ((this.terrainArr[i].length - 1) * this.halfSize * 2 + this.halfSize) * this.directionArr[this.direction].y + this.halfSize * this.directionArr[parseInt(this.terrainArr[i - 1].slice(0, 1))].y;
            }
            else {
                this.buildSumX += ((this.terrainArr[i].length - 1) * this.halfSize * 2 + this.halfSize) * this.directionArr[this.direction].x;
                this.buildSumY += ((this.terrainArr[i].length - 1) * this.halfSize * 2 + this.halfSize) * this.directionArr[this.direction].y;
            }
            let buildOnArr = new Array();
            let buildOnBgArr = new Array();

            let terrain;
            // let anotherTerrain;
            //
            // if(this.terrainBGPool.size() > 0)
            // {
            //     anotherTerrain = this.terrainBGPool.get();
            // }
            // else {
            //     anotherTerrain = cc.instantiate(this.baseBgTerrain);
            // }
            // anotherTerrain.setScale(new cc.Vec2(this.directionArr[this.direction].x === 0 ? 1.1 : this.terrainArr[i].length,this.directionArr[this.direction].y === 0 ? 1.1 : this.terrainArr[i].length));
            // anotherTerrain.parent = this.bg;
            // buildOnBgArr.push(anotherTerrain);

            if(this.terrainPool.size() > 0)
            {
                terrain = this.terrainPool.get();
            }
            else {
                terrain = cc.instantiate(this.baseterrain);
            }
            terrain.setScale(new cc.Vec2(this.directionArr[this.direction].x === 0 ? 1 : this.terrainArr[i].length,this.directionArr[this.direction].y === 0 ? 1 : this.terrainArr[i].length));
            terrain.position = new cc.Vec2(this.basePostion.x + (2 * this.sumX + (this.directionArr[this.direction].x === 0 ? 0 : this.terrainArr[i].length - 1)) * this.halfSize, this.basePostion.y + (2 * this.sumY + (this.directionArr[this.direction].y === 0 ? 0 : this.terrainArr[i].length - 1)) * this.halfSize);
            terrain.zIndex = 991;
            terrain.parent = this.constBG;
            buildOnArr.push(terrain);

            this.gp.moveTo(new cc.Vec2(terrain.position.x - terrain.scaleX * this.halfSize, terrain.position.y - terrain.scaleY * this.halfSize));
            this.gp.lineTo(new cc.Vec2(terrain.position.x - terrain.scaleX * this.halfSize, terrain.position.y + terrain.scaleY * this.halfSize));
            this.gp.lineTo(new cc.Vec2(terrain.position.x + terrain.scaleX * this.halfSize, terrain.position.y + terrain.scaleY * this.halfSize));
            this.gp.moveTo(new cc.Vec2(terrain.position.x - terrain.scaleX * this.halfSize, terrain.position.y - terrain.scaleY * this.halfSize));
            this.gp.lineTo(new cc.Vec2(terrain.position.x + terrain.scaleX * this.halfSize, terrain.position.y - terrain.scaleY * this.halfSize));
            this.gp.lineTo(new cc.Vec2(terrain.position.x + terrain.scaleX * this.halfSize, terrain.position.y + terrain.scaleY * this.halfSize));
            this.gp.stroke();

            //anotherTerrain.position = new cc.Vec2(terrain.position.x - 5 * this.directionArr[this.direction].x, terrain.position.y - 5 * this.directionArr[this.direction].y);

            for (let j = 0; j < this.terrainArr[i].length; j++) {
                let terrain;
                let location = new cc.Vec2(0,0);
                if (parseInt(this.terrainArr[i].substr(j, 1)) === 3) {
                    terrain = cc.instantiate(this.baseCPterrain);
                    this.sumX += this.directionArr[this.direction].x;
                    this.sumY += this.directionArr[this.direction].y;
                    terrain.position = new cc.Vec2(this.basePostion.x + (2 * this.sumX) * this.halfSize, this.basePostion.y + (2 * this.sumY) * this.halfSize);

                    this.CheckPointMgr.addCheckPoint(terrain.position.x, terrain.position.y, this.idx, this.direction, i, this.buildSumX, this.buildSumY,terrainIdx,baseSumX,baseSumY,baseBuildSumX,baseBuildSumY,baseIdx);
                    terrain.zIndex = 996;
                    terrain.parent = this.bg;
                    location = terrain.position;
                }
                else {
                    this.sumX += this.directionArr[this.direction].x;
                    this.sumY += this.directionArr[this.direction].y;
                    location = new cc.Vec2(this.basePostion.x + (2 * this.sumX) * this.halfSize, this.basePostion.y + (2 * this.sumY) * this.halfSize);
                }
                switch (parseInt(this.terrainArr[i].substr(j, 1)))
                {
                    case 2://宝石
                        let diamond = cc.instantiate(this.diamondBase);
                        diamond.position = new cc.Vec2(location.x + Math.random() * this.halfSize * this.diamondArea, location.y + Math.random() * this.halfSize * this.diamondArea);
                        this.DiamondMgr.addDiamond(diamond);
                        diamond.zIndex = 997;
                        diamond.parent = this.bg;
                        break;
                    case 4:
                        if (this.itemArr.length > 0 ) {
                            let item = cc.instantiate(this.itemArr[0]);
                            item.position = new cc.Vec2(location.x + this.itemPosArr[this.itemIdx < this.itemPosArr.length ? this.itemIdx : 0].x, location.y + this.itemPosArr[this.itemIdx < this.itemPosArr.length ? this.itemIdx : 0].y);
                            item.rotation = this.itemRotateArr[this.itemIdx < this.itemRotateArr.length ? this.itemIdx : 0];
                            item.setScale(new cc.Vec2(this.itemScaleArr[this.itemIdx < this.itemScaleArr.length ? this.itemIdx : 0]));
                            item.parent = this.constBG;
                            this.itemIdx++;
                        }
                        break;
                    case 5:
                        if (this.itemArr.length > 1 ) {
                            let item = cc.instantiate(this.itemArr[1]);
                            item.position = new cc.Vec2(location.x + this.itemPosArr[this.itemIdx < this.itemPosArr.length ? this.itemIdx : 0].x, location.y + this.itemPosArr[this.itemIdx < this.itemPosArr.length ? this.itemIdx : 0].y);
                            item.rotation = this.itemRotateArr[this.itemIdx < this.itemRotateArr.length ? this.itemIdx : 0];
                            item.setScale(new cc.Vec2(this.itemScaleArr[this.itemIdx < this.itemScaleArr.length ? this.itemIdx : 0]));
                            item.parent = this.constBG;
                            this.itemIdx++;
                        }
                        break;
                    case 6:
                        if (this.itemArr.length > 2 ) {
                            let item = cc.instantiate(this.itemArr[2]);
                            item.position = new cc.Vec2(location.x + this.itemPosArr[this.itemIdx < this.itemPosArr.length ? this.itemIdx : 0].x, location.y + this.itemPosArr[this.itemIdx < this.itemPosArr.length ? this.itemIdx : 0].y);
                            item.rotation = this.itemRotateArr[this.itemIdx < this.itemRotateArr.length ? this.itemIdx : 0];
                            item.setScale(new cc.Vec2(this.itemScaleArr[this.itemIdx < this.itemScaleArr.length ? this.itemIdx : 0]));
                            item.parent = this.constBG;
                            this.itemIdx++;
                        }
                        break;
                    case 7:
                        if (this.itemArr.length > 3 ) {
                            let item = cc.instantiate(this.itemArr[3]);
                            item.position = new cc.Vec2(location.x + this.itemPosArr[this.itemIdx < this.itemPosArr.length ? this.itemIdx : 0].x, location.y + this.itemPosArr[this.itemIdx < this.itemPosArr.length ? this.itemIdx : 0].y);
                            item.rotation = this.itemRotateArr[this.itemIdx < this.itemRotateArr.length ? this.itemIdx : 0];
                            item.setScale(new cc.Vec2(this.itemScaleArr[this.itemIdx < this.itemScaleArr.length ? this.itemIdx : 0]));
                            item.parent = this.constBG;
                            this.itemIdx++;
                        }
                        break;
                    case 8:
                        if (this.itemArr.length > 4 ) {
                            let item = cc.instantiate(this.itemArr[4]);
                            item.position = new cc.Vec2(location.x + this.itemPosArr[this.itemIdx < this.itemPosArr.length ? this.itemIdx : 0].x, location.y + this.itemPosArr[this.itemIdx < this.itemPosArr.length ? this.itemIdx : 0].y);
                            item.rotation = this.itemRotateArr[this.itemIdx < this.itemRotateArr.length ? this.itemIdx : 0];
                            item.setScale(new cc.Vec2(this.itemScaleArr[this.itemIdx < this.itemScaleArr.length ? this.itemIdx : 0]));
                            item.parent = this.constBG;
                            this.itemIdx++;
                        }
                        break;
                    case 9:
                        if (this.itemArr.length > 5) {
                            let item = cc.instantiate(this.itemArr[5]);
                            item.position = new cc.Vec2(location.x + this.itemPosArr[this.itemIdx < this.itemPosArr.length ? this.itemIdx : 0].x, location.y + this.itemPosArr[this.itemIdx < this.itemPosArr.length ? this.itemIdx : 0].y);
                            item.rotation = this.itemRotateArr[this.itemIdx < this.itemRotateArr.length ? this.itemIdx : 0];
                            item.setScale(new cc.Vec2(this.itemScaleArr[this.itemIdx < this.itemScaleArr.length ? this.itemIdx : 0]));
                            item.parent = this.constBG;
                            this.itemIdx++;
                        }
                        break;
                }
                this.idx++;
            }
            //this.terrainBGBuildArr.push(buildOnBgArr);
            this.terrainBuildArr.push(buildOnArr);
        }
        this.buildTerrainIdx += count;
        console.log(this.bg.childrenCount + " ____ " + this.constBG.childrenCount);
    }

});

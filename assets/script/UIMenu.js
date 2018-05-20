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
        sv:cc.ScrollView,
        sceneArr:[cc.String],
        spriteArr:[cc.Node],
        buttonArr:[cc.Button],
        progressArr:[cc.Label],
        upArrow:cc.Node,
        downArrow:cc.Node,
        uiRank:cc.Node,
        btnRank:cc.Button,
        btnExit:cc.Button,
        uiLoad:cc.Node,
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
        for(let i = 0; i < this.buttonArr.length; i ++)
        {
            this.buttonArr[i].node.on('click',function(){
                this.uiLoad.active = true;
                let sceneName =  this.sceneArr[i];
                let load = this.uiLoad.getComponent('UILoading');
                if(load != null)
                {
                    load.setLoadData(sceneName);
                }
            }.bind(this));

            this.progressArr[i].string = localStorage.getItem("record" + i) == null ? "0%" : localStorage.getItem("record" + i) + "%";
        }
    },

    start () {
        this.content = this.sv.content;
        // this.sv.node.on('scroll-began',function(){
        // }.bind(this));

        this.sv.node.on('scroll-ended',function(){
            let realOffset = this.sv.getScrollOffset().y/this.sv.getMaxScrollOffset().y;
            let autoIdx = Math.round(realOffset / (1 / (this.spriteArr.length - 1)));
            let autoOffset = autoIdx * (1 / (this.spriteArr.length - 1));
            for(let i = 0; i < this.spriteArr.length; i ++)
            {
                if(i !== autoIdx)
                {
                    this.spriteArr[i].setScale(0.6);
                    this.spriteArr[i].opacity = 153;
                }
                else {
                    this.spriteArr[i].setScale(1);
                    this.spriteArr[i].opacity = 255;
                    // this.spriteArr[i].Size = new cc.Vec2(800,404);
                }
            }
            this.upArrow.active = autoIdx !== 0;
            this.downArrow.active = autoIdx !== this.spriteArr.length - 1;
            this.sv.scrollToPercentVertical(1 - autoOffset,2);
        }.bind(this));

        this.btnRank.node.on('click',function(){
            this.uiRank.active = true;
        }.bind(this));
    },

    update (dt) {
    },
});

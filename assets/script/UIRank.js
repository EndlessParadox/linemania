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
        spriteArr:[cc.Node],
        progressArr:[cc.Label],
        upArrow:cc.Node,
        downArrow:cc.Node,
        btnExit:cc.Node,
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
        for(let i = 0; i < this.progressArr.length; i ++)
        {

            this.progressArr[i].string = localStorage.getItem("record" + i) == null ? "完成度0%" : "完成度" +localStorage.getItem("record" + i) + "%";
        }
    },

    start () {
        this.sv.node.on('scroll-ended',function(){
            let realOffset = Math.abs(this.sv.getScrollOffset().x)/this.sv.getMaxScrollOffset().x;
            let autoIdx = Math.round(realOffset / (1 / (this.spriteArr.length - 1)));
            let autoOffset = autoIdx * (1 / (this.spriteArr.length - 1));
            for(let i = 0; i < this.spriteArr.length; i ++)
            {
                if(i !== autoIdx)
                {
                    this.spriteArr[i].setScale(0.6);
                }
                else {
                    this.spriteArr[i].setScale(1);
                    // this.spriteArr[i].Size = new cc.Vec2(800,404);
                }
            }
            this.upArrow.active = autoIdx !== 0;
            this.downArrow.active = autoIdx !== this.spriteArr.length - 1;
            this.sv.scrollToPercentHorizontal(autoOffset,1);
        }.bind(this));

        this.btnExit.on('click',function(){
            this.node.active = false;
        }.bind(this));
    },

    // update (dt) {},
});

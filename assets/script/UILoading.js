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
        pg:cc.ProgressBar,
        mark:cc.Node,
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
         this.pg.progress = 0;
     },

    start () {

    },

    setLoadData(sceneName)
    {
        let self = this;
        cc.loader.onProgress = function(completedCount,totalCount,item){
            if(totalCount !== 0) {
                let pg = (completedCount / totalCount).toFixed(2);
                if (self.pg != null && pg != null) {
                    self.pg.progress = pg;
                }
            }
        };
        cc.director.preloadScene(sceneName,function(){
            cc.director.loadScene(sceneName);
        });
    },

    update (dt) {
        if(this.pg.progress != null) {
            this.mark.position = new cc.Vec2(this.pg.node.position.x - this.pg.totalLength / 2 + this.pg.totalLength * this.pg.progress, this.pg.node.position.y);
        }
    },
});

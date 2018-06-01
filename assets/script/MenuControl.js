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
        sceneIdx:0,
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
        cc.game.addPersistRootNode(this.node);
    },

    start () {

    },

    setSceneIdx(idx)
    {
        this.sceneIdx = idx;
        cc.director.loadScene("MenuScene",this.onLoadComplete.bind(this));
    },

    onLoadComplete()
    {
        let menuNode = cc.find("Canvas/UIMenu");
        if(menuNode != null)
        {
            let uiMenu = menuNode.getComponent("UIMenu");
            if(uiMenu != null)
            {
                uiMenu.setIdx(this.sceneIdx);
            }
        }
    },

    getSceneIdx()
    {
        return this.sceneIdx;
    },

    // update (dt) {},
});

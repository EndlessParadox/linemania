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
        levelShow:cc.Sprite,
        levelImgs:[cc.SpriteFrame],
        uiLoad:cc.Node,
        uiMenu:cc.Node,
        uiStars:cc.Node,
        uiBack:cc.Node,
        progressArr:[cc.ProgressBar],
        progressLabelArr:[cc.Label],
        btnLevel:[cc.Button],
        sceneName:'',
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
        this.uiBack.on('click',function()
        {
            this.node.active = false;
        }.bind(this));

        let self = this;
        for(let i = 0; i < this.btnLevel.length; i ++)
        {
            this.btnLevel[i].node.on('click',function()
            {
                let sceneName = '';
                switch (i)
                {
                    case 0:
                        sceneName = self.sceneName + "_Easy";
                        break;
                    case 1:
                        sceneName = self.sceneName + "_Normal";
                        break;
                    case 2:
                        sceneName = self.sceneName + "_Hard";
                        break;
                }

                let load = self.uiLoad.getComponent('UILoading');
                if(load != null)
                {
                    load.setLoadData(sceneName);
                }
            }).bind(this);
        }
    },

    start () {
    },

    setData(data)
    {
        if(data != null)
        {
            console.log(data);
            this.levelShow.spriteFrame = this.levelImgs[data.level];

            let count = 0;
            for(let i = 0; i < data.recordArr.length; i ++)
            {
                this.progressArr[i].progress = data.recordArr[i] / 100;
                this.progressLabelArr[i].string = data.recordArr[i] + "%";
                if(data.recordArr[i] === 100)
                {
                    count ++;
                }
            }

            for ( let o = 0; o < this.uiStars.children.length; o ++)
            {
                this.uiStars.children[o].active = o < count;
            }

            this.sceneName = data.sceneName;
        }
    }

    // update (dt) {},
});

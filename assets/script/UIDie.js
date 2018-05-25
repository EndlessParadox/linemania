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
        bgmName:cc.Label,
        level:cc.Label,
        progress:cc.Label,
        progressBar:cc.ProgressBar,
        diamond:cc.Label,
        maxCombo:cc.Label,
        sumCombo:cc.Label,
        point:cc.Label,
        btnBack:cc.Button,
        btnShare:cc.Button,
        btnRestart:cc.Button,
        shareShow:cc.Node,
        gameView:cc.Node,
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

    // onLoad () {},

    start () {

        this.btnBack.node.on('click',function()
        {
            cc.director.loadScene("MenuScene");
        }.bind(this));
        this.btnShare.node.on('click',function()
        {
            let self = this;
            if(window.wx != null) {
                wx.shareAppMessage({
                    title: '我要分享',
                    success: function (res) {
                        console.log('拉起分享 成功');
                        console.log(res);
                        if (self.shareShow.active === false) {
                            self.shareShow.active = true;
                            setTimeout(function () {
                                self.node.active = false;
                                if (self.gameView != null) {
                                    self.shareShow.active = false;
                                    let build = self.gameView.getComponent('TerrianBuild');
                                    if (build != null) {
                                        build.resumeGame();
                                    }
                                }
                            }, 1000);
                        }
                    },
                    fail: function (res) {
                        console.log('拉起分享 失败');
                        console.log(res);
                    }
                });
            }else {
                if (self.shareShow.active === false) {
                    self.shareShow.active = true;
                    setTimeout(function () {
                        self.node.active = false;
                        if (self.gameView != null) {
                            self.shareShow.active = false;
                            let build = self.gameView.getComponent('TerrianBuild');
                            if (build != null) {
                                build.resumeGame();
                            }
                        }
                    }, 1000);
                }
            }
        }.bind(this));
        this.btnRestart.node.on('click',function()
        {
            if(this.sceneName != null)
            {
                cc.director.loadScene(this.sceneName);
            }
        }.bind(this));
    },

    setData(data)
    {
        if(data.progress > 100)
        {
            data.progress = 100;
        }
        this.bgmName.string = data.bgmName;
        this.progress.string = data.progress + '%';
        this.progressBar.progress = data.progress / 100;
        this.diamond.string = data.diamond;
        this.maxCombo.string = data.maxCombo;
        this.sumCombo.string = data.sumCombo;
        this.point.string = data.point;
        this.sceneName = data.sceneName;
        this.recordIdx = data.recordIdx;
        this.recordLevelIdx = data.recordLevelIdx;
        this.record = data.progress;
        this.finish = data.finish;
        if(data.resumeChance === 0 )
        {
            this.btnShare.enabled = false;
        }
        if(this.finish)
        {
            this.btnShare.enabled = false;
        }
        
        switch (data.recordLevelIdx)
        {
            case 0:
                this.level.string = "简单";
                break;
            case 1:
                this.level.string = "普通";
                break;
            case 2:
                this.level.string = "困难";
                break;
        }
        let newRecord = this.record;
        let recordIdx = this.recordIdx;
        // wx.getStorage({
        //     key: 'record' + recordIdx,
        //     success: function(res) {
        //         if(!isNaN(res.data)) {
        //             wx.setStorage({
        //                 key: 'record' + recordIdx,
        //                 data: Math.max(parseInt(newRecord), parseInt(res.data)),
        //             })
        //         }
        //         else {
        //             wx.setStorage({
        //                 key:'record' + recordIdx,
        //                 data:parseInt(newRecord),
        //             })
        //         }
        //     },
        //     fail:function(res)
        //     {
        //     },
        // });


        let record = localStorage.getItem('record' + this.recordIdx);
        if(record != null)
        {
            localStorage.setItem('record' + this.recordIdx + "_" + this.recordLevelIdx,Math.max(parseInt(record),parseInt(this.record)));
        }
        else
        {
            localStorage.setItem('record' + this.recordIdx + "_" + this.recordLevelIdx,parseInt(this.record));
        }
    }

    // update (dt) {},
});

/*
 * @Author: Administrator
 * @Date:   2016-01-31 13:17:57
 * @Last Modified by:   Administrator
 * @Last Modified time: 2016-01-31 14:48:09
 */

function Stars(option) {
  this.canvasX = option.canvasX || 0; //画布横坐标
  this.canvasY = option.canvasY || 0; //画布纵坐标
  this.canvasWidth = option.canvasWidth || 600; //画布宽度
  this.canvasHeight = option.canvasHeight || 600; //画布高度
  this.fillStyle = option.fillStyle || '#fff'; //背景填充颜色
  this.bgPicPath = option.bgPicPath || ''; //背景图片路径
  this.bgPicWidth = option.bgPicWidth || 600; //背景图片宽度
  this.bgPicHeight = option.bgPicHeight || 600; //背景图片高度
  this.bgPicX = option.bgPicX || 0; //背景图片在画布中的横坐标
  this.bgPicY = option.bgPicY || 0; //背景图片在画布中的纵坐标
  this.starPath = option.starPath || ''; //星星图片路径
  this.starNum = option.starNum || 30; //星星个数
  this.canvas = option.canvas; //画布
  this.ctx = option.ctx; //画布控制权
}
Stars.prototype = {
  init: function() {
    this.bgPic = new Image();
    this.bgPic.src = this.bgPicPath;
    this.starPic = new Image();
    this.starPic.src = this.starPath;
    this.picNo = 0; //星星的第几帧
    this.alive = 0; //星星透明度系数
    this.arrStarX = []; //所有星星横坐标数组
    this.arrStarY = []; //所有星星纵坐标数组
    this.canvasRangeX = (this.canvasX + this.canvasWidth); //画布横坐标范围
    this.canvasRangeY = (this.canvasY + this.canvasHeight); //画布纵坐标范围
    this.startTime = 0;
    this.deltaTime = 0;
    this.totalTime = 0;
    this.startTime = Date.now();
    for (var i = 0; i < this.starNum; i++) { //随机产生星星的坐标
      this.arrStarX[i] = Math.floor((Math.random() * this.bgPicWidth + this.bgPicX));
      this.arrStarY[i] = Math.floor((Math.random() * this.bgPicHeight + this.bgPicY));
    }
    this.mousemove(); //监视鼠标滚动
    this.gameloop(); //循环画图

  },

  gameloop: function() { //循环画图
    var that = this;

    function repeat() {
      // console.log(arguments);
      requestAnimFrame(arguments.callee);
      var now = Date.now();
      that.deltaTime = now - that.startTime;
      that.startTime = now;
      that.totalTime += that.deltaTime;
      // console.log(that.totalTime);
      if (that.totalTime > 100) {
        that.totalTime = 0;
        that.clearCanvas();
        that.fillCanvas();
        that.drawPic();
        that.drawStar();
      }
    }
    repeat();


  },
  clearCanvas: function() {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  },
  fillCanvas: function() { //绘制画布填充颜色
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.fillRect(0, 0, this.canvasRangeX, this.canvasRangeY);
  },
  drawPic: function() { //绘制背景图片
    this.ctx.drawImage(this.bgPic, this.bgPicX, this.bgPicY, this.bgPicWidth, this.bgPicHeight);
  },
  drawStar: function() { //绘制星星
    for (var i = 0; i < this.starNum; i++) {
      //让星星移动
      this.arrStarX[i] += (Math.random() * 2 - 1);
      this.arrStarY[i] += (Math.random() * 6 - 3);
      //如果星星超出背景图片范围则重新生成一个坐标
      if (this.arrStarX[i] < this.bgPicX || this.arrStarX[i] > (this.bgPicX + this.bgPicWidth) || this.arrStarY[i] < this.bgPicY || this.arrStarY[i] > (this.bgPicY + this.bgPicHeight)) {
        this.arrStarX[i] = Math.floor((Math.random() * this.bgPicWidth + this.bgPicX));
        this.arrStarY[i] = Math.floor((Math.random() * this.bgPicHeight + this.bgPicY));
      }
      //随机绘制星星第几帧
      this.picNo = Math.floor(Math.random() * 7);
      ctx.save();
      //随机设置星星透明度
      ctx.globalAlpha = Math.random() * this.alive;
      //
      ctx.drawImage(this.starPic, this.picNo * 7, 0, 7, 7, this.arrStarX[i], this.arrStarY[i], 7, 7);
      ctx.restore();
    }

  },

  mousemove: function(e) {
    var that = this;
    document.onmousemove = function(e) {
      if (e.offsetX || e.layerX) {
        var px = e.offsetX == undefined ? e.layerX : e.offsetX;
        var py = e.offsetY == undefined ? e.layerY : e.offsetY;
        //检测鼠标是否在背景图片内
        if (px > (that.canvasX + that.bgPicX) && px < (that.canvasX + that.bgPicX + that.bgPicWidth) && py > (that.canvasY + that.bgPicY) && py < (that.canvasY + that.bgPicY + that.bgPicHeight)) {
          that.alive += 0.04;
          if (that.alive > 1) {
            that.alive = 1;
          }
        } else {
          that.alive -= 0.04;
          if (that.alive < 0) {
            that.alive = 0;
          }
        }

      }

    }
  }
}


window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
      return window.setTimeout(callback, 1000 / 60);
    };
})();

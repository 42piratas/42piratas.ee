//------------------
var stats = new Stats();
stats.showPanel( 1 );
document.body.appendChild( stats.dom );
//------------------

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = (canvas.width =500), cx = cw / 2;
var ch = (canvas.height =500), cy = ch / 2;

var m = { x: 0, y: 0 };
var target = { x: 0, y: 0 };
var speed = 0.0005;
var easing = 0.90;

var frames = 0;

var balls = [];
var vp = { x: cx, y: cy }; //vanishing point
var fl = 250; // focal length

function Ball(R) {
 
  this.R = R;
  this.r = .04*this.R;
  
  // 3D position
  this.pos = spherePointPicking(this.R)

  // 2D position
  this.x = this.pos.x + cx;
  this.y = this.pos.y + cy;
  this.a = { x: 0, y: 0 };
  this.scale = { x: 1, y: 1 };
  this.c =  oGrd(this.r/2, 210);

  this.rotateX = function(angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var y1 = this.pos.y * cos - this.pos.z * sin;
    var z1 = this.pos.z * cos + this.pos.y * sin;

    this.pos.y = y1;
    this.pos.z = z1;
  };

  this.rotateY = function(angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var x1 = this.pos.x * cos - this.pos.z * sin;
    var z1 = this.pos.z * cos + this.pos.x * sin;

    this.pos.x = x1;
    this.pos.z = z1;
  };

  this.draw3D = function() {
    if (this.pos.z > -fl) {
      var scale = fl / (fl - this.pos.z);

      this.scale = { x: scale, y: scale };
      this.x = vp.x + this.pos.x * scale;
      this.y = vp.y + this.pos.y * scale;
      this.visible = true;
    } else {
      this.visible = false;
    }
  };

 this.draw2D = function() {
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale.x, this.scale.y);
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.fillRect(0, 0, this.r, this.r);
    ctx.restore();
  };
}

for (var i = 0; i < 1000; i++) {
  balls.push(new Ball(150));
  balls.push(new Ball(75));
}

function Draw() {
  t = new Date().getTime() / 127;
  
	stats.begin();
  
  ctx.clearRect(0, 0, cw, ch);
  
  frames+=.1;
  //t = new Date().getTime() / 127;
  m.x = cx + Math.cos(t / 43 + Math.cos(t / 47 + frames)) * 8;
  m.y = cy + Math.sin(t / 31 + Math.cos(t / 37 + frames)) * 8;
  
  target.x = (m.y - vp.y) * speed;
  target.y = (m.x - vp.x) * speed;
  
  

  balls.map(function(b) {
    b.draw3D();
  });
  balls.sort(function(a, b) {
    return a.pos.z - b.pos.z;
  });

  target.x *= easing;
  target.y *= easing;
  
 
  
  balls.map(function(b) {
    b.rotateX(target.x);
    b.rotateY(target.y);
    if (b.visible) {
      b.draw2D();
    }
  });
  
  stats.end();
  
  requestId = window.requestAnimationFrame(Draw);
}
Draw();



function oGrd(r, h) {
  grd = ctx.createRadialGradient(r,r,0,r,r,r);

  grd.addColorStop(0, "hsla(" + h + ",95%,95%, 1)");
  grd.addColorStop(0.4, "hsla(" + h + ",95%,45%,.5)");
  grd.addColorStop(1, "hsla(" + h + ", 95%, 45%, 0)");

  return grd;
}


function spherePointPicking(R){
  //How to generate random points on a sphere:
  //https://math.stackexchange.com/questions/1585975/how-to-generate-random-points-on-a-sphere#1586185
  var u1 = Math.random();
  var u2 = Math.random();
  var s = Math.acos(2*u1 - 1) - Math.PI/2;  
  var t = 2*Math.PI*u2;
  
  return {x : R * Math.cos(s) * Math.cos(t),
          y : R * Math.cos(s) * Math.sin(t),
          z : R * Math.sin(s)
          }
}
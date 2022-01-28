var grid;
var next;

var dA = 1;
var dB = 0.5;
var feed = 0.055;
var k = 0.062;

var conv = [[0.05,0.2,0.05],
            [0.2 ,-1 ,0.2 ],
            [0.05,0.2,0.05]];

function setup() {
  createCanvas(200, 200);
  pixelDensity(1);
  grid = [];
  next = [];
  for(var x=0;x<width;x++){
    grid[x]=[];
    next[x]=[];
    for(var y=0;y<height;y++){
      grid[x][y] = {a: 1, b: 0};
      next[x][y] = {a: 1, b: 0};
    }
  }
  for(var i=100; i<110; i++){
    for(var j=100; j<110; j++){
      grid[i][j].b=1;
    }
  }
  
}

function draw() {
  background(45);
  for(var x=0;x<width;x++){
    for(var y=0;y<height;y++){
      var a = grid[x][y].a;
      var b = grid[x][y].b;
      next[x][y].a = a + dA * laplaceA(x,y) - a * b * b + feed * (1 - a);
      next[x][y].b = b + dB * laplaceB(x,y) + a * b * b - (k + feed) * b;
      
      next[x][y].a = constrain(next[x][y].a, 0, 1);
      next[x][y].b = constrain(next[x][y].b, 0, 1);
    }
  }
  
  loadPixels();
  for(var x=0;x<width;x++){
    for(var y=0;y<height;y++){
      var pix = (x + y * width) * 4;
      var a = next[x][y].a;
      var b = next[x][y].b;
      var c = floor((a - b) * 255);
      c = constrain(c, 0, 255);
      pixels[pix + 0] = c;
      pixels[pix + 1] = c;
      pixels[pix + 2] = c;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();
  
  swap();
}

function mouseDragged(){
  grid[floor(mouseX)][floor(mouseY)].b=1;
}

function swap(){
  var temp = grid;
  grid = next;
  next = temp;
}
function laplaceA(x,y){
  var sumA = 0;
  for(var i = -1;i<=1;i++){
    for(var j = -1; j<=1;j++){
      if(x+i>0 && x+i<width && y+j>0 && y+j<height)
        sumA+=grid[x+i][y+j].a * conv[i+1][j+1];
    }
  }
  return sumA;
}
function laplaceB(x,y){
  var sumB = 0;
  for(var i = -1;i<=1;i++){
    for(var j = -1; j<=1;j++){
      if(x+i>0 && x+i<width && y+j>0 && y+j<height)
        sumB+=grid[x+i][y+j].b * conv[i+1][j+1];
    }
  }
  return sumB;
}
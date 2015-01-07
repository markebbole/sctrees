//require('./Vector2');

var Branch = function(parent, position, direction, length) {
    this.parent = parent;
    this.direction = direction;
    this.origDirection = direction;
    this.position = position;
    this.length = length;
    this.growCount = 0;
    this.width = 0;
}


var AttractionPoint = function(x, y) {
    this.position = new Vector2(x, y);
    this.closestBranch = null;
    this.closestBranchDistance = 0;
}

var Tree = function() {
    this.MAX_DISTANCE = 15; //how far leaf can be to attract branch
    this.MIN_DISTANCE = 5; //if branch less than this distance to leaf, leaf removed
    this.TRUNK_HEIGHT = 50;
    this.BRANCH_LENGTH = 2;
    this.START_POSITION = new Vector2(200, 310);

    this.branches = new Array();
    this.points = new Array();
}

Tree.prototype.growTrunk = function() {
    var root = new Branch(null, this.START_POSITION, new Vector2(0, -1), this.BRANCH_LENGTH);
    var current = root;
    this.branches.push(root);
    //console.log(current.position);
    while(Math.abs(current.position.y - root.position.y) < this.TRUNK_HEIGHT) {
        var tmpBranch = new Branch(current, current.position.plus(new Vector2(0, -this.BRANCH_LENGTH)), new Vector2(0, -1), this.BRANCH_LENGTH);
        //console.log(tmpBranch);
        this.branches.push(tmpBranch);
        current = tmpBranch;
        //console.log(current.position.y - root.position.y);
    }
   // console.log(this.branches);
}

Tree.prototype.makeAttractionPoints = function() {
    for(var i = 0; i < 800; i++) {
        var angle = Math.random() * Math.PI * 2;
        var radius = 100;
        var x = 200+Math.cos(angle) * Math.random() * radius;
        var y = 180+Math.sin(angle) * Math.random() * radius;
        this.points.push(new AttractionPoint(x, y));
    }
}

Tree.prototype.grow = function() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 500, 500);
    for(var i in this.points) {
        var removed = false;
        for(var k in this.branches) {
            var directionVector = this.points[i].position.minus(this.branches[k].position);
            var distance = directionVector.length();

            if(distance > this.MAX_DISTANCE) {
                continue;
            }

            if(distance < this.MIN_DISTANCE) {
                this.points.splice(i, 1);
                removed = true;
                i--;
                break;
                
            }

            if(this.points[i].closestBranch == null ||
                distance < this.points[i].closestBranchDistance) {
                this.points[i].closestBranch = this.branches[k];
                this.points[i].closestBranchDistance = distance;
            }
        }
        //found closest
        if(!removed && this.points[i].closestBranch != null) {
            var norm = this.points[i].position.minus(this.points[i].closestBranch.position).normalize();
            this.points[i].closestBranch.direction = this.points[i].closestBranch.direction.plus(norm);
            
            //ctx.beginPath();
           // ctx.moveTo(this.points[i].position.x, this.points[i].position.y);
           // ctx.lineTo(this.points[i].closestBranch.position.x, this.points[i].closestBranch.position.y);
           // ctx.stroke();

            this.points[i].closestBranch.growCount ++;
        }
    }

    //go through branches and make new branches for ones with grow count > 0
    for(var k in this.branches) {
        if(this.branches[k].growCount > 0) {
            var avgDir = this.branches[k].direction.divideBy(this.branches[k].growCount);
            avgDir = avgDir.normalize();
            avgDir = avgDir.multiplyBy(this.branches[k].length);
            var newBranch = new Branch(this.branches[k], this.branches[k].position.plus(avgDir), avgDir.normalize(), this.BRANCH_LENGTH);
            this.branches.push(newBranch);
            this.branches[k].direction = this.branches[k].origDirection;
            this.branches[k].growCount = 0;
        }
    }
}

Tree.prototype.calculateWidths = function() {
    for(var i = this.branches.length-1; i >= 0; i--) {
        if(this.branches[i].width == 0) {
            this.branches[i].width = .2;
        } 
        if(this.branches[i].parent != null)
            this.branches[i].parent.width += this.branches[i].width;
    }
}

Tree.prototype.generateLeaves = function(numLeaves) {
    for(var i = this.branches.length -1; i>= this.branches.length/2; i--) {
        console.log('hell');
        if(Math.random() > .6) {
            console.log('hi');
            ctx.lineStyle = 'green';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(5, 5);
           //ctx.moveTo(this.branches[i].position.x, this.branches[i].position.y);
            var randAngle = 2*Math.PI*Math.random();
            //ctx.lineTo(this.branches[i].position.x+Math.cos(randAngle)*2, this.branches[i].position.y+Math.sin(randAngle)*2);
            ctx.lineTo(0, 0);
            ctx.stroke();
        }
    }
}

var ctx;
var t;
window.onload = function() {
    ctx = document.getElementById('canvas').getContext('2d');
    t = new Tree();
    t.growTrunk();
    t.makeAttractionPoints();
    window.addEventListener('keydown', growTree, true);
}

function growTree(event) {
    if(event.keyCode == 32) {
        t.calculateWidths();
        t.generateLeaves(50);
    }
    t.grow();

    drawVectorPoints(t.points);
    //drawVectorPoints(t.branches);
    connectBranches(t.branches);

    
}


function drawVectorPoints(points) {
    for(var i in points) {
        ctx.fillStyle = 'green';
        ctx.fillRect(points[i].position.x, points[i].position.y, 2, 2);
    }
}

function connectBranches(branches) {

    for(var i in branches) {
        ctx.lineStyle = 'red';
        if(branches[i].parent != null) {
            ctx.lineWidth = 2*Math.sqrt(branches[i].width);
            ctx.beginPath();
            ctx.moveTo(branches[i].position.x, branches[i].position.y);
            ctx.lineTo(branches[i].parent.position.x, branches[i].parent.position.y);
            ctx.stroke();
        }
    }
}
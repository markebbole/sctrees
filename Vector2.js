var Vector2 = function(x, y) {
    this.x = x;
    this.y = y;
}

Vector2.zero = new Vector2(0, 0);

Vector2.prototype.plus = function() {
    var sum = new Vector2(this.x, this.y);
    for(var i in arguments) {
        sum.x += arguments[i].x;
        sum.y += arguments[i].y;
    }
    return sum;
}

Vector2.prototype.minus = function() {
    var sum = new Vector2(this.x, this.y);
    for(var i in arguments) {
        sum.x -= arguments[i].x;
        sum.y -= arguments[i].y;
    }
    return sum;
}

Vector2.prototype.multiplyBy = function(quantity) {
    var copy = new Vector2(this.x, this.y);
    copy.x *= quantity;
    copy.y *= quantity;
    return copy;
}

Vector2.prototype.divideBy = function(quantity) {
    if (quantity == 0) {
        throw "cannot divide by 0";
    } else {
        var copy = new Vector2(this.x, this.y);
        copy.x /= quantity;
        copy.y /= quantity;
        return copy;
    }

}

Vector2.prototype.normalize = function() {
    var len = this.length();

    this.x = (1.0*this.x)/len;
    this.y = (1.0*this.y)/len;
    return this;
}
  
Vector2.prototype.length = function() {
    return Math.sqrt(
        Math.pow(this.x, 2) + Math.pow(this.y, 2));
}

//exports.Vector2 = Vector2;
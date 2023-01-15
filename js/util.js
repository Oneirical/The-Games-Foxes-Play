function tryTo(description, callback){
    for(let timeout=1000;timeout>0;timeout--){
        if(callback()){
            return;
        }
    }
    throw 'Timeout while trying to '+description;
}


function randomRange(min, max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

function randomRangeTwo(min,max){
    let x = 0;
    let y = 0;
    while (true){
        x = Math.floor(Math.random()*(max-min+1))+min;
        y = Math.floor(Math.random()*(max-min+1))+min;
        if (x != y) break;
    }
    return [x,y];
}

function shuffle(arr){
    let temp, r;
    for (let i = 1; i < arr.length; i++) {
        r = randomRange(0,i);
        temp = arr[i];
        arr[i] = arr[r];
        arr[r] = temp;
    }
    return arr;
}

function rightPad(textArray){
    let finalText = "";
    textArray.forEach(text => {
        text+="";
        for(let i=text.length;i<10;i++){
            text+=" ";
        }
        finalText += text;
    });
    return finalText;
}

function removeItemOnce(arr, value) {
    let index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

function mode(numbers) {
    // as result can be bimodal or multi-modal,
    // the returned result is provided as an array
    // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
    let modes = [], count = [], i, number, maxIndex = 0;
 
    for (i = 0; i < numbers.length; i += 1) {
        number = numbers[i];
        count[number] = (count[number] || 0) + 1;
        if (count[number] > maxIndex) {
            maxIndex = count[number];
        }
    }
    for (i in count)
        if (count.hasOwnProperty(i)) {
            if (count[i] === maxIndex) {
                modes.push(Number(i));
            }
        }
 
    return modes[Math.floor(Math.random() * modes.length)];
}

function findCommonElement(array1, array2) {
     
    // Loop for array1
    for(let i = 0; i < array1.length; i++) {
         
        // Loop for array2
        for(let j = 0; j < array2.length; j++) {
             
            // Compare the element of each and
            // every element from both of the
            // arrays
            if(array1[i] === array2[j]) {
             
                // Return if common element found
                return true;
            }
        }
    }
     
    // Return if no common element exist
    return false;
}

function isArrayInArray(arr, item){
    var item_as_string = JSON.stringify(item);
  
    var contains = arr.some(function(ele){
      return JSON.stringify(ele) === item_as_string;
    });
    return contains;
  }

function removeItemAll(arr, value) {
    let i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

  function toTitleCase(str) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  }

function sign(p1, p2, p3){
    return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
}

function inTriangle(pt, v1, v2, v3){
    b1 = sign(pt, v1, v2) < 0.0;
    b2 = sign(pt, v2, v3) < 0.0;
    b3 = sign(pt, v3, v1) < 0.0;
    return ((b1 == b2) && (b2 == b3));
}

function reverseString(str) {
    return str.split( '' ).reverse( ).join( '' );
}


function firstDigit(n)
	{
		while (n >= 10)
			n /= 10;
		return Math.floor(n);
	}
function lastDigit(n)
	{
		return Math.floor(n % 10);
	}

// Original JavaScript code by Chirp Internet: chirpinternet.eu
// Please acknowledge use of this code by including this header.
// Copyright (c) 2023, Chirp Internet

class MazeBuilder {

      constructor(width, height) {
    
        this.width = width;
        this.height = height;
    
        this.cols = 2 * this.width + 1;
        this.rows = 2 * this.height + 1;
    
        this.maze = this.initArray([]);
    
        // place initial walls
        this.maze.forEach((row, r) => {
          row.forEach((cell, c) => {
            switch(r)
            {
              case 0:
              case this.rows - 1:
                this.maze[r][c] = ["wall"];
                break;
    
              default:
                if((r % 2) == 1) {
                  if((c == 0) || (c == this.cols - 1)) {
                    this.maze[r][c] = ["wall"];
                  }
                } else if(c % 2 == 0) {
                  this.maze[r][c] = ["wall"];
                }
    
            }
          });
    
        });
    
        // start partitioning
        this.partition(1, this.height - 1, 1, this.width - 1);
      }
    
      initArray(value) {
        return new Array(this.rows).fill().map(() => new Array(this.cols).fill(value));
      }
    
      rand(min, max) {
        return min + Math.floor(Math.random() * (1 + max - min));
      }
    
      posToSpace(x) {
        return 2 * (x-1) + 1;
      }
    
      posToWall(x) {
        return 2 * x;
      }
    
      inBounds(r, c) {
        if((typeof this.maze[r] == "undefined") || (typeof this.maze[r][c] == "undefined")) {
          return false; // out of bounds
        }
        return true;
      }
    
      shuffle(array) {
        // sauce: https://stackoverflow.com/a/12646864
        for(let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }
    
      partition(r1, r2, c1, c2) {
        // create partition walls
        // ref: https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
    
        let horiz, vert, x, y, start, end;
    
        if((r2 < r1) || (c2 < c1)) {
          return false;
        }
    
        if(r1 == r2) {
          horiz = r1;
        } else {
          x = r1+1;
          y = r2-1;
          start = Math.round(x + (y-x) / 4);
          end = Math.round(x + 3*(y-x) / 4);
          horiz = this.rand(start, end);
        }
    
        if(c1 == c2) {
          vert = c1;
        } else {
          x = c1 + 1;
          y = c2 - 1;
          start = Math.round(x + (y - x) / 3);
          end = Math.round(x + 2 * (y - x) / 3);
          vert = this.rand(start, end);
        }
    
        for(let i = this.posToWall(r1)-1; i <= this.posToWall(r2)+1; i++) {
          for(let j = this.posToWall(c1)-1; j <= this.posToWall(c2)+1; j++) {
            if((i == this.posToWall(horiz)) || (j == this.posToWall(vert))) {
              this.maze[i][j] = ["wall"];
            }
          }
        }
    
        let gaps = this.shuffle([true, true, true, false]);
    
        // create gaps in partition walls
    
        if(gaps[0]) {
          let gapPosition = this.rand(c1, vert);
          this.maze[this.posToWall(horiz)][this.posToSpace(gapPosition)] = [];
        }
    
        if(gaps[1]) {
          let gapPosition = this.rand(vert+1, c2+1);
          this.maze[this.posToWall(horiz)][this.posToSpace(gapPosition)] = [];
        }
    
        if(gaps[2]) {
          let gapPosition = this.rand(r1, horiz);
          this.maze[this.posToSpace(gapPosition)][this.posToWall(vert)] = [];
        }
    
        if(gaps[3]) {
          let gapPosition = this.rand(horiz+1, r2+1);
          this.maze[this.posToSpace(gapPosition)][this.posToWall(vert)] = [];
        }
    
        // recursively partition newly created chambers
    
        this.partition(r1, horiz-1, c1, vert-1);
        this.partition(horiz+1, r2, c1, vert-1);
        this.partition(r1, horiz-1, vert+1, c2);
        this.partition(horiz+1, r2, vert+1, c2);
    
      }
    
      isGap(...cells) {
        return cells.every((array) => {
          let row, col;
          [row, col] = array;
          if(this.maze[row][col].length > 0) {
            if(!this.maze[row][col].includes("door")) {
              return false;
            }
          }
          return true;
        });
      }
    
      countSteps(array, r, c, val, stop) {
    
        if(!this.inBounds(r, c)) {
          return false; // out of bounds
        }
    
        if(array[r][c] <= val) {
          return false; // shorter route already mapped
        }
    
        if(!this.isGap([r, c])) {
          return false; // not traversable
        }
    
        array[r][c] = val;
    
        if(this.maze[r][c].includes(stop)) {
          return true; // reached destination
        }
    
        this.countSteps(array, r-1, c, val+1, stop);
        this.countSteps(array, r, c+1, val+1, stop);
        this.countSteps(array, r+1, c, val+1, stop);
        this.countSteps(array, r, c-1, val+1, stop);
    
      }
    
      getKeyLocation() {
    
        let fromEntrance = this.initArray();
        let fromExit = this.initArray();
    
        this.totalSteps = -1;
    
        for(let j = 1; j < this.cols-1; j++) {
          if(this.maze[this.rows-1][j].includes("entrance")) {
            this.countSteps(fromEntrance, this.rows-1, j, 0, "exit");
          }
          if(this.maze[0][j].includes("exit")) {
            this.countSteps(fromExit, 0, j, 0, "entrance");
          }
        }
    
        let fc = -1, fr = -1;
    
        this.maze.forEach((row, r) => {
          row.forEach((cell, c) => {
            if(typeof fromEntrance[r][c] == "undefined") {
              return;
            }
            let stepCount = fromEntrance[r][c] + fromExit[r][c];
            if(stepCount > this.totalSteps) {
              fr = r;
              fc = c;
              this.totalSteps = stepCount;
            }
          });
        });
    
        return [fr, fc];
      }
    }
    
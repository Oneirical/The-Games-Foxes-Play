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

  function mode(arr){
    let counts = arr.reduce((a, c) => {
      a[c] = (a[c] || 0) + 1;
      return a;
    }, {});
    let maxCount = Math.max(...Object.values(counts));
    let mostFrequent = Object.keys(counts).filter(k => counts[k] === maxCount);
    
    return (mostFrequent);
  }

function lose(val,red){
    val = Math.max(0,val-red);
    return val;
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

function allInArray(objective, test){
    return objective.every(i => test.includes(i));
  }

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
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

function between(x, min, max) {
    return x > min && x < max;
}

function betweenIncl(x, min, max) {
  return x >= min && x <= max;
}

function approxEqual(x,target,error){
  return between(x,target-error,target+error);
}

function setCharAt(str,index,chr) {
  if(index > str.length-1) return str;
  return str.substring(0,index) + chr + str.substring(index+1);
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

function last(n){
  return n[n.length-1];
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
console.log("Start");

setTimeout(() => console.log("Timer 1"), 0);
setTimeout(() => console.log("Timer 2"), 0);

setImmediate(() => console.log("Immediate 1"));
setImmediate(() => console.log("Immediate 2"));

process.nextTick(() => console.log("Next Tick 1"));
process.nextTick(() => console.log("Next Tick 2"));

Promise.resolve().then(() => console.log("Promise 1"));
Promise.resolve().then(() => console.log("Promise 2"));

console.log("End");



/*expected outcome: 
start
end
next tick 1
next tick 2
promise 1
promise 2
timer 1
timer 2
immediate 1
immediate 2
*/

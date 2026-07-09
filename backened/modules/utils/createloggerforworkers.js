export function createloggerforworkers(name){
return (...args) => console.log(`[${name}]`, new Date().toISOString(), ...args);
}
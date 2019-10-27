/*
Game.creeps.Isabella.signController(Game.creeps.Isabella.room.controller,"This is Pimaco's training room. We are a friendly colony :)")
Game.creeps.Isabella.moveTo(11,11)
Game.profiler.profile(30)
Game.creeps.Nathaniel.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
Game.rooms['W61N28'].find(FIND_HOSTILE_CREEPS);
Game.creeps.Michael.claimController(Game.creeps.Michael.room.controller)

Game.spawns.Spawn1.createCreep([MOVE,MOVE,MOVE,CLAIM], undefined, {role: 'temp', home: Game.rooms['W67N29']});
Game.creeps.Kayla.memory.home = Game.rooms['W67N29']

for(var x=0; x < Game.gcl.level; x++){console.log(Memory.myRooms[x].controller.progress);}

W67N29 KEANIUM
W59N31 LEMERGIUM
W59N27 ZYNTHIUM
W61N29 OXYGEN 
W56N27 KEANIUM
W55N29 CATALYST
W55N27 OXYGEN (NOT EXPLOITED)
W68N27 HYDROGEN
W62N27 UTRIUM
W59N29 ZYNTHIUM
W67N27 ZYNTHIUM (NOT EXPLOITED)
W66N31 LEMERGIUM
W65N28 KEANIUM
W63N29 OXYGEN
W63N28 ZYNTHIUM
W63N26 CATALYST
W61N28 HYDROGEN
W57N27 OXYGEN (NOT EXPLOITED)
W68N26 KEANIUM (NOT EXPLOITED)

console.log((Game.market.getHistory(RESOURCE_KEANIUM)[13].avgPrice - Game.market.getHistory(RESOURCE_KEANIUM)[13].stddevPrice).toFixed(3));
console.log((Game.market.getHistory(RESOURCE_LEMERGIUM)[13].avgPrice - Game.market.getHistory(RESOURCE_LEMERGIUM)[13].stddevPrice).toFixed(3));
console.log((Game.market.getHistory(RESOURCE_ZYNTHIUM)[13].avgPrice - Game.market.getHistory(RESOURCE_ZYNTHIUM)[13].stddevPrice).toFixed(3));
console.log((Game.market.getHistory(RESOURCE_OXYGEN)[13].avgPrice - Game.market.getHistory(RESOURCE_OXYGEN)[13].stddevPrice).toFixed(3));
console.log((Game.market.getHistory(RESOURCE_KEANIUM)[13].avgPrice - Game.market.getHistory(RESOURCE_KEANIUM)[13].stddevPrice).toFixed(3));
console.log((Game.market.getHistory(RESOURCE_CATALYST)[13].avgPrice - Game.market.getHistory(RESOURCE_CATALYST)[13].stddevPrice).toFixed(3));
console.log((Game.market.getHistory(RESOURCE_HYDROGEN)[13].avgPrice - Game.market.getHistory(RESOURCE_HYDROGEN)[13].stddevPrice).toFixed(3));
console.log((Game.market.getHistory(RESOURCE_UTRIUM)[13].avgPrice - Game.market.getHistory(RESOURCE_UTRIUM)[13].stddevPrice).toFixed(3));
console.log((Game.market.getHistory(RESOURCE_ZYNTHIUM)[13].avgPrice - Game.market.getHistory(RESOURCE_ZYNTHIUM)[13].stddevPrice).toFixed(3));
console.log((Game.market.getHistory(RESOURCE_LEMERGIUM)[13].avgPrice - Game.market.getHistory(RESOURCE_LEMERGIUM)[13].stddevPrice).toFixed(3));
console.log((Game.market.getHistory(RESOURCE_KEANIUM)[13].avgPrice - Game.market.getHistory(RESOURCE_KEANIUM)[13].stddevPrice).toFixed(3));
console.log((Game.market.getHistory(RESOURCE_OXYGEN)[13].avgPrice - Game.market.getHistory(RESOURCE_OXYGEN)[13].stddevPrice).toFixed(3));
console.log((Game.market.getHistory(RESOURCE_ZYNTHIUM)[13].avgPrice - Game.market.getHistory(RESOURCE_ZYNTHIUM)[13].stddevPrice).toFixed(3));
console.log((Game.market.getHistory(RESOURCE_CATALYST)[13].avgPrice - Game.market.getHistory(RESOURCE_CATALYST)[13].stddevPrice).toFixed(3));
console.log((Game.market.getHistory(RESOURCE_HYDROGEN)[13].avgPrice - Game.market.getHistory(RESOURCE_HYDROGEN)[13].stddevPrice).toFixed(3));


(Game.market.getHistory(RESOURCE_KEANIUM)[13].avgPrice - Game.market.getHistory(RESOURCE_KEANIUM)[13].stddevPrice).toFixed(3))

*/
module.exports = {

};
/*
Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_KEANIUM,
    price: 0.044,
    totalAmount: 400000,
    roomName: 'W67N29'
    });

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_LEMERGIUM,
    price: 0.070,
    totalAmount: 400000,
    roomName: 'W59N31'
    });    

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_ZYNTHIUM,
    price: 0.026,
    totalAmount: 400000,
    roomName: 'W59N27'
    });

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_OXYGEN,
    price: 0.036,
    totalAmount: 400000,
    roomName: 'W61N29'
    });  

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_KEANIUM,
    price: 0.044,
    totalAmount: 400000,
    roomName: 'W56N27'
    });

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_CATALYST,
    price: 0.086,
    totalAmount: 400000,
    roomName: 'W55N29'
    });       

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_HYDROGEN,
    price: 0.028,
    totalAmount: 400000,
    roomName: 'W68N27'
    });

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_UTRIUM,
    price: 0.049,
    totalAmount: 400000,
    roomName: 'W62N27'
    });     

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_ZYNTHIUM,
    price: 0.026,
    totalAmount: 400000,
    roomName: 'W59N29'
    });

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_LEMERGIUM,
    price: 0.070,
    totalAmount: 400000,
    roomName: 'W66N31'
    });    

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_KEANIUM,
    price: 0.044,
    totalAmount: 400000,
    roomName: 'W65N28'
    });

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_OXYGEN,
    price: 0.036,
    totalAmount: 400000,
    roomName: 'W63N29'
    });             

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_ZYNTHIUM,
    price: 0.026,
    totalAmount: 400000,
    roomName: 'W63N28'
    });

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_CATALYST,
    price: 0.086,
    totalAmount: 400000,
    roomName: 'W63N26'
    });  

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_HYDROGEN,
    price: 0.028,
    totalAmount: 400000,
    roomName: 'W61N28'
    });  */
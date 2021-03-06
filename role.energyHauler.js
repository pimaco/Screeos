module.exports = function (creep) {
    creep.room.find(FIND_DROPPED_RESOURCES).forEach(function(res) {
        //var creep = res.findClosestCarrier();
        creep.pickup(res);
        });
    if (_.sum(creep.carry) == 0) {
        // switch state to collecting
        if (creep.memory.working == true) {
            delete creep.memory._move;
        }
        creep.memory.working = false;
    }
    else if (_.sum(creep.carry) == creep.carryCapacity || (creep.room.name == creep.memory.home.name && _.sum(creep.carry) > 0)) {
        // creep is collecting energy but is full
        if (creep.memory.working == false) {
            delete creep.memory._move;
        }
        creep.memory.working = true;
    }
    if (creep.memory.working == true) {
        // creep is supposed to transfer energy to a structure
        // Find construction sites
        var constructionSites = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 5);
        if (constructionSites.length > 0 && creep.room.name != creep.memory.home.name) {
            // Construction sites found, build them!
            let site = creep.pos.findClosestByPath(constructionSites);
            if (creep.build(site) == ERR_NOT_IN_RANGE) {
                creep.travelTo(site);
            }
        }
        else {
            // Move to structure
            var road = creep.pos.lookFor(LOOK_STRUCTURES);
            if (creep.room.controller != undefined && (creep.room.controller.owner == undefined || creep.room.controller.owner.username != Game.rooms[creep.memory.home.name].controller.owner.username ) && road[0] != undefined && road[0].hits < road[0].hitsMax && road[0].structureType == STRUCTURE_ROAD && creep.room.name != creep.memory.home) {
                // Found road to repair
                if (creep.getActiveBodyparts(WORK) > 0) {
                    creep.repair(road[0]);
                }
                else {
                    var spawn = Game.getObjectById(creep.memory.spawn);
                    creep.travelTo(spawn);
                }
            }
            else {
                if (creep.room.name != creep.memory.home.name) {
                    // Find exit to spawn room
                    creep.travelTo(Game.rooms[creep.memory.home.name].controller);
                    //creep.useFlowPathTo(Game.getObjectById(creep.memory.spawn).pos);
                }
                else {
                    // back in spawn room
                    var structure;
                    if (_.sum(creep.carry) == creep.carry[RESOURCE_ENERGY]) {
                        //Creep has only energy loaded
                        structure = creep.room.storage;//RESOURCE_SPACE, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_LINK, STRUCTURE_CONTAINER, STRUCTURE_EXTENSION);
                    }
                    else {
                        //Creep has minerals loaded
                        structure = creep.room.storage;
                    }

                    // if we found one
                    if (structure != null) {
                        // try to transfer energy, if it is not in range
                        for (let c in creep.carry) {
                            if (creep.transfer(structure, c) == ERR_NOT_IN_RANGE) {
                                // move towards it
                                creep.travelTo(structure);
                            }
                        }
                    }
                    else {
                        creep.say("No Structure!");
                    }
                }
            }
        }
    }
    // if creep is supposed to harvest energy from source
    else {
        //Find remote source.
        //console.log(creep.pos);
       if(creep.memory.currentFlag.room && Game.rooms[creep.memory.currentFlag.room.name])
        {
            var flagRoom = creep.memory.currentFlag.room.name;
            
            var enerSource = Game.rooms[flagRoom].find(FIND_SOURCES);
            var remoteSource = creep.memory.currentFlag;
            if (enerSource != undefined) {
                // Find exit to target room
                if (creep.room.name != enerSource[0].pos.roomName) {
                    //still in old room, go out
                    creep.travelTo(enerSource[0]);
                }
                else {
                    //new room reached, start collecting
                    if (!creep.room.memory.hostiles || creep.room.memory.hostiles.length == 0) {
                        
                        var container = Game.rooms[flagRoom].find(FIND_STRUCTURES, {
                            filter: function(object)
                            {
                                return object.structureType === STRUCTURE_CONTAINER;
                            } });
                        
                        if (container.length > 0) {
                            for (var k = 0, len = container.length; k < len; k++)
                            {
                                if(_.sum(container[k].store) > 0)
                                {
                                    for (let s in container[k].store) {
                                        if (creep.withdraw(container[k], s) == ERR_NOT_IN_RANGE) {
                                            creep.travelTo(container[k]);
                                            //creep.useFlowPathTo(container[0].pos);
                                        }
                                    }
                                    
                                }
                                else
                                {
                                    creep.travelTo(container[0]);
                                }
                            }
                        }
                        else 
                        {
                            creep.travelTo(enerSource[0]);
                        }
                    }
                    else {
                        //Hostiles creeps in new room
                        creep.memory.fleeing = true;
                        creep.travelTo(Game.rooms[creep.memory.home.name].controller);
                    }
                }
            }
        }
    }
};
module.exports = function (creep) {
    if (!creep.memory.currentFlag || creep.memory.statusHarvesting == undefined || creep.memory.statusHarvesting == false || creep.carry.energy == creep.carryCapacity || Game.time % 8 == 0) {
        if (!creep.memory.currentFlag || creep.memory.currentFlag == undefined ) {
            creep.memory.currentFlag = Game.flags.haulEnergy4;
        }

        if (creep.memory.currentFlag == undefined) {
            console.log(creep.name + " has no sources to stationary harvest in room " + creep.room.name + ".");
        }
        else if (!creep.room.memory.hostiles || creep.room.memory.hostiles.length == 0) {
            var flag = Game.flags.haulEnergy4;
            var sourceKeeper = [];

            if (flag != undefined) {
                if (flag.pos.roomName != creep.room.name) {
                    // Creep not in assigned room
                    creep.travelTo(flag);
                }
                else if (creep.pos.isEqualTo(flag) == true) {
                    // Harvesting position reached
                    if (creep.carry.energy > 0 && sourceKeeper.length == 0) {
                        //Identify and save container
                        var buildRoad = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3, {filter: (s) => s.structureType == STRUCTURE_ROAD});
                        var buildContainers = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});
                        var repairContainers = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.hits < s.hitsMax});
                        if (buildContainers.length > 0) {
                            creep.build(buildContainers[0]);
                        }
                        else if (repairContainers.length > 0) {
                            creep.repair(repairContainers[0]);
                        }
                        else if (buildRoad.length > 0) {
                            creep.build(buildRoad[0]);
                        }
                        else {
                            if (creep.memory.container == undefined) {
                                var container;
                                var containers = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.storeCapacity - _.sum(s.store) > 0) || (s.structureType == STRUCTURE_LINK && s.energyCapacity - s.energy) > 0});
                                if (containers.length > 0) {
                                    creep.memory.container = containers[0].id;
                                    container = containers[0];
                                }
                            }
                            else {
                                container = Game.getObjectById(creep.memory.container);
                            }

                            if (creep.transfer(container, RESOURCE_ENERGY) != OK) {
                                if(creep.transfer(container, RESOURCE_ENERGY) == ERR_FULL)
                                {
                                    creep.drop(RESOURCE_ENERGY);
                                }
                                else
                                {
                                    delete creep.memory.container;
                                    containers = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: (s) => (s.structureType == STRUCTURE_CONTAINER)});
                                    var constructionSites =  creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {filter: (s) => (s.structureType == STRUCTURE_CONTAINER)});
                                    if (containers.length == 0 && constructionSites.length == 0 && creep.pos.isEqualTo(flag) == true) {
                                        creep.pos.createConstructionSite(STRUCTURE_CONTAINER);
                                    }
                                }
                            }
                        }
                    }
                    else if (creep.carry.energy < creep.carryCapacity) {
                        //Time to refill
                        //Identify and save source
                        if (creep.memory.source == undefined) {
                            var source = creep.pos.findClosestByRange(FIND_SOURCES);
                            creep.memory.source = source.id;
                        }
                        else {
                            var source = Game.getObjectById(creep.memory.source);
                        }
                        if (source == undefined) {
                            delete creep.memory.source;
                        }
                        else if (source.energy == 0) {
                            creep.memory.sleep = source.ticksToRegeneration;
                        }
                        else {
                            if (creep.harvest(source) != OK) {
                                creep.memory.statusHarvesting = false;
                                delete creep.memory.source;
                            }
                            else {
                                creep.memory.statusHarvesting = source.id;
                            }
                        }
                    }
                }
                else if (sourceKeeper.length == 0) {
                    // Move to harvesting point
                    creep.travelTo(flag);
                    //creep.useFlowPathTo(flag.pos);
                }
            }
            else {
                console.log(creep.name + " in room " + creep.room.name + " has a problem.");
            }
        }
        else {
            // Hostiles present
            creep.memory.fleeing = true;
            creep.travelTo(Game.rooms[creep.memory.home.name].controller);
        }
    }
    else {
        // Creep is harvesting, try to keep harvesting
        var source = Game.getObjectById(creep.memory.statusHarvesting);
        if (creep.harvest(source) != OK || creep.carry.energy == creep.carryCapacity) {
            creep.memory.statusHarvesting = false;
        }
    }
};
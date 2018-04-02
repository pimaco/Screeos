module.exports = function (creep) {
    // Find exit to target room
    var remoteControllerFlag;
    if (creep.memory.currentFlag == undefined) {
        remoteControllerFlag = Game.flags.remoteController6;
    }
    else {
        remoteControllerFlag = Game.flags[creep.memory.currentFlag];
    }
    if (remoteControllerFlag != undefined) {
        creep.memory.currentFlag = remoteControllerFlag.name;
    }
    if (remoteControllerFlag != undefined && creep.room.name != remoteControllerFlag.pos.roomName) {
        //still in wrong room, go out
        creep.travelTo(remoteControllerFlag);
    }
    else if (remoteControllerFlag != undefined) {
        //new room reached, start reserving / claiming
        var returncode;

        if (!creep.room.memory.hostiles || creep.room.memory.hostiles.length == 0) {
            // try to claim the controller
            if (creep.room.controller.owner == undefined) {
                if (remoteControllerFlag.memory.claim == 1) {
                    returncode = creep.claimController(creep.room.controller);
                }
                else {
                    returncode = creep.reserveController(creep.room.controller);
                }
            }
            else {
                creep.travelTo(creep.room.controller);
            }

            if (returncode == ERR_NOT_IN_RANGE) {
                creep.travelTo(creep.room.controller);
            }

            if (creep.room.controller.owner != undefined && creep.room.controller.owner.username == playerUsername) {
                //Roomed successfully claimed, now build spawn and remove spawns and extensions from previous owner
                let spawns = creep.room.find(FIND_MY_SPAWNS).length;
                if (spawns == 0) {

                    var spawnConstructionsites = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN)}).length;
                    if (spawnConstructionsites == 0) {
                        remoteControllerFlag.pos.createConstructionSite(STRUCTURE_SPAWN);
                    }
                }

                let oldBuildings = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION});
                for (var b in oldBuildings) {
                    if (oldBuildings[b].isActive() == false) {
                        oldBuildings[b].destroy();
                    }
                }
            }
        }
        else {
            //Hostiles creeps in new room
            creep.memory.fleeing = true;
            creep.goToHomeRoom()
        }
    }
};
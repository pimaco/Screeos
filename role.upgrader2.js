var roleUpgrader2 = {
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {   
        if(creep.pos.roomName != creep.memory.home.name)
        {
            creep.moveTo(Game.rooms[creep.memory.home.name].controller);
        }
        else
        {
            if(((creep.carry.energy < creep.carryCapacity) && (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)) || creep.carry.energy == 0  ) 
            {
                var containers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object)
                {
                    return object.structureType === STRUCTURE_CONTAINER;
                } 
                
            });
                
            /* if(containers.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) 
                {
                    creep.moveTo(containers);
                }
                else*/ 
                if((_.sum(creep.room.storage.store) > 1000) && (creep.room.storage.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE))
                {
                    creep.moveTo(creep.room.storage);
                }
            }
            else
            {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
	}
};

module.exports = roleUpgrader2;
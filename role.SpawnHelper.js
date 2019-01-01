var roleSpawnHelper = {

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if(creep.pos.roomName != creep.memory.home.name)
        {
            creep.moveTo(Game.rooms[creep.memory.home.name].controller);
        }
        else
        {
            creep.room.find(FIND_DROPPED_RESOURCES,{filter: function(object){ return object.resourceType == RESOURCE_ENERGY}}).forEach(function(res) {
                //var creep = res.findClosestCarrier();
                creep.pickup(res);
            });

            var SR = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object)
                {
                    return object.structureType === STRUCTURE_EXTENSION && (object.energy < object.energyCapacity);
                } 
            });
            
            var towers = creep.room.find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            
            var SpawnInRoom = creep.room.find(FIND_STRUCTURES, {
            filter: function(object)
                {
                    return object.structureType === STRUCTURE_SPAWN;
                } 
            });
                
            if(creep.room.storage)
            {
                var totalS = (creep.room.storage.store[RESOURCE_ENERGY] );
            }
            else
            {
                var totalS = 0;
            }    

            if(creep.carry.energy > 0)
            {
                    //console.log(creep.name + '  ' + towers);
                
               //console.log(creep.name + '   ' + SpawnInRoom[0].energy);
                if(SpawnInRoom[0].energy <SpawnInRoom[0].energyCapacity ) 
                {
                    if(creep.transfer(SpawnInRoom[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(SpawnInRoom[0]);
                    }
                }
                else if(SpawnInRoom.length > 1 && SpawnInRoom[1].energy < SpawnInRoom[1].energyCapacity ) 
                {
                    if(creep.transfer(SpawnInRoom[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(SpawnInRoom[1]);
                    }
                }
                else if(SpawnInRoom.length > 2 && SpawnInRoom[2].energy < SpawnInRoom[2].energyCapacity ) 
                {
                    if(creep.transfer(SpawnInRoom[2], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(SpawnInRoom[2]);
                    }
                }
                else if(SR)
                {
                    creep.moveTo(SR);
                    creep.transfer(SR, RESOURCE_ENERGY);
                }
                else if(towers.length > 0)
                {
                    for (var k = 0, len = towers.length; k < len; k++)
                    {        
                        if(towers[k].energy < towers[k].energyCapacity)
                        {
                            creep.moveTo(towers[k]);
                            creep.transfer(towers[k], RESOURCE_ENERGY);
                        }
                    }
                }
                else
                {
                    creep.moveTo(SpawnInRoom[0]);
                }
            }
            else if(creep.carry.energy < creep.carryCapacity )//&& (creep.carry.energy != 50) ) 
            {
                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: function(object)
                    {
                        return object.structureType === STRUCTURE_CONTAINER;
                    } });
                 //console.log(containers);
                if(creep.room.storage && totalS > 300 )
                {
                    if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(creep.room.storage);
                    }
                }    
                else if(containers.length > 0)
                {
                    
                    for (var i = 0, len = containers.length; i < len; i++)
                    {        
                        var total = _.sum(containers[i].store);
                        
                        if(creep.withdraw(containers[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && (total > 100) ) 
                        {
                            creep.moveTo(containers[i]);
                        }
                    }
                }
            }
        } 
	}
};
module.exports = roleSpawnHelper;
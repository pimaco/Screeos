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
                creep.room.find(FIND_DROPPED_RESOURCES).forEach(function(res) {
                    //var creep = res.findClosestCarrier();
                    creep.pickup(res);
                });
                    //console.log(creep.name + '  ' + towers);
                
               //console.log(creep.name + '   ' + SpawnInRoom[0].energy);
                if(SpawnInRoom[0].energy <SpawnInRoom[0].energyCapacity ) 
                {
                    if(creep.transfer(SpawnInRoom[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(SpawnInRoom[0]);
                    }
                }
                else if(SR)
                {
                    creep.moveTo(SR);
                    creep.transfer(SR, RESOURCE_ENERGY);
                }
                else if(towers.length > 0)
                {
                    if(towers.length == 1)
                    {
                        if(towers[0].energy < towers[0].energyCapacity)
                        {
                            creep.moveTo(towers[0]);
                            creep.transfer(towers[0], RESOURCE_ENERGY);
                        }
                    }
                    else if(towers.length == 2)
                    {
                        if(towers[0].energy < towers[0].energyCapacity)
                        {
                            creep.moveTo(towers[0]);
                            creep.transfer(towers[0], RESOURCE_ENERGY);
                        }
                        else if(towers[1].energy < towers[1].energyCapacity)
                        {
                            creep.moveTo(towers[1]);
                            creep.transfer(towers[1], RESOURCE_ENERGY);
                        }
                    }
                    else if(towers.length == 3)
                    {
                        if((towers[0].energy < towers[0].energyCapacity) || (towers[1].energy < towers[1].energyCapacity) || (towers[2].energy < towers[2].energyCapacity))
                        {
                            
                            if(towers[0].energy < towers[0].energyCapacity)
                            {
                                creep.moveTo(towers[0]);
                                creep.transfer(towers[0], RESOURCE_ENERGY);
                            }
                            else if(towers[1].energy < towers[1].energyCapacity)
                            {
                                creep.moveTo(towers[1]);
                                creep.transfer(towers[1], RESOURCE_ENERGY);
                            }
                            else if(towers[2].energy < towers[2].energyCapacity)
                            {
                                creep.moveTo(towers[2]);
                                creep.transfer(towers[2], RESOURCE_ENERGY);
                            }
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
                creep.room.find(FIND_DROPPED_RESOURCES).forEach(function(res) {
                    //var creep = res.findClosestCarrier();
                    creep.pickup(res);
                    });
                 //console.log(containers);
                if(creep.room.storage && totalS > 1500 )
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
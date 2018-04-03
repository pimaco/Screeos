var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        

        if(creep.pos.roomName != creep.memory.home.name)
        {
            creep.travelTo(Game.rooms[creep.memory.home.name].controller);
        }
        else
        {
            var SR = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object)
                {
                    return object.structureType === STRUCTURE_EXTENSION && (object.energy < object.energyCapacity);
                } 
            });
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

            if(creep.memory.Harvest && creep.carry.energy == 0) 
            {
                creep.memory.Harvest = false;
            }
            //            if(((creep.carry.energy < creep.carryCapacity) && (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)) || (creep.carry.energy == 0 && !creep.memory.Harvest )  ) 
            if((creep.carry.energy < creep.carryCapacity && creep.memory.harvest) || (creep.carry.energy == 0 && !creep.memory.Harvest )  ) 
            {   
                creep.room.find(FIND_DROPPED_RESOURCES).forEach(function(res) {
                    //var creep = res.findClosestCarrier();
                    creep.pickup(res);
                    });
                var sources = creep.room.find(FIND_SOURCES);
                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: function(object)
                    {
                        return object.structureType === STRUCTURE_CONTAINER;
                    } });
                // console.log(containers);
                if(creep.room.storage && totalS > 100)  
                { 
                    if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.travelTo(creep.room.storage);
                    }
                }
                else if(containers.length)
                {
                    
                    for (var i = 0, len = containers.length; i < len; i++)
                    {        
                        var total = _.sum(containers[i].store);
                        
                        if(creep.withdraw(containers[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && (total > 50) ) 
                        {
                            creep.travelTo(containers[i]);
                        }
                        else if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
                        {
                            creep.travelTo(sources[0]);
                        }
                        else
                        {
                            creep.memory.Harvest = true;
                        }
                    }
                }
            /* if(creep.room.storage.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.travelTo(creep.room.storage);
                }
                */
                else if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
                {
                    creep.travelTo(sources[0]);
                }
                else
                {
                    creep.memory.Harvest = true;
                }
            
            }
            else if (creep.memory.Harvest && creep.carry.energy < creep.carryCapacity)
            {
                var source = creep.pos.findClosestByRange(FIND_SOURCES);
                creep.harvest(source);
            }
        /* else if(towers[0].energy < towers[0].energyCapacity || towers[1].energy < towers[1].energyCapacity)
            {
                
                if(towers[0].energy < towers[0].energyCapacity)
                {
                    creep.travelTo(towers[0]);
                    creep.transfer(towers[0], RESOURCE_ENERGY);
                }
                else if(towers[1].energy < towers[1].energyCapacity)
                {
                    creep.travelTo(towers[1]);
                    creep.transfer(towers[1], RESOURCE_ENERGY);
                }
            } */   
            else if(SpawnInRoom[0] && SpawnInRoom[0].energy < SpawnInRoom[0].energyCapacity ) 
            {
                creep.memory.Harvest = false;
                if(creep.transfer(SpawnInRoom[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.travelTo(SpawnInRoom[0]);
                }
            }
            else if(SR)
            {
                creep.memory.Harvest = false;
                creep.travelTo(SR);
                creep.transfer(SR, RESOURCE_ENERGY);
            }
            else
            {
                creep.memory.Harvest = false;
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) 
                {
                    creep.travelTo(creep.room.controller);
                }
            }
        }
	}
};

module.exports = roleHarvester;
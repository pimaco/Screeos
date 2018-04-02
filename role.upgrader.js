
 var roleUpgrader = {
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if(creep.pos.roomName != creep.memory.home.name)
        {
            creep.travelTo(Game.rooms[creep.memory.home.name].controller);
        }
        else
        {
            if(((creep.carry.energy < creep.carryCapacity) && (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)) || creep.carry.energy == 0  ) 
            {
                var sources = creep.room.find(FIND_SOURCES);

                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: function(object)
                    {
                        return object.structureType === STRUCTURE_CONTAINER;
                    } });
                // console.log(containers);
                if(Game.spawns.Spawn1.energy > 1000 && creep.harvest(sources[0]) == ERR_NOT_IN_RANGE )
                {
                    creep.room.find(FIND_DROPPED_RESOURCES).forEach(function(res) {
                        //var creep = res.findClosestCarrier();
                        creep.pickup(res);
                    });

                    var spwn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
                    creep.travelTo(spwn);
                    spwn.transferEnergy(creep);
                }   
                else if(containers.length > 0)
                {
                    creep.room.find(FIND_DROPPED_RESOURCES).forEach(function(res) {
                        //var creep = res.findClosestCarrier();
                        creep.pickup(res);
                    });
                    
                    for (var i = 0, len = containers.length; i < len; i++)
                    {        
                        var total = _.sum(containers[i].store);
                        
                        if(creep.withdraw(containers[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && (total > 100) ) 
                        {
                            creep.travelTo(containers[i]);
                        }
                        else
                        {
                            creep.room.find(FIND_DROPPED_RESOURCES).forEach(function(res) {
                                //var creep = res.findClosestCarrier();
                                creep.pickup(res);
                            });
                            if(creep.room.storage)
                            {
                                if((_.sum(creep.room.storage.store) > 4000) && (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE))
                                {
                                    creep.travelTo(creep.room.storage);
                                }
                                else if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
                                {
                                    creep.travelTo(sources[0]);
                                }
                            }
                            else if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
                            {
                                creep.travelTo(sources[0]);
                            }
                        }    

                    }
                }
                else
                {
                    creep.room.find(FIND_DROPPED_RESOURCES).forEach(function(res) {
                        //var creep = res.findClosestCarrier();
                        creep.pickup(res);
                    });
                    if(creep.room.storage)
                    {
                        if((_.sum(creep.room.storage.store) > 5000) && (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE))
                        {
                            creep.travelTo(creep.room.storage);
                        }
                        else if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
                        {
                            creep.travelTo(sources[0]);
                        }
                    }
                }    
            }
            else
            {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) 
                {
                    creep.travelTo(creep.room.controller);
                }
            }
        }
	}
};

module.exports = roleUpgrader;
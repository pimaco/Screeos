
 var roleUpgrader = {
    
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

            if(creep.room.storage)
            {
                var totalS = (creep.room.storage.store[RESOURCE_ENERGY] );
            }
            else
            {
                var totalS = 0;
            }   
            
            if(creep.pos.roomName == ScienceEnabled)
            {
                var lab = scienceLabs[9];
            }
            else
            {
                var lab = creep.room.find(FIND_STRUCTURES, {
                    filter: function(object)
                    {
                        return object.structureType === STRUCTURE_LAB;
                    } });
                if(lab.length > 0)
                {
                    lab = lab[0];  
                }
            }
            
            if(((creep.carry.energy < creep.carryCapacity) && (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)) || creep.carry.energy == 0  ) 
            {
                var sources = creep.room.find(FIND_SOURCES);

                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: function(object)
                    {
                        return object.structureType === STRUCTURE_CONTAINER;
                    } });
                // console.log(containers);
                if(containers.length > 0 && totalS < 200)
                {   
                    for (var i = 0, len = containers.length; i < len; i++)
                    {        
                        var total = _.sum(containers[i].store);
                        
                        if(creep.withdraw(containers[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && (total > 100) ) 
                        {
                            creep.moveTo(containers[i]);
                        }
                        else
                        {
                            var nearlink = creep.pos.findInRange(FIND_STRUCTURES, 2,{
                                filter: function(object)
                                {
                                    return object.structureType === STRUCTURE_LINK;
                                } 
                            });
                            if(nearlink && nearlink.length > 0 && nearlink[0].energy >= 100 )
                            {
                                if(creep.withdraw(nearlink[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                                {
                                    creep.moveTo(nearlink[0]);   
                                }
                            }
                            else if(creep.room.storage)
                            {
                                if((_.sum(creep.room.storage.store) > 4000) && (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE))
                                {
                                    creep.moveTo(creep.room.storage);
                                }
                                else if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
                                {
                                    creep.moveTo(sources[0]);
                                }
                            }
                            else if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
                            {
                                creep.moveTo(sources[0]);
                            }
                        }    
                    }
                }
                else
                {
                    var nearlink = creep.pos.findInRange(FIND_STRUCTURES, 2,{
                        filter: function(object)
                        {
                            return object.structureType === STRUCTURE_LINK;
                        } 
                    });
                    if(nearlink && nearlink.length > 0 && nearlink[0].energy >= 100 )
                    {
                        if(creep.withdraw(nearlink[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(nearlink[0]);   
                        }
                    }
                    else if(creep.room.storage)
                    {
                        if(_.sum(creep.room.storage.store) > 1000)
                        {
                            if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                            {
                                creep.moveTo(creep.room.storage);
                            }
                            else
                            {
                                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                            }
                        }
                        else if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
                        {
                            creep.moveTo(sources[0]);
                        }
                    }
                }    
            }
            else if(lab && lab != "")
            {
                var workBody = _.filter(creep.body, function(bp){return bp.type == WORK;});

                if(workBody != '' && !workBody[0].boost && lab && lab != "" && lab.mineralType == RESOURCE_GHODIUM_HYDRIDE && (lab.mineralAmount >= (workBody.length * 30 )) && (lab.energy >= (workBody.length * 20)))
                {
                    creep.travelTo(lab);

                    var screepsAtLab = lab.pos.findInRange(FIND_CREEPS, 1, {
                        filter: function(object)
                        {
                            return object.memory.role === 'upgrader';
                        } 
                    });
                    if(screepsAtLab && screepsAtLab.length > 0)
                    {
                        lab.boostCreep(screepsAtLab[0]);
                    }  
                }
                else
                {
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(creep.room.controller);
                    }
                    creep.moveTo(creep.room.controller);
                }
            }
            else
            {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(creep.room.controller);
                }
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;
module.exports = function (creep) {

    if(creep.pos.roomName != creep.memory.home.name)
    {
        creep.moveTo(Game.rooms[creep.memory.home.name].controller);
    }
    else
    {
        var sources = creep.room.find(FIND_SOURCES);
        var SR = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object)
                {
                    return object.structureType === STRUCTURE_WALL && (object.hits < 10000 );
                } 
            });
        if(!SR || SR == null)
        {
            var SR2 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object)
                {
                    return object.structureType === STRUCTURE_RAMPART && (object.hits < 10000 );
                } 
            });  
        }  
        if((!SR || SR == null ) && !SR2 || SR2 == null)
        {
            var SR = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object)
                {
                    return object.structureType === STRUCTURE_WALL && (object.hits < 50000 );
                } 
            });
            if(!SR || SR == null)
            {
                var SR2 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(object)
                    {
                        return object.structureType === STRUCTURE_RAMPART && (object.hits < 50000 );
                    } 
                }); 
            }
        }    
        if(((creep.carry.energy < creep.carryCapacity) && (((creep.repair(SR) == ERR_NOT_IN_RANGE)  && (creep.repair(SR2) == ERR_NOT_IN_RANGE)) && (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE))) || creep.carry.energy == 0  ) 
        {
       
            if(creep.room.storage && (_.sum(creep.room.storage.store) > 1000) && (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE))
            {
                creep.moveTo(creep.room.storage);
            }
            else if(sources.length > 1)
            {
                var path0 =  creep.pos.findPathTo(sources[0], {maxOps: 1200});
                var path1 =  creep.pos.findPathTo(sources[1], {maxOps: 1200});

                if(path0.length < path1.length && sources[0].energy > 0)
                {
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(sources[0]);
                    }
                }
                else if(sources[1].energy > 0)
                {
                    if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(sources[1]);
                    }
                }
                else
                {
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(sources[0]);
                    }
                }
            }
            else
            {
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(sources[0]);
                }
            }
            
        }
        else
        {
            if(SR2) 
            {
                //console.log(SR2.pos);       
                creep.moveTo(SR2);
                creep.repair(SR2);
            }
            else if(SR)
            {
                creep.moveTo(SR);
                creep.repair(SR);
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
    

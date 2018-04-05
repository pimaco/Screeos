module.exports = function (creep) {
    
    if(creep.pos.roomName != creep.memory.home.name)
    {
        creep.moveTo(Game.rooms[creep.memory.home.name].controller);
    }
    else
    {
        var SR = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(object)
            {
                return object.structureType === STRUCTURE_ROAD && (object.hits < 1000 );
            } 
        });
        var SRMax = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(object)
            {
                return object.structureType === STRUCTURE_ROAD && (object.hits < object.hitsMax );
            } 
        });

        var SR2 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(object)
            {
                return object.structureType === STRUCTURE_CONTAINER && (object.hits < 250000 );
            } 
        });

        if(creep.memory.Harvest && creep.carry.energy == 0) 
        {
            creep.memory.Harvest = false;
        }
        
        if(creep.room.storage)
        {
            var total = (creep.room.storage.store[RESOURCE_ENERGY] );
        }
        else
        {
            var total = 0;
        }
        if(((creep.carry.energy < creep.carryCapacity) && (creep.repair(SR) == ERR_NOT_IN_RANGE) && (creep.repair(SRMax) == ERR_NOT_IN_RANGE) && creep.repair(SR2) == ERR_NOT_IN_RANGE) || (creep.carry.energy == 0 && !creep.memory.Harvest )) 
        {
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: function(object)
                {
                    return object.structureType === STRUCTURE_CONTAINER;
                } });
            // console.log(containers);
            if(creep.room.storage && total > 100 )  
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
                    
                    if(creep.withdraw(containers[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && (total > 50) ) 
                    {
                        creep.moveTo(containers[i]);
                    }
                    else
                    {
                        var source = creep.pos.findClosestByRange(FIND_SOURCES);
                        if(creep.harvest(source) == ERR_NOT_IN_RANGE) 
                        {
                            creep.moveTo(source);
                        }
                        else
                        {
                            creep.memory.Harvest = true;
                        }
                    } 
                }
            }
            else
            {
                var source = creep.pos.findClosestByRange(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(source);
                }
                else
                {
                    creep.memory.Harvest = true;
                }
            } 
        }
        else if (creep.memory.Harvest && creep.carry.energy < creep.carryCapacity)
        {
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
            creep.harvest(source);
        }
        else
        {
            creep.memory.Harvest = false;
            if(SR) 
            {
            // console.log(SR.pos);       
                creep.moveTo(SR);
                creep.repair(SR);
            }
            else if(SR2) 
            {
            // console.log(SR.pos);       
                creep.moveTo(SR2);
                creep.repair(SR2);
            }
            else if(SRMax)
            {
                creep.moveTo(SRMax);
                creep.repair(SRMax);
            }
            else
            {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) 
                {
                    goodtarget = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                    //console.log('Creep: ' + creep + 'going to build ' + goodtarget);
                    if(creep.build(goodtarget) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(goodtarget);
                    }
                }
                else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};
    

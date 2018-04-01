var roleMiner2 = {

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if(creep.pos.roomName != creep.memory.home.name)
        {
            creep.moveTo(Game.rooms[creep.memory.home.name].controller);
        }
        else
        {
            var SR = creep.pos.findInRange(FIND_STRUCTURES, 2,{
                filter: function(object)
                {
                    return object.structureType === STRUCTURE_LINK;
                } 
            });
            //console.log(SR[0] + '  '+ creep.name + '   ' + creep.room);
            var containers = creep.pos.findInRange(FIND_STRUCTURES, 3, 
                {filter: {structureType: STRUCTURE_CONTAINER}});
        
            if(creep.carry.energy < creep.carryCapacity) 
            {
                creep.room.find(FIND_DROPPED_RESOURCES).forEach(function(res) {
                //var creep = res.findClosestCarrier();
                creep.pickup(res);
                });
                
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(sources[0]);
                }
               // console.log(creep.harvest(sources[0]));
            }
            else if(SR.length > 0)
            {
               // console.log(creep.transfer(SR[0], RESOURCE_ENERGY) + '  ' + creep.name + '  ' + creep.room);
                if(creep.transfer(SR[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(SR);  
                    creep.transfer(SR[0], RESOURCE_ENERGY);
                }
            }
            else if (containers.length > 1 && _.sum(containers[0].store) >= 2000)
            {
            // console.log('here');
                //else if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                if(creep.transfer(containers[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(containers[1]);  
                    creep.transfer(containers[1], RESOURCE_ENERGY);
                }
            }
            else if(creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(containers[0]);  
                creep.transfer(containers[0], RESOURCE_ENERGY);
            }
            else 
            {
                var containersClose = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(object)
                    {
                        return object.structureType === STRUCTURE_CONTAINER;
                    } 
                    
                });
                //console.log(containersClose);
                if(creep.transfer(containersClose, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(containersClose);  
                    creep.transfer(containersClose, RESOURCE_ENERGY);
                }      
            }  
        }
	}
};

module.exports = roleMiner2;
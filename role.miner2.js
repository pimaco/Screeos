var roleMiner2 = {

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if(creep.pos.roomName != creep.memory.home.name)
        {
            creep.travelTo(Game.rooms[creep.memory.home.name].controller);
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
                var containersClose = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(object)
                    {
                        return object.structureType === STRUCTURE_CONTAINER;
                    } 
                    
                });

                if(containersClose.store[RESOURCE_ENERGY] > 0)
                {
                    if (creep.withdraw(containersClose, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(containersClose);   
                    }
                    creep.withdraw(containersClose, RESOURCE_ENERGY);
                }
                else
                {
                    creep.room.find(FIND_DROPPED_RESOURCES,{filter: function(object){ return object.resourceType == RESOURCE_ENERGY}}).forEach(function(res) {
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
            
            }
            else if(SR.length > 0)
            {
               // console.log(creep.transfer(SR[0], RESOURCE_ENERGY) + '  ' + creep.name + '  ' + creep.room);
                if(creep.transfer(SR[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.travelTo(SR[0]);  
                    creep.transfer(SR[0], RESOURCE_ENERGY);
                }
                else if(creep.transfer(SR[0], RESOURCE_ENERGY) == ERR_FULL)
                {
                    creep.drop(RESOURCE_ENERGY);
                }
                
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
                    creep.travelTo(containersClose);  
                    creep.transfer(containersClose, RESOURCE_ENERGY);
                } 
                else if(creep.transfer(containersClose, RESOURCE_ENERGY) == ERR_FULL)
                {
                    creep.drop(RESOURCE_ENERGY);
                }     
            }  
        }
	}
};

module.exports = roleMiner2;